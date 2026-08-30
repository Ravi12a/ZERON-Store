import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-2xl font-bold tracking-widest uppercase mb-4 block">
            ZERON
          </Link>
          <p className="text-neutral-400 text-sm mb-6">
            Design Your Space.<br/>
            Premium modern gaming and workspace aesthetics.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-white">Shop</h3>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-neutral-400 hover:text-white text-sm transition-colors">All Products</Link></li>
            <li><Link to="/shop?category=Desk Mats" className="text-neutral-400 hover:text-white text-sm transition-colors">Desk Mats</Link></li>
            <li><Link to="/collections/new-drops" className="text-neutral-400 hover:text-white text-sm transition-colors">New Drops</Link></li>
            <li><Link to="/collections/best-sellers" className="text-neutral-400 hover:text-white text-sm transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-white">Help</h3>
          <ul className="space-y-4">
            <li><Link to="/contact" className="text-neutral-400 hover:text-white text-sm transition-colors">Contact</Link></li>
            <li><Link to="/policies/shipping" className="text-neutral-400 hover:text-white text-sm transition-colors">Shipping</Link></li>
            <li><Link to="/policies/returns" className="text-neutral-400 hover:text-white text-sm transition-colors">Returns</Link></li>
            <li><Link to="/about#faq" className="text-neutral-400 hover:text-white text-sm transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-white">Company</h3>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-neutral-400 hover:text-white text-sm transition-colors">About ZERON</Link></li>
            <li><Link to="/policies/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-neutral-900 pt-8">
        <p className="text-neutral-500 text-xs mb-4 md:mb-0">
          © {new Date().getFullYear()} ZERON. All rights reserved.
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors uppercase tracking-widest text-xs">@ZERONSTORE.IN</a>
        </div>
      </div>
    </footer>
  );
}
