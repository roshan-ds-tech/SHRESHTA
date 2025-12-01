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
import { OrdersPage } from './pages/OrdersPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import axios from 'axios';
import { use, useEffect } from 'react';
import DashboardPage from "./pages/DashboardPage";
import { API_BASE_URL } from './config';


import { CartProvider } from './contexts/CartContext';

export default function App() {
  useEffect(() => {
    axios.get(`${API_BASE_URL}/accounts/signup/`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin Routes (without Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          
          {/* Public Routes (with Navbar/Footer) */}
          <Route path="/" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <HomePage />
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <AboutPage />
              <Footer />
            </div>
          } />
          <Route path="/products" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <ProductsPage />
              <Footer />
            </div>
          } />
          <Route path="/product/:id" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <ProductDetailsPage />
              <Footer />
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <LoginPage />
              <Footer />
            </div>
          } />
          <Route path="/signup" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <SignupPage />
              <Footer />
            </div>
          } />
          <Route path="/cart" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <CartPage />
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <ContactPage />
              <Footer />
            </div>
          } />
          <Route path="/faq" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <FAQPage />
              <Footer />
            </div>
          } />
          <Route path="/dashboard" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <DashboardPage />
              <Footer />
            </div>
          } />
          <Route path="/orders" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <OrdersPage />
              <Footer />
            </div>
          } />
          <Route path="/profile" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <AccountSettingsPage />
              <Footer />
            </div>
          } />
          <Route path="/privacy" element={
            <div className="min-h-screen bg-[#FFF8E7]">
              <Navbar />
              <PrivacyPolicyPage />
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}
