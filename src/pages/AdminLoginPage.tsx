import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check credentials
    if ((username === 'RoshanDS' && password === 'hackerone007') || (username === 'Nithin' && password === 'hackerone007')) {
      // Store admin session
      localStorage.setItem('admin', JSON.stringify({ username, loggedIn: true, timestamp: Date.now() }));
      toast.success('Login successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } else {
      toast.error('Invalid username or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C1810] via-[#3E2723] to-[#2C1810] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-[#FFF8E7] rounded-2xl shadow-2xl border-2 border-[#D4AF37]/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-3xl font-serif text-[#2C1810] mb-2">Admin Login</h1>
            <p className="text-[#5C4033]">Access the admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-[#2C1810] mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810]"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#2C1810] mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-[#C5A572]/50 focus:border-[#D4AF37] text-[#2C1810] pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C4033] hover:text-[#2C1810]"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] py-6 text-lg font-semibold"
              disabled={isLoading}
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#2C1810] border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>Login</span>
                </div>
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
            <p className="text-xs text-[#5C4033] text-center">
              <Lock className="w-3 h-3 inline mr-1" />
              Secure admin access only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

