import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

const whatsappContacts = [
  {
    nameAr: "هاجر",
    nameEn: "Hager",
    number: "201229916690",
  },
  {
    nameAr: "صفاء",
    nameEn: "Safaa",
    number: "201279523254",
  },
  {
    nameAr: "مودة",
    nameEn: "Mwade",
    number: "201229916695",
  },
];

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

function Checkout({ onBack }) {
  const {
    cartItems,
    cartItemsSnapshot,
    subtotal,
    discount,
    shippingCost,
    cartTotal,
    clearCart,
  } = useCart();

  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  const [selectedContact, setSelectedContact] = useState(whatsappContacts[0]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placedOrder, setPlacedOrder] = useState(null);

  const [formData, setFormData] = useState(() => ({
    name: (currentUser && currentUser.name) || "",
    phone: (currentUser && currentUser.phone) || "",
    governorate: "",
    address: "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseSavedAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      governorate: address.governorate,
      address: address.address,
    }));

    showToast("تم تعبئة العنوان المحفوظ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.governorate.trim() ||
      !formData.address.trim()
    ) {
      showToast("من فضلك املئي جميع البيانات المطلوبة", "error");
      return;
    }

    if (!/^01[0-9]{9}$/.test(formData.phone)) {
      showToast("رقم الهاتف غير صحيح (مثال: 01000000000)", "error");
      return;
    }

    if (cartItems.length === 0) {
      showToast("السلة فارغة", "error");
      return;
    }

    const total = cartTotal + shippingCost;

    let order;

    try {
      order = await createOrder({
        items: cartItemsSnapshot,
        subtotal,
        discount,
        shippingCost,
        total,
        payment: paymentMethod,
        shipping: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          governorate: formData.governorate.trim(),
          address: formData.address.trim(),
        },
      });
    } catch (err) {
      showToast(err.message || "تعذر تسجيل الطلب، حاولي مرة أخرى", "error");
      return;
    }

    const productsMessage = cartItems
      .map((item, index) => {
        const price = Number(String(item.price).replace(/,/g, ""));

        return `
${index + 1}. ${item.name}
   اللون: ${item.selectedColor || "غير محدد"}
   المقاس: ${item.selectedSize || "غير محدد"}
   الكمية: ${item.quantity}
   السعر: ${price.toLocaleString("en-US")} جنيه
`;
      })
      .join("\n");

    const paymentLabel =
      paymentMethod === "cod"
        ? "الدفع عند الاستلام 💵"
        : "الدفع الكامل عبر واتساب 💳";

    const discountLine = discount > 0 ? `الخصم: -${discount.toLocaleString("en-US")} جنيه` : "";

    const message = `
✨ *طلب جديد من فاشونيستا* ✨
🧾 رقم الطلب: ${order.id}

👤 *بيانات العميل:*
الاسم: ${formData.name}
رقم الهاتف: ${formData.phone}
المحافظة: ${formData.governorate}
العنوان: ${formData.address}

🛍️ *تفاصيل الطلب:*
${productsMessage}

💰 *ملخص الأسعار:*
المجموع الفرعي: ${subtotal.toLocaleString("en-US")} جنيه
${discountLine ? `${discountLine}\n` : ""}الشحن: ${shippingCost === 0 ? "مجاني" : `${shippingCost.toLocaleString("en-US")} جنيه`}
الإجمالي: ${total.toLocaleString("en-US")} جنيه

💳 *طريقة الدفع:* ${paymentLabel}

📦 أريد تأكيد الطلب ومعرفة تفاصيل الشحن.

شكراً ❤️
فاشونيستا للموضة
`;

    const whatsappUrl = `https://wa.me/${selectedContact.number}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank");

    clearCart();
    setPlacedOrder(order);
    showToast("تم إرسال طلبك بنجاح");
  };

  if (placedOrder) {
    return (
      <section className="min-h-screen bg-black text-white py-24 px-6" dir="rtl">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-[#111] border border-[#D4AF37]/30 rounded-3xl p-10">
            <div
              className="
                w-20
                h-20
                mx-auto
                mb-6
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
              <CheckCircle2 size={40} />
            </div>

            <h1 className="text-3xl font-bold mb-3">تم استلام طلبك بنجاح</h1>

            <p className="text-gray-400 leading-8 mb-2">
              رقم الطلب:
              <span className="text-[#D4AF37] font-bold"> {placedOrder.id} </span>
            </p>

            <p className="text-gray-400 leading-8 mb-8">
              سيتواصل معك فريقنا عبر واتساب لتأكيد الطلب وتفاصيل الشحن.
            </p>

            <div className="text-right bg-black rounded-2xl border border-white/10 p-5 mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(placedOrder.subtotal)} جنيه</span>
              </div>

              {placedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-[#D4AF37] mb-2">
                  <span>الخصم</span>
                  <span>-{formatPrice(placedOrder.discount)} جنيه</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>الشحن</span>
                <span>
                  {placedOrder.shippingCost === 0
                    ? "مجاني"
                    : `${formatPrice(placedOrder.shippingCost)} جنيه`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/10">
                <span>الإجمالي</span>
                <span className="text-[#D4AF37]">
                  {formatPrice(placedOrder.total)} جنيه
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onBack}
                className="
                  flex-1
                  py-4
                  rounded-xl
                  bg-[#D4AF37]
                  text-black
                  font-bold
                  hover:bg-[#C9A227]
                  transition-all
                  duration-300
                "
              >
                العودة للمتجر
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-black text-white py-24 px-6" dir="rtl">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gray-400 mb-8">السلة فارغة حاليًا</p>

          <button
            type="button"
            onClick={onBack}
            className="
              px-8
              py-4
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-bold
              hover:bg-[#C9A227]
              transition-all
              duration-300
            "
          >
            العودة للمتجر
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <button
            type="button"
            onClick={onBack}
            className="
              flex items-center gap-2
              text-gray-400
              hover:text-[#D4AF37]
              transition
              mb-6
            "
          >
            <ArrowRight size={19} />
            العودة للسلة
          </button>

          <h1 className="text-4xl font-bold">
            إتمام <span className="text-[#D4AF37]">الطلب</span>
          </h1>

          <p className="text-gray-500 mt-3">Complete Your Order</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-7">
            <h2 className="text-2xl font-bold mb-7">بيانات التوصيل</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {currentUser && (
                <div className="p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center gap-3">
                  <Check size={18} className="text-[#D4AF37] shrink-0" />

                  <p className="text-sm text-gray-300">
                    تم تسجيل الدخول كـ{" "}
                    <span className="text-[#D4AF37] font-bold">
                      {currentUser.name}
                    </span>
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  الاسم بالكامل
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="اكتبي اسمك بالكامل"
                    className="
                      w-full
                      bg-black
                      border border-white/10
                      rounded-xl
                      py-4 pr-12 pl-4
                      outline-none
                      focus:border-[#D4AF37]
                      transition
                    "
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  رقم الهاتف
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    className="
                      w-full
                      bg-black
                      border border-white/10
                      rounded-xl
                      py-4 pr-12 pl-4
                      outline-none
                      focus:border-[#D4AF37]
                      transition
                    "
                  />
                </div>
              </div>

              {/* Saved Addresses */}
              {currentUser && (currentUser.addresses || []).length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-sm">العناوين المحفوظة</h3>

                  <div className="space-y-2">
                    {(currentUser.addresses || []).map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => handleUseSavedAddress(address)}
                        className="
                          w-full
                          text-right
                          bg-black
                          border
                          border-white/10
                          rounded-xl
                          p-4
                          hover:border-[#D4AF37]/50
                          transition-all
                          duration-300
                        "
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={15} className="text-[#D4AF37]" />

                          <span className="font-bold text-sm">
                            {address.label || "منزل"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400">
                          {address.governorate} — {address.address}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Governorate */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  المحافظة
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                  />

                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-black
                      border border-white/10
                      rounded-xl
                      py-4 pr-12 pl-4
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
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  العنوان بالتفصيل
                </label>

                <div className="relative">
                  <Home
                    size={19}
                    className="absolute right-4 top-5 text-[#D4AF37]"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="اكتبي العنوان بالتفصيل"
                    className="
                      w-full
                      bg-black
                      border border-white/10
                      rounded-xl
                      py-4 pr-12 pl-4
                      outline-none
                      resize-none
                      focus:border-[#D4AF37]
                      transition
                    "
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-bold mb-4">طريقة الدفع</h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`
                      rounded-xl
                      p-4
                      border
                      text-right
                      transition-all
                      duration-300
                      ${
                        paymentMethod === "cod"
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/10 bg-black hover:border-white/30"
                      }
                    `}
                  >
                    <Banknote
                      size={22}
                      className={`mb-2 ${
                        paymentMethod === "cod"
                          ? "text-[#D4AF37]"
                          : "text-gray-400"
                      }`}
                    />

                    <div className="font-bold text-sm">الدفع عند الاستلام</div>

                    <div className="text-xs text-gray-500 mt-1">
                      ادفعي عند وصول الطلب
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`
                      rounded-xl
                      p-4
                      border
                      text-right
                      transition-all
                      duration-300
                      ${
                        paymentMethod === "whatsapp"
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/10 bg-black hover:border-white/30"
                      }
                    `}
                  >
                    <MessageCircle
                      size={22}
                      className={`mb-2 ${
                        paymentMethod === "whatsapp"
                          ? "text-[#D4AF37]"
                          : "text-[#25D366]"
                      }`}
                    />

                    <div className="font-bold text-sm">الدفع كامل عبر واتساب</div>

                    <div className="text-xs text-gray-500 mt-1">
                      تحصلي على رقم التحويل
                    </div>
                  </button>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="pt-2">
                <h3 className="font-bold mb-4">إرسال الطلب إلى</h3>

                <div className="grid grid-cols-3 gap-3">
                  {whatsappContacts.map((contact) => {
                    const isSelected =
                      selectedContact.number === contact.number;

                    return (
                      <button
                        key={contact.number}
                        type="button"
                        onClick={() => setSelectedContact(contact)}
                        className={`
                          rounded-xl
                          p-4
                          border
                          transition-all
                          duration-300
                          ${
                            isSelected
                              ? "border-[#D4AF37] bg-[#D4AF37]/10"
                              : "border-white/10 bg-black hover:border-white/30"
                          }
                        `}
                      >
                        <MessageCircle
                          size={22}
                          className={`mx-auto mb-2 ${
                            isSelected ? "text-[#D4AF37]" : "text-[#25D366]"
                          }`}
                        />

                        <div className="font-bold text-sm">
                          {contact.nameAr}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {contact.nameEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  w-full
                  mt-4
                  py-4
                  rounded-xl
                  bg-[#D4AF37]
                  text-black
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-3
                  hover:bg-[#C9A227]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <MessageCircle size={20} />
                تأكيد الطلب وإرساله واتساب
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-7 h-fit">
            <h2 className="text-2xl font-bold mb-7">ملخص الطلب</h2>

            <div className="space-y-5">
              {cartItems.map((item) => {
                const price = Number(String(item.price).replace(/,/g, ""));

                return (
                  <div
                    key={item.cartId}
                    className="
                      flex
                      gap-4
                      border-b
                      border-white/10
                      pb-5
                    "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-20
                        h-24
                        object-cover
                        rounded-xl
                      "
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>

                      <p className="text-sm text-gray-500 mt-1">
                        اللون: {item.selectedColor}
                      </p>

                      <p className="text-sm text-gray-500">
                        المقاس: {item.selectedSize}
                      </p>

                      <p className="text-sm text-gray-500">
                        الكمية: {item.quantity}
                      </p>

                      <p className="text-[#D4AF37] font-bold mt-2">
                        {formatPrice(price * item.quantity)} جنيه
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="mt-7 pt-6 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">المجموع الفرعي</span>
                <span>{formatPrice(subtotal)} جنيه</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-sm text-[#D4AF37]">
                  <span>الخصم</span>
                  <span>-{formatPrice(discount)} جنيه</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">الشحن</span>
                <span>
                  {shippingCost === 0
                    ? "مجاني"
                    : `${formatPrice(shippingCost)} جنيه`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-bold">الإجمالي</span>

                <span className="text-2xl font-bold text-[#D4AF37]">
                  {formatPrice(cartTotal + shippingCost)} جنيه
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20">
              <p className="text-sm text-gray-400 leading-7">
                بعد الضغط على تأكيد الطلب، سيتم فتح واتساب وإرسال تفاصيل طلبك
                إلى{" "}
                <span className="text-[#D4AF37] font-bold">
                  {selectedContact.nameAr} | {selectedContact.nameEn}
                </span>{" "}
                مع حفظ طلبك في حسابك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;