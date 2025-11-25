import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Upload,
  LogOut,
  Image as ImageIcon,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Product Interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  createdAt: string;
  isExisting?: boolean; // Flag to identify existing hardcoded products
}

// Product Categories
const categories = [
  { value: 'cube', label: 'Cube Jaggery' },
  { value: 'liquid', label: 'Liquid Jaggery' },
  { value: 'powder', label: 'Powder Jaggery' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'millets', label: 'Millets' },
  { value: 'other', label: 'Other' },
];

// Existing products from ProductsPage (hardcoded)
const existingProducts = [
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
    name: 'Finer Millet',
    description: 'Nutritious Finer Millet for wholesome diets.',
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

// Get admin-added products from localStorage
const getAdminProducts = (): Product[] => {
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

// Get edited products from localStorage (overrides for existing products)
const getEditedProducts = (): Map<number, Product> => {
  const stored = localStorage.getItem('editedProducts');
  if (stored) {
    try {
      const edited = JSON.parse(stored);
      const map = new Map<number, Product>();
      edited.forEach((p: Product) => {
        map.set(p.id, p);
      });
      return map;
    } catch {
      return new Map();
    }
  }
  return new Map();
};

// Save deleted product IDs to localStorage
const saveDeletedProductIds = (ids: Set<number>) => {
  localStorage.setItem('deletedProductIds', JSON.stringify(Array.from(ids)));
};

// Save edited products to localStorage
const saveEditedProducts = (edited: Map<number, Product>) => {
  localStorage.setItem('editedProducts', JSON.stringify(Array.from(edited.values())));
};

// Get all products (existing + admin-added, excluding deleted, with edits applied)
const getAllProducts = (): Product[] => {
  const deletedIds = getDeletedProductIds();
  const editedProducts = getEditedProducts();
  const adminProducts = getAdminProducts();
  
  // Start with existing products, apply edits, exclude deleted
  const processedExisting = existingProducts
    .filter(p => !deletedIds.has(p.id))
    .map(p => {
      const edited = editedProducts.get(p.id);
      return edited ? { ...edited, createdAt: p.id.toString() } : { ...p, createdAt: p.id.toString(), isExisting: true };
    });
  
  // Add admin products, exclude deleted
  const processedAdmin = adminProducts.filter(p => !deletedIds.has(p.id));
  
  return [...processedExisting, ...processedAdmin];
};

// Save all products to localStorage (for admin-added products)
const saveAdminProducts = (products: Product[]) => {
  // Only save admin-added products (those without isExisting flag)
  const adminProducts = products.filter(p => !p.isExisting);
  localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(getAllProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  // Check admin authentication and load products
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }

    try {
      const adminData = JSON.parse(admin);
      if (!adminData.loggedIn) {
        navigate('/admin/login');
      }
    } catch {
      navigate('/admin/login');
    }
    
    // Load all products
    setProducts(getAllProducts());
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
    });
    setImagePreview('');
    setEditingProduct(null);
  };

  // Open modal for new product
  const handleAddProduct = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditProduct = (product: Product) => {
    // Remove ₹ symbol from price for editing (will be added back on submit)
    const priceWithoutSymbol = product.price.replace(/^₹\s*/, '');
    setFormData({
      name: product.name,
      description: product.description,
      price: priceWithoutSymbol,
      category: product.category,
      image: product.image,
    });
    setImagePreview(product.image);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Check if product is existing (hardcoded) or admin-added
  const isExistingProduct = (productId: number): boolean => {
    return existingProducts.some(p => p.id === productId);
  };

  // Format price - automatically add ₹ symbol if not present
  const formatPrice = (price: string): string => {
    if (!price.trim()) return price;
    
    // Remove any existing ₹ symbol and trim
    let formattedPrice = price.trim().replace(/^₹\s*/, '');
    
    // Add ₹ symbol if not present
    if (!formattedPrice.startsWith('₹')) {
      formattedPrice = '₹' + formattedPrice;
    }
    
    return formattedPrice;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter product name');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter product description');
      setIsLoading(false);
      return;
    }

    if (!formData.price.trim()) {
      toast.error('Please enter product price');
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      setIsLoading(false);
      return;
    }

    if (!formData.image) {
      toast.error('Please upload a product image');
      setIsLoading(false);
      return;
    }

    // Format price with ₹ symbol
    const formattedPrice = formatPrice(formData.price);
    const productData = {
      ...formData,
      price: formattedPrice,
    };

    // Simulate API call
    setTimeout(() => {
      if (editingProduct) {
        const isExisting = isExistingProduct(editingProduct.id);
        
        if (isExisting) {
          // Update existing product - save to editedProducts
          const editedProducts = getEditedProducts();
          editedProducts.set(editingProduct.id, {
            ...productData,
            id: editingProduct.id,
            createdAt: editingProduct.createdAt || editingProduct.id.toString(),
          });
          saveEditedProducts(editedProducts);
        } else {
          // Update admin-added product
          const adminProducts = getAdminProducts();
          const updatedAdminProducts = adminProducts.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...productData,
                  id: editingProduct.id,
                  createdAt: editingProduct.createdAt,
                }
              : p
          );
          saveAdminProducts(updatedAdminProducts);
        }
        
        // Refresh products list
        setProducts(getAllProducts());
        toast.success('Product updated successfully!');
        // Dispatch event to notify ProductsPage
        window.dispatchEvent(new Event('adminProductAdded'));
      } else {
        // Add new product
        const newProduct: Product = {
          ...productData,
          id: Date.now(), // Simple ID generation
          createdAt: new Date().toISOString(),
        };
        const adminProducts = getAdminProducts();
        const updatedAdminProducts = [...adminProducts, newProduct];
        saveAdminProducts(updatedAdminProducts);
        
        // Refresh products list
        setProducts(getAllProducts());
        toast.success('Product added successfully!');
        // Dispatch event to notify ProductsPage
        window.dispatchEvent(new Event('adminProductAdded'));
      }

      setIsLoading(false);
      setIsModalOpen(false);
      resetForm();
    }, 500);
  };

  // Handle delete product
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const isExisting = isExistingProduct(productId);
      
      if (isExisting) {
        // Mark existing product as deleted
        const deletedIds = getDeletedProductIds();
        deletedIds.add(productId);
        saveDeletedProductIds(deletedIds);
        
        // Also remove from edited products if it was edited
        const editedProducts = getEditedProducts();
        editedProducts.delete(productId);
        saveEditedProducts(editedProducts);
      } else {
        // Delete admin-added product
        const adminProducts = getAdminProducts();
        const updatedAdminProducts = adminProducts.filter((p) => p.id !== productId);
        saveAdminProducts(updatedAdminProducts);
      }
      
      // Refresh products list
      setProducts(getAllProducts());
      toast.success('Product deleted successfully!');
      // Dispatch event to notify ProductsPage
      window.dispatchEvent(new Event('adminProductAdded'));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get category label
  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white">
      {/* Header */}
      <div className="bg-[#2C1810] border-b border-[#C5A572]/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#2C1810]" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-[#FFF8E7]">Admin Dashboard</h1>
                <p className="text-sm text-[#C5A572]">Manage your products</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#C5A572] text-[#FFF8E7] hover:bg-[#C5A572]/20"
              style={{ cursor: 'pointer' }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20 p-4">
            <p className="text-sm text-[#5C4033] mb-1">Total Products</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{products.length}</p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] px-6 py-6 text-lg"
            style={{ cursor: 'pointer' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20"
          >
            <Package className="w-24 h-24 mx-auto text-[#C5A572] mb-4" />
            <h2 className="text-2xl text-[#2C1810] mb-4">No products yet</h2>
            <p className="text-[#5C4033] mb-8">
              Get started by adding your first product
            </p>
            <Button
              onClick={handleAddProduct}
              className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
              style={{ cursor: 'pointer' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20 hover:border-[#D4AF37]/50 transition-all overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try to fix common path issues
                        if (!product.image.startsWith('http') && !product.image.startsWith('/') && !product.image.startsWith('data:')) {
                          target.src = '/' + product.image;
                        } else if (product.image.startsWith('data:')) {
                          // Base64 images - if they fail, show placeholder
                          target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                        } else {
                          // Fallback placeholder
                          target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }
                      }}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <span className="bg-[#D4AF37] text-[#2C1810] px-2 py-1 rounded text-xs font-semibold">
                        {getCategoryLabel(product.category)}
                      </span>
                      {isExistingProduct(product.id) && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Existing
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#5C4033] mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xl font-bold text-[#D4AF37] mb-3">
                      {product.price}
                    </p>
                    <p className="text-xs text-[#5C4033] mb-4">
                      Added: {formatDate(product.createdAt)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/10"
                        style={{ cursor: 'pointer' }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        style={{ cursor: 'pointer' }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFF8E7]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#2C1810] font-serif">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription className="text-[#5C4033]">
              {editingProduct
                ? 'Update product information'
                : 'Fill in the details to add a new product'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-[#2C1810] mb-2 block">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810]"
                placeholder="e.g., Cube Jaggery - Premium"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-[#2C1810] mb-2 block">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810]"
                placeholder="Describe your product in detail..."
                disabled={isLoading}
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-[#2C1810] mb-2 block">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810]"
                  placeholder="e.g., 299/kg (₹ will be added automatically)"
                  disabled={isLoading}
                />
                <p className="text-xs text-[#5C4033] mt-1">
                  ₹ symbol will be added automatically
                </p>
              </div>

              <div>
                <Label htmlFor="category" className="text-[#2C1810] mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-[#2C1810] mb-2 block">
                Product Image <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-[#C5A572]/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      style={{ cursor: 'pointer' }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#C5A572]/50 rounded-lg cursor-pointer bg-white hover:bg-[#FFF8E7] transition-colors"
                    style={{ cursor: 'pointer' }}
                  >
                    <Upload className="w-12 h-12 text-[#C5A572] mb-4" />
                    <p className="text-[#5C4033] font-medium">
                      Click to upload image
                    </p>
                    <p className="text-xs text-[#5C4033] mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="flex-1 border-[#C5A572] text-[#2C1810] hover:bg-[#C5A572]/10"
                disabled={isLoading}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                disabled={isLoading}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#2C1810] border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Submit</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

