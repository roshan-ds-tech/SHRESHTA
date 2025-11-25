import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingCart, Heart, Truck, MapPin, Check, 
  X, ChevronLeft, ChevronRight, HelpCircle,
  Award, Shield, Package, Clock, Sparkles
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
  
  useEffect(() => {
    if (!product) {
      navigate('/products');
      return;
    }
    
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
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  // Normalize image paths - ensure they start with / if they're local paths
  const normalizeImagePath = (path: string) => {
    // If it's already a full URL (http/https), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // If it doesn't start with /, add it
    return path.startsWith('/') ? path : `/${path}`;
  };
  
  const images = (product.images || [product.image]).map(normalizeImagePath);
  
  // Price parsing
  const cleanedPrice = product.price.replace(/[^0-9.]/g, '');
  const numericPrice = parseFloat(cleanedPrice) || 0;
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) : null;
  
  // Handle add to cart
  const handleAddToCart = () => {
    const pricePerUnit = numericPrice;
    addToCart({
      id: product.id,
      image: product.image,
      name: `${product.name} (${selectedWeight})`,
      price: pricePerUnit,
    });
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] via-white to-[#FFF8E7]">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-[#F5E6D3] to-[#FFF8E7] py-4 border-b-2 border-[#C5A572]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Link to="/" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-[#C5A572]">/</span>
            <Link to="/products" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">Products</Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-[#2C1810] font-semibold">{product.name}</span>
          </div>
        </div>
      </div>
      
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side - Image Gallery (40-45%) */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-gradient-to-br from-white to-[#F5E6D3]/30 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A572]/30 group cursor-pointer transition-all duration-300 hover:shadow-3xl hover:border-[#D4AF37]/50"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x800?text=Image+Not+Available';
                }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Discount Badge */}
              {product.discount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-5 left-5 bg-gradient-to-r from-[#D4AF37] to-[#C5A572] text-[#2C1810] px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  {product.discount}% OFF
                </motion.div>
              )}
              
              {/* Fullscreen indicator */}
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-[#2C1810] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-lg ${
                    selectedImageIndex === index
                      ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/30 shadow-[#D4AF37]/20 scale-105'
                      : 'border-[#C5A572]/30 hover:border-[#D4AF37]/60 hover:scale-102 hover:shadow-xl'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
                    }}
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#2C1810] bg-white rounded-full p-0.5" />
                    </div>
                  )}
                </button>
              ))}
              
              {product.video && (
                <button
                  className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-[#C5A572]/30 hover:border-[#D4AF37]/60 relative shadow-lg hover:scale-102 transition-all duration-300"
                >
                  <video
                    src={product.video}
                    className="w-full h-full object-cover"
                    muted
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/90 rounded-full p-2">
                      <svg className="w-4 h-4 text-[#2C1810]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
            </div>
            
            {/* View 360 / Video options placeholder */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-2 border-[#C5A572]/40 text-[#2C1810] hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-[#C5A572]/10 hover:border-[#D4AF37] flex-1 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">360° View</span>
              </Button>
            </div>
          </div>
          
          {/* Right Side - Product Information (55-60%) */}
          <div className="space-y-6">
            {/* Product Title */}
            <div className="pb-4 border-b border-[#C5A572]/20">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-4 font-serif leading-tight">
                {product.name}
              </h1>
              
              {/* Ratings & Reviews Summary */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'fill-[#C5A572]/20 text-[#C5A572]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[#2C1810] font-bold text-lg">{averageRating.toFixed(1)}</span>
                </div>
                <a
                  href="#reviews"
                  className="text-[#5C4033] hover:text-[#D4AF37] underline text-sm font-medium transition-colors"
                >
                  ({product.reviewCount || reviews.length} Ratings & {reviews.length} Reviews)
                </a>
              </div>
            </div>
            
            {/* Pricing Section */}
            <div className="bg-gradient-to-br from-[#F5E6D3] via-[#FFF8E7] to-[#F5E6D3] p-6 rounded-2xl border-2 border-[#D4AF37]/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                  <span className="text-4xl font-bold text-[#2C1810]">
                    {product.price}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-2xl text-[#5C4033] line-through opacity-60">
                        {product.originalPrice}
                      </span>
                      <span className="bg-[#D4AF37] text-[#2C1810] px-3 py-1 rounded-full font-bold text-sm shadow-md">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#5C4033] flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">Inclusive of all taxes</span>
                  </p>
                  <p className="text-xs text-[#5C4033] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    Delivery charges: <span className="font-bold text-green-600">FREE</span> on orders above ₹500
                  </p>
                </div>
              </div>
            </div>
            
            {/* Delivery Section */}
            <div className="bg-white border-2 border-[#C5A572]/30 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#D4AF37]/10 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2C1810] mb-3 text-lg">Delivery Information</p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="max-w-[160px] border-2 border-[#C5A572]/40 focus:border-[#D4AF37] rounded-lg"
                    />
                    <Button
                      onClick={handlePincodeCheck}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#C5A572] text-[#2C1810] hover:from-[#C5A572] hover:to-[#D4AF37] font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      style={{cursor: "pointer"}}
                    >
                      Check
                    </Button>
                  </div>
                  {deliveryDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                      <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Delivery by <span className="font-bold">{deliveryDate}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="bg-green-100 rounded-full p-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700 font-semibold">
                      {product.inStock ? '✓ In Stock - Ready to Ship' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Variants Section */}
            {product.weight && product.weight.length > 1 && (
              <div className="bg-white border-2 border-[#C5A572]/30 rounded-xl p-5 shadow-md">
                <p className="font-bold text-[#2C1810] mb-4 text-lg">Select Weight:</p>
                <div className="flex flex-wrap gap-3">
                  {product.weight.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-5 py-3 rounded-xl border-2 transition-all duration-300 font-semibold shadow-md hover:shadow-lg ${
                        selectedWeight === weight
                          ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37] to-[#C5A572] text-[#2C1810] scale-105 shadow-[#D4AF37]/30'
                          : 'border-[#C5A572]/40 bg-white text-[#5C4033] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5'
                      }`}
                    >
                      {selectedWeight === weight && <Check className="w-5 h-5 inline mr-2" />}
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="bg-white border-2 border-[#C5A572]/30 rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#2C1810] text-lg">Quantity:</span>
                <div className="flex items-center border-2 border-[#C5A572]/40 rounded-xl overflow-hidden shadow-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-[#2C1810] hover:bg-[#D4AF37]/10 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x-2 border-[#C5A572]/40 bg-[#F5E6D3]/50 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-[#2C1810] hover:bg-[#D4AF37]/10 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Features & Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gradient-to-br from-[#F5E6D3]/50 to-white border-2 border-[#D4AF37]/20 rounded-xl p-5 shadow-md">
                <p className="font-bold text-[#2C1810] mb-4 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Key Features
                </p>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-[#5C4033]">
                      <div className="bg-[#D4AF37] rounded-full p-1 mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-[#2C1810]" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Call-To-Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C5A572] text-[#2C1810] hover:from-[#C5A572] hover:to-[#D4AF37] flex-1 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={{cursor: "pointer"}}
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#D4AF37] text-[#2C1810] hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-[#C5A572]/10 flex-1 text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300"
                  style={{cursor: "pointer"}}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  size="lg"
                  variant="outline"
                  className={`border-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                    isWishlisted
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[#D4AF37]/20'
                      : 'border-[#C5A572]/40 hover:border-[#D4AF37]'
                  }`}
                  style={{cursor: "pointer"}}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''} transition-all duration-300`} />
                </Button>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-[#C5A572]/30">
              <div className="text-center p-4 bg-white rounded-xl border border-[#C5A572]/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-[#D4AF37]/10 rounded-full p-2 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-[#5C4033] font-semibold">Premium Quality</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-[#C5A572]/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-[#D4AF37]/10 rounded-full p-2 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-[#5C4033] font-semibold">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-[#C5A572]/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-[#D4AF37]/10 rounded-full p-2 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-[#5C4033] font-semibold">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Product Information */}
      <div className="bg-white border-t-2 border-[#C5A572]/30 py-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="description" className="bg-white border-2 border-[#C5A572]/30 rounded-xl px-5 shadow-md">
              <AccordionTrigger className="text-[#2C1810] font-bold text-lg hover:no-underline py-6">
                Product Description
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="bg-[#F5E6D3]/30 rounded-lg p-5 border border-[#C5A572]/20">
                  <p className="text-[#5C4033] whitespace-pre-line leading-relaxed">{product.description}</p>
                  {product.features && (
                    <ul className="mt-4 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-[#5C4033]">
                          <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="specifications" className="bg-white border-2 border-[#C5A572]/30 rounded-xl px-5 shadow-md">
              <AccordionTrigger className="text-[#2C1810] font-bold text-lg hover:no-underline py-6">
                Specifications & Details
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="bg-gradient-to-br from-white to-[#F5E6D3]/20 rounded-lg p-5 border border-[#C5A572]/20">
                  <table className="w-full">
                    <tbody className="divide-y divide-[#C5A572]/20">
                      {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="hover:bg-[#F5E6D3]/30 transition-colors">
                          <td className="py-3 pr-8 font-bold text-[#2C1810] w-1/3">{key}</td>
                          <td className="py-3 text-[#5C4033] font-medium">{value}</td>
                        </tr>
                      ))}
                      {product.manufacturer && (
                        <tr className="hover:bg-[#F5E6D3]/30 transition-colors">
                          <td className="py-3 pr-8 font-bold text-[#2C1810] w-1/3">Manufacturer</td>
                          <td className="py-3 text-[#5C4033] font-medium">{product.manufacturer}</td>
                        </tr>
                      )}
                      {product.ingredients && (
                        <tr className="hover:bg-[#F5E6D3]/30 transition-colors">
                          <td className="py-3 pr-8 font-bold text-[#2C1810] w-1/3">Ingredients</td>
                          <td className="py-3 text-[#5C4033] font-medium">{product.ingredients}</td>
                        </tr>
                      )}
                      {product.warranty && (
                        <tr className="hover:bg-[#F5E6D3]/30 transition-colors">
                          <td className="py-3 pr-8 font-bold text-[#2C1810] w-1/3">Warranty</td>
                          <td className="py-3 text-[#5C4033] font-medium">{product.warranty}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div id="reviews" className="bg-gradient-to-b from-white to-[#FFF8E7] py-12 border-t-2 border-[#C5A572]/30 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[#2C1810] mb-2 font-serif">Customer Reviews</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-[#C5A572] rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Rating Breakdown */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-[#C5A572]/20 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-[#2C1810] mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'fill-[#C5A572]/20 text-[#C5A572]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#5C4033]">{reviews.length} Reviews</p>
                </div>
                
                <div className="space-y-2">
                  {ratingBreakdown.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-[#5C4033] w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-[#C5A572]/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#5C4033] w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="lg:col-span-3">
              {/* Review Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={reviewFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('all')}
                  className={reviewFilter === 'all' ? 'bg-[#D4AF37] text-[#2C1810]' : ''}
                  style={{cursor: "pointer"}}
                >
                  All
                </Button>
                <Button
                  variant={reviewFilter === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('recent')}
                  className={reviewFilter === 'recent' ? 'bg-[#D4AF37] text-[#2C1810]' : ''}
                  style={{cursor: "pointer"}}
                >
                  Most Recent
                </Button>
                <Button
                  variant={reviewFilter === 'helpful' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('helpful')}
                  className={reviewFilter === 'helpful' ? 'bg-[#D4AF37] text-[#2C1810]' : ''}
                  style={{cursor: "pointer"}}
                >
                  Most Helpful
                </Button>
                <Button
                  variant={reviewFilter === 'verified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('verified')}
                  className={reviewFilter === 'verified' ? 'bg-[#D4AF37] text-[#2C1810]' : ''}
                  style={{cursor: "pointer"}}
                >
                  Verified Purchase
                </Button>
              </div>
              
              {/* Reviews */}
              <div className="space-y-6">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg border border-[#C5A572]/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[#2C1810]">{review.userName}</h4>
                          {review.verified && (
                            <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                    : 'fill-[#C5A572]/20 text-[#C5A572]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#5C4033]">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="font-semibold text-[#2C1810] mb-2">{review.title}</h5>
                    <p className="text-[#5C4033] mb-4">{review.text}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt={`Review ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-[#5C4033]">
                      <button className="flex items-center gap-1 hover:text-[#D4AF37]">
                        <HelpCircle className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {sortedReviews.length > 5 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-6 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/10"
                  style={{cursor: "pointer"}}
                >
                  {showAllReviews ? 'Show Less' : `Show All ${sortedReviews.length} Reviews`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white py-12 border-t border-[#C5A572]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 font-serif">You May Also Like</h2>
            
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link to={`/product/${product.id}`}>
                      <ProductCard
                        id={product.id}
                        image={product.image}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810]" />
              <CarouselNext className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810]" />
            </Carousel>
          </div>
        </div>
      )}
      
      {/* Fullscreen Image Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl bg-transparent border-none">
          <div className="relative">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/1200x1200?text=Image+Not+Available';
              }}
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Sticky Mobile Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-2xl z-50 lg:hidden"
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
                    className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                    style={{cursor: "pointer"}}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="sm"
                    className="bg-[#2C1810] text-[#FFF8E7] hover:bg-[#3E2723]"
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
    </div>
  );
}

