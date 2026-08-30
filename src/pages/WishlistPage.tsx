import React from "react";
import { useWishlistStore } from "../store/useWishlistStore";
import { Link } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center w-full flex flex-col items-center">
        <Heart className="w-16 h-16 text-neutral-800 mb-6" />
        <h1 className="text-3xl font-bold mb-4 tracking-widest uppercase">Your Wishlist is Empty</h1>
        <p className="text-neutral-400 mb-8 max-w-md">Save items you love here to easily find them later or add them to your cart.</p>
        <Link 
          to="/shop" 
          className="bg-white text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm inline-block"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex items-end justify-between mb-12 border-b border-neutral-900 pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Wishlist</h1>
          <p className="text-neutral-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
