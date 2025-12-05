import React from "react";
import { motion } from 'motion/react';
import { Pointer, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

export function ProductCard({ id, image, name, description, price }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // 1. Clean the string: Remove anything that isn't a digit or a decimal point.
    //    e.g., "$19.99" becomes "19.99"
    const cleanedPrice = price.replace(/[^0-9.]/g, '');
    
    // 2. Convert the clean string to a number (float)
    const numericPrice = parseFloat(cleanedPrice);

    // 3. Check if conversion was successful (it might be NaN if price was "Free" or "N/A")
    if (!isNaN(numericPrice)) {
      // 4. Call addToCart with the NUMBER, not the string
      addToCart({ id, image, name, price: numericPrice });
    } else {
      console.error("Could not parse price for item:", name, "Input price:", price);
      // You could also show a small error message to the user here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-[#FFF8E7] rounded-lg overflow-hidden shadow-lg border-2 border-[#C5A572]/20 hover:border-[#D4AF37]/50 transition-all"
    >
      <Link to={`/product/${id}`} className="block">
        <motion.div 
          className="aspect-square overflow-hidden cursor-pointer bg-gray-100"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Try to fix common path issues
              if (!image.startsWith('http') && !image.startsWith('/')) {
                target.src = '/' + image;
              } else if (image.startsWith('http')) {
                // For external URLs, show placeholder if they fail
                target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
              } else {
                // Fallback placeholder
                target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
              }
            }}
          />
        </motion.div>
      </Link>
      <div className="p-6">
        <Link to={`/product/${id}`}>
          <motion.h3 
            className="text-[#2C1810] mb-2 hover:text-[#D4AF37] transition-colors cursor-pointer"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.h3>
        </Link>
        <p className="text-sm text-[#5C4033] mb-4">{description}</p>
        {price && (
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-[#D4AF37] font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {price}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] transition-all duration-300"
                style={{cursor: "pointer"}}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
