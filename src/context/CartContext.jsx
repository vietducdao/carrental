import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null); // { car, pickupDate, returnDate, days }
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { voucher, discount }

  const addToCart = useCallback((car, pickupDate, returnDate) => {
    const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000));
    setCartItem({ car, pickupDate, returnDate, days });
    setAppliedVoucher(null);
  }, []);

  const clearCart = useCallback(() => {
    setCartItem(null);
    setAppliedVoucher(null);
  }, []);

  const applyVoucher = useCallback((voucherData) => {
    setAppliedVoucher(voucherData);
  }, []);

  const subtotal = cartItem ? cartItem.days * cartItem.car.dailyRate : 0;
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider value={{ cartItem, appliedVoucher, subtotal, discount, total, addToCart, clearCart, applyVoucher }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
