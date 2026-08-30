(() => {
  'use strict';
  const PROJECT_URL = 'https://vffsndkoaswcnnlzpvuu.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYXNlIiwicmVmIjoidmZmc25ka29hc3djbm5senB2dXUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NzkwNjEzMSwiZXhwIjoyMTAzNDgyMTMxfQ.SFssdBRp_XAlezCsJqGQ8xLfs8iu3vmaSBivAXfAWyE';
  const API = `${PROJECT_URL}/rest/v1`;
  const headers = {apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`};
  const fallback = {
    news:'assets/covers/default-news.svg', report:'assets/covers/default-report.svg', article:'assets/covers/default-article.svg', training:'assets/covers/default-training.svg'
  };
  const category = row => row.slug === 'between-study-and-practice' ? 'training' : row.type;
  function splitBody(v){
    if(Array.isArray(v)) return v;
    return String(v||'').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  }
  function normalize(row){
    const cat = category(row);
    const en = row.title_en || row.body_en ? {
      title:row.title_en||'', excerpt:row.excerpt_en||'', body:splitBody(row.body_en), place:row.place_en||'Jeddah', tags:row.tags_en||[], stats:row.stats_en||[], benefits:row.benefits_en||[]
    } : null;
    return {
      slug:row.slug, type:row.type, typeLabel:cat==='training'?'تجربة تدريبية':(row.type==='news'?'خبر':row.type==='report'?'تقرير':'مقال'),
      title:row.title, excerpt:row.excerpt||'', body:splitBody(row.body), place:row.place||'جدة', author:row.author||'دانه بالجهر', tags:row.tags||[],
      date:row.published_date || (row.published_at?String(row.published_at).slice(0,10):String(row.created_at||'').slice(0,10)),
      publishedAt:row.published_at || row.created_at || row.published_date || '',
      updatedAt:row.updated_at || row.published_at || row.created_at || row.published_date || '',
      image:row.image_url || fallback[cat], featured:!!row.featured, pick:!!row.featured,
      stats:Array.isArray(row.stats)?row.stats:[], benefits:Array.isArray(row.benefits)?row.benefits:[],
      seriesId:row.series_id||null, seriesOrder:Number.isFinite(Number(row.series_order))?Number(row.series_order):null,
      en, showEnglish:row.show_en!==false && !!en, cms:true, status:row.status
    };
  }
  async function request(path, options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{const r=await fetch(API+path,{...options,cache:'no-store',signal:controller.signal,headers:{...headers,'Cache-Control':'no-cache',...((options&&options.headers)||{})}});if(!r.ok)throw new Error(`Backend ${r.status}`);const text=await r.text();return text?JSON.parse(text):null}finally{clearTimeout(timer)}
  }
  function normalizeSeries(row){
    return {
      id:row.id||null, slug:row.slug, title:row.title, description:row.description||'', coverUrl:row.cover_url||'', updatedAt:row.updated_at||row.created_at||'',
      title_en:row.title_en||'', description_en:row.description_en||'', status:row.status||'published',
      isOngoing:row.is_ongoing!==false, featured:!!row.featured, cms:!!row.id
    };
  }
  async function loadPublishedSeries(staticSeries=[]){
    try{
      const rows=await request('/cms_series?status=eq.published&select=*&order=featured.desc,created_at.desc');
      return (rows||[]).map(normalizeSeries);
    }catch(e){ console.error('Series CMS unavailable.',e); return null; }
  }
  async function loadPublishedArticles(staticArticles=[]){
    try{
      const rows=await request('/cms_articles?status=eq.published&select=*&order=published_date.desc.nullslast,published_at.desc');
      return (rows||[]).map(normalize);
    }catch(e){ console.error('Article CMS unavailable.',e); return null; }
  }
  const visitorKey=()=>{let k=localStorage.getItem('dana-visitor');if(!k){k=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;localStorage.setItem('dana-visitor',k)}return k};
  const sessionKey=()=>{let k=sessionStorage.getItem('dana-session');if(!k){k=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;sessionStorage.setItem('dana-session',k)}return k};
  const device=()=>matchMedia('(max-width: 760px)').matches?'mobile':matchMedia('(max-width: 1100px)').matches?'tablet':'desktop';
  async function event(type, slug=null, metadata={}){
    try{
      await fetch(`${PROJECT_URL}/rest/v1/rpc/record_event`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({
        p_event_type:type,p_article_slug:slug,p_path:location.pathname+location.search,p_visitor_key:visitorKey(),p_session_key:sessionKey(),p_referrer:document.referrer||'',p_device:device(),p_language:document.documentElement.lang||'ar',p_metadata:metadata
      })});
    }catch(_){ }
  }
  const seenSession='dana-session-seen';
  if(!sessionStorage.getItem(seenSession)){sessionStorage.setItem(seenSession,'1');event('session_start');}
  event('page_view');
  window.DanaBackend={PROJECT_URL,ANON_KEY,loadPublishedArticles,loadPublishedSeries,event,articleView:(s)=>event('article_view',s),search:(q)=>event('search',null,{query:q}),share:(s)=>event('share',s),save:(s)=>event('save',s),leave:(s,m={})=>event('article_leave',s,m)};
})();
