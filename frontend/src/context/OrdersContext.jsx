import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { api } from "../api/client";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { authReady } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    api
      .get("/orders")
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data.orders) ? data.orders : [];
          setOrders(list);
        }
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });

    return () => {
      cancelled = true;
    };
  }, [authReady]);

  const createOrder = useCallback(async (payload) => {
    const data = await api.post("/orders", payload);

    if (data.order) {
      setOrders((prev) => [data.order, ...prev]);
    }

    return data.order;
  }, []);

  const getOrdersFor = useCallback(() => orders, [orders]);

  const getOrderById = useCallback(
    (orderId) => orders.find((o) => o.id === orderId) || null,
    [orders],
  );

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      getOrdersFor,
      getOrderById,
    }),
    [orders, createOrder, getOrdersFor, getOrderById],
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