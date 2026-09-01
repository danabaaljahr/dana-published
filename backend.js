(() => {
  'use strict';
  const PROJECT_URL = 'https://vffsndkoaswcnnlzpvuu.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_VdtvaVY0ph621QwYpFnjpw_8ukceobx';
  const API = `${PROJECT_URL}/rest/v1`;
  const headers = {apikey: PUBLISHABLE_KEY};
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
      slug:row.slug, id:row.id||null, type:row.type, typeLabel:cat==='training'?'تجربة تدريبية':(row.type==='news'?'خبر':row.type==='report'?'تقرير':'مقال'),
      title:row.title, excerpt:row.excerpt||'', body:splitBody(row.body), place:row.place||'جدة', author:row.author||'دانه بالجهر', tags:row.tags||[],
      date:row.published_date || (row.published_at?String(row.published_at).slice(0,10):String(row.created_at||'').slice(0,10)),
      publishedAt:row.published_at || row.created_at || row.published_date || '',
      updatedAt:row.updated_at || row.published_at || row.created_at || row.published_date || '',
      image:row.image_url || fallback[cat], featured:!!row.featured, pick:!!row.featured,
      stats:Array.isArray(row.stats)?row.stats:[], benefits:Array.isArray(row.benefits)?row.benefits:[],
      seriesId:row.series_id||null, seriesOrder:Number.isFinite(Number(row.series_order))?Number(row.series_order):null,
      sectionId:row.section_id||null, sourceName:row.source_name||'', sourceUrl:row.source_url||'', sourcePublishedAt:row.source_published_at||null,
      isBreaking:!!row.is_breaking, homepageRole:row.homepage_role||'auto', radarItemId:row.radar_item_id||null,
      en, showEnglish:row.show_en!==false && !!en, cms:true, status:row.status
    };
  }
  function normalizeSeries(row){
    return {
      id:row.id||null, slug:row.slug, title:row.title, description:row.description||'', coverUrl:row.cover_url||'', updatedAt:row.updated_at||row.created_at||'',
      title_en:row.title_en||'', description_en:row.description_en||'', status:row.status||'published',
      isOngoing:row.is_ongoing!==false, featured:!!row.featured, cms:!!row.id
    };
  }
  function normalizeSection(row){
    return {id:row.id,slug:row.slug,title:row.title,title_en:row.title_en||'',description:row.description||'',description_en:row.description_en||'',visible:row.visible!==false,sortOrder:Number(row.sort_order)||100};
  }
  async function request(path, options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{
      const r=await fetch(API+path,{...options,cache:'no-store',signal:controller.signal,headers:{...headers,'Cache-Control':'no-cache',...((options&&options.headers)||{})}});
      if(!r.ok)throw new Error(`Backend ${r.status}`);
      const text=await r.text(); return text?JSON.parse(text):null;
    }finally{clearTimeout(timer)}
  }
  async function loadPublishedSeries(){
    try{const rows=await request('/cms_series?status=eq.published&select=*&order=featured.desc,created_at.desc');return (rows||[]).map(normalizeSeries)}catch(e){console.error('Series CMS unavailable.',e);return null}
  }
  async function loadPublishedSections(){
    try{const rows=await request('/cms_sections?visible=eq.true&select=*&order=sort_order.asc,title.asc');return (rows||[]).map(normalizeSection)}catch(e){console.error('Sections CMS unavailable.',e);return null}
  }
  async function loadPublishedArticles(){
    try{const rows=await request('/cms_articles?status=eq.published&select=*&order=published_at.desc.nullslast,published_date.desc');return (rows||[]).map(normalize)}catch(e){console.error('Article CMS unavailable.',e);return null}
  }
  async function edge(action, body={}){
    const r=await fetch(`${PROJECT_URL}/functions/v1/${action}`,{method:'POST',cache:'no-store',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const data=await r.json().catch(()=>({})); if(!r.ok)throw new Error(data.error||`Edge ${r.status}`); return data;
  }
  const b64ToUint8=s=>{const p='='.repeat((4-s.length%4)%4),b64=(s+p).replace(/-/g,'+').replace(/_/g,'/'),raw=atob(b64);return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))};
  async function pushStatus(){
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))return {supported:false,enabled:false,permission:'unsupported'};
    const reg=await navigator.serviceWorker.ready.catch(()=>null);const sub=reg?await reg.pushManager.getSubscription().catch(()=>null):null;return {supported:true,enabled:!!sub,permission:Notification.permission};
  }
  async function enablePush(topics=['all']){
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))throw new Error('الإشعارات غير مدعومة في هذا المتصفح.');
    const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('لم يتم السماح بالإشعارات.');
    const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
    if(!sub){const cfg=await edge('reader-push',{action:'config'});sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToUint8(cfg.publicKey)})}
    const j=sub.toJSON();await edge('reader-push',{action:'subscribe',subscription:{endpoint:sub.endpoint,keys:j.keys},topics,language:document.documentElement.lang||'ar'});localStorage.setItem('dana-push-enabled','1');return true;
  }
  async function disablePush(){
    const reg=await navigator.serviceWorker.ready.catch(()=>null);const sub=reg?await reg.pushManager.getSubscription().catch(()=>null):null;if(sub){await edge('reader-push',{action:'unsubscribe',endpoint:sub.endpoint}).catch(()=>{});await sub.unsubscribe().catch(()=>{})}localStorage.removeItem('dana-push-enabled');return true;
  }
  async function newsletterSubscribe(email,topics=['all'],language='ar'){return edge('email-hub',{action:'subscribe',email,topics,language})}
  async function newsletterUnsubscribe(token){return edge('email-hub',{action:'unsubscribe',token})}
  const visitorKey=()=>{let k=localStorage.getItem('dana-visitor');if(!k){k=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;localStorage.setItem('dana-visitor',k)}return k};
  const sessionKey=()=>{let k=sessionStorage.getItem('dana-session');if(!k){k=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;sessionStorage.setItem('dana-session',k)}return k};
  const device=()=>matchMedia('(max-width: 760px)').matches?'mobile':matchMedia('(max-width: 1100px)').matches?'tablet':'desktop';
  async function event(type, slug=null, metadata={}){
    try{await fetch(`${PROJECT_URL}/rest/v1/rpc/record_event`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({p_event_type:type,p_article_slug:slug,p_path:location.pathname+location.search,p_visitor_key:visitorKey(),p_session_key:sessionKey(),p_referrer:document.referrer||'',p_device:device(),p_language:document.documentElement.lang||'ar',p_metadata:metadata})})}catch(_){ }
  }
  const seenSession='dana-session-seen';if(!sessionStorage.getItem(seenSession)){sessionStorage.setItem(seenSession,'1');event('session_start')}event('page_view');
  window.DanaBackend={PROJECT_URL,PUBLISHABLE_KEY,CONTACT_EMAIL:'danahfahad.mb@gmail.com',WHATSAPP:'966563486820',loadPublishedArticles,loadPublishedSeries,loadPublishedSections,pushStatus,enablePush,disablePush,newsletterSubscribe,newsletterUnsubscribe,event,articleView:s=>event('article_view',s),search:q=>event('search',null,{query:q}),share:s=>event('share',s),save:s=>event('save',s),leave:(s,m={})=>event('article_leave',s,m)};
})();
