export function formatPrice(value) {
  return Number(String(value).replace(/,/g, "")).toLocaleString("en-US");
}

export function parsePrice(value) {
  return Number(String(value).replace(/,/g, ""));
}

export function calcDiscountPercent(price, oldPrice) {
  const p = parsePrice(price);
  const o = parsePrice(oldPrice);
  if (!o || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}