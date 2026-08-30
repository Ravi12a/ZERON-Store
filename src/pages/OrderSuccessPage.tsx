import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/utils";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id', orderId)
          .single();
        
        if (!error && data) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 w-full flex flex-col items-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-8" />
      <h1 className="text-4xl font-bold mb-4 tracking-widest uppercase text-center">Order Confirmed</h1>
      <p className="text-xl text-neutral-400 mb-2 font-light">Your setup just got an upgrade.</p>
      <p className="text-neutral-500 mb-12">Order #{order?.order_number || orderId}</p>

      {loading ? (
        <div className="text-neutral-500 mb-12">Loading order details...</div>
      ) : order ? (
        <div className="w-full bg-neutral-950 border border-neutral-900 rounded-sm p-8 mb-12">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6">
            <h2 className="text-lg font-bold tracking-widest uppercase">Order Summary</h2>
            <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-neutral-500 block">Payment Method</span>
              <span className="text-sm font-medium">{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online / Prepaid'}</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">{item.quantity}x</span>
                  <span>{item.product_name} ({item.variant_name})</span>
                </div>
                <span className="text-neutral-400">{formatPrice(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-900 pt-4 space-y-2 text-sm">
             <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
             </div>
             {order.discount > 0 && (
               <div className="flex justify-between text-green-500">
                  <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                  <span>-{formatPrice(order.discount)}</span>
               </div>
             )}
             <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>{order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}</span>
             </div>
             <div className="flex justify-between font-bold pt-4 text-base">
                <span>{order.payment_method === 'COD' ? 'To Pay (COD)' : 'Total Paid'}</span>
                <span>{formatPrice(order.total)}</span>
             </div>
          </div>
          
          <div className="border-t border-neutral-900 pt-6 mt-6 grid grid-cols-2 gap-8">
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Shipping To</h3>
               <p className="text-sm text-neutral-300">
                 {order.customer_name}<br/>
                 {order.shipping_address?.address_line_1}<br/>
                 {order.shipping_address?.address_line_2 && <>{order.shipping_address.address_line_2}<br/></>}
                 {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
               </p>
             </div>
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Fulfillment Status</h3>
               <p className="text-sm text-neutral-300 capitalize">
                 {order.fulfillment_status?.replace(/_/g, ' ') || 'Processing'}
               </p>
               {order.tracking_number && (
                 <div className="mt-4">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Tracking</h3>
                   <p className="text-sm text-neutral-300">
                     {order.courier_name && `${order.courier_name}: `}{order.tracking_number}
                   </p>
                 </div>
               )}
             </div>
          </div>
        </div>
      ) : (
        <div className="text-neutral-500 mb-12">Could not retrieve order summary. Your order was successfully received.</div>
      )}

      <Link 
        to="/shop" 
        className="bg-white text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
