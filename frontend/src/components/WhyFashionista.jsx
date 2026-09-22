import { useEffect, useState } from "react";
import { Gem, Sparkles, Truck, Heart } from "lucide-react";

function WhyFashionista() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("why-fashionista");

      if (!section) return;

      const position = section.getBoundingClientRect();

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

  const features = [
    {
      icon: Gem,
      title: "جودة تستحقينها",
      description:
        "نختار لكِ قطعًا تجمع بين جودة الخامات وروعة التصميم لتستمتعي بإطلالة مميزة.",
    },
    {
      icon: Sparkles,
      title: "أحدث صيحات الموضة",
      description:
        "نحرص دائمًا على تقديم أحدث التصميمات التي تناسب ذوقك وتواكب عالم الموضة.",
    },
    {
      icon: Truck,
      title: "توصيل سريع",
      description:
        "اطلبي القطعة التي تحبينها واستمتعي بتجربة توصيل سهلة وسريعة حتى باب منزلك.",
    },
    {
      icon: Heart,
      title: "اختيارات تناسبك",
      description:
        "تشكيلة متنوعة من الملابس الحريمي وملابس البنات لتجدي دائمًا ما يناسبك.",
    },
  ];

  return (
    <section
      id="why-fashionista"
      dir="rtl"
      className="relative bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          top-1/2
          right-1/2
          translate-x-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-[#D4AF37]/5
          blur-[120px]
          pointer-events-none
        "
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div
          className={`
            text-center
            max-w-3xl
            mx-auto
            mb-16
            transition-all
            duration-1000
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }
          `}
        >
          <p className="text-[#D4AF37] text-sm font-medium mb-4">
            لماذا فاشونيستا؟
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            لأن أناقتك
            <span className="text-[#D4AF37]"> تستحق الأفضل</span>
          </h2>

          <p className="text-gray-400 leading-8 text-base sm:text-lg">
            في فاشونيستا نهتم بكل تفصيلة، من اختيار القطعة وحتى وصولها إليكِ،
            لنمنحك تجربة تسوق تجمع بين الأناقة والجودة والسهولة.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  group
                  relative
                  bg-[#111111]
                  border
                  border-white/10
                  rounded-2xl
                  p-8
                  text-center
                  overflow-hidden
                  transition-all
                  duration-700
                  ease-out
                  hover:-translate-y-3
                  hover:border-[#D4AF37]/40
                  hover:shadow-2xl
                  hover:shadow-[#D4AF37]/5
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-16"
                  }
                `}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Gold Top Line */}
                <div
                  className="
                    absolute
                    top-0
                    right-1/2
                    translate-x-1/2
                    w-0
                    h-[2px]
                    bg-[#D4AF37]
                    group-hover:w-full
                    transition-all
                    duration-700
                  "
                ></div>

                {/* Icon */}
                <div
                  className="
                    relative
                    mx-auto
                    mb-7
                    w-20
                    h-20
                    rounded-full
                    border
                    border-[#D4AF37]/30
                    flex
                    items-center
                    justify-center
                    text-[#D4AF37]
                    bg-[#D4AF37]/5
                    group-hover:bg-[#D4AF37]
                    group-hover:text-black
                    group-hover:scale-110
                    group-hover:rotate-6
                    transition-all
                    duration-500
                  "
                >
                  <Icon size={32} strokeWidth={1.5} />

                  {/* Glow */}
                  <div
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-[#D4AF37]/20
                      blur-xl
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-500
                    "
                  ></div>
                </div>

                {/* Title */}
                <h3
                  className="
                    text-xl
                    font-bold
                    mb-4
                    group-hover:text-[#D4AF37]
                    transition-colors
                    duration-300
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-7 text-sm">
                  {feature.description}
                </p>

                {/* Bottom Number */}
                <span
                  className="
                    absolute
                    bottom-3
                    left-5
                    text-6xl
                    font-bold
                    text-white/[0.025]
                    select-none
                    transition-all
                    duration-500
                    group-hover:text-[#D4AF37]/10
                  "
                >
                  0{index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyFashionista;
