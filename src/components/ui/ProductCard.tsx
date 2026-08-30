import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { formatPrice } from "../../lib/utils";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useCartStore } from "../../store/useCartStore";

export default function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { addItem: addCart } = useCartStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant
    const defaultVariant = product.variants.find(v => v.available) || product.variants[0];
    addCart(product, defaultVariant, 1);
  };

  // Calculate discount percentage
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden rounded-sm mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.newProduct && (
            <span className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 p-2 text-neutral-400 hover:text-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Image */}
        <img 
          src={product.images[0] || "https://placehold.co/600x600/111111/333333?text=No+Image"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 hidden md:block">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white/90 backdrop-blur-sm text-black py-3 font-bold tracking-widest uppercase text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Quick Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1 group-hover:text-neutral-300 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-500 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
