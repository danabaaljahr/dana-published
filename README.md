# Dana Baljher — Editorial Newsroom V18.2

منصة تحريرية شخصية ثنائية اللغة، مبنية على GitHub Pages + Supabase.

## ما الجديد
- واجهة رئيسية صحفية حية تحت هوية «دانه بالجهر».
- 8 أقسام تحريرية مستقلة مع بقاء الأرشيف والسلاسل.
- رادار أخبار داخل Studio يفحص المصادر النشطة كل دقيقتين ويرتب الوارد من الأعلى أولوية.
- ترجمة إنجليزية تلقائية للمواد الجديدة، مع مراجعة يدوية اختيارية.
- Push notifications للقراء عند النشر.
- نشرة بريدية حسب اهتمامات القارئ، وإرسالها تلقائيًا عند نشر مادة جديدة بعد ربط Gmail مرة واحدة.
- تنبيهات أخبار الرادار إلى بريد دانه بعد ربط Gmail.
- Gmail App Password يُدخل من Studio ويُحفظ مشفرًا على السيرفر؛ لا تُستخدم كلمة مرور Gmail الأساسية.
- تواصل مباشر: danahfahad.mb@gmail.com وWhatsApp +966 56 348 6820.
- RSS/JSON feed مباشر، sitemap، robots، Open Graph، Twitter Cards، canonical URLs وSchema.org للمقالات.
- سياسة تحرير وتصحيح وخصوصية، ومواد مقترحة بعد القراءة، ووقت آخر تحديث، ودعم prefers-reduced-motion والتركيز بالكيبورد.

## النشر
ارفع محتويات هذا المجلد إلى جذر GitHub Pages واستبدل الملفات القديمة كلها.

## خطوة Gmail الوحيدة
بعد رفع V18.2: افتح `studio.html` → الإعدادات → البريد والتنبيهات، وأدخل Gmail App Password مخصصًا للموقع ثم اضغط «ربط Gmail» و«إرسال اختبار». بعد نجاح الاختبار لا تحتاج لإرسال النشرات أو تنبيهات الرادار يدويًا.

## URLs
- Public: https://danabaaljahr.github.io/dana-published/
- Studio: https://danabaaljahr.github.io/dana-published/studio.html
- RSS: https://vffsndkoaswcnnlzpvuu.supabase.co/functions/v1/public-feed


## V18.3 — PDF provenance + DeepL preference
- Added branded PDF export for every individual editorial material.
- Repeating Dana Baljher identity header/footer on printed PDF pages.
- QR code points to the exact canonical story URL, not only the homepage.
- Visible source URL, copyright notice and subtle watermark inside exported PDFs.
- DeepL marked as the recommended translation provider and remains first-priority when its API key is connected.
