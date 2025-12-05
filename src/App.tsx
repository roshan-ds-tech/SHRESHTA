import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './contexts/CartContext';

// Page transition wrapper component
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/accounts/signup/`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          {/* Admin Routes (without Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          
          {/* Public Routes (with Navbar/Footer) */}
          <Route path="/" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <HomePage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <AboutPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/products" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <ProductsPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/product/:id" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <ProductDetailsPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <LoginPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <SignupPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/cart" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <CartPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <ContactPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/faq" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <FAQPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/dashboard" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <DashboardPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/orders" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <OrdersPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/profile" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <AccountSettingsPage />
                <Footer />
              </div>
            </PageTransition>
          } />
          <Route path="/privacy" element={
            <PageTransition>
              <div className="min-h-screen bg-[#FFF8E7]">
                <Navbar />
                <PrivacyPolicyPage />
                <Footer />
              </div>
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    );
  }

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}
