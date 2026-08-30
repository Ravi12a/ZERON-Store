import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans antialiased selection:bg-neutral-800 selection:text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
    </div>
  );
}
