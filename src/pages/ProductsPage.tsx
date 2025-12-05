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

const allProducts = [
  {
    id: 1,
    image: '/jaggery-solid-regular.jpg',
    name: 'Cube Jaggery - Premium',
    description: 'Perfect cubes of pure jaggery, ideal for daily use and traditional recipes.',
    price: '₹299/kg',
    category: 'cube',
  },
  {
    id: 2,
    image: '/jaggery-cubes.jpg',
    name: 'Cube Jaggery - Regular',
    description: 'Traditional cube jaggery perfect for everyday cooking and beverages.',
    price: '₹249/kg',
    category: 'cube',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1671548185843-3f50c6c1060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGxpcXVpZCUyMGdvbGRlbnxlbnwxfHx8fDE3NjEzMTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Liquid Jaggery - Pure',
    description: 'Smooth, golden liquid jaggery perfect for drinks, desserts, and marinades.',
    price: '₹349/kg',
    category: 'liquid',
  },
  {
    id: 4,
    image: '/natural-liquid-jaggery.jpg',
    name: 'Liquid Jaggery',
    description: 'Premium liquid jaggery with rich flavor and natural sweetness.',
    price: '₹399/kg',
    category: 'liquid',
  },
  {
    id: 5,
    image: '/jaggery-powder.jpg',
    name: 'Powder Jaggery - Fine',
    description: 'Finely powdered jaggery for easy mixing in beverages and baking.',
    price: '₹279/kg',
    category: 'powder',
  },
  {
    id: 6,
    image: '/jaggery-powder2.webp',
    name: 'Powder Jaggery - Coarse',
    description: 'Coarse powder perfect for traditional sweets and cooking.',
    price: '₹259/kg',
    category: 'powder',
  },
  {
    id: 7,
    image: '/jaggery-block.jpg',
    name: 'Block Jaggery - Large',
    description: 'Traditional large blocks ideal for festivals and special occasions.',
    price: '₹329/kg',
    category: 'cube',
  },
  {
    id: 8,
    image: '/jaggery-block1.jpg',
    name: 'Block Jaggery - Mini',
    description: 'Convenient mini blocks perfect for portion control and gifting.',
    price: '₹289/kg',
    category: 'cube',
  },
  {
    id: 9,
    image: '/jaggery-powder2.jpg',
    name: 'Powder Jaggery',
    description: 'Premium powder jaggery with certified purity.',
    price: '₹319/kg',
    category: 'powder',
  },
  {
    id: 10,
    image: '/ghee.avif',
    name: 'Cow Ghee',
    description: 'Premium Cow Ghee with certified purity.',
    price: '₹5099/L',
    category: 'dairy',
  },
  {
    id: 11,
    image: '/butter.webp',
    name: 'Pure Butter',
    description: 'Premium Pure Butter with certified purity.',
    price: '₹669/Kg',
    category: 'dairy',
  },
   {
    id: 12,
    image: '/coffee.jpg',
    name: 'Single Origin Coffee',
    description: 'Pure Single origin Coffee with rich aroma and flavor.',
    price: '₹7000/Kg',
    category: 'beverages',
  },
    {
    id: 13,
    image: '/tea.jpg',
    name: 'Assam Black Tea',
    description: 'Pure Assam Black Tea with strong flavor and aroma.',
    price: '₹3499/Kg',
    category: 'beverages',
  },
      {
    id: 14,
    image: '/green_tea.jpg',
    name: 'Green Tea',
    description: 'Pure Green Tea with refreshing taste and health benefits.',
    price: '₹799/180g',
    category: 'beverages',
  },
        {
    id: 15,
    image: '/sorghum-millet.jpg',
    name: 'Sorghum Millet',
    description: 'Healthy Sorghum Millet for nutritious meals.',
    price: '₹899/kg',
    category: 'millets',
  },
          {
    id: 16,
    image: '/FinerMillet.webp',
    name: 'Finger Millet',
    description: 'Nutritious Finger Millet for wholesome diets.',
    price: '₹450/kg',
    category: 'millets',
  },
            {
    id: 17,
    image: '/pearl-millet.jpg',
    name: 'Pearl Millet',
    description: 'Wholesome Pearl Millet for healthy living.',
    price: '₹650/kg',
    category: 'millets',
  },
];

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
  const [products, setProducts] = useState(allProducts);

  // Load and merge all products (existing + admin, with deletions and edits applied)
  const loadAllProducts = () => {
    const deletedIds = getDeletedProductIds();
    const editedProducts = getEditedProducts();
    const adminProducts = getAdminProducts();
    
    // Start with existing products, apply edits, exclude deleted
    const processedExisting = allProducts
      .filter(p => !deletedIds.has(p.id))
      .map(p => {
        const edited = editedProducts.get(p.id);
        return edited ? {
          id: edited.id,
          image: edited.image,
          name: edited.name,
          description: edited.description,
          price: edited.price,
          category: edited.category,
        } : p;
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
