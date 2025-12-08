/* =========================================================
   FIREBASE CONFIG — COMPAT VERSION (FOR GITHUB PAGES)
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAjof_hAS2puiVA9ZBBvvhV2-O8nsxNDgM",
  authDomain: "lohrasbi-insights.firebaseapp.com",
  projectId: "lohrasbi-insights",
  storageBucket: "lohrasbi-insights.firebasestorage.app",
  messagingSenderId: "735004863176",
  appId: "1:735004863176:web:ef5f35a5c57cfd78ec53fd",
  measurementId: "G-KM9V02L2BT"
};

// initialize only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Services
const firebaseAuth = firebase.auth();
const firebaseDB   = firebase.firestore();
