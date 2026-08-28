(() => {
  "use strict";

  let articles = Array.isArray(window.ARTICLES) ? window.ARTICLES : [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const main = $("#main");
  const header = $("#siteHeader");
  const progressBar = $("#pageProgress span");
  const ribbonTrack = $("#ribbonTrack");
  const readingDock = $("#readingDock");
  const cursorOrb = $("#cursorOrb");

  const storage = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  };

  const i18n = {
    ar: {
      skip:"تجاوز إلى المحتوى", name:"دانه بالجهر", portfolio:"أعمال صحفية", work:"الأعمال", about:"من أنا", archive:"الأرشيف", search:"بحث", choose:"اختاري ما تريدين رؤيته", saved:"المحفوظة", surprise:"فاجئني", searchArchive:"ابحثي في الأرشيف", clear:"مسح", titleMatch:"مطابقة بداية كلمات العنوان فقط", navigate:"تنقل", open:"فتح", close:"إغلاق", numbers:"الأرقام", experience:"التجربة", footerBig:"الكلمة تبدأ من سؤال.", footerText:"أرشيف صحفي يجمع الخبر والتقرير والمقال والتجربة الميدانية في مساحة واحدة.", explore:"استكشف", settings:"الإعدادات", appearance:"المظهر", toTop:"إلى الأعلى ↑", staticSite:"Static · جاهز لـ GitHub Pages",
      all:"الكل", selected:"مختارات", news:"أخبار", reports:"تقارير", articles:"مقالات", training:"تجربة", stats:"أرقام التقارير", latest:"الأحدث", latestArchive:"آخر ما في الأرشيف", heroCopy:"مساحة صحفية شخصية تجمع الخبر المباشر، والتقرير الذي يفسر ما وراء الرقم، والمقال الذي يبدأ من سؤال، وتجربة نقلت الكتابة من الدراسة إلى الممارسة.", exploreWork:"استكشف الأعمال", knowMe:"تعرف عليّ", stories:"مادة صحفية", read:"اقرأ", reading:"دقائق قراءة", selectedWork:"أعمال مختارة", selectedDesc:"واجهة سريعة لمواد مختلفة في الأسلوب والموضوع؛ حرّكي البطاقات أو افتحي أي مادة مباشرة.", workRoom:"غرفة الأعمال", workDesc:"اختاري النوع من الشريط، وستتغير المواد أمامك فورًا من دون المرور على قائمة طويلة.", openArchive:"فتح الأرشيف الكامل", aboutTitle:"من أنا", aboutLead:"دانه بالجهر، خريجة بكالوريوس الذكاء الاصطناعي من جامعة جدة. خلال التدريب في اتحاد وكالات أنباء دول منظمة التعاون الإسلامي «يونا»، تحولت الكتابة الصحفية من تجربة دراسية محدودة إلى مساحة مهنية أوسع أريد تطويرها.", aboutBody:"أهتم بالموضوعات التي تلتقي فيها حياة الناس مع الإعلام والبيانات والتقنية وسوق العمل، وأتعامل مع الخبر والتقرير والمقال كأشكال مختلفة للسؤال نفسه: ما الذي يحتاج القارئ إلى معرفته فعلًا؟", journey:"المسار", pathStudy:"الدراسة", pathStudyText:"بكالوريوس في الذكاء الاصطناعي — جامعة جدة.", pathField:"الميدان", pathFieldText:"تجربة تدريبية في اتحاد وكالات أنباء دول منظمة التعاون الإسلامي «يونا».", pathWriting:"الكتابة", pathWritingText:"أخبار وتقارير ومقالات وتجارب ميدانية ضمن أرشيف واحد.", paths:"مسارات الكتابة", newsPath:"خبر صحفي", newsPathText:"المعلومة الأهم أولًا، ثم ما يدعمها بوضوح ودقة.", reportPath:"تقرير", reportPathText:"سياق وبيانات وتحليل يضيف طبقة بعد طبقة.", articlePath:"مقال", articlePathText:"سؤال مألوف يُفكك من زاوية أعمق من الانطباع الأول.", trainingPath:"ممارسة ميدانية", trainingPathText:"زيارات، مقابلات، تصوير، وملاحظات تحريرية تتحول إلى تعلم.", insideNumbers:"داخل الأرقام", insideNumbersDesc:"بعض التقارير تحمل مؤشرات لا ينبغي أن تضيع داخل الفقرات. كل رقم هنا يفتح القصة التي ورد فيها.", fieldTitle:"بين الدراسة والممارسة", fieldDesc:"11 نتيجة من تجربة التدريب، تُعرض هنا كمسار قصير ويمكن فتح التجربة كاملة بنقرة واحدة.", fullExperience:"اقرأ التجربة كاملة", showAll:"عرض كل النقاط", showLess:"إخفاء الإضافي", fullArchive:"الأرشيف الكامل", archiveDesc:"كل المواد في فهرس واحد، مع بحث من بداية كلمات العنوان، تصفية بالنوع، حفظ محلي، وتبديل بين العرض المختصر والبطاقات.", startTitle:"ابدئي بحرف أو كلمة من العنوان…", noBefore:"لن تظهر النتائج قبل كتابة حرف.", searchStart:"ابدئي من أول حرف.", searchStartDesc:"البحث يفحص العناوين فقط، ولن يعرض مادة لا تبدأ إحدى كلمات عنوانها بما كتبته.", results:"نتيجة", noResults:"لا توجد نتائج مطابقة", tryOther:"جرّبي بداية كلمة أخرى من العنوان.", savedEmpty:"لا توجد مواد محفوظة حتى الآن.", loadMore:"عرض المزيد", grid:"بطاقات", list:"قائمة", back:"العودة", article:"المادة", place:"المكان", date:"التاريخ", author:"الكاتبة", readTime:"وقت القراءة", originalArabic:"النص الأصلي بالعربية", share:"مشاركة", save:"حفظ", savedDone:"محفوظة", copyLink:"تم نسخ رابط المادة", removeSaved:"تمت إزالة المادة من المحفوظة", addSaved:"تم حفظ المادة", font:"حجم الخط", width:"عرض القراءة", tags:"وسوم", writtenBy:"كتبتها", keepReading:"اقرأ أيضًا", previous:"السابق", next:"التالي", focus:"تركيز", exitFocus:"إنهاء التركيز", recent:"أكمل القراءة", recentDesc:"مواد فتحتها مؤخرًا على هذا الجهاز.", noRecent:"لم تفتحي أي مادة بعد.", archiveCount:"مادة", byTitle:"بحث في العنوان", savedOnly:"المحفوظة فقط", randomToast:"اخترت لك مادة من الأرشيف"
    },
    en: {
      skip:"Skip to content", name:"Dana Aljahr", portfolio:"Editorial Portfolio", work:"Work", about:"About", archive:"Archive", search:"Search", choose:"Choose what you want to see", saved:"Saved", surprise:"Surprise me", searchArchive:"Search the archive", clear:"Clear", titleMatch:"Matches word beginnings in titles only", navigate:"Navigate", open:"Open", close:"Close", numbers:"Numbers", experience:"Experience", footerBig:"Every story starts with a question.", footerText:"An editorial archive bringing news, reports, essays and field experience into one place.", explore:"Explore", settings:"Settings", appearance:"Appearance", toTop:"Back to top ↑", staticSite:"Static · GitHub Pages Ready",
      all:"All", selected:"Selected", news:"News", reports:"Reports", articles:"Essays", training:"Experience", stats:"Report data", latest:"Latest", latestArchive:"Latest in the archive", heroCopy:"A personal journalism space for direct news, reports that explain what sits behind the number, essays that begin with a question, and field experience that moved writing from study into practice.", exploreWork:"Explore work", knowMe:"About me", stories:"stories", read:"Read", reading:"min read", selectedWork:"Selected work", selectedDesc:"A quick entry into different writing modes and subjects. Scroll the rail or open any story directly.", workRoom:"Work room", workDesc:"Choose a format and the work in front of you changes instantly — no endless wall of cards.", openArchive:"Open full archive", aboutTitle:"About me", aboutLead:"Dana Aljahr is an Artificial Intelligence graduate from the University of Jeddah. Training at the Union of OIC News Agencies (UNA) expanded journalism from a limited academic experience into a professional direction to keep developing.", aboutBody:"The work here focuses on where everyday life meets media, data, technology and the labour market, using news, reports and essays as different ways of answering one question: what does the reader actually need to know?", journey:"Journey", pathStudy:"Study", pathStudyText:"BSc in Artificial Intelligence — University of Jeddah.", pathField:"Field", pathFieldText:"Training experience at the Union of OIC News Agencies (UNA).", pathWriting:"Writing", pathWritingText:"News, reports, essays and field experiences in one archive.", paths:"Writing modes", newsPath:"News", newsPathText:"The most important fact first, followed by what makes it clear and reliable.", reportPath:"Report", reportPathText:"Context, data and analysis that add one layer after another.", articlePath:"Essay", articlePathText:"A familiar question unpacked beyond the first impression.", trainingPath:"Field practice", trainingPathText:"Visits, interviews, photography and editorial feedback turned into learning.", insideNumbers:"Inside the numbers", insideNumbersDesc:"Some reports carry indicators that should not disappear inside paragraphs. Every number opens the story it came from.", fieldTitle:"Between study and practice", fieldDesc:"Eleven outcomes from the training experience, shown as a short path with the full story one click away.", fullExperience:"Read the full experience", showAll:"Show all points", showLess:"Show fewer", fullArchive:"Full archive", archiveDesc:"All work in one index, with title-prefix search, type filters, local saves and list/grid views.", startTitle:"Start with a letter or word from the title…", noBefore:"Results appear after you type a letter.", searchStart:"Start with the first letter.", searchStartDesc:"Search checks titles only and will not show a story unless a title word begins with what you typed.", results:"results", noResults:"No matching results", tryOther:"Try another word beginning from the title.", savedEmpty:"No saved stories on this device yet.", loadMore:"Load more", grid:"Grid", list:"List", back:"Back", article:"Story", place:"Place", date:"Date", author:"By", readTime:"Read time", originalArabic:"Original Arabic text", share:"Share", save:"Save", savedDone:"Saved", copyLink:"Story link copied", removeSaved:"Removed from saved", addSaved:"Saved to this device", font:"Text size", width:"Reading width", tags:"Tags", writtenBy:"Written by", keepReading:"Keep reading", previous:"Previous", next:"Next", focus:"Focus", exitFocus:"Exit focus", recent:"Continue reading", recentDesc:"Stories recently opened on this device.", noRecent:"You have not opened a story yet.", archiveCount:"stories", byTitle:"Search titles", savedOnly:"Saved only", randomToast:"Picked a story from the archive"
    }
  };

  const state = {
    lang: storage.get("dana.lang", "ar"),
    theme: storage.get("dana.theme", "light"),
    workCategory: "all",
    archiveCategory: "all",
    archiveQuery: "",
    archiveView: storage.get("dana.archiveView", "list"),
    visible: 9,
    savedOnly: false,
    searchIndex: -1
  };

  const typeKeys = { news:"news", report:"reports", article:"articles", training:"training" };
  const arrowSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  const searchSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"/></svg>`;
  const listSvg = `<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>`;
  const gridSvg = `<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>`;
  let revealObserver, sectionObserver, countObserver, toastTimer;

  function t(key){ return i18n[state.lang][key] ?? i18n.ar[key] ?? key; }
  function esc(v=""){ return String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function normalize(v=""){ return String(v).toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/ـ/g,"").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim(); }
  function isTraining(a){ return a.typeLabel === "تجربة تدريبية"; }
  function categoryOf(a){ return isTraining(a) ? "training" : a.type; }
  function categoryLabel(a){ return state.lang === "ar" ? a.typeLabel : t(typeKeys[categoryOf(a)]); }
  function byDate(list=articles){ return [...list].sort((a,b)=>String(b.date||"").localeCompare(String(a.date||""))); }
  function getCategory(cat){ return byDate(articles.filter(a=>cat==="all" || categoryOf(a)===cat)); }
  function readingTime(a){ const n=(a.body||[]).join(" ").trim().split(/\s+/).filter(Boolean).length; return Math.max(1,Math.round(n/180)); }
  function cover(a){ return `assets/covers/${a.slug}.svg`; }
  function articleUrl(slug){ return `?article=${encodeURIComponent(slug)}`; }
  function formatDate(iso){ if(!iso)return"";const d=new Date(`${iso}T12:00:00`);if(Number.isNaN(d.getTime()))return iso; return new Intl.DateTimeFormat(state.lang==="ar"?"ar-SA":"en-GB",{year:"numeric",month:"long",day:"numeric"}).format(d); }
  function transition(fn){ if(document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(fn); else fn(); }
  function savedSlugs(){ return new Set(storage.get("dana.saved",[])); }
  function isSaved(slug){ return savedSlugs().has(slug); }
  function toggleSaved(slug){ const s=savedSlugs(); let added=false; if(s.has(slug)) s.delete(slug); else {s.add(slug);added=true;} storage.set("dana.saved",[...s]); updateSavedUI(); if(added)window.DanaBackend?.recordEvent?.("save",slug);toast(added?t("addSaved"):t("removeSaved")); return added; }
  function addRecent(slug){ let r=storage.get("dana.recent",[]).filter(x=>x!==slug);r.unshift(slug);r=r.slice(0,6);storage.set("dana.recent",r); }
  function getRecent(){ return storage.get("dana.recent",[]).map(slug=>articles.find(a=>a.slug===slug)).filter(Boolean); }
  function titleScore(a,q){ q=normalize(q);if(!q)return 0;const words=normalize(a.title).split(" ").filter(Boolean);const qs=q.split(" ").filter(Boolean);if(!qs.every(token=>words.some(w=>w.startsWith(token)))) return Infinity;const title=normalize(a.title);if(title.startsWith(q))return 0;if(words.some(w=>w.startsWith(q)))return 1;return 2; }
  function titleMatches(a,q){ return Number.isFinite(titleScore(a,q)); }
  function highlight(title,q){ const raw=String(q||"").trim();if(!raw)return esc(title);const parts=raw.split(/\s+/).filter(Boolean).map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")); if(!parts.length)return esc(title); try{return esc(title).replace(new RegExp(`(^|\\s)(${parts.join("|")})([^\\s]*)`,"gi"),`$1<mark>$2</mark>$3`)}catch{return esc(title)} }

  function applyPreferences(){
    document.documentElement.dataset.theme=state.theme;
    document.documentElement.lang=state.lang;
    document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",state.theme==="dark"?"#090909":"#f4f3ef");
    $$("[data-i18n]").forEach(el=>{ const k=el.dataset.i18n; if(t(k)) el.textContent=t(k); });
    $("#langToggle .lang-current").textContent=state.lang.toUpperCase();
    $("#langToggle .lang-other").textContent=state.lang==="ar"?"EN":"AR";
    $$("[data-drawer-lang]").forEach(b=>b.classList.toggle("active",b.dataset.drawerLang===state.lang));
    const searchInput=$("#globalSearch"); if(searchInput) searchInput.placeholder=t("startTitle");
    updateSavedUI();
  }
  function setLanguage(lang){ if(!i18n[lang])return;state.lang=lang;storage.set("dana.lang",lang);applyPreferences();route({preserveScroll:true}); }
  function setTheme(theme){ state.theme=theme;storage.set("dana.theme",theme);applyPreferences(); }
  function toggleTheme(){ setTheme(state.theme==="light"?"dark":"light"); }

  function typeCount(cat){ return getCategory(cat).length; }
  function renderRibbon(){
    const items=[
      ["selected",t("selected"),3,"selected"],
      ["news",t("news"),typeCount("news"),"work"],
      ["report",t("reports"),typeCount("report"),"work"],
      ["article",t("articles"),typeCount("article"),"work"],
      ["training",t("training"),typeCount("training"),"training"],
      ["stats",t("stats"),articles.filter(a=>a.stats?.length).length,"insights"],
      ["archive",t("archive"),articles.length,"archive"]
    ];
    ribbonTrack.innerHTML=items.map(([action,label,count,target])=>`<button class="ribbon-item" type="button" data-ribbon-action="${action}" data-target="${target}"><span>${esc(label)}</span><b>${count}</b></button>`).join("");
  }

  function sectionHead(index,en,title,desc,action=""){
    return `<div class="section-head reveal"><div class="section-index"><span>${index}</span><div><span class="micro-label">${en}</span><h2>${esc(title)}</h2></div></div><div class="section-side"><p>${esc(desc)}</p>${action?`<button class="inline-link" type="button" ${action}>${esc(t("openArchive"))}</button>`:""}</div></div>`;
  }
  function roundArrow(){ return `<span class="round-arrow">${arrowSvg}</span>`; }
  function cardMeta(a){ return `<span>${esc(categoryLabel(a))}</span><span>${esc(formatDate(a.date))}</span>`; }
  function storyCard(a,index=0){ return `<article class="story-card reveal interactive-open" data-open-article="${esc(a.slug)}" tabindex="0" role="link" aria-label="${esc(t("open"))}: ${esc(a.title)}" data-tilt><div class="story-media"><img src="${esc(cover(a))}" alt="" loading="lazy" width="900" height="620"><span class="story-type">${esc(categoryLabel(a))}</span><button class="story-save" type="button" data-card-save="${esc(a.slug)}" aria-label="${esc(isSaved(a.slug)?t("savedDone"):t("save"))}">${isSaved(a.slug)?"★":"☆"}</button></div><div class="story-copy"><div class="story-meta">${cardMeta(a)}</div><h3 class="story-title arabic-content" lang="ar" dir="rtl">${esc(a.title)}</h3><p class="arabic-content" lang="ar" dir="rtl">${esc(a.excerpt||"")}</p><div class="story-bottom"><span>${readingTime(a)} ${esc(t("reading"))}</span>${roundArrow()}</div></div></article>`; }
  function compactConsole(a,index){ return `<button class="console-story interactive-open" type="button" data-open-article="${esc(a.slug)}"><span class="num">${String(index+1).padStart(2,"0")}</span><span><strong class="story-title arabic-content" lang="ar" dir="rtl">${esc(a.title)}</strong><small>${esc(categoryLabel(a))} · ${readingTime(a)} ${esc(t("reading"))}</small></span>${roundArrow()}</button>`; }
  function heroFeature(a){ return `<article class="hero-feature interactive-open" id="heroFeature" data-open-article="${esc(a.slug)}" tabindex="0" role="link"><img src="${esc(cover(a))}" alt="" width="900" height="900"><div class="hero-feature-copy"><span>${esc(categoryLabel(a))} · ${esc(formatDate(a.date))}</span><h2 class="story-title arabic-content" lang="ar" dir="rtl">${esc(a.title)}</h2><div class="meta"><span>${readingTime(a)} ${esc(t("reading"))}</span>${roundArrow()}</div></div></article>`; }

  function getStats(){ const out=[]; articles.forEach(a=>(a.stats||[]).forEach((s,i)=>out.push({article:a,stat:s,index:i}))); return out; }

  function renderHome(options={}){
    window.DanaBackend?.articleLeave?.();
    readingDock.hidden=true;document.body.classList.remove("focus-reading");
    document.title=state.lang==="ar"?"دانه بالجهر | أعمال صحفية":"Dana Aljahr | Editorial Portfolio";
    updateMeta(state.lang==="ar"?"الموقع الصحفي لدانه بالجهر — أخبار وتقارير ومقالات وتجارب تدريبية.":"Dana Aljahr's editorial portfolio — news, reports, essays and field experience.");
    renderRibbon();
    const newest=byDate();
    const heroCandidates=[articles.find(a=>a.slug==="media-ministry-visit"),articles.find(a=>a.slug==="data-to-decision"),articles.find(a=>a.slug==="scene-stronger-than-truth"),newest[0]].filter(Boolean);
    const selected=[articles.find(a=>a.slug==="data-to-decision"),articles.find(a=>a.slug==="first-job-mirage"),articles.find(a=>a.slug==="what-camera-does-not-see"),articles.find(a=>a.slug==="scene-stronger-than-truth"),articles.find(a=>a.slug==="attention-digital-age")].filter(Boolean);
    const training=getCategory("training")[0];
    const stats=getStats().slice(0,8);
    const recent=getRecent();
    const marquee=["NEWS","REPORTS","ESSAYS","FIELD NOTES","DATA","MEDIA","TECHNOLOGY","SOCIETY","دانه بالجهر","JEDDAH","2026"];

    main.innerHTML=`
      <section class="hero" id="home">
        <div class="shell hero-grid">
          <div class="hero-main reveal">
            <div class="hero-topline"><span class="edition-badge"><i></i> EDITORIAL PORTFOLIO · 2026</span><p>${esc(t("heroCopy"))}</p></div>
            <div class="hero-title-wrap"><div class="hero-kicker">DANA ALJAHR / JOURNALISM</div><h1>${state.lang==="ar"?`<span>دانه</span><span class="outline">بالجهر</span>`:`<span>DANA</span><span class="outline">ALJAHR</span>`}</h1></div>
            <div class="hero-statement"><p>${esc(state.lang==="ar"?"أكتب لأرتب المعلومة، وأفكك السؤال، وأترك للقارئ سببًا ليكمل إلى السطر التالي.":"I write to order information, unpack questions, and give the reader a reason to continue to the next line.")}</p><div class="hero-actions"><a class="cta magnetic" href="#work">${esc(t("exploreWork"))}${arrowSvg}</a><a class="cta-outline magnetic" href="#about">${esc(t("knowMe"))}</a></div></div>
          </div>
          <aside class="hero-side reveal">
            <div class="hero-side-head"><strong>${esc(t("latestArchive"))}</strong><span class="micro-label">NOW / 2026</span></div>
            ${heroFeature(heroCandidates[0])}
            <div class="hero-mini-stories">${heroCandidates.slice(1,4).map((a,i)=>`<button class="hero-mini" type="button" data-hero-select="${esc(a.slug)}"><span>0${i+2}</span><strong class="story-title arabic-content" lang="ar" dir="rtl">${esc(a.title)}</strong></button>`).join("")}</div>
          </aside>
        </div>
      </section>

      <div class="kinetic" aria-hidden="true"><div class="kinetic-track">${[...marquee,...marquee].map(x=>`<span class="kinetic-item"><i></i>${esc(x)}</span>`).join("")}</div></div>

      <section class="section" id="selected">
        <div class="shell">
          ${sectionHead("01","SELECTED WORK",t("selectedWork"),t("selectedDesc"))}
          <div class="rail-wrap"><div class="story-rail" id="selectedRail">${selected.map(storyCard).join("")}</div><div class="rail-controls"><button class="rail-btn" type="button" data-rail="prev" aria-label="Previous">←</button><button class="rail-btn" type="button" data-rail="next" aria-label="Next">→</button></div></div>
        </div>
      </section>

      <section class="section section-dark" id="work">
        <div class="shell">
          ${sectionHead("02","WORK ROOM",t("workRoom"),t("workDesc"),`data-open-archive="all"`)}
          <div class="work-console reveal" id="workConsole"></div>
        </div>
      </section>

      <section class="section" id="about">
        <div class="shell">
          <div class="about-layout">
            <div class="about-sticky reveal"><span class="micro-label">03 / ABOUT</span><h2>${esc(t("aboutTitle"))}</h2><p>${esc(t("aboutLead"))}</p><p>${esc(t("aboutBody"))}</p><div class="about-signature"><img src="assets/brand/dana-mark.png" alt=""><span><strong>${esc(t("name"))}</strong><small>${esc(t("portfolio"))} · 2026</small></span></div></div>
            <div class="about-panels">
              <div class="about-panel reveal"><div class="about-panel-head"><strong>${esc(t("journey"))}</strong><span>01—03</span></div><div class="timeline"><div class="timeline-item"><span class="year">01</span><div><h3>${esc(t("pathStudy"))}</h3><p>${esc(t("pathStudyText"))}</p></div></div><div class="timeline-item"><span class="year">02</span><div><h3>${esc(t("pathField"))}</h3><p>${esc(t("pathFieldText"))}</p></div></div><div class="timeline-item"><span class="year">03</span><div><h3>${esc(t("pathWriting"))}</h3><p>${esc(t("pathWritingText"))}</p></div></div></div></div>
              <div class="about-panel reveal"><div class="about-panel-head"><strong>${esc(t("paths"))}</strong><span>WHAT I DO</span></div><div class="discipline-grid"><div class="discipline"><span>01 / NEWS</span><strong>${esc(t("newsPath"))}</strong><p>${esc(t("newsPathText"))}</p></div><div class="discipline"><span>02 / REPORT</span><strong>${esc(t("reportPath"))}</strong><p>${esc(t("reportPathText"))}</p></div><div class="discipline"><span>03 / ESSAY</span><strong>${esc(t("articlePath"))}</strong><p>${esc(t("articlePathText"))}</p></div><div class="discipline"><span>04 / FIELD</span><strong>${esc(t("trainingPath"))}</strong><p>${esc(t("trainingPathText"))}</p></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-dark" id="insights">
        <div class="shell">
          ${sectionHead("04","DATA INSIDE STORIES",t("insideNumbers"),t("insideNumbersDesc"))}
          <div class="insights-grid">${stats.map(({article,stat})=>`<button class="insight-card reveal interactive-open" type="button" data-open-article="${esc(article.slug)}"><span class="micro-label">${esc(categoryLabel(article))}</span><div><strong class="insight-num" data-count-text="${esc(stat.number)}">${esc(stat.number)}</strong><p class="arabic-content" lang="ar" dir="rtl">${esc(stat.label)}</p></div><div class="insight-link"><small class="story-title arabic-content" lang="ar" dir="rtl">${esc(article.title)}</small>${roundArrow()}</div></button>`).join("")}</div>
        </div>
      </section>

      ${training?`<section class="section" id="training"><div class="shell training-shell"><div class="training-intro reveal"><div><span class="micro-label">05 / FIELD EXPERIENCE</span><h2>${esc(t("fieldTitle"))}</h2><p class="arabic-content" lang="ar" dir="rtl">${esc(training.excerpt||"")}</p></div><button class="cta magnetic" type="button" data-open-article="${esc(training.slug)}">${esc(t("fullExperience"))}${arrowSvg}</button></div><div class="training-steps reveal" id="trainingSteps">${(training.benefits||[]).map((b,i)=>`<button class="training-step" type="button" data-open-article="${esc(training.slug)}"><span>${String(i+1).padStart(2,"0")}</span><p class="arabic-content" lang="ar" dir="rtl">${esc(b)}</p><i>↗</i></button>`).join("")}<button class="training-expand" id="trainingExpand" type="button">${esc(t("showAll"))} +</button></div></div></section>`:""}

      ${recent.length?`<section class="section" id="recent"><div class="shell">${sectionHead("06","CONTINUE READING",t("recent"),t("recentDesc"))}<div class="story-rail">${recent.map(storyCard).join("")}</div></div></section>`:""}

      <section class="section" id="archive">
        <div class="shell">
          ${sectionHead(recent.length?"07":"06","FULL ARCHIVE",t("fullArchive"),t("archiveDesc"))}
          <div class="archive-toolbar reveal"><div class="archive-cats" id="archiveCats"></div><label class="archive-query">${searchSvg}<input id="archiveSearch" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(t("startTitle"))}"></label><div class="view-toggle"><button type="button" data-view="list" aria-label="${esc(t("list"))}">${listSvg}</button><button type="button" data-view="grid" aria-label="${esc(t("grid"))}">${gridSvg}</button></div></div>
          <div class="saved-only-note" id="archiveStatus"></div><div id="archiveResults"></div><div class="load-more"><button class="cta-outline" id="loadMore" type="button">${esc(t("loadMore"))} +</button></div>
        </div>
      </section>`;

    renderWorkConsole();renderArchive();bindDynamic();setupReveal();setupCounters();setupSectionSpy();setupTilt();setupMagnetic();setupDragRails();
    if(options.anchor) setTimeout(()=>document.getElementById(options.anchor)?.scrollIntoView({behavior:"smooth"}),60); else if(!options.preserveScroll) scrollTo({top:0,behavior:"auto"});
  }

  function renderWorkConsole(){
    const root=$("#workConsole");if(!root)return;
    const tabs=["all","news","report","article","training"];
    const labels={all:t("selected"),news:t("news"),report:t("reports"),article:t("articles"),training:t("training")};
    let list=state.workCategory==="all"?byDate(articles.filter(a=>a.pick||a.featured)):getCategory(state.workCategory);
    if(!list.length)list=byDate();const lead=list[0],side=list.slice(1,5);
    root.innerHTML=`<div class="console-tabs">${tabs.map(cat=>`<button class="console-tab ${cat===state.workCategory?"active":""}" type="button" data-work-category="${cat}"><span>${esc(labels[cat])}</span><small>${cat==="all"?list.length:typeCount(cat)}</small></button>`).join("")}</div><div class="console-window"><article class="console-lead interactive-open" data-open-article="${esc(lead.slug)}" tabindex="0" role="link"><img src="${esc(cover(lead))}" alt=""><div class="console-lead-copy"><div class="card-top"><span>${esc(categoryLabel(lead))}</span><span>${esc(formatDate(lead.date))}</span></div><h3 class="story-title arabic-content" lang="ar" dir="rtl">${esc(lead.title)}</h3><p class="arabic-content" lang="ar" dir="rtl">${esc(lead.excerpt||"")}</p></div></article><div class="console-list">${side.map(compactConsole).join("")}</div></div><div class="console-footer"><span>${list.length} ${esc(t("stories"))}</span><button class="inline-link" type="button" data-open-archive="${state.workCategory}">${esc(t("openArchive"))}</button></div>`;
    bindArticleOpen(root);setupCursorTargets(root);
  }

  function archiveCategories(){ return [["all",t("all")],["news",t("news")],["report",t("reports")],["article",t("articles")],["training",t("training")],["saved",t("saved")]]; }
  function renderArchive(){
    const cats=$("#archiveCats"),results=$("#archiveResults"),status=$("#archiveStatus"),more=$("#loadMore");if(!cats||!results)return;
    cats.innerHTML=archiveCategories().map(([id,label])=>`<button class="archive-cat ${id===(state.savedOnly?"saved":state.archiveCategory)?"active":""}" type="button" data-archive-cat="${id}">${esc(label)}</button>`).join("");
    $$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.archiveView));
    let list=byDate(articles);
    if(state.savedOnly){const saved=savedSlugs();list=list.filter(a=>saved.has(a.slug));}
    else if(state.archiveCategory!=="all")list=list.filter(a=>categoryOf(a)===state.archiveCategory);
    if(state.archiveQuery.trim())list=list.filter(a=>titleMatches(a,state.archiveQuery));
    status.textContent=`${list.length} ${t("archiveCount")}${state.savedOnly?` · ${t("savedOnly")}`:""}`;
    const visible=list.slice(0,state.visible);
    if(!visible.length){results.innerHTML=`<div class="archive-empty">${esc(state.savedOnly?t("savedEmpty"):t("noResults"))}</div>`;more.hidden=true;return;}
    if(state.archiveView==="grid")results.innerHTML=`<div class="archive-grid">${visible.map(storyCard).join("")}</div>`;
    else results.innerHTML=`<div class="archive-list">${visible.map((a,i)=>`<article class="archive-row reveal interactive-open" data-open-article="${esc(a.slug)}" tabindex="0" role="link"><span class="idx">${String(i+1).padStart(2,"0")}</span><span class="type">${esc(categoryLabel(a))}</span><h3 class="story-title arabic-content" lang="ar" dir="rtl">${highlight(a.title,state.archiveQuery)}</h3><span class="date">${esc(formatDate(a.date))}</span>${roundArrow()}</article>`).join("")}</div>`;
    more.hidden=visible.length>=list.length;bindArticleOpen(results);setupReveal(results);setupTilt(results);setupCursorTargets(results);
  }

  function renderArticle(a,options={}){
    addRecent(a.slug);readingDock.hidden=false;document.body.classList.remove("focus-reading");
    document.title=`${a.title} | ${state.lang==="ar"?"دانه بالجهر":"Dana Aljahr"}`;updateMeta(a.excerpt||a.title);renderRibbon();
    const sorted=byDate();const idx=sorted.findIndex(x=>x.slug===a.slug);const prev=sorted[idx+1]||null,next=sorted[idx-1]||null;
    const related=byDate(articles.filter(x=>x.slug!==a.slug && categoryOf(x)===categoryOf(a))).slice(0,3);
    const stats=a.stats?.length?`<div class="stats-block reveal"><h2>${esc(t("insideNumbers"))}</h2><div class="article-stats">${a.stats.map(s=>`<div class="article-stat"><strong>${esc(s.number)}</strong><span class="arabic-content" lang="ar" dir="rtl">${esc(s.label)}</span></div>`).join("")}</div></div>`:"";
    const benefits=a.benefits?.length?`<div class="benefits-block reveal"><h2>${esc(t("fieldTitle"))}</h2>${a.benefits.map((b,i)=>`<div class="benefit-item"><span>${String(i+1).padStart(2,"0")}</span><p class="arabic-content" lang="ar" dir="rtl">${esc(b)}</p></div>`).join("")}</div>`:"";
    main.innerHTML=`<article class="article-page" data-current-article="${esc(a.slug)}">
      <header class="article-hero"><div class="shell"><button class="article-back" id="articleBack" type="button">${state.lang==="ar"?"→":"←"} ${esc(t("back"))}</button><div class="article-hero-grid"><div><div class="article-kicker"><i></i><span>${esc(categoryLabel(a))}</span><span>·</span><span>${esc(t("originalArabic"))}</span></div><h1 class="arabic-content" lang="ar" dir="rtl">${esc(a.title)}</h1><p class="article-deck arabic-content" lang="ar" dir="rtl">${esc(a.excerpt||"")}</p></div><div class="article-side-meta"><div class="meta-row"><span>${esc(t("author"))}</span><strong>${esc(a.author||"دانه بالجهر")}</strong></div><div class="meta-row"><span>${esc(t("place"))}</span><strong>${esc(a.place||"")}</strong></div><div class="meta-row"><span>${esc(t("date"))}</span><strong>${esc(formatDate(a.date))}</strong></div><div class="meta-row"><span>${esc(t("readTime"))}</span><strong>${readingTime(a)} ${esc(t("reading"))}</strong></div></div></div></div><div class="article-cover reveal"><img src="${esc(cover(a))}" alt="" width="1600" height="900"></div></header>
      <div class="article-body-shell">
        <aside class="article-aside"><div class="aside-block"><span>${esc(t("article"))}</span><strong class="arabic-content" lang="ar" dir="rtl">${esc(categoryLabel(a))}</strong></div><div class="aside-block"><span>${esc(t("font"))}</span><div class="reading-controls"><button type="button" data-font="minus">A−</button><button type="button" data-font="plus">A+</button></div></div><div class="aside-block"><span>${esc(t("width"))}</span><div class="reading-controls"><button type="button" data-width="narrow">↔</button><button type="button" data-width="wide">⇔</button></div></div><div class="aside-block"><button type="button" data-share>${esc(t("share"))} ↗</button><button type="button" data-save="${esc(a.slug)}">${isSaved(a.slug)?esc(t("savedDone")):esc(t("save"))} ${isSaved(a.slug)?"★":"☆"}</button></div></aside>
        <div class="article-body arabic-content" lang="ar" dir="rtl">${(a.body||[]).map(p=>`<p class="reveal">${esc(p)}</p>`).join("")}${stats}${benefits}<div class="article-end reveal"><span>${esc(t("writtenBy"))}</span><strong>${esc(a.author||"دانه بالجهر")}</strong></div></div>
        <aside class="article-right"><div class="aside-block"><span>${esc(t("tags"))}</span><div class="tags">${(a.tags||[]).map(tag=>`<span class="arabic-content" lang="ar" dir="rtl">${esc(tag)}</span>`).join("")}</div></div><div class="author-card"><img src="assets/brand/dana-mark.png" alt=""><strong>${esc(t("name"))}</strong><p>${esc(t("portfolio"))}</p></div></aside>
      </div>
      <nav class="article-nav">${prev?`<button type="button" data-open-article="${esc(prev.slug)}"><span>${esc(t("previous"))}</span><strong class="arabic-content" lang="ar" dir="rtl">${esc(prev.title)}</strong></button>`:"<span></span>"}${next?`<button type="button" data-open-article="${esc(next.slug)}"><span>${esc(t("next"))}</span><strong class="arabic-content" lang="ar" dir="rtl">${esc(next.title)}</strong></button>`:""}</nav>
      ${related.length?`<section class="related"><div class="shell"><span class="micro-label">KEEP READING</span><h2>${esc(t("keepReading"))}</h2><div class="story-rail">${related.map(storyCard).join("")}</div></div></section>`:""}
    </article>`;
    readingDock.innerHTML=`<button type="button" data-dock-font="minus">A−</button><button type="button" data-dock-font="plus">A+</button><div class="dock-progress"><i></i></div><button type="button" data-dock-save="${esc(a.slug)}">${isSaved(a.slug)?"★":"☆"}</button><button type="button" data-focus>${esc(t("focus"))}</button>`;
    bindArticleOpen(main);bindArticleControls(a);setupReveal();setupTilt();setupCursorTargets();window.DanaBackend?.articleView?.(a.slug);if(!options.preserveScroll)scrollTo({top:0,behavior:"auto"});
  }

  function bindArticleControls(a){
    $("#articleBack")?.addEventListener("click",()=>history.length>1?history.back():navigateHome());
    $$('[data-font="minus"],[data-dock-font="minus"]').forEach(b=>b.addEventListener("click",()=>changeFont(-1)));
    $$('[data-font="plus"],[data-dock-font="plus"]').forEach(b=>b.addEventListener("click",()=>changeFont(1)));
    $('[data-width="narrow"]')?.addEventListener("click",()=>changeWidth("narrow"));
    $('[data-width="wide"]')?.addEventListener("click",()=>changeWidth("wide"));
    $$('[data-save],[data-dock-save]').forEach(b=>b.addEventListener("click",()=>{toggleSaved(a.slug);route({preserveScroll:true});}));
    $('[data-share]')?.addEventListener("click",shareCurrent);
    $('[data-focus]')?.addEventListener("click",()=>{document.body.classList.toggle("focus-reading");$('[data-focus]').textContent=document.body.classList.contains("focus-reading")?t("exitFocus"):t("focus");});
  }
  function changeFont(delta){ const root=document.documentElement;const cur=parseFloat(getComputedStyle(root).getPropertyValue("--reading-size"))||19;root.style.setProperty("--reading-size",`${Math.min(24,Math.max(16,cur+delta))}px`); }
  function changeWidth(mode){ document.documentElement.style.setProperty("--reading-width",mode==="wide"?"900px":"680px"); }

  function bindDynamic(){
    bindArticleOpen(main);
    $$("[data-work-category]").forEach(b=>b.addEventListener("click",()=>{state.workCategory=b.dataset.workCategory;transition(()=>renderWorkConsole());}));
    $$("[data-open-archive]").forEach(b=>b.addEventListener("click",()=>openArchive(b.dataset.openArchive)));
    $$("[data-hero-select]").forEach(b=>b.addEventListener("click",()=>selectHero(b.dataset.heroSelect)));
    $$("[data-rail]").forEach(b=>b.addEventListener("click",()=>{const rail=$("#selectedRail");const dir=b.dataset.rail==="next"?1:-1;rail?.scrollBy({left:dir*rail.clientWidth*.78,behavior:"smooth"});}));
    $("#trainingExpand")?.addEventListener("click",()=>{const r=$("#trainingSteps");r.classList.toggle("expanded");$("#trainingExpand").textContent=r.classList.contains("expanded")?`${t("showLess")} −`:`${t("showAll")} +`;});
    $("#archiveSearch")?.addEventListener("input",e=>{state.archiveQuery=e.target.value;state.visible=9;renderArchive();});
    $("#archiveCats")?.addEventListener("click",e=>{const b=e.target.closest("[data-archive-cat]");if(!b)return;const cat=b.dataset.archiveCat;state.savedOnly=cat==="saved";if(!state.savedOnly)state.archiveCategory=cat;state.visible=9;renderArchive();});
    $$("[data-view]").forEach(b=>b.addEventListener("click",()=>{state.archiveView=b.dataset.view;storage.set("dana.archiveView",state.archiveView);renderArchive();}));
    $("#loadMore")?.addEventListener("click",()=>{state.visible+=9;renderArchive();});
    setupCursorTargets();
  }

  function selectHero(slug){ const a=articles.find(x=>x.slug===slug),root=$("#heroFeature");if(!a||!root)return;transition(()=>{root.dataset.openArticle=a.slug;$("img",root).src=cover(a);$("span",$(".hero-feature-copy",root)).textContent=`${categoryLabel(a)} · ${formatDate(a.date)}`;$("h2",root).textContent=a.title;$(".meta>span",root).textContent=`${readingTime(a)} ${t("reading")}`;}); }
  function openArchive(cat="all"){ if(cat==="stats")cat="all";state.savedOnly=cat==="saved";state.archiveCategory=["news","report","article","training"].includes(cat)?cat:"all";state.visible=9;document.getElementById("archive")?.scrollIntoView({behavior:"smooth"});setTimeout(renderArchive,350); }

  function bindArticleOpen(root=document){
    $$('[data-open-article]',root).forEach(el=>{if(el.dataset.bound)return;el.dataset.bound="1";const go=e=>{const nested=e.target.closest?.("button,a");if(nested&&nested!==el&&nested.closest("[data-open-article]")===el)return;navigateArticle(el.dataset.openArticle)};el.addEventListener("click",go);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();navigateArticle(el.dataset.openArticle)}});});
  }
  function navigateArticle(slug){ if(!articles.some(a=>a.slug===slug))return;closeSearch();closeDrawer();transition(()=>{history.pushState({article:slug},"",articleUrl(slug));window.DanaBackend?.pageView?.();route();}); }
  function navigateHome(anchor=""){ closeSearch();closeDrawer();transition(()=>{history.pushState({},"",location.pathname+(anchor?`#${anchor}`:""));window.DanaBackend?.pageView?.();renderHome({anchor});}); }
  function route(options={}){ const slug=new URLSearchParams(location.search).get("article");const a=articles.find(x=>x.slug===slug);a?renderArticle(a,options):renderHome(options);applyPreferences(); }
  function updateMeta(desc){ $('meta[name="description"]')?.setAttribute("content",desc);$('meta[property="og:description"]')?.setAttribute("content",desc);$('meta[property="og:title"]')?.setAttribute("content",document.title); }

  /* Search */
  const searchPanel=$("#searchPanel"),searchInput=$("#globalSearch"),searchStatus=$("#searchStatus"),quickResults=$("#quickResults"),clearSearch=$("#clearSearch"),searchToggle=$("#searchToggle");
  function openSearch(){ searchPanel.hidden=false;searchPanel.setAttribute("aria-hidden","false");searchToggle.setAttribute("aria-expanded","true");document.body.classList.add("no-scroll");state.searchIndex=-1;renderSearch(searchInput.value);setTimeout(()=>searchInput.focus(),40); }
  function closeSearch(){ if(searchPanel.hidden)return;searchPanel.hidden=true;searchPanel.setAttribute("aria-hidden","true");searchToggle.setAttribute("aria-expanded","false");searchInput.value="";quickResults.innerHTML="";clearSearch.hidden=true;document.body.classList.remove("no-scroll");state.searchIndex=-1; }
  function renderSearch(q){ q=String(q||"").trim();clearSearch.hidden=!q;if(q.length>=2&&window.__danaLastSearch!==q){window.__danaLastSearch=q;window.DanaBackend?.recordEvent?.("search",null,{query:q});}if(!q){searchStatus.textContent=t("noBefore");quickResults.innerHTML=`<div class="search-start"><strong>${esc(t("searchStart"))}</strong><p>${esc(t("searchStartDesc"))}</p></div>`;return;}const hits=articles.map(a=>({a,score:titleScore(a,q)})).filter(x=>Number.isFinite(x.score)).sort((x,y)=>x.score-y.score||String(y.a.date).localeCompare(String(x.a.date))).slice(0,14).map(x=>x.a);searchStatus.textContent=hits.length?`${hits.length} ${t("results")}`:t("noResults");quickResults.innerHTML=hits.length?hits.map((a,i)=>`<button class="quick-result" type="button" data-search-open="${esc(a.slug)}"><span class="qr-index">${String(i+1).padStart(2,"0")}</span><span><strong class="arabic-content" lang="ar" dir="rtl">${highlight(a.title,q)}</strong><span class="qr-meta"><span>${esc(categoryLabel(a))}</span><span>·</span><span>${esc(formatDate(a.date))}</span></span></span>${roundArrow()}</button>`).join(""):`<div class="search-empty"><strong>${esc(t("noResults"))}</strong><p>${esc(t("tryOther"))}</p></div>`;state.searchIndex=-1; }
  function keyboardSearch(delta){const items=$$(".quick-result",quickResults);if(!items.length)return;state.searchIndex=(state.searchIndex+delta+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle("keyboard-active",i===state.searchIndex));items[state.searchIndex].scrollIntoView({block:"nearest"});}

  /* Drawer */
  const drawer=$("#mobileDrawer"),drawerBackdrop=$("#drawerBackdrop"),menuToggle=$("#menuToggle");
  function openDrawer(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");drawerBackdrop.hidden=false;menuToggle.setAttribute("aria-expanded","true");document.body.classList.add("no-scroll");}
  function closeDrawer(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");drawerBackdrop.hidden=true;menuToggle.setAttribute("aria-expanded","false");if(searchPanel.hidden)document.body.classList.remove("no-scroll");}

  async function shareCurrent(){ const slug=new URLSearchParams(location.search).get("article");window.DanaBackend?.recordEvent?.("share",slug);if(navigator.share){try{await navigator.share({title:document.title,url:location.href});return}catch(e){if(e.name==="AbortError")return}}try{await navigator.clipboard.writeText(location.href);toast(t("copyLink"))}catch{toast(location.href)} }
  function toast(msg){clearTimeout(toastTimer);const el=$("#toast");el.textContent=msg;el.hidden=false;toastTimer=setTimeout(()=>el.hidden=true,2200);}
  function updateSavedUI(){const n=savedSlugs().size;$("#savedCount")&&( $("#savedCount").textContent=n );const footer=$("#footerCount");if(footer)footer.textContent=`${articles.length} ${t("stories")}`;}

  function setupReveal(root=document){revealObserver?.disconnect();if(matchMedia("(prefers-reduced-motion: reduce)").matches){$$(".reveal",root).forEach(x=>x.classList.add("shown"));return}revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("shown");revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -35px"});$$(".reveal:not(.shown)",root).forEach((x,i)=>{x.style.transitionDelay=`${(i%5)*35}ms`;revealObserver.observe(x)});}
  function setupCounters(){countObserver?.disconnect();countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,raw=el.dataset.countText||el.textContent;const m=raw.match(/^([^\d-]*)(-?[\d,.]+)(.*)$/);if(!m){countObserver.unobserve(el);return}const target=parseFloat(m[2].replace(/,/g,""));if(!Number.isFinite(target)){countObserver.unobserve(el);return}const decimals=(m[2].split(".")[1]||"").length,start=performance.now(),dur=900;function tick(now){const p=Math.min(1,(now-start)/dur),ease=1-Math.pow(1-p,3),v=target*ease;el.textContent=`${m[1]}${v.toLocaleString(state.lang==="ar"?"ar-SA":"en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}${m[3]}`;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);countObserver.unobserve(el)}),{threshold:.5});$$('[data-count-text]').forEach(x=>countObserver.observe(x));}
  function setupSectionSpy(){sectionObserver?.disconnect();const ids=["selected","work","about","insights","training","archive"];const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);if(!sections.length)return;sectionObserver=new IntersectionObserver(entries=>{const v=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;const id=v.target.id;$$('.ribbon-item').forEach(b=>{let active=b.dataset.target===id;if(id==="work"&&["news","report","article"].includes(b.dataset.ribbonAction))active=b.dataset.ribbonAction===state.workCategory;b.classList.toggle("active",active);});$$('.primary-nav a').forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${id}`));},{rootMargin:"-35% 0px -50%",threshold:[.05,.2,.5]});sections.forEach(s=>sectionObserver.observe(s));}
  function setupTilt(root=document){if(!matchMedia("(pointer:fine)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;$$('[data-tilt]',root).forEach(el=>{if(el.dataset.tiltBound)return;el.dataset.tiltBound="1";el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`translateY(-5px) perspective(800px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`});el.addEventListener("pointerleave",()=>el.style.transform="");});}
  function setupMagnetic(root=document){if(!matchMedia("(pointer:fine)").matches)return;$$('.magnetic',root).forEach(el=>{if(el.dataset.magBound)return;el.dataset.magBound="1";el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${((e.clientX-r.left-r.width/2)*.08).toFixed(1)}px,${((e.clientY-r.top-r.height/2)*.08).toFixed(1)}px)`});el.addEventListener("pointerleave",()=>el.style.transform="");});}
  function setupCursorTargets(root=document){if(!matchMedia("(pointer:fine)").matches)return;$$('.interactive-open',root).forEach(el=>{if(el.dataset.cursorBound)return;el.dataset.cursorBound="1";el.addEventListener("mouseenter",()=>cursorOrb.classList.add("visible"));el.addEventListener("mouseleave",()=>cursorOrb.classList.remove("visible"));});}
  function setupDragRails(root=document){if(!matchMedia("(pointer:fine)").matches)return;$$('.story-rail',root).forEach(rail=>{if(rail.dataset.dragBound)return;rail.dataset.dragBound="1";let down=false,startX=0,startScroll=0,moved=false;rail.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;down=true;moved=false;startX=e.clientX;startScroll=rail.scrollLeft;rail.setPointerCapture?.(e.pointerId);rail.classList.add("dragging")});rail.addEventListener("pointermove",e=>{if(!down)return;const d=e.clientX-startX;if(Math.abs(d)>5)moved=true;rail.scrollLeft=startScroll-d});rail.addEventListener("pointerup",()=>{down=false;rail.classList.remove("dragging")});rail.addEventListener("pointercancel",()=>{down=false;rail.classList.remove("dragging")});rail.addEventListener("click",e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);});}

  function onScroll(){header.classList.toggle("scrolled",scrollY>8);const max=document.documentElement.scrollHeight-innerHeight,p=max>0?Math.min(100,scrollY/max*100):0;if(progressBar)progressBar.style.width=`${p}%`;const dock=$(".dock-progress i");if(dock)dock.style.width=`${p}%`;}
  function bindGlobal(){
    applyPreferences();renderRibbon();updateSavedUI();
    $("#langToggle")?.addEventListener("click",()=>setLanguage(state.lang==="ar"?"en":"ar"));
    $("#themeToggle")?.addEventListener("click",toggleTheme);$("#footerTheme")?.addEventListener("click",toggleTheme);$("#footerLang")?.addEventListener("click",()=>setLanguage(state.lang==="ar"?"en":"ar"));$("#footerTop")?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
    searchToggle.addEventListener("click",openSearch);searchInput.addEventListener("input",e=>renderSearch(e.target.value));clearSearch.addEventListener("click",()=>{searchInput.value="";renderSearch("");searchInput.focus()});quickResults.addEventListener("click",e=>{const b=e.target.closest("[data-search-open]");if(b)navigateArticle(b.dataset.searchOpen)});$$("[data-search-close]").forEach(x=>x.addEventListener("click",closeSearch));
    menuToggle.addEventListener("click",openDrawer);$("#drawerClose")?.addEventListener("click",closeDrawer);drawerBackdrop.addEventListener("click",closeDrawer);$("#drawerSearch")?.addEventListener("click",()=>{closeDrawer();openSearch()});$$("[data-drawer-lang]").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.drawerLang)));
    $("#savedShortcut")?.addEventListener("click",()=>{state.savedOnly=true;navigateHome("archive");setTimeout(renderArchive,100)});$("#randomStory")?.addEventListener("click",()=>{const a=articles[Math.floor(Math.random()*articles.length)];toast(t("randomToast"));setTimeout(()=>navigateArticle(a.slug),220)});
    ribbonTrack.addEventListener("click",e=>{const b=e.target.closest("[data-ribbon-action]");if(!b)return;const action=b.dataset.ribbonAction,target=b.dataset.target;const inArticle=new URLSearchParams(location.search).has("article");if(["news","report","article"].includes(action))state.workCategory=action;if(action==="archive"){state.savedOnly=false;state.archiveCategory="all";}if(inArticle){navigateHome(target);return;}if(["news","report","article"].includes(action))renderWorkConsole();document.getElementById(target)?.scrollIntoView({behavior:"smooth"});if(action==="archive")setTimeout(renderArchive,250);});
    document.addEventListener("click",e=>{const save=e.target.closest("[data-card-save]");if(save){e.preventDefault();e.stopPropagation();const added=toggleSaved(save.dataset.cardSave);save.textContent=added?"★":"☆";save.setAttribute("aria-label",added?t("savedDone"):t("save"));return;}const a=e.target.closest("[data-home-anchor]");if(a&&new URLSearchParams(location.search).has("article")){e.preventDefault();navigateHome(a.dataset.homeAnchor)}else if(a)closeDrawer();const h=e.target.closest("[data-home-link]");if(h&&new URLSearchParams(location.search).has("article")){e.preventDefault();navigateHome();}});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeDrawer()}if(e.key==="/"&&searchPanel.hidden&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||"")){e.preventDefault();openSearch()}if(!searchPanel.hidden&&e.key==="ArrowDown"){e.preventDefault();keyboardSearch(1)}if(!searchPanel.hidden&&e.key==="ArrowUp"){e.preventDefault();keyboardSearch(-1)}if(!searchPanel.hidden&&e.key==="Enter"&&state.searchIndex>=0){const item=$$(".quick-result",quickResults)[state.searchIndex];if(item)navigateArticle(item.dataset.searchOpen)}});
    addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll,{passive:true});addEventListener("popstate",()=>{window.DanaBackend?.pageView?.();route();});
    if(matchMedia("(pointer:fine)").matches){addEventListener("pointermove",e=>{cursorOrb.style.left=`${e.clientX}px`;cursorOrb.style.top=`${e.clientY}px`;const hero=$(".hero");if(hero){const r=hero.getBoundingClientRect();hero.style.setProperty("--pointer-x",`${e.clientX-r.left}px`);hero.style.setProperty("--pointer-y",`${e.clientY-r.top}px`);}});}
    if("serviceWorker" in navigator) addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
  }

  async function boot(){
    if(window.DanaBackend?.loadPublishedArticles){articles=await window.DanaBackend.loadPublishedArticles(articles);}
    if(!articles.length){main.innerHTML=`<div class="shell" style="padding:80px 0">تعذر تحميل articles.js.</div>`;return;}
    bindGlobal();route();onScroll();window.DanaBackend?.pageView?.();
    const intro=$("#siteIntro");
    if(intro){const seen=sessionStorage.getItem("dana.introSeen");if(seen)intro.remove();else{sessionStorage.setItem("dana.introSeen","1");setTimeout(()=>intro.classList.add("out"),520);setTimeout(()=>intro.remove(),1050);}}
  }
  boot();
})();
