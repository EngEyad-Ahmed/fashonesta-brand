import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);

    return () => clearTimeout(timer);
  }, []);

  const featured = products.slice(0, 8);

  return (
    <section
      id="featured-products"
      dir="rtl"
      className="bg-[#080808] text-white py-24 sm:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className={`
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-6
            mb-12
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
          <div>
            <p className="text-[#D4AF37] text-sm font-medium mb-4">
              تشكيلة فاشونيستا
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
              منتجات مميزة
            </h2>

            <p className="text-gray-400 max-w-2xl leading-8">
              اختاري من تشكيلتنا المتنوعة من ملابس الحريمي وملابس البنات.
              لتصفح كل المنتجات والفلاتر اضغطي على "كل المنتجات".
            </p>
          </div>

          <Link
            to="/products"
            className="
              group
              shrink-0
              min-w-[200px]
              inline-flex
              items-center
              justify-center
              gap-3
              px-8
              py-4
              border
              border-[#D4AF37]
              text-[#D4AF37]
              rounded-lg
              font-bold
              hover:bg-[#D4AF37]
              hover:text-black
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            كل المنتجات
            <ArrowLeft
              size={19}
              className="transition-transform duration-300 group-hover:-translate-x-1.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;