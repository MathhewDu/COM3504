var dataCacheName = 'chatroom-cache-v1';
var cacheName = 'chatroom-step-8-1';
var filesToCache = [
    '/',
    '/javascripts/app.js',
    '/stylesheets/style.css',
    '/javascripts/idb/index.js',
    '/javascripts/idb/wrap-idb-value.js',
    '/javascripts/canvas.js',
    '/javascripts/database.js',
    '/javascripts/index.js',
];

/**
 * installation event: add all the files to be cached
 */
self.addEventListener('install', function(event){
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('Open cache');
            return cache.addAll(filesToCache);
        })
    );
});

/**
 * activation of service worker: removes all cached files if necessary
 **/
self.addEventListener('activate', function(event){
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key !== cacheName && key !== dataCacheName){
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

/**
 * fetch: when the worker receives a fetch request
 **/
self.addEventListener('fetch', function(event){
    console.log('[ServiceWorker] Fetch', event.request.url);
    var dataUrl = '/';
    //if the request is '/chatroom_data', post to the server - do not try to cache
    if(event.request.url.indexOf(dataUrl) > -1) {
        return fetch(event.request).then(function(response){
            return response;
        })
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response){
                return response
                    || fetch(event.request).then(function (response){
                        if(!response.ok || response.statusCode>299){
                            console.log("error: " + response.error());
                        } else {
                            caches.add(response.clone());
                            return response;
                        }
                    }).catch(function(err){
                        console.log("error: "+err);
                    })
            })
        );
    }
});