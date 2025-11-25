import React from "react";
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { HoverVideoPlayer } from '../components/HoverVideoPlayer';
import { Link } from 'react-router-dom';
import { Leaf, Award, Heart, Truck, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';

const products = [
  {
    id: 1,
    image: '/jaggery-solid-regular.jpg',
    name: 'Cube Jaggery',
    description: 'Perfect cubes of pure jaggery, ideal for daily use and traditional recipes.',
    price: "299/kg",
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1671548185843-3f50c6c1060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGxpcXVpZCUyMGdvbGRlbnxlbnwxfHx8fDE3NjEzMTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Liquid Jaggery',
    description: 'Smooth, golden liquid jaggery perfect for drinks, desserts, and marinades.',
    price: "349/L",
  },
  {
    id: 3,
    image: '/jaggery-powder2.webp',
    name: 'Powder Jaggery',
    description: 'Finely powdered jaggery for easy mixing in beverages and baking.',
    price: "279/kg",
  },
];

const premiumproducts = [
  {
    id: 4,
    url: '/jaggery-cubes1 (online-video-cutter.com).mp4',
    image: '/jaggery-cube1_video.jpeg',
    name: 'Cube Jaggery',
    description: 'Perfect cubes of pure jaggery, ideal for daily use and traditional recipes.',
    price: '₹299/kg',
  },
  {
    id: 5,
    url: '/hover_video2 (online-video-cutter.com).mp4',
    image: '/hoveer_image2.jpeg',
    name: 'Liquid Jaggery',
    description: 'Smooth, golden liquid jaggery perfect for drinks, desserts, and marinades.',
    price: '₹349/kg',
  },
  {
    id: 6,
    url: '/hover_video3 (online-video-cutter.com).mp4',
    image: '/hover_video3.jpeg',
    name: 'Powder Jaggery',
    description: 'Finely powdered jaggery for easy mixing in beverages and baking.',
    price: '₹279/kg',
  },
];

const features = [
  {
    icon: Leaf,
    title: '100% Pure',
    description: 'Sourced from certified sugarcane farms',
  },
  {
    icon: Award,
    title: 'Chemical-Free',
    description: 'No additives, preservatives, or artificial colors',
  },
  {
    icon: Heart,
    title: 'Farm Fresh',
    description: 'Directly from farm to your table',
  },
  {
    icon: Truck,
    title: 'Traditional Process',
    description: 'Made using age-old traditional methods',
  },
];

const testimonials = [
  {
    name: 'Roshan DS',
    text: 'The quality is exceptional! I can taste the purity in every bite. My family loves it.',
    rating: 5,
  },
  {
    name: 'Prasanna Kumar',
    text: 'Best jaggery I have ever purchased. Authentic taste and premium quality.',
    rating: 5,
  },
  {
    name: 'Nithin',
    text: 'Worth every penny! The liquid jaggery is my favorite for making desserts.',
    rating: 5,
  },
];

export function HomePage() {
  const { addToCart } = useCart();

  const handleAddToCart = (premiumproduct: typeof premiumproducts[0]) => {
    // Parse price string (e.g., '₹299/kg' -> 299)
    const cleanedPrice = premiumproduct.price.replace(/[^0-9.]/g, '');
    const numericPrice = parseFloat(cleanedPrice);

    if (!isNaN(numericPrice)) {
      addToCart({
        id: premiumproduct.id,
        image: premiumproduct.image,
        name: premiumproduct.name,
        price: numericPrice,
      });
    } else {
      console.error("Could not parse price for item:", premiumproduct.name, "Input price:", premiumproduct.price);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1688176886580-b06b45f0beac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhcmNhbmUlMjBmaWVsZCUyMHN1bnNldHxlbnwxfHx8fDE3NjEzMTA3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/90 via-[#2C1810]/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-4 px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full"
            >
              <span className="text-[#D4AF37] text-sm">100% Pure & Premium</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl text-[#FFF8E7] mb-6 font-serif"
            >
              Pure, Premium Jaggery Crafted with Tradition.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-[#F5E6D3] mb-8"
            >
              Experience the authentic taste of traditional jaggery, made from the finest sugarcane using time-honored methods.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] px-8 py-6 text-lg"
                  style={{cursor: 'pointer'}}
                >
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#D4AF37]/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Product Slider Section */}
      <section className="py-20 bg-gradient-to-b from-[#FFF8E7] to-[#F5E6D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-4 font-serif">
              Our Premium Collection
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              Discover our range of artisanal jaggery products, each crafted with care and tradition.
            </p>
          </motion.div>

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
            {premiumproducts.map((premiumproduct, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <motion.div
                // ... motion props ...
                className="bg-[#FFF8E7] rounded-lg overflow-hidden shadow-lg border-2 border-[#C5A572]/20 hover:border-[#D4AF37]/50 flex flex-col" // Added flex flex-col here too for consistency
              >
                <Link to={`/product/${premiumproduct.id}`} className="block">
                  <div className="cursor-pointer">
                    <HoverVideoPlayer
                      videoSrc={premiumproduct.url}
                      posterSrc={premiumproduct.image}
                      // Apply container styles AND explicit height here
                      className="h-52 md:h-64" // <-- HEIGHT MOVED HERE
                      // videoClassName="h-52 md:h-64" // <-- REMOVED FROM HERE
                    />
                  </div>
                </Link>
                {/* Product details */}
                <div className="p-6 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                  <Link to={`/product/${premiumproduct.id}`}>
                    <h3 className="text-[#2C1810] mb-2 hover:text-[#D4AF37] transition-colors cursor-pointer">{premiumproduct.name}</h3>
                  </Link>
                  <p className="text-sm text-[#5C4033] mb-4 line-clamp-2 flex-grow">{premiumproduct.description}</p> {/* Added flex-grow */}
                  {premiumproduct.price && (
                    <div className="flex items-center justify-between mt-auto"> {/* Added mt-auto */}
                      <span className="text-[#D4AF37] font-semibold">{premiumproduct.price}</span>
                      <Button
                        size="sm"
                        className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                        style={{cursor: "pointer"}}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(premiumproduct);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
          </CarouselContent>
            <CarouselPrevious className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810]" />
            <CarouselNext className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1810]" />
          </Carousel>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37] hover:text-[#2C1810]"
                style={{cursor: "pointer"}}
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#2C1810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#FFF8E7] mb-4 font-serif">
              Why Choose Shreshta
            </h2>
            <p className="text-[#C5A572] max-w-2xl mx-auto">
              We are committed to bringing you the finest quality jaggery with complete transparency and trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-[#3E2723] rounded-lg border-2 border-[#C5A572]/20 hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-[#D4AF37]/10 rounded-full border-2 border-[#D4AF37]">
                  <feature.icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-[#FFF8E7] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#C5A572]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-[#F5E6D3] to-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-4 font-serif">
              What Our Customers Say
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Shreshta for their daily sweetness needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#C5A572]/20"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-[#5C4033] mb-4 italic">"{testimonial.text}"</p>
                <p className="text-[#2C1810]">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products / Bestsellers */}
      <section className="py-20 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-4 font-serif">
              Featured Bestsellers
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              Our most loved products, chosen by our customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
