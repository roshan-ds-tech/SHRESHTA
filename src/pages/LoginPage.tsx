import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config'; 

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${API_BASE_URL}/accounts/login/`, {
      username,
      password,
    });

    console.log("API Response:", response.data);

    localStorage.setItem("user", JSON.stringify(response.data));

    console.log("localStorage after saving:", localStorage.getItem("user"));

    // Dispatch event to update navbar
    window.dispatchEvent(new Event('userUpdated'));

    toast.success('Login successful! Redirecting...');
    
    navigate("/");
    window.location.reload();
  } catch (error: any) {
    console.log("Login Error:", error);
    
    // Display error message to user
    if (error.response && error.response.status === 401) {
      toast.error(error.response.data?.error || 'Invalid username or password. Please try again.');
    } else if (error.response && error.response.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.request) {
      toast.error('Unable to connect to server. Please check your connection.');
    } else {
      toast.error('An error occurred during login. Please try again.');
    }
  }
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
            <h2 className="text-2xl text-[#2C1810]">Welcome Back</h2>
            <p className="text-sm text-[#5C4033] mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-[#2C1810]">
                User Name
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Joh Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4033] hover:text-[#D4AF37]"
                  style={{cursor: "pointer"}}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border-[#C5A572] text-[#D4AF37] focus:ring-[#D4AF37] rounded"
                  style={{cursor: "pointer"}}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#5C4033]">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#D4AF37] hover:text-[#C5A572]">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] py-6"
              style={{cursor: "pointer"}}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#C5A572]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#5C4033]">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-[#5C4033]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#D4AF37] hover:text-[#C5A572]">
              Sign up now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
