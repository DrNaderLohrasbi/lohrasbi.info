// insights.js
import { db } from "./firebase-init.js";
import { getActiveUser } from "./auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const articlesContainer = document.getElementById("articlesContainer");
const newArticleBtn = document.getElementById("newArticleBtn");

// LOAD ARTICLES
async function loadArticles() {
  const q = query(collection(db, "insights"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  articlesContainer.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "article-card";

    card.innerHTML = `
      <div class="article-title">${data.title}</div>
      <div class="article-meta">By ${data.authorName} • ${data.authorLinkedIn}</div>
      <div class="article-excerpt">${data.excerpt}</div>
    `;

    articlesContainer.appendChild(card);
  });
}

loadArticles();

// SUBMIT NEW ARTICLE
newArticleBtn.onclick = async () => {
  const user = getActiveUser();
  if (!user) return alert("Please sign in first.");

  const name = user.displayName || prompt("Enter your name:");
  const linkedin = localStorage.getItem("linkedin_" + user.uid);
  const title = prompt("Article title:");
  const excerpt = prompt("Short summary:");
  const body = prompt("Full article content:");

  if (!title || !excerpt || !body) {
    alert("All fields are required.");
    return;
  }

  await addDoc(collection(db, "insights"), {
    title,
    excerpt,
    body,
    authorName: name,
    authorLinkedIn: linkedin,
    email: user.email,
    timestamp: Date.now()
  });

  alert("Article submitted!");
  loadArticles();
};
