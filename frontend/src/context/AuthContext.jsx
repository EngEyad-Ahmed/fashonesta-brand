import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/auth/me")
      .then((data) => {
        if (!cancelled) setCurrentUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setCurrentUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const register = useCallback(async ({ name, phone, password }) => {
    try {
      await api.post("/auth/register", { name, phone, password });

      const data = await api.get("/auth/me");
      setCurrentUser(data.user);

      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const login = useCallback(async ({ phone, password }) => {
    try {
      await api.post("/auth/login", { phone, password });

      const data = await api.get("/auth/me");
      setCurrentUser(data.user);

      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    setCurrentUser(null);
  }, []);

  const saveAddress = useCallback(
    async (address) => {
      if (!currentUser) return false;

      try {
        const data = address.id
          ? await api.put(`/account/addresses/${address.id}`, address)
          : await api.post("/account/addresses", address);

        setCurrentUser((prev) =>
          prev ? { ...prev, addresses: data.addresses } : prev,
        );

        return true;
      } catch {
        return false;
      }
    },
    [currentUser],
  );

  const removeAddress = useCallback(
    async (addressId) => {
      if (!currentUser) return;

      try {
        const data = await api.del(`/account/addresses/${addressId}`);
        setCurrentUser((prev) =>
          prev ? { ...prev, addresses: data.addresses } : prev,
        );
      } catch {
        // ignore
      }
    },
    [currentUser],
  );

  const value = useMemo(
    () => ({
      currentUser,
      isAuthOpen,
      authReady,
      openAuth,
      closeAuth,
      register,
      login,
      logout,
      saveAddress,
      removeAddress,
    }),
    [
      currentUser,
      isAuthOpen,
      authReady,
      openAuth,
      closeAuth,
      register,
      login,
      logout,
      saveAddress,
      removeAddress,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}