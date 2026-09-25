# فاشونيستا للموضة | Fashionista

متجر إلكتروني متكامل للملابس الحريمي وملابس البنات، بواجهة أمامية (React) وخادم خلفي (Express + MySQL/MariaDB) يحفظ كل البيانات في قاعدة البيانات (لا تخزين محلي في المتصفح).

## بنية المشروع

```
├── frontend/     # تطبيق المتجر (Vite + React + Tailwind CSS)
└── backend/      # خادم API (Node.js + Express + MySQL)
```

## المميزات المنفذة

- كتالوج منتجات كامل مع أقسام (دريسات، بلوزات، سوتات، جيبات، بناطيل) وأنواع (حريمي / بنات)
- فرز الأسعار (الأقل / الأعلى) والبحث الفوري
- صفحة تفاصيل المنتج: معرض صور، مقاسات، ألوان مع دوائر الألوان، الكمية
- تقييمات ومراجعات من اللاتي اشترين (تظهر فوراً)
- منتجات ذات صلة داخل نافذة المنتج
- سلة تسوق جانبية مع أكواد خصم (FASHION10 / FASHION20 / SALE30)
- إتمام الطلب: الدفع عند الاستلام أو الدفع الكامل عبر واتساب
- حساب العميل: تسجيل / دخول / خروج + دفتر عناوين
- سجل طلبات مرتبط بالحساب أو بالضيف
- أقسام إضافية: أسئلة شائعة، نشرة بريدية، تواصل معنا

## التشغيل محلياً

```bash
cd frontend
npm install
npm run dev
```

## البناء للإنتاج

```bash
cd frontend
npm run build
npm run preview
```

## الخادم الخلفي (Backend)

### المتطلبات
- Node.js 18 أو أحدث
- MySQL أو MariaDB مع phpMyAdmin (XAMPP / Laragon)

### 1) إنشاء قاعدة البيانات عبر phpMyAdmin
1. افتح phpMyAdmin على `http://localhost/phpmyadmin`
2. اذهب إلى تبويب **استيراد (Import)**
3. استورد الملف `backend/sql/schema.sql`
4. ثم استورد الملف `backend/sql/seed.sql` (يضيف كتالوج المنتجات — 14 منتجاً)

### 2) ضبط الإعدادات
النسخ من مثال الإعدادات ثم تعديل القيم لتناسب بيئتك:
```bash
cd backend
cp .env.example .env
```
عدّل `DB_USER` و `DB_PASSWORD` حسب إعدادات MySQL لديك، وغيّر `JWT_SECRET` إلى سر عشوائي طويل.

### 3) تشغيل الخادم
```bash
cd backend
npm install
npm run dev        # أو npm start
```
يعمل الخادم افتراضياً على `http://localhost:4000`.

### نطاق الواجهة (API)
```
GET   /api/health                        فحص الحالة
POST  /api/auth/register                 إنشاء حساب  {name, phone, password}
POST  /api/auth/login                    تسجيل الدخول  {phone, password}
GET   /api/auth/me                       بيانات الحساب + العناوين (حماية)
GET   /api/products                      قائمة المنتجات (type, category, q, sort)
GET   /api/products/:id                  تفاصيل المنتج + التقييمات + المقترحات
POST  /api/products/:id/reviews          إضافة تقييم  {rating, text}
GET   /api/orders                        طلبات الحساب (حماية)
POST  /api/orders                        إنشاء طلب (سلة + بيانات الشحن)
POST  /api/account/addresses             إضافة عنوان (حماية)
PUT   /api/account/addresses/:id         تعديل عنوان (حماية)
DELETE /api/account/addresses/:id        حذف عنوان (حماية)
POST  /api/newsletter                    الاشتراك في النشرة البريدية  {email}
```

### الأمان المطبق في الخادم
- تشفير كلمات المرور بـ bcrypt (لا تُخزن كلمة المرور نصاً)
- تسجيل الدخول عبر JWT مع تاريخ انتهاء
- استعلامات مُعلمة (Prepared Statements) تمنع حقن SQL
- تحقق من صحة كل المدخلات (الاسم، رقم الهاتف المصري، كلمة المرور، البريد)
- Helmet لرؤوس الأمان + CORS محدد بالأصول المسموحة فقط
- حماية من التكرار (Rate Limiting) على طرق الدخول والتسجيل (20 محاولة / 15 دقيقة)
- عدم كشف تفاصيل الخطأ في بيئة الإنتاج

## ملاحظات

- جميع البيانات (الدخول، السلة، المفضلة، العناوين، الطلبات، التقييمات، النشرة البريدية) تُحفظ في قاعدة البيانات عبر خادم الـ API — لا يوجد `localStorage`.
- الطلبات ترسل إلى فريق المبيعات عبر واتساب.