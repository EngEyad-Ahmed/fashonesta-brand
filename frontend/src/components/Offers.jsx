import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";

function Offers() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("offers");

      if (!section) return;

      const position = section.getBoundingClientRect();

      if (position.top < window.innerHeight - 120) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="offers"
      dir="rtl"
      className="relative bg-[#0b0b0b] text-white py-24 sm:py-28 overflow-hidden"
    >
      {/* Background Decorations */}

      <div
        className="
          absolute
          -top-32
          -right-32
          w-80
          h-80
          rounded-full
          bg-[#D4AF37]/5
          blur-[100px]
          pointer-events-none
        "
      ></div>

      <div
        className="
          absolute
          -bottom-40
          -left-40
          w-96
          h-96
          rounded-full
          bg-[#D4AF37]/5
          blur-[120px]
          pointer-events-none
        "
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}

        <div
          className={`
            text-center
            mb-14
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
          <div className="inline-flex items-center gap-2 text-[#D4AF37] mb-4">
            <Sparkles size={17} />

            <span className="text-sm font-medium">عروض فاشونيستا</span>

            <Sparkles size={17} />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
            عروض لا تفوتك
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto leading-8">
            اختاري إطلالتك المفضلة واستفيدي من عروضنا المميزة لفترة محدودة.
          </p>
        </div>

        {/* Main Offer */}

        <div
          className={`
            relative
            min-h-[550px]
            rounded-3xl
            overflow-hidden
            border
            border-white/10
            transition-all
            duration-1000
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            }
          `}
        >
          {/* Image */}

          <img
            src="https://i.ibb.co/XxvT1XfW/fb586cbc-1323-4772-b364-8f681422e267.jpg"
            alt="عرض فاشونيستا"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-transform
              duration-[2000ms]
              hover:scale-105
            "
          />

          {/* Dark Overlay */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-l
              from-black
              via-black/70
              to-black/10
            "
          ></div>

          {/* Gold Overlay */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/80
              via-transparent
              to-transparent
            "
          ></div>

          {/* Offer Content */}

          <div
            className={`
              relative
              z-10
              min-h-[550px]
              flex
              items-center
              px-8
              sm:px-14
              lg:px-20
              transition-all
              duration-1000
              delay-300
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              }
            `}
          >
            <div className="max-w-xl">
              {/* Discount Badge */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  mb-7
                  px-5
                  py-3
                  rounded-full
                  bg-[#D4AF37]
                  text-black
                  font-bold
                  shadow-lg
                  shadow-[#D4AF37]/20
                "
              >
                <span className="text-2xl font-black">30%</span>

                <span className="text-sm">خصم</span>
              </div>

              {/* Small Text */}

              <p className="text-[#D4AF37] text-sm sm:text-base font-medium mb-4">
                عرض لفترة محدودة
              </p>

              {/* Title */}

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                أناقتك تبدأ
                <span className="block text-[#D4AF37] mt-2">من فاشونيستا</span>
              </h2>

              {/* Description */}

              <p className="text-gray-200 text-base sm:text-lg leading-8 max-w-lg mb-8">
                اختاري إطلالتك المفضلة من تشكيلتنا الجديدة واستمتعي بخصم مميز
                على مجموعة مختارة من أحدث التصميمات.
              </p>

              {/* Price */}

              <div className="flex items-center gap-5 mb-9">
                <div>
                  <span className="block text-gray-400 text-sm mb-1">
                    السعر قبل الخصم
                  </span>

                  <span className="text-gray-500 text-lg line-through">
                    1,200 جنيه
                  </span>
                </div>

                <div className="w-px h-12 bg-white/20"></div>

                <div>
                  <span className="block text-[#D4AF37] text-sm mb-1">
                    السعر بعد الخصم
                  </span>

                  <span className="text-white text-3xl font-bold">
                    840 جنيه
                  </span>
                </div>
              </div>

              {/* Button */}

              <a
                href="#products"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-w-[190px]
                  px-8
                  py-4
                  bg-[#D4AF37]
                  text-black
                  rounded-lg
                  font-bold
                  hover:bg-[#C9A227]
                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-[#D4AF37]/20
                  transition-all
                  duration-300
                "
              >
                <ShoppingBag size={19} />
                تسوقي العرض
                <ArrowLeft
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-x-2
                  "
                />
              </a>
            </div>
          </div>

          {/* Decorative Border */}

          <div
            className="
              absolute
              inset-5
              border
              border-white/10
              rounded-2xl
              pointer-events-none
              transition-all
              duration-500
              hover:border-[#D4AF37]/40
            "
          ></div>

          {/* Floating Text */}

          <div
            className="
              absolute
              bottom-8
              left-8
              sm:left-12
              text-white/20
              text-5xl
              sm:text-7xl
              font-black
              select-none
              pointer-events-none
            "
          >
            FASHIONISTA
          </div>
        </div>

        {/* Bottom Mini Offers */}

        <div
          className={`
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-5
            mt-6
            transition-all
            duration-1000
            delay-500
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
        >
          <div
            className="
              bg-[#111111]
              border
              border-white/10
              rounded-xl
              p-5
              text-center
              hover:border-[#D4AF37]/40
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <p className="text-[#D4AF37] font-bold text-lg mb-1">خصم 20%</p>

            <p className="text-gray-400 text-sm">على البلوزات</p>
          </div>

          <div
            className="
              bg-[#111111]
              border
              border-white/10
              rounded-xl
              p-5
              text-center
              hover:border-[#D4AF37]/40
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <p className="text-[#D4AF37] font-bold text-lg mb-1">خصم 25%</p>

            <p className="text-gray-400 text-sm">على السوتات</p>
          </div>

          <div
            className="
              bg-[#111111]
              border
              border-white/10
              rounded-xl
              p-5
              text-center
              hover:border-[#D4AF37]/40
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <p className="text-[#D4AF37] font-bold text-lg mb-1">خصم 15%</p>

            <p className="text-gray-400 text-sm">على ملابس البنات</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offers;
