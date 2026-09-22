const palette = {
  أسود: "#1a1a1a",
  أبيض: "#f5f5f5",
  بيج: "#c9b79c",
  "بيج لامع": "#d9c7a5",
  بني: "#6f4e37",
  أزرق: "#2b5b84",
  وردي: "#f4b6c2",
  أصفر: "#f2c14e",
  "أصفر فاتح": "#f7dc8f",
  أحمر: "#b03030",
  رمادي: "#7d8590",
  موف: "#8b5fbf",
  نبيتي: "#5a1f2e",
  أخضر: "#4c7a3d",
  "أخضر منقوش": "#4c7a3d",
  "أسود في أبيض": "#d9d9d9",
  "أبيض في أسود": "#3a3a3a",
  "أبيض وموف": "#cdb6e8",
  "متعدد الألوان": "#e0c56f",
  "تريكو ليوبارد": "#b08968",
};

export function swatchFor(color) {
  return palette[color] || "#9ca3af";
}

const rawProducts = [
  {
    id: 1,
    name: "فستان أنيق",
    category: "دريسات",
    type: "حريمي",
    price: "850",
    oldPrice: "1,050",
    image: "https://i.ibb.co/zT3SR3hw/c978b042-78af-46eb-95b5-151fdfd681ad.jpg",
    colors: ["أسود في أبيض", "أبيض في أسود"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "فستان أنيق بتصميم عصري يجمع بين البساطة والفخامة، مناسب للخروجات والمناسبات المختلفة.",
    descriptionLong:
      "فستان أنيق بتصميم عصري يجمع بين البساطة والفخامة. قماش فاخر يمنحك إطلالة مريحة وأنيقة في نفس الوقت، مناسب للخروجات والمناسبات المختلفة، ومتوفر بعدة مقاسات تناسب جميع الأجسام.",
    rating: 4.8,
    reviewsCount: 132,
    stock: 18,
  },
  {
    id: 2,
    name: "بلوزة كلاسيكية",
    category: "بلوزات",
    type: "حريمي",
    price: "450",
    oldPrice: "550",
    image: "https://i.ibb.co/jSyJNs2/eb9dffea-c0fc-4c70-acb9-65e87881b236.jpg",
    colors: ["أخضر منقوش", "أبيض", "أسود"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "بلوزة كلاسيكية بتفاصيل ناعمة وقصة مريحة، مناسبة للإطلالات اليومية والكاجوال.",
    descriptionLong:
      "بلوزة كلاسيكية بتفاصيل ناعمة وقصة مريحة، مناسبة للإطلالات اليومية والكاجوال. خامة قطنية تسمح بالتهوية مع قصّة أنيقة تخفي أي عيوب وتمنحك إطلالة راقية.",
    rating: 4.6,
    reviewsCount: 95,
    stock: 24,
  },
  {
    id: 3,
    name: "سوت أنيق",
    category: "سوتات",
    type: "حريمي",
    price: "1,150",
    oldPrice: "1,400",
    image: "https://i.ibb.co/fGVy20Lm/633eb9c2-a861-4c15-b609-b26cf0d78af7.jpg",
    colors: ["متعدد الألوان", "وردي", "أبيض"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "سوت أنيق بتصميم راقي يمنحك إطلالة مميزة ومتناسقة في المناسبات والخروجات.",
    descriptionLong:
      "سوت أنيق بتصميم راقي يمنحك إطلالة مميزة ومتناسقة في المناسبات والخروجات. مصنوع من خامات عالية الجودة مع تفاصيل دقيقة تضمن لك إطلالة موحدة وجذابة دون عناء التنسيق.",
    rating: 4.7,
    reviewsCount: 118,
    stock: 12,
  },
  {
    id: 4,
    name: "جيبة عصرية",
    category: "جيبات",
    type: "حريمي",
    price: "550",
    oldPrice: "700",
    image: "https://i.ibb.co/ch5jw52Z/eca7049d-d66c-48db-b272-8b810947ef22.jpg",
    colors: ["أسود", "بني", "بيج"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "جيبة عصرية بقصة أنيقة يمكن تنسيقها مع العديد من البلوزات للحصول على إطلالة مختلفة.",
    descriptionLong:
      "جيبة عصرية بقصة أنيقة يمكن تنسيقها مع العديد من البلوزات للحصول على إطلالة مختلفة كل مرة. خامة مريحة لا تتجعد بسهولة وسهلة التنظيف.",
    rating: 4.5,
    reviewsCount: 74,
    stock: 21,
  },
  {
    id: 5,
    name: "بنطلون أنيق",
    category: "بناطيل",
    type: "حريمي",
    price: "650",
    oldPrice: "800",
    image: "https://i.ibb.co/mr8J7w2B/f005e7dc-3ad3-4994-96f9-20cfcadc74d2.jpg",
    colors: ["أسود", "أزرق", "بيج"],
    sizes: ["S", "M", "L", "XL"],
    description: "بنطلون أنيق بخامة مريحة وتصميم عصري مناسب للإطلالات اليومية.",
    descriptionLong:
      "بنطلون أنيق بخامة مريحة وتصميم عصري مناسب للإطلالات اليومية والعمل. قصة مدروسة تمنحك حرية الحركة مع مظهر أنيق طوال اليوم.",
    rating: 4.4,
    reviewsCount: 61,
    stock: 15,
  },
  {
    id: 6,
    name: "فستان صيفي",
    category: "دريسات",
    type: "حريمي",
    price: "750",
    oldPrice: "900",
    image: "https://i.ibb.co/9mPbvxRw/52d91c6d-8a84-4a02-82a9-0ed27965e241.jpg",
    colors: ["أبيض", "وردي", "أزرق"],
    sizes: ["S", "M", "L"],
    description:
      "فستان صيفي خفيف ومريح بتصميم أنثوي مناسب للأيام الصيفية والخروجات.",
    descriptionLong:
      "فستان صيفي خفيف ومريح بتصميم أنثوي مناسب للأيام الصيفية والخروجات الشاطئية. قماش خفيف ينفّس الحرارة ويجف سريعًا ليظل مريحًا في الحر.",
    rating: 4.7,
    reviewsCount: 88,
    stock: 9,
  },
  {
    id: 7,
    name: "بلوزة ناعمة",
    category: "بلوزات",
    type: "حريمي",
    price: "400",
    oldPrice: "500",
    image: "https://i.ibb.co/MxtZ4gPW/72ec35fa-93cb-49b3-bc0e-8dc504296662.jpg",
    colors: ["أصفر فاتح", "أبيض", "بيج"],
    sizes: ["S", "M", "L", "XL"],
    description: "بلوزة ناعمة بتصميم بسيط وأنيق يمكن ارتداؤها في العديد من المناسبات.",
    descriptionLong:
      "بلوزة ناعمة بتصميم بسيط وأنيق يمكن ارتداؤها في العديد من المناسبات اليومية. خامة ناعمة على البشرة ومقاومة للتقلص بعد الغسيل.",
    rating: 4.3,
    reviewsCount: 52,
    stock: 30,
  },
  {
    id: 8,
    name: "سوت بناتي",
    category: "سوتات",
    type: "بنات",
    price: "550",
    oldPrice: "700",
    image: "https://i.ibb.co/hRvP53DF/f34c9b65-2b20-4405-989a-00e229cd2a1f.jpg",
    colors: ["أبيض وموف", "موف", "أبيض"],
    sizes: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"],
    description:
      "سوت بناتي لطيف ومريح بتصميم عصري مناسب للإطلالات اليومية والمناسبات.",
    descriptionLong:
      "سوت بناتي لطيف ومريح بتصميم عصري مناسب للإطلالات اليومية والمناسبات العائلية. خامة ناعمة آمنة على بشرة الأطفال وسهلة في الغسيل.",
    rating: 4.9,
    reviewsCount: 143,
    stock: 20,
  },
  {
    id: 9,
    name: "بلوزة بناتي",
    category: "بلوزات",
    type: "بنات",
    price: "350",
    oldPrice: "450",
    image: "https://i.ibb.co/bgRCD6nf/29a13e4b-45af-4ec2-ab60-4eecd3e21143.jpg",
    colors: ["وردي", "أصفر", "أبيض"],
    sizes: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"],
    description: "بلوزة بناتي بتصميم رقيق وألوان جميلة تناسب إطلالات البنات.",
    descriptionLong:
      "بلوزة بناتي بتصميم رقيق وألوان جميلة تناسب إطلالات البنات الصغار في الحفلات واليوميات. خامة ناعمة لا تسبب حساسية للبشرة.",
    rating: 4.8,
    reviewsCount: 109,
    stock: 27,
  },
  {
    id: 10,
    name: "فستان مميز",
    category: "دريسات",
    type: "حريمي",
    price: "950",
    oldPrice: "1,200",
    image: "https://i.ibb.co/8DGRy0H3/097b0a30-6c29-4344-92d2-76931d5167c5.jpg",
    colors: ["أصفر", "أسود", "أحمر", "بيج"],
    sizes: ["S", "M", "L", "XL"],
    description: "فستان مميز بتصميم أنيق وتفاصيل جذابة لإطلالة أكثر فخامة.",
    descriptionLong:
      "فستان مميز بتصميم أنيق وتفاصيل جذابة لإطلالة أكثر فخامة في أمسياتك الخاصة. تفاصيل مطرزة بدقة وخياطة متقنة تضيف لمسة من الرقي.",
    rating: 4.6,
    reviewsCount: 127,
    stock: 11,
  },
  {
    id: 11,
    name: "بنطلون كلاسيك",
    category: "بناطيل",
    type: "حريمي",
    price: "700",
    oldPrice: "850",
    image: "https://i.ibb.co/s9M0msBk/af5f912b-c8d4-4e75-94eb-6ef9e9a13131.jpg",
    colors: ["أسود", "رمادي", "بيج"],
    sizes: ["S", "M", "L", "XL"],
    description: "بنطلون كلاسيك بقصة أنيقة وخامة مريحة مناسب للعمل والخروجات.",
    descriptionLong:
      "بنطلون كلاسيك بقصة أنيقة وخامة مريحة مناسب للعمل والخروجات. تصميم خالد لا يخرج عن الموضة مهما تغيرت الصيحات مع متانة تدوم لسنوات.",
    rating: 4.5,
    reviewsCount: 83,
    stock: 14,
  },
  {
    id: 12,
    name: "سوت بناتي أنيق",
    category: "سوتات",
    type: "بنات",
    price: "600",
    oldPrice: "750",
    image: "https://i.ibb.co/5xjCNFmw/49730ea1-89bc-4989-b956-d8987997bb3e.jpg",
    colors: ["تريكو ليوبارد", "بني", "بيج"],
    sizes: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"],
    description: "سوت بناتي أنيق يجمع بين الراحة والتصميم الجميل لإطلالة مميزة.",
    descriptionLong:
      "سوت بناتي أنيق يجمع بين الراحة والتصميم الجميل لإطلالة مميزة في المناسبات العائلية والصور التذكارية وأعياد الميلاد.",
    rating: 4.9,
    reviewsCount: 156,
    stock: 16,
  },
  {
    id: 13,
    name: "بلوزة فاخرة",
    category: "بلوزات",
    type: "حريمي",
    price: "500",
    oldPrice: "650",
    image: "https://i.ibb.co/JRTDkLZm/c33441ec-b6a2-4f7e-94c5-8d46c07a8e15.jpg",
    colors: ["بيج لامع", "أسود", "نبيتي"],
    sizes: ["S", "M", "L", "XL"],
    description: "بلوزة فاخرة بتفاصيل أنيقة مناسبة للإطلالات الراقية والمناسبات.",
    descriptionLong:
      "بلوزة فاخرة بتفاصيل أنيقة مناسبة للإطلالات الراقية والمناسبات. لمعان خفيف يخطف الأنظار مع قصّة تناسب مختلف أنواع الأجسام.",
    rating: 4.7,
    reviewsCount: 91,
    stock: 10,
  },
  {
    id: 14,
    name: "جيبة أنيقة",
    category: "جيبات",
    type: "حريمي",
    price: "600",
    oldPrice: "750",
    image: "https://i.ibb.co/ynDTLXBQ/23c91635-8df9-4f6a-9af3-4415f4f3dcb9.jpg",
    colors: ["أسود", "بيج", "بني"],
    sizes: ["S", "M", "L", "XL"],
    description: "جيبة أنيقة بقصة عصرية سهلة التنسيق مع مختلف الإطلالات.",
    descriptionLong:
      "جيبة أنيقة بقصة عصرية سهلة التنسيق مع مختلف الإطلالات من بلوزة كلاسيك إلى توب كاجوال. خامة ثقيلة قليلاً تمنحها وقفة راقية.",
    rating: 4.4,
    reviewsCount: 59,
    stock: 19,
  },
];

function buildReviews(product) {
  return [
    {
      name: "مريم عادل",
      rating: 5,
      date: "2026-08-12",
      text: `"${product.name}" وصلني زي الصور بالظبط، الخامة تحفة والتغليف راقي جداً.`,
    },
    {
      name: "آية خالد",
      rating: 4,
      date: "2026-07-30",
      text: "قطعة جميلة وألوانها هادية ومريحة، بس أنصح باختيار مقاس أكبر شوية لو بين المقاسات.",
    },
    {
      name: "سارة منى",
      rating: 5,
      date: "2026-06-18",
      text: "أكتر حاجة عجبتني الجودة مقابل السعر، صراحة تستاهل وأكيد هطلب تاني.",
    },
  ];
}

export const products = rawProducts.map((product, index) => ({
  ...product,
  gallery: [product.image],
  swatches: Object.fromEntries(
    product.colors.map((color) => [color, swatchFor(color)]),
  ),
  reviews: buildReviews(product),
  tags: [product.category, product.type, index % 2 === 0 ? "الأكثر مبيعاً" : "جديد"],
}));

export const categories = ["الكل", "دريسات", "بلوزات", "سوتات", "جيبات", "بناطيل"];

export const productTypes = ["الكل", "حريمي", "بنات"];

export function getProductById(id) {
  return products.find((p) => p.id === Number(id)) || null;
}

export function getRelatedProducts(product, count = 4) {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const sameType = products.filter(
    (p) => p.id !== product.id && p.type === product.type && p.category !== product.category,
  );
  return [...sameCategory, ...sameType].slice(0, count);
}