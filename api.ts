import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Ensure required environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const QIKINK_CLIENT_ID = process.env.QIKINK_CLIENT_ID || "";
const QIKINK_CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET || "";

// Supabase client using Service Role for backend admin tasks (inserting orders securely)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
auth: { autoRefreshToken: false, persistSession: false },
});

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID || "",
key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

async function getUserFromAuthHeader(req: express.Request) {
const authHeader = req.headers['x-supabase-auth'] as string || req.headers.authorization || req.headers.Authorization as string;
if (!authHeader) return { user: null, errorReason: "Missing Authorization header" };
const token = authHeader.replace("Bearer ", "").trim();
if (!token) return { user: null, errorReason: "Empty token" };
const { data: { user }, error } = await supabase.auth.getUser(token);
if (error) return { user: null, errorReason: `Supabase error: ${error.message}` };
if (!user) return { user: null, errorReason: "User not found in token" };
return { user, errorReason: null };
}


export const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Validates coupon against cart items & user
app.post("/api/checkout/validate-coupon", async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body;
    const { user, errorReason } = await getUserFromAuthHeader(req);
    
    if (!user) {
      return res.status(401).json({ error: `Please log in to use coupons. Details: ${errorReason}` });
    }

    const { data: coupon, error } = await supabase
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
      const { count } = await supabase
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
    
    const { user, errorReason } = await getUserFromAuthHeader(req);
    if (!user) {
      return res.status(401).json({ error: `Authentication required to place an order. Details: ${errorReason}` });
    }

    // 1. Verify products/variants and calculate secure prices
    const variantIds = items.map((i: any) => i.variantId);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*, products(name, active, base_price, qikink_design_sku, images:product_images(image_url))')
      .in('id', variantIds);

    if (variantsError || !variants || variants.length === 0) {
      return res.status(400).json({ error: "Products could not be verified." });
    }

    let subtotal = 0;
    const orderItemsToInsert: any[] = [];
    let missingMapping = false;

    for (const item of items) {
      const dbVariant = variants.find(v => v.id === item.variantId);
      if (!dbVariant || !dbVariant.products?.active) {
        return res.status(400).json({ error: "One or more products are inactive or unavailable." });
      }
      
      const price = dbVariant.price ?? dbVariant.products.base_price;
      subtotal += price * item.quantity;
      
      const finalQikinkSku = dbVariant.qikink_sku || dbVariant.products?.qikink_design_sku || "";
      if (!finalQikinkSku) missingMapping = true;

      orderItemsToInsert.push({
        product_id: dbVariant.product_id,
        variant_id: dbVariant.id,
        product_name: dbVariant.products.name,
        variant_name: dbVariant.name,
        qikink_sku: finalQikinkSku,
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
        product_image: dbVariant.products.images?.[0]?.image_url || ""
      });
    }

    // 2. Validate Coupon and Calculate Final Price
    let discount = 0;
    let validCoupon = null;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();
        
      if (coupon) {
         // First-order logic
         let eligible = true;
         if (coupon.code === 'WELCOME60') {
           const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
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
    const { data: orderData, error: orderError } = await supabase
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
           const { data: fallbackOrder, error: fallbackErr } = await supabase
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
    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw new Error(itemsError.message);

    // Increment Coupon usage
    if (validCoupon) {
      try { await supabase.rpc('increment_coupon_usage', { p_code: validCoupon }); } catch (e) {}
    }

    // 4. Payment Gateway Logic
    if (isCOD) {
      // Direct to Qikink Fulfillment
      if (!missingMapping) {
         await createQikinkOrder(orderData.id);
      }
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

// Verify Razorpay Payment & Create Qikink Order
app.post("/api/checkout/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }
    
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update Order Status to Paid
    await supabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'processing', payment_id: razorpay_payment_id })
      .eq('id', dbOrderId);

    // Create Qikink Order
    const qikinkResponse = await createQikinkOrder(dbOrderId);

    res.json({ success: true, qikinkResponse });
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: error.message || "Payment verification failed" });
  }
});


