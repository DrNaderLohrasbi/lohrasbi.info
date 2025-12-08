// insights.js

const articleListEl = document.getElementById('article-list');
const articleFormEl = document.getElementById('new-article-form');

const titleInput    = document.getElementById('article-title');
const excerptInput  = document.getElementById('article-excerpt');
const contentInput  = document.getElementById('article-content');
const linkedinInput = document.getElementById('author-linkedin');

// --- Create Article ---
if (articleFormEl) {
  articleFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('You must be signed in to publish an insight.');
      return;
    }

    const title   = titleInput.value.trim();
    const excerpt = excerptInput.value.trim();
    const content = contentInput.value.trim();
    const linkedin = linkedinInput.value.trim();

    if (!title || !excerpt || !content || !linkedin) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await db.collection('insights').add({
        title,
        excerpt,
        content,
        authorId: user.uid,
        authorName: user.displayName || user.email || "Unknown Author",
        authorLinkedIn: linkedin,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Insight published successfully.");
      articleFormEl.reset();

    } catch (err) {
      console.error("Error writing document:", err);
      alert("Firestore write error.");
    }
  });
}

// --- Load Articles ---
async function loadArticles() {
  if (!articleListEl) return;

  articleListEl.innerHTML = "Loading insights...";

  try {
    const snapshot = await db.collection('insights')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      articleListEl.innerHTML = "<p>No insights published yet.</p>";
      return;
    }

    let html = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const id   = doc.id;

      const created = data.createdAt
        ? data.createdAt.toDate().toLocaleString()
        : "";

      html += `
        <article class="insight-card">
          <h3>${data.title}</h3>
          <p>${data.excerpt}</p>
          <p>
            By ${data.authorName} · 
            <a href="${data.authorLinkedIn}" target="_blank">LinkedIn</a> · 
            ${created}
          </p>
          <a href="article-view.html?id=${id}">Read full insight →</a>
        </article>
      `;
    });

    articleListEl.innerHTML = html;

  } catch (err) {
    console.error("Error loading insights:", err);
    articleListEl.innerHTML = "<p>Error loading insights.</p>";
  }
}

loadArticles();
