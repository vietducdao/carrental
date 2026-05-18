import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext(null);

const ITEMS_KEY = "user_cart_items";
const VOUCHER_KEY = "user_cart_voucher";

const computeDays = (pickupDate, returnDate, sameDayReturn) => {
  if (sameDayReturn) return 0.5;
  return Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000));
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readJSON(ITEMS_KEY, []));
  const [appliedVoucher, setAppliedVoucher] = useState(() => readJSON(VOUCHER_KEY, null));

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedVoucher) localStorage.setItem(VOUCHER_KEY, JSON.stringify(appliedVoucher));
    else localStorage.removeItem(VOUCHER_KEY);
  }, [appliedVoucher]);

  const addToCart = useCallback(
    (car, pickupDate, returnDate, pickupLocation = "", dropoffLocation = "", sameDayReturn = false) => {
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        car,
        pickupDate,
        returnDate,
        days: computeDays(pickupDate, returnDate, sameDayReturn),
        pickupLocation,
        dropoffLocation,
        sameDayReturn,
      };
      setCartItems((prev) => [...prev, item]);
    },
    []
  );

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedVoucher(null);
  }, []);

  const applyVoucher = useCallback((voucherData) => {
    setAppliedVoucher(voucherData);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.days * item.car.dailyRate, 0);
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        appliedVoucher,
        subtotal,
        discount,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        applyVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
