/* =========================================================
   FIREBASE CONFIG — SAFE PUBLIC TEMPLATE (NO REAL SECRETS)
   ========================================================= */

const firebaseConfig = {
  apiKey:        window.__FIREBASE_API_KEY__       || "",
  authDomain:    window.__FIREBASE_AUTH_DOMAIN__   || "",
  projectId:     window.__FIREBASE_PROJECT_ID__    || "",
  storageBucket: window.__FIREBASE_STORAGE_BUCKET__|| "",
  messagingSenderId: window.__FIREBASE_SENDER_ID__ || "",
  appId:         window.__FIREBASE_APP_ID__        || "",
  measurementId: window.__FIREBASE_MEASUREMENT_ID__|| ""
};

// initialize only once, and فقط اگر کانفیگ ست شده بود
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Services
  const firebaseAuth = firebase.auth();
  const firebaseDB   = firebase.firestore();

  // برای استفاده در فایل‌های دیگر در window منتشرش کن
  window.firebaseAuth = firebaseAuth;
  window.firebaseDB   = firebaseDB;
} else {
  console.warn("Firebase config is not set — define window.__FIREBASE_... variables in a private script.");
}
