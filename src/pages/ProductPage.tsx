import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Product, Variant, Review } from "../types";
import { formatPrice } from "../lib/utils";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { Minus, Plus, Heart, Star, ChevronDown, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { trackViewContent, trackAddToCart } from "../utils/metaPixel";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("details");

  const { addItem: addCart } = useCartStore();
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      if (slug) {
        const data = await api.products.getBySlug(slug);
        if (data) {
          setProduct(data);
          setMainImage(data.images[0] || "https://placehold.co/600x600/111111/333333?text=No+Image");
          setSelectedVariant(data.variants.find(v => v.available) || data.variants[0]);
          const revs = await api.reviews.getByProductId(data.id);
          setReviews(revs);
          
          // Meta Pixel ViewContent
          trackViewContent({
            content_ids: [data.id],
            content_type: "product",
            value: data.variants.find(v => v.available)?.price || data.variants[0].price,
            currency: "INR"
          });
        }
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-neutral-900 rounded-sm"></div>
        <div className="space-y-6">
          <div className="h-8 bg-neutral-900 w-3/4 rounded"></div>
          <div className="h-6 bg-neutral-900 w-1/4 rounded"></div>
          <div className="h-24 bg-neutral-900 w-full rounded"></div>
          <div className="h-12 bg-neutral-900 w-full rounded mt-8"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-neutral-400 hover:text-white underline">Back to Shop</Link>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const isWishlisted = isInWishlist(product.id);
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - currentVariant.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (currentVariant.available) {
      addCart(product, currentVariant, quantity);
      
      // Meta Pixel AddToCart
      trackAddToCart({
        content_ids: [product.id],
        content_type: "product",
        value: currentVariant.price * quantity,
        currency: "INR"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex text-sm text-neutral-500 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-300">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-20 shrink-0 hide-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={cn(
                  "w-20 h-20 shrink-0 bg-neutral-900 rounded-sm overflow-hidden border-2 transition-colors",
                  mainImage === img ? "border-white" : "border-transparent"
                )}
              >
                <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square bg-neutral-900 rounded-sm overflow-hidden relative">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                -{discount}%
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current opacity-50" />
            </div>
            <span className="text-neutral-400 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-2xl font-medium">{formatPrice(currentVariant.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-neutral-500 line-through mb-0.5">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-neutral-300 leading-relaxed mb-8">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold tracking-widest uppercase text-neutral-400">Size</span>
                <button className="text-xs text-neutral-500 underline hover:text-white">Size Guide</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.available}
                    className={cn(
                      "px-4 py-3 text-sm font-medium border rounded-sm transition-colors text-center relative",
                      currentVariant.id === v.id ? "border-white bg-white text-black" : "border-neutral-800 text-neutral-300 hover:border-neutral-500",
                      !v.available && "opacity-50 cursor-not-allowed overflow-hidden"
                    )}
                  >
                    {v.name}
                    {!v.available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-neutral-600 rotate-12 absolute"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-12">
            <div className="flex items-center border border-neutral-800 rounded-sm h-12 px-2 shrink-0">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!currentVariant.available}
              className={cn(
                "flex-1 h-12 font-bold tracking-widest uppercase text-sm rounded-sm transition-colors flex items-center justify-center",
                currentVariant.available 
                  ? "bg-white text-black hover:bg-neutral-200" 
                  : "bg-neutral-900 text-neutral-500 cursor-not-allowed"
              )}
            >
              {currentVariant.available ? "Add to Cart" : "Sold Out"}
            </button>

            <button 
              onClick={() => isWishlisted ? removeWishlist(product.id) : addWishlist(product)}
              className="h-12 w-12 flex items-center justify-center border border-neutral-800 rounded-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors shrink-0"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : ''}`} />
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-neutral-900">
            <AccordionItem 
              title="Product Details" 
              isOpen={expandedSection === 'details'}
              onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
            >
              <ul className="space-y-3 py-2 text-sm text-neutral-400">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex grid grid-cols-3">
                    <span className="font-medium text-white">{key}</span>
                    <span className="col-span-2">{value}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
            
            <AccordionItem 
              title="Shipping & Returns" 
              isOpen={expandedSection === 'shipping'}
              onClick={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
            >
              <div className="space-y-4 py-2 text-sm text-neutral-400 leading-relaxed">
                <p>Our products are designed by ZERON and produced on demand through Qikink. Delivery timelines depend on destination and production time.</p>
                <p>Because products are produced specifically after an order is placed, we generally do not accept returns for change of mind or incorrect selection.</p>
                <p>Because items are made on demand, we do not accept returns for change of mind. Please see our Return Policy for details on replacing defective or damaged items.</p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="py-12 border-t border-neutral-900">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-neutral-500">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-neutral-950 p-6 rounded-sm border border-neutral-900">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.name}</span>
                      {review.verified && (
                        <span className="flex items-center text-[10px] uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-sm">
                          <Check className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "fill-current opacity-30")} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AccordionItem({ title, isOpen, onClick, children }: { title: string, isOpen: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div className="border-b border-neutral-900">
      <button 
        className="w-full py-5 flex justify-between items-center text-left hover:text-neutral-300 transition-colors"
        onClick={onClick}
      >
        <span className="font-bold tracking-widest uppercase text-sm">{title}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-[500px] mb-5" : "max-h-0")}>
        {children}
      </div>
    </div>
  );
}
