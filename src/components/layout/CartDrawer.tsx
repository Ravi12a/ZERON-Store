import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../lib/utils";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    closeCart();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-neutral-950 border-l border-neutral-900 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-900">
              <h2 className="text-lg font-bold tracking-widest uppercase">Your Cart</h2>
              <button onClick={closeCart} className="p-2 text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => { closeCart(); navigate("/shop"); }}
                    className="text-white border-b border-white pb-1 hover:text-neutral-300 hover:border-neutral-300 transition-colors mt-4 text-sm tracking-wide"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4">
                      <div className="w-24 h-24 bg-neutral-900 rounded-sm overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link 
                              to={`/products/${item.product.slug}`} 
                              onClick={closeCart}
                              className="font-medium hover:text-neutral-300 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button 
                              onClick={() => removeItem(item.product.id, item.variant.id)}
                              className="text-neutral-500 hover:text-white transition-colors p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-neutral-400 mt-1">{item.variant.name}</p>
                          <p className="text-sm font-medium mt-1">{formatPrice(item.variant.price)}</p>
                        </div>
                        
                        <div className="flex items-center border border-neutral-800 rounded-sm w-fit mt-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-900 bg-black">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-lg font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-6">Shipping & taxes calculated at checkout.</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors rounded-sm"
                  >
                    Checkout
                  </button>
                  <button 
                    onClick={handleViewCart}
                    className="w-full bg-transparent border border-neutral-800 text-white py-4 font-bold tracking-widest uppercase text-sm hover:border-white transition-colors rounded-sm"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
