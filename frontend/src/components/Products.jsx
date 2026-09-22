import { useEffect, useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingCart, Star, X } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSearch } from "../context/SearchContext";
import { useToast } from "../context/ToastContext";
import {
  products,
  categories,
  productTypes,
  getRelatedProducts,
} from "../data/products";
import { calcDiscountPercent, formatPrice, parsePrice } from "../utils/format";
import Reviews from "./Reviews";

function Products() {
  const { addToCart, openCart } = useCart();

  const { isInWishlist, toggleWishlist } = useWishlist();

  const { searchQuery } = useSearch();

  const { showToast } = useToast();

  const [visibleCount, setVisibleCount] = useState(8);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeType, setActiveType] = useState("الكل");
  const [sortOrder, setSortOrder] = useState("default");
  const [isVisible, setIsVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProduct]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const searchFilteredProducts = products.filter((product) => {
    if (!normalizedSearchQuery) return true;

    const searchableText = [
      product.name,
      product.category,
      product.type,
      ...(product.colors || []),
      ...(product.sizes || []),
      product.description,
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchQuery);
  });

  const categoryFilteredProducts =
    activeCategory === "الكل"
      ? searchFilteredProducts
      : searchFilteredProducts.filter(
          (product) => product.category === activeCategory,
        );

  const typeFilteredProducts =
    activeType === "الكل"
      ? categoryFilteredProducts
      : categoryFilteredProducts.filter((product) => product.type === activeType);

  const sortedProducts = [...typeFilteredProducts];

  if (sortOrder === "price-asc") {
    sortedProducts.sort(
      (a, b) => parsePrice(a.price) - parsePrice(b.price),
    );
  } else if (sortOrder === "price-desc") {
    sortedProducts.sort(
      (a, b) => parsePrice(b.price) - parsePrice(a.price),
    );
  } else if (sortOrder === "discount") {
    sortedProducts.sort(
      (a, b) =>
        calcDiscountPercent(b.price, b.oldPrice) -
        calcDiscountPercent(a.price, a.oldPrice),
    );
  }

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const hasActiveFilters =
    Boolean(normalizedSearchQuery) ||
    activeCategory !== "الكل" ||
    activeType !== "الكل";

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(8);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setVisibleCount(8);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleShowLess = () => {
    setVisibleCount(8);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addToCart(selectedProduct, selectedColor, selectedSize, quantity);
    closeProductDetails();
    openCart();
    showToast("تمت إضافة المنتج إلى السلة");
  };

  const handleToggleFavorite = (product, isFavorite) => {
    toggleWishlist(product);
    showToast(
      isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة",
      isFavorite ? "error" : "success",
    );
  };

  const gallery = selectedProduct
    ? selectedProduct.gallery || [selectedProduct.image]
    : [];

  const relatedProducts = selectedProduct
    ? getRelatedProducts(selectedProduct, 4)
    : [];

  return (
    <>
      <section
        id="products"
        dir="rtl"
        className="bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div
            className={`
              text-center
              mb-12
              transition-all
              duration-1000
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            <p className="text-[#D4AF37] text-sm font-medium mb-4">
              تشكيلة فاشونيستا
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
              اكتشفي منتجاتنا
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto leading-8">
              اختاري من تشكيلتنا المتنوعة من الملابس الحريمي وملابس البنات،
              واكتشفي القطعة التي تناسب ذوقك.
            </p>
          </div>

          {/* Categories */}

          <div
            className={`
              flex
              flex-wrap
              justify-center
              gap-3
              mb-8
              transition-all
              duration-1000
              delay-200
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }
            `}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`
                  px-6
                  py-3
                  rounded-full
                  border
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  ${
                    activeCategory === category
                      ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10"
                      : "border-white/15 text-gray-300 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Type + Sort Controls */}

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {productTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`
                    px-5
                    py-2.5
                    rounded-full
                    border
                    text-xs
                    font-medium
                    transition-all
                    duration-300
                    ${
                      activeType === type
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/15 text-gray-400 hover:border-white/40 hover:text-white"
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="md:mr-auto">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="
                  bg-[#111111]
                  border
                  border-white/15
                  text-sm
                  text-gray-300
                  rounded-lg
                  py-2.5
                  px-4
                  outline-none
                  cursor-pointer
                  focus:border-[#D4AF37]
                  transition
                  [&>option]:bg-[#111111]
                "
              >
                <option value="default">ترتيب: الافتراضي</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="discount">الأعلى خصماً</option>
              </select>
            </div>
          </div>

          {/* Results Count */}

          {hasActiveFilters && (
            <p className="text-center text-sm text-gray-500 mb-6">
              عرض {visibleProducts.length} منتج
              {normalizedSearchQuery ? ` لبحث "${searchQuery.trim()}"` : ""}
            </p>
          )}

          {/* Products Grid */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {visibleProducts.map((product, index) => {
              const isFavorite = isInWishlist(product.id);
              const discountPercent = calcDiscountPercent(
                product.price,
                product.oldPrice,
              );

              return (
                <div
                  key={product.id}
                  className="
                    group
                    relative
                    bg-[#111111]
                    rounded-2xl
                    overflow-hidden
                    border
                    border-white/10
                    hover:border-[#D4AF37]/40
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:shadow-black/40
                    transition-all
                    duration-500
                  "
                  style={{
                    animation: `productReveal 700ms ease-out ${
                      index * 100
                    }ms both`,
                  }}
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-[#181818] cursor-pointer"
                    onClick={() => openProductDetails(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/0
                        group-hover:bg-black/20
                        transition-all
                        duration-500
                      "
                    />

                    {discountPercent > 0 && (
                      <div
                        className="
                          absolute
                          top-4
                          right-4
                          bg-[#D4AF37]
                          text-black
                          text-xs
                          font-bold
                          px-3
                          py-2
                          rounded-full
                        "
                      >
                        خصم {discountPercent}%
                      </div>
                    )}

                    <button
                      type="button"
                      aria-label={
                        isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product, isFavorite);
                      }}
                      className={`
                        absolute
                        top-4
                        left-4
                        w-10
                        h-10
                        rounded-full
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-400
                        ${
                          isFavorite
                            ? "bg-[#D4AF37] text-black opacity-100 translate-y-0"
                            : "bg-black/50 text-white opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#D4AF37] hover:text-black"
                        }
                      `}
                    >
                      <Heart
                        size={18}
                        strokeWidth={1.8}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetails(product);
                      }}
                      className="
                        absolute
                        bottom-4
                        right-4
                        left-4
                        py-3
                        rounded-lg
                        bg-[#D4AF37]
                        text-black
                        font-bold
                        flex
                        items-center
                        justify-center
                        gap-2
                        opacity-0
                        translate-y-5
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        hover:bg-[#C9A227]
                        transition-all
                        duration-500
                      "
                    >
                      <ShoppingCart size={18} />
                      أضيفي إلى السلة
                    </button>
                  </div>

                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => openProductDetails(product)}
                  >
                    <p className="text-[#D4AF37] text-xs mb-2">
                      {product.type} • {product.category}
                    </p>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          fill={
                            star <= Math.round(product.rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}

                      <span className="text-gray-500 text-xs mr-2">
                        ({product.reviewsCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[#D4AF37] text-lg font-bold">
                        {formatPrice(product.price)} جنيه
                      </span>

                      <span className="text-gray-500 text-sm line-through">
                        {formatPrice(product.oldPrice)} جنيه
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}

          {visibleProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              لا توجد منتجات مطابقة لبحثك حاليًا.
            </div>
          )}

          {/* Load More */}

          {sortedProducts.length > 8 && (
            <div className="flex justify-center mt-14">
              {visibleCount < sortedProducts.length ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="
                    group
                    min-w-[200px]
                    px-8
                    py-4
                    border
                    border-[#D4AF37]
                    text-[#D4AF37]
                    rounded-lg
                    font-bold
                    hover:bg-[#D4AF37]
                    hover:text-black
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <span className="inline-flex items-center gap-3">
                    عرض المزيد
                    <span className="text-xl transition-transform duration-300 group-hover:translate-y-1">
                      ↓
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="
                    group
                    min-w-[200px]
                    px-8
                    py-4
                    border
                    border-white/20
                    text-white
                    rounded-lg
                    font-bold
                    hover:border-[#D4AF37]
                    hover:text-[#D4AF37]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <span className="inline-flex items-center gap-3">
                    عرض أقل
                    <span className="text-xl transition-transform duration-300 group-hover:-translate-y-1">
                      ↑
                    </span>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        <style>
          {`
            @keyframes productReveal {
              from {
                opacity: 0;
                transform: translateY(35px) scale(0.97);
              }

              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </section>

      {/* Product Details Modal */}

      {selectedProduct && (
        <div
          dir="rtl"
          className="
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-4
            sm:p-6
            overflow-y-auto
            animate-modalBackground
          "
          onClick={closeProductDetails}
        >
          <div
            className="
              relative
              w-full
              max-w-5xl
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
            <button
              type="button"
              onClick={closeProductDetails}
              className="
                absolute
                top-4
                left-4
                z-20
                w-11
                h-11
                rounded-full
                bg-black/60
                backdrop-blur-sm
                text-white
                flex
                items-center
                justify-center
                hover:bg-[#D4AF37]
                hover:text-black
                hover:rotate-90
                transition-all
                duration-300
              "
              aria-label="إغلاق"
            >
              <X size={22} />
            </button>

            {/* Modal Body: Image + Details */}

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Gallery */}

              <div className="relative bg-[#181818] min-h-[450px] lg:min-h-[620px]">
                <img
                  key={gallery[selectedImageIndex]}
                  src={gallery[selectedImageIndex]}
                  alt={selectedProduct.name}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {calcDiscountPercent(
                  selectedProduct.price,
                  selectedProduct.oldPrice,
                ) > 0 && (
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
                    خصم{" "}
                    {calcDiscountPercent(
                      selectedProduct.price,
                      selectedProduct.oldPrice,
                    )}
                    %
                  </div>
                )}

                {gallery.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((img, i) => (
                      <button
                        key={img + i}
                        type="button"
                        onClick={() => setSelectedImageIndex(i)}
                        className={`
                          w-14
                          h-16
                          rounded-lg
                          overflow-hidden
                          border-2
                          transition-all
                          duration-300
                          ${
                            selectedImageIndex === i
                              ? "border-[#D4AF37] opacity-100"
                              : "border-white/20 opacity-60 hover:opacity-100"
                          }
                        `}
                        aria-label={`صورة ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}

              <div className="p-7 sm:p-9 lg:p-12 flex flex-col">
                <p className="text-[#D4AF37] text-sm font-medium mb-3">
                  {selectedProduct.type} • {selectedProduct.category}
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  {selectedProduct.name}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex gap-1 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={17}
                        fill={
                          star <= Math.round(selectedProduct.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>

                  <span className="text-sm text-white">
                    {selectedProduct.rating.toFixed(1)}
                  </span>

                  <span className="text-gray-500 text-sm">
                    ({selectedProduct.reviewsCount || 0} تقييم)
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
                        selectedProduct.stock <= 5
                          ? "text-red-400 border-red-400/30"
                          : "text-green-400 border-green-400/30"
                      }
                    `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedProduct.stock <= 5
                          ? "bg-red-400"
                          : "bg-green-400"
                      }`}
                    />
                    {selectedProduct.stock <= 5
                      ? `متبقي ${selectedProduct.stock} قطع فقط`
                      : "متوفر في المخزون"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-7">
                  <span className="text-[#D4AF37] text-2xl font-bold">
                    {formatPrice(selectedProduct.price)} جنيه
                  </span>

                  <span className="text-gray-500 line-through">
                    {formatPrice(selectedProduct.oldPrice)} جنيه
                  </span>
                </div>

                <div className="h-px bg-white/10 mb-7" />

                <div className="mb-7">
                  <h3 className="font-bold text-lg mb-3">نبذة عن المنتج</h3>

                  <p className="text-gray-400 leading-8">
                    {selectedProduct.descriptionLong ||
                      selectedProduct.description}
                  </p>
                </div>

                {/* Colors */}

                <div className="mb-7">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">اللون</h3>

                    <span className="text-[#D4AF37] text-sm">
                      {selectedColor}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.colors.map((color) => {
                      const swatch = selectedProduct.swatches
                        ? selectedProduct.swatches[color]
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

                          {selectedColor === color && (
                            <Check size={14} />
                          )}

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

                    <span className="text-[#D4AF37] text-sm">
                      {selectedSize}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.sizes.map((size) => (
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
                      onClick={decreaseQuantity}
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
                      onClick={increaseQuantity}
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
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
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
                    onClick={() =>
                      handleToggleFavorite(
                        selectedProduct,
                        isInWishlist(selectedProduct.id),
                      )
                    }
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
                        isInWishlist(selectedProduct.id)
                          ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                          : "border-white/15 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      }
                    `}
                    aria-label={
                      isInWishlist(selectedProduct.id)
                        ? "إزالة من المفضلة"
                        : "إضافة للمفضلة"
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        isInWishlist(selectedProduct.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}

            <div className="px-7 sm:px-9 lg:px-12 pb-4">
              <Reviews product={selectedProduct} />
            </div>

            {/* Related Products */}

            {relatedProducts.length > 0 && (
              <div className="px-7 sm:px-9 lg:px-12 pb-10">
                <div className="pt-10 pb-6 border-t border-white/10">
                  <h3 className="text-2xl font-bold">
                    منتجات قد تنال إعجابك
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => openProductDetails(rel)}
                      className="
                        group
                        bg-[#151515]
                        border
                        border-white/10
                        rounded-xl
                        overflow-hidden
                        hover:border-[#D4AF37]/40
                        transition-all
                        duration-300
                        text-right
                      "
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[#181818]">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        />
                      </div>

                      <div className="p-3">
                        <p className="text-xs text-[#D4AF37] mb-1">
                          {rel.type} • {rel.category}
                        </p>

                        <p className="text-sm font-semibold mb-2">
                          {rel.name}
                        </p>

                        <p className="text-sm font-bold text-[#D4AF37]">
                          {formatPrice(rel.price)} جنيه
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Products;