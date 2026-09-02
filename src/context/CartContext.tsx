import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types/restaurant';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, special_instructions?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gourmet_royal_cart';
const TABLE_STORAGE_KEY = 'gourmet_royal_table';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [tableNumber, setTableNumberState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      // Check URL query param first
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        localStorage.setItem(TABLE_STORAGE_KEY, urlTable);
        return urlTable;
      }
      return localStorage.getItem(TABLE_STORAGE_KEY);
    }
    return null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with URL search params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        setTableNumberState(urlTable);
        localStorage.setItem(TABLE_STORAGE_KEY, urlTable);
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const setTableNumber = (table: string | null) => {
    setTableNumberState(table);
    if (typeof window !== 'undefined') {
      if (table) {
        localStorage.setItem(TABLE_STORAGE_KEY, table);
      } else {
        localStorage.removeItem(TABLE_STORAGE_KEY);
      }
    }
  };

  const addToCart = (product: Product, quantity: number = 1, special_instructions: string = '') => {
    if (!product.available) {
      alert('Désolé, ce plat est actuellement en rupture de stock.');
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          special_instructions: special_instructions || updated[existingIndex].special_instructions,
        };
        return updated;
      }
      return [...prevItems, { product, quantity, special_instructions }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 5000; // Default delivery fee in MGA
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        tableNumber,
        setTableNumber,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
