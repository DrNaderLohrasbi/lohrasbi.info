/* ========================================================================
   AUTH.JS — Lohrasbi Insights Platform (Final Stable Version)
   ======================================================================== */

/* DOM ELEMENTS */
const loginBtn        = document.getElementById("loginBtn");
const newArticleBtn   = document.getElementById("newArticleBtn");
const modalBackground = document.getElementById("newArticleModal");
const closeModalBtn   = document.getElementById("closeModalBtn");

/* UI STATE HELPERS */
function uiLoggedIn(user) {
    loginBtn.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${user.displayName}`;
    loginBtn.style.color = "#22c55e";
    loginBtn.style.borderColor = "#22c55e";

    if (newArticleBtn) newArticleBtn.style.display = "inline-block";
}

function uiLoggedOut() {
    loginBtn.innerHTML = `<i class="fa-brands fa-google"></i> Sign in`;
    loginBtn.style.color = "#38bdf8";
    loginBtn.style.borderColor = "#38bdf8";

    if (newArticleBtn) newArticleBtn.style.display = "none";
}

/* ========================================================================
   GOOGLE LOGIN
   ======================================================================== */

loginBtn?.addEventListener("click", async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();

        // ✔ FIXED — use firebaseAuth, NOT "auth"
        const result = await firebaseAuth.signInWithPopup(provider);

        const user = result.user;
        if (user) uiLoggedIn(user);

    } catch (error) {
        console.error("[AUTH] Login failed:", error);
        alert("Login failed. Please try again.");
    }
});

/* ========================================================================
   LOGOUT (optional)
   ======================================================================== */

function logout() {
    firebaseAuth.signOut().catch(err => {
        console.error("[AUTH] Logout error:", err);
    });
}

/* ========================================================================
   AUTH STATE LISTENER
   ======================================================================== */

firebaseAuth.onAuthStateChanged((user) => {
    if (user) uiLoggedIn(user);
    else uiLoggedOut();
});

/* ========================================================================
   MODAL CONTROLS
   ======================================================================== */

newArticleBtn?.addEventListener("click", () => {
    if (!firebaseAuth.currentUser) {
        alert("Please sign in first.");
        return;
    }
    modalBackground.style.display = "flex";
});

closeModalBtn?.addEventListener("click", () => {
    modalBackground.style.display = "none";
});

/* Close modal when clicking outside */
window.addEventListener("click", (e) => {
    if (e.target === modalBackground) modalBackground.style.display = "none";
});

/* Close modal with ESC */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalBackground.style.display = "none";
});

/* Debug */
console.log("%c[AUTH] Loaded — authentication operational", 
            "color:#38bdf8;font-size:14px;font-weight:600;");
