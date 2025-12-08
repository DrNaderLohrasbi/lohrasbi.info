// auth.js

// Elements
const signInBtn  = document.getElementById('google-signin-btn');
const signOutBtn = document.getElementById('google-signout-btn');
const userStatus = document.getElementById('user-status');
const articleForm = document.getElementById('new-article-form');

// Update UI when user logs in or out
function updateUIForUser(user) {
  if (user) {
    signInBtn.style.display  = 'none';
    signOutBtn.style.display = 'inline-block';

    userStatus.textContent = `Signed in as: ${user.displayName || user.email}`;
    
    if (articleForm) {
      articleForm.style.display = 'block';
    }
  } else {
    signInBtn.style.display  = 'inline-block';
    signOutBtn.style.display = 'none';

    userStatus.textContent = 'You are not signed in.';
    
    if (articleForm) {
      articleForm.style.display = 'none';
    }
  }
}

// Google Sign-In
if (signInBtn) {
  signInBtn.addEventListener('click', async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (err) {
      console.error('Sign-in error:', err);
      alert('Sign-in failed.');
    }
  });
}

// Sign-Out
if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Sign-out error:', err);
      alert('Sign-out failed.');
    }
  });
}

// Listen to state change
auth.onAuthStateChanged((user) => updateUIForUser(user));
