import { useEffect } from "react";
import { User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForms from "./AuthForms";

function Account() {
  const { currentUser, isAuthOpen, closeAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAuthOpen]);

  if (!isAuthOpen) return null;

  const handleSuccess = () => {
    closeAuth();
    navigate("/account");
  };

  return (
    <div
      dir="rtl"
      className="
        fixed
        inset-0
        z-[210]
        bg-black/80
        backdrop-blur-md
        flex
        items-start
        justify-center
        p-4
        sm:p-6
        overflow-y-auto
        animate-modalBackground
      "
      onClick={closeAuth}
    >
      <div
        className="
          w-full
          max-w-lg
          bg-[#111111]
          border
          border-white/10
          rounded-2xl
          overflow-hidden
          shadow-2xl
          my-8
          animate-productModal
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
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
              <User size={19} />
            </div>

            <div>
              <h2 className="font-bold">حسابي</h2>

              <p className="text-xs text-gray-500">
                {currentUser
                  ? `مرحباً ${currentUser.name} — سيتم تحويلك لصفحة حسابك`
                  : "سجلي الدخول أو أنشئي حساباً"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuth}
            aria-label="إغلاق"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              text-white/60
              hover:bg-[#D4AF37]
              hover:text-black
              transition-all
              duration-300
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <AuthForms onSuccess={handleSuccess} />
        </div>

        {/* Footer Note */}
        <div className="p-5 border-t border-white/10">
          <p className="text-center text-xs text-gray-600">
            بياناتك محفوظة بأمان على الخادم
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;