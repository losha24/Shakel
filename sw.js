const CACHE_NAME = 'shekel-v7'; // הגדרת גרסה 7 החדשה
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js' // הוספתי את הספרייה החיצונית כדי שתעבוד אופליין
];

// 1. התקנה (Install) - טעינת כל הקבצים לזיכרון
self.addEventListener('install', (event) => {
  self.skipWaiting(); // גורם לגרסה החדשה להיכנס לתוקף מיד ללא צורך בסגירת הטאב
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: קבצים נשמרים ב-Cache');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. הפעלה (Activate) - מחיקת גרסאות ישנות (כמו finance-v4)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: מנקה גרסה ישנה:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. שליפה (Fetch) - מביא קבצים מהזיכרון אם אין אינטרנט
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // מחזיר את הקובץ מהזיכרון או ניגש לרשת אם הוא לא שם
      return response || fetch(event.request);
    })
  );
});
