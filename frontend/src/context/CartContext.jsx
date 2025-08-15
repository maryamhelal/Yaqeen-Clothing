import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity, selectedColor, selectedSize) => {
    setCart((prev) => {
      // Find existing cart item with same product, color, and size
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      // Find available quantity for this size
      const colorObj =
        product.colors?.find((c) => c.name === selectedColor) || {};
      const sizeObj =
        colorObj.sizes?.find((s) => s.size === selectedSize) || {};
      const maxQty = sizeObj.quantity || 1;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: newQty }
            : item
        );
      }
      // If adding new, clamp to maxQty
      const itemToAdd = {
        ...product,
        quantity: Math.min(quantity, maxQty),
        size: selectedSize || product.size,
        color: selectedColor || product.color,
      };
      return [...prev, itemToAdd];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));
  const updateQuantity = (id, quantity) =>
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
