-- ============================================================
-- فاشونيستا للموضة | Fashionista Store
-- قاعدة البيانات + الجداول
-- استيردي هذا الملف من phpMyAdmin ثم استيردي sql/seed.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS fashionista
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fashionista;

-- ------------------------------------------------------------
-- المستخدمون
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id            CHAR(36)      PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  phone         VARCHAR(20)   NOT NULL UNIQUE,
  password_hash VARCHAR(100)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- عناوين المستخدمين
-- ------------------------------------------------------------
DROP TABLE IF EXISTS addresses;
CREATE TABLE addresses (
  id          CHAR(36)      PRIMARY KEY,
  user_id     CHAR(36)      NOT NULL,
  label       VARCHAR(50)   NOT NULL DEFAULT 'منزل',
  governorate VARCHAR(100)  NOT NULL,
  address     VARCHAR(255)  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- المنتجات
-- ------------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)    NOT NULL,
  category        VARCHAR(50)     NOT NULL,
  type            VARCHAR(20)     NOT NULL,
  price           DECIMAL(10,2)   NOT NULL,
  old_price       DECIMAL(10,2)   NULL,
  image           TEXT            NOT NULL,
  description     TEXT            NULL,
  description_long TEXT           NULL,
  rating          DECIMAL(2,1)    NOT NULL DEFAULT 0,
  reviews_count   INT UNSIGNED    NOT NULL DEFAULT 0,
  stock           INT UNSIGNED    NOT NULL DEFAULT 0,
  colors          JSON            NULL,
  sizes           JSON            NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_type (type),
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- الطلبات
-- ------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id                CHAR(20)      PRIMARY KEY,
  user_id           CHAR(36)      NULL,
  guest_id          VARCHAR(50)   NULL,
  status            VARCHAR(20)   NOT NULL DEFAULT 'pending',
  note              TEXT          NULL,
  subtotal          DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount          DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost     DECIMAL(10,2) NOT NULL DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment           VARCHAR(20)   NOT NULL DEFAULT 'cod',
  shipping_name     VARCHAR(100)  NOT NULL,
  shipping_phone    VARCHAR(20)   NOT NULL,
  shipping_governorate VARCHAR(100) NOT NULL,
  shipping_address  VARCHAR(255)  NOT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_guest (guest_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- بنود الطلب
-- ------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       CHAR(20)       NOT NULL,
  product_id     INT UNSIGNED   NULL,
  name           VARCHAR(150)   NOT NULL,
  image          TEXT           NULL,
  category       VARCHAR(50)    NULL,
  type           VARCHAR(20)    NULL,
  price          DECIMAL(10,2)  NOT NULL,
  quantity       INT UNSIGNED   NOT NULL,
  selected_color VARCHAR(50)    NULL,
  selected_size  VARCHAR(20)    NULL,
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE SET NULL,
  INDEX idx_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- تقييمات المنتجات
-- ------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED   NOT NULL,
  user_id     CHAR(36)       NULL,
  name        VARCHAR(100)   NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  text        TEXT           NOT NULL,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL,
  INDEX idx_reviews_product (product_id),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- سلة التسوق (محمولة بالكامل على الخادم)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS carts;
CREATE TABLE carts (
  owner_key  VARCHAR(64)  PRIMARY KEY,
  items      JSON         NOT NULL,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- المفضلة (محمولة بالكامل على الخادم)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS wishlists;
CREATE TABLE wishlists (
  owner_key   VARCHAR(64)                      NOT NULL,
  product_id  INT UNSIGNED                     NOT NULL,
  created_at  DATETIME                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (owner_key, product_id),
  CONSTRAINT fk_wishlists_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE,
  INDEX idx_wishlists_owner (owner_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- مشتركو النشرة البريدية
-- ------------------------------------------------------------
DROP TABLE IF EXISTS newsletter_subscribers;
CREATE TABLE newsletter_subscribers (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(254) NOT NULL UNIQUE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;