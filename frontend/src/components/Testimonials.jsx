import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("testimonials");

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

  const testimonials = [
    {
      name: "سارة أحمد",
      role: "عميلة",
      text: "بجد تجربة جميلة جدًا، الخامة ممتازة والشكل أحلى من الصور. أكيد مش آخر مرة أطلب من فاشونيستا.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    {
      name: "نور محمد",
      role: "عميلة",
      text: "أكتر حاجة حبيتها إن الاختيارات متنوعة والأسعار مناسبة جدًا، والتوصيل كان سريع.",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    {
      name: "ملك علي",
      role: "عميلة",
      text: "القطعة وصلت زي ما شوفتها بالظبط، والخامة جميلة جدًا. حبيت تفاصيل التغليف والتعامل.",
      image:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    },
  ];

  return (
    <section
      id="testimonials"
      dir="rtl"
      className="relative bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
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
                : "opacity-0 translate-y-10"
            }
          `}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#D4AF37]"></span>

            <span className="text-[#D4AF37] text-sm font-medium">
              آراء عملائنا
            </span>

            <span className="w-8 h-px bg-[#D4AF37]"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
            ماذا يقول
            <span className="text-[#D4AF37]"> عملائنا؟</span>
          </h2>

          <p className="text-gray-400 leading-8">
            رضاكِ هو أهم شيء بالنسبة لنا، ونسعد دائمًا عندما نعرف رأيكِ في
            تجربتك مع فاشونيستا.
          </p>
        </div>

        {/* Testimonials */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`
                group
                relative
                bg-[#111111]
                border
                border-white/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-700
                ease-out
                hover:-translate-y-3
                hover:border-[#D4AF37]/40
                hover:shadow-2xl
                hover:shadow-black/40
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }
              `}
              style={{
                transitionDelay: `${index * 180}ms`,
              }}
            >
              {/* Gold Line */}

              <div
                className="
                  absolute
                  top-0
                  right-0
                  left-0
                  h-[2px]
                  bg-gradient-to-l
                  from-[#D4AF37]
                  to-transparent
                  opacity-40
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                "
              ></div>

              {/* Quote Icon */}

              <div
                className="
                  absolute
                  top-6
                  left-6
                  text-[#D4AF37]/10
                  group-hover:text-[#D4AF37]/20
                  transition-colors
                  duration-500
                "
              >
                <Quote size={55} />
              </div>

              {/* Stars */}

              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                    className="text-[#D4AF37]"
                  />
                ))}
              </div>

              {/* Review */}

              <p className="relative z-10 text-gray-300 leading-8 text-sm sm:text-base mb-8 min-h-[125px]">
                "{testimonial.text}"
              </p>

              {/* Customer */}

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                      border
                      border-[#D4AF37]/30
                      group-hover:border-[#D4AF37]
                      transition-all
                      duration-500
                    "
                  />

                  <div
                    className="
                      absolute
                      -bottom-1
                      -right-1
                      w-5
                      h-5
                      rounded-full
                      bg-[#D4AF37]
                      border-2
                      border-[#111111]
                    "
                  ></div>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1">
                    {testimonial.name}
                  </h3>

                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Rating */}

        <div
          className={`
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
            mt-14
            text-center
            transition-all
            duration-1000
            delay-700
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >
          <div className="flex items-center gap-1">
            <Star size={20} fill="currentColor" className="text-[#D4AF37]" />

            <span className="text-2xl font-bold">4.9</span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-white/20"></div>

          <p className="text-gray-400 text-sm">
            تقييم أكثر من 500 عميلة لفاشونيستا
          </p>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
