import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Ensure required environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

// Clean up any stray quotes Netlify might inject
const cleanSupabaseUrl = SUPABASE_URL.replace(/["']/g, "").trim();
const cleanSupabaseAnonKey = SUPABASE_ANON_KEY.replace(/["']/g, "").trim();

const QIKINK_CLIENT_ID = process.env.QIKINK_CLIENT_ID || "";
const QIKINK_CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET || "";

// Create a helper to generate an authenticated Supabase client for a specific user
function getSupabaseClient(token?: string) {
  const options: any = { auth: { autoRefreshToken: false, persistSession: false } };
  if (token) {
    options.global = { headers: { Authorization: `Bearer ${token}` } };
  }
  return createClient(cleanSupabaseUrl || "https://placeholder.supabase.co", cleanSupabaseAnonKey || "placeholder_key", options);
}

// Default anon client for things like fetching coupons or public products
const supabase = getSupabaseClient();

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID || "",
key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

async function getUserFromAuthHeader(req: express.Request) {
if (!cleanSupabaseUrl || cleanSupabaseUrl.includes("placeholder") || !cleanSupabaseAnonKey || cleanSupabaseAnonKey.includes("placeholder")) {
  return { user: null, token: null, errorReason: `Server Configuration Error: The Supabase API key or URL is missing from the Netlify environment variables.` };
}
const authHeader = req.headers['x-supabase-auth'] as string || req.headers.authorization || req.headers.Authorization as string;
if (!authHeader) return { user: null, token: null, errorReason: "Missing Authorization header" };
const token = authHeader.replace("Bearer ", "").trim();
if (!token) return { user: null, token: null, errorReason: "Empty token" };

// Validate the user's token using the anon key
const { data: { user }, error } = await supabase.auth.getUser(token);
if (error) return { user: null, token: null, errorReason: `Supabase error: ${error.message}` };
if (!user) return { user: null, token: null, errorReason: "User not found in token" };
return { user, token, errorReason: null };
}


export const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Validates coupon against cart items & user
app.post("/api/checkout/validate-coupon", async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body;
    const { user, token, errorReason } = await getUserFromAuthHeader(req);
    
    if (!user || !token) {
      return res.status(401).json({ error: `Please log in to use coupons. Details: ${errorReason}` });
    }

    const userSupabase = getSupabaseClient(token);

    const { data: coupon, error } = await userSupabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('active', true)
      .single();
      
    if (error || !coupon) {
      return res.status(400).json({ error: "Invalid or expired coupon code." });
    }

    // Check min order value
    if (coupon.minimum_order_value && subtotal < coupon.minimum_order_value) {
      return res.status(400).json({ error: `Minimum order value for this coupon is ₹${coupon.minimum_order_value}` });
    }

    // If it's WELCOME60, it's a first-order coupon
    if (coupon.code === 'WELCOME60') {
      const { count } = await userSupabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (count && count > 0) {
        return res.status(400).json({ error: "This coupon is only valid for your first order." });
      }
    }

    let discount = 0;
    if (coupon.discount_type === 'fixed') {
      discount = coupon.discount_value;
    } else if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount_value) / 100);
      if (coupon.maximum_discount && discount > coupon.maximum_discount) {
        discount = coupon.maximum_discount;
      }
    }
    
    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) discount = subtotal;

    res.json({ discount, couponCode: coupon.code });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    res.status(500).json({ error: "Failed to validate coupon" });
  }
});

