if ('function' === typeof importScripts) {
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
    );
    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');

        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute([
  {
    "url": "android-icon-144x144.png",
    "revision": "b12fb3601229966dd47eb778777cdf27"
  },
  {
    "url": "android-icon-192x192.png",
    "revision": "80d451e1e0b6333d42f8e221f3159429"
  },
  {
    "url": "android-icon-36x36.png",
    "revision": "4d012476dfb5a5aa65eb04a03c87bd0a"
  },
  {
    "url": "android-icon-48x48.png",
    "revision": "0a43ac0797bc34d23fd8d61d20e464f3"
  },
  {
    "url": "android-icon-72x72.png",
    "revision": "aec33fe2857f9303bcee336089a23edd"
  },
  {
    "url": "android-icon-96x96.png",
    "revision": "b9b70e857b423841d18e2860781c786d"
  },
  {
    "url": "apple-icon-114x114.png",
    "revision": "515e04ec4f42a988325a56cd00d6ac69"
  },
  {
    "url": "apple-icon-120x120.png",
    "revision": "ce8064b404d1416852945360fb1c1161"
  },
  {
    "url": "apple-icon-144x144.png",
    "revision": "b12fb3601229966dd47eb778777cdf27"
  },
  {
    "url": "apple-icon-152x152.png",
    "revision": "cce520beacb03aa26eb59f8c2ab5e032"
  },
  {
    "url": "apple-icon-180x180.png",
    "revision": "fa23bf2da913e29c70b5b6fde08fab91"
  },
  {
    "url": "apple-icon-57x57.png",
    "revision": "47984fbf00cbff7ff587cbe856e6c7a7"
  },
  {
    "url": "apple-icon-60x60.png",
    "revision": "4e9e0cf542d547a2f540c6aa02daf062"
  },
  {
    "url": "apple-icon-72x72.png",
    "revision": "aec33fe2857f9303bcee336089a23edd"
  },
  {
    "url": "apple-icon-76x76.png",
    "revision": "cbe89ef06d201ee23560547761dcbcde"
  },
  {
    "url": "apple-icon-precomposed.png",
    "revision": "21100cb52f325e150f44174408797c73"
  },
  {
    "url": "apple-icon.png",
    "revision": "21100cb52f325e150f44174408797c73"
  },
  {
    "url": "favicon-16x16.png",
    "revision": "444004fcb90329535dd842c021cd8db8"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "9c59ab919f82339cf245af6f6ef239c8"
  },
  {
    "url": "favicon-512x512.png",
    "revision": "2a910a9f8946753201dcf21591918015"
  },
  {
    "url": "favicon-96x96.png",
    "revision": "b9b70e857b423841d18e2860781c786d"
  },
  {
    "url": "fonts/Comic_Sans_MS.eot",
    "revision": "418f33600c1fe53b5249569e9d55f80a"
  },
  {
    "url": "fonts/Comic_Sans_MS.svg",
    "revision": "d2714b2110a225eb4205f66e41051d09"
  },
  {
    "url": "fonts/Comic_Sans_MS.ttf",
    "revision": "7cc6719bd5f0310be3150ba33418e72e"
  },
  {
    "url": "fonts/Comic_Sans_MS.woff",
    "revision": "10d653e7b3fdbed70df59c743e797361"
  },
  {
    "url": "fonts/Comic_Sans_MS.woff2",
    "revision": "88845f280c6862c732da9fc3d77caccd"
  },
  {
    "url": "fonts/comic.ttf",
    "revision": "15fbe4ccea5683707815c9aa9cf71a46"
  },
  {
    "url": "fonts/fa-light-300.eot",
    "revision": "71b8cac12bdff62161cf3c34db8cb802"
  },
  {
    "url": "fonts/fa-light-300.svg",
    "revision": "1f0fb6d78edf410a01296ce3a3088157"
  },
  {
    "url": "fonts/fa-light-300.ttf",
    "revision": "862e408411e4c9a33b79133eedcde913"
  },
  {
    "url": "fonts/fa-light-300.woff",
    "revision": "8c5d69571fd870cc121f8264fbb31deb"
  },
  {
    "url": "fonts/fa-light-300.woff2",
    "revision": "4be7ffb54791a6bdc069eefb65812011"
  },
  {
    "url": "fonts/fa-solid-900.eot",
    "revision": "d1d337ee385dcc8e68ebbd75051d35eb"
  },
  {
    "url": "fonts/fa-solid-900.svg",
    "revision": "1c80455e3dac5b04f91012754ec81893"
  },
  {
    "url": "fonts/fa-solid-900.ttf",
    "revision": "59a8ae0b17952c47e49918c8c561b84b"
  },
  {
    "url": "fonts/fa-solid-900.woff",
    "revision": "47b09d9930f32108a517c323d219a9f1"
  },
  {
    "url": "fonts/fa-solid-900.woff2",
    "revision": "a360c97468d2d673228304675f57496c"
  },
  {
    "url": "images/female.png",
    "revision": "9e88a2f94aad3f0fe0d4a135ea26a0bf"
  },
  {
    "url": "images/logo.png",
    "revision": "94d833038f4c642b44815939939c498e"
  },
  {
    "url": "images/male.png",
    "revision": "8e9f1c4d40a805688d5f906b657c254f"
  },
  {
    "url": "images/rich-image.png",
    "revision": "4c4966aba8ab693220516275ef9bc600"
  },
  {
    "url": "index.html",
    "revision": "6edb09ab0ab76ee57ebba3b2bb718d2d"
  },
  {
    "url": "precache-manifest.29c73883bcd822ceac4a380c7b8b6eac.js",
    "revision": "29c73883bcd822ceac4a380c7b8b6eac"
  },
  {
    "url": "service-worker.js",
    "revision": "680de4a4ea6c4f36f075dd78a260094d"
  },
  {
    "url": "static/css/2.e8ce0df9.chunk.css",
    "revision": "f9ac6408ebb7d485893663efa38a3729"
  },
  {
    "url": "static/css/main.c51d26fe.chunk.css",
    "revision": "352ec7066540e6ef98287e43995e68af"
  },
  {
    "url": "static/js/1.50e9e4f5.chunk.js",
    "revision": "30c6c3c4e7c23d42f61945c99c23a0d9"
  },
  {
    "url": "static/js/2.72a52169.chunk.js",
    "revision": "94530d28d3c53e44ccc05769e91e931a"
  },
  {
    "url": "static/js/main.37730bee.chunk.js",
    "revision": "c656feb43d55041b45781312cfda174e"
  },
  {
    "url": "static/js/runtime~main.9731bda5.js",
    "revision": "ca7f08cb0b43745750b0c04d82954cfd"
  }
]);

        /* custom cache rules*/
        workbox.routing.registerNavigationRoute('/index.html', {
            blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
        });

        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg)$/,
            workbox.strategies.cacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    }),
                ],
            })
        );

    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}
