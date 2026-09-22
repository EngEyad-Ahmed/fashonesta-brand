import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    products: 0,
    customers: 0,
    experience: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about");

      if (!section) return;

      const position = section.getBoundingClientRect();

      if (position.top < window.innerHeight - 150) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800;
    const startTime = performance.now();

    const animateCounters = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCounters({
        products: Math.floor(500 * progress),
        customers: Math.floor(1000 * progress),
        experience: Math.floor(5 * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [isVisible]);

  const features = [
    "اختيارات متنوعة تناسب مختلف الأذواق",
    "خامات مختارة بعناية",
    "تصميمات عصرية ومواكبة للموضة",
    "تجربة تسوق سهلة ومميزة",
  ];

  return (
    <section
      id="about"
      dir="rtl"
      className="relative bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
    >
      {/* Background Decoration */}

      <div
        className="
          absolute
          top-20
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
        {/* Main Content */}

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image Side */}

          <div
            className={`
              relative
              transition-all
              duration-1000
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-16"
              }
            `}
          >
            {/* Main Image */}

            <div className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-3xl">
              <img
                src="https://i.ibb.co/RRwhtv1/b44d5bbf-1ac0-4e43-8c27-5194f9648057.jpg"
                alt="فاشونيستا"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-[2000ms]
                  hover:scale-105
                "
              />

              {/* Overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-transparent
                  to-black/10
                "
              ></div>

              {/* Gold Border */}

              <div
                className="
                  absolute
                  inset-5
                  border
                  border-white/20
                  rounded-2xl
                  pointer-events-none
                  transition-all
                  duration-500
                  hover:border-[#D4AF37]/60
                "
              ></div>

              {/* Floating Label */}

              <div
                className="
                  absolute
                  bottom-8
                  right-8
                  left-8
                  bg-black/60
                  backdrop-blur-md
                  border
                  border-white/10
                  rounded-xl
                  p-5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#D4AF37]
                      text-black
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <p className="text-[#D4AF37] text-xs mb-1">FASHIONISTA</p>

                    <p className="text-sm font-semibold">
                      لأن أناقتك تستحق الأفضل
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Gold Square */}

            <div
              className="
                absolute
                -bottom-5
                -left-5
                w-24
                h-24
                border
                border-[#D4AF37]/40
                rounded-xl
                -z-10
              "
            ></div>

            {/* Decorative Circle */}

            <div
              className="
                absolute
                -top-5
                -right-5
                w-20
                h-20
                rounded-full
                bg-[#D4AF37]/10
                blur-sm
                -z-10
              "
            ></div>
          </div>

          {/* Text Side */}

          <div
            className={`
              transition-all
              duration-1000
              delay-200
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              }
            `}
          >
            {/* Small Label */}

            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-px bg-[#D4AF37]"></span>

              <span className="text-[#D4AF37] text-sm font-medium">من نحن</span>
            </div>

            {/* Title */}

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-7">
              فاشونيستا...
              <span className="block text-[#D4AF37] mt-2">أناقتك بطريقتك</span>
            </h2>

            {/* Description */}

            <p className="text-gray-400 leading-8 text-base sm:text-lg mb-6">
              فاشونيستا هو متجر للموضة نهتم من خلاله بتقديم مجموعة مميزة من
              الملابس الحريمي وملابس البنات، بتصميمات عصرية وخامات نختارها
              بعناية.
            </p>

            <p className="text-gray-400 leading-8 mb-8">
              هدفنا إن كل قطعة تختاريها تكون جزء من إطلالتك الخاصة، وتخليكي
              تشعري بالثقة والأناقة في كل وقت.
            </p>

            {/* Features */}

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className={`
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-gray-300
                    transition-all
                    duration-700
                    ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }
                  `}
                  style={{
                    transitionDelay: `${500 + index * 120}ms`,
                  }}
                >
                  <div
                    className="
                      flex
                     -shrink-0
                      w-7
                      h-7
                      rounded-full
                      bg-[#D4AF37]/10
                      border
                      border-[#D4AF37]/30
                      items-center
                      justify-center
                      text-[#D4AF37]
                    "
                  >
                    <Check size={14} />
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Button */}

            <Link
              to="/products"
              className="
                group
                inline-flex
                items-center
                gap-3
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
              اكتشفي مجموعتنا
              <ArrowLeft
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-2
                "
              />
            </Link>
          </div>
        </div>

        {/* Statistics */}

        <div
          className={`
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-5
            mt-20
            transition-all
            duration-1000
            delay-500
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }
          `}
        >
          {/* Products */}

          <div
            className="
              group
              relative
              bg-[#111111]
              border
              border-white/10
              rounded-2xl
              p-7
              text-center
              overflow-hidden
              hover:border-[#D4AF37]/40
              hover:-translate-y-2
              transition-all
              duration-500
            "
          >
            <span
              className="
                block
                text-4xl
                sm:text-5xl
                font-black
                text-[#D4AF37]
                mb-2
              "
            >
              +{counters.products}
            </span>

            <p className="text-gray-400">قطعة مميزة</p>
          </div>

          {/* Customers */}

          <div
            className="
              group
              relative
              bg-[#111111]
              border
              border-white/10
              rounded-2xl
              p-7
              text-center
              overflow-hidden
              hover:border-[#D4AF37]/40
              hover:-translate-y-2
              transition-all
              duration-500
            "
          >
            <span
              className="
                block
                text-4xl
                sm:text-5xl
                font-black
                text-[#D4AF37]
                mb-2
              "
            >
              +{counters.customers}
            </span>

            <p className="text-gray-400">عميلة سعيدة</p>
          </div>

          {/* Experience */}

          <div
            className="
              group
              relative
              bg-[#111111]
              border
              border-white/10
              rounded-2xl
              p-7
              text-center
              overflow-hidden
              hover:border-[#D4AF37]/40
              hover:-translate-y-2
              transition-all
              duration-500
            "
          >
            <span
              className="
                block
                text-4xl
                sm:text-5xl
                font-black
                text-[#D4AF37]
                mb-2
              "
            >
              +{counters.experience}
            </span>

            <p className="text-gray-400">سنوات من الخبرة</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
