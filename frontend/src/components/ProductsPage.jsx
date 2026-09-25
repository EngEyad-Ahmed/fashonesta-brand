import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

import { useProducts } from "../context/ProductsContext";
import { calcDiscountPercent, parsePrice } from "../utils/format";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

const priceRanges = [
  { id: "all", label: "كل الأسعار", test: () => true },
  { id: "under-500", label: "أقل من 500 جنيه", test: (price) => price < 500 },
  { id: "500-1000", label: "500 - 1000 جنيه", test: (price) => price >= 500 && price <= 1000 },
  { id: "over-1000", label: "أكثر من 1000 جنيه", test: (price) => price > 1000 },
];

function ProductsPage() {
  const { products, categories, productTypes } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "الكل";
  const activeType = searchParams.get("type") || "الكل";
  const searchQuery = searchParams.get("q") || "";

  const [sortOrder, setSortOrder] = useState("default");
  const [priceRangeId, setPriceRangeId] = useState("all");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateParam = (key, value, resetPage = true) => {
    const next = new URLSearchParams(searchParams);

    if (value && value !== "الكل") {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next, { replace: true });

    if (resetPage) {
      setPage(1);
    }
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSortOrder("default");
    setPriceRangeId("all");
    setDiscountOnly(false);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    let list = products.filter((product) => {
      if (activeCategory !== "الكل" && product.category !== activeCategory) {
        return false;
      }

      if (activeType !== "الكل" && product.type !== activeType) {
        return false;
      }

      if (priceRangeId !== "all") {
        const range = priceRanges.find((r) => r.id === priceRangeId);

        if (range && !range.test(parsePrice(product.price))) {
          return false;
        }
      }

      if (discountOnly) {
        const percent = calcDiscountPercent(product.price, product.oldPrice);

        if (percent <= 0) {
          return false;
        }
      }

      if (normalizedQuery) {
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

        if (!searchableText.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...list];

    if (sortOrder === "price-asc") {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === "price-desc") {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOrder === "discount") {
      sorted.sort(
        (a, b) =>
          calcDiscountPercent(b.price, b.oldPrice) -
          calcDiscountPercent(a.price, a.oldPrice),
      );
    } else if (sortOrder === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [searchQuery, activeCategory, activeType, priceRangeId, discountOnly, sortOrder, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeCategory !== "الكل" ||
    activeType !== "الكل" ||
    priceRangeId !== "all" ||
    discountOnly;

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

          {activeCategory !== "الكل" && (
            <>
              <span>/</span>
              <span className="text-gray-300">{activeCategory}</span>
            </>
          )}

          {searchQuery && (
            <>
              <span>/</span>
              <span className="text-gray-300">نتائج البحث "{searchQuery}"</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {searchQuery
              ? `نتائج البحث عن "${searchQuery}"`
              : activeCategory === "الكل"
              ? "كل المنتجات"
              : activeCategory}
          </h1>

          <p className="text-gray-500 text-sm">
            {filtered.length} منتج
            {activeType !== "الكل" ? ` • نوع ${activeType}` : ""}
            {discountOnly ? " • العروض فقط" : ""}
          </p>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateParam("q")}
                className="flex items-center gap-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-3 py-1.5 hover:bg-[#D4AF37]/20 transition-colors"
              >
                "{searchQuery}"
                <X size={13} />
              </button>
            )}

            {activeCategory !== "الكل" && (
              <button
                type="button"
                onClick={() => updateParam("category")}
                className="flex items-center gap-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-3 py-1.5 hover:bg-[#D4AF37]/20 transition-colors"
              >
                {activeCategory}
                <X size={13} />
              </button>
            )}

            {activeType !== "الكل" && (
              <button
                type="button"
                onClick={() => updateParam("type")}
                className="flex items-center gap-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-3 py-1.5 hover:bg-[#D4AF37]/20 transition-colors"
              >
                {activeType}
                <X size={13} />
              </button>
            )}

            {priceRangeId !== "all" && (
              <button
                type="button"
                onClick={() => {
                  setPriceRangeId("all");
                  setPage(1);
                }}
                className="flex items-center gap-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-3 py-1.5 hover:bg-[#D4AF37]/20 transition-colors"
              >
                {priceRanges.find((r) => r.id === priceRangeId)?.label}
                <X size={13} />
              </button>
            )}

            {discountOnly && (
              <button
                type="button"
                onClick={() => {
                  setDiscountOnly(false);
                  setPage(1);
                }}
                className="flex items-center gap-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-3 py-1.5 hover:bg-[#D4AF37]/20 transition-colors"
              >
                العروض فقط
                <X size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-4"
            >
              مسح الكل
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="lg:hidden flex items-center gap-2 text-sm text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg px-4 py-2.5 hover:bg-[#D4AF37]/10 transition-colors"
          >
            <SlidersHorizontal size={16} />
            الفلاتر
          </button>

          <div className="hidden lg:block text-sm text-gray-500">
            عرض {visibleProducts.length} من {filtered.length} منتج
          </div>

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
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`
              lg:block
              ${showMobileFilters ? "block" : "hidden"}
            `}
          >
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-7 lg:sticky lg:top-28">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-bold">الفلاتر</h3>

                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  aria-label="إغلاق الفلاتر"
                  className="text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Category */}
              <div>
                <h3 className="font-bold text-sm mb-3">القسم</h3>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => updateParam("category", category)}
                      className={`
                        w-full
                        text-right
                        text-sm
                        py-1.5
                        transition-colors
                        ${
                          activeCategory === category
                            ? "text-[#D4AF37] font-bold"
                            : "text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <h3 className="font-bold text-sm mb-3">النوع</h3>

                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateParam("type", type)}
                      className={`
                        w-full
                        text-right
                        text-sm
                        py-1.5
                        transition-colors
                        ${
                          activeType === type
                            ? "text-[#D4AF37] font-bold"
                            : "text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-bold text-sm mb-3">السعر</h3>

                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => {
                        setPriceRangeId(range.id);
                        setPage(1);
                      }}
                      className={`
                        w-full
                        text-right
                        text-sm
                        py-1.5
                        transition-colors
                        ${
                          priceRangeId === range.id
                            ? "text-[#D4AF37] font-bold"
                            : "text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      {range.label}
                    </button>
                  ))}

                  <label className="flex items-center gap-2 pt-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={(e) => {
                        setDiscountOnly(e.target.checked);
                        setPage(1);
                      }}
                      className="accent-[#D4AF37] w-4 h-4"
                    />

                    العروض فقط
                  </label>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full py-3 rounded-xl border border-white/15 text-sm text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  مسح الفلاتر
                </button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div>
            {visibleProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-white/15 rounded-2xl">
                <p className="text-gray-400 mb-6">لا توجد منتجات مطابقة للفلاتر الحالية.</p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-bold hover:bg-[#C9A227] transition-colors"
                >
                  إعادة الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  aria-label="السابق"
                  className="
                    w-11
                    h-11
                    rounded-lg
                    border
                    border-white/15
                    flex
                    items-center
                    justify-center
                    text-gray-300
                    hover:border-[#D4AF37]
                    hover:text-[#D4AF37]
                    transition-colors
                    disabled:opacity-40
                    disabled:pointer-events-none
                  "
                >
                  <ChevronRight size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPage(num)}
                      className={`
                        w-11
                        h-11
                        rounded-lg
                        border
                        flex
                        items-center
                        justify-center
                        text-sm
                        transition-colors
                        ${
                          safePage === num
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                            : "border-white/15 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                        }
                      `}
                    >
                      {num}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safePage === totalPages}
                  aria-label="التالي"
                  className="
                    w-11
                    h-11
                    rounded-lg
                    border
                    border-white/15
                    flex
                    items-center
                    justify-center
                    text-gray-300
                    hover:border-[#D4AF37]
                    hover:text-[#D4AF37]
                    transition-colors
                    disabled:opacity-40
                    disabled:pointer-events-none
                  "
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;