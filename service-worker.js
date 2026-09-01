/* V18.7 — push-only service worker. No UI caching: readers always get the current site. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('push',event=>{
  let data={};try{data=event.data?.json()||{}}catch{data={body:event.data?.text()||''}}
  const title=data.title||'دانه بالجهر';
  const options={body:data.body||'مادة جديدة نُشرت الآن.',icon:data.icon||'./assets/brand/icon-192.png?v=18.7',badge:data.badge||'./assets/brand/favicon.png?v=18.7',tag:data.tag||'dana-new-story',renotify:true,data:{url:data.url||'./'}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();const url=event.notification.data?.url||'./';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus' in c){c.navigate(url).catch(()=>{});return c.focus()}}return clients.openWindow?clients.openWindow(url):null}));
});
