import { AppError } from "./error.js";

const PHONE_REGEX = /^01[0-9]{9}$/;

export class ValidationError extends AppError {
  constructor(message) {
    super(422, message);
  }
}

export function cleanString(value, maxLength) {
  const cleaned = String(value == null ? "" : value).trim().slice(0, maxLength);
  return cleaned;
}

export function validateRegisterBody(body) {
  const name = cleanString(body.name, 100);
  const phone = cleanString(body.phone, 20);
  const password = String(body.password == null ? "" : body.password);

  if (name.length < 2) {
    throw new ValidationError("من فضلك اكتبي اسمك بالكامل");
  }

  if (!PHONE_REGEX.test(phone)) {
    throw new ValidationError("رقم الهاتف غير صحيح (مثال: 01000000000)");
  }

  if (password.length < 6) {
    throw new ValidationError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  }

  return { name, phone, password };
}

export function validateLoginBody(body) {
  const phone = cleanString(body.phone, 20);
  const password = String(body.password == null ? "" : body.password);

  if (!PHONE_REGEX.test(phone)) {
    throw new ValidationError("رقم الهاتف غير صحيح (مثال: 01000000000)");
  }

  if (password.length === 0) {
    throw new ValidationError("كلمة المرور مطلوبة");
  }

  return { phone, password };
}

export function validateAddressBody(body) {
  const label = cleanString(body.label, 50) || "منزل";
  const governorate = cleanString(body.governorate, 100);
  const address = cleanString(body.address, 255);

  if (!governorate) {
    throw new ValidationError("المحافظة مطلوبة");
  }

  if (address.length < 5) {
    throw new ValidationError("العنوان غير مكتمل");
  }

  return { label, governorate, address };
}

export function validateReviewBody(body) {
  const text = cleanString(body.text, 1000);
  const rating = Number(body.rating);

  if (!text) {
    throw new ValidationError("نص التقييم مطلوب");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError("التقييم يجب أن يكون من 1 إلى 5");
  }

  return { text, rating };
}

export function validateNewsletterBody(body) {
  const email = cleanString(body.email, 254);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new ValidationError("البريد الإلكتروني غير صحيح");
  }

  return { email };
}

export function validateOrderBody(body) {
  const items = Array.isArray(body.items) ? body.items : [];

  if (items.length === 0) {
    throw new ValidationError("السلة فارغة");
  }

  if (items.length > 50) {
    throw new ValidationError("عدد كبير جداً من الأصناف");
  }

  const subtotal = Number(body.subtotal) || 0;
  const discount = Number(body.discount) || 0;
  const shippingCost = Number(body.shippingCost) || 0;
  const total = Number(body.total) || 0;

  const payment = ["cod", "whatsapp"].includes(body.payment)
    ? body.payment
    : "cod";

  const shipping = body.shipping || {};
  const shippingName = cleanString(shipping.name, 100);
  const shippingPhone = cleanString(shipping.phone, 20);
  const shippingGovernorate = cleanString(shipping.governorate, 100);
  const shippingAddress = cleanString(shipping.address, 255);

  if (!shippingName) {
    throw new ValidationError("اسم المستلم مطلوب");
  }

  if (!PHONE_REGEX.test(shippingPhone)) {
    throw new ValidationError("رقم هاتف الاستلام غير صحيح");
  }

  if (!shippingGovernorate) {
    throw new ValidationError("المحافظة مطلوبة");
  }

  if (shippingAddress.length < 5) {
    throw new ValidationError("العنوان غير مكتمل");
  }

  const validItems = items.map((item) => ({
    productId: Number(item.productId ?? item.id),
    quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 99),
    selectedColor: cleanString(item.selectedColor || item.color, 50) || null,
    selectedSize: cleanString(item.selectedSize || item.size, 20) || null,
  }));

  return {
    items: validItems,
    subtotal,
    discount,
    shippingCost,
    total,
    payment,
    note: cleanString(body.note, 500),
    shipping: {
      name: shippingName,
      phone: shippingPhone,
      governorate: shippingGovernorate,
      address: shippingAddress,
    },
  };
}