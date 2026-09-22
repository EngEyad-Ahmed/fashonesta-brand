import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categories() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="categories"
      dir="rtl"
      className="bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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
          <p className="text-[#D4AF37] text-sm font-medium tracking-[0.3em] mb-4">
            اختاري إطلالتك
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
            اكتشفي مجموعتنا
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto leading-8">
            اختاري من تشكيلتنا المتنوعة من الملابس الحريمي وملابس البنات،
            واكتشفي القطع المناسبة لكل إطلالة.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Women's Category */}
          <div
            className={`
              group
              relative
              h-[480px]
              sm:h-[550px]
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              transition-all
              duration-1000
              ease-out
              hover:-translate-y-3
              hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }
            `}
          >
            {/* Image */}
            <img
              src="https://i.ibb.co/KxDvdBcP/2bfba932-00e3-4809-a131-f79182908410.jpg"
              alt="ملابس حريمي"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-out
                group-hover:scale-110
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/50
                to-transparent
                transition-opacity
                duration-700
                group-hover:opacity-90
              "
            ></div>

            {/* Gold Border */}
            <div
              className="
                absolute
                inset-4
                border
                border-transparent
                group-hover:border-[#D4AF37]/70
                rounded-xl
                scale-95
                opacity-0
                group-hover:scale-100
                group-hover:opacity-100
                transition-all
                duration-700
              "
            ></div>

            {/* Content */}
            <div
              className="
                absolute
                bottom-0
                right-0
                left-0
                p-8
                sm:p-10
                transition-transform
                duration-700
                group-hover:-translate-y-3
              "
            >
              <p
                className="
                  text-[#D4AF37]
                  text-sm
                  font-medium
                  mb-3
                  transition-all
                  duration-500
                  group-hover:tracking-[0.25em]
                "
              >
                COLLECTION 01
              </p>

              <h3
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mb-4
                  transition-colors
                  duration-500
                  group-hover:text-[#D4AF37]
                "
              >
                ملابس حريمي
              </h3>

<p className="text-gray-200 leading-7 max-w-md mb-6">
                اكتشفي أحدث التصميمات من الدريسات والبدي سوت والبناطيل
                والبلوزات.
              </p>

              <Link
                to="/products?type=حريمي"
                className="
                  inline-flex
                  items-center
                  gap-3
                  text-white
                  font-semibold
                  transition-all
                  duration-300
                "
              >
                <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                  اكتشفي المجموعة
                </span>

                <span
                  className="
                    text-[#D4AF37]
                    text-xl
                    transition-transform
                    duration-500
                    group-hover:-translate-x-3
                  "
                >
                  ←
                </span>
              </Link>
            </div>
          </div>

          {/* Girls Category */}
          <div
            className={`
              group
              relative
              h-[480px]
              sm:h-[550px]
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              transition-all
              duration-1000
              delay-200
              ease-out
              hover:-translate-y-3
              hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }
            `}
          >
            {/* Image */}
            <img
              src="https://i.ibb.co/NnjnHTzL/b535d333-5f72-4554-bb4f-0d502c6cd0c1.jpg"
              alt="ملابس بنات"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-out
                group-hover:scale-110
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/50
                to-transparent
                transition-opacity
                duration-700
                group-hover:opacity-90
              "
            ></div>

            {/* Gold Border */}
            <div
              className="
                absolute
                inset-4
                border
                border-transparent
                group-hover:border-[#D4AF37]/70
                rounded-xl
                scale-95
                opacity-0
                group-hover:scale-100
                group-hover:opacity-100
                transition-all
                duration-700
              "
            ></div>

            {/* Content */}
            <div
              className="
                absolute
                bottom-0
                right-0
                left-0
                p-8
                sm:p-10
                transition-transform
                duration-700
                group-hover:-translate-y-3
              "
            >
              <p
                className="
                  text-[#D4AF37]
                  text-sm
                  font-medium
                  mb-3
                  transition-all
                  duration-500
                  group-hover:tracking-[0.25em]
                "
              >
                COLLECTION 02
              </p>

              <h3
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mb-4
                  transition-colors
                  duration-500
                  group-hover:text-[#D4AF37]
                "
              >
                ملابس بنات
              </h3>

              <p className="text-gray-200 leading-7 max-w-md mb-6">
                تشكيلة مميزة من السوتات والبناطيل والبلوزات لبناتك بأجمل
                التصميمات.
              </p>

              <Link
                to="/products?type=بنات"
                className="
                  inline-flex
                  items-center
                  gap-3
                  text-white
                  font-semibold
                  transition-all
                  duration-300
                "
              >
                <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                  اكتشفي المجموعة
                </span>

                <span
                  className="
                    text-[#D4AF37]
                    text-xl
                    transition-transform
                    duration-500
                    group-hover:-translate-x-3
                  "
                >
                  ←
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
