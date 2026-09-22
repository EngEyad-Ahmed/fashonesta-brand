import { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowLeft, Tag } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Checkout from "./Checkout";

function Cart() {
  const {
    cartItems,
    cartTotal,
    subtotal,
    discount,
    shippingCost,
    coupon,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    applyCoupon,
    clearCoupon,
  } = useCart();

  const { showToast } = useToast();

  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const formatPrice = (price) => {
    return Number(String(price).replace(/,/g, "")).toLocaleString("en-US");
  };

  useEffect(() => {
    if (!showCheckout) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showCheckout]);

  const handleCheckout = () => {
    closeCart();
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast("اكتبي كود الخصم أولاً", "error");
      return;
    }

    const result = applyCoupon(couponCode);

    if (result.ok) {
      showToast(result.message);
      setCouponCode("");
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <>
      {/* ================================================= */}
      {/* CART OVERLAY */}
      {/* ================================================= */}

      <div
        className={`
          fixed
          inset-0
          z-[90]
          bg-black/60
          backdrop-blur-sm
          transition-all
          duration-300
          ${
            isCartOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={closeCart}
      />

      {/* ================================================= */}
      {/* CART DRAWER */}
      {/* ================================================= */}

      <aside
        dir="rtl"
        className={`
          fixed
          top-0
          right-0
          z-[100]
          h-full
          w-full
          sm:w-[430px]
          bg-[#111111]
          text-white
          shadow-2xl
          border-l
          border-white/10
          flex
          flex-col
          transition-transform
          duration-500
          ease-out
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <ShoppingCart size={21} className="text-[#D4AF37]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">سلة التسوق</h2>

              <p className="text-xs text-gray-500 mt-1">
                {cartItems.length === 0
                  ? "السلة فارغة"
                  : `${cartItems.length} منتج`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="إغلاق السلة"
            className="
              w-10
              h-10
              rounded-full
              bg-white/5
              flex
              items-center
              justify-center
              text-gray-300
              hover:bg-[#D4AF37]
              hover:text-black
              hover:rotate-90
              transition-all
              duration-300
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================= */}
        {/* CART CONTENT */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-[#D4AF37]/10
                  flex
                  items-center
                  justify-center
                  mb-6
                "
              >
                <ShoppingCart
                  size={38}
                  className="text-[#D4AF37]"
                  strokeWidth={1.4}
                />
              </div>

              <h3 className="text-xl font-bold mb-3">سلتك فارغة</h3>

              <p className="text-gray-500 text-sm leading-7 mb-7">
                لم تقومي بإضافة أي منتجات إلى السلة بعد.
                <br />
                اكتشفي تشكيلتنا واختاري ما يناسبك.
              </p>

              <button
                type="button"
                onClick={closeCart}
                className="
                  px-7
                  py-3
                  rounded-lg
                  bg-[#D4AF37]
                  text-black
                  font-bold
                  hover:bg-[#C9A227]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                ابدئي التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="
                    relative
                    bg-[#181818]
                    border
                    border-white/10
                    rounded-xl
                    p-3
                    flex
                    gap-4
                    hover:border-[#D4AF37]/30
                    transition-all
                    duration-300
                  "
                >
                  {/* IMAGE */}

                  <div className="w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-[#222]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[#D4AF37] text-[11px] mb-1">
                          {item.type} • {item.category}
                        </p>

                        <h3 className="font-bold text-sm">{item.name}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartId)}
                        className="
                          text-gray-500
                          hover:text-red-400
                          transition-colors
                        "
                        aria-label="حذف المنتج"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* COLOR & SIZE */}

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-1 rounded">
                        اللون: {item.selectedColor || "غير محدد"}
                      </span>

                      <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-1 rounded">
                        المقاس: {item.selectedSize || "غير محدد"}
                      </span>
                    </div>

                    {/* BOTTOM */}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[#D4AF37] font-bold text-sm">
                        {formatPrice(item.price)} جنيه
                      </span>

                      {/* QUANTITY */}

                      <div
                        className="
                          flex
                          items-center
                          border
                          border-white/10
                          rounded-lg
                          overflow-hidden
                        "
                      >
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.cartId)}
                          className="
                            w-7
                            h-7
                            flex
                            items-center
                            justify-center
                            text-gray-300
                            hover:bg-[#D4AF37]
                            hover:text-black
                            transition-colors
                          "
                        >
                          <Minus size={13} />
                        </button>

                        <span
                          className="
                            w-8
                            h-7
                            flex
                            items-center
                            justify-center
                            border-x
                            border-white/10
                            text-xs
                            font-bold
                          "
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.cartId)}
                          className="
                            w-7
                            h-7
                            flex
                            items-center
                            justify-center
                            text-gray-300
                            hover:bg-[#D4AF37]
                            hover:text-black
                            transition-colors
                          "
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* CART FOOTER */}
        {/* ================================================= */}

        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-5 bg-[#0d0d0d]">
            {/* CLEAR CART */}

            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-400">إجمالي المنتجات</span>

              <button
                type="button"
                onClick={clearCart}
                className="
                  text-xs
                  text-gray-500
                  hover:text-red-400
                  transition-colors
                "
              >
                تفريغ السلة
              </button>
            </div>

            {/* COUPON */}

            {!coupon ? (
              <div className="mb-5">
                <label className="block text-xs text-gray-400 mb-2">
                  كود الخصم
                </label>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                    />

                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="مثال: FASHION10"
                      className="
                        w-full
                        bg-black
                        border
                        border-white/10
                        rounded-lg
                        py-2.5
                        pr-10
                        pl-3
                        text-sm
                        outline-none
                        focus:border-[#D4AF37]
                        transition
                      "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="
                      shrink-0
                      px-4
                      py-2.5
                      rounded-lg
                      border
                      border-[#D4AF37]
                      text-[#D4AF37]
                      text-sm
                      font-semibold
                      hover:bg-[#D4AF37]
                      hover:text-black
                      transition-all
                      duration-300
                    "
                  >
                    تطبيق
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-5 flex items-center justify-between p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-[#D4AF37]" />

                  <span className="text-sm font-semibold text-[#D4AF37]">
                    {coupon.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearCoupon}
                  aria-label="إزالة الكود"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* SUMMARY */}

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">المجموع الفرعي</span>

                <span>{formatPrice(subtotal)} جنيه</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-[#D4AF37]">
                  <span>الخصم</span>

                  <span>-{formatPrice(discount)} جنيه</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-400">الشحن</span>

                <span>
                  {shippingCost === 0
                    ? "مجاني"
                    : `${formatPrice(shippingCost)} جنيه`}
                </span>
              </div>
            </div>

            {/* TOTAL */}

            <div className="flex items-center justify-between mb-5 pt-4 border-t border-white/10">
              <span className="text-lg font-bold">الإجمالي</span>

              <span className="text-2xl font-bold text-[#D4AF37]">
                {formatPrice(cartTotal + shippingCost)} جنيه
              </span>
            </div>

            {/* CHECKOUT BUTTON */}

            <button
              type="button"
              onClick={handleCheckout}
              className="
                w-full
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
              إتمام الطلب
              <ArrowLeft size={19} />
            </button>

            <p className="text-center text-[11px] text-gray-600 mt-3">
              الأسعار شاملة جميع التفاصيل الموضحة للمنتج
            </p>
          </div>
        )}
      </aside>

      {/* ================================================= */}
      {/* CHECKOUT */}
      {/* ================================================= */}

      {showCheckout && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black
            overflow-y-auto
          "
          dir="rtl"
        >
          <Checkout onBack={handleCloseCheckout} />
        </div>
      )}
    </>
  );
}

export default Cart;
