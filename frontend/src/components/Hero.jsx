import { useEffect, useState } from "react";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      dir="rtl"
      className="relative min-h-screen overflow-hidden flex items-center"
    >
      {/* Background Image using <img> tag with direct ImgBB link */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://i.ibb.co/cK2k0mvn/40559953-9353-4512-9953-23e735413ed1.jpg"
          alt="فاشونيستا"
          className={`
            w-full h-full object-cover object-center
            transition-transform
            duration-[2500ms]
            ease-out
            ${isVisible ? "scale-100" : "scale-110"}
          `}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Right Side Gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/30 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16">
        <div className="max-w-2xl text-right">
          {/* Small Label */}
          <p
            className={`
              text-[#D4AF37]
              text-sm sm:text-base
              font-medium
              mb-6
              transition-all
              duration-1000
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-24"
              }
            `}
          >
            أناقتك تبدأ من هنا
          </p>

          {/* Main Title */}
          <h1
            className={`
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-bold
              text-white
              leading-[1.25]
              mb-8
              transition-all
              duration-1000
              delay-200
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-28"
              }
            `}
          >
            <span className="block mb-5">اكتشفي أناقتك</span>

            <span className="block">
              مع <span className="text-[#D4AF37]">فاشونيستا</span>
            </span>
          </h1>

          {/* Description */}
          <p
            className={`
              text-gray-200
              text-base sm:text-lg
              leading-8
              max-w-xl
              mb-10
              transition-all
              duration-1000
              delay-500
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }
            `}
          >
            أحدث صيحات الموضة للمرأة والطفلة، بتصميمات تجمع بين الأناقة والجودة
            لتكون كل إطلالة مميزة.
          </p>

          {/* Buttons */}
          <div
            className={`
              flex
              flex-col
              sm:flex-row
              items-start
              gap-4
              transition-all
              duration-1000
              delay-700
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            <a
              href="#products"
              className="
                min-w-[170px]
                px-8
                py-4
                bg-[#D4AF37]
                text-black
                font-bold
                rounded-md
                text-center
                hover:bg-[#C9A227]
                hover:scale-105
                hover:-translate-y-1
                hover:shadow-[0_10px_30px_rgba(212,175,55,0.25)]
                transition-all
                duration-300
              "
            >
              تسوقي الآن
            </a>

            <a
              href="#products"
              className="
                min-w-[170px]
                px-8
                py-4
                border
                border-white/70
                text-white
                font-semibold
                rounded-md
                text-center
                hover:bg-white
                hover:text-black
                hover:scale-105
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              اكتشفي المجموعة
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div
        className={`
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          text-white/70
          transition-all
          duration-1000
          delay-1000
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs">اكتشفي المزيد</span>

          <div className="w-px h-10 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
