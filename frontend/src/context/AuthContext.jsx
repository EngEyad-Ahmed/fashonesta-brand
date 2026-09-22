import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { uid } from "../utils/format";
import { demoUser } from "../data/demo";

const AuthContext = createContext(null);

const USERS_KEY = "fashionistaUsersV1";
const SESSION_KEY = "fashionistaSessionV1";
const GUEST_KEY = "fashionistaGuestIdV1";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadUsers() {
  const saved = load(USERS_KEY, []);

  if (!saved.some((u) => u.id === demoUser.id)) {
    return [...saved, demoUser];
  }

  return saved;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [currentUser, setCurrentUser] = useState(() => load(SESSION_KEY, null));
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const register = useCallback(
    ({ name, phone, password }) => {
      const trimmedName = String(name || "").trim();
      const trimmedPhone = String(phone || "").trim();
      const trimmedPassword = String(password || "");

      if (trimmedName.length < 2) {
        return { ok: false, error: "من فضلك اكتبي اسمك بالكامل" };
      }

      if (!/^01[0-9]{9}$/.test(trimmedPhone)) {
        return { ok: false, error: "رقم الهاتف غير صحيح (مثال: 01000000000)" };
      }

      if (trimmedPassword.length < 6) {
        return { ok: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
      }

      if (users.some((u) => u.phone === trimmedPhone)) {
        return { ok: false, error: "هذا الرقم مسجل بالفعل، سجلي الدخول" };
      }

      const newUser = {
        id: uid(),
        name: trimmedName,
        phone: trimmedPhone,
        password: trimmedPassword,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);

      return { ok: true, error: null };
    },
    [users],
  );

  const login = useCallback(
    ({ phone, password }) => {
      const trimmedPhone = String(phone || "").trim();
      const trimmedPassword = String(password || "");

      const user = users.find((u) => u.phone === trimmedPhone);

      if (!user) {
        return { ok: false, error: "لا يوجد حساب بهذا الرقم" };
      }

      if (user.password !== trimmedPassword) {
        return { ok: false, error: "كلمة المرور غير صحيحة" };
      }

      setCurrentUser(user);

      return { ok: true, error: null };
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const saveAddress = useCallback(
    (address) => {
      if (!currentUser) return false;

      const addressToSave = address.id
        ? address
        : { ...address, id: uid(), label: address.label || "منزل" };

      const updatedUser = {
        ...currentUser,
        addresses: address.id
          ? currentUser.addresses.map((a) =>
              a.id === address.id ? addressToSave : a,
            )
          : [...currentUser.addresses, addressToSave],
      };

      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );

      return true;
    },
    [currentUser],
  );

  const removeAddress = useCallback(
    (addressId) => {
      if (!currentUser) return;

      const updatedUser = {
        ...currentUser,
        addresses: currentUser.addresses.filter((a) => a.id !== addressId),
      };

      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );
    },
    [currentUser],
  );

  const getGuestId = useCallback(() => {
    try {
      let guestId = localStorage.getItem(GUEST_KEY);

      if (!guestId) {
        guestId = `guest-${uid()}`;
        localStorage.setItem(GUEST_KEY, guestId);
      }

      return guestId;
    } catch {
      return `guest-${uid()}`;
    }
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthOpen,
      openAuth,
      closeAuth,
      register,
      login,
      logout,
      saveAddress,
      removeAddress,
      getGuestId,
    }),
    [
      users,
      currentUser,
      isAuthOpen,
      openAuth,
      closeAuth,
      register,
      login,
      logout,
      saveAddress,
      removeAddress,
      getGuestId,
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