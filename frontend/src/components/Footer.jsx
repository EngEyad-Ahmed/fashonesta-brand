import { useEffect, useState } from "react";
import { ArrowUp, Heart, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");

      if (!footer) return;

      const position = footer.getBoundingClientRect();

      if (position.top < window.innerHeight - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="footer"
      dir="rtl"
      className="relative bg-black text-white overflow-hidden"
    >
      {/* Top Gold Line */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent"></div>

      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Footer */}
        <div
          className={`
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            lg:gap-14
            py-16
            lg:py-20
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
          {/* ========================= */}
          {/* Brand */}
          {/* ========================= */}

          <div className="lg:col-span-1">
            <a href="#home" className="inline-block mb-6 group">
              <div className="text-2xl font-bold tracking-wide">
                <span className="text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                  فاشونيستا
                </span>

                <span className="text-[#D4AF37] mr-2">للموضة</span>
              </div>
            </a>

            <p className="text-gray-400 leading-8 text-sm max-w-sm">
              عالم من الأناقة والموضة يجمع بين أحدث التصميمات والجودة العالية،
              علشان كل إطلالة ليكي تكون مميزة.
            </p>

            {/* ========================= */}
            {/* Social Media */}
            {/* ========================= */}

            <div className="flex items-center gap-3 mt-7">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/165fxh4Fmuu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  font-bold
                  hover:bg-[#D4AF37]
                  hover:text-black
                  hover:border-[#D4AF37]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                f
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/fashionista7271?igsh=emgyZXk4cHRxM2Nn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  font-bold
                  text-lg
                  hover:bg-[#D4AF37]
                  hover:text-black
                  hover:border-[#D4AF37]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                ◎
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@fashionesta_damanhour?_r=1&_t=ZS-98vkJpo3WCu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  font-bold
                  text-lg
                  hover:bg-[#D4AF37]
                  hover:text-black
                  hover:border-[#D4AF37]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                ♪
              </a>
            </div>
          </div>

          {/* ========================= */}
          {/* Quick Links */}
          {/* ========================= */}

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-8 h-px bg-[#D4AF37]"></span>
            </h3>

            <ul className="space-y-4">
              <li>
                <a
                  href="#home"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  الرئيسية
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  من نحن
                </a>
              </li>

              <li>
                <a
                  href="#products"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  المنتجات
                </a>
              </li>

              <li>
                <a
                  href="#offers"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  العروض
                </a>
              </li>
            </ul>
          </div>

          {/* ========================= */}
          {/* Customer Service */}
          {/* ========================= */}

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              خدمة العملاء
              <span className="absolute -bottom-2 right-0 w-8 h-px bg-[#D4AF37]"></span>
            </h3>

            <ul className="space-y-4">
              <li>
                <a
                  href="#contact"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  تواصل معنا
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  الأسئلة الشائعة
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  حسابي
                </a>
              </li>

              <li>
                <a
                  href="#products"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  المفضلة
                </a>
              </li>

              <li>
                <a
                  href="#products"
                  className="group flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ←
                  </span>
                  سلة التسوق
                </a>
              </li>
            </ul>
          </div>

          {/* ========================= */}
          {/* Contact */}
          {/* ========================= */}

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              تواصلي معانا
              <span className="absolute -bottom-2 right-0 w-8 h-px bg-[#D4AF37]"></span>
            </h3>

            <div className="space-y-5">
              {/* Phone */}
              <a
                href="https://wa.me/201229916690"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="text-[#D4AF37] mt-1 group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">واتساب</p>

                  <p className="text-gray-300 text-sm group-hover:text-[#D4AF37] transition-colors">
                    هاجر | Hager
                  </p>

                  <p className="text-gray-500 text-xs mt-1" dir="ltr">
                    01229916690
                  </p>
                </div>
              </a>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="text-[#D4AF37] mt-1">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    البريد الإلكتروني
                  </p>

                  <p className="text-gray-300 text-sm">info@fashionista.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="text-[#D4AF37] mt-1">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">العنوان</p>

                  <p className="text-gray-300 text-sm">مصر - البحيرة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Bottom Footer */}
        {/* ========================= */}

        <div
          className="
            border-t
            border-white/10
            py-6
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
          "
        >
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            © 2026 فاشونيستا للموضة. جميع الحقوق محفوظة.
          </p>

          <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
            صُنع بكل
            <Heart size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
            من أجل الأناقة
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/* Back To Top */}
      {/* ========================= */}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="العودة للأعلى"
        className="
          absolute
          left-6
          bottom-6
          w-11
          h-11
          rounded-full
          border
          border-white/10
          bg-white/5
          flex
          items-center
          justify-center
          text-gray-400
          hover:bg-[#D4AF37]
          hover:text-black
          hover:border-[#D4AF37]
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}

export default Footer;