// Helper: Call Qikink Open API securely
async function createQikinkOrder(dbOrderId: string) {
  try {
    // 1. Fetch order details & items from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', dbOrderId)
      .single();
      
    if (error || !order) return null;
    
    // Idempotency: Don't recreate if already sent to Qikink
    if (order.qikink_order_id) return { success: true, qikinkOrderId: order.qikink_order_id };

    // 2. Fetch Qikink access token securely server-side
    const qikinkClientId = process.env.QIKINK_CLIENT_ID;
    const qikinkClientSecret = process.env.QIKINK_CLIENT_SECRET;
    
    let qikinkToken = "";
    
    if (qikinkClientId && qikinkClientSecret) {
      const params = new URLSearchParams();
      params.append('client_id', qikinkClientId);
      params.append('ClientId', qikinkClientId); // Adding both casings to be safe
      params.append('client_secret', qikinkClientSecret);
      
      const tokenRes = await fetch("https://api.qikink.com/api/token", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!tokenRes.ok) {
        throw new Error(`Qikink Token API failed: ${tokenRes.statusText}`);
      }
      
      const tokenData = await tokenRes.json();
      qikinkToken = tokenData.access_token || tokenData.token;
    }

    if (!qikinkToken) {
      throw new Error("Missing Qikink API credentials or failed to generate token.");
    }

    // Determine Qikink gateway format based on payment method
    // Important: COD Order Value = customer final payable amount
    const isCOD = order.payment_method === 'COD'; // Relies on migration column, fallback logic if needed
    
    // 3. Construct Payload adhering strictly to Qikink Open API schema
    const payload = {
      order_number: order.order_number,
      qikink_shipping: "1", // Example standard shipping
      gateway: isCOD ? "CASH ON DELIVERY" : "Prepaid",
      total_order_value: order.total, // The EXACT final amount after discount!
      first_name: order.customer_name.split(" ")[0] || "Customer",
      last_name: order.customer_name.split(" ").slice(1).join(" ") || "Name",
      address1: order.shipping_address.address_line_1 || order.shipping_address.address || "Address 1",
      address2: order.shipping_address.address_line_2 || order.shipping_address.apartment || "",
      city: order.shipping_address.city || "City",
      state: order.shipping_address.state || "State",
      country: order.shipping_address.country || "India",
      zip: order.shipping_address.postal_code || order.shipping_address.pincode || "000000",
      phone: order.customer_phone || order.shipping_address.phone || "0000000000",
      email: order.customer_email || "customer@example.com",
      line_items: order.order_items.map((item: any) => ({
         sku: item.qikink_sku,
         quantity: item.quantity,
         price: item.unit_price,
         discount: item.allocated_discount || 0
      }))
      // NOTE: Qikink Open API documentation does not publicly document the fields for 
      // Box Packing or Custom Letter. Do NOT invent fields here. 
      // ZERON handles this via Account/Admin dashboard database flags until Qikink provides the keys.
    };

    console.log("Securely Dispatching to Qikink API:", JSON.stringify(payload));

    const response = await fetch("https://api.qikink.com/api/order/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qikinkToken}`
      },
      body: JSON.stringify(payload)
    });
    
    const resultText = await response.text();
    console.log("Qikink Create Order Response:", resultText);
    
    if (!response.ok) {
      throw new Error(`Qikink Order API failed: ${response.status} - ${resultText}`);
    }
    
    const result = JSON.parse(resultText);
    
    // Qikink returns order id usually in the response, we assume it's result.order_id or something similar
    // Fallback to our order_number if not provided for traceability
    const qikinkOrderId = result.order_id || result.id || `QK-${order.order_number}`;
    
    // 4. Safely Update Supabase with Qikink Order ID
    await supabase.from('orders').update({
      qikink_order_id: String(qikinkOrderId),
      fulfillment_status: 'on_hold' // Matches Qikink's manual approval queue
    }).eq('id', dbOrderId);

    return { success: true, qikinkOrderId };
  } catch (error: any) {
    console.error("Qikink Order Creation Failed", error);
    // DO NOT fail the payment or order. Retain order for manual/automatic retry.
    await supabase.from('orders').update({
      fulfillment_status: 'api_error' 
    }).eq('id', dbOrderId);
    return null;
  }
}


