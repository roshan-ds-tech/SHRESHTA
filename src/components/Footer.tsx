import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-[#2C1810] text-[#F5E6D3] border-t border-[#C5A572]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link to="/" onClick={scrollToTop}>
              <motion.span 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img src="/logo_final.png" alt="logo" style={{height: '150px'}} />
              </motion.span>
            </Link>
            <motion.p 
              className="text-sm text-[#C5A572]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Premium jaggery crafted with tradition. Pure, natural sweetness from farm to table.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#D4AF37] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/cart", label: "Cart" },
                { to: "/login", label: "Login" },
                { to: "/signup", label: "Sign Up" }
              ].map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Link to={link.to} onClick={scrollToTop} className="text-sm hover:text-[#D4AF37] transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#D4AF37] mb-4">Customer Support</h3>
            <ul className="space-y-2">
              {[
                { to: "/faq", label: "FAQ", isLink: true },
                { to: "/privacy", label: "Privacy Policy", isLink: true },
                { to: "/privacy", label: "Terms & Conditions", isLink: true },
                { href: "#", label: "Shipping Policy", isLink: false },
                { href: "#", label: "Return Policy", isLink: false }
              ].map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  {item.isLink ? (
                    <Link to={item.to} onClick={scrollToTop} className="text-sm hover:text-[#D4AF37] transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} onClick={scrollToTop} className="text-sm hover:text-[#D4AF37] transition-colors">
                      {item.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#D4AF37] mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#2C1810] transition-all"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-sm">Email: info@shreshta.com</p>
              <p className="text-sm">Phone: +91 98765 43210</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-[#C5A572]/20 text-center"
        >
          <motion.p 
            className="text-sm text-[#C5A572]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2025 Shreshta. All rights reserved. Crafted with tradition and love.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
