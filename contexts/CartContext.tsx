
import React, { createContext, useContext, useState } from 'react';
import { CartItem } from '../interfaces';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number | string, quantity: number) => boolean;
  removeFromCart: (productId: number | string) => void;
  updateCartQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  setCartFromOrder: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (productId: number | string, quantity: number) => {
    let alreadyInCart = false;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        alreadyInCart = true;
        return prev;
      }
      return [...prev, { productId, quantity: 1 }]; 
    });
    return !alreadyInCart;
  };

  const removeFromCart = (productId: number | string) =>
    setCart((prev) => prev.filter((item) => item.productId !== productId));

  const updateCartQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const setCartFromOrder = (items: CartItem[]) => {
      // Remove ordered items from cart
      const boughtIds = new Set(items.map((i) => i.productId));
      setCart((prev) => prev.filter((i) => !boughtIds.has(i.productId)));
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, setCartFromOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
