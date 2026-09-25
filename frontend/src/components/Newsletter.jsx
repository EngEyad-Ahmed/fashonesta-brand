import { useState } from "react";
import { Bell, Mail, Send } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { api } from "../api/client";

function Newsletter() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showToast("من فضلك أدخلي بريداً إلكترونياً صحيحاً", "error");
      return;
    }

    try {
      await api.post("/newsletter", { email: trimmedEmail });
    } catch (err) {
      showToast(err.message || "تعذر الاشتراك، حاولي مرة أخرى", "error");
      return;
    }

    setEmail("");
    showToast("تم الاشتراك في نشرة فاشونيستا بنجاح");
  };

  return (
    <section
      id="newsletter"
      dir="rtl"
      className="relative bg-[#0d0d0d] text-white py-24 sm:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-[100px]" />

        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <div
          className="
            w-16
            h-16
            mx-auto
            mb-6
            rounded-full
            bg-[#D4AF37]/10
            border
            border-[#D4AF37]/40
            flex
            items-center
            justify-center
            text-[#D4AF37]
          "
        >
          <Bell size={26} />
        </div>

        <p className="text-[#D4AF37] text-sm font-medium mb-4">
          نشرة فاشونيستا
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mb-5">
          اشتركي ليصلكِ جديد الموضة
        </h2>

        <p className="text-gray-400 leading-8 mb-9">
          اشتركي في نشرتنا البريدية ليصلكِ أحدث التشكيلات والعروض الحصرية قبل
          الجميع.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <Mail
              size={19}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="اكتبي بريدك الإلكتروني"
              className="
                w-full
                bg-black
                border
                border-white/10
                rounded-xl
                py-4
                pr-12
                pl-4
                outline-none
                text-right
                focus:border-[#D4AF37]
                transition
              "
            />
          </div>

          <button
            type="submit"
            className="
              shrink-0
              px-8
              py-4
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-bold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#C9A227]
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <Send size={18} />
            اشتراك
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-5">
          لن نشارك بريدك مع أي جهة أخرى، ويمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
}

export default Newsletter;