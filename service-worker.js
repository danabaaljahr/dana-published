const CACHE = "dana-editorial-v6-cms";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./backend.js",
  "./articles.js",
  "./manifest.webmanifest",
  "./assets/brand/dana-mark.png",
  "./assets/brand/favicon.png",
  "./assets/brand/icon-192.png",
  "./assets/brand/icon-512.png",
  "./assets/covers/media-ministry-visit.svg",
  "./assets/covers/oic-gaza-ceasefire.svg",
  "./assets/covers/union-director-meets-observatory-team.svg",
  "./assets/covers/saudi-national-team-world-cup-2026.svg",
  "./assets/covers/iphrc-field-visit.svg",
  "./assets/covers/projects-opening-continuity.svg",
  "./assets/covers/iraq-consul-yuna-visit.svg",
  "./assets/covers/somalia-refugees-yuna-visit.svg",
  "./assets/covers/public-opinion-digital-age.svg",
  "./assets/covers/saudi-entertainment-sector-impact.svg",
  "./assets/covers/between-study-and-practice.svg",
  "./assets/covers/attention-digital-age.svg",
  "./assets/covers/we-arrive-without-feeling-arrival.svg",
  "./assets/covers/medical-insurance-profit-language.svg",
  "./assets/covers/excavations-management-jeddah.svg",
  "./assets/covers/first-job-mirage.svg",
  "./assets/covers/outside-tracking-range.svg",
  "./assets/covers/full-today-empty-tomorrow.svg",
  "./assets/covers/past-invoice.svg",
  "./assets/covers/what-camera-does-not-see.svg",
  "./assets/covers/trial-version-of-life.svg",
  "./assets/covers/scene-stronger-than-truth.svg",
  "./assets/covers/profession-my-father-never-heard-of.svg",
  "./assets/covers/digital-government-knows-before-asking.svg",
  "./assets/covers/data-to-decision.svg",
  "./assets/covers/crowd-management-saudi-data.svg",
  "./assets/covers/independence-starts-with-place-design.svg",
  "./assets/covers/tanomah-fire-geography.svg",
  "./assets/covers/agricultural-census-2024.svg",
  "./assets/covers/ai-writes-who-responsible-for-news.svg",
  "./assets/covers/riyadh-cybersecurity-forum.svg",
  "./assets/covers/iphrc-strategic-digital-transformation.svg",
  "./assets/covers/yuna-somalia-refugees-memorandum.svg",
  "./assets/covers/default-news.svg",
  "./assets/covers/default-report.svg",
  "./assets/covers/default-article.svg",
  "./assets/covers/default-training.svg"
];

self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch", event => {
  const u = new URL(event.request.url);
  if(event.request.method !== "GET" || u.origin !== location.origin || u.pathname.endsWith("/studio.html") || u.pathname.endsWith("/studio.js") || u.pathname.endsWith("/studio.css")) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if(response && response.ok){ const clone=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,clone)); }
    return response;
  }).catch(()=> event.request.mode === "navigate" ? caches.match("./index.html") : Promise.reject())));
});
