import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <WishlistProvider>
              <ProductsProvider>
                <SearchProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </SearchProvider>
              </ProductsProvider>
            </WishlistProvider>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>,
);