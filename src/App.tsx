import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PolicyPage from "./pages/PolicyPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="products/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="policies/:slug" element={<PolicyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
