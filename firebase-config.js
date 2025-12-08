// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lohrasbi-insights.firebaseapp.com",
  projectId: "lohrasbi-insights",
  storageBucket: "lohrasbi-insights.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db   = firebase.firestore();
