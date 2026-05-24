/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — auth.js
   Authentication: Sign Up, Sign In, Logout, Session Management
   ═══════════════════════════════════════════════════════════════════ */

/* ── USER DATABASE (localStorage) ────────────────────────────────── */
const STORAGE_KEY = 'hope_users';
const SESSION_KEY = 'hope_session';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize users database
function initUsers() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
}

// Get all users
function getAllUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Save all users
function saveAllUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/* ── SIGN UP ────────────────────────────────────────────────────── */
async function signUp() {
  currentAuthPage = 'signup';
  const fullName = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPwd = document.getElementById('signup-confirm').value;
  const termsChecked = document.getElementById('signup-terms').checked;

  // Validation
  if (!fullName || !email || !password || !confirmPwd) {
    showAuthError('Please fill in all fields');
    return;
  }

  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPwd) {
    showAuthError('Passwords do not match');
    return;
  }

  if (!termsChecked) {
    showAuthError('Please agree to Terms of Service');
    return;
  }

  if (!validateEmail(email)) {
    showAuthError('Please enter a valid email');
    return;
  }

  // Check if email already exists
  const users = getAllUsers();
  if (users[email]) {
    showAuthError('Email already registered');
    return;
  }

  // Create new user
  users[email] = {
    fullName: fullName,
    email: email,
    password: await hashPassword(password),
    createdAt: new Date().toISOString()
  };

  saveAllUsers(users);
  showAuthSuccess('Account created! Logging in...');
  
  setTimeout(() => {
    logIn(email, password);
  }, 1000);
}

/* ── SIGN IN ────────────────────────────────────────────────────── */
async function logIn(email, password) {
  email = email || document.getElementById('signin-email').value.trim();
  password = password || document.getElementById('signin-password').value;

  // Validation
  if (!email || !password) {
    showAuthError('Please enter email and password');
    return;
  }

  // Find user
  const users = getAllUsers();
  if (!users[email] || users[email].password !== await hashPassword(password)) {
    showAuthError('Invalid email or password');
    return;
  }

  // Create session
  const session = {
    email: email,
    fullName: users[email].fullName,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  showAuthSuccess('Login successful!');

  setTimeout(() => {
    showMainApp();
  }, 800);
}

/* ── SIGN OUT ────────────────────────────────────────────────────── */
function signOut() {
  const modal = document.getElementById('signout-modal');
  if (modal) modal.style.display = 'flex';
}

function confirmSignOut() {
  localStorage.removeItem(SESSION_KEY);
  location.reload();
}

function cancelSignOut() {
  const modal = document.getElementById('signout-modal');
  if (modal) modal.style.display = 'none';
}

/* ── SESSION CHECK ────────────────────────────────────────────────── */
function getSession() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

function isLoggedIn() {
  return getSession() !== null;
}

/* ── UI HELPERS ────────────────────────────────────────────────────── */
let currentAuthPage = 'signin';

function showAuthError(message) {
  const errorEl = document.getElementById(currentAuthPage + '-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 3000);
  }
}

function showAuthSuccess(message) {
  const successEl = document.getElementById(currentAuthPage + '-success');
  if (successEl) {
    successEl.textContent = message;
    successEl.style.display = 'block';
    setTimeout(() => { successEl.style.display = 'none'; }, 2000);
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

/* ── PAGE SWITCHING ────────────────────────────────────────────────── */
function showPage(page) {
  currentAuthPage = page;
  document.querySelectorAll('[data-auth-page]').forEach(el => {
    el.style.display = 'none';
  });
  const pageEl = document.querySelector(`[data-auth-page="${page}"]`);
  if (pageEl) {
    pageEl.style.display = 'flex';
  }
}

function goToSignIn() {
  clearAuthForm('signin');
  showPage('signin');
}

function goToSignUp() {
  clearAuthForm('signup');
  showPage('signup');
}

function clearAuthForm(page) {
  const pageEl = document.querySelector(`[data-auth-page="${page}"]`);
  if (!pageEl) return;
  pageEl.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
    input.value = '';
  });
  const errorEl = document.getElementById(page + '-error');
  if (errorEl) errorEl.style.display = 'none';
  const successEl = document.getElementById(page + '-success');
  if (successEl) successEl.style.display = 'none';
}

function showMainApp() {
  const authContainer = document.getElementById('auth-container');
  const mainApp = document.querySelector('.app');
  
  if (authContainer) {
    authContainer.style.display = 'none';
  }
  if (mainApp) {
    mainApp.style.display = 'block';
  }

  // Update UI with user info
  const session = getSession();
  if (session) {
    document.getElementById('user-name').textContent = session.fullName;
  }

  if (typeof goTab === 'function') {
    goTab('home');
  } else {
    document.addEventListener('DOMContentLoaded', () => goTab('home'));
  }
}

/* ── INIT ────────────────────────────────────────────────────────── */
function initAuth() {
  initUsers();

  if (isLoggedIn()) {
    if (typeof window !== 'undefined') {
      window.isSignedUp = true;
      const session = getSession();
      if (session) {
        window.userInfo = session;
      }
    }
    showMainApp();
  } else {
    showPage('signin');
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});