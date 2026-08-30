# دانه بالجهر — Editorial Portfolio + Dana Studio

نسخة جاهزة للرفع مباشرة على GitHub Pages، بواجهة قراء مستقلة ولوحة إدارة خاصة مرتبطة بـSupabase.

## واجهة القراء
- الصفحة الرئيسية مختصرة ومقسمة حسب الوظيفة، من دون تكرار نفس المادة كبطاقة كاملة في أكثر من موضع.
- صفحات مستقلة: `archive.html`، `news.html`، `reports.html`، `essays.html`، `experience.html`، `data.html`.
- 38 مادة منشورة حاليًا، تشمل الأرشيف الأساسي وسلسلة «ما لا يراه القارئ» بخمسة مقالات.
- العربية والإنجليزية تشملان واجهة الموقع **ونصوص المواد كاملة**، مع ترجمة الإحصاءات ونتائج التجربة.
- Light / Dark، بحث من بداية كلمات العنوان، حفظ محلي، «فاجئني»، وضع تركيز، تقدم القراءة، مشاركة، السابق/التالي.
- A− / 100% / A+ لتغيير حجم الواجهة كاملة مع حفظ اختيار القارئ.
- انتقالات خفيفة فقط؛ لا View Transitions أو Tilt أو مؤثرات تمنع النقرة أو تؤخر التنقل.

## Dana Studio
- `studio.html` غير مرتبط من واجهة القراء وممنوع من الفهرسة.
- تسجيل دخول Passwordless عبر Supabase.
- الـCMS هو المصدر الأساسي بعد التهيئة الأولى؛ الحذف والمسودات والتعديلات لا تعيدها النسخة الثابتة تلقائيًا.
- نشر خبر/تقرير/مقال/تجربة، حفظ مسودة، تعديل وحذف.
- رفع صورة من الجهاز بالنقر أو السحب والإفلات، معاينة، استبدال وحذف قبل النشر.
- حقول اختيارية للنسخة الإنجليزية؛ المادة الجديدة لا تظهر للقراء في English إلا إذا كان عنوانها ونصها الإنجليزيان مكتملين.
- التحليلات: زيارات الصفحات، الزوار، الجلسات، قراءات المواد، الوصول إلى 50% و90%، متوسط زمن القراءة، معدل الإكمال، الصفحات/جلسة، الارتداد التقريبي، المشاركات، الحفظ، البحث، الأجهزة والمصادر.

## GitHub Pages
ارفع **محتويات هذا المجلد نفسها** إلى جذر مستودع `dana-published`. ملف `.nojekyll` موجود، ولا يوجد npm أو build step.

إعداد Supabase الخاص بـSite URL وRedirect URL تم تصميم الموقع على أساس:
- `https://danabaaljahr.github.io/dana-published/`
- `https://danabaaljahr.github.io/dana-published/studio.html`


## Editorial Series (V13)
- Studio now supports unlimited independent editorial series.
- Any news item, report, essay, or training piece can remain standalone or be assigned to a series with an explicit order.
- Readers get a dedicated Series index, an ordered series page, and in-article previous/next navigation.
- The initial series is «ما لا يراه القارئ» with five essays in the author-approved order.

## V15 — Final audited build
- CMS articles and series load in parallel, with a safe local fallback only when the CMS cannot be reached.
- Uploaded series/article media is rendered from Supabase in reader-facing cards/pages.
- Published/draft state from the CMS remains authoritative when Supabase responds.
- Final automated audit: 359/359 static checks passed, plus content, JavaScript, CSS, and live Supabase-state verification.


V17: fixed Supabase public REST authentication to use the project's current publishable key (not the legacy anon JWT), preventing false Public check 401 errors and allowing live CMS/image data to reach reader pages.
