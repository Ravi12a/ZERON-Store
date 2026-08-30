import { X, Search } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Product } from "../../types";
import { formatPrice } from "../../lib/utils";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        const data = await api.products.search(query);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    };
    
    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleProductClick = (slug: string) => {
    closeSearch();
    navigate(`/products/${slug}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
        >
          <div className="max-w-4xl w-full mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8 md:mb-16">
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-500">Search</span>
              <button onClick={closeSearch} className="text-neutral-400 hover:text-white p-2">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="relative mb-12">
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-3xl md:text-5xl font-light border-b-2 border-neutral-800 pb-4 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
              />
              <Search className="absolute right-0 bottom-6 w-6 h-6 md:w-8 md:h-8 text-neutral-500" />
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading && <div className="text-neutral-500 tracking-widest text-sm uppercase">Searching...</div>}
              
              {!isLoading && query.length > 2 && results.length === 0 && (
                <div className="text-neutral-500 tracking-widest text-sm uppercase">No results found for "{query}"</div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-6 group text-left"
                    >
                      <div className="w-20 h-20 bg-neutral-900 rounded-sm overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg group-hover:text-neutral-300 transition-colors">{product.name}</h3>
                        <p className="text-neutral-500">{formatPrice(product.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query.length <= 2 && (
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-600 mb-6">Popular Searches</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Desk Mat", "Gaming", "Minimal", "Carbon"].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 border border-neutral-800 rounded-full text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
