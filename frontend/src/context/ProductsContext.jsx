import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/client";
import { swatchFor } from "../data/products";

const ProductsContext = createContext(null);

function shapeProduct(product) {
  if (!product) return product;

  return {
    ...product,
    gallery: [product.image],
    swatches: Object.fromEntries(
      (product.colors || []).map((color) => [color, swatchFor(color)]),
    ),
    tags: [],
    reviews: [],
  };
}

function deriveFilters(productsList) {
  const categories = [
    "الكل",
    ...new Set(productsList.map((p) => p.category).filter(Boolean)),
  ];
  const types = ["الكل", ...new Set(productsList.map((p) => p.type).filter(Boolean))];

  return { categories, types };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/products?limit=100")
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products.map(shapeProduct));
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getProductById = useCallback(
    async (id) => {
      const numericId = Number(id);
      const local = products.find((p) => p.id === numericId);

      if (local) return local;

      const data = await api.get(`/products/${numericId}`);
      return shapeProduct(data.product);
    },
    [products],
  );

  const getProductByIds = useCallback(
    (ids) => {
      return ids
        .map((id) => products.find((p) => p.id === Number(id)))
        .filter(Boolean);
    },
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      getProductById,
      getProductByIds,
      categories: deriveFilters(products).categories,
      productTypes: deriveFilters(products).types,
    }),
    [products, loading, getProductById, getProductByIds],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }

  return context;
}