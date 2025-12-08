// auth.js
import { auth } from "./firebase-init.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

// UI elements
const loginBtn = document.getElementById("loginBtn");
const newArticleBtn = document.getElementById("newArticleBtn");

// LOGIN HANDLER
loginBtn.onclick = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    await ensureProfileCompleted();
  } catch (err) {
    console.error(err);
    alert("Login failed.");
  }
};

// CHECK WHEN USER LOGS IN
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await ensureProfileCompleted();
  }
});

// ASK FOR NAME + LINKEDIN ON FIRST LOGIN
async function ensureProfileCompleted() {
  if (!currentUser.displayName || !currentUser.email) return;

  let linkedin = localStorage.getItem("linkedin_" + currentUser.uid);

  if (!linkedin) {
    linkedin = prompt("Enter your LinkedIn profile URL:");
    if (!linkedin || linkedin.length < 5) {
      alert("A valid LinkedIn URL is required.");
      return;
    }
    localStorage.setItem("linkedin_" + currentUser.uid, linkedin);
  }

  newArticleBtn.style.display = "inline-block";
}

export function getActiveUser() {
  return currentUser;
}
