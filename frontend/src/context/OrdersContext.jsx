import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

const ORDERS_KEY = "fashionistaOrdersV1";

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }) {
  const { currentUser, getGuestId } = useAuth();

  const [orders, setOrders] = useState(() => loadOrders());

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback(
    (payload) => {
      const ownerKey =
        (currentUser && currentUser.id) || getGuestId() || "guest";

      const order = {
        id: `FAS-${Date.now().toString().slice(-6)}-${Math.random()
          .toString(36)
          .slice(2, 5)
          .toUpperCase()}`,
        date: new Date().toISOString(),
        ownerKey,
        status: "pending",
        note: "",
        ...payload,
      };

      setOrders((prev) => [order, ...prev]);

      return order;
    },
    [currentUser, getGuestId],
  );

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }, []);

  const getOrdersFor = useCallback(
    (ownerKey) => {
      if (!ownerKey) return [];
      return orders.filter((o) => o.ownerKey === ownerKey);
    },
    [orders],
  );

  const getOrderById = useCallback(
    (orderId) => orders.find((o) => o.id === orderId) || null,
    [orders],
  );

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      updateOrderStatus,
      getOrdersFor,
      getOrderById,
    }),
    [orders, createOrder, updateOrderStatus, getOrdersFor, getOrderById],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }

  return context;
}