/* =========================================================
   FIREBASE CONFIG — FINAL COMPAT VERSION FOR GITHUB PAGES
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAjof_hAS2puiVA9ZBBvvhV2-O8nsxNDgM",
  authDomain: "lohrasbi-insights.firebaseapp.com",
  projectId: "lohrasbi-insights",
  storageBucket: "lohrasbi-insights.firebasestorage.app",
  messagingSenderId: "735004863176",
  appId: "1:735004863176:web:29ac8999232ab804ec53fd",
  measurementId: "G-V6ZHZP6SJM"
};

// Initialize Firebase (only once)
firebase.initializeApp(firebaseConfig);

// Reusable Firebase services
const firebaseAuth = firebase.auth();
const firebaseDB   = firebase.firestore();
