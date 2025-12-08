/* =========================================================================
   INSIGHTS.JS — Core Logic for Lohrasbi Insights Platform
   Architecture-Level Implementation / Firebase Firestore
   ========================================================================= */

/* ---------------------------------------------------------
   FIREBASE REFERENCES
   --------------------------------------------------------- */
const db = firebase.firestore();
const auth = firebase.auth();

/* Collections */
const postsRef = db.collection("insights_posts");
const likesRef = db.collection("insights_likes");
const commentsRef = db.collection("insights_comments");
const savesRef = db.collection("insights_saves");

/* DOM Elements */
const submitArticleBtn = document.getElementById("submitArticleBtn");
const modal = document.getElementById("newArticleModal");
const articlesContainer = document.getElementById("articlesContainer");

const titleInput = document.getElementById("articleTitle");
const excerptInput = document.getElementById("articleExcerpt");
const linkedInInput = document.getElementById("articleLinkedIn");
const contentInput = document.getElementById("articleContent");

/* =========================================================================
   UTILITIES
   ========================================================================= */

/* Convert timestamp → readable date */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

/* Generate Share URL for a post */
function generateShareURL(postId) {
    return `https://lohrasbi.info/article-view.html?id=${postId}`;
}

/* =========================================================================
   SUBMIT NEW INSIGHT
   ========================================================================= */

submitArticleBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;
    if (!user) {
        alert("You must sign in to publish.");
        return;
    }

    const title = titleInput.value.trim();
    const excerpt = excerptInput.value.trim();
    const linkedIn = linkedInInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !excerpt || !content) {
        alert("Please fill all fields.");
        return;
    }

    const newPost = {
        title,
        excerpt,
        content,
        linkedIn,
        authorName: user.displayName || "Unknown User",
        authorEmail: user.email || "hidden",
        authorPhoto: user.photoURL || "",
        createdAt: Date.now(),
    };

    try {
        const docRef = await postsRef.add(newPost);

        alert("Insight Published Successfully!");

        /* Reset Form */
        titleInput.value = "";
        excerptInput.value = "";
        linkedInInput.value = "";
        contentInput.value = "";

        modal.style.display = "none";

        loadInsights();

    } catch (err) {
        console.error("Error publishing:", err);
        alert("Error publishing insight.");
    }
});

/* =========================================================================
   LOAD ALL INSIGHTS (LATEST FIRST)
   ========================================================================= */

async function loadInsights() {
    articlesContainer.innerHTML = "";

    try {
        const snapshot = await postsRef
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            articlesContainer.innerHTML = `
                <div class="placeholder-card">
                    <div class="placeholder-title">No Insights Yet</div>
                    <div class="placeholder-meta">Be the first to publish.</div>
                    <div class="placeholder-text">
                        Sign in with Google and publish your first architecture insight.
                    </div>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const post = doc.data();
            const id = doc.id;

            renderPostCard(id, post);
        });

    } catch (err) {
        console.error("Error loading insights:", err);
    }
}

/* =========================================================================
   RENDER A SINGLE POST CARD
   ========================================================================= */

async function renderPostCard(postId, post) {

    /* Fetch likes count */
    const likesSnap = await likesRef.where("postId", "==", postId).get();
    const likesCount = likesSnap.size;

    /* Fetch comments count */
    const commentsSnap = await commentsRef.where("postId", "==", postId).get();
    const commentsCount = commentsSnap.size;

    const card = document.createElement("div");
    card.className = "article-card";

    card.innerHTML = `
        <div class="article-title">${post.title}</div>

        <div class="article-meta">
            By ${post.authorName} • ${formatDate(post.createdAt)}
        </div>

        <div class="article-excerpt">${post.excerpt}</div>

        <div style="margin-top:15px; display:flex; gap:20px; font-size:0.9rem; color:#7dd3fc;">
            <span><i class="fa-regular fa-heart"></i> ${likesCount}</span>
            <span><i class="fa-regular fa-comment"></i> ${commentsCount}</span>
        </div>
    `;

    /* Clicking the card → open full article */
    card.addEventListener("click", () => {
        window.location.href = `article-view.html?id=${postId}`;
    });

    articlesContainer.appendChild(card);
}

/* =========================================================================
   LIKE A POST
   ========================================================================= */

async function likePost(postId) {
    const user = auth.currentUser;
    if (!user) return alert("Sign in to like posts.");

    const existing = await likesRef
        .where("postId", "==", postId)
        .where("uid", "==", user.uid)
        .get();

    if (!existing.empty) return; // already liked

    await likesRef.add({
        postId,
        uid: user.uid,
        createdAt: Date.now(),
    });

    loadInsights();
}

/* =========================================================================
   SAVE POST
   ========================================================================= */

async function savePost(postId) {
    const user = auth.currentUser;
    if (!user) return alert("Sign in to save posts.");

    const existing = await savesRef
        .where("postId", "==", postId)
        .where("uid", "==", user.uid)
        .get();

    if (!existing.empty) return;

    await savesRef.add({
        postId,
        uid: user.uid,
        savedAt: Date.now(),
    });
}

/* =========================================================================
   SHARE POST
   ========================================================================= */

function sharePost(postId) {
    const url = generateShareURL(postId);
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
}

/* =========================================================================
   INITIAL LOAD
   ========================================================================= */
document.addEventListener("DOMContentLoaded", loadInsights);
