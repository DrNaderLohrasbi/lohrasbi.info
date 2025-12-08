/* ========================================================================
   AUTH.JS — Lohrasbi Insights Platform
   ------------------------------------------------------------------------
   This file handles:
   • Google Sign-In / Sign-Out
   • User Session Detection
   • UI State Synchronization
   • Modal Visibility Control
   • Runtime Safety Guards
   • DOM–State Sync for Publishing Button
   ------------------------------------------------------------------------
   Version: Enterprise 2025 — Stable Release
   ======================================================================== */


/* ========================================================================
   DOM ELEMENT REFERENCES
   ======================================================================== */

const loginBtn        = document.getElementById("loginBtn");
const newArticleBtn   = document.getElementById("newArticleBtn");
const modalBackground = document.getElementById("newArticleModal");
const closeModalBtn   = document.getElementById("closeModalBtn");

/* Safety: In case HTML is not fully loaded */
if (!loginBtn)       console.error("[AUTH] loginBtn missing");
if (!newArticleBtn)  console.error("[AUTH] newArticleBtn missing");
if (!modalBackground)console.error("[AUTH] modalBackground missing");

/* ========================================================================
   UI HELPERS
   ======================================================================== */

/**
 * Update Login Button UI for logged-in user.
 */
function uiLoggedIn(user) {
    loginBtn.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${user.displayName}`;
    loginBtn.style.color = "#22c55e";
    loginBtn.style.borderColor = "#22c55e";

    newArticleBtn.style.display = "inline-block";
}

/**
 * Update Login Button UI for logged-out state.
 */
function uiLoggedOut() {
    loginBtn.innerHTML = `<i class="fa-brands fa-google"></i> Sign in`;
    loginBtn.style.color = "#38bdf8";
    loginBtn.style.borderColor = "#38bdf8";

    newArticleBtn.style.display = "none";
}

/**
 * Display modal
 */
function openModal() {
    modalBackground.style.display = "flex";
}

/**
 * Hide modal
 */
function closeModal() {
    modalBackground.style.display = "none";
}

/* ========================================================================
   GOOGLE LOGIN HANDLER
   ======================================================================== */

loginBtn?.addEventListener("click", async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);

        const user = result.user;
        if (!user) throw new Error("User object missing after login.");

        uiLoggedIn(user);

    } catch (error) {
        console.error("[AUTH] Login failed:", error);
        alert("Login failed. Please try again.");
    }
});

/* ========================================================================
   GOOGLE LOGOUT HANDLER
   ======================================================================== */

function logout() {
    auth.signOut().catch((err) => {
        console.error("[AUTH] Logout error:", err);
    });
}

/* ========================================================================
   AUTH STATE LISTENER
   ======================================================================== */

auth.onAuthStateChanged((user) => {
    try {
        if (user) uiLoggedIn(user);
        else uiLoggedOut();
    } catch (err) {
        console.error("[AUTH] UI state update error:", err);
    }
});

/* ========================================================================
   MODAL CONTROLS
   ======================================================================== */

newArticleBtn?.addEventListener("click", openModal);

closeModalBtn?.addEventListener("click", closeModal);

/* Close modal by clicking outside the modal box */
window.addEventListener("click", (event) => {
    if (event.target === modalBackground) {
        closeModal();
    }
});

/* ========================================================================
   KEYBOARD ACCESSIBILITY
   ======================================================================== */

/* ESC closes modal */
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

/* ========================================================================
   SAFETY WATCHDOG (DOM Validation)
   ======================================================================== */

function validateDOM() {
    const missing = [];

    if (!document.getElementById("loginBtn"))      missing.push("loginBtn");
    if (!document.getElementById("newArticleBtn")) missing.push("newArticleBtn");
    if (!document.getElementById("newArticleModal")) missing.push("newArticleModal");
    if (!document.getElementById("closeModalBtn")) missing.push("closeModalBtn");

    if (missing.length > 0) {
        console.warn("[AUTH] Missing DOM elements:", missing.join(", "));
    }
}

setTimeout(validateDOM, 500);

/* ========================================================================
   WATCHDOG: AUTH POLLING (Redundant safety)
   Ensures UI always aligns with auth state.
   ======================================================================== */

setInterval(() => {
    const user = auth.currentUser;
    if (user) {
        newArticleBtn.style.display = "inline-block";
    } else {
        newArticleBtn.style.display = "none";
    }
}, 3000);

/* ========================================================================
   DEBUG LOGGING (Optional: keep for early development)
   ======================================================================== */

console.log("%c[AUTH] Loaded successfully — Lohrasbi Insights Platform", 
    "color:#38bdf8;font-size:14px;font-weight:600;");
