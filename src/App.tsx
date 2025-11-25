import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import axios from 'axios';
import { use, useEffect } from 'react';
import DashboardPage from "./pages/DashboardPage";


import { CartProvider } from './contexts/CartContext';

export default function App() {
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/accounts/signup/')
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[#FFF8E7]">
          <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<AccountSettingsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}
