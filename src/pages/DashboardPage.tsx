// src/components/EcommerceDashboard.tsx
import React, { useState, useRef, ChangeEvent, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  LogOut,
  Camera,
  Trash2,
  Edit,
  Save,
  Plus,
  Heart,
  Settings,
} from 'lucide-react';
import {
  Button,
  Card as AntCard,
  Input as AntInput,
  Tabs as AntTabs,
  Avatar as AntAvatar,
  Dropdown as AntDropdown,
  MenuProps,
  Modal,
  Space,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import 'antd/dist/reset.css'; // AntD v5 reset - keep separate in your layout/root if needed

const { TextArea } = AntInput;
const { confirm } = Modal;

// Types
interface UserType {
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  product: string;
  date: string;
  status: string;
  total: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
}

interface WishlistItem {
  id: string;
  name: string;
  image?: string;
  price: string;
}

// Starter Data (you can replace these with API calls)
const initialUser: UserType = {
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  phone: '+91 98765 43210',
  profileImage: '/default-avatar.png',
};

const starterAddresses: Address[] = [
  {
    id: 'addr_1',
    label: 'Home',
    recipient: 'Aarav Sharma',
    phone: '+91 98765 43210',
    line1: '12, Olive Street, Central Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: true,
  },
];

const starterOrders: Order[] = [
  { id: 'ord_1001', product: 'Premium Jaggery Powder', date: '2025-10-28', status: 'Delivered', total: '₹499' },
  { id: 'ord_1002', product: 'Liquid Jaggery', date: '2025-10-30', status: 'Processing', total: '₹799' },
];

const starterPayments: PaymentMethod[] = [
  { id: 'pm_1', brand: 'Visa', last4: '4242', expiry: '12/27' },
];

const starterWishlist: WishlistItem[] = [
  { id: 'w_1', name: 'Organic Sugarcane Jaggery', image: '/jaggery.jpg', price: '₹299' },
];

export default function EcommerceDashboard(): JSX.Element {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // States
  const [user, setUser] = useState<UserType>(initialUser);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(initialUser.profileImage);
  const [isEditing, setIsEditing] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>(starterAddresses);
  const [orders] = useState<Order[]>(starterOrders);
  const [payments, setPayments] = useState<PaymentMethod[]>(starterPayments);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(starterWishlist);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Address form state
  const emptyAddress: Omit<Address, 'id' | 'isDefault'> = {
    label: 'Home',
    recipient: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
  } as any;
  const [addressForm, setAddressForm] = useState<any>(emptyAddress);

  // Handlers
  const handleChoosePhoto = () => fileInputRef.current?.click();

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // local preview
    const url = URL.createObjectURL(file);
    setProfilePreview(url);

    message.success('Profile image selected (preview only). Implement upload API to save permanently.');
    // TODO: upload file to server using FormData
  };

  const handleRemovePhoto = () => {
    setProfilePreview('/default-avatar.png');
    message.info('Profile picture removed locally. Implement server API to remove permanently.');
    // TODO: call API to remove on server
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    message.success('Profile updated (mock). Hook this up to your API.');
    // TODO: call API to save profile information
  };

  // Address handlers
  const openAddAddress = () => {
    setAddressForm(emptyAddress);
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({ ...addr });
    setShowAddressForm(true);
  };

  const submitAddress = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingAddress) {
      setAddresses(prev => prev.map(a => (a.id === editingAddress.id ? { ...a, ...addressForm } : a)));
      message.success('Address updated');
    } else {
      const newAddr: Address = { id: `addr_${Date.now()}`, isDefault: addresses.length === 0, ...addressForm } as Address;
      setAddresses(prev => [...prev, newAddr]);
      message.success('Address saved');
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id: string) => {
    confirm({
      title: 'Delete address?',
      content: 'Are you sure you want to delete this address? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk() {
        setAddresses(prev => prev.filter(a => a.id !== id));
        message.success('Address deleted');
      },
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    message.success('Default address updated');
  };

  // Wishlist
  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    message.success('Removed from wishlist');
  };

  // Payments (mock)
  const addDummyCard = () => {
    setPayments(prev => [...prev, { id: `pm_${Date.now()}`, brand: 'Mastercard', last4: '5555', expiry: '10/28' }]);
    message.success('Dummy card added');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    clearCart(); // Clear cart when logging out
    navigate('/login');
  };

  // Dropdown menu example for address item (using AntD items prop)
  const addressMenuItems = (addr: Address): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => openEditAddress(addr),
    },
    {
      key: 'setdefault',
      label: addr.isDefault ? 'Default' : 'Set as Default',
      onClick: () => setDefaultAddress(addr.id),
      disabled: addr.isDefault,
    },
    {
      key: 'delete',
      label: 'Delete',
      danger: true,
      onClick: () => deleteAddress(addr.id),
    },
  ];

  // Tabs children (keeps original structure but mapped inside AntTabs)
  const tabsItems = [
    {
      key: 'dashboard',
      label: (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </div>
      ),
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AntCard className="p-4 sm:p-6 shadow-none">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">Personal Information</h3>
                    <p className="text-xs sm:text-sm text-[#5C4033]">Update name, email and phone</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm block mb-1">Full Name</label>
                <AntInput value={user.name} disabled={!isEditing} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>

              <div>
                <label className="text-xs sm:text-sm block mb-1">Email</label>
                <AntInput value={user.email} disabled={!isEditing} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </div>

              <div>
                <label className="text-xs sm:text-sm block mb-1">Phone</label>
                <AntInput value={user.phone} disabled={!isEditing} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
              </div>

              {isEditing && (
                <div className="flex gap-2 flex-wrap">
                  <Button type="primary" onClick={handleSaveProfile} size="middle">
                    <Save className="mr-2 w-4 h-4" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} size="middle">Cancel</Button>
                </div>
              )}
            </div>
          </AntCard>

          <AntCard className="p-4 sm:p-6 shadow-none">
            <div>
              <h3 className="text-base sm:text-lg font-medium">Recent Orders</h3>
              <p className="text-xs sm:text-sm text-[#5C4033]">Last 3 orders at a glance</p>

              <div className="space-y-3 mt-4">
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{o.product}</div>
                      <div className="text-xs sm:text-sm text-[#5C4033]">{o.date} • {o.id}</div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="font-semibold text-sm sm:text-base">{o.total}</div>
                      <div className="text-xs sm:text-sm text-[#5C4033]">{o.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AntCard>
        </div>
      ),
    },
    {
      key: 'orders',
      label: (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>Orders</span>
        </div>
      ),
      children: (
        <AntCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium">All Orders</h3>
          <p className="text-xs sm:text-sm text-[#5C4033]">Track and view order details</p>

          <div className="space-y-3 mt-4">
            {orders.map((o) => (
              <div key={o.id} className="p-3 sm:p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm sm:text-base">{o.product}</div>
                  <div className="text-xs sm:text-sm text-[#5C4033]">{o.date} • {o.id}</div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="font-semibold text-sm sm:text-base">{o.total}</div>
                  <div className="text-xs sm:text-sm text-[#5C4033]">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </AntCard>
      ),
    },
    {
      key: 'addresses',
      label: (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Addresses</span>
        </div>
      ),
      children: (
        <AntCard className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-medium">Manage Addresses</h3>
              <p className="text-xs sm:text-sm text-[#5C4033]">Add, edit and set default delivery addresses</p>
            </div>
            <div>
              <Button type="primary" onClick={openAddAddress} className="bg-[#D4AF37] text-[#2C1810] w-full sm:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Add Address
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {showAddressForm ? (
              <form onSubmit={submitAddress} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm block mb-1">Label</label>
                    <AntInput value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm block mb-1">Recipient</label>
                    <AntInput value={addressForm.recipient} onChange={(e) => setAddressForm({ ...addressForm, recipient: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm block mb-1">Phone</label>
                    <AntInput value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm block mb-1">Pincode</label>
                    <AntInput value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm block mb-1">Address</label>
                  <TextArea value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} rows={3} required />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button type="primary" htmlType="submit" size="middle">{editingAddress ? 'Update' : 'Save'} Address</Button>
                  <Button onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} size="middle">Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div key={a.id} className="p-3 sm:p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base flex items-center flex-wrap">
                        {a.label}
                        {a.isDefault && <span className="ml-2 px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#2C1810] text-xs sm:text-sm">Default</span>}
                      </div>
                      <div className="text-xs sm:text-sm text-[#5C4033]">{a.line1}</div>
                      <div className="text-xs sm:text-sm text-[#5C4033]">{a.city}, {a.state} - {a.pincode}</div>
                      <div className="text-xs sm:text-sm text-[#5C4033] mt-1">{a.recipient} • {a.phone}</div>
                    </div>

                    <div className="flex-shrink-0">
                      <AntDropdown menu={{ items: addressMenuItems(a) }}>
                        <Button type="text" size="middle">Actions</Button>
                      </AntDropdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AntCard>
      ),
    },
    {
      key: 'payments',
      label: (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>Payments</span>
        </div>
      ),
      children: (
        <AntCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium">Payment Methods</h3>
          <p className="text-xs sm:text-sm text-[#5C4033]">Manage saved cards and add new payment options</p>

          <div className="space-y-3 mt-4">
            {payments.map((pm) => (
              <div key={pm.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm sm:text-base">{pm.brand} • • • • {pm.last4}</div>
                  <div className="text-xs sm:text-sm text-[#5C4033]">Expires {pm.expiry}</div>
                </div>
                <div className="flex-shrink-0">
                  <Button type="text" size="middle">Remove</Button>
                </div>
              </div>
            ))}

            <div className="pt-3">
              <Button type="primary" onClick={addDummyCard} className="bg-[#D4AF37] text-[#2C1810]" size="middle">Add Card</Button>
            </div>
          </div>
        </AntCard>
      ),
    },
    {
      key: 'wishlist',
      label: (
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          <span>Wishlist</span>
        </div>
      ),
      children: (
        <AntCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium">Wishlist</h3>
          <p className="text-xs sm:text-sm text-[#5C4033]">Items you've saved for later</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 mt-4">
            {wishlist.map((w) => (
              <div key={w.id} className="p-3 sm:p-4 border rounded-lg flex flex-col">
                <div className="h-32 sm:h-40 bg-gray-50 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  {w.image ? <img src={w.image} alt={w.name} className="object-cover h-full w-full rounded-md" /> : <div className="text-xs sm:text-sm">No Image</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm sm:text-base">{w.name}</div>
                  <div className="text-xs sm:text-sm text-[#5C4033]">{w.price}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button className="flex-1" size="middle">Add to Cart</Button>
                  <Button type="text" onClick={() => removeFromWishlist(w.id)} className="text-red-600" size="middle">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </AntCard>
      ),
    },
    {
      key: 'settings',
      label: (
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      ),
      children: (
        <AntCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium">Account Settings</h3>
          <p className="text-xs sm:text-sm text-[#5C4033]">Security and preferences</p>

          <div className="space-y-3 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm sm:text-base">Change Password</div>
                <div className="text-xs sm:text-sm text-[#5C4033]">Update your account password</div>
              </div>
              <Button type="default" size="middle">Change</Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm sm:text-base">Email Preferences</div>
                <div className="text-xs sm:text-sm text-[#5C4033]">Manage marketing and notification emails</div>
              </div>
              <Button type="default" size="middle">Manage</Button>
            </div>
          </div>
        </AntCard>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] via-white to-white py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left column - Profile Card */}
          <div className="lg:col-span-1">
            <AntCard className="shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="relative">
                  <AntAvatar size={80} src={profilePreview} className="w-20 h-20 sm:w-28 sm:h-28" style={{ border: '4px solid #D4AF37' }}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AntAvatar>

                  <div className="absolute right-0 bottom-0 flex space-x-1 sm:space-x-2">
                    <Button 
                      type="primary" 
                      shape="circle" 
                      onClick={handleChoosePhoto} 
                      className="bg-[#D4AF37] text-[#2C1810] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button 
                      danger 
                      type="default" 
                      shape="circle" 
                      onClick={handleRemovePhoto}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileChange} />

                <div className="w-full px-2">
                  <h3 className="font-serif text-lg sm:text-xl text-[#2C1810] break-words">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-[#5C4033] break-all mt-1">{user.email}</p>
                  <p className="text-xs sm:text-sm text-[#5C4033] mt-1">{user.phone}</p>
                </div>

                <div className="w-full">
                  <div className="my-3 sm:my-4 border-t" />
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => setIsEditing(prev => !prev)} type={isEditing ? 'default' : 'dashed'} className="w-full">
                      {isEditing ? (<><Save className="mr-2 w-4 h-4" /> Save</>) : (<><Edit className="mr-2 w-4 h-4" /> Edit Profile</>)}
                    </Button>
                    <Button type="text" onClick={handleLogout} className="w-full justify-center sm:justify-start text-red-600">
                      <LogOut className="mr-2 w-4 h-4" /> Logout
                    </Button>
                  </div>
                </div>
              </div>
            </AntCard>

            <AntCard className="mt-4 sm:mt-6 shadow-md rounded-xl sm:rounded-2xl p-4">
              <div>
                <h4 className="text-base sm:text-lg font-serif">Quick Actions</h4>
                <p className="text-xs sm:text-sm text-[#5C4033]">Common account tasks</p>
                <div className="flex flex-col space-y-2 mt-3">
                  <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="default" size="middle">New Order</Button>
                  <Button onClick={() => addDummyCard()} type="default" size="middle">Add Payment</Button>
                </div>
              </div>
            </AntCard>
          </div>

          {/* Right column - Tabs */}
          <div className="lg:col-span-3">
            <AntCard className="rounded-xl sm:rounded-2xl shadow-lg">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <h2 className="text-xl sm:text-2xl font-serif text-[#2C1810]">Account Dashboard</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button type="link" className="gap-2 p-0 justify-start sm:justify-center"><Heart className="w-4 h-4" /> Wishlist ({wishlist.length})</Button>
                    <Button type="default" onClick={() => navigate('/orders')} className="gap-2"><Package className="w-4 h-4" /> View Orders</Button>
                  </div>
                </div>

                <AntTabs defaultActiveKey="dashboard" items={tabsItems} />
              </div>
            </AntCard>
          </div>
        </div>
      </div>
    </div>
  );
}
