import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const links = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/shop" },
    { name: "Collections", to: "/collections" },
    { name: "About", to: "/about" },
    { name: "Account", to: "/account" },
    { name: "Wishlist", to: "/wishlist" },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-0 bg-black z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-neutral-900">
            <span className="text-2xl font-bold tracking-widest uppercase">ZERON</span>
            <button onClick={closeMobileMenu} className="p-2 text-neutral-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
            {links.map((link) => (
              <Link 
                key={link.name}
                to={link.to}
                onClick={closeMobileMenu}
                className="text-3xl font-light hover:text-neutral-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-neutral-900">
            <div className="flex gap-6 text-sm text-neutral-500 font-medium tracking-wide uppercase">
              <a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@ZERONSTORE.IN</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
