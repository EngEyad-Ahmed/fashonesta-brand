import { Heart, X, ShoppingCart, Trash2 } from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const {
    wishlistItems,
    wishlistCount,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart, openCart } = useCart();

  const handleAddToCart = (product) => {
    const selectedColor = product.colors?.[0] || "";
    const selectedSize = product.sizes?.[0] || "";

    addToCart(product, selectedColor, selectedSize, 1);

    removeFromWishlist(product.id);

    closeWishlist();

    openCart();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        isWishlistOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={closeWishlist}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isWishlistOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Wishlist Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#111111] text-white shadow-2xl transition-transform duration-500 ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <Heart size={22} className="text-[#D4AF37]" fill="currentColor" />

            <div>
              <h2 className="text-lg font-semibold">المفضلة</h2>

              <p className="text-xs text-white/50 mt-1">{wishlistCount} منتج</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeWishlist}
            aria-label="إغلاق المفضلة"
            className="
              w-9
              h-9
              flex
              items-center
              justify-center
              text-white
              hover:text-[#D4AF37]
              transition-colors
              duration-300
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-80px)] overflow-y-auto px-6 py-6">
          {wishlistItems.length === 0 ? (
            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <Heart size={55} strokeWidth={1} className="text-white/20 mb-5" />

              <h3 className="text-lg font-semibold mb-2">المفضلة فارغة</h3>

              <p className="text-sm text-white/45 max-w-xs">
                أضيفي المنتجات اللي عجباكي للمفضلة وهتلاقيها هنا.
              </p>
            </div>
          ) : (
            <>
              {/* Clear All */}
              <div className="flex justify-end mb-5">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="
                    text-xs
                    text-white/50
                    hover:text-[#D4AF37]
                    transition-colors
                    duration-300
                  "
                >
                  مسح الكل
                </button>
              </div>

              {/* Products */}
              <div className="space-y-4">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="
                      flex
                      gap-4
                      p-3
                      rounded-xl
                      bg-white/[0.04]
                      border
                      border-white/[0.08]
                    "
                  >
                    {/* Product Image */}
                    <div
                      className="
                        w-24
                        h-28
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-white/5
                      "
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-white truncate">
                            {product.name}
                          </h3>

                          <p className="text-xs text-white/40 mt-1">
                            {product.category}
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="إزالة من المفضلة"
                          className="
                            shrink-0
                            text-white/40
                            hover:text-red-400
                            transition-colors
                            duration-300
                          "
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[#D4AF37] font-semibold text-sm">
                          {product.price} جنيه
                        </span>

                        {product.oldPrice && (
                          <span className="text-white/30 text-xs line-through">
                            {product.oldPrice} جنيه
                          </span>
                        )}
                      </div>

                      {/* Add To Cart */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="
                          mt-3
                          w-full
                          flex
                          items-center
                          justify-center
                          gap-2
                          py-2
                          rounded-lg
                          bg-[#D4AF37]
                          text-black
                          text-xs
                          font-semibold
                          hover:bg-[#c5a22f]
                          transition-colors
                          duration-300
                        "
                      >
                        <ShoppingCart size={15} />
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
