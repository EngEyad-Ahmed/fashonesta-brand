import { MessageCircle } from "lucide-react";

const whatsappContacts = [
  {
    nameAr: "هاجر",
    nameEn: "Hager",
    number: "201229916690",
    link: "https://wa.me/201229916690",
  },
  {
    nameAr: "صفاء",
    nameEn: "Safaa",
    number: "201279523254",
    link: "https://wa.me/201279523254",
  },
  {
    nameAr: "مودة",
    nameEn: "Mwade",
    number: "201229916695",
    link: "https://wa.me/201229916695",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    symbol: "f",
    link: "https://www.facebook.com/share/165fxh4Fmuu/",
  },
  {
    name: "Instagram",
    symbol: "◎",
    link: "https://www.instagram.com/fashionista7271?igsh=emgyZXk4cHRxM2Nn",
  },
  {
    name: "TikTok",
    symbol: "♪",
    link: "https://www.tiktok.com/@fashionesta_damanhour?_r=1&_t=ZS-98vkJpo3WCu",
  },
];

function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-black text-white relative overflow-hidden"
      dir="rtl"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm tracking-[4px] uppercase">
            Contact Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            تواصلي <span className="text-[#D4AF37]">معنا</span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-8">
            عندك استفسار أو محتاجة مساعدة؟
            <br />
            تواصلي معنا مباشرة عن طريق الواتساب أو صفحاتنا على السوشيال ميديا.
          </p>
        </div>

        {/* WhatsApp Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
            {/* WhatsApp Header */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-[#25D366]" />
              </div>

              <h3 className="text-2xl font-bold">تواصلي معنا عبر واتساب</h3>

              <p className="text-gray-500 text-sm mt-2">WhatsApp Support</p>
            </div>

            {/* WhatsApp Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {whatsappContacts.map((contact) => (
                <a
                  key={contact.number}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    bg-black
                    border border-white/10
                    rounded-2xl
                    p-7
                    text-center
                    hover:border-[#25D366]
                    hover:-translate-y-2
                    transition-all
                    duration-300
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      w-16
                      h-16
                      mx-auto
                      mb-5
                      rounded-full
                      bg-[#25D366]/10
                      flex
                      items-center
                      justify-center
                      group-hover:bg-[#25D366]
                      transition-all
                      duration-300
                    "
                  >
                    <MessageCircle
                      size={30}
                      className="
                        text-[#25D366]
                        group-hover:text-white
                        transition-colors
                      "
                    />
                  </div>

                  {/* Arabic Name */}
                  <h4 className="text-xl font-bold">{contact.nameAr}</h4>

                  {/* English Name */}
                  <p className="text-[#D4AF37] text-sm mt-1">
                    {contact.nameEn}
                  </p>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mt-4">
                    تواصل عبر WhatsApp
                  </p>

                  {/* Number */}
                  <p className="text-gray-600 text-xs mt-2">
                    +{contact.number}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center mt-14">
          <h3 className="text-xl font-bold mb-7">تابعينا على السوشيال ميديا</h3>

          <p className="text-gray-500 text-sm mb-7">
            Follow us on Social Media
          </p>

          <div className="flex justify-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className="
                  w-14
                  h-14
                  rounded-full
                  border border-white/10
                  bg-[#111]
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                  text-white
                  hover:bg-[#D4AF37]
                  hover:text-black
                  hover:border-[#D4AF37]
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                {social.symbol}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            فاشونيستا للموضة — Fashionista
          </p>

          <p className="text-gray-600 text-xs mt-2">
            اختاري إطلالتك... وكوني دايمًا مميزة ✨
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
