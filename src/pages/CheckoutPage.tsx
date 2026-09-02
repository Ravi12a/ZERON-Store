import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { formatPrice } from "../lib/utils";
import { ChevronRight, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CheckoutPage() {
  const { items, clearCart, getCartTotal, syncCartPrices } = useCartStore();
  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Sync prices automatically on mount
  useEffect(() => {
    syncCartPrices();
  }, [syncCartPrices]);

  // If subtotal changes (due to sync or qty update), re-validate the active coupon.
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      const revalidate = async () => {
        try {
          const token = await getAuthToken();
          const response = await fetch("/api/checkout/validate-coupon", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ couponCode: appliedCoupon, subtotal })
          });
          const data = await response.json();
          if (response.ok) {
            setDiscountAmount(data.discount);
          } else {
            setDiscountAmount(0);
            setAppliedCoupon("");
            setErrorMsg("Your coupon was removed: " + (data.error || "It is no longer eligible with the updated cart items."));
          }
        } catch (err) {
          setDiscountAmount(0);
          setAppliedCoupon("");
        }
      };
      revalidate();
    }
  }, [subtotal, appliedCoupon]);

  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    paymentMethod: "prepaid" // "prepaid" or "cod"
  });

  const finalTotal = total - discountAmount;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setErrorMsg("");
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Please log in to apply coupons.");
      }
      const response = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ couponCode, subtotal })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid coupon");
      
      setDiscountAmount(data.discount);
      setAppliedCoupon(data.couponCode);
      setCouponCode("");
    } catch (err: any) {
      setErrorMsg(err.message);
      setDiscountAmount(0);
      setAppliedCoupon("");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("You must be logged in to checkout.");
      }

      const orderPayload = {
        items: items.map(item => ({
          variantId: item.variant.id,
          productId: item.product.id,
          quantity: item.quantity
        })),
        customer: {
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          address_line_1: formData.address,
          address_line_2: formData.apartment,
          city: formData.city,
          state: formData.state,
          postal_code: formData.pincode,
          country: "India"
        },
        couponCode: appliedCoupon || null,
        paymentMethod: formData.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
      };

      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      if (data.paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${data.dbOrderId}`);
        return;
      }

      // Prepaid Razorpay Flow
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Payment gateway failed to load");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "test_key",
        amount: data.amount,
        currency: data.currency,
        name: "ZERON",
        description: "Order Checkout",
        order_id: data.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            
            clearCart();
            navigate(`/order-success/${data.dbOrderId}`);
          } catch (err: any) {
            setErrorMsg(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone || ""
        },
        theme: {
          color: "#000000"
        }
      };

      const rp = new (window as any).Razorpay(options);
      rp.on('payment.failed', function (response: any){
        setErrorMsg("Payment failed: " + response.error.description);
        setIsSubmitting(false);
      });
      rp.open();

    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left: Form */}
      <div className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16 order-2 lg:order-1">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs tracking-widest uppercase text-neutral-500 mb-12 gap-2">
          <Link to="/cart" className="hover:text-white">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-bold">Checkout</span>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-950 border border-red-900 text-red-500 rounded-sm text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <input 
                required
                type="email" 
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <input 
                required
                type="text" 
                name="phone"
                placeholder="Phone Number (Required for shipping)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="col-span-2 w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={formData.apartment} onChange={handleChange} className="col-span-2 w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="pincode" placeholder="PIN Code" value={formData.pincode} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xl font-bold mb-6">Payment</h2>
            <p className="text-xs text-neutral-500 mb-4 flex items-center gap-2"><Lock className="w-3 h-3" /> All transactions are secure and encrypted.</p>
            
            <div className="border border-neutral-800 rounded-sm overflow-hidden">
              <label className="flex items-center gap-4 p-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-900/50 transition-colors">
                <input type="radio" name="paymentMethod" value="prepaid" checked={formData.paymentMethod === 'prepaid'} onChange={handleChange} className="accent-white" />
                <span className="text-sm font-medium">Online Payment (Cards, UPI, NetBanking)</span>
              </label>
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-900/50 transition-colors">
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="accent-white" />
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>
          </section>

          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-sm mb-6 mt-6">
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong>Order Confirmation Notice:</strong> After you place an order, a ZERON representative may call you on your provided phone number to confirm the order before it is processed for fulfilment.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors rounded-sm disabled:opacity-70 flex justify-center"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Place Order"}
          </button>
        </form>
      </div>

      {/* Right: Summary */}
      <div className="bg-neutral-950 px-4 py-12 sm:px-6 lg:px-16 lg:py-16 border-l border-neutral-900 order-1 lg:order-2">
        <div className="sticky top-12">
          
          <div className="space-y-6 mb-8">
            {items.map(item => (
              <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-neutral-900 rounded-sm border border-neutral-800 shrink-0">
                  <img src={item.product.images[0] || "https://placehold.co/600x600/111111/333333?text=No+Image"} alt={item.product.name} className="w-full h-full object-cover rounded-sm" />
                  <span className="absolute -top-2 -right-2 bg-neutral-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.product.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1">{item.variant.name}</p>
                </div>
                <div className="text-sm font-medium">
                  {formatPrice(item.variant.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 flex gap-2">
             <input 
               type="text" 
               placeholder="Discount code" 
               value={couponCode}
               onChange={(e) => setCouponCode(e.target.value)}
               disabled={!!appliedCoupon || isValidatingCoupon}
               className="flex-1 bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors disabled:opacity-50"
             />
             {!appliedCoupon ? (
               <button 
                 type="button"
                 onClick={applyCoupon}
                 disabled={!couponCode || isValidatingCoupon}
                 className="bg-neutral-800 px-4 py-2 text-sm font-medium rounded-sm hover:bg-neutral-700 transition-colors disabled:opacity-50"
               >
                 {isValidatingCoupon ? "..." : "Apply"}
               </button>
             ) : (
               <button 
                 type="button"
                 onClick={removeCoupon}
                 className="bg-red-900/30 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-900/50 transition-colors"
               >
                 Remove
               </button>
             )}
          </div>

          <div className="space-y-4 text-sm border-t border-neutral-900 pt-6 mb-6">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-500">
                <span>Discount ({appliedCoupon})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span className="text-white">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-neutral-900 pt-6">
            <span className="font-bold text-lg">Total</span>
            <span className="text-2xl font-bold text-white">{formatPrice(finalTotal)}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