// Create Order (Prepaid Razorpay OR COD)
app.post("/api/checkout/create-order", async (req, res) => {
  try {
    const { items, customer, couponCode, paymentMethod } = req.body; // items: {variantId, productId, quantity}[]
    
    const { user, token, errorReason } = await getUserFromAuthHeader(req);
    if (!user || !token) {
      return res.status(401).json({ error: `Authentication required to place an order. Details: ${errorReason}` });
    }

    // Create a Supabase client that authenticates exactly as this user
    const userSupabase = getSupabaseClient(token);

    // 1. Verify products/variants and calculate secure prices
    // It's safe to use the public 'supabase' client for this, or userSupabase
    const productIds = items.map((i: any) => i.productId);
    const { data: dbProducts, error: productsError } = await userSupabase
      .from('products')
      .select('*, product_variants(*), images:product_images(image_url)')
      .in('id', productIds);

    if (productsError) {
      console.error("Product Verification DB Error:", productsError);
      return res.status(500).json({ error: "Failed to verify products due to a database error." });
    }

    if (!dbProducts || dbProducts.length === 0) {
      return res.status(400).json({ error: "No valid products found in your cart." });
    }

    let subtotal = 0;
    const orderItemsToInsert: any[] = [];
    let missingMapping = false;

    for (const item of items) {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      
      if (!dbProduct) {
        return res.status(400).json({ error: `Product ID ${item.productId} could not be verified.` });
      }
      
      if (!dbProduct.active) {
        return res.status(400).json({ error: `Product "${dbProduct.name}" is currently inactive or unavailable.` });
      }

      // Check if this is a fallback variant (product has no variants, so variantId === productId)
      const isFallbackVariant = item.variantId === item.productId && (!dbProduct.product_variants || dbProduct.product_variants.length === 0);
      
      let dbVariant = null;
      if (isFallbackVariant) {
        dbVariant = {
          id: dbProduct.id,
          price: dbProduct.base_price,
          qikink_sku: "",
          name: "Default",
          product_id: dbProduct.id
        };
      } else {
        dbVariant = dbProduct.product_variants?.find((v: any) => v.id === item.variantId);
        if (!dbVariant) {
          return res.status(400).json({ error: `Variant ID ${item.variantId} could not be found for product "${dbProduct.name}".` });
        }
      }
      
      const price = dbVariant.price ?? dbProduct.base_price;
      subtotal += price * item.quantity;
      
      const finalQikinkSku = dbVariant.qikink_sku || dbProduct.qikink_design_sku || "";
      if (!finalQikinkSku) missingMapping = true;

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        variant_id: isFallbackVariant ? null : dbVariant.id,
        product_name: dbProduct.name,
        variant_name: dbVariant.name || "Default",
        qikink_sku: finalQikinkSku,
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
        product_image: dbProduct.images?.[0]?.image_url || ""
      });
    }

    // 2. Validate Coupon and Calculate Final Price
    let discount = 0;
    let validCoupon = null;
    if (couponCode) {
      const { data: coupon } = await userSupabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();
        
      if (coupon) {
         // First-order logic
         let eligible = true;
         if (coupon.code === 'WELCOME60') {
           const { count } = await userSupabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
           if (count && count > 0) eligible = false;
         }
         
         if (eligible && (!coupon.minimum_order_value || subtotal >= coupon.minimum_order_value)) {
           validCoupon = coupon.code;
           if (coupon.discount_type === 'fixed') discount = coupon.discount_value;
           else if (coupon.discount_type === 'percentage') {
             discount = Math.round((subtotal * coupon.discount_value) / 100);
             if (coupon.maximum_discount && discount > coupon.maximum_discount) discount = coupon.maximum_discount;
           }
           if (discount > subtotal) discount = subtotal;
         }
      }
    }

    const shipping_fee = 0; // ZERON customer shipping charge
    const tax = 0; // Handled in base price for this scope
    const total = subtotal - discount + shipping_fee + tax;

    const isCOD = paymentMethod === 'COD';
    
    const orderNumber = `ZERON-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Create Pending Order in Supabase
    const { data: orderData, error: orderError } = await userSupabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        customer_name: customer.full_name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address: customer,
        subtotal,
        discount,
        shipping_fee,
        tax,
        total,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: missingMapping ? 'pending_mapping' : 'unfulfilled',
        coupon_code: validCoupon,     // Relies on migration
        payment_method: paymentMethod, // Relies on migration
        box_packing_enabled: true,
        custom_letter_enabled: true,
        custom_letter_design_id: 'ZERON Thank You Letter'
      })
      .select('id')
      .single();

    if (orderError) {
       // If migration isn't run, fallback to insert without new columns
       if (orderError.code === '42703') { // Column does not exist
           const { data: fallbackOrder, error: fallbackErr } = await userSupabase
            .from('orders')
            .insert({
              user_id: user.id,
              order_number: orderNumber,
              customer_name: customer.full_name,
              customer_email: customer.email,
              shipping_address: customer,
              subtotal, discount, shipping_fee, tax, total,
              status: 'pending', payment_status: 'pending',
              fulfillment_status: missingMapping ? 'pending_mapping' : 'unfulfilled'
              // NOTE: box_packing_enabled and custom_letter_enabled omitted here because this is the fallback if columns don't exist
            })
            .select('id').single();
            if (fallbackErr) throw new Error(fallbackErr.message);
            orderData.id = fallbackOrder.id;
       } else {
           throw new Error(orderError.message);
       }
    }

    // Insert Order Items
    const itemsToInsert = orderItemsToInsert.map(item => ({ ...item, order_id: orderData.id }));
    const { error: itemsError } = await userSupabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw new Error(itemsError.message);

    // Increment Coupon usage
    if (validCoupon) {
      try { await userSupabase.rpc('increment_coupon_usage', { p_code: validCoupon }); } catch (e) {}
    }

    // 4. Payment Gateway Logic
    if (isCOD) {
      // Direct to Qikink Fulfillment
       
         const emailPayload = await getWeb3FormsPayload(orderData.id, token);
      res.json({ success: true, dbOrderId: orderData.id, paymentMethod: 'COD', emailPayload });
      return;
      res.json({ success: true, dbOrderId: orderData.id, paymentMethod: 'COD' });
    } else {
      // Prepaid via Razorpay
      
      const amountInPaise = Math.round(total * 100);
      if (amountInPaise < 100) {
        return res.status(400).json({ error: "Order amount must be at least ₹1.00 for online payment." });
      }
      
      const rpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderData.id,
      });

      res.json({
        id: rpOrder.id,
        currency: rpOrder.currency,
        amount: rpOrder.amount,
        dbOrderId: orderData.id,
        paymentMethod: 'PREPAID'
      });
    }

  } catch (error: any) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
});

// Verify Razorpay Payment & Send Email
app.post("/api/checkout/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }
    
    const { user, token, errorReason } = await getUserFromAuthHeader(req);
    if (!user || !token) {
      return res.status(401).json({ error: `Authentication required. Details: ${errorReason}` });
    }
    
    const userSupabase = getSupabaseClient(token);
    
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const crypto = require("crypto");
    
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update Order Status to Paid
    await userSupabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'processing', payment_id: razorpay_payment_id })
      .eq('id', dbOrderId);

    // Send Web3Forms Email payload back
    const emailPayload = await getWeb3FormsPayload(dbOrderId, token);
    res.json({ success: true, emailPayload });
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: error.message || "Payment verification failed" });
  }
});

// Helper: Send Web3Forms Notification
async function getWeb3FormsPayload(dbOrderId, token) {
  try {
    const userSupabase = getSupabaseClient(token);
    const { data: order, error } = await userSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', dbOrderId)
      .single();
      
    if (error || !order) return null;

    const formatItems = order.order_items.map((item, i) => `Product ${i + 1}:\nProduct Name:\n${item.product_name}\n\nQuantity:\n${item.quantity}\n\nZERON Product ID:\n${item.product_id}\n\nZERON Variant ID:\n${item.variant_id || 'N/A'}\n\nQikink Design SKU:\n${item.qikink_sku || 'N/A'}\n\nProduct Price:\n₹${item.unit_price}\n\nLine Total:\n₹${item.total_price}`).join('\n\n');

    let customer = order.shipping_address;
    if (typeof customer === 'string') {
        try { customer = JSON.parse(customer); } catch(e) {}
    }

    const emailBody = `--------------------------------\nZERON NEW ORDER\n--------------------------------\n\nOrder ID:\n${order.order_number}\n\nOrder Date:\n${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\nPayment Method:\n${order.payment_method === 'COD' ? 'COD' : 'ONLINE PAYMENT'}\n\nPayment Status:\n${order.payment_status === 'paid' ? 'PAID' : (order.payment_method === 'COD' ? 'COD' : order.payment_status)}\n\nOrder Status:\nNEW - MANUAL QIKINK FULFILMENT\n\n--------------------------------\nCUSTOMER DETAILS\n--------------------------------\n\nCustomer Name:\n${order.customer_name}\n\nEmail:\n${order.customer_email}\n\nPhone:\n${order.customer_phone || 'N/A'}\n\n--------------------------------\nSHIPPING ADDRESS\n--------------------------------\n\nFirst Name:\n${order.customer_name.split(' ')[0]}\n\nLast Name:\n${order.customer_name.split(' ').slice(1).join(' ')}\n\nAddress:\n${customer.address_line_1 || customer.address || 'N/A'}\n\nApartment/Suite:\n${customer.address_line_2 || customer.apartment || 'N/A'}\n\nCity:\n${customer.city || 'N/A'}\n\nState:\n${customer.state || 'N/A'}\n\nPincode:\n${customer.postal_code || customer.pincode || 'N/A'}\n\nCountry:\nIndia\n\n--------------------------------\nORDER ITEMS\n--------------------------------\n\n${formatItems}\n\n--------------------------------\nPRICE SUMMARY\n--------------------------------\n\nSubtotal:\n₹${order.subtotal}\n\nDiscount:\n-₹${order.discount || 0}\n\nCoupon:\n${order.coupon_code || 'None'}\n\nShipping:\n₹${order.shipping_fee || 0}\n\nFinal Customer Total:\n₹${order.total}\n\n--------------------------------\nFULFILMENT\n--------------------------------\n\nFulfilment Method:\nManual Qikink Fulfilment\n\nQikink Action:\nSearch the Qikink Design SKU and manually create the order.\n\nPackaging:\nBox Packing\n\nCustom Letter:\nZERON Custom Thank You Letter`;

    return {
      subject: `New ZERON ${order.payment_method === 'COD' ? 'COD' : 'Paid'} Order - ${order.order_number}`,
      message: emailBody
    };
  } catch (error) {
    console.error("Error generating Web3Forms payload:", error);
    return null;
  }
}
