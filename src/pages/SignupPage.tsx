import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/accounts/signup/", {
      username: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    console.log("Signup success:", response.data);

    toast.success('Signup successful! Redirecting to login...');
    navigate('/login');
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Signup failed!");
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] via-[#F5E6D3] to-[#FFF8E7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#C5A572]/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-40 h-40 rounded-full bg-[#3E2723] flex items-center justify-center p-4">
                <img src="/logo_final.png" alt="logo" className="h-full w-full object-contain" style={{maxHeight: '140px', maxWidth: '140px'}}/>
              </div>
            </div>
            <h2 className="text-2xl text-[#2C1810]">Create Your Account</h2>
            <p className="text-sm text-[#5C4033] mt-2">
              Join us for premium jaggery
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-[#2C1810]">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Roshan DS"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-[#2C1810]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#2C1810]">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#2C1810]">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4033] hover:text-[#D4AF37]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#2C1810]">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4033] hover:text-[#D4AF37]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 mt-1 border-[#C5A572] text-[#D4AF37] focus:ring-[#D4AF37] rounded"
                style={{cursor: "pointer"}}
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#5C4033]">
                I agree to the{' '}
                <Link to="/privacy" className="text-[#D4AF37] hover:text-[#C5A572]">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#D4AF37] hover:text-[#C5A572]">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] py-6"
              style={{cursor: "pointer"}}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#C5A572]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#5C4033]">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* Social Signup */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10"
              style={{cursor: "pointer"}}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[#C5A572] text-[#2C1810] hover:bg-[#D4AF37]/10"
              style={{cursor: "pointer"}}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#5C4033]" >
            Already have an account?{' '}
            <Link to="/login" className="text-[#D4AF37] hover:text-[#C5A572]" style={{cursor: "pointer"}}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
