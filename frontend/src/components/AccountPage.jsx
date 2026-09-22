import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { orderStatusLabels } from "../data/orders";
import { useToast } from "../context/ToastContext";
import { formatDate, formatPrice } from "../utils/format";
import { demoUser, DEMO_PHONE, DEMO_PASSWORD } from "../data/demo";
import AuthForms from "./AuthForms";

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

function AccountProfile() {
  const { currentUser, logout, saveAddress, removeAddress } = useAuth();
  const { getOrdersFor } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    governorate: "",
    address: "",
  });

  const myOrders = currentUser ? getOrdersFor(currentUser.id) : [];

  const isDemoAccount =
    currentUser && currentUser.id === demoUser.id;

  const handleLogout = () => {
    logout();
    showToast("تم تسجيل الخروج");
    navigate("/");
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

    showToast(editingAddress ? "تم تحديث العنوان" : "تمت إضافة العنوان");

    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({ label: "", governorate: "", address: "" });
  };

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-28 h-fit space-y-4">
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 text-center">
          <div
            className="
              w-20
              h-20
              mx-auto
              mb-4
              rounded-full
              bg-[#D4AF37]/10
              border
              border-[#D4AF37]/40
              flex
              items-center
              justify-center
              text-[#D4AF37]
              text-2xl
              font-bold
            "
          >
            {currentUser.name.charAt(0)}
          </div>

          <h2 className="font-bold text-lg mb-1">{currentUser.name}</h2>

          <p className="text-sm text-gray-400 dir-ltr">{currentUser.phone}</p>

          {isDemoAccount && (
            <span className="inline-block mt-3 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-3 py-1">
              حساب تجريبي
            </span>
          )}

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

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Package size={16} className="text-[#D4AF37]" />
              أرقامك السريعة
            </h3>
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>طلبات</span>
              <span className="font-bold text-white">{myOrders.length}</span>
            </div>

            <div className="flex justify-between">
              <span>عناوين</span>
              <span className="font-bold text-white">
                {currentUser.addresses.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                document.getElementById("orders")?.scrollIntoView({ behavior: "smooth" })
              }
              className="block pt-3 text-[#D4AF37] text-xs font-bold hover:text-[#C9A227] transition-colors"
            >
              عرض كل الطلبات ←
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-l from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">
            مرحباً {currentUser.name}
          </h1>

          <p className="text-gray-400 leading-7">
            هنا تظهر بياناتك وعناوينك وطلباتك. كل شيء محفوظ على جهازك.
          </p>
        </div>

        {/* Addresses */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold flex items-center gap-2">
              <MapPin size={18} className="text-[#D4AF37]" />
              عناويني
            </h3>

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
            <p className="text-sm text-gray-500">
              لا توجد عناوين محفوظة بعد، أضيفي عنواناً لتسريع عملية الشراء.
            </p>
          )}

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
                  bg-black
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
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3 px-4
                  text-sm
                  outline-none
                  appearance-none
                  cursor-pointer
                  focus:border-[#D4AF37]
                  transition
                  [&>option]:bg-[#111]
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
                  bg-black
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

          <div className="space-y-3">
            {currentUser.addresses.map((address) => (
              <div
                key={address.id}
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                  bg-black
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

                  <p className="text-sm text-gray-400 leading-6">
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
        <div id="orders" className="bg-[#111111] border border-white/10 rounded-2xl p-6 scroll-mt-28">
          <div className="flex items-center gap-2 mb-5">
            <Package size={18} className="text-[#D4AF37]" />

            <h3 className="font-bold">طلباتي ({myOrders.length})</h3>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 mb-5">
                لا توجد طلبات بعد، تسوقي الآن وستظهر طلباتك هنا.
              </p>

              <Link
                to="/products"
                className="inline-block px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-bold text-sm hover:bg-[#C9A227] transition-colors duration-300"
              >
                تسوقي الآن
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-black border border-white/10 rounded-2xl overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-[#D4AF37]">
                        {order.id}
                      </span>

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
                        {orderStatusLabels[order.status] || order.status}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {formatDate(order.date)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover rounded-lg border border-white/10"
                        />

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            className="text-sm font-semibold hover:text-[#D4AF37] transition-colors block truncate"
                          >
                            {item.name}
                          </Link>

                          <p className="text-xs text-gray-500 mt-1">
                            {item.quantity} × {formatPrice(item.price)} جنيه
                            {item.selectedColor
                              ? ` • ${item.selectedColor}`
                              : ""}
                            {item.selectedSize ? ` • ${item.selectedSize}` : ""}
                          </p>
                        </div>

                        <span className="text-sm font-bold shrink-0">
                          {formatPrice(item.price * item.quantity)} جنيه
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#D4AF37]" />
                        {order.shipping.governorate} — {order.shipping.address}
                      </p>

                      <p>
                        الدفع: {order.payment === "cod" ? "عند الاستلام" : "عبر واتساب"}
                      </p>

                      {order.discount > 0 && (
                        <p className="text-[#D4AF37]">
                          خصم: -{formatPrice(order.discount)} جنيه
                        </p>
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-gray-500">الإجمالي</p>

                      <p className="text-xl font-bold text-[#D4AF37]">
                        {formatPrice(order.total)} جنيه
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountPage() {
  const { currentUser } = useAuth();

  return (
    <div dir="rtl" className="bg-[#080808] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {!currentUser ? (
          <div className="max-w-lg mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                الرئيسية
              </Link>

              <span>/</span>

              <span className="text-gray-300">حسابي</span>
            </nav>

            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden mb-6">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">تسجيل الدخول أو إنشاء حساب</h1>

                <p className="text-sm text-gray-500 leading-7 mb-3">
                  للحصول على تجربة كاملة، جرّبي الحساب التجريبي الذي يحتوي على
                  عناوين وطلبات جاهزة.
                </p>

                <div className="p-4 rounded-xl bg-black border border-white/10 text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <span className="text-[#D4AF37] font-bold">بيانات تجريبية:</span>
                  <span dir="ltr">{DEMO_PHONE} / {DEMO_PASSWORD}</span>
                  <User size={14} className="text-[#D4AF37] mr-auto" />
                </div>
              </div>
            </div>

            <AuthForms
              onSuccess={() => {
                /* stays on account page */
              }}
            />

            <p className="mt-6 text-center text-xs text-gray-600">
              <Link
                to="/products"
                className="text-[#D4AF37] hover:text-[#C9A227] transition-colors"
              >
                يمكنك أيضاً إتمام الطلب كضيفة من سلة التسوق
              </Link>
            </p>
          </div>
        ) : (
          <>
            {/* Logged-in Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                الرئيسية
              </Link>

              <span>/</span>

              <span className="text-gray-300">حسابي</span>

              <span>/</span>

              <span className="text-gray-300">{currentUser.name}</span>
            </nav>

            <AccountProfile />
          </>
        )}
      </div>
    </div>
  );
}

export default AccountPage;