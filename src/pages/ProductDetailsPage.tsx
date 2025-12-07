import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingCart, Heart, Truck, MapPin, Check, 
  X, ChevronLeft, ChevronRight, HelpCircle,
  Award, Shield, Package, Clock, Sparkles, Minus, Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';
import { getProductById, allProductsData, sampleReviews, type Review } from '../utils/productData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Early return if no id parameter or invalid id (shouldn't happen on correct route, but safety check)
  if (!id || isNaN(Number(id))) {
    return null;
  }
  
  const product = getProductById(Number(id));
  
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Product variants
  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weight?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  
  // Delivery state
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Sticky mobile bar
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  // Animation refs
  const imageRef = useRef<HTMLDivElement>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);
  
  const [addedToCart, setAddedToCart] = useState(false);

  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  // Simplified image variants - no 3D effects, blur, or spring animations
  const imageVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  // Simplified slide animations
  const slideInFromLeft = {
    hidden: { 
      opacity: 0, 
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const slideInFromRight = {
    hidden: { 
      opacity: 0, 
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  // Simplified fade in up
  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  // Simplified scale in
  const scaleIn = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  // Simplified badge variant
  const badgeVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        delay: 0.2,
      },
    },
  };

  // Removed heavy animations: floating, confetti, shake, pulse glow, particles, and ripple effects for better performance
  
  useEffect(() => {
    if (!product) {
      navigate('/products');
      return;
    }
    
    // Reset image index when product changes
    setSelectedImageIndex(0);
    
    if (product.weight && product.weight.length > 0) {
      setSelectedWeight(product.weight[0]);
    }
    
    // Calculate delivery date (3-5 days)
    const deliveryDays = Math.floor(Math.random() * 3) + 3;
    const date = new Date();
    date.setDate(date.getDate() + deliveryDays);
    setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Sticky bar visibility on scroll
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product, navigate, id]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C1810] mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-[#D4AF37] text-[#2C1810] rounded-lg hover:bg-[#C5A572] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  
  // Normalize image paths - ensure they start with / if they're local paths
  const normalizeImagePath = (path: string) => {
    if (!path) return '';
    // If it's already a full URL (http/https), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // If it doesn't start with /, add it
    return path.startsWith('/') ? path : `/${path}`;
  };
  
  // Use product.image as primary, then product.images array
  const primaryImage = product.image ? normalizeImagePath(product.image) : '';
  const additionalImages = product.images ? product.images.map(normalizeImagePath).filter(img => img && img !== primaryImage) : [];
  const images = primaryImage ? [primaryImage, ...additionalImages] : additionalImages;
  
  // Price parsing
  const cleanedPrice = product.price.replace(/[^0-9.]/g, '');
  const numericPrice = parseFloat(cleanedPrice) || 0;
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) : null;
  
  // Handle add to cart - simplified without heavy animations
  const handleAddToCart = () => {
    const pricePerUnit = numericPrice;
    addToCart({
      id: product.id,
      image: product.image,
      name: `${product.name} (${selectedWeight})`,
      price: pricePerUnit,
    });
    
    // Simple feedback
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 1000);
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  
  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'verified') return review.verified;
    if (reviewFilter === 'with-images') return review.images && review.images.length > 0;
    return true;
  });
  
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (reviewFilter === 'helpful') return b.helpful - a.helpful;
    if (reviewFilter === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });
  
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 5);
  
  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    stars: star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));
  
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  // Related products
  const relatedProducts = allProductsData
    .filter(p => p.id !== product.id && (p.category === product.category || Math.random() > 0.7))
    .slice(0, 6);
  
  // Pincode check
  const handlePincodeCheck = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      // Simulate delivery date calculation
      const deliveryDays = Math.floor(Math.random() * 3) + 3;
      const date = new Date();
      date.setDate(date.getDate() + deliveryDays);
      setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }
  };
  
  // Removed magnetic button effects for better performance

  return (
    <motion.div 
      className="min-h-screen bg-[#FFF8E7] relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Removed confetti effect for better performance */}
      {/* Breadcrumb */}
      <motion.div 
        className="bg-white border-b border-[#F5E6D3] py-3"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex items-center space-x-2 text-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link to="/" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">
                Home
              </Link>
            </motion.div>
            <motion.span 
              className="text-[#C5A572]"
              variants={itemVariants}
            >
              /
            </motion.span>
            <motion.div variants={itemVariants}>
              <Link to="/products" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">
                Products
              </Link>
            </motion.div>
            <motion.span 
              className="text-[#C5A572]"
              variants={itemVariants}
            >
              /
            </motion.span>
            <motion.span 
              className="text-[#2C1810] font-medium"
              variants={itemVariants}
            >
              {product.name}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left Side - Image Gallery */}
          <motion.div 
            ref={imageRef}
            className="space-y-4"
            variants={slideInFromLeft}
          >
            {/* Main Image - No animations */}
            <div 
              className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              ref={imageRef}
            >
              <img
                key={`${product.id}-${selectedImageIndex}`}
                src={images[selectedImageIndex] || images[0] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x800?text=Image+Not+Available';
                }}
              />
              
              
              {/* Discount Badge - simplified */}
              {product.discount && (
                <motion.div
                  variants={badgeVariants}
                  className="absolute top-4 left-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#2C1810] px-4 py-2 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 z-10 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {product.discount}% OFF
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Thumbnail Gallery with enhanced animations */}
            <motion.div 
              className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', borderRadius: "10px" }}
              variants={itemVariants}
            >
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden relative ${
                    selectedImageIndex === index
                      ? 'ring-3 ring-[#D4AF37] ring-offset-2 shadow-lg'
                      : 'opacity-60'
                  }`} 
                  style={{cursor: "pointer", borderRadius: "10px"}}
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: selectedImageIndex === index ? 1 : 0.6,
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    opacity: 1,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
                    }} 
                    style={{borderRadius: "10px"}}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  {selectedImageIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Product Description Accordion - Moved to left side */}
            <motion.div 
              className="pt-4"
              variants={itemVariants}
            >
              <Accordion type="single" collapsible className="w-full">
                <motion.div variants={fadeInUp}>
                  <AccordionItem value="description" className="bg-white border border-[#D4AF37] rounded-lg p-3 shadow-sm transition-all duration-300">
                    <AccordionTrigger className="text-[#2C1810] font-semibold hover:text-[#D4AF37] hover:no-underline py-2 cursor-pointer">
                      Product Description
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <motion.div 
                        className="bg-[#F5E6D3]/30 rounded-lg p-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-[#5C4033] whitespace-pre-line leading-relaxed">{product.description}</p>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <AccordionItem value="specifications" className="bg-white border border-[#D4AF37] rounded-lg p-3 shadow-sm mt-3 transition-all duration-300">
                    <AccordionTrigger className="text-[#2C1810] font-semibold hover:text-[#D4AF37] hover:no-underline py-2 cursor-pointer">
                      Specifications & Details
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <motion.div 
                        className="bg-[#F5E6D3]/30 rounded-lg p-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <table className="w-full">
                          <tbody className="divide-y divide-[#F5E6D3]">
                            {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                              <motion.tr 
                                key={key} 
                                className="hover:bg-white/50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 5 }}
                              >
                                <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">{key}</td>
                                <td className="py-2 text-[#5C4033]">{value}</td>
                              </motion.tr>
                            ))}
                            {product.manufacturer && (
                              <motion.tr 
                                className="hover:bg-white/50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Manufacturer</td>
                                <td className="py-2 text-[#5C4033]">{product.manufacturer}</td>
                              </motion.tr>
                            )}
                            {product.ingredients && (
                              <motion.tr 
                                className="hover:bg-white/50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Ingredients</td>
                                <td className="py-2 text-[#5C4033]">{product.ingredients}</td>
                              </motion.tr>
                            )}
                            {product.warranty && (
                              <motion.tr 
                                className="hover:bg-white/50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Warranty</td>
                                <td className="py-2 text-[#5C4033]">{product.warranty}</td>
                              </motion.tr>
                            )}
                          </tbody>
                        </table>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </Accordion>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Product Information */}
          <motion.div 
            variants={slideInFromRight}
            className="space-y-6"
          >
            {/* Product Title & Rating with Enhanced Animations */}
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-3 font-serif relative"
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
                whileHover={{ scale: 1.02 }}
              >
                {product.name}
                {/* Subtle underline animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </motion.h1>
              
              <motion.div 
                className="flex items-center gap-3 mb-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="flex items-center gap-1"
                  variants={containerVariants}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      variants={itemVariants}
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </motion.div>
                  ))}
                </motion.div>
                <motion.span 
                  className="text-lg font-semibold text-[#2C1810]"
                  variants={itemVariants}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {averageRating.toFixed(1)}
                </motion.span>
                <motion.a
                  href="#reviews"
                  className="text-sm text-[#5C4033] hover:text-[#D4AF37] underline transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ({reviews.length} Reviews)
                </motion.a>
              </motion.div>
            </motion.div>
            
            {/* Combined Product Details Box */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3] space-y-6" 
              style={{borderRadius: "15px"}}
              variants={scaleIn}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              {/* Pricing with Enhanced Animations */}
              <motion.div 
                className="pb-6 border-b border-[#F5E6D3]"
                variants={itemVariants}
              >
                <div className="flex items-baseline gap-3 mb-2 relative">
                  <motion.span 
                    className="text-4xl font-bold text-[#2C1810] relative"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {product.price}
                    {/* Pulse effect */}
                    <motion.span
                      className="absolute inset-0 bg-[#D4AF37]/20 rounded blur-xl -z-10"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.span>
                  {originalPrice && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span 
                        className="text-xl text-gray-400 line-through"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        {product.originalPrice}
                      </motion.span>
                      <motion.span 
                        className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#2C1810] px-3 py-1 rounded-full font-bold text-sm relative overflow-hidden"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                      >
                        <motion.span
                          className="absolute inset-0 bg-white/30"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <span className="relative z-10">Save {product.discount}%</span>
                      </motion.span>
                    </motion.div>
                  )}
                </div>
                <motion.p 
                  className="text-sm text-[#5C4033] flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity, repeatDelay: 3 },
                      rotate: { duration: 0.5, delay: 0.5 }
                    }}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </motion.div>
                  Inclusive of all taxes
                </motion.p>
              </motion.div>
              
              {/* Delivery Information */}
              <motion.div 
                className="pb-6 border-b border-[#F5E6D3]"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3 mb-4">
                  <motion.div 
                    className="bg-[#D4AF37]/10 p-2.5 rounded-lg"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2C1810] mb-3">Delivery Information</h3>
                    <div className="flex gap-2 mb-3">
                      <motion.div
                        whileFocus={{ scale: 1.05 }}
                      >
                        <Input
                          type="text"
                          placeholder="Enter pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          maxLength={6}
                          className="max-w-[140px] border border-[#C5A572] focus:border-[#D4AF37] rounded-lg bg-white"
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handlePincodeCheck}
                          className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] !rounded-lg"
                          style={{cursor: "pointer"}}
                        >
                          Check
                        </Button>
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {deliveryDate && (
                        <motion.div 
                          className="bg-[#F5E6D3]/50 rounded-lg p-3 mb-3"
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <p className="text-sm text-[#5C4033] flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              <Clock className="w-4 h-4 text-[#D4AF37]" />
                            </motion.div>
                            Delivery by <span className="font-semibold text-[#2C1810]">{deliveryDate}</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </motion.div>
                      <p className="text-sm font-medium text-[#2C1810]">
                        {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Weight Selection */}
              {product.weight && product.weight.length > 1 && (
                <motion.div 
                  className="pb-6 border-b border-[#F5E6D3]"
                  variants={itemVariants}
                >
                  <p className="font-semibold text-[#2C1810] mb-4">Select Weight:</p>
                  <motion.div 
                    className="flex flex-wrap gap-3" 
                    style={{paddingBottom: "10px "}}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {product.weight.map((weight, index) => (
                      <motion.button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-5 py-2.5 rounded-lg border-2 font-medium ${
                          selectedWeight === weight
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#2C1810] shadow-sm'
                            : 'border-[#F5E6D3] bg-white text-[#5C4033] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'
                        }`} 
                        style={{padding: "10px 20px", cursor: "pointer"}}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: selectedWeight === weight ? 1.05 : 1,
                          y: selectedWeight === weight ? -2 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {weight}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
              
              {/* Quantity Selector */}
              <motion.div 
                className="pb-6 border-b border-[#F5E6D3]"
                variants={itemVariants}
              >
                <div className="flex items-center gap-4" style={{paddingBottom: "10px "}}>
                  <span className="font-semibold text-[#2C1810]">Quantity:</span>
                  <motion.div 
                    className="flex items-center border border-[#F5E6D3] rounded-lg overflow-hidden bg-white"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
                      style={{cursor: "pointer"}}
                      whileHover={{ scale: 1.1, backgroundColor: "#F5E6D3" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <motion.span 
                      className="px-6 py-2 border-x border-[#F5E6D3] bg-[#F5E6D3]/30 font-semibold text-lg text-[#2C1810] min-w-[50px] text-center"
                      key={quantity}
                      initial={{ scale: 1.3, color: "#D4AF37" }}
                      animate={{ scale: 1, color: "#2C1810" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
                      style={{cursor: "pointer"}}
                      whileHover={{ scale: 1.1, backgroundColor: "#F5E6D3" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    </motion.div>
                    <h3 className="font-semibold text-[#2C1810]">Key Features</h3>
                  </div>
                  <motion.ul 
                    className="space-y-2.5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {product.features.map((feature, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3 text-sm text-[#5C4033]"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2, repeatDelay: 3 }}
                        >
                          <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </motion.div>
            
            {/* Action Buttons with Enhanced Animations */}
            <motion.div 
              className="space-y-3 pt-2"
              variants={itemVariants}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] w-full text-base font-semibold !rounded-lg shadow-lg"
                    style={{cursor: "pointer"}}
                  >
                    Buy Now
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] w-full text-base font-semibold !rounded-lg"
                    style={{cursor: "pointer"}}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 inline" />
                    {addedToCart ? 'Added!' : 'Add to Cart'}
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    size="lg"
                    variant="outline"
                    className={`border-2 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] !rounded-lg relative overflow-hidden ${
                      isWishlisted ? 'bg-[#D4AF37]/10' : ''
                    }`}
                    style={{cursor: "pointer"}}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Trust Badges - Enhanced with Floating Animation */}
            <motion.div 
              className="flex justify-between gap-4 pt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: Award, text: "Premium Quality" },
                { icon: Shield, text: "Secure Payment" },
                { icon: Package, text: "Easy Returns" }
              ].map((badge, index) => (
                <div 
                  key={index}
                  className="flex-1 h-24 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#D4AF37] shadow-sm relative overflow-hidden"
                >
                  <badge.icon className="w-5 h-5 text-[#D4AF37] mb-1.5" />
                  <p className="text-xs font-medium text-[#5C4033] text-center">{badge.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      
      {/* Reviews Section with Scroll-triggered Animations */}
      <motion.div 
        id="reviews" 
        className="bg-[#FFF8E7] py-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decoration */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-[#2C1810] mb-2 font-serif"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Customer Reviews
            </motion.h2>
            <motion.div 
              className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-[#F4D03F] rounded-full"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Rating Breakdown */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="bg-white p-6 rounded-xl border border-[#F5E6D3] shadow-sm sticky top-4">
                <div className="text-center mb-6">
                  <motion.div 
                    className="text-5xl font-bold text-[#2C1810] mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {averageRating.toFixed(1)}
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-center gap-1 mb-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        variants={itemVariants}
                        whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= Math.round(averageRating)
                              ? 'fill-[#D4AF37] text-[#D4AF37]'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                  <p className="text-sm text-[#5C4033]">{reviews.length} Reviews</p>
                </div>
                
                <motion.div 
                  className="space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {ratingBreakdown.map(({ stars, count, percentage }, index) => (
                    <motion.div 
                      key={stars} 
                      className="flex items-center gap-2"
                      variants={itemVariants}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-sm text-[#5C4033] w-6">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#D4AF37] rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs text-[#5C4033] w-6">{count}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Reviews List */}
            <div className="lg:col-span-3">
              {/* Review Filters */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {['all', 'recent', 'helpful', 'verified'].map((filter, index) => (
                  <motion.div
                    key={filter}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={reviewFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setReviewFilter(filter)}
                      className={`${reviewFilter === filter ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]' : 'border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]'} !rounded-lg`}
                      style={{cursor: "pointer"}}
                    >
                      {filter === 'all' && 'All'}
                      {filter === 'recent' && 'Most Recent'}
                      {filter === 'helpful' && 'Most Helpful'}
                      {filter === 'verified' && 'Verified Purchase'}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Reviews */}
              <AnimatePresence mode="wait">
                <motion.div 
                  className="space-y-4"
                  key={reviewFilter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {displayedReviews.map((review, index) => (
                    <motion.div 
                      key={review.id} 
                      className="bg-white p-5 rounded-xl border border-[#F5E6D3] shadow-sm"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#2C1810]">{review.userName}</h4>
                            {review.verified && (
                              <motion.span 
                                className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                              >
                                <Check className="w-3 h-3" />
                                Verified
                              </motion.span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.div
                                  key={star}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.1 * star, type: "spring", stiffness: 200 }}
                                  whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <span className="text-xs text-[#5C4033]">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold text-[#2C1810] mb-2">{review.title}</h5>
                      <p className="text-[#5C4033] mb-4 text-sm leading-relaxed">{review.text}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <motion.div 
                          className="flex gap-2 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {review.images.map((img, idx) => (
                            <motion.img 
                              key={idx} 
                              src={img} 
                              alt={`Review ${idx + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4 + idx * 0.1 }}
                              whileHover={{ scale: 1.1, zIndex: 10 }}
                            />
                          ))}
                        </motion.div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-[#5C4033]">
                        <motion.button 
                          className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
                          whileHover={{ scale: 1.1, x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <HelpCircle className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              
              {sortedReviews.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="mt-6 border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] !rounded-lg"
                      style={{cursor: "pointer"}}
                    >
                      {showAllReviews ? 'Show Less' : `Show All ${sortedReviews.length} Reviews`}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Related Products with Enhanced Scroll Animations */}
      {relatedProducts.length > 0 && (
        <motion.div 
          className="bg-white py-12 border-t border-[#F5E6D3] relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="flex items-center justify-between mb-8">
              <motion.h2 
                className="text-3xl font-bold text-[#2C1810] font-serif relative"
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
              >
                You May Also Like
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.h2>
            </motion.div>
            
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.1, 
                        type: "spring", 
                        stiffness: 150,
                        damping: 15
                      }}
                      whileHover={{ 
                        y: -10, 
                        scale: 1.03,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                      <Link to={`/product/${product.id}`}>
                        <ProductCard
                          id={product.id}
                          image={product.image}
                          name={product.name}
                          description={product.description}
                          price={product.price}
                        />
                      </Link>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <motion.div
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <CarouselPrevious className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810] transition-all" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <CarouselNext className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810] transition-all" />
              </motion.div>
            </Carousel>
          </div>
        </motion.div>
      )}
      
      {/* Fullscreen Image Dialog */}
      <AnimatePresence>
        {isFullscreen && (
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogContent className="max-w-6xl bg-transparent border-none">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/1200x1200?text=Image+Not+Available';
                    }}
                  />
                </AnimatePresence>
                <motion.button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                {images.length > 1 && (
                  <>
                    <motion.button
                      onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
      
      {/* Sticky Mobile Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4AF37] shadow-2xl z-50 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2C1810] line-clamp-1">{product.name}</p>
                  <p className="text-lg font-bold text-[#D4AF37]">{product.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] !rounded-lg"
                    style={{cursor: "pointer"}}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="sm"
                    className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] !rounded-lg"
                    style={{cursor: "pointer"}}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
