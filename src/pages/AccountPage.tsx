import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { formatPrice } from "../lib/utils";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Order } from "../types";

export default function AccountPage() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          subtotal,
          discount,
          total,
          status,
          payment_method,
          payment_status,
          fulfillment_status,
          tracking_number,
          courier_name,
          created_at,
          order_items (
            product_name,
            variant_name,
            quantity,
            unit_price,
            product_image
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDbOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 w-full">
        <h1 className="text-3xl font-bold mb-8 tracking-widest uppercase text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-950 border border-red-900 text-red-500 text-sm rounded-sm">{error}</div>}
          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" 
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" 
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors rounded-sm disabled:opacity-50">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-neutral-500">
          <button onClick={() => setIsLogin(!isLogin)} className="hover:text-white underline">
            {isLogin ? "Create an account instead" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex justify-between items-end mb-12 border-b border-neutral-900 pb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-neutral-400 text-sm">Welcome back, {user?.name}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 tracking-widest uppercase text-neutral-500">Order History</h2>
          
          {ordersLoading ? (
            <div className="bg-neutral-950 border border-neutral-900 p-8 text-center rounded-sm text-neutral-400">
              Loading orders...
            </div>
          ) : dbOrders.length === 0 ? (
            <div className="bg-neutral-950 border border-neutral-900 p-8 text-center rounded-sm text-neutral-400">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-6">
              {dbOrders.map(order => (
                <div key={order.id} className="bg-neutral-950 border border-neutral-900 p-6 rounded-sm">
                  <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-neutral-900 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-medium">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-medium">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <span className="bg-white text-black px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {order.order_items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 h-16 bg-neutral-900 shrink-0 rounded-sm">
                          {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-neutral-500">{item.variant_name}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-500">{item.quantity}x </span>
                          <span className="font-medium">{formatPrice(item.unit_price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-900/50 p-4 rounded-sm">
                    <div>
                      <p className="text-neutral-500 mb-1">Subtotal:</p>
                      <p>{formatPrice(order.subtotal)}</p>
                      {order.discount > 0 && (
                        <>
                          <p className="text-green-500 mt-2 mb-1">Discount:</p>
                          <p className="text-green-500">-{formatPrice(order.discount)}</p>
                        </>
                      )}
                    </div>
                    <div>
                       <p className="text-neutral-500 mb-1">Payment:</p>
                       <p>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online'} ({order.payment_status})</p>
                       <p className="text-neutral-500 mt-2 mb-1">Fulfillment:</p>
                       <p className="capitalize">{order.fulfillment_status?.replace(/_/g, ' ')}</p>
                       {order.tracking_number && (
                         <p className="text-neutral-400 mt-1">Tracking: {order.tracking_number}</p>
                       )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 tracking-widest uppercase text-neutral-500">Account Details</h2>
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-sm space-y-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Name</p>
              <p className="font-medium text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Email</p>
              <p className="font-medium text-white">{user?.email}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-900">
              <button className="text-sm text-neutral-400 hover:text-white underline">Edit Addresses</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
