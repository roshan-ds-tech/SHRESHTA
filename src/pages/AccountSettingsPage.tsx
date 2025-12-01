import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  User, Camera, Save, X, Plus, Edit, Trash2, MapPin, 
  Lock, Mail, Bell, Package,
  Check, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user is logged in
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipient: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    orderStatus: true,
    promotions: false,
    newsletters: false,
  });

  // Fetch user profile from backend
  const fetchUserProfile = async (username: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/accounts/profile/?username=${username}`
      );
      if (response.data.profile_image) {
        setProfileImage(response.data.profile_image);
        // Update localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.profile_image = response.data.profile_image;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Check authentication on mount and fetch profile
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setPersonalInfo({
        name: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      
      // Load profile image from user data
      if (userData.profile_image) {
        setProfileImage(userData.profile_image);
      } else {
        // Fetch fresh profile data from backend
        fetchUserProfile(userData.username);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load addresses from localStorage or set default
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
    
    // Load notification preferences
    const savedNotifications = localStorage.getItem('notificationPreferences');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save addresses to localStorage
  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
  };

  // Profile Picture Upload
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setProfileImage(imageUrl);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      const formData = new FormData();
      formData.append('profile_image', file);
      formData.append('username', user?.username || '');

      const response = await axios.post(
        `${API_BASE_URL}/accounts/profile/upload-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update localStorage with new image URL
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.profile_image = response.data.profile_image;
        localStorage.setItem('user', JSON.stringify(userData));
        setProfileImage(response.data.profile_image);
        toast.success('Profile picture updated successfully!');
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error: any) {
      console.error('Profile image upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload profile picture');
      // Revert preview on error
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfileImage(userData.profile_image || null);
      } else {
        setProfileImage(null);
      }
    }
  };

  // Save Personal Information
  const handleSavePersonalInfo = async () => {
    if (!user) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/accounts/profile/`,
        {
          username: user.username, // Current username
          email: personalInfo.email,
          phone: personalInfo.phone,
        }
      );

      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.username = response.data.username;
        userData.email = response.data.email;
        userData.phone = response.data.phone;
        userData.profile_image = response.data.profile_image;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Personal information updated successfully!');
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  // Save Password
  const handleChangePassword = async () => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/accounts/change-password/`,
        {
          username: user.username,
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }
      );

      if (response.data.message) {
        toast.success(response.data.message);
        
        // Clear password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // Clear user session and redirect to login
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userUpdated'));
        
        // Show message and redirect after a short delay
        setTimeout(() => {
          toast.success('Please login with your new password');
          navigate('/login');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Address Management
  const handleAddAddress = () => {
    if (!addressForm.recipient || !addressForm.phone || !addressForm.line1 || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...addressForm,
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, newAddress];
    saveAddresses(updatedAddresses);
    setShowAddressForm(false);
    resetAddressForm();
    toast.success('Address added successfully!');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      recipient: address.recipient,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setShowAddressForm(true);
  };

  const handleUpdateAddress = () => {
    if (!editingAddress) return;

    if (!addressForm.recipient || !addressForm.phone || !addressForm.line1 || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const updatedAddresses = addresses.map(addr =>
      addr.id === editingAddress.id
        ? { ...addressForm, id: editingAddress.id, isDefault: editingAddress.isDefault }
        : addr
    );
    saveAddresses(updatedAddresses);
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
    toast.success('Address updated successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (address?.isDefault && addresses.length > 1) {
      toast.error('Cannot delete default address. Please set another address as default first.');
      return;
    }

    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    saveAddresses(updatedAddresses);
    toast.success('Address deleted successfully!');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updatedAddresses);
    toast.success('Default address updated!');
  };

  const resetAddressForm = () => {
    setAddressForm({
      label: 'Home',
      recipient: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
  };

  // Save Notification Preferences
  const handleSaveNotifications = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
    toast.success('Notification preferences saved!');
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-2 font-serif">
            Account Settings
          </h1>
          <p className="text-[#5C4033]">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3] sticky top-24"
            >
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-[#F5E6D3]">
                <div className="relative mb-4">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#D4AF37] flex items-center justify-center text-3xl font-bold text-[#2C1810] border-4 border-[#D4AF37]">
                      {getInitials(personalInfo.name)}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#D4AF37] text-[#2C1810] p-2 rounded-full shadow-lg hover:bg-[#C5A572] transition-colors"
                    style={{ cursor: 'pointer' }}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#2C1810]">{personalInfo.name || 'User'}</h2>
                <p className="text-sm text-[#5C4033]">{personalInfo.email}</p>
              </div>

              <nav className="space-y-2">
                <a href="#personal" className="block px-4 py-2 rounded-lg text-[#2C1810] hover:bg-[#F5E6D3] transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Info
                </a>
                <a href="#addresses" className="block px-4 py-2 rounded-lg text-[#2C1810] hover:bg-[#F5E6D3] transition-colors flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Addresses
                </a>
                <a href="#password" className="block px-4 py-2 rounded-lg text-[#2C1810] hover:bg-[#F5E6D3] transition-colors flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </a>
                <a href="#notifications" className="block px-4 py-2 rounded-lg text-[#2C1810] hover:bg-[#F5E6D3] transition-colors flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </a>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              id="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3]"
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-semibold text-[#2C1810]">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#2C1810] mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#2C1810] mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-[#2C1810] mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button
                  onClick={handleSavePersonalInfo}
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                  style={{ cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>

            {/* Addresses */}
            <motion.div
              id="addresses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-xl font-semibold text-[#2C1810]">Saved Addresses</h2>
                </div>
                {!showAddressForm && (
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                    style={{ cursor: 'pointer' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                )}
              </div>

              {showAddressForm ? (
                <div className="bg-[#F5E6D3]/30 rounded-lg p-6 space-y-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#2C1810]">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <button
                      onClick={cancelAddressForm}
                      className="text-[#5C4033] hover:text-[#2C1810]"
                      style={{ cursor: 'pointer' }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">Address Label</Label>
                      <select
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        className="w-full h-9 rounded-md border border-[#C5A572] px-3 focus:border-[#D4AF37] focus:ring-[#D4AF37] focus:ring-2"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">Recipient Name *</Label>
                      <Input
                        value={addressForm.recipient}
                        onChange={(e) => setAddressForm({ ...addressForm, recipient: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">Phone Number *</Label>
                      <Input
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[#2C1810] mb-2 block">Address Line 1 *</Label>
                      <Input
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="Street address, apartment, suite"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[#2C1810] mb-2 block">Address Line 2</Label>
                      <Input
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">City *</Label>
                      <Input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">State *</Label>
                      <Input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C1810] mb-2 block">Pincode *</Label>
                      <Input
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        placeholder="PIN code"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                      className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                      style={{ cursor: 'pointer' }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                    <Button
                      onClick={cancelAddressForm}
                      variant="outline"
                      className="border-[#C5A572] text-[#2C1810] hover:bg-[#F5E6D3]"
                      style={{ cursor: 'pointer' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-[#5C4033]">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-[#C5A572]" />
                    <p>No addresses saved yet</p>
                    <p className="text-sm mt-1">Add your first address to get started</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border-2 border-[#F5E6D3] rounded-lg p-4 hover:border-[#D4AF37] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded text-sm font-medium">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-[#D4AF37] text-[#2C1810] rounded text-xs font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-[#2C1810] mb-1">{address.recipient}</p>
                          <p className="text-[#5C4033] text-sm mb-1">{address.phone}</p>
                          <p className="text-[#5C4033] text-sm">
                            {address.line1}
                            {address.line2 && `, ${address.line2}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                              title="Set as default"
                              style={{ cursor: 'pointer' }}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-[#5C4033] hover:bg-[#F5E6D3] rounded-lg transition-colors"
                            title="Edit address"
                            style={{ cursor: 'pointer' }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete address"
                            style={{ cursor: 'pointer' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Password Change */}
            <motion.div
              id="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3]"
            >
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-semibold text-[#2C1810]">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-[#2C1810] mb-2 block">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-[#2C1810] mb-2 block">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-[#2C1810] mb-2 block">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-[#F5E6D3]/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#5C4033]">
                    Password must be at least 6 characters long. Use a combination of letters, numbers, and special characters for better security.
                  </p>
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                  style={{ cursor: 'pointer' }}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              id="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F5E6D3]"
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-semibold text-[#2C1810]">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[#F5E6D3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-[#2C1810]">Email Updates</p>
                      <p className="text-sm text-[#5C4033]">Receive updates about your account</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailUpdates}
                      onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[#F5E6D3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-[#2C1810]">Order Status</p>
                      <p className="text-sm text-[#5C4033]">Get notified about order updates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.orderStatus}
                      onChange={(e) => setNotifications({ ...notifications, orderStatus: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[#F5E6D3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-[#2C1810]">Promotions & Offers</p>
                      <p className="text-sm text-[#5C4033]">Receive special offers and discounts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[#F5E6D3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-[#2C1810]">Newsletters</p>
                      <p className="text-sm text-[#5C4033]">Subscribe to our newsletter</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newsletters}
                      onChange={(e) => setNotifications({ ...notifications, newsletters: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <Button
                  onClick={handleSaveNotifications}
                  className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572]"
                  style={{ cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

