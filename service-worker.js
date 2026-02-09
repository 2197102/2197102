// Service Worker para MalkLabs
const CACHE_NAME = 'malklabs-v2.0.26';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/discord.js',
  '/manifest.json'
];

// Instalação
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando arquivos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalação completa!');
        return self.skipWaiting();
      })
  );
});

// Ativação
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Service Worker: Removendo cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativação completa!');
      return self.clients.claim();
    })
  );
});

// Fetch
self.addEventListener('fetch', event => {
  // Ignorar requisições para webhook do Discord
  if (event.request.url.includes('discord.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar do cache se encontrado
        if (response) {
          return response;
        }
        
        // Buscar da rede
        return fetch(event.request)
          .then(response => {
            // Não cachear se não for uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar resposta para cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback para offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Mensagens
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
