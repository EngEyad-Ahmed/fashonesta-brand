import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Marquee from "./components/Marquee";
import FeaturedProducts from "./components/FeaturedProducts";
import Offers from "./components/Offers";
import WhyFashionista from "./components/WhyFashionista";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Newsletter from "./components/Newsletter";
import ProductsPage from "./components/ProductsPage";
import ProductPage from "./components/ProductPage";
import AccountPage from "./components/AccountPage";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Account from "./components/Account";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <Marquee />
      <FeaturedProducts />
      <Offers />
      <WhyFashionista />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
      <Newsletter />
    </main>
  );
}

function NotFoundPage() {
  return (
    <div dir="rtl" className="bg-[#080808] text-white min-h-screen pt-40 pb-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-[#D4AF37] mb-4">404</h1>

        <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>

        <p className="text-gray-400 leading-8 mb-8">
          لم نعثر على الصفحة التي تبحثين عنها.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#C9A227] transition-colors duration-300"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function AutoScroll() {
  const location = useLocation();
  const scrollTo = location.state?.scrollTo;

  useEffect(() => {
    if (scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTo);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);

      return () => clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.search, scrollTo]);

  return null;
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />

      <Cart />
      <Wishlist />
      <Account />
      <Toast />
      <AutoScroll />
    </>
  );
}

export default App;