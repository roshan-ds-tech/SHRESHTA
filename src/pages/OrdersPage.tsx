import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Package,
  Search,
  Filter,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  FileText,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Order Status Types
type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

// Order Item Interface
interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight?: string;
}

// Order Interface
interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  orderDate: string;
  deliveryDate?: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax?: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Mock Orders Data (Replace with API call)
const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'ORD-2024-001',
    items: [
      {
        id: 1,
        name: 'Cube Jaggery',
        image: '/jaggery-solid-regular.jpg',
        price: 299,
        quantity: 2,
        weight: '1kg',
      },
      {
        id: 2,
        name: 'Powder Jaggery',
        image: '/jaggery-powder2.webp',
        price: 279,
        quantity: 1,
        weight: '500g',
      },
    ],
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    status: 'Delivered',
    total: 877,
    subtotal: 827,
    shipping: 50,
    tax: 0,
    paymentMethod: 'Credit Card •••• 4242',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: '12, Olive Street, Central Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ord_1002',
    orderNumber: 'ORD-2024-002',
    items: [
      {
        id: 2,
        name: 'Liquid Jaggery',
        image: 'https://images.unsplash.com/photo-1671548185843-3f50c6c1060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGxpcXVpZCUyMGdvbGRlbnxlbnwxfHx8fDE3NjEzMTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 349,
        quantity: 3,
        weight: '500ml',
      },
    ],
    orderDate: '2024-01-18',
    status: 'Out for Delivery',
    total: 1097,
    subtotal: 1047,
    shipping: 50,
    paymentMethod: 'UPI',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: '12, Olive Street, Central Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-22',
  },
  {
    id: 'ord_1003',
    orderNumber: 'ORD-2024-003',
    items: [
      {
        id: 1,
        name: 'Cube Jaggery',
        image: '/jaggery-solid-regular.jpg',
        price: 299,
        quantity: 1,
        weight: '1kg',
      },
    ],
    orderDate: '2024-01-20',
    status: 'Processing',
    total: 349,
    subtotal: 299,
    shipping: 50,
    paymentMethod: 'Debit Card •••• 5678',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: '12, Olive Street, Central Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
  },
  {
    id: 'ord_1004',
    orderNumber: 'ORD-2024-004',
    items: [
      {
        id: 3,
        name: 'Powder Jaggery',
        image: '/jaggery-powder2.webp',
        price: 279,
        quantity: 2,
        weight: '1kg',
      },
    ],
    orderDate: '2024-01-10',
    status: 'Cancelled',
    total: 608,
    subtotal: 558,
    shipping: 50,
    paymentMethod: 'Credit Card •••• 4242',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: '12, Olive Street, Central Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
  },
];

