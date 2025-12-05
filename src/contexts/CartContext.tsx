import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  clearCart: () => void;

}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        const updatedItems = prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        // Show notification for quantity increase
        toast.success(`${newItem.name} added to cart!`, {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#D4AF37',
            color: '#2C1810',
            borderRadius: '8px',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        return updatedItems;
      }
      
      // If item doesn't exist, add it with quantity 1
      const newItems = [...prevItems, { ...newItem, quantity: 1 }];
      // Show notification for new item
      toast.success(`${newItem.name} added to cart!`, {
        position: 'top-right',
        duration: 3000,
        style: {
          background: '#D4AF37',
          color: '#2C1810',
          borderRadius: '8px',
          padding: '12px 16px',
          fontWeight: '500',
        },
      });
      return newItems;
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          // If quantity becomes 0 or negative, remove the item
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      // Filter out null items (removed due to quantity <= 0)
      return updatedItems.filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}