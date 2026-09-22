import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Marquee from "./components/Marquee";
import Products from "./components/Products";
import Offers from "./components/Offers";
import WhyFashionista from "./components/WhyFashionista";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Newsletter from "./components/Newsletter";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Account from "./components/Account";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <Marquee />
        <Products />
        <Offers />
        <WhyFashionista />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
        <Newsletter />
      </main>

      <Footer />

      <Cart />
      <Wishlist />
      <Account />
      <Toast />
    </>
  );
}

export default App;