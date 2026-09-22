import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { cartCount, openCart } = useCart();

  const { wishlistCount, openWishlist } = useWishlist();

  const { searchQuery, setSearchQuery, isSearchOpen, openSearch, closeSearch } =
    useSearch();

  const { currentUser, openAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth Scroll (go home first if needed)
  const goToSection = (id) => {
    setIsMenuOpen(false);

    if (!isHome) {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // فتح البحث والانتقال للمنتجات
  const handleOpenSearch = () => {
    setIsMenuOpen(false);
    openSearch();

    setTimeout(() => {
      const searchInput = document.getElementById("fashionista-search-input");

      if (searchInput) {
        searchInput.focus();
      }
    }, 150);
  };

  // البحث بالضغط على Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    closeSearch();
    navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // حسابي: صفحة الحساب لو مسجل، وإلا نافذة تسجيل الدخول
  const handleAccountClick = () => {
    setIsMenuOpen(false);

    if (currentUser) {
      navigate("/account");
    } else {
      openAuth();
    }
  };

  return (
    <>
      <nav
        dir="rtl"
        className={`
          fixed
          top-0
          right-0
          left-0
          z-50
          transition-all
          duration-700
          ${
            isScrolled
              ? "bg-[#292929]/95 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              : "bg-black"
          }
        `}
      >
        <div
          className={`
            max-w-7xl
            mx-auto
            px-6
            sm:px-8
            lg:px-12
            h-20
            flex
            items-center
            justify-between
            gap-8
            transition-all
            duration-1000
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5"
            }
          `}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => goToSection("home")}
            className="group shrink-0 text-right"
          >
            <div className="leading-none">
              <span
                className="
                  block
                  text-white
                  text-xl
                  sm:text-2xl
                  font-bold
                  tracking-wide
                  group-hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                فاشونيستا
              </span>

              <span
                className="
                  block
                  text-[#D4AF37]
                  text-[10px]
                  sm:text-xs
                  tracking-[0.25em]
                  mt-1
                "
              >
                للموضة
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9">
            <button
              type="button"
              onClick={() => goToSection("home")}
              className="
                relative
                text-sm
                font-medium
                text-white
                hover:text-[#D4AF37]
                transition-colors
                duration-300
                group
              "
            >
              الرئيسية
              <span
                className="
                  absolute
                  -bottom-2
                  right-0
                  w-0
                  h-px
                  bg-[#D4AF37]
                  group-hover:w-full
                  transition-all
                  duration-300
                "
              />
            </button>

            <button
              type="button"
              onClick={() => goToSection("about")}
              className="
                relative
                text-sm
                font-medium
                text-white
                hover:text-[#D4AF37]
                transition-colors
                duration-300
                group
              "
            >
              من نحن
              <span
                className="
                  absolute
                  -bottom-2
                  right-0
                  w-0
                  h-px
                  bg-[#D4AF37]
                  group-hover:w-full
                  transition-all
                  duration-300
                "
              />
            </button>

            <Link
              to="/products"
              className="
                relative
                text-sm
                font-medium
                text-white
                hover:text-[#D4AF37]
                transition-colors
                duration-300
                group
              "
            >
              المنتجات
              <span
                className="
                  absolute
                  -bottom-2
                  right-0
                  w-0
                  h-px
                  bg-[#D4AF37]
                  group-hover:w-full
                  transition-all
                  duration-300
                "
              />
            </Link>

            <button
              type="button"
              onClick={() => goToSection("offers")}
              className="
                relative
                text-sm
                font-medium
                text-white
                hover:text-[#D4AF37]
                transition-colors
                duration-300
                group
              "
            >
              العروض
              <span
                className="
                  absolute
                  -bottom-2
                  right-0
                  w-0
                  h-px
                  bg-[#D4AF37]
                  group-hover:w-full
                  transition-all
                  duration-300
                "
              />
            </button>

            <button
              type="button"
              onClick={() => goToSection("contact")}
              className="
                relative
                text-sm
                font-medium
                text-white
                hover:text-[#D4AF37]
                transition-colors
                duration-300
                group
              "
            >
              تواصل معنا
              <span
                className="
                  absolute
                  -bottom-2
                  right-0
                  w-0
                  h-px
                  bg-[#D4AF37]
                  group-hover:w-full
                  transition-all
                  duration-300
                "
              />
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search */}
            <button
              type="button"
              aria-label="البحث"
              onClick={handleOpenSearch}
              className="
                group
                w-9
                h-9
                flex
                items-center
                justify-center
                text-white
                hover:text-[#D4AF37]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <Search
                size={19}
                strokeWidth={1.7}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              aria-label="المفضلة"
              onClick={openWishlist}
              className="
                group
                relative
                w-9
                h-9
                flex
                items-center
                justify-center
                text-white
                hover:text-[#D4AF37]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <Heart
                size={19}
                strokeWidth={1.7}
                className="group-hover:scale-110 transition-transform duration-300"
              />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-[#D4AF37]
                    text-black
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border
                    border-black
                  "
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label="سلة التسوق"
              onClick={openCart}
              className="
                group
                relative
                w-9
                h-9
                flex
                items-center
                justify-center
                text-white
                hover:text-[#D4AF37]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <ShoppingCart
                size={19}
                strokeWidth={1.7}
                className="group-hover:scale-110 transition-transform duration-300"
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-[#D4AF37]
                    text-black
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border
                    border-black
                  "
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              type="button"
              aria-label="حسابي"
              onClick={handleAccountClick}
              className="
                group
                w-9
                h-9
                flex
                items-center
                justify-center
                text-white
                hover:text-[#D4AF37]
                hover:-translate-y-1
                transition-all
                duration-300
                relative
              "
            >
              <User
                size={19}
                strokeWidth={1.7}
                className="group-hover:scale-110 transition-transform duration-300"
              />

              {currentUser && (
                <span
                  className="
                    absolute
                    -bottom-0.5
                    -left-0.5
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-green-400
                    border
                    border-black
                  "
                />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              lg:hidden
              text-white
              hover:text-[#D4AF37]
              transition-all
              duration-300
              hover:rotate-3
            "
            aria-label="القائمة"
          >
            {isMenuOpen ? (
              <X size={26} strokeWidth={1.7} />
            ) : (
              <Menu size={26} strokeWidth={1.7} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden
            overflow-hidden
            transition-all
            duration-500
            ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="border-t border-white/10 px-6 sm:px-8 py-6">
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => goToSection("home")}
                className="
                  text-right
                  text-white
                  hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                الرئيسية
              </button>

              <button
                type="button"
                onClick={() => goToSection("about")}
                className="
                  text-right
                  text-white
                  hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                من نحن
              </button>

              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="
                  block
                  text-right
                  text-white
                  hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                المنتجات
              </Link>

              <button
                type="button"
                onClick={() => goToSection("offers")}
                className="
                  text-right
                  text-white
                  hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                العروض
              </button>

              <button
                type="button"
                onClick={() => goToSection("contact")}
                className="
                  text-right
                  text-white
                  hover:text-[#D4AF37]
                  transition-colors
                  duration-300
                "
              >
                تواصل معنا
              </button>

              {/* Mobile Actions */}
              <div className="flex items-center gap-6 pt-5 mt-2 border-t border-white/10">
                {/* Search */}
                <button
                  type="button"
                  aria-label="البحث"
                  onClick={handleOpenSearch}
                  className="
                    text-white
                    hover:text-[#D4AF37]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <Search size={20} strokeWidth={1.7} />
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  aria-label="المفضلة"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openWishlist();
                  }}
                  className="
                    relative
                    text-white
                    hover:text-[#D4AF37]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <Heart size={20} strokeWidth={1.7} />

                  {wishlistCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-2
                        -right-2
                        min-w-[17px]
                        h-[17px]
                        px-1
                        rounded-full
                        bg-[#D4AF37]
                        text-black
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                        border
                        border-black
                      "
                    >
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  type="button"
                  aria-label="سلة التسوق"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openCart();
                  }}
                  className="
                    relative
                    text-white
                    hover:text-[#D4AF37]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <ShoppingCart size={20} strokeWidth={1.7} />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-2
                        -right-2
                        min-w-[17px]
                        h-[17px]
                        px-1
                        rounded-full
                        bg-[#D4AF37]
                        text-black
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                        border
                        border-black
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Account */}
                <button
                  type="button"
                  aria-label="حسابي"
                  onClick={handleAccountClick}
                  className="
                    relative
                    text-white
                    hover:text-[#D4AF37]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <User size={20} strokeWidth={1.7} />

                  {currentUser && (
                    <span
                      className="
                        absolute
                        -bottom-0.5
                        -left-0.5
                        w-2.5
                        h-2.5
                        rounded-full
                        bg-green-400
                        border
                        border-black
                      "
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================= */}
      {/* Search Overlay */}
      {/* ========================= */}

      <div
        dir="rtl"
        className={`
          fixed
          inset-0
          z-[100]
          bg-black/75
          backdrop-blur-md
          flex
          items-start
          justify-center
          pt-28
          px-5
          transition-all
          duration-300
          ${
            isSearchOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        onClick={closeSearch}
      >
        <div
          className={`
            w-full
            max-w-3xl
            bg-[#111111]
            border
            border-white/10
            rounded-2xl
            shadow-2xl
            overflow-hidden
            transition-all
            duration-500
            ${
              isSearchOpen
                ? "translate-y-0 scale-100"
                : "-translate-y-8 scale-95"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center gap-4 p-5 sm:p-6">
              <Search
                size={22}
                className="text-[#D4AF37] shrink-0"
                strokeWidth={1.7}
              />

              <input
                id="fashionista-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي عن فستان، بلوزة، سوت..."
                autoComplete="off"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-white
                  text-base
                  placeholder:text-white/30
                "
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="إغلاق البحث"
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
                  shrink-0
                "
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="h-px bg-white/10 mb-5" />

              <p className="text-xs text-white/40">
                ابحثي باسم المنتج أو القسم أو النوع أو اللون
              </p>

              {searchQuery.trim() && (
                <button
                  type="submit"
                  className="
                    mt-5
                    w-full
                    py-3
                    rounded-lg
                    bg-[#D4AF37]
                    text-black
                    font-bold
                    text-sm
                    hover:bg-[#C9A227]
                    transition-colors
                    duration-300
                  "
                >
                  البحث عن "{searchQuery}"
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Navbar;
