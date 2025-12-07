import React, { useState, useEffect } from 'react';
import { motion, styleEffect } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { allProductsData } from '../utils/productData';

// Interface for admin products
interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  createdAt: string;
}

// Get admin products from localStorage
const getAdminProducts = (): AdminProduct[] => {
  const stored = localStorage.getItem('adminProducts');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

// Get deleted product IDs from localStorage
const getDeletedProductIds = (): Set<number> => {
  const stored = localStorage.getItem('deletedProductIds');
  if (stored) {
    try {
      const ids = JSON.parse(stored);
      return new Set(ids);
    } catch {
      return new Set();
    }
  }
  return new Set();
};

// Get edited products from localStorage
const getEditedProducts = (): Map<number, any> => {
  const stored = localStorage.getItem('editedProducts');
  if (stored) {
    try {
      const edited = JSON.parse(stored);
      const map = new Map<number, any>();
      edited.forEach((p: any) => {
        map.set(p.id, p);
      });
      return map;
    } catch {
      return new Map();
    }
  }
  return new Map();
};

// Convert product from productData.ts to ProductCard format
const convertProductToCardFormat = (product: typeof allProductsData[0]) => {
  return {
    id: product.id,
    image: product.image,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category || 'all',
  };
};

// Convert admin product to product format
const convertAdminProduct = (adminProduct: AdminProduct) => {
  return {
    id: adminProduct.id,
    image: adminProduct.image,
    name: adminProduct.name,
    description: adminProduct.description,
    price: adminProduct.price,
    category: adminProduct.category,
  };
};

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [products, setProducts] = useState(() => 
    allProductsData.map(convertProductToCardFormat)
  );

  // Load and merge all products (from productData + admin, with deletions and edits applied)
  const loadAllProducts = () => {
    const deletedIds = getDeletedProductIds();
    const editedProducts = getEditedProducts();
    const adminProducts = getAdminProducts();
    
    // Start with products from productData.ts, convert to card format, apply edits, exclude deleted
    const processedExisting = allProductsData
      .filter(p => !deletedIds.has(p.id))
      .map(p => {
        const edited = editedProducts.get(p.id);
        if (edited) {
          return {
            id: edited.id,
            image: edited.image,
            name: edited.name,
            description: edited.description,
            price: edited.price,
            category: edited.category,
          };
        }
        return convertProductToCardFormat(p);
      });
    
    // Add admin products, exclude deleted
    const convertedAdminProducts = adminProducts
      .filter(p => !deletedIds.has(p.id))
      .map(convertAdminProduct);
    
    // Merge all products
    const mergedProducts = [...processedExisting, ...convertedAdminProducts];
    setProducts(mergedProducts);
  };

  // Load products on mount
  useEffect(() => {
    loadAllProducts();
  }, []);

  // Listen for storage changes (when admin adds/edits/deletes products)
  useEffect(() => {
    const handleStorageChange = () => {
      loadAllProducts();
    };

    // Listen for custom event when admin modifies products
    window.addEventListener('adminProductAdded', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('adminProductAdded', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
    }
    if (sortBy === 'price-high') {
      return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white">
      {/* Hero Section */}
      <section className="bg-[#2C1810] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-[#FFF8E7] mb-4 font-serif"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C5A572] max-w-2xl mx-auto"
          >
            Discover our complete range of premium jaggery products
          </motion.p>
        </div>
      </section>

      {/* Filter & Sort Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8 border-b border-[#C5A572]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Sort Dropdown - Moved to left */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <span className="text-[#2C1810]">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-[#C5A572] "style={{cursor: "pointer"}}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured" style={{cursor: "pointer"}}>Featured</SelectItem>
                  <SelectItem value="price-low" style={{cursor: "pointer"}}>Price: Low to High</SelectItem>
                  <SelectItem value="price-high" style={{cursor: "pointer"}}>Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Category Filter */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-2 flex-wrap flex-1 justify-center md:justify-end"
            >
              <Filter className="w-5 h-5 text-[#5C4033]" />
              <span className="text-[#2C1810]">Filter:</span>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                    
                  }
                  style={{cursor: "pointer"}}
                >
                  All Products
                </Button>
                <Button
                  variant={selectedCategory === 'cube' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('cube')}
                  className={selectedCategory === 'cube' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Cube & Blocks
                </Button>
                <Button
                  variant={selectedCategory === 'liquid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('liquid')}
                  className={selectedCategory === 'liquid' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Liquid
                </Button>
                <Button
                  variant={selectedCategory === 'powder' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('powder')}
                  className={selectedCategory === 'powder' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Powder
                </Button>

                <Button
                  variant={selectedCategory === 'dairy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('dairy')}
                  className={selectedCategory === 'dairy' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Dairy
                </Button>

            <Button
                  variant={selectedCategory === 'beverages' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('beverages')}
                  className={selectedCategory === 'beverages' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Beverages
                </Button>

            <Button
                  variant={selectedCategory === 'millets' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('millets')}
                  className={selectedCategory === 'millets' 
                    ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                    : 'border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10'
                  }
                  style={{cursor: "pointer"}}
                >
                  Millets
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <ProductCard
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                />
              </motion.div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#5C4033]">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
