import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { cartCount, clearCart } = useCart();

  // =========================
  //     GET LOGGED-IN USER
  // =========================
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener('storage', checkUser);

    // Also listen for custom event for same-tab updates
    const handleUserUpdate = () => checkUser();
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Avatar state for fallback
  const [avatarError, setAvatarError] = useState(false);

  // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false);
  }, [user]);

  // Avatar generation (initials or profile picture)
  const getAvatar = () => {
    if (!user) return null;

    const initial = user.username ? user.username.charAt(0).toUpperCase() : "?";

    // If profile picture exists and no error, show it
    if (user.profile_image && !avatarError) {
      return (
        <img 
          src={user.profile_image} 
          alt={user.username || 'User'} 
          className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]"
          onError={() => setAvatarError(true)}
        />
      );
    }

    // No profile image or error loading image, show initials
    return (
      <div className="w-10 h-10 bg-[#D4AF37] text-[#2C1810] rounded-full flex items-center justify-center text-lg font-bold">
        {initial}
      </div>
    );
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    clearCart(); // Clear cart when logging out
    setUser(null);
    // Dispatch event to update navbar in other components
    window.dispatchEvent(new Event('userUpdated'));
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2C1810]/95 backdrop-blur-md border-b border-[#C5A572]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo_final.png" alt="logo" className="h-24" style={{ height: "110px" }} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative transition-colors ${
                  isActive(link.path)
                    ? "text-[#D4AF37]"
                    : "text-[#F5E6D3] hover:text-[#D4AF37]"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[26px] left-0 right-0 h-0.5 bg-[#D4AF37]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Cart - Only show when user is logged in */}
            {user && (
              <Link to="/cart" className="relative text-[#F5E6D3] hover:text-[#D4AF37] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#2C1810] rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {String(cartCount)}
                </span>
              </Link>
            )}

            {/* Profile Dropdown */}
            {user ? (
  <div className="relative" ref={dropdownRef}>
    <div
      className="cursor-pointer"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {getAvatar()}
    </div>

    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-3 w-48 bg-white border-2 border-[#C5A572] rounded-lg shadow-lg overflow-hidden"
        >
          <Link
            to="/profile"
            className="block px-4 py-3 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            Account Settings
          </Link>

          <Link
            to="/orders"
            className="block px-4 py-3 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            My Orders
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            style={{ color: '#dc2626' }}
          >
            Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
) : (
  <>
    <Link to="/login">
      <Button
        variant="ghost"
        className="text-[#F5E6D3] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
        style={{color: "#F5E6D3", cursor: "pointer"}}
      >
        Login
      </Button>
    </Link>

    <Link to="/signup">
      <Button className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]" style={{cursor: "pointer"}}>
        Sign Up
      </Button>
    </Link>
  </>
)}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#F5E6D3]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#3E2723] border-t border-[#C5A572]/20"
          >
            <div className="px-4 py-4 space-y-3">
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 ${
                    isActive(link.path) ? "text-[#D4AF37]" : "text-[#F5E6D3]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Cart - Only show when user is logged in */}
              {user && (
                <Link to="/cart" className="flex items-center justify-between py-2 text-[#F5E6D3]">
                  <span>Cart</span>
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              )}

              {/* Profile / Login */}
              {user ? (
  <>
    <Link
      to="/profile"
      className="block py-2 text-[#F5E6D3] hover:text-[#D4AF37]"
      onClick={() => setIsMenuOpen(false)}
    >
      Account Settings
    </Link>

    <Link
      to="/orders"
      className="block py-2 text-[#F5E6D3] hover:text-[#D4AF37]"
      onClick={() => setIsMenuOpen(false)}
    >
      My Orders
    </Link>

    <button
      onClick={handleLogout}
      className="block w-full text-left py-2 hover:text-red-700 transition-colors"
      style={{ color: '#dc2626' }}
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link
      to="/login"
      className="block py-2 text-[#F5E6D3]"
      onClick={() => setIsMenuOpen(false)}
    >
      Login
    </Link>

    <Link
      to="/signup"
      className="block py-2 text-[#F5E6D3]"
      onClick={() => setIsMenuOpen(false)}
    >
      Sign Up
      </Link>
  </>
)}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
