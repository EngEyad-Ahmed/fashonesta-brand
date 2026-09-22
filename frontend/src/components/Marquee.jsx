function Marquee() {
  const items = [
    "أناقتك تبدأ من هنا",
    "اختاري إطلالتك",
    "أحدث صيحات الموضة",
    "فاشونيستا للموضة",
    "أناقة تليق بكِ",
  ];

  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        bg-[#D4AF37]
        text-black
        py-5
        border-y
        border-black/10
      "
    >
      {/* الحركة الأساسية */}
      <div className="flex w-max animate-[marquee_25s_linear_infinite]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              whitespace-nowrap
              px-6
              sm:px-10
              text-lg
              sm:text-xl
              font-bold
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <span>{item}</span>

            <span className="mx-6 sm:mx-10 text-black/50 text-xl">✦</span>
          </div>
        ))}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(50%);
            }
          }
        `}
      </style>
    </section>
  );
}

export default Marquee;
