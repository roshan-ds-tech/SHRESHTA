// Central product data store
// This consolidates all products from different pages

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
  images?: string[]; // Multiple images for gallery
  video?: string; // Optional video
  rating?: number; // Average rating
  reviewCount?: number; // Total number of reviews
  inStock?: boolean;
  originalPrice?: string;
  discount?: number;
  weight?: string[];
  manufacturer?: string;
  ingredients?: string;
  specifications?: Record<string, string>;
  warranty?: string;
  deliveryInfo?: string;
  features?: string[];
}

export const allProductsData: Product[] = [
  {
    id: 1,
    name: 'Cube Jaggery - Premium',
    description: 'Perfect cubes of pure jaggery, ideal for daily use and traditional recipes. Sourced from certified organic farms and made using traditional methods.',
    price: '₹299/kg',
    originalPrice: '₹349/kg',
    discount: 14,
    image: '/jaggery-solid-regular.jpg',
    images: ['/jaggery-solid-regular.jpg', '/jaggery-cube1_video.jpeg', '/jaggery-cubes.jpg'],
    category: 'cube',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    weight: ['500g', '1kg', '2kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Sugarcane Jaggery',
    specifications: {
      'Type': 'Cube Jaggery',
      'Purity': '100% Organic',
      'Packaging': 'Food Grade',
      'Shelf Life': '12 Months',
      'Storage': 'Cool & Dry Place'
    },
    warranty: 'Quality Guarantee',
    deliveryInfo: 'Free delivery on orders above ₹500',
    features: [
      '100% Pure & Natural',
      'No Preservatives',
      'Rich in Iron & Minerals',
      'Traditional Process',
      'Farm Fresh'
    ]
  },
  {
    id: 2,
    name: 'Cube Jaggery - Regular',
    description: 'Traditional cube jaggery perfect for everyday cooking and beverages.',
    price: '₹249/kg',
    image: '/jaggery-cubes.jpg',
    images: ['/jaggery-cubes.jpg', '/jaggery-solid-regular.jpg'],
    category: 'cube',
    rating: 4.3,
    reviewCount: 95,
    inStock: true,
    weight: ['500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Sugarcane Jaggery',
    specifications: {
      'Type': 'Cube Jaggery',
      'Purity': '100% Pure',
      'Packaging': 'Food Grade',
      'Shelf Life': '12 Months'
    },
    features: ['Pure & Natural', 'No Additives', 'Traditional Process']
  },
  {
    id: 3,
    name: 'Liquid Jaggery - Pure',
    description: 'Smooth, golden liquid jaggery perfect for drinks, desserts, and marinades.',
    price: '₹349/kg',
    image: 'https://images.unsplash.com/photo-1671548185843-3f50c6c1060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGxpcXVpZCUyMGdvbGRlbnxlbnwxfHx8fDE3NjEzMTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1671548185843-3f50c6c1060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGxpcXVpZCUyMGdvbGRlbnxlbnwxfHx8fDE3NjEzMTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080', '/natural-liquid-jaggery.jpg'],
    category: 'liquid',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    weight: ['250ml', '500ml', '1L'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Liquid Jaggery',
    specifications: {
      'Type': 'Liquid Jaggery',
      'Purity': '100% Organic',
      'Packaging': 'Glass Bottle',
      'Shelf Life': '6 Months'
    },
    features: ['Easy to Pour', 'Rich Flavor', 'Natural Sweetness']
  },
  {
    id: 4,
    name: 'Liquid Jaggery',
    description: 'Premium liquid jaggery with rich flavor and natural sweetness.',
    price: '₹399/kg',
    originalPrice: '₹449/kg',
    discount: 11,
    image: '/natural-liquid-jaggery.jpg',
    images: ['/natural-liquid-jaggery.jpg', '/hoveer_image2.jpeg'],
    video: '/hover_video2 (online-video-cutter.com).mp4',
    category: 'liquid',
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    weight: ['250ml', '500ml', '1L'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Liquid Jaggery',
    specifications: {
      'Type': 'Liquid Jaggery',
      'Purity': '100% Organic',
      'Packaging': 'Glass Bottle',
      'Shelf Life': '6 Months'
    },
    features: ['Premium Quality', 'Rich Golden Color', 'Natural Sweetness']
  },
  {
    id: 5,
    name: 'Powder Jaggery - Fine',
    description: 'Finely powdered jaggery for easy mixing in beverages and baking.',
    price: '₹279/kg',
    image: '/jaggery-powder.jpg',
    images: ['/jaggery-powder.jpg', '/jaggery-powder2.webp'],
    category: 'powder',
    rating: 4.4,
    reviewCount: 87,
    inStock: true,
    weight: ['250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Jaggery Powder',
    specifications: {
      'Type': 'Powder Jaggery',
      'Texture': 'Fine',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Easy to Mix', 'Fine Texture', 'Natural Sweetness']
  },
  {
    id: 6,
    name: 'Powder Jaggery - Coarse',
    description: 'Coarse powder perfect for traditional sweets and cooking.',
    price: '₹259/kg',
    image: '/jaggery-powder2.webp',
    images: ['/jaggery-powder2.webp', '/hover_video3.jpeg'],
    video: '/hover_video3 (online-video-cutter.com).mp4',
    category: 'powder',
    rating: 4.2,
    reviewCount: 64,
    inStock: true,
    weight: ['250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Jaggery Powder',
    specifications: {
      'Type': 'Powder Jaggery',
      'Texture': 'Coarse',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Coarse Texture', 'Traditional Use', 'Natural Sweetness']
  },
  {
    id: 7,
    name: 'Block Jaggery - Large',
    description: 'Traditional large blocks ideal for festivals and special occasions.',
    price: '₹329/kg',
    image: '/jaggery-block.jpg',
    images: ['/jaggery-block.jpg'],
    category: 'cube',
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    weight: ['1kg', '2kg', '5kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Jaggery',
    specifications: {
      'Type': 'Block Jaggery',
      'Size': 'Large',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Large Blocks', 'Festival Special', 'Traditional']
  },
  {
    id: 8,
    name: 'Block Jaggery - Mini',
    description: 'Convenient mini blocks perfect for portion control and gifting.',
    price: '₹289/kg',
    image: '/jaggery-block1.jpg',
    images: ['/jaggery-block1.jpg'],
    category: 'cube',
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    weight: ['250g', '500g'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Jaggery',
    specifications: {
      'Type': 'Block Jaggery',
      'Size': 'Mini',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Mini Blocks', 'Portion Control', 'Gift Ready']
  },
  {
    id: 9,
    name: 'Powder Jaggery',
    description: 'Premium powder jaggery with certified purity.',
    price: '₹319/kg',
    image: '/jaggery-powder2.jpg',
    images: ['/jaggery-powder2.jpg'],
    category: 'powder',
    rating: 4.3,
    reviewCount: 56,
    inStock: true,
    weight: ['250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Organic Jaggery Powder',
    specifications: {
      'Type': 'Powder Jaggery',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Certified Pure', 'Premium Quality', 'Natural']
  },
  {
    id: 10,
    name: 'Cow Ghee',
    description: 'Premium Cow Ghee with certified purity.',
    price: '₹5099/L',
    image: '/ghee.avif',
    images: ['/ghee.avif'],
    category: 'dairy',
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    weight: ['250ml', '500ml', '1L'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Cow Milk Ghee',
    specifications: {
      'Type': 'Cow Ghee',
      'Purity': '100% Pure',
      'Shelf Life': '18 Months'
    },
    features: ['Pure Cow Ghee', 'Certified', 'Traditional Process']
  },
  {
    id: 11,
    name: 'Pure Butter',
    description: 'Premium Pure Butter with certified purity.',
    price: '₹669/Kg',
    image: '/butter.webp',
    images: ['/butter.webp'],
    category: 'dairy',
    rating: 4.5,
    reviewCount: 189,
    inStock: true,
    weight: ['250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Pure Cream',
    specifications: {
      'Type': 'Butter',
      'Purity': '100% Pure',
      'Shelf Life': '6 Months'
    },
    features: ['Pure Butter', 'Fresh', 'Natural']
  },
  {
    id: 12,
    name: 'Single Origin Coffee',
    description: 'Pure Single origin Coffee with rich aroma and flavor.',
    price: '₹7000/Kg',
    image: '/coffee.jpg',
    images: ['/coffee.jpg'],
    category: 'beverages',
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    weight: ['250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Arabica Coffee Beans',
    specifications: {
      'Type': 'Coffee',
      'Origin': 'Single Origin',
      'Roast': 'Medium',
      'Shelf Life': '24 Months'
    },
    features: ['Single Origin', 'Rich Aroma', 'Premium Quality']
  },
  {
    id: 13,
    name: 'Assam Black Tea',
    description: 'Pure Assam Black Tea with strong flavor and aroma.',
    price: '₹3499/Kg',
    image: '/tea.jpg',
    images: ['/tea.jpg'],
    category: 'beverages',
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    weight: ['100g', '250g', '500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Assam Tea Leaves',
    specifications: {
      'Type': 'Black Tea',
      'Origin': 'Assam',
      'Shelf Life': '36 Months'
    },
    features: ['Strong Flavor', 'Rich Aroma', 'Premium Assam']
  },
  {
    id: 14,
    name: 'Green Tea',
    description: 'Pure Green Tea with refreshing taste and health benefits.',
    price: '₹799/180g',
    image: '/green_tea.jpg',
    images: ['/green_tea.jpg'],
    category: 'beverages',
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    weight: ['100g', '180g', '250g'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Green Tea Leaves',
    specifications: {
      'Type': 'Green Tea',
      'Antioxidants': 'High',
      'Shelf Life': '24 Months'
    },
    features: ['Health Benefits', 'Refreshing', 'Antioxidants']
  },
  {
    id: 15,
    name: 'Sorghum Millet',
    description: 'Healthy Sorghum Millet for nutritious meals.',
    price: '₹899/kg',
    image: '/sorghum-millet.jpg',
    images: ['/sorghum-millet.jpg'],
    category: 'millets',
    rating: 4.4,
    reviewCount: 98,
    inStock: true,
    weight: ['500g', '1kg', '2kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Organic Sorghum',
    specifications: {
      'Type': 'Sorghum Millet',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['High Protein', 'Nutritious', 'Organic']
  },
  {
    id: 16,
    name: 'Finer Millet',
    description: 'Nutritious Finer Millet for wholesome diets.',
    price: '₹450/kg',
    image: '/FinerMillet.webp',
    images: ['/FinerMillet.webp'],
    category: 'millets',
    rating: 4.3,
    reviewCount: 76,
    inStock: true,
    weight: ['500g', '1kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Organic Millet',
    specifications: {
      'Type': 'Finer Millet',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['Fine Texture', 'Nutritious', 'Organic']
  },
  {
    id: 17,
    name: 'Pearl Millet',
    description: 'Wholesome Pearl Millet for healthy living.',
    price: '₹650/kg',
    image: '/pearl-millet.jpg',
    images: ['/pearl-millet.jpg'],
    category: 'millets',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    weight: ['500g', '1kg', '2kg'],
    manufacturer: 'Shreshta Organic Farms',
    ingredients: '100% Organic Pearl Millet',
    specifications: {
      'Type': 'Pearl Millet',
      'Purity': '100% Organic',
      'Shelf Life': '12 Months'
    },
    features: ['High Fiber', 'Nutritious', 'Organic']
  }
];

// Sample reviews data
export interface Review {
  id: number;
  userName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export const sampleReviews: Review[] = [
  {
    id: 1,
    userName: 'Roshan DS',
    rating: 5,
    title: 'Excellent Quality!',
    text: 'The quality is exceptional! I can taste the purity in every bite. My family loves it. Highly recommended!',
    date: '2024-01-15',
    verified: true,
    helpful: 45,
    images: []
  },
  {
    id: 2,
    userName: 'Prasanna Kumar',
    rating: 5,
    title: 'Best jaggery I have ever purchased',
    text: 'Authentic taste and premium quality. Worth every penny. Will definitely order again.',
    date: '2024-01-10',
    verified: true,
    helpful: 32
  },
  {
    id: 3,
    userName: 'Nithin',
    rating: 4,
    title: 'Great product',
    text: 'Worth every penny! The liquid jaggery is my favorite for making desserts. Good packaging too.',
    date: '2024-01-08',
    verified: true,
    helpful: 28
  },
  {
    id: 4,
    userName: 'Sarah M',
    rating: 5,
    title: 'Amazing taste',
    text: 'Pure and natural. The flavor is incredible. Great for traditional recipes.',
    date: '2024-01-05',
    verified: false,
    helpful: 15
  },
  {
    id: 5,
    userName: 'Raj K',
    rating: 4,
    title: 'Good quality',
    text: 'Nice product. Good packaging. Fast delivery. Will recommend to friends.',
    date: '2024-01-03',
    verified: true,
    helpful: 12
  }
];

export function getProductById(id: number): Product | undefined {
  return allProductsData.find(p => p.id === id);
}