// Status Badge Component
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: React.ReactNode }> = {
    Pending: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-100 border-yellow-300',
      icon: <Clock className="w-3 h-3" />,
    },
    Confirmed: {
      color: 'text-blue-700',
      bg: 'bg-blue-100 border-blue-300',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    Processing: {
      color: 'text-purple-700',
      bg: 'bg-purple-100 border-purple-300',
      icon: <Package className="w-3 h-3" />,
    },
    Shipped: {
      color: 'text-indigo-700',
      bg: 'bg-indigo-100 border-indigo-300',
      icon: <Truck className="w-3 h-3" />,
    },
    'Out for Delivery': {
      color: 'text-orange-700',
      bg: 'bg-orange-100 border-orange-300',
      icon: <Truck className="w-3 h-3" />,
    },
    Delivered: {
      color: 'text-green-700',
      bg: 'bg-green-100 border-green-300',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    Cancelled: {
      color: 'text-red-700',
      bg: 'bg-red-100 border-red-300',
      icon: <X className="w-3 h-3" />,
    },
    Returned: {
      color: 'text-gray-700',
      bg: 'bg-gray-100 border-gray-300',
      icon: <RotateCcw className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.color} border flex items-center gap-1`}
    >
      {config.icon}
      {status}
    </Badge>
  );
};

// Order Details Modal Component
const OrderDetailsModal: React.FC<{
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onReorder: (order: Order) => void;
  onCancel: (orderId: string) => void;
  onReturn: (orderId: string) => void;
}> = ({ order, isOpen, onClose, onReorder, onCancel, onReturn }) => {
  if (!order) return null;

  const getStatusSteps = () => {
    const allSteps = [
      { label: 'Order Placed', status: 'Pending' },
      { label: 'Confirmed', status: 'Confirmed' },
      { label: 'Processing', status: 'Processing' },
      { label: 'Shipped', status: 'Shipped' },
      { label: 'Out for Delivery', status: 'Out for Delivery' },
      { label: 'Delivered', status: 'Delivered' },
    ];

    const currentIndex = allSteps.findIndex((step) => step.status === order.status);
    const cancelledOrReturned = order.status === 'Cancelled' || order.status === 'Returned';

    return allSteps.map((step, index) => {
      const isCompleted = index <= currentIndex && !cancelledOrReturned;
      const isCurrent = index === currentIndex && !cancelledOrReturned;

      return {
        ...step,
        isCompleted,
        isCurrent,
      };
    });
  };

  const statusSteps = getStatusSteps();

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    toast.success('Invoice download started');
    // In a real app, this would generate/download a PDF
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFF8E7]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2C1810] font-serif">
            Order Details
          </DialogTitle>
          <DialogDescription className="text-[#5C4033]">
            Order Number: {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg p-6 border-2 border-[#C5A572]/20">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Order Status</h3>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.isCompleted
                          ? 'bg-[#D4AF37] text-[#2C1810]'
                          : step.isCurrent
                          ? 'bg-[#C5A572] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-current" />
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.isCompleted ? 'bg-[#D4AF37]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p
                      className={`font-medium ${
                        step.isCompleted || step.isCurrent
                          ? 'text-[#2C1810]'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.isCurrent && (
                      <p className="text-sm text-[#5C4033] mt-1">In progress</p>
                    )}
                  </div>
                </div>
              ))}
              {(order.status === 'Cancelled' || order.status === 'Returned') && (
                <div className="flex items-start gap-4 mt-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600">{order.status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg p-6 border-2 border-[#C5A572]/20">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#C5A572]/20 last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2C1810]">{item.name}</h4>
                    <p className="text-sm text-[#5C4033]">
                      Quantity: {item.quantity} {item.weight && `• ${item.weight}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#D4AF37]">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-[#5C4033]">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg p-6 border-2 border-[#C5A572]/20">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h3>
            <div className="text-[#5C4033]">
              <p className="font-medium text-[#2C1810]">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-2">
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 border-2 border-[#C5A572]/20">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[#5C4033]">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#5C4033]">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
              </div>
              {order.tax && (
                <div className="flex justify-between text-[#5C4033]">
                  <span>Tax</span>
                  <span>₹{order.tax}</span>
                </div>
              )}
              <div className="border-t border-[#C5A572]/20 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg text-[#2C1810]">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-[#5C4033] mt-2">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between text-sm text-[#5C4033] mt-2">
                  <span>Tracking Number</span>
                  <span className="font-mono">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {order.status === 'Delivered' && (
              <>
                <Button
                  onClick={() => onReorder(order)}
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                  style={{ cursor: 'pointer' }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
                <Button
                  onClick={() => onReturn(order.id)}
                  variant="outline"
                  className="border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/10"
                  style={{ cursor: 'pointer' }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Return
                </Button>
              </>
            )}
            {['Pending', 'Confirmed', 'Processing'].includes(order.status) && (
              <Button
                onClick={() => onCancel(order.id)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Order
              </Button>
            )}
            <Button
              onClick={handleDownloadInvoice}
              variant="outline"
              className="border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/10"
              style={{ cursor: 'pointer' }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = [...orders];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
        });
      }
    });
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  const handleCancel = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' as OrderStatus } : order
        )
      );
      toast.success('Order cancelled successfully');
      setIsModalOpen(false);
    }
  };

  const handleReturn = (orderId: string) => {
    if (window.confirm('Are you sure you want to return this order?')) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'Returned' as OrderStatus } : order
        )
      );
      toast.success('Return request submitted');
      setIsModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl text-[#2C1810] mb-2 font-serif">My Orders</h1>
          <p className="text-[#5C4033]">
            Track and manage all your orders in one place
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20 p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C4033] w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FFF8E7] border-[#C5A572]/50 focus:border-[#D4AF37]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#5C4033]" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-[#FFF8E7] border-[#C5A572]/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="text-[#5C4033] mt-4">Loading orders...</p>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20"
          >
            <Package className="w-24 h-24 mx-auto text-[#C5A572] mb-4" />
            <h2 className="text-2xl text-[#2C1810] mb-4">No orders found</h2>
            <p className="text-[#5C4033] mb-8">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                onClick={() => navigate('/products')}
                className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                style={{ cursor: 'pointer' }}
              >
                Browse Products
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {paginatedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/20 hover:border-[#D4AF37]/50 transition-all overflow-hidden"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2C1810]">
                            {order.orderNumber}
                          </h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#5C4033]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Ordered: {formatDate(order.orderDate)}</span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              <span>Delivered: {formatDate(order.deliveryDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#D4AF37] mb-1">
                          ₹{order.total}
                        </p>
                        <p className="text-sm text-[#5C4033]">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex gap-4 mb-4 pb-4 border-b border-[#C5A572]/20">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-sm font-medium text-[#2C1810]">{item.name}</p>
                            <p className="text-xs text-[#5C4033]">
                              Qty: {item.quantity} {item.weight && `• ${item.weight}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center text-sm text-[#5C4033]">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleViewDetails(order)}
                        variant="outline"
                        className="border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/10"
                        style={{ cursor: 'pointer' }}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      {order.status === 'Delivered' && (
                        <Button
                          onClick={() => handleReorder(order)}
                          className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                          style={{ cursor: 'pointer' }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                      )}
                      {['Pending', 'Confirmed', 'Processing'].includes(order.status) && (
                        <Button
                          onClick={() => handleCancel(order.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          style={{ cursor: 'pointer' }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-[#C5A572]/50"
                  style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? 'bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]'
                          : 'bg-white text-[#2C1810] hover:bg-[#FFF8E7] border-[#C5A572]/50'
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-[#C5A572]/50"
                  style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReorder={handleReorder}
          onCancel={handleCancel}
          onReturn={handleReturn}
        />
      </div>
    </div>
  );
}







