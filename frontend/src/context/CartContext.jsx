import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getCoupon } from "../data/coupons";
import { parsePrice } from "../utils/format";
import { api } from "../api/client";

const CartContext = createContext(null);

function toSlim(item) {
  return {
    productId: item.id,
    cartId: item.cartId || `${item.id}-cart`,
    quantity: item.quantity,
    selectedColor: item.selectedColor || "",
    selectedSize: item.selectedSize || "",
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const cartRef = useRef([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    cartRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/cart")
      .then((data) => {
        if (!cancelled) {
          const next = Array.isArray(data.items) ? data.items : [];
          cartRef.current = next;
          setCartItems(next);
        }
      })
      .catch(() => {
        if (!cancelled) setCartItems([]);
      })
      .finally(() => {
        if (!cancelled) setCartReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((items) => {
    api
      .put("/cart", { items: items.map(toSlim) })
      .catch(() => {
        // server unreachable: keep local view, will sync later
      });
  }, []);

  const commit = useCallback(
    (next) => {
      setCartItems(next);
      cartRef.current = next;
      persist(next);
    },
    [persist],
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (product, selectedColor = "", selectedSize = "", quantity = 1) => {
      const qty = Math.max(1, Number(quantity) || 1);
      const current = cartRef.current;

      const existing = current.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );

      let next;

      if (existing) {
        next = current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + qty } : item,
        );
      } else {
        const cartId = `${product.id}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        next = [...current, { ...product, cartId, selectedColor, selectedSize, quantity: qty }];
      }

      commit(next);
    },
    [commit],
  );

  const removeFromCart = useCallback(
    (cartId) => {
      const next = cartRef.current.filter((item) => item.cartId !== cartId);

      if (next.length === 0) setCoupon(null);

      commit(next);
    },
    [commit],
  );

  const increaseQuantity = useCallback(
    (cartId) => {
      const next = cartRef.current.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
      );

      commit(next);
    },
    [commit],
  );

  const decreaseQuantity = useCallback(
    (cartId) => {
      const next = cartRef.current
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0);

      if (next.length === 0) setCoupon(null);

      commit(next);
    },
    [commit],
  );

  const clearCart = useCallback(() => {
    setCoupon(null);
    commit([]);
  }, [commit]);

  const subtotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const shippingCost = subtotal >= 1500 || subtotal === 0 ? 0 : 60;

  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;

  const cartTotal = Math.max(0, subtotal - discount);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = useCallback(
    (code) => {
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
    },
    [subtotal],
  );

  const clearCoupon = useCallback(() => setCoupon(null), []);

  const cartItemsSnapshot = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        type: item.type,
        quantity: item.quantity,
        selectedColor: item.selectedColor || "",
        selectedSize: item.selectedSize || "",
      })),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartReady,
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
    }),
    [
      cartItems,
      cartReady,
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
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}