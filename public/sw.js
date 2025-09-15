// Service Worker for NAMASTE-ICD11 ML Integration System
// Provides offline functionality and caching for better performance

const CACHE_NAME = 'namaste-icd11-v1.0.0';
const RUNTIME_CACHE = 'namaste-icd11-runtime-v1.0.0';

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo-template.svg'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  '/api/stats',
  '/api/search/autocomplete',
  '/api/terminology'
];

// Pages that should work offline
const OFFLINE_PAGES = [
  '/',
  '/search',
  '/mapping',
  '/fhir',
  '/analytics'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  console.log('Service Worker: Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching essential resources');
        return cache.addAll(PRECACHE_URLS.map(url => new Request(url, {
          cache: 'reload'
        })));
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map(cacheName => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip requests from other origins
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request)
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (url.pathname.startsWith('/static/') || 
      url.pathname.includes('.') && 
      !url.pathname.startsWith('/api/')) {
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      navigationHandler(request)
    );
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    networkFirstStrategy(request)
  );
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then(response => {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Network failed, but we have cache
      });
      
      return cachedResponse;
    }

    // Not in cache, fetch from network
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return new Response('Offline content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first strategy for API and dynamic content
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful API responses for offline use
    if (response.status === 200 && shouldCacheRequest(request)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    console.log('Network request failed, trying cache:', request.url);
    
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Navigation handler for SPA routes
async function navigationHandler(request) {
  try {
    // Try network first
    const response = await fetch(request);
    return response;
    
  } catch (error) {
    // Network failed, serve cached shell or homepage
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>NAMASTE-ICD11 - Offline</title>
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            text-align: center;
            padding: 2rem;
          }
          h1 { margin-bottom: 1rem; }
          p { margin-bottom: 2rem; opacity: 0.9; }
          button { 
            background: rgba(255,255,255,0.2); 
            border: 1px solid rgba(255,255,255,0.3); 
            color: white; 
            padding: 0.75rem 1.5rem; 
            border-radius: 0.5rem; 
            cursor: pointer; 
          }
        </style>
      </head>
      <body>
        <h1>You're Offline</h1>
        <p>NAMASTE-ICD11 requires an internet connection to access the latest medical terminology data.</p>
        <button onclick="location.reload()">Try Again</button>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Check if request should be cached
function shouldCacheRequest(request) {
  const url = new URL(request.url);
  
  return API_CACHE_PATTERNS.some(pattern => 
    url.pathname.includes(pattern)
  );
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'search-sync') {
    event.waitUntil(syncSearchData());
  }
  
  if (event.tag === 'mapping-sync') {
    event.waitUntil(syncMappingData());
  }
});

// Sync search data when online
async function syncSearchData() {
  try {
    // Implementation for syncing offline search queries
    console.log('Syncing search data...');
  } catch (error) {
    console.error('Failed to sync search data:', error);
  }
}

// Sync mapping data when online
async function syncMappingData() {
  try {
    // Implementation for syncing offline mapping requests
    console.log('Syncing mapping data...');
  } catch (error) {
    console.error('Failed to sync mapping data:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: 'New medical terminology updates available',
    icon: '/logo192.png',
    badge: '/badge.png',
    tag: 'terminology-update',
    actions: [
      {
        action: 'view',
        title: 'View Updates'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NAMASTE-ICD11 Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
