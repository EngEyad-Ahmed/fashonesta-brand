import { CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 items-center sm:items-end sm:left-6 sm:translate-x-0 w-[calc(100%-2rem)] sm:w-auto pointer-events-none">
      <style>
        {`
          @keyframes toast-in {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="
            pointer-events-auto
            flex
            items-center
            gap-3
            w-full
            sm:w-auto
            max-w-md
            px-5
            py-4
            rounded-2xl
            bg-[#111111]
            border
            border-[#D4AF37]/40
            text-white
            shadow-2xl
            shadow-black/50
          "
          style={{ animation: "toast-in 300ms ease-out both" }}
        >
          <CheckCircle2
            size={20}
            className={toast.type === "error" ? "text-red-400" : "text-[#D4AF37]"}
          />

          <p className="text-sm font-medium text-right flex-1">{toast.message}</p>

          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => removeToast(toast.id)}
            className="text-white/50 hover:text-[#D4AF37] transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;