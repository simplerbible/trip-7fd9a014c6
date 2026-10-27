const C='trip-v16';const F=['./','index.html','manifest.json','map.bin'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// Cache-first (instant launch, works offline); refresh the cached copy in the background. version.json always goes to the network.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
  if(u.pathname.endsWith('version.json'))return;
  const key=e.request.mode==='navigate'?'index.html':e.request;
  const net=fetch(e.request.url,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(key,cp))}return r});
  e.respondWith(caches.match(key,{ignoreSearch:true}).then(hit=>{if(hit){e.waitUntil(net.catch(()=>{}));return hit}return net.catch(()=>caches.match('index.html'))}))});
