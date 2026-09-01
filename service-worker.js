const CACHE='dana-editorial-v18-3-newsroom';
const CORE=['./','./index.html','./archive.html','./section.html','./news.html','./reports.html','./essays.html','./series.html','./experience.html','./data.html','./editorial.html','./privacy.html','./styles.css','./app.js','./backend.js','./articles.js','./translations-en.js','./series-data.js','./manifest.webmanifest','./assets/brand/dana-mark.png','./assets/brand/favicon.png','./assets/brand/icon-192.png','./assets/brand/icon-512.png','./assets/covers/default-news.svg','./assets/covers/default-report.svg','./assets/covers/default-article.svg','./assets/covers/default-training.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||/studio\.(html|js|css)$/.test(u.pathname))return;
  const networkFirst=e.request.mode==='navigate'||['script','style'].includes(e.request.destination);
  if(networkFirst){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r?.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(x=>x||caches.match('./index.html'))));return}
  e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{if(r?.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r})));
});
self.addEventListener('push',e=>{
  let data={};try{data=e.data?.json()||{}}catch{data={body:e.data?.text()||''}}
  const title=data.title||'دانه بالجهر';
  const options={body:data.body||'مادة جديدة نُشرت الآن.',icon:data.icon||'./assets/brand/icon-192.png',badge:data.badge||'./assets/brand/favicon.png',tag:data.tag||'dana-new-story',renotify:true,data:{url:data.url||'./'}};
  e.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();const url=e.notification.data?.url||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus' in c){c.navigate(url).catch(()=>{});return c.focus()}}return clients.openWindow?clients.openWindow(url):null}));
});
