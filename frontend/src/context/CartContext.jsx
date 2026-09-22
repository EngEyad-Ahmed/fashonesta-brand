import { createContext, useContext, useEffect, useState } from "react";
import { getCoupon } from "../data/coupons";
import { parsePrice } from "../utils/format";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "fashionistaCartV2";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, selectedColor = "", selectedSize = "", quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );

      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + qty } : item,
        );
      }

      const cartId = `${product.id}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      return [...prev, { ...product, cartId, selectedColor, selectedSize, quantity: qty }];
    });
  };

const removeFromCart = (cartId) => {
  const nextItems = cartItems.filter((item) => item.cartId !== cartId);

  if (nextItems.length === 0) {
    setCoupon(null);
  }

  setCartItems(nextItems);
};

const increaseQuantity = (cartId) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
    ),
  );
};

const decreaseQuantity = (cartId) => {
  const nextItems = cartItems
    .map((item) =>
      item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item,
    )
    .filter((item) => item.quantity > 0);

  if (nextItems.length === 0) {
    setCoupon(null);
  }

  setCartItems(nextItems);
};

const clearCart = () => {
  setCartItems([]);
  setCoupon(null);
};

  const subtotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const shippingCost = subtotal >= 1500 || subtotal === 0 ? 0 : 60;

  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;

  const cartTotal = Math.max(0, subtotal - discount);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = (code) => {
    const found = getCoupon(code);

    if (!found) {
      return { ok: false, message: "كود الخصم غير صحيح" };
    }

    const amount = Math.floor((subtotal * found.value) / 100);

    setCoupon({
      code: found.code,
      label: `خصم ${found.value}%`,
      discount: amount,
    });

    return {
      ok: true,
      message: `تم تطبيق الكود ${found.code}: خصم ${found.value}%`,
      discount: amount,
    };
  };

  const clearCoupon = () => setCoupon(null);

  const cartItemsSnapshot = cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    type: item.type,
    quantity: item.quantity,
    selectedColor: item.selectedColor || "",
    selectedSize: item.selectedSize || "",
  }));

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    subtotal,
    shippingCost,
    discount,
    coupon,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    applyCoupon,
    clearCoupon,
    cartItemsSnapshot,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}