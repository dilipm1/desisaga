"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Cart } from "@/types";

interface CartContextType {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("desisaga-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem("desisaga-cart");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("desisaga-cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addItem = (product: Product) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: prev.total + product.price,
        };
      }
      return {
        items: [...prev.items, { product, quantity: 1 }],
        total: prev.total + product.price,
      };
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.product.id === productId);
      if (!item) return prev;
      return {
        items: prev.items.filter((i) => i.product.id !== productId),
        total: prev.total - item.product.price * item.quantity,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setCart((prev) => {
      const item = prev.items.find((i) => i.product.id === productId);
      if (!item) return prev;
      const diff = quantity - item.quantity;
      return {
        items: prev.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
        total: prev.total + item.product.price * diff,
      };
    });
  };

  const clearCart = () => setCart({ items: [], total: 0 });

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
