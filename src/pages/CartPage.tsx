import { useEffect } from 'react';
import { useCartStore } from "../store/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/utils";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal, syncCartPrices } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    syncCartPrices();
  }, [syncCartPrices]);


  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center w-full flex flex-col items-center">
        <ShoppingBag className="w-16 h-16 text-neutral-800 mb-6" />
        <h1 className="text-3xl font-bold mb-4 tracking-widest uppercase">Your Cart is Empty</h1>
        <p className="text-neutral-400 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collections to upgrade your setup.</p>
        <Link 
          to="/shop" 
          className="bg-white text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-bold mb-12 tracking-widest uppercase">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-6 gap-4 border-b border-neutral-900 pb-4 text-xs font-bold tracking-widest uppercase text-neutral-500">
            <div className="col-span-3">Product</div>
            <div className="col-span-1 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={`${item.product.id}-${item.variant.id}`} className="flex flex-col md:grid md:grid-cols-6 gap-4 items-start md:items-center py-4 border-b border-neutral-900/50">
              <div className="col-span-3 flex gap-4 w-full">
                <div className="w-24 h-24 bg-neutral-900 rounded-sm overflow-hidden shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-neutral-300 transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-neutral-400 mt-1">{item.variant.name}</p>
                  <p className="text-sm font-medium mt-2 md:hidden">{formatPrice(item.variant.price)}</p>
                </div>
              </div>

              <div className="col-span-1 flex items-center justify-between w-full md:w-auto mt-4 md:mt-0">
                <div className="flex items-center border border-neutral-800 rounded-sm h-10 w-fit">
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.product.id, item.variant.id)}
                  className="p-2 text-neutral-500 hover:text-white transition-colors md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="col-span-2 hidden md:flex items-center justify-end gap-4 w-full">
                <span className="font-medium">{formatPrice(item.variant.price * item.quantity)}</span>
                <button 
                  onClick={() => removeItem(item.product.id, item.variant.id)}
                  className="p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-950 border border-neutral-900 p-8 rounded-sm sticky top-24">
            <h2 className="text-lg font-bold tracking-widest uppercase mb-6 border-b border-neutral-900 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6 border-b border-neutral-900 pb-6">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-medium">{formatPrice(getCartTotal())}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors rounded-sm"
            >
              Proceed to Checkout
            </button>
            <div className="mt-4 flex justify-center">
               <Link to="/shop" className="text-xs text-neutral-500 hover:text-white underline tracking-widest uppercase">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
