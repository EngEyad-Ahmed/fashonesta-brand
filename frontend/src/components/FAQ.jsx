import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "كيف أطلب من فاشونيستا؟",
    answer:
      "اختاري المنتجات التي تناسبك، أضيفيها إلى السلة، ثم اضغطي على 'إتمام الطلب'. سيصلك فريقنا عبر واتساب خلال دقائق لتأكيد الطلب وتفاصيل الشحن.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "نقدم الدفع عند الاستلام للطلبات داخل مصر، بالإضافة إلى إتمام الدفع الكامل عبر واتساب بعد التواصل مع فريق المبيعات واختيار طريقة التحويل المناسبة.",
  },
  {
    question: "كم تبلغ مصاريف الشحن؟",
    answer:
      "تكلفة الشحن 60 جنيهاً لجميع المحافظات، وشحن مجاني لجميع الطلبات التي تتجاوز 1500 جنيهاً.",
  },
  {
    question: "هل يمكن إرجاع المنتج أو استبداله؟",
    answer:
      "نعم، يمكن الاستبدال أو الإرجاع خلال 14 يوماً من الاستلام بشرط أن يكون المنتج بحالته الأصلية دون استخدام، ونتواصل معك لتحديد موعد الاستلام.",
  },
  {
    question: "هل تشحنون لجميع المحافظات؟",
    answer:
      "نعم، نشحن لجميع محافظات مصر، من القاهرة والجيزة والإسكندرية وحتى مطروح وأسوان، خلال 2 إلى 5 أيام عمل.",
  },
  {
    question: "كيف أستخدم كود الخصم؟",
    answer:
      "اكتبي كود الخصم في خانة 'كود الخصم' داخل سلة التسوق واضغطي 'تطبيق'. سيظهر الخصم مباشرة على الإجمالي قبل إتمام الطلب.",
  },
  {
    question: "هل المنتجات متوفرة دائماً؟",
    answer:
      "نحرص على تحديث المخزون يومياً. في حال نفاد القطعة يتم عرض حالة 'متبقي قطع فقط' أو 'غير متوفر' داخل صفحة المنتج.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      dir="rtl"
      className="bg-[#080808] text-white py-24 sm:py-28"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-14">
          <p className="text-[#D4AF37] text-sm font-medium mb-4">
            نساعدك في كل خطوة
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
            الأسئلة الشائعة
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto leading-8">
            جمعنا لك أكثر الأسئلة تكراراً عن الطلبات والشحن والدفع، وإذا لم
            تجدي إجابتك تواصلي معنا مباشرة.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  border
                  rounded-2xl
                  overflow-hidden
                  transition-all
                  duration-500
                  ${
                    isOpen
                      ? "border-[#D4AF37]/40 bg-[#111111]"
                      : "border-white/10 bg-[#0d0d0d] hover:border-white/25"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-right
                    p-5
                    sm:p-6
                  "
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle
                      size={18}
                      className={isOpen ? "text-[#D4AF37]" : "text-gray-500"}
                    />

                    <span className="font-bold text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </span>

                  <ChevronDown
                    size={20}
                    className={`
                      shrink-0
                      transition-all
                      duration-500
                      ${
                        isOpen
                          ? "rotate-180 text-[#D4AF37]"
                          : "text-gray-500"
                      }
                    `}
                  />
                </button>

                <div
                  className={`
                    overflow-hidden
                    transition-all
                    duration-500
                    ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  <p className="px-5 sm:px-6 pb-6 text-gray-400 text-sm leading-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            لم تجدي إجابتك؟{" "}

            <a
              href="#contact"
              className="text-[#D4AF37] font-bold hover:text-[#C9A227] transition-colors"
            >
              تواصلي معنا
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ;