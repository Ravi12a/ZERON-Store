import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Collection } from "../types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await api.collections.getAll();
      setCollections(data);
      setIsLoading(false);
    };
    fetchCollections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Collections</h1>
        <p className="text-neutral-400 max-w-2xl">Explore our curated selections of premium workspace aesthetics, categorized to help you find the perfect match for your setup.</p>
      </div>

      {isLoading ? (
        <div className="space-y-12">
           {[1, 2, 3].map(i => (
             <div key={i} className="aspect-[21/9] md:aspect-[3/1] bg-neutral-900 rounded-sm animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="space-y-12">
          {collections.map((collection, index) => (
            <Link 
              key={collection.id} 
              to={`/shop?collection=${collection.slug}`}
              className="group block relative aspect-[4/3] md:aspect-[3/1] bg-neutral-900 rounded-sm overflow-hidden"
            >
              <img 
                src={collection.image} 
                alt={collection.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{collection.name}</h2>
                <p className="text-neutral-300 max-w-md mb-8">{collection.description}</p>
                <div className="flex items-center text-sm font-bold tracking-widest uppercase gap-2 text-white group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
