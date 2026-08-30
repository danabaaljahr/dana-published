# دانه بالجهر — Editorial Portfolio + Dana Studio

نسخة جاهزة للرفع مباشرة على GitHub Pages، بواجهة قراء مستقلة ولوحة إدارة خاصة مرتبطة بـSupabase.

## واجهة القراء
- الصفحة الرئيسية مختصرة ومقسمة حسب الوظيفة، من دون تكرار نفس المادة كبطاقة كاملة في أكثر من موضع.
- صفحات مستقلة: `archive.html`، `news.html`، `reports.html`، `essays.html`، `experience.html`، `data.html`.
- 33 مادة أصلية كاملة: 7 أخبار، 11 تقريرًا، 14 مقالًا، وتجربة تدريبية واحدة.
- العربية والإنجليزية تشملان واجهة الموقع **ونصوص المواد كاملة**، مع ترجمة الإحصاءات ونتائج التجربة.
- Light / Dark، بحث من بداية كلمات العنوان، حفظ محلي، «فاجئني»، وضع تركيز، تقدم القراءة، مشاركة، السابق/التالي.
- A− / 100% / A+ لتغيير حجم الواجهة كاملة مع حفظ اختيار القارئ.
- انتقالات خفيفة فقط؛ لا View Transitions أو Tilt أو مؤثرات تمنع النقرة أو تؤخر التنقل.

## Dana Studio
- `studio.html` غير مرتبط من واجهة القراء وممنوع من الفهرسة.
- تسجيل دخول Passwordless عبر Supabase.
- عند أول دخول للنسخة الجديدة، تُنقل المواد الـ33 المضمنة تلقائيًا إلى CMS إذا لم تكن موجودة، وبذلك تُحسب ضمن المنشورات وتظهر في إدارة المواد والتحليلات.
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
