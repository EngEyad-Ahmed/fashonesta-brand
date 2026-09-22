export const coupons = [
  { code: "FASHION10", type: "percent", value: 10 },
  { code: "FASHION20", type: "percent", value: 20 },
  { code: "SALE30", type: "percent", value: 30 },
];

export function getCoupon(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  return coupons.find((c) => c.code === normalized) || null;
}