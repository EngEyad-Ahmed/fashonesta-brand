import { useEffect, useState } from "react";
import {
  Check,
  Lock,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { orderStatusLabels } from "../data/orders";
import { useToast } from "../context/ToastContext";
import { formatDate, formatPrice } from "../utils/format";

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "البحيرة",
  "المنوفية",
  "الغربية",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "القليوبية",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "مطروح",
  "أخرى",
];

function Account() {
  const {
    currentUser,
    isAuthOpen,
    closeAuth,
    register,
    login,
    logout,
    saveAddress,
    removeAddress,
  } = useAuth();

  const { getOrdersFor } = useOrders();
  const { showToast } = useToast();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    governorate: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAuthOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login({
      phone: form.phone,
      password: form.password,
    });

    if (result.ok) {
      showToast("تم تسجيل الدخول بنجاح");
      closeAuth();
    } else {
      showToast(result.error, "error");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }

    const result = register({
      name: form.name,
      phone: form.phone,
      password: form.password,
    });

    if (result.ok) {
      showToast(`تم إنشاء حسابك، أهلاً بك ${form.name.trim()}`);
      closeAuth();
    } else {
      showToast(result.error, "error");
    }
  };

  const handleLogout = () => {
    logout();
    setMode("login");
    setForm({ name: "", phone: "", password: "", confirm: "" });
    showToast("تم تسجيل الخروج");
    closeAuth();
  };

  const openAddressForm = (address) => {
    setEditingAddress(address || null);

    setAddressForm(
      address
        ? {
            label: address.label || "",
            governorate: address.governorate,
            address: address.address,
          }
        : { label: "", governorate: "", address: "" },
    );

    setShowAddressForm(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (!addressForm.governorate.trim() || !addressForm.address.trim()) {
      showToast("من فضلك أكمل بيانات العنوان", "error");
      return;
    }

    saveAddress({
      ...(editingAddress || {}),
      ...addressForm,
    });

    showToast(
      editingAddress ? "تم تحديث العنوان" : "تمت إضافة العنوان",
    );

    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({ label: "", governorate: "", address: "" });
  };

  const myOrders = currentUser ? getOrdersFor(currentUser.id) : [];

  if (!isAuthOpen) return null;

  return (
    <div
      dir="rtl"
      className="
        fixed
        inset-0
        z-[210]
        bg-black/80
        backdrop-blur-md
        flex
        items-start
        justify-center
        p-4
        sm:p-6
        overflow-y-auto
        animate-modalBackground
      "
      onClick={closeAuth}
    >
      <div
        className="
          w-full
          max-w-lg
          bg-[#111111]
          border
          border-white/10
          rounded-2xl
          overflow-hidden
          shadow-2xl
          my-8
          animate-productModal
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-[#D4AF37]/10
                border
                border-[#D4AF37]/40
                flex
                items-center
                justify-center
                text-[#D4AF37]
              "
            >
              <User size={19} />
            </div>

            <div>
              <h2 className="font-bold">
                {currentUser ? `مرحباً ${currentUser.name}` : "حسابي"}
              </h2>

              <p className="text-xs text-gray-500">
                {currentUser ? "منطقة العميل" : "سجلي الدخول أو أنشئي حساباً"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuth}
            aria-label="إغلاق"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              text-white/60
              hover:bg-[#D4AF37]
              hover:text-black
              transition-all
              duration-300
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!currentUser ? (
            /* ---------- Auth Forms ---------- */

            <>
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`
                    py-2.5
                    rounded-lg
                    text-sm
                    font-bold
                    transition-all
                    duration-300
                    ${
                      mode === "login"
                        ? "bg-[#D4AF37] text-black"
                        : "text-gray-400 hover:text-white"
                    }
                  `}
                >
                  تسجيل الدخول
                </button>

                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`
                    py-2.5
                    rounded-lg
                    text-sm
                    font-bold
                    transition-all
                    duration-300
                    ${
                      mode === "register"
                        ? "bg-[#D4AF37] text-black"
                        : "text-gray-400 hover:text-white"
                    }
                  `}
                >
                  حساب جديد
                </button>
              </div>

              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      رقم الهاتف
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="01xxxxxxxxx"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      كلمة المرور
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="
                      w-full
                      py-3.5
                      rounded-xl
                      bg-[#D4AF37]
                      text-black
                      font-bold
                      hover:bg-[#C9A227]
                      transition-all
                      duration-300
                    "
                  >
                    تسجيل الدخول
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    أو اطلبي كضيفة دون إنشاء حساب
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      الاسم بالكامل
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="اكتبي اسمك بالكامل"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      رقم الهاتف
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="01xxxxxxxxx"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      كلمة المرور
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="6 أحرف على الأقل"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      تأكيد كلمة المرور
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />

                      <input
                        type="password"
                        name="confirm"
                        value={form.confirm}
                        onChange={handleChange}
                        placeholder="أعيدي كتابة كلمة المرور"
                        className="
                          w-full
                          bg-black
                          border border-white/10
                          rounded-xl
                          py-3.5 pr-11 pl-4
                          outline-none
                          focus:border-[#D4AF37]
                          transition
                        "
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="
                      w-full
                      py-3.5
                      rounded-xl
                      bg-[#D4AF37]
                      text-black
                      font-bold
                      hover:bg-[#C9A227]
                      transition-all
                      duration-300
                    "
                  >
                    إنشاء الحساب
                  </button>
                </form>
              )}
            </>
          ) : (
            /* ---------- Profile ---------- */

            <div className="space-y-8">
              {/* Profile Info */}
              <div className="bg-black border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4">بيانات الحساب</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} className="text-[#D4AF37]" />
                    {currentUser.name}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone size={16} className="text-[#D4AF37]" />
                    {currentUser.phone}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-5
                    w-full
                    py-3
                    rounded-xl
                    border
                    border-red-400/30
                    text-red-400
                    text-sm
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-red-400
                    hover:text-black
                    transition-all
                    duration-300
                  "
                >
                  <LogOut size={17} />
                  تسجيل الخروج
                </button>
              </div>

              {/* Addresses */}
              <div className="bg-black border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">عناويني</h3>

                  <button
                    type="button"
                    onClick={() => openAddressForm(null)}
                    className="
                      text-xs
                      font-bold
                      text-[#D4AF37]
                      flex
                      items-center
                      gap-1
                      hover:text-[#C9A227]
                      transition-colors
                    "
                  >
                    <Plus size={15} />
                    عنوان جديد
                  </button>
                </div>

                {!showAddressForm && currentUser.addresses.length === 0 && (
                  <p className="text-xs text-gray-500">
                    لا توجد عناوين محفوظة بعد، أضيفي عنواناً لتسريع عملية الشراء.
                  </p>
                )}

                {/* Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="space-y-3 mb-5">
                    <input
                      type="text"
                      value={addressForm.label}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      placeholder="تسمية العنوان (منزل / عمل / غيره)"
                      className="
                        w-full
                        bg-[#151515]
                        border border-white/10
                        rounded-xl
                        py-3 px-4
                        text-sm
                        outline-none
                        focus:border-[#D4AF37]
                        transition
                      "
                    />

                    <select
                      value={addressForm.governorate}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          governorate: e.target.value,
                        }))
                      }
                      className="
                        w-full
                        bg-[#151515]
                        border border-white/10
                        rounded-xl
                        py-3 px-4
                        text-sm
                        outline-none
                        appearance-none
                        cursor-pointer
                        focus:border-[#D4AF37]
                        transition
                        [&>option]:bg-[#151515]
                      "
                    >
                      <option value="">اختاري المحافظة</option>

                      {governorates.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>

                    <textarea
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      rows="2"
                      placeholder="العنوان بالتفصيل"
                      className="
                        w-full
                        bg-[#151515]
                        border border-white/10
                        rounded-xl
                        py-3 px-4
                        text-sm
                        outline-none
                        resize-none
                        focus:border-[#D4AF37]
                        transition
                      "
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="
                          flex-1
                          py-3
                          rounded-xl
                          bg-[#D4AF37]
                          text-black
                          text-sm
                          font-bold
                          hover:bg-[#C9A227]
                          transition-colors
                          duration-300
                        "
                      >
                        حفظ العنوان
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="
                          px-5
                          py-3
                          rounded-xl
                          border
                          border-white/15
                          text-sm
                          text-gray-400
                          hover:text-white
                          transition-colors
                        "
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                <div className="space-y-2">
                  {currentUser.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                        bg-[#151515]
                        border
                        border-white/10
                        rounded-xl
                        p-4
                      "
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={15} className="text-[#D4AF37]" />

                          <span className="font-bold text-sm">
                            {address.label || "منزل"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 leading-6">
                          {address.governorate} — {address.address}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openAddressForm(address)}
                          aria-label="تعديل العنوان"
                          className="
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-gray-400
                            hover:text-[#D4AF37]
                            transition-colors
                          "
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeAddress(address.id)}
                          aria-label="حذف العنوان"
                          className="
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-gray-500
                            hover:text-red-400
                            transition-colors
                          "
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders */}
              <div className="bg-black border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={17} className="text-[#D4AF37]" />

                  <h3 className="font-bold text-sm">طلباتي</h3>
                </div>

                {myOrders.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    لا توجد طلبات بعد، تسوقي الآن وستظهر طلباتك هنا.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#151515] border border-white/10 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-[#D4AF37]">
                            {order.id}
                          </span>

                          <span className="text-[11px] text-gray-500">
                            {formatDate(order.date)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-2 truncate">
                          {order.items.map((item) => item.name).join("، ")}
                        </p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`
                              text-[11px]
                              font-bold
                              px-3
                              py-1
                              rounded-full
                              ${
                                order.status === "pending"
                                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                                  : order.status === "confirmed"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                  : order.status === "shipped"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                  : "bg-green-500/10 text-green-400 border border-green-500/30"
                              }
                            `}
                          >
                            {orderStatusLabels[order.status] ||
                              order.status}
                          </span>

                          <span className="font-bold text-sm">
                            {formatPrice(order.total)} جنيه
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-5 border-t border-white/10">
          <p className="text-center text-xs text-gray-600 flex items-center justify-center">
            <Check size={14} className="text-[#D4AF37] ml-1" />
            بياناتك محفوظة بأمان على جهازك
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;