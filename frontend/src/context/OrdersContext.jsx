import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { products } from "../data/products";
import { demoUser } from "../data/demo";
import { parsePrice } from "../utils/format";

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

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function makeItem(productId, quantity, color, size) {
  const product = findProduct(productId);

  return {
    id: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    type: product.type,
    price: product.price,
    quantity,
    selectedColor: color,
    selectedSize: size,
  };
}

function buildDemoOrders() {
  const orderOneItems = [
    makeItem(1, 1, "أسود في أبيض", "M"),
    makeItem(7, 2, "أبيض", "L"),
  ];

  const orderTwoItems = [makeItem(12, 2, "بني", "8 سنوات")];

  const orderThreeItems = [makeItem(14, 1, "أسود", "S")];

  const subtotalOne = orderOneItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const subtotalTwo = orderTwoItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const subtotalThree = orderThreeItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  return [
    {
      id: "DEMO-2001",
      date: "2026-08-14T12:00:00.000Z",
      ownerKey: demoUser.id,
      status: "delivered",
      items: orderOneItems,
      subtotal: subtotalOne,
      discount: 0,
      shippingCost: 0,
      total: subtotalOne,
      payment: "cod",
      shipping: {
        name: demoUser.name,
        phone: demoUser.phone,
        governorate: "الإسكندرية",
        address: demoUser.addresses[0].address,
      },
    },
    {
      id: "DEMO-2002",
      date: "2026-09-02T15:30:00.000Z",
      ownerKey: demoUser.id,
      status: "shipped",
      items: orderTwoItems,
      subtotal: subtotalTwo,
      discount: 0,
      shippingCost: 60,
      total: subtotalTwo + 60,
      payment: "whatsapp",
      shipping: {
        name: demoUser.name,
        phone: demoUser.phone,
        governorate: "القاهرة",
        address: demoUser.addresses[1].address,
      },
    },
    {
      id: "DEMO-2003",
      date: "2026-09-18T09:00:00.000Z",
      ownerKey: demoUser.id,
      status: "pending",
      items: orderThreeItems,
      subtotal: subtotalThree,
      discount: 60,
      shippingCost: 60,
      total: subtotalThree,
      payment: "cod",
      shipping: {
        name: demoUser.name,
        phone: demoUser.phone,
        governorate: "البحيرة",
        address: "شارع الجمهورية، برج المعمورة، دمنهور",
      },
    },
  ];
}

export function OrdersProvider({ children }) {
  const { currentUser, getGuestId } = useAuth();

  const [orders, setOrders] = useState(() => {
    const saved = loadOrders();

    if (saved.some((order) => String(order.id).startsWith("DEMO-"))) {
      return saved;
    }

    return [...saved, ...buildDemoOrders()];
  });

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