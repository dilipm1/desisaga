"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Product, Cart, CartItem } from "@/types";

interface CartContextType {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "desisaga-cart";

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function loadCart(): Cart {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: Cart = JSON.parse(saved);
      return { items: parsed.items, total: computeTotal(parsed.items) };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { items: [], total: 0 };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product.id === product.id);
      const items = existing
        ? prev.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev.items, { product, quantity: 1 }];
      return { items, total: computeTotal(items) };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.product.id !== productId);
      return { items, total: computeTotal(items) };
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }
      setCart((prev) => {
        const items = prev.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        );
        return { items, total: computeTotal(items) };
      });
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

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
