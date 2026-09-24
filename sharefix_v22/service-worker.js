const CACHE='wedding-studio-v22-main-preset-custom-share-lightweight';
const CORE=['./','./index.html','./css/styles.css','./js/app.js?v=22','./manifest.webmanifest','./assets/card/final-template.pdf','./assets/fonts/NotoSansDevanagari-Regular.ttf','./assets/fonts/NotoSansDevanagari-Bold.ttf','./assets/icons/icon.svg','./guest.html','./js/guest.js?v=22'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin && (u.pathname==='/'||u.pathname==='/index.html'||u.pathname==='/js/app.js'||u.pathname==='/service-worker.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(u.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>cached)));
});
