/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — auth.js
   Authentication: Sign Up, Sign In, Logout, Session Management
   Connects to backend API at http://localhost:5001
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE    = 'http://localhost:5001/api';
const SESSION_KEY = 'hope_session';
const TOKEN_KEY   = 'hope_token';

/* ── TOKEN HELPERS ──────────────────────────────────────────────── */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/* ── SESSION HELPERS ────────────────────────────────────────────── */
function getSession() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

function isLoggedIn() {
  return getSession() !== null && getToken() !== null;
}

/* ── SIGN UP ────────────────────────────────────────────────────── */
async function signUp() {
  currentAuthPage = 'signup';

  const fullName    = document.getElementById('signup-name').value.trim();
  const email       = document.getElementById('signup-email').value.trim();
  const password    = document.getElementById('signup-password').value;
  const confirmPwd  = document.getElementById('signup-confirm').value;
  const termsChecked = document.getElementById('signup-terms').checked;

  // Clear messages
  document.getElementById('signup-error').innerHTML   = '';
  document.getElementById('signup-success').innerHTML = '';

  // Validation
  if (!fullName || !email || !password || !confirmPwd) {
    showAuthError('Please fill in all fields'); return;
  }
  if (!validateEmail(email)) {
    showAuthError('Please enter a valid email'); return;
  }
  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters'); return;
  }
  if (password !== confirmPwd) {
    showAuthError('Passwords do not match'); return;
  }
  if (!termsChecked) {
    showAuthError('Please agree to Terms of Service'); return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ full_name: fullName, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showAuthSuccess('Account created! Logging in...');
      setTimeout(() => logIn(email, password), 1000);
    } else {
      showAuthError(data.message || 'Signup failed');
    }

  } catch (error) {
    console.error('[signUp]', error);
    showAuthError('Cannot connect to backend. Is the server running?');
  }
}

/* ── SIGN IN ────────────────────────────────────────────────────── */
async function logIn(email, password) {
  currentAuthPage = 'signin';

  email    = email    || document.getElementById('signin-email').value.trim();
  password = password || document.getElementById('signin-password').value;

  if (!email || !password) {
    showAuthError('Please enter email and password'); return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.message || 'Login failed'); return;
    }

    // ── Save JWT token + session ─────────────────────────────────
    saveToken(data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

    showAuthSuccess('Login successful!');
    setTimeout(() => showMainApp(), 800);

  } catch (error) {
    console.error('[logIn]', error);
    showAuthError('Cannot connect to backend. Is the server running?');
  }
}

/* ── SIGN OUT ────────────────────────────────────────────────────── */
function signOut() {
  const modal = document.getElementById('signout-modal');
  if (modal) modal.classList.remove('hidden');
}

function confirmSignOut() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  location.reload();
}

function cancelSignOut() {
  const modal = document.getElementById('signout-modal');
  if (modal) modal.classList.add('hidden');
}

/* ── UI HELPERS ─────────────────────────────────────────────────── */
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ── PAGE SWITCHING ─────────────────────────────────────────────── */
function showPage(page) {
  currentAuthPage = page;
  document.querySelectorAll('[data-auth-page]').forEach(el => {
    el.style.display = 'none';
  });
  const pageEl = document.querySelector(`[data-auth-page="${page}"]`);
  if (pageEl) pageEl.style.display = 'flex';
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
  pageEl.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]')
        .forEach(input => { input.value = ''; });
  const errorEl   = document.getElementById(page + '-error');
  const successEl = document.getElementById(page + '-success');
  if (errorEl)   errorEl.style.display   = 'none';
  if (successEl) successEl.style.display = 'none';
}

function showMainApp() {
  const authContainer = document.getElementById('auth-container');
  const mainApp       = document.querySelector('.app');

  if (authContainer) authContainer.style.display = 'none';
  if (mainApp)       mainApp.style.display       = 'block';

  const session = getSession();
  if (typeof window !== 'undefined') {
    window.isSignedUp = !!session;
    window.userInfo   = session;
  }

  if (session) {
    const nameEl = document.getElementById('user-name');
    if (nameEl) nameEl.textContent = session.full_name || session.fullName || '';
  }

  if (typeof goTab === 'function') {
    goTab('home');
  } else {
    document.addEventListener('DOMContentLoaded', () => goTab('home'));
  }
}

/* ── INIT ───────────────────────────────────────────────────────── */
function initAuth() {
  if (isLoggedIn()) {
    if (typeof window !== 'undefined') {
      window.isSignedUp = true;
      window.userInfo   = getSession();
    }
    showMainApp();
  } else {
    showPage('signin');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});