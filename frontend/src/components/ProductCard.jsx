import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { calcDiscountPercent, formatPrice } from "../utils/format";

function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calcDiscountPercent(product.price, product.oldPrice);

  const handleQuickAdd = (e) => {
    e.preventDefault();

    addToCart(product, product.colors[0], product.sizes[0], 1);
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();

    toggleWishlist(product);

    showToast(
      isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة",
      isFavorite ? "error" : "success",
    );
  };

  return (
    <div className="group relative bg-[#111111] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-500">
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-[#181818]"
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
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        onClick={handleToggleFavorite}
        className={`
          absolute
          top-4
          left-4
          z-10
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

      {/* Quick Add */}
      <button
        type="button"
        onClick={handleQuickAdd}
        className="
          absolute
          bottom-4
          right-4
          left-4
          z-10
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

      {/* Product Info */}
      <div className={`${compact ? "p-4" : "p-5"}`}>
        <Link to={`/product/${product.id}`} className="block">
          <p className="text-[#D4AF37] text-xs mb-2">
            {product.type} • {product.category}
          </p>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              fill={star <= Math.round(product.rating) ? "currentColor" : "none"}
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
}

export default ProductCard;