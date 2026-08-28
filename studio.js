(() => {
  'use strict';
  const URL = 'https://vffsndkoaswcnnlzpvuu.supabase.co';
  const KEY = 'sb_publishable_VdtvaVY0ph621QwYpFnjpw_8ukceobx';
  const OWNER = 'danahfahad.mb@gmail.com';
  const sb = window.supabase.createClient(URL, KEY, {auth:{persistSession:true,detectSessionInUrl:true}});
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const login=$('#studioLogin'), app=$('#studioApp'), content=$('#studioContent'), nav=$('#studioNav'), sectionLabel=$('#currentSection');
  const sectionNames={dashboard:'نظرة عامة',compose:'مادة جديدة',content:'إدارة المواد',analytics:'التحليلات'};
  let currentView='dashboard', analyticsDays=30, chartRaf=0, editingId=null;
  let localArticles=[];
  const bundledArticles=Array.isArray(window.ARTICLES)?window.ARTICLES:[];

  const fallback={news:'assets/covers/default-news.svg',report:'assets/covers/default-report.svg',article:'assets/covers/default-article.svg',training:'assets/covers/default-training.svg'};
  const typeLabel={news:'خبر',report:'تقرير',article:'مقال',training:'تجربة تدريبية'};
  function toast(msg){const el=$('#studioToast');el.textContent=msg;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function n(v){return Number(v||0).toLocaleString('ar-SA')}
  function fmtDate(d){if(!d)return '—';return new Intl.DateTimeFormat('ar-SA',{year:'numeric',month:'short',day:'numeric'}).format(new Date(d))}
  function pctChange(cur,prev){cur=+cur||0;prev=+prev||0;if(!prev)return cur?'+100%':'0%';const p=((cur-prev)/prev)*100;return `${p>=0?'+':''}${p.toFixed(1)}%`}
  function slugify(title){const latin=String(title).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,70);return latin || `story-${Date.now().toString(36)}`}
  function excerptFrom(body){return String(body||'').replace(/\s+/g,' ').trim().slice(0,190)}
  function saudiDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
  async function isAdmin(){const {data}=await sb.from('admin_users').select('user_id').maybeSingle();return !!data}
  async function ensureOwner(){const {data:{user}}=await sb.auth.getUser();if(!user)return false;if((user.email||'').toLowerCase()!==OWNER){await sb.auth.signOut();throw new Error('هذا البريد غير مصرح له بالدخول.')}if(await isAdmin())return true;const {error}=await sb.rpc('claim_owner');if(error)throw error;return true}

  async function init(){
    $('#todayLabel').textContent=new Intl.DateTimeFormat('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date());
    const {data:{session}}=await sb.auth.getSession();
    if(session){try{await enterStudio()}catch(e){showLogin(e.message)}} else showLogin();
    sb.auth.onAuthStateChange(async(event,session)=>{if(session&&['SIGNED_IN','INITIAL_SESSION'].includes(event)){try{await enterStudio()}catch(e){showLogin(e.message)}}});
    bindStatic();
  }
  function showLogin(msg=''){login.hidden=false;app.hidden=true;if(msg)$('#loginStatus').textContent=msg}
  async function enterStudio(){await ensureOwner();login.hidden=true;app.hidden=false;content.innerHTML='<div class="studio-loading"><span></span><strong>جارٍ تجهيز مساحة دانه…</strong><small>نراجع الأرشيف والمواد المنشورة.</small></div>';await loadLocalArticles();try{await bootstrapBundledArchive()}catch(e){console.warn('Archive bootstrap:',e);toast('تعذر مزامنة بعض مواد الأرشيف، ويمكن إعادة المحاولة بالتحديث.')}await loadLocalArticles();render('dashboard')}
  async function bootstrapBundledArchive(){
    if(!bundledArticles.length)return;
    const known=new Set(localArticles.map(a=>a.slug)), translations=window.ARTICLE_TRANSLATIONS_EN||{};
    const missing=bundledArticles.filter(a=>!known.has(a.slug));if(!missing.length)return;
    const rows=missing.map(a=>{const en=translations[a.slug]||{};return {slug:a.slug,type:a.slug==='between-study-and-practice'?'training':a.type,title:a.title,excerpt:a.excerpt||'',body:(a.body||[]).join('\n\n'),image_url:a.image||`assets/covers/${a.slug}.svg`,place:a.place||'جدة',author:'دانه بالجهر',tags:a.tags||[],featured:!!a.featured,status:'published',published_at:`${a.date}T09:00:00Z`,published_date:a.date,stats:a.stats||[],benefits:a.benefits||[],title_en:en.title||null,excerpt_en:en.excerpt||null,body_en:(en.body||[]).join('\n\n')||null,place_en:'Jeddah',tags_en:en.tags||[],stats_en:en.stats||[],benefits_en:en.benefits||[],show_en:!!(en.title&&en.body?.length),source:'legacy'};});
    for(let i=0;i<rows.length;i+=8){const {error}=await sb.from('cms_articles').insert(rows.slice(i,i+8));if(error&&error.code!=='23505')throw error}
  }
  function bindStatic(){
    $('#sendMagicLink').addEventListener('click',sendLink);$('#signOut').addEventListener('click',async()=>{await sb.auth.signOut();location.reload()});
    nav.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)render(b.dataset.view)});
    $('#refreshData').addEventListener('click',async()=>{await loadLocalArticles();render(currentView);toast('تم تحديث البيانات')});
    $('#mobileNav').addEventListener('click',()=>$('.studio-sidebar').classList.toggle('open'));
  }
  async function sendLink(){const btn=$('#sendMagicLink');btn.disabled=true;$('#loginStatus').textContent='جارٍ إرسال رابط الدخول…';const redirectTo=location.origin+location.pathname;const {error}=await sb.auth.signInWithOtp({email:OWNER,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});btn.disabled=false;if(error){$('#loginStatus').textContent=`تعذر الإرسال: ${error.message}`;return}$('#loginStatus').textContent='تم الإرسال. افتحي الرابط الذي وصل إلى بريدك ثم ستدخلين اللوحة مباشرة.'}
  async function loadLocalArticles(){const {data,error}=await sb.from('cms_articles').select('*').order('updated_at',{ascending:false});if(error)throw error;localArticles=data||[]}
  function render(view){currentView=view;sectionLabel.textContent=sectionNames[view]||view;$$('[data-view]',nav).forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('.studio-sidebar').classList.remove('open');if(view==='dashboard')renderDashboard();if(view==='compose')renderCompose();if(view==='content')renderContent();if(view==='analytics')renderAnalytics()}
  async function getAnalytics(days=analyticsDays){const {data,error}=await sb.rpc('analytics_dashboard',{p_days:days});if(error)throw error;return data||{summary:{},daily:[],top_articles:[],sources:[],devices:[],searches:[],content:{}}}
  function titleForSlug(slug){const a=localArticles.find(x=>x.slug===slug)||bundledArticles.find(x=>x.slug===slug);if(a)return a.title;return slug||'—'}

  async function renderDashboard(){
    content.innerHTML=`<div class="view-head"><div><span class="eyebrow">CONTROL ROOM</span><h1>صباح العمل.</h1><p>نظرة سريعة على النشر والأداء قبل أن تبدأي.</p></div><button class="primary-btn" style="width:auto" id="quickCompose">مادة جديدة <b>+</b></button></div><div class="metric-grid" id="dashMetrics"></div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>الحركة خلال 30 يومًا</h2><span>PAGE VIEWS / VISITORS</span></div><div class="chart-wrap"><canvas id="dashChart"></canvas></div></section><section class="panel"><div class="panel-head"><h2>الأكثر قراءة</h2><span>TOP STORIES</span></div><div class="mini-list" id="dashTop"></div></section></div>`;
    $('#quickCompose').onclick=()=>render('compose');
    try{const a=await getAnalytics(30),s=a.summary||{},c=a.content||{};$('#dashMetrics').innerHTML=metric('زيارات الصفحات',n(s.pageviews),pctChange(s.pageviews,s.previous_pageviews))+metric('الزوار',n(s.visitors),pctChange(s.visitors,s.previous_visitors))+metric('قراءات المواد',n(s.article_views),'Article views')+metric('اكتمال القراءة',`${n(s.completion_rate)}%`,'وصلوا إلى 90%')+metric('متوسط وقت القراءة',`${n(s.avg_read_seconds)} ث`,'لكل مادة',true)+metric('المواد المنشورة',n(c.published),'في الأرشيف',true);
      $('#dashTop').innerHTML=(a.top_articles||[]).slice(0,6).map((x,i)=>`<div class="mini-row"><i>${String(i+1).padStart(2,'0')}</i><strong title="${esc(titleForSlug(x.slug))}">${esc(titleForSlug(x.slug))}</strong><b>${n(x.views)}</b></div>`).join('')||'<div class="empty-state">ستظهر هنا بعد بدء الزيارات.</div>';drawLine($('#dashChart'),a.daily||[])}catch(e){content.querySelector('#dashMetrics').innerHTML='<div class="panel">لا توجد بيانات بعد.</div>'}
  }
  function metric(label,value,note,wide=false){return `<div class="metric-card ${wide?'wide':''}"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`}

  function renderCompose(article=null){
    editingId=article?.id||null;
    const englishReady=!!(article?.title_en&&article?.body_en);
    content.innerHTML=`<div class="view-head"><div><span class="eyebrow">EDITOR</span><h1>${article?'تعديل المادة':'مادة جديدة'}</h1><p>اكتبي المادة، أضيفي صورتها، ثم انشريها أو احفظيها كمسودة.</p></div></div>
    <form id="articleForm" class="compose-layout">
      <section class="editor-card">
        <div class="field"><label>نوع المادة</label><div class="type-grid">${['news','report','article','training'].map(t=>`<label class="type-choice"><input type="radio" name="type" value="${t}" ${(article?.type||'news')===t?'checked':''}><span>${typeLabel[t]}</span></label>`).join('')}</div></div>
        <div class="field"><label>العنوان العربي</label><textarea class="title-input" name="title" maxlength="240" required placeholder="عنوان المادة…">${esc(article?.title||'')}</textarea></div>
        <div class="field"><label>المقدمة المختصرة <small>اختياري — إذا تركتِها فارغة ستؤخذ من بداية النص</small></label><textarea name="excerpt" rows="3" placeholder="وصف قصير يظهر في البطاقات…">${esc(article?.excerpt||'')}</textarea></div>
        <div class="field"><label>النص الكامل</label><textarea class="body-input" name="body" required placeholder="اكتبي النص كاملًا هنا، وافصلي بين الفقرات بسطر فارغ…">${esc(article?.body||'')}</textarea></div>
        <div class="field"><label>وسوم <small>افصلي بينها بفاصلة</small></label><input name="tags" value="${esc((article?.tags||[]).join('، '))}" placeholder="إعلام، تقنية، جدة…"></div>
        <details class="english-editor" ${englishReady?'open':''}><summary><span><b>English version</b><small>للقراء غير الناطقين بالعربية</small></span><i>＋</i></summary><div class="english-fields">
          <div class="field"><label>English title</label><textarea class="title-input latin" name="title_en" maxlength="240" dir="ltr" placeholder="English title…">${esc(article?.title_en||'')}</textarea></div>
          <div class="field"><label>English excerpt</label><textarea name="excerpt_en" rows="3" dir="ltr" placeholder="Short English deck…">${esc(article?.excerpt_en||'')}</textarea></div>
          <div class="field"><label>Full English text</label><textarea class="body-input latin" name="body_en" dir="ltr" placeholder="Paste the complete English version here…">${esc(article?.body_en||'')}</textarea></div>
          <div class="field"><label>English tags <small>comma separated</small></label><input name="tags_en" dir="ltr" value="${esc((article?.tags_en||[]).join(', '))}"></div>
          <label class="english-publish"><input type="checkbox" name="show_en" ${article?.show_en||englishReady?'checked':''}> إظهار المادة في النسخة الإنجليزية <small>لن تظهر بالإنجليزية إذا كان العنوان أو النص الإنجليزي فارغًا.</small></label>
        </div></details>
      </section>
      <aside><div class="side-card">
        <div class="field"><label>صورة المادة</label><div class="image-drop ${article?.image_url?'has-image':''}" id="imageDrop" tabindex="0" role="button" aria-label="اختيار صورة"><input id="articleImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden><div class="image-preview" id="imagePreview">${article?.image_url?`<img src="${esc(article.image_url)}" alt="معاينة الصورة">`:'<span class="upload-icon">＋</span>'}</div><div class="drop-copy"><strong>اختيار صورة من الجهاز</strong><small>اضغطي هنا أو اسحبي الصورة وأفلتيها. JPG / PNG / WEBP حتى 10MB.</small></div></div><div class="image-actions"><button id="chooseImage" type="button">اختيار / استبدال الصورة</button><button id="removeImage" type="button" ${article?.image_url?'':'hidden'}>حذف الصورة</button></div></div>
        <div class="field"><label>المكان</label><input name="place" value="${esc(article?.place||'جدة')}"></div>
        <div class="field"><label>المكان بالإنجليزية</label><input name="place_en" dir="ltr" value="${esc(article?.place_en||'Jeddah')}"></div>
        <div class="field"><label>الكاتبة</label><input name="author" value="دانه بالجهر" readonly></div>
        <div class="field"><label><input type="checkbox" name="featured" ${article?.featured?'checked':''}> مادة مختارة</label></div>
        <div class="publish-actions"><button class="publish-now" type="submit" data-action="publish">${article?'حفظ ونشر':'نشر الآن'} ↗</button><button class="save-draft" type="submit" data-action="draft">حفظ كمسودة</button></div>
        <div class="hint-box">عند النشر يسجل تاريخ اليوم في السعودية. إذا لم تضيفي صورة، يستخدم الموقع غلاف القسم تلقائيًا.</div>
      </div></aside>
    </form>`;
    let selectedFile=null, removeExisting=false, objectUrl=null;
    const input=$('#articleImage'),drop=$('#imageDrop'),preview=$('#imagePreview'),remove=$('#removeImage');
    function setPreview(file){
      if(!file)return;
      if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type)){toast('اختاري ملف صورة JPG أو PNG أو WEBP أو GIF');return}
      if(file.size>10*1024*1024){toast('حجم الصورة أكبر من 10MB');return}
      selectedFile=file;removeExisting=false;if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);preview.innerHTML=`<img src="${objectUrl}" alt="معاينة الصورة">`;drop.classList.add('has-image');remove.hidden=false;
    }
    input.addEventListener('change',e=>setPreview(e.target.files?.[0]));
    $('#chooseImage').addEventListener('click',e=>{e.stopPropagation();input.click()});
    drop.addEventListener('click',e=>{if(!e.target.closest('.image-actions'))input.click()});
    drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click()}});
    ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('dragging')}));
    ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('dragging')}));
    drop.addEventListener('drop',e=>setPreview(e.dataTransfer?.files?.[0]));
    remove.addEventListener('click',e=>{e.stopPropagation();selectedFile=null;removeExisting=true;input.value='';preview.innerHTML='<span class="upload-icon">＋</span>';drop.classList.remove('has-image');remove.hidden=true});
    let submitAction='publish';$$('#articleForm button[type="submit"]').forEach(b=>b.addEventListener('click',()=>submitAction=b.dataset.action));
    $('#articleForm').addEventListener('submit',e=>saveArticle(e,submitAction,selectedFile,article,removeExisting));
  }
  async function uploadImage(file){if(!file)return null;const ext=(file.name.split('.').pop()||'jpg').toLowerCase();const path=`${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;const {error}=await sb.storage.from('article-images').upload(path,file,{cacheControl:'3600',upsert:false});if(error)throw error;return sb.storage.from('article-images').getPublicUrl(path).data.publicUrl}
  async function saveArticle(e,action,file,existing,removeExisting=false){
    e.preventDefault();const form=e.currentTarget,fd=new FormData(form),title=String(fd.get('title')||'').trim(),body=String(fd.get('body')||'').trim();
    if(!title||!body){toast('العنوان والنص مطلوبان');return}
    const buttons=$$('button[type="submit"]',form);buttons.forEach(x=>x.disabled=true);
    try{
      let image=removeExisting?null:(existing?.image_url||null);if(file)image=await uploadImage(file);
      const tags=String(fd.get('tags')||'').split(/[،,]/).map(x=>x.trim()).filter(Boolean), tagsEn=String(fd.get('tags_en')||'').split(',').map(x=>x.trim()).filter(Boolean);
      const titleEn=String(fd.get('title_en')||'').trim(),bodyEn=String(fd.get('body_en')||'').trim(),now=new Date().toISOString();
      const payload={type:fd.get('type'),title,excerpt:String(fd.get('excerpt')||'').trim()||excerptFrom(body),body,image_url:image,place:String(fd.get('place')||'جدة').trim()||'جدة',place_en:String(fd.get('place_en')||'Jeddah').trim()||'Jeddah',author:'دانه بالجهر',tags,featured:fd.get('featured')==='on',status:action==='publish'?'published':'draft',title_en:titleEn||null,excerpt_en:String(fd.get('excerpt_en')||'').trim()||null,body_en:bodyEn||null,tags_en:tagsEn,show_en:fd.get('show_en')==='on'&&!!titleEn&&!!bodyEn};
      if(action==='publish'){payload.published_at=existing?.published_at||now;payload.published_date=existing?.published_date||saudiDate()}
      if(editingId){const {error}=await sb.from('cms_articles').update(payload).eq('id',editingId);if(error)throw error}
      else{payload.slug=slugify(title);let {error}=await sb.from('cms_articles').insert(payload);if(error?.code==='23505'){payload.slug=`${payload.slug}-${Date.now().toString(36).slice(-5)}`;({error}=await sb.from('cms_articles').insert(payload))}if(error)throw error}
      await loadLocalArticles();toast(action==='publish'?'تم نشر المادة وظهورها للقراء':'تم حفظ المسودة');render('content');
    }catch(err){toast(`تعذر الحفظ: ${err.message}`)}finally{buttons.forEach(x=>x.disabled=false)}
  }

  function renderContent(){content.innerHTML=`<div class="view-head"><div><span class="eyebrow">CONTENT LIBRARY</span><h1>المواد</h1><p>أرشيفك الصحفي كاملًا: المواد الحالية والجديدة، المنشورة والمسودات.</p></div><button class="primary-btn" style="width:auto" id="newFromContent">مادة جديدة <b>+</b></button></div><div class="content-toolbar"><input id="contentSearch" placeholder="ابحثي في العناوين…"><select id="contentFilter"><option value="all">الكل</option><option value="published">منشور</option><option value="draft">مسودة</option><option value="news">أخبار</option><option value="report">تقارير</option><option value="article">مقالات</option><option value="training">تجربة</option></select></div><div class="content-table" id="contentTable"></div>`;$('#newFromContent').onclick=()=>render('compose');$('#contentSearch').addEventListener('input',renderContentRows);$('#contentFilter').addEventListener('change',renderContentRows);renderContentRows()}
  function renderContentRows(){const root=$('#contentTable');if(!root)return;const q=$('#contentSearch').value.trim().toLowerCase(),f=$('#contentFilter').value;let rows=localArticles.filter(a=>(!q||a.title.toLowerCase().includes(q))&&(f==='all'||a.status===f||a.type===f));root.innerHTML=`<div class="content-row head"><span>الصورة</span><span>العنوان</span><span>النوع</span><span>الحالة</span><span>التاريخ</span><span>إدارة</span></div>`+(rows.map(a=>`<div class="content-row"><img class="content-thumb" src="${esc(a.image_url||fallback[a.type])}" alt=""><div class="content-title"><strong>${esc(a.title)}</strong><small>${esc(a.slug)}</small></div><span>${typeLabel[a.type]||a.type}</span><span class="status-pill ${a.status==='draft'?'draft':''}">${a.status==='published'?'منشور':'مسودة'}</span><span>${fmtDate(a.published_at||a.created_at)}</span><div class="row-actions"><button data-edit="${a.id}">تعديل</button><button data-delete="${a.id}">حذف</button></div></div>`).join('')||'<div class="empty-state">لا توجد مواد بعد.</div>');$$('[data-edit]',root).forEach(b=>b.onclick=()=>renderCompose(localArticles.find(a=>a.id===b.dataset.edit)));$$('[data-delete]',root).forEach(b=>b.onclick=()=>deleteArticle(b.dataset.delete))}
  async function deleteArticle(id){if(!confirm('حذف هذه المادة نهائيًا؟'))return;const {error}=await sb.from('cms_articles').delete().eq('id',id);if(error){toast(error.message);return}await loadLocalArticles();renderContentRows();toast('تم حذف المادة')}

  async function renderAnalytics(){content.innerHTML=`<div class="view-head"><div><span class="eyebrow">AUDIENCE INTELLIGENCE</span><h1>التحليلات</h1><p>زيارة، قراءة، تفاعل، وعمق التصفح — تتحدث من الموقع الحقيقي.</p></div><div class="range" id="analyticsRange"><button data-days="7">7 أيام</button><button data-days="30" class="active">30 يوم</button><button data-days="90">90 يوم</button></div></div><div id="analyticsBody"><div class="empty-state">جارٍ تحميل البيانات…</div></div>`;$$('[data-days]').forEach(b=>{b.classList.toggle('active',+b.dataset.days===analyticsDays);b.onclick=()=>{analyticsDays=+b.dataset.days;renderAnalytics()}});try{const a=await getAnalytics(analyticsDays);paintAnalytics(a)}catch(e){$('#analyticsBody').innerHTML=`<div class="panel">تعذر تحميل التحليلات: ${esc(e.message)}</div>`}}
  function paintAnalytics(a){const s=a.summary||{},body=$('#analyticsBody');body.innerHTML=`<div class="metric-grid">${metric('مشاهدات الصفحات',n(s.pageviews),`${n(s.sessions)} جلسة`)}${metric('الزوار',n(s.visitors),pctChange(s.visitors,s.previous_visitors))}${metric('قراءات المواد',n(s.article_views),`${n(s.engaged_reads)} قراءة عميقة`)}${metric('اكتمال القراءة',`${n(s.completion_rate)}%`,'وصلوا إلى 90%')}${metric('متوسط وقت المادة',`${n(s.avg_read_seconds)} ث`,'وقت القراءة الفعلي')}${metric('صفحات/جلسة',n(s.avg_pages_per_session),`ارتداد ${n(s.bounce_rate)}%`)}${metric('المشاركات',n(s.shares),`${n(s.saves)} حفظ`)}${metric('عمليات البحث',n(s.searches),'داخل الموقع')}</div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>الأداء اليومي</h2><span>DAILY TRAFFIC</span></div><div class="chart-wrap"><canvas id="analyticsChart"></canvas></div></section><section class="panel"><div class="panel-head"><h2>الأكثر قراءة</h2><span>TOP CONTENT</span></div><div class="mini-list">${(a.top_articles||[]).slice(0,9).map((x,i)=>`<div class="mini-row"><i>${String(i+1).padStart(2,'0')}</i><strong title="${esc(titleForSlug(x.slug))}">${esc(titleForSlug(x.slug))}</strong><b>${n(x.views)}</b></div>`).join('')||'<div class="empty-state">لا توجد قراءات بعد.</div>'}</div></section></div><div class="analytics-lower"><section class="panel"><div class="panel-head"><h2>مصادر الزيارة</h2><span>REFERRERS</span></div>${barList(a.sources||[],'source','visits')}</section><section class="panel"><div class="panel-head"><h2>الأجهزة</h2><span>DEVICES</span></div>${barList(a.devices||[],'device','visits')}</section><section class="panel"><div class="panel-head"><h2>ما الذي يبحثون عنه؟</h2><span>SEARCHES</span></div>${barList(a.searches||[],'query','count')}</section></div>`;drawLine($('#analyticsChart'),a.daily||[])}
  function barList(items,key,val){if(!items.length)return '<div class="empty-state">لا توجد بيانات بعد.</div>';const max=Math.max(...items.map(x=>+x[val]||0),1);return `<div class="bar-list">${items.slice(0,10).map(x=>`<div class="bar-item"><span title="${esc(x[key])}">${esc(x[key]||'—')}</span><div class="bar-track"><i style="width:${((+x[val]||0)/max)*100}%"></i></div><b>${n(x[val])}</b></div>`).join('')}</div>`}
  function drawLine(canvas,rows){if(!canvas)return;cancelAnimationFrame(chartRaf);chartRaf=requestAnimationFrame(()=>{const dpr=devicePixelRatio||1,r=canvas.getBoundingClientRect(),w=Math.max(300,r.width),h=Math.max(180,r.height);canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);const pad={l:34,r:14,t:18,b:30};const data=rows.length?rows:[{date:new Date().toISOString(),pageviews:0,visitors:0}];const max=Math.max(1,...data.map(x=>+x.pageviews||0));c.strokeStyle='#e4e5e2';c.lineWidth=1;for(let i=0;i<5;i++){const y=pad.t+(h-pad.t-pad.b)*(i/4);c.beginPath();c.moveTo(pad.l,y);c.lineTo(w-pad.r,y);c.stroke()}function line(key,color){c.strokeStyle=color;c.lineWidth=2;c.beginPath();data.forEach((x,i)=>{const px=pad.l+(w-pad.l-pad.r)*(data.length===1?0:i/(data.length-1)),py=h-pad.b-(h-pad.t-pad.b)*((+x[key]||0)/max);i?c.lineTo(px,py):c.moveTo(px,py)});c.stroke()}line('pageviews','#0c1115');line('visitors','#9fa5a7');c.fillStyle='#8a9093';c.font='10px Space Grotesk';c.textAlign='center';const step=Math.max(1,Math.ceil(data.length/6));data.forEach((x,i)=>{if(i%step&&i!==data.length-1)return;const px=pad.l+(w-pad.l-pad.r)*(data.length===1?0:i/(data.length-1));c.fillText(String(x.date).slice(5,10),px,h-8)})})}
  addEventListener('resize',()=>{if(currentView==='analytics')renderAnalytics();if(currentView==='dashboard')renderDashboard()},{passive:true});
  init();
})();
