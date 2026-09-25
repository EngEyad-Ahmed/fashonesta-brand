import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { swatchFor } from "../data/products";

const WishlistContext = createContext(null);

function shapeProduct(product) {
  if (!product) return product;

  return {
    ...product,
    gallery: [product.image],
    swatches: Object.fromEntries(
      (product.colors || []).map((color) => [color, swatchFor(color)]),
    ),
  };
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistReady, setWishlistReady] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/wishlist")
      .then((data) => {
        if (!cancelled) {
          setWishlistItems((data.products || []).map(shapeProduct));
        }
      })
      .catch(() => {
        if (!cancelled) setWishlistItems([]);
      })
      .finally(() => {
        if (!cancelled) setWishlistReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  const isInWishlist = useCallback(
    (id) => wishlistItems.some((item) => item.id === Number(id)),
    [wishlistItems],
  );

  const toggleWishlist = useCallback((product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);

    setWishlistItems((prev) =>
      exists
        ? prev.filter((item) => item.id !== product.id)
        : [shapeProduct(product), ...prev],
    );

    const request = exists
      ? api.del(`/wishlist/${product.id}`)
      : api.post(`/wishlist/${product.id}`);

    request
      .then((data) => setWishlistItems((data.products || []).map(shapeProduct)))
      .catch(() => {
        // ignore; will reconcile on next load
      });
  }, [wishlistItems]);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== Number(id)));

    api
      .del(`/wishlist/${id}`)
      .then((data) => setWishlistItems((data.products || []).map(shapeProduct)))
      .catch(() => {
        // ignore
      });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);

    api.del("/wishlist").catch(() => {
      // ignore
    });
  }, []);

  const wishlistCount = wishlistItems.length;

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      wishlistReady,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      wishlistItems,
      wishlistCount,
      wishlistReady,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}