import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useUIStore } from "../../store/useUIStore";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export default function Header() {
  const getCartCount = useCartStore(state => state.getCartCount);
  const { openCart } = useCartStore();
  const { openSearch, openMobileMenu } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-black/80 backdrop-blur-md border-neutral-900 h-16" : "bg-black h-20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 md:flex-none">
          <Link to="/" className="text-2xl font-bold tracking-widest uppercase">
            ZERON
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={pathname}>Home</NavLink>
          <NavLink to="/shop" current={pathname}>Shop</NavLink>
          <NavLink to="/collections" current={pathname}>Collections</NavLink>
          <NavLink to="/about" current={pathname}>About</NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-4 md:space-x-6 flex-1 md:flex-none">
          <button onClick={openSearch} className="text-neutral-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/account" className="hidden md:block text-neutral-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/wishlist" className="hidden md:block text-neutral-400 hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
          </Link>
          <button onClick={openCart} className="text-neutral-400 hover:text-white transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
          <button onClick={openMobileMenu} className="md:hidden text-neutral-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, current, children }: { to: string, current: string, children: React.ReactNode }) {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium tracking-wide transition-colors",
        isActive ? "text-white" : "text-neutral-400 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}
