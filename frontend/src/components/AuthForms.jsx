import { useState } from "react";
import { Lock, Phone, Sparkles, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DEMO_PHONE, DEMO_PASSWORD } from "../data/demo";

function AuthForms({ onSuccess }) {
  const { register, login } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login({
      phone: form.phone,
      password: form.password,
    });

    if (result.ok) {
      showToast("تم تسجيل الدخول بنجاح");
      if (onSuccess) onSuccess();
    } else {
      showToast(result.error, "error");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }

    const result = register({
      name: form.name,
      phone: form.phone,
      password: form.password,
    });

    if (result.ok) {
      showToast(`تم إنشاء حسابك، أهلاً بك ${form.name.trim()}`);
      if (onSuccess) onSuccess();
    } else {
      showToast(result.error, "error");
    }
  };

  const handleDemoLogin = () => {
    const result = login({
      phone: DEMO_PHONE,
      password: DEMO_PASSWORD,
    });

    if (result.ok) {
      showToast("تم الدخول بالحساب التجريبي — كل البيانات معبأة مسبقاً");
      if (onSuccess) onSuccess();
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`
            py-2.5
            rounded-lg
            text-sm
            font-bold
            transition-all
            duration-300
            ${
              mode === "login"
                ? "bg-[#D4AF37] text-black"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          تسجيل الدخول
        </button>

        <button
          type="button"
          onClick={() => setMode("register")}
          className={`
            py-2.5
            rounded-lg
            text-sm
            font-bold
            transition-all
            duration-300
            ${
              mode === "register"
                ? "bg-[#D4AF37] text-black"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          حساب جديد
        </button>
      </div>

      {/* Demo Account */}
      <button
        type="button"
        onClick={handleDemoLogin}
        className="
          w-full
          mb-6
          py-3.5
          rounded-xl
          border
          border-dashed
          border-[#D4AF37]/50
          bg-[#D4AF37]/5
          text-[#D4AF37]
          font-bold
          text-sm
          flex
          items-center
          justify-center
          gap-2
          hover:bg-[#D4AF37]/15
          hover:border-[#D4AF37]
          transition-all
          duration-300
        "
      >
        <Sparkles size={17} />
        جرّبي الحساب التجريبي (بيانات وعناوين وطلبات جاهزة)
      </button>

      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              رقم الهاتف
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3.5
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-bold
              hover:bg-[#C9A227]
              transition-all
              duration-300
            "
          >
            تسجيل الدخول
          </button>

          <p className="text-center text-xs text-gray-500">
            أو اطلبي كضيفة دون إنشاء حساب
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              الاسم بالكامل
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="اكتبي اسمك بالكامل"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              رقم الهاتف
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="6 أحرف على الأقل"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              تأكيد كلمة المرور
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />

              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="أعيدي كتابة كلمة المرور"
                className="
                  w-full
                  bg-black
                  border border-white/10
                  rounded-xl
                  py-3.5 pr-11 pl-4
                  outline-none
                  focus:border-[#D4AF37]
                  transition
                "
              />
            </div>
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3.5
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-bold
              hover:bg-[#C9A227]
              transition-all
              duration-300
            "
          >
            إنشاء الحساب
          </button>
        </form>
      )}

      {/* Demo Hint */}
      <p className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-gray-600">
        بيانات الحساب التجريبي: {DEMO_PHONE} / {DEMO_PASSWORD}
      </p>
    </div>
  );
}

export default AuthForms;