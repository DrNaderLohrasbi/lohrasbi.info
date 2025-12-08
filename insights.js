/* =========================================================
   2) LOAD ALL ARTICLES FROM FIRESTORE (WITH LINKS)
   ========================================================= */

async function loadArticles(){

    articlesContainer.innerHTML = ""; // Reset list

    try {
        const snapshot = await getDocs(postsCollection);

        if(snapshot.empty){
            articlesContainer.innerHTML = `
              <div class="article-card">
                <div class="article-title">No articles yet</div>
                <div class="article-meta">The platform is ready for your first publication.</div>
                <div class="article-excerpt">Sign in with Google and publish your first Insight.</div>
              </div>
            `;
            return;
        }

        snapshot.forEach((docItem) => {
            const post = docItem.data();
            const id = docItem.id;

            const card = document.createElement("div");
            card.className = "article-card";

            card.innerHTML = `
                <div class="article-title">${post.title}</div>
                <div class="article-meta">
                    By ${post.authorName} • ${new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div class="article-excerpt">${post.excerpt}</div>
            `;

            // 🔥 CLICK → OPEN FULL ARTICLE PAGE
            card.addEventListener("click", () => {
                window.location.href = `article-view.html?id=${id}`;
            });

            articlesContainer.appendChild(card);
        });

    } catch (err){
        console.error("Error loading articles:", err);
    }
}
