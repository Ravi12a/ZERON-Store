import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../services/api";
import { Product } from "../types";
import ProductCard from "../components/ui/ProductCard";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await api.products.getFeatured();
      setFeaturedProducts(data.slice(0, 4));
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Herosectionimage.png" 
            alt="ZERON Desk Setup" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            DESIGN YOUR SPACE.
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto font-light">
            Premium designs for setups that deserve more. Minimal, modern, and crafted with precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/shop?category=mouse-pad" 
              className="w-full sm:w-auto bg-white text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-sm"
            >
              Shop Mouse Pads
            </Link>
            <Link 
              to="/collections" 
              className="w-full sm:w-auto bg-transparent border border-white text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors rounded-sm"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Designs</h2>
            <p className="text-neutral-400">Curated essentials for your workspace.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-sm font-bold tracking-widest uppercase hover:text-neutral-300 transition-colors gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-neutral-900 rounded-sm mb-4"></div>
                <div className="h-4 bg-neutral-900 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-900 rounded w-1/4"></div>
              </div>
            ))}
          </div>

        ) : featuredProducts.length === 0 ? (
          <div className="py-24 text-center border border-neutral-900 rounded-sm bg-neutral-950/30">
            <h3 className="text-xl font-medium mb-2">More Designs Coming Soon</h3>
            <p className="text-neutral-500">We are currently curating our next featured collection.</p>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link to="/shop" className="inline-flex items-center text-sm font-bold tracking-widest uppercase hover:text-neutral-300 transition-colors gap-2 border-b border-white pb-1">
            View All Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why ZERON */}
      <section className="bg-neutral-950 py-24 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-bold mb-4">Premium Designs</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Original artwork designed to elevate your setup. We don't do generic.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Made For Your Setup</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Designed around modern gaming and workspace aesthetics with perfect proportions.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quality You Can Feel</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Premium materials, non-slip bases, and carefully produced finishes.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Designed By ZERON</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Every design is created in-house with meticulous attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest">Show Us Your Space.</h2>
        <p className="text-neutral-400 mb-12">Tag @ZERON in your setup and become part of the community.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-neutral-900 relative group overflow-hidden">
             <img src="/Desktop.png" alt="Community setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="aspect-square bg-neutral-900 relative group overflow-hidden">
             <img src="/Closeupshot.png" alt="Community setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="aspect-square bg-neutral-900 relative group overflow-hidden hidden md:block">
             <img src="/CloseupGTAVI.png.png" alt="Community setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="aspect-square bg-neutral-900 relative group overflow-hidden hidden md:block">
             <img src="/Topview.png" alt="Community setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
