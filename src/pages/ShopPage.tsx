import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { Product } from "../types";
import ProductCard from "../components/ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentCategory = searchParams.get("category");
  const currentCollection = searchParams.get("collection");
  const currentSort = searchParams.get("sort") || "featured";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let data = await api.products.getAll();
      
      // Extract categories before filtering
      const catMap = new Map<string, string>();
      data.forEach(p => {
        if (p.category && p.category !== "Uncategorized" && p.categorySlug) {
          catMap.set(p.categorySlug, p.category);
        }
      });
      const uniqueCats = Array.from(catMap.entries()).map(([slug, name]) => ({slug, name})).sort((a, b) => a.name.localeCompare(b.name));
      setCategories(uniqueCats);
      
      // Filter
      if (currentCollection) {
        data = data.filter(p => p.collectionSlug === currentCollection || p.collection === currentCollection);
      }
      if (currentCategory) {
        data = data.filter(p => p.categorySlug === currentCategory || p.category === currentCategory);
      }
      
      // Sort
      if (currentSort === "price-low") data.sort((a, b) => a.price - b.price);
      if (currentSort === "price-high") data.sort((a, b) => b.price - a.price);
      if (currentSort === "newest") data = data.filter(p => p.newProduct).concat(data.filter(p => !p.newProduct));
      
      setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, [currentCategory, currentCollection, currentSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-neutral-900 pb-8 gap-6">
        <div>
          {(() => {
            let title = "All Products";
            if (currentCategory) {
               const found = categories.find(c => c.slug === currentCategory || c.name === currentCategory);
               title = found ? found.name : currentCategory;
            } else if (currentCollection) {
               title = currentCollection.charAt(0).toUpperCase() + currentCollection.slice(1).replace(/-/g, ' ');
            }
            return <h1 className="text-4xl font-bold mb-4">{title}</h1>;
          })()}
          <p className="text-neutral-400">Discover our collection of premium workspace essentials.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 border border-neutral-800 rounded-sm px-4 py-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <select 
              className="bg-transparent text-sm focus:outline-none cursor-pointer"
              value={currentCategory || ""}
              onChange={(e) => {
                if (e.target.value) searchParams.set("category", e.target.value);
                else searchParams.delete("category");
                setSearchParams(searchParams);
              }}
            >
              <option value="" className="bg-neutral-900">All Categories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug} className="bg-neutral-900">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border border-neutral-800 rounded-sm px-4 py-2 shrink-0">
            <span className="text-sm text-neutral-400">Sort by:</span>
            <select 
              className="bg-transparent text-sm focus:outline-none cursor-pointer"
              value={currentSort}
              onChange={(e) => {
                searchParams.set("sort", e.target.value);
                setSearchParams(searchParams);
              }}
            >
              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="newest" className="bg-neutral-900">Newest</option>
              <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-neutral-900 rounded-sm mb-4"></div>
              <div className="h-4 bg-neutral-900 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral-900 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-2xl font-medium mb-4">No products found</h2>
          <p className="text-neutral-400 mb-8">We couldn't find any products matching your filters.</p>
          <button 
            onClick={() => setSearchParams({})}
            className="text-white border-b border-white pb-1 hover:text-neutral-300 transition-colors text-sm tracking-wide uppercase"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
