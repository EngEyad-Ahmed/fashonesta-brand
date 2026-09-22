import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { getProductById, getRelatedProducts } from "../data/products";
import { calcDiscountPercent, formatPrice } from "../utils/format";
import ProductCard from "./ProductCard";
import Reviews from "./Reviews";

function NotFoundView() {
  return (
    <div dir="rtl" className="bg-[#080808] text-white min-h-screen pt-40 pb-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">المنتج غير موجود</h1>

        <p className="text-gray-400 leading-8 mb-8">
          لم نعثر على هذا المنتج، ربما تمت إزالته أو الرابط غير صحيح.
        </p>

        <Link
          to="/products"
          className="inline-block px-8 py-4 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#C9A227] transition-colors duration-300"
        >
          تصفحي كل المنتجات
        </Link>
      </div>
    </div>
  );
}

function ProductPageView({ product }) {
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const discountPercent = calcDiscountPercent(product.price, product.oldPrice);
  const gallery = product.gallery || [product.image];
  const reviewsCount = (product.reviews || []).length + product.reviewsCount;
  const relatedProducts = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
    openCart();
  };

  const handleToggleFavorite = () => {
    const isFavorite = isInWishlist(product.id);

    toggleWishlist(product);
    showToast(
      isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة",
      isFavorite ? "error" : "success",
    );
  };

  return (
    <div dir="rtl" className="bg-[#080808] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">
            الرئيسية
          </Link>

          <span>/</span>

          <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
            المنتجات
          </Link>

          <span>/</span>

          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#D4AF37] transition-colors"
          >
            {product.category}
          </Link>

          <span>/</span>

          <span className="text-gray-300">{product.name}</span>
        </nav>

        {/* Main */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#181818] border border-white/10">
              <img
                key={gallery[selectedImageIndex]}
                src={gallery[selectedImageIndex]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {discountPercent > 0 && (
                <div
                  className="
                    absolute
                    top-5
                    right-5
                    bg-[#D4AF37]
                    text-black
                    text-xs
                    font-bold
                    px-4
                    py-2
                    rounded-full
                  "
                >
                  خصم {discountPercent}%
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`
                      aspect-[3/4]
                      rounded-xl
                      overflow-hidden
                      border-2
                      transition-all
                      duration-300
                      ${
                        selectedImageIndex === i
                          ? "border-[#D4AF37] opacity-100"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }
                    `}
                    aria-label={`صورة ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[#D4AF37] text-sm font-medium mb-3">
              {product.type} • {product.category}
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="flex gap-1 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(product.rating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-white">
                {product.rating.toFixed(1)}
              </span>

              <span className="text-gray-500 text-sm">
                ({reviewsCount} تقييم)
              </span>
            </div>

            <div className="mb-5">
              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  border
                  rounded-full
                  px-3
                  py-1.5
                  ${
                    product.stock <= 5
                      ? "text-red-400 border-red-400/30"
                      : "text-green-400 border-green-400/30"
                  }
                `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    product.stock <= 5 ? "bg-red-400" : "bg-green-400"
                  }`}
                />
                {product.stock <= 5
                  ? `متبقي ${product.stock} قطع فقط`
                  : "متوفر في المخزون"}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-7">
              <span className="text-[#D4AF37] text-2xl font-bold">
                {formatPrice(product.price)} جنيه
              </span>

              <span className="text-gray-500 line-through">
                {formatPrice(product.oldPrice)} جنيه
              </span>

              {discountPercent > 0 && (
                <span className="text-sm text-green-400">
                  وفري {discountPercent}%
                </span>
              )}
            </div>

            <div className="h-px bg-white/10 mb-7" />

            {/* Description */}
            <div className="mb-7">
              <h2 className="font-bold text-lg mb-3">نبذة عن المنتج</h2>

              <p className="text-gray-400 leading-8">
                {product.descriptionLong || product.description}
              </p>
            </div>

            {/* Colors */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">اللون</h3>

                <span className="text-[#D4AF37] text-sm">{selectedColor}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const swatch = product.swatches
                    ? product.swatches[color]
                    : null;

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`
                        relative
                        px-5
                        py-2.5
                        rounded-lg
                        border
                        text-sm
                        transition-all
                        duration-300
                        flex
                        items-center
                        gap-2
                        ${
                          selectedColor === color
                            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-white/15 text-gray-300 hover:border-[#D4AF37]/50"
                        }
                      `}
                    >
                      {swatch && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/25"
                          style={{ backgroundColor: swatch }}
                        />
                      )}

                      {selectedColor === color && <Check size={14} />}

                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">المقاس</h3>

                <span className="text-[#D4AF37] text-sm">{selectedSize}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`
                      min-w-[55px]
                      px-4
                      py-2.5
                      rounded-lg
                      border
                      text-sm
                      transition-all
                      duration-300
                      ${
                        selectedSize === size
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black font-bold"
                          : "border-white/15 text-gray-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-bold mb-3">الكمية</h3>

              <div
                className="
                  inline-flex
                  items-center
                  border
                  border-white/15
                  rounded-lg
                  overflow-hidden
                "
              >
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="
                    w-11
                    h-11
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition-colors
                  "
                >
                  <Plus size={16} />
                </button>

                <span
                  className="
                    w-14
                    h-11
                    flex
                    items-center
                    justify-center
                    border-x
                    border-white/15
                    font-bold
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="
                    w-11
                    h-11
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition-colors
                  "
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="
                  flex-1
                  py-4
                  rounded-lg
                  bg-[#D4AF37]
                  text-black
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-[#C9A227]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <ShoppingCart size={19} />
                أضيفي إلى السلة
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`
                  sm:w-14
                  py-4
                  rounded-lg
                  border
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  ${
                    isInWishlist(product.id)
                      ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                      : "border-white/15 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }
                `}
                aria-label={
                  isInWishlist(product.id)
                    ? "إزالة من المفضلة"
                    : "إضافة للمفضلة"
                }
              >
                <Heart
                  size={20}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 mt-8 p-5 bg-[#111111] border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-[#D4AF37] shrink-0" />

                <p className="text-xs text-gray-400 leading-5">
                  شحن مجاني للطلبات فوق 1500 جنيه
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#D4AF37] shrink-0" />

                <p className="text-xs text-gray-400 leading-5">
                  استبدال وإرجاع خلال 14 يوم
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mb-16">
          <div className="flex gap-2 border-b border-white/10 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`
                pb-4 px-4 text-sm font-bold border-b-2 transition-colors
                ${
                  activeTab === "description"
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-400 hover:text-white"
                }
              `}
            >
              التفاصيل
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`
                pb-4 px-4 text-sm font-bold border-b-2 transition-colors
                ${
                  activeTab === "reviews"
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-400 hover:text-white"
                }
              `}
            >
              التقييمات ({reviewsCount})
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <p className="text-gray-400 leading-9">
                {product.descriptionLong || product.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#D4AF37]" />
                  المقاسات المتاحة: {product.sizes.join("، ")}
                </li>

                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#D4AF37]" />
                  الألوان المتاحة: {product.colors.join("، ")}
                </li>

                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#D4AF37]" />
                  القسم: {product.category} — نوع {product.type}
                </li>
              </ul>
            </div>
          ) : (
            <div className="max-w-3xl">
              <Reviews product={product} />
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[#D4AF37] text-sm font-medium mb-2">
                  تكملة الإطلالة
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold">
                  منتجات قد تنال إعجابك
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();

  const productId = Number(id);
  const product = getProductById(productId);

  if (!product) {
    return <NotFoundView />;
  }

  return <ProductPageView key={product.id} product={product} />;
}

export default ProductPage;