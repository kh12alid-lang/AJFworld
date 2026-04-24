# دليل نشر موقع AJworld

## المتطلبات

- Node.js 20+
- npm أو yarn
- حساب على Netlify أو Vercel

## خطوات النشر

### 1. بناء المشروع

```bash
# تثبيت التبعيات
npm install

# بناء المشروع للإنتاج
npm run build
```

### 2. النشر على Netlify

#### الطريقة الأولى: عبر واجهة الويب
1. اذهب إلى [Netlify](https://www.netlify.com/)
2. سجل الدخول أو أنشئ حساب جديد
3. اضغط على "Add new site" → "Deploy manually"
4. اسحب مجلد `dist` أو ارفعه
5. احصل على الرابط: `https://ajworld.netlify.app`

#### الطريقة الثانية: عبر CLI
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# نشر الموقع
netlify deploy --prod --dir=dist
```

### 3. النشر على Vercel

#### الطريقة الأولى: عبر واجهة الويب
1. اذهب إلى [Vercel](https://vercel.com/)
2. سجل الدخول باستخدام GitHub
3. اضغط على "Add New Project"
4. ارفع المشروع أو اربطه بـ GitHub
5. اضغط على "Deploy"

#### الطريقة الثانية: عبر CLI
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# نشر الموقع
vercel --prod
```

### 4. ربط الدومين الخاص

#### على Netlify:
1. اذهب إلى "Domain settings"
2. اضغط على "Add custom domain"
3. أدخل: `ajworld.ae`
4. اتبع خطوات إعداد DNS

#### على Vercel:
1. اذهب إلى "Settings" → "Domains"
2. أدخل: `ajworld.ae`
3. اتبع خطوات إعداد DNS

### 5. إعداد DNS

أضف هذه السجلات في لوحة تحكم الدومين:

```
Type: A
Name: @
Value: 75.2.60.5 (Netlify) أو 76.76.21.21 (Vercel)

Type: CNAME
Name: www
Value: ajworld.netlify.app (أو cname.vercel-dns.com)
```

### 6. إعداد SSL/HTTPS

#### Netlify:
- SSL تلقائي مجاني عبر Let's Encrypt
- اذهب إلى "Domain settings" → "HTTPS"
- تأكد من تفعيل "Force HTTPS"

#### Vercel:
- SSL تلقائي مجاني
- اذهب إلى "Settings" → "Domains"
- تأكد من تفعيل HTTPS

### 7. إعداد البيئة

أنشئ ملف `.env` من `.env.example`:

```bash
cp .env.example .env
```

عدل المتغيرات حسب إعداداتك.

### 8. إعداد API

للربط مع الخادم الخلفي:

1. قم بإعداد خادم API على `https://api.ajworld.ae`
2. تأكد من إعداد CORS
3. أضف متغير البيئة `VITE_API_URL`

### 9. اختبار الموقع

بعد النشر، تأكد من:
- [ ] الصفحة الرئيسية تعمل
- [ ] المنتجات تظهر
- [ ] السلة تعمل
- [ ] الدفع يعمل
- [ ] لوحة التحكم تعمل
- [ ] HTTPS يعمل
- [ ] الدومين مربوط

### 10. تحسين الأداء

#### تفعيل CDN:
- Netlify: CDN تلقائي
- Vercel: CDN تلقائي

#### ضغط الصور:
```bash
# استخدم أدوات ضغط الصور
npx imagemin-cli "src/assets/images/*" --out-dir="dist/images"
```

#### تحليل الحزمة:
```bash
npm run analyze
```

## استكشاف الأخطاء

### مشكلة: الموقع لا يعمل
```bash
# تأكد من بناء المشروع
npm run build

# تحقق من الملفات
cd dist && ls -la
```

### مشكلة: API لا يعمل
- تأكد من إعداد `VITE_API_URL`
- تحقق من CORS على الخادم

### مشكلة: الصور لا تظهر
- تأكد من المسارات
- تحقق من أحجام الملفات

## دعم

للمساعدة، تواصل معنا:
- البريد: support@ajworld.ae
- الواتساب: +971501234567
