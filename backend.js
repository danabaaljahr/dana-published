(() => {
  'use strict';
  const PROJECT_URL = 'https://vffsndkoaswcnnlzpvuu.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZnNuZGtvYXN3Y25ubHpwdnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDYxMzEsImV4cCI6MjEwMzQ4MjEzMX0.SFssdBRp_XAlezCsJqGQ8xLfs8iu3vmaSBivAXfAWyE';
  const API = `${PROJECT_URL}/rest/v1`;

  const fallback = {
    news: 'assets/covers/default-news.svg',
    report: 'assets/covers/default-report.svg',
    article: 'assets/covers/default-article.svg',
    training: 'assets/covers/default-training.svg'
  };
  const labels = {news:'خبر',report:'تقرير',article:'مقال',training:'تجربة تدريبية'};

  function id(key, store) {
    try {
      const s = store || localStorage;
      let v = s.getItem(key);
      if (!v) { v = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; s.setItem(key, v); }
      return v;
    } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
  }
  const visitorKey = id('dana.analytics.visitor');
  const sessionKey = id('dana.analytics.session', sessionStorage);
  let sessionSent = false;
  let activeArticle = null;
  let articleStartedAt = 0;
  let scroll50 = false, scroll90 = false;

  function device() {
    const w = Math.max(screen.width || 0, innerWidth || 0);
    if (w < 768) return 'mobile';
    if (w < 1100) return 'tablet';
    return 'desktop';
  }
  function lang() { return document.documentElement.lang || 'ar'; }
  function headers(extra={}) {
    return {'apikey':ANON_KEY,'Authorization':`Bearer ${ANON_KEY}`,'Content-Type':'application/json',...extra};
  }
  async function rest(path, options={}) {
    const res = await fetch(`${API}${path}`, { ...options, headers: headers(options.headers || {}) });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    if (res.status === 204) return null;
    return res.json();
  }
  function normalize(row) {
    const publishedDate = row.published_date || (row.published_at ? new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(row.published_at)) : '');
    return {
      slug: row.slug,
      type: row.type,
      typeLabel: labels[row.type] || row.type,
      title: row.title,
      date: publishedDate,
      place: row.place || 'جدة',
      author: row.author || 'دانه بالجهر',
      image: row.image_url || fallback[row.type] || fallback.article,
      featured: !!row.featured,
      pick: !!row.featured,
      tags: Array.isArray(row.tags) ? row.tags : [],
      excerpt: row.excerpt || '',
      body: String(row.body || '').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean),
      cms: true
    };
  }
  async function loadPublishedArticles(staticArticles) {
    try {
      const rows = await rest('/cms_articles?status=eq.published&select=*&order=published_at.desc.nullslast');
      const remote = (rows || []).map(normalize);
      const map = new Map((staticArticles || []).map(a => [a.slug, a]));
      remote.forEach(a => map.set(a.slug, a));
      return [...map.values()];
    } catch (e) {
      console.warn('Dana CMS unavailable; using bundled archive.', e);
      return staticArticles || [];
    }
  }
  async function recordEvent(eventType, articleSlug=null, metadata={}) {
    try {
      if (!sessionSent) {
        sessionSent = true;
        fetch(`${API}/rpc/record_event`, {method:'POST', headers:headers(), keepalive:true, body:JSON.stringify({
          p_event_type:'session_start', p_article_slug:null, p_path:location.pathname+location.search, p_visitor_key:visitorKey,
          p_session_key:sessionKey, p_referrer:document.referrer || '', p_device:device(), p_language:lang(), p_metadata:{}
        })}).catch(()=>{});
      }
      await fetch(`${API}/rpc/record_event`, {method:'POST', headers:headers(), keepalive:true, body:JSON.stringify({
        p_event_type:eventType, p_article_slug:articleSlug, p_path:location.pathname+location.search, p_visitor_key:visitorKey,
        p_session_key:sessionKey, p_referrer:document.referrer || '', p_device:device(), p_language:lang(), p_metadata:metadata || {}
      })});
    } catch {}
  }
  function pageView() { recordEvent('page_view'); }
  function articleView(slug) {
    if (activeArticle === slug) return;
    if (activeArticle && activeArticle !== slug) articleLeave();
    activeArticle = slug; articleStartedAt = Date.now(); scroll50 = false; scroll90 = false;
    recordEvent('article_view', slug);
  }
  function articleLeave() {
    if (!activeArticle || !articleStartedAt) return;
    const seconds = Math.max(1, Math.round((Date.now() - articleStartedAt)/1000));
    recordEvent('article_leave', activeArticle, {seconds});
    activeArticle = null; articleStartedAt = 0;
  }
  function onScroll() {
    if (!activeArticle) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const pct = scrollY / max;
    if (!scroll50 && pct >= .5) { scroll50 = true; recordEvent('scroll_50', activeArticle); }
    if (!scroll90 && pct >= .9) { scroll90 = true; recordEvent('scroll_90', activeArticle); }
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('pagehide', articleLeave);
  addEventListener('beforeunload', articleLeave);

  window.DanaBackend = {
    projectUrl: PROJECT_URL,
    anonKey: ANON_KEY,
    loadPublishedArticles,
    recordEvent,
    pageView,
    articleView,
    articleLeave,
    fallback
  };
})();
