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
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#F5E6D3] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-[#C5A572]">/</span>
            <Link to="/products" className="text-[#5C4033] hover:text-[#D4AF37] transition-colors">Products</Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-[#2C1810] font-medium">{product.name}</span>
          </div>
        </div>
      </div>
      
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
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
              
              {/* Discount Badge */}
              {product.discount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-[#D4AF37] text-[#2C1810] px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.discount}% OFF
                </motion.div>
              )}
            </motion.div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', borderRadius: "10px" }}>
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-[#D4AF37] ring-offset-2 scale-105'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`} style={{cursor: "pointer", borderRadius: "10px"}}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
                    }} style={{borderRadius: "10px"}}
                  />
                </button>
              ))}
            </div>

            {/* Product Description Accordion - Moved to left side */}
            <div className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="bg-white border border-[#D4AF37] rounded-lg p-3 shadow-sm transition-all duration-300">
                  <AccordionTrigger className="text-[#2C1810] font-semibold hover:text-[#D4AF37] hover:no-underline py-2 cursor-pointer">
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="bg-[#F5E6D3]/30 rounded-lg p-3">
                      <p className="text-[#5C4033] whitespace-pre-line leading-relaxed">{product.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="specifications" className="bg-white border border-[#D4AF37] rounded-lg p-3 shadow-sm mt-3 transition-all duration-300">
                  <AccordionTrigger className="text-[#2C1810] font-semibold hover:text-[#D4AF37] hover:no-underline py-2 cursor-pointer">
                    Specifications & Details
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="bg-[#F5E6D3]/30 rounded-lg p-3">
                      <table className="w-full">
                        <tbody className="divide-y divide-[#F5E6D3]">
                          {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key} className="hover:bg-white/50 transition-colors">
                              <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">{key}</td>
                              <td className="py-2 text-[#5C4033]">{value}</td>
                            </tr>
                          ))}
                          {product.manufacturer && (
                            <tr className="hover:bg-white/50 transition-colors">
                              <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Manufacturer</td>
                              <td className="py-2 text-[#5C4033]">{product.manufacturer}</td>
                            </tr>
                          )}
                          {product.ingredients && (
                            <tr className="hover:bg-white/50 transition-colors">
                              <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Ingredients</td>
                              <td className="py-2 text-[#5C4033]">{product.ingredients}</td>
                            </tr>
                          )}
                          {product.warranty && (
                            <tr className="hover:bg-white/50 transition-colors">
                              <td className="py-2 pr-8 font-semibold text-[#2C1810] w-1/3">Warranty</td>
                              <td className="py-2 text-[#5C4033]">{product.warranty}</td>
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
          
          {/* Right Side - Product Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-3 font-serif">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-[#2C1810]">{averageRating.toFixed(1)}</span>
                <a
                  href="#reviews"
                  className="text-sm text-[#5C4033] hover:text-[#D4AF37] underline transition-colors"
                >
                  ({reviews.length} Reviews)
                </a>
              </div>
            </div>
            
            {/* Combined Product Details Box */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3] space-y-6" style={{borderRadius: "15px"}}>
              {/* Pricing */}
              <div className="pb-6 border-b border-[#F5E6D3]">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-[#2C1810]">
                    {product.price}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                      <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-md font-semibold text-sm">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-[#5C4033] flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Inclusive of all taxes
                </p>
              </div>
              
              {/* Delivery Information */}
              <div className="pb-6 border-b border-[#F5E6D3]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-[#D4AF37]/10 p-2.5 rounded-lg">
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2C1810] mb-3">Delivery Information</h3>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                        className="max-w-[140px] border border-[#C5A572] focus:border-[#D4AF37] rounded-lg bg-white"
                      />
                      <Button
                        onClick={handlePincodeCheck}
                        className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] !rounded-lg"
                        style={{cursor: "pointer"}}
                      >
                        Check
                      </Button>
                    </div>
                    {deliveryDate && (
                      <div className="bg-[#F5E6D3]/50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-[#5C4033] flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#D4AF37]" />
                          Delivery by <span className="font-semibold text-[#2C1810]">{deliveryDate}</span>
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-[#2C1810]">
                        {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weight Selection */}
              {product.weight && product.weight.length > 1 && (
                <div className="pb-6 border-b border-[#F5E6D3]">
                  <p className="font-semibold text-[#2C1810] mb-4">Select Weight:</p>
                  <div className="flex flex-wrap gap-3" style={{paddingBottom: "10px "}}>
                    {product.weight.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-5 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium ${
                          selectedWeight === weight
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#2C1810] shadow-sm'
                            : 'border-[#F5E6D3] bg-white text-[#5C4033] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'
                        }`} style={{padding: "10px 20px"}}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="pb-6 border-b border-[#F5E6D3]">
                <div className="flex items-center gap-4" style={{paddingBottom: "10px "}}>
                  <span className="font-semibold text-[#2C1810]">Quantity:</span>
                  <div className="flex items-center border border-[#F5E6D3] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 border-x border-[#F5E6D3] bg-[#F5E6D3]/30 font-semibold text-lg text-[#2C1810] min-w-[50px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-[#2C1810] hover:bg-[#F5E6D3] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-semibold text-[#2C1810]">Key Features</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-[#5C4033]">
                        <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] flex-1 text-base font-semibold !rounded-lg shadow-sm"
                  style={{cursor: "pointer"}}
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] flex-1 text-base font-semibold !rounded-lg"
                  style={{cursor: "pointer"}}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  size="lg"
                  variant="outline"
                  className={`border-2 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] !rounded-lg ${
                    isWishlisted ? 'bg-[#D4AF37]/10' : ''
                  }`}
                  style={{cursor: "pointer"}}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Trust Badges - Moved to right side with equal spacing */}
            <div className="flex justify-between gap-4 pt-4">
              <div className="flex-1 h-24 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#D4AF37] shadow-sm">
                <Award className="w-5 h-5 text-[#D4AF37] mb-1.5" />
                <p className="text-xs font-medium text-[#5C4033] text-center">Premium Quality</p>
              </div>
              <div className="flex-1 h-24 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#D4AF37] shadow-sm">
                <Shield className="w-5 h-5 text-[#D4AF37] mb-1.5" />
                <p className="text-xs font-medium text-[#5C4033] text-center">Secure Payment</p>
              </div>
              <div className="flex-1 h-24 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#D4AF37] shadow-sm">
                <Package className="w-5 h-5 text-[#D4AF37] mb-1.5" />
                <p className="text-xs font-medium text-[#5C4033] text-center">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      
      {/* Reviews Section */}
      <div id="reviews" className="bg-[#FFF8E7] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-2 font-serif">Customer Reviews</h2>
            <div className="h-1 w-20 bg-[#D4AF37] rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Rating Breakdown */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-[#F5E6D3] shadow-sm sticky top-4">
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
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#5C4033]">{reviews.length} Reviews</p>
                </div>
                
                <div className="space-y-2">
                  {ratingBreakdown.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-[#5C4033] w-6">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#5C4033] w-6">{count}</span>
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
                  className={`${reviewFilter === 'all' ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]' : 'border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]'} !rounded-lg`}
                  style={{cursor: "pointer"}}
                >
                  All
                </Button>
                <Button
                  variant={reviewFilter === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('recent')}
                  className={`${reviewFilter === 'recent' ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]' : 'border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]'} !rounded-lg`}
                  style={{cursor: "pointer"}}
                >
                  Most Recent
                </Button>
                <Button
                  variant={reviewFilter === 'helpful' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('helpful')}
                  className={`${reviewFilter === 'helpful' ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]' : 'border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]'} !rounded-lg`}
                  style={{cursor: "pointer"}}
                >
                  Most Helpful
                </Button>
                <Button
                  variant={reviewFilter === 'verified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('verified')}
                  className={`${reviewFilter === 'verified' ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]' : 'border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]'} !rounded-lg`}
                  style={{cursor: "pointer"}}
                >
                  Verified Purchase
                </Button>
              </div>
              
              {/* Reviews */}
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="bg-white p-5 rounded-xl border border-[#F5E6D3] shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[#2C1810]">{review.userName}</h4>
                          {review.verified && (
                            <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Verified
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
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#5C4033]">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="font-semibold text-[#2C1810] mb-2">{review.title}</h5>
                    <p className="text-[#5C4033] mb-4 text-sm leading-relaxed">{review.text}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt={`Review ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-[#5C4033]">
                      <button className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
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
                  className="mt-6 border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810] !rounded-lg"
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
        <div className="bg-white py-12 border-t border-[#F5E6D3]">
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
    </div>
  );
}
