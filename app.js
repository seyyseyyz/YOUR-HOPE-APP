/* ═══════════════════════════════════════════════════════════════════
  YOUR HOPE — app.js
   Application logic: language, tabs, DASS-21 test, services, chat
   Depends on: data.js (QUESTIONS, CLINICS, T, getLevel)
   ═══════════════════════════════════════════════════════════════════ */


/* ── API CONFIG ────────────────────────────────────────────────────
   Do not redeclare API_BASE here because auth.js already exposes it
   globally as window.API_BASE. Use APP_API_BASE inside app.js.
*/
const APP_API_BASE = window.API_BASE || window.CONFIG?.apiBase || 'http://localhost:5001/api';
const GEMINI_KEY = window.CONFIG?.geminiKey || '';

/* ── APP STATE ──────────────────────────────────────────────────── */
let curLang = 'eng';   // 'eng' | 'kh'
let curPage = 0;      // current question page (0–2, 7 questions each)
let curView = 'list'; // 'list' | 'map'
let isSignedUp = false;
let userInfo = null;
let ANS = {};
const chatHist = [];  // Anthropic messages array
let lastRes    = null;   // last computed DASS-21 result
let displayed  = [...CLINICS]; // currently visible clinics

/* ── RANDOM HERO QUOTES ─────────────────────────────────────────── */
const HERO_WELCOME = {
  eng: ['Welcome to', 'Your-Hope'],
  kh: ['សូមស្វាគមន៍មកកាន់', 'ក្តីសង្ឃឹមរបស់អ្នក']
};

const heroQuotes = {
  eng: [
    'Healing takes time, and asking for help is a courageous step.',
    'Your feelings are valid, and your story matters.',
    'Mental health is just as important as physical health.',
    'Small progress is still progress.',
    'Hope is stronger than fear.',
    'You are stronger than you think.',
    'Every day is a fresh beginning.',
    'Take a deep breath. You are doing your best.',
    'It is okay to slow down and heal.',
    'You deserve happiness, peace, and support.'
  ],
  kh: [
    'ការព្យាបាលត្រូវការពេលវេលា ហើយការសុំជំនួយគឺជាជំហានដ៏ក្លាហាន។',
    'អារម្មណ៍របស់អ្នកមានតម្លៃ ហើយរឿងរ៉ាវរបស់អ្នកក៏សំខាន់។',
    'សុខភាពផ្លូវចិត្តសំខាន់ដូចសុខភាពរាងកាយដែរ។',
    'ការរីកចម្រើនតិចតួច ក៏នៅតែជាការរីកចម្រើន។',
    'ក្តីសង្ឃឹមខ្លាំងជាងការភ័យខ្លាច។',
    'អ្នកខ្លាំងជាងអ្វីដែលអ្នកគិត។',
    'រាល់ថ្ងៃគឺជាការចាប់ផ្តើមថ្មី។',
    'ដកដង្ហើមវែងៗ។ អ្នកកំពុងព្យាយាមបានល្អហើយ។',
    'មិនអីទេបើអ្នកត្រូវការសម្រាក និងព្យាបាលខ្លួន។',
    'អ្នកសមនឹងទទួលបានសន្តិភាព សុភមង្គល និងការគាំទ្រ។'
  ]
};

let currentQuoteIndex = 0;
let heroQuoteTimer = null;

function getHeroQuoteList() {
  return heroQuotes[curLang] || heroQuotes.eng;
}

function setHeroWelcomeText() {
  const welcomeEl = document.getElementById('welcome-text');
  if (!welcomeEl) return;
  const lines = HERO_WELCOME[curLang] || HERO_WELCOME.eng;
  welcomeEl.classList.toggle('khmer-welcome', curLang === 'kh');
  welcomeEl.innerHTML = `<span>${lines[0]}</span><span>${lines[1]}</span>`;
}

function updateHeroQuote() {
  const quoteElement = document.getElementById('hero-random-quote');
  const quotes = getHeroQuoteList();
  if (!quoteElement || !quotes.length) return;
  quoteElement.classList.toggle('khmer-quote', curLang === 'kh');

  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  quoteElement.classList.remove('fade-quote');

  setTimeout(() => {
    quoteElement.textContent = `“${quotes[currentQuoteIndex]}”`;
    quoteElement.classList.add('fade-quote');
  }, 120);
}

function refreshHeroQuoteLanguage(resetIndex = true) {
  const quoteElement = document.getElementById('hero-random-quote');
  const quotes = getHeroQuoteList();
  if (!quoteElement || !quotes.length) return;
  quoteElement.classList.toggle('khmer-quote', curLang === 'kh');
  if (resetIndex) currentQuoteIndex = 0;
  setHeroWelcomeText();
  quoteElement.textContent = `“${quotes[currentQuoteIndex]}”`;
}

function startHeroQuotes() {
  if (heroQuoteTimer) return;
  refreshHeroQuoteLanguage(true);
  heroQuoteTimer = setInterval(updateHeroQuote, 30000);
}

function syncAuthState() {
  const session = typeof getSession === 'function' ? getSession() : null;
  isSignedUp = !!session;
  userInfo = session;
  if (typeof window !== 'undefined') {
    window.isSignedUp = isSignedUp;
    window.userInfo = userInfo;
  }
  if (typeof updateAdminAccessUI === 'function') updateAdminAccessUI();
  return session;
}

document.addEventListener('DOMContentLoaded', () => {
  syncAuthState();
  startHeroQuotes();
});

/* ── LANGUAGE ───────────────────────────────────────────────────── */
function setLang(l) {
  curLang = l;
  document.documentElement.setAttribute('lang', l === 'kh' ? 'kh' : 'en');
  document.querySelectorAll('.lang-btn').forEach((b, i) =>
    b.classList.toggle('active', (i === 0 && l === 'eng') || (i === 1 && l === 'kh'))
  );
  applyLang();
}

function sid(id, v) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = v;
}

function applyLang() {
  const t = T[curLang];
  refreshHeroQuoteLanguage(true);
  sid('nssf-all', curLang === 'kh' ? 'NSSF: ទាំងអស់' : 'NSSF: All');
  sid('nssf-yes', curLang === 'kh' ? 'NSSF: មាន' : 'NSSF: Yes');
  sid('nssf-no',  curLang === 'kh' ? 'NSSF: គ្មាន' : 'NSSF: No');
  const questionsPane = document.getElementById('pane-questions');
  // Brand
  sid('brand-name',    t.brandName);
  sid('brand-tagline', t.brandTag);
  // Hero
  sid('h-eye',   t.hEye);  sid('h-title', t.hTitle); sid('h-sub', t.hSub);
  sid('h-stat1', t.hStat1); sid('h-stat2', t.hStat2); sid('h-stat3', t.hStat3);
  // Home cards
  sid('hc1l', t.hc1l); sid('hc1t', t.hc1t); sid('hc1d', t.hc1d); sid('hc1b', t.hc1b);
  sid('hc2l', t.hc2l); sid('hc2t', t.hc2t); sid('hc2d', t.hc2d); sid('hc2b', t.hc2b);
  sid('hc3l', t.hc3l); sid('hc3t', t.hc3t); sid('hc3d', t.hc3d); sid('hc3b', t.hc3b);
  sid('hc4l', t.hc4l); sid('hc4t', t.hc4t); sid('hc4d', t.hc4d); sid('hc4b', t.hc4b);
  sid('hc5l', t.hc5l); sid('hc5t', t.hc5t); sid('hc5d', t.hc5d); sid('hc5b', t.hc5b);
  sid('h-disc', t.hDisc);
  // Test
  sid('t-eye', t.tEye); sid('t-title', t.tTitle); sid('t-sub', t.tSub);
  sid('t-scaletitle', t.tScaleTitle);
  sid('rl0', t.rl0); sid('rl1', t.rl1); sid('rl2', t.rl2); sid('rl3', t.rl3);
  sid('t-startbtn', t.tStartBtn); sid('t-privacy', t.tPrivacy); sid('t-note', t.tNote);
  // Results
  sid('r-heading', t.rHeading); sid('r-subhead', t.rSubhead);
  sid('r-retake',  t.rRetake);  sid('r-find', t.rFind); sid('r-pdf', t.rPdf);
  sid('r-disc', t.rDisc);
  // Services
  sid('s-eye', t.sEye); sid('s-title', t.sTitle); sid('s-sub', t.sSub);
  sid('vplist', t.svList); sid('vpmap', t.svMap);
  // Chat
  sid('c-eye', t.cEye); sid('c-title', t.cTitle); sid('c-sub', t.cSub); sid('c-disc', t.cDisc);
  // Nav
  sid('nav-home', t.navHome); sid('nav-test', t.navTest);
  sid('nav-services', t.navServices); sid('nav-chat', t.navChat); sid('nav-admin', t.navAdmin || 'Admin');
  // About
  sid('a-eye', t.aEye); sid('a-title', t.aTitle); sid('a-sub', t.aSub);
  sid('about-hero-title', t.aboutHeroTitle);
  sid('about-hero-lead', t.aboutHeroLead);
  sid('about-start-btn', t.aboutStartBtn);
  sid('about-find-btn', t.aboutFindBtn);
  sid('a-mission-title', t.aMissionTitle); sid('a-mission-text', t.aMissionText);
  sid('a-vision-title', t.aVisionTitle); sid('a-vision-text', t.aVisionText);
  sid('a-values-title', t.aValuesTitle);
  sid('about-promise-1', t.aboutPromise1);
  sid('about-promise-2', t.aboutPromise2);
  sid('about-promise-3', t.aboutPromise3);
  sid('about-promise-4', t.aboutPromise4);
  sid('about-why-title', t.aboutWhyTitle);
  sid('about-feature-1-title', t.aboutFeature1Title); sid('about-feature-1-desc', t.aboutFeature1Desc);
  sid('about-feature-2-title', t.aboutFeature2Title); sid('about-feature-2-desc', t.aboutFeature2Desc);
  sid('about-feature-3-title', t.aboutFeature3Title); sid('about-feature-3-desc', t.aboutFeature3Desc);
  sid('about-feature-4-title', t.aboutFeature4Title); sid('about-feature-4-desc', t.aboutFeature4Desc);
  sid('about-feature-5-title', t.aboutFeature5Title); sid('about-feature-5-desc', t.aboutFeature5Desc);
  sid('about-feature-6-title', t.aboutFeature6Title); sid('about-feature-6-desc', t.aboutFeature6Desc);
  sid('about-closing-quote', t.aboutClosingQuote);
  sid('av1-name', t.av1Name); sid('av1-desc', t.av1Desc);
  sid('av2-name', t.av2Name); sid('av2-desc', t.av2Desc);
  sid('av3-name', t.av3Name); sid('av3-desc', t.av3Desc);
  // AI greeting
  sid('ai-greeting', t.aiGreeting);
  // Search placeholder
  const si = document.getElementById('search-inp');
  if (si) si.placeholder = t.searchPH;
  // Rebuild dynamic content
  buildChips();
  renderClinics(displayed);
  if (lastRes) renderResultsUI(lastRes);
  if (questionsPane && !questionsPane.classList.contains('hidden')) renderPage();
}

/* ── TABS ───────────────────────────────────────────────────────── */

function goTab(tab) {
  syncAuthState();

  // If already signed in, redirect to home instead of signin/signup
  if (isSignedUp && (tab === 'signin' || tab === 'signup')) {
    tab = 'home';
  }

  // Check if user needs to sign up before accessing protected pages
  if (tab === 'admin' && !isAdminUser()) {
    alert(curLang === 'kh' ? 'ត្រូវការសិទ្ធិ Admin' : 'Admin access required');
    tab = 'home';
  }

  if ((tab === 'test' || tab === 'services' || tab === 'admin') && !isSignedUp) {
    showAuthPrompt(tab);
    return;
  }
  
  document.querySelectorAll('.screen').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  const tabs = ['home', 'test', 'services', 'chat', 'about', 'admin'];
  const tabIndex = tabs.indexOf(tab);
  if (tabIndex >= 0 && tabIndex < tabs.length) {
    document.querySelectorAll('.nav-btn')[tabIndex].classList.add('active');
  }
  if (tab === 'services') renderClinics(displayed);
  if (tab === 'admin') loadAdminDashboard();
  window.scrollTo(0, 0);
}

/* ── TEST SCREEN ────────────────────────────────────────────────── */
function startTest() {
  document.getElementById('pane-intro').classList.add('hidden');
  document.getElementById('pane-questions').classList.remove('hidden');
  document.getElementById('btn-prev').classList.add('hidden');
  curPage = 0;
  renderPage();
}

function renderPage() {
  const t   = T[curLang];
  const s   = curPage * 7;
  const e   = Math.min(s + 7, 21);
  const pct = Math.round((Object.keys(ANS).length / 21) * 100);

  sid('prog-label', `${s + 1}–${e} / 21`);
  sid('prog-pct',   pct + '%');
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('btn-prev').classList.toggle('hidden', curPage === 0);
  document.getElementById('btn-next').innerHTML =
    e >= 21
      ? (curLang === 'kh' ? 'មើលលទ្ធផល →' : 'See results →')
      : (curLang === 'kh' ? 'បន្ទាប់ →' : 'Next →');

  const tagClass = { d: 'dep', a: 'anx', s: 'str' };
  document.getElementById('q-container').innerHTML = QUESTIONS.slice(s, e).map(q => `
    <div class="q-card ${ANS[q.id] !== undefined ? 'answered' : ''}">
      <span class="q-tag ${tagClass[q.s]}">${t.tagLabels[q.s]}</span>
      <div class="q-text">${curLang === 'kh' ? q.kh : q.eng}</div>
      <div class="rating-row">
        ${[0, 1, 2, 3].map(v => `
          <button class="r-btn ${ANS[q.id] === v ? 'sel' : ''}" onclick="rate(${q.id},${v},this)">
            <strong>${v}</strong>
            <span class="r-lbl">${t['rl' + v]}</span>
          </button>`).join('')}
      </div>
    </div>`).join('');
}

function rate(id, v, btn) {
  ANS[id] = v;
  btn.closest('.rating-row').querySelectorAll('.r-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  btn.closest('.q-card').classList.add('answered');
  const pct = Math.round((Object.keys(ANS).length / 21) * 100);
  document.getElementById('prog-fill').style.width = pct + '%';
  sid('prog-pct', pct + '%');
}

function nextPage() {
  const s = curPage * 7;
  const e = Math.min(s + 7, 21);
  const unanswered = QUESTIONS.slice(s, e).some(q => ANS[q.id] === undefined);
  if (unanswered) {
    alert(curLang === 'kh' ? 'សូមឆ្លើយសំណួរទាំងអស់' : 'Please answer all questions on this page.');
    return;
  }
  if (e >= 21) { showResults(); return; }
  curPage++;
  renderPage();
  window.scrollTo(0, 0);
}

function prevPage() {
  curPage--;
  renderPage();
  window.scrollTo(0, 0);
}

/* ── RESULTS ────────────────────────────────────────────────────── */
function showResults() {
  const sum = (scale) => QUESTIONS
    .filter(q => q.s === scale)
    .reduce((acc, q) => acc + (ANS[q.id] || 0), 0) * 2;

  const dS = sum('d'), aS = sum('a'), sS = sum('s');
  lastRes = {
    dS, aS, sS,
    dL: getLevel('d', dS),
    aL: getLevel('a', aS),
    sL: getLevel('s', sS),
    date: new Date().toLocaleDateString(),
  };
  document.getElementById('pane-questions').classList.add('hidden');
  document.getElementById('pane-results').classList.remove('hidden');
  renderResultsUI(lastRes);
  window.scrollTo(0, 0);

  // ── SAVE TO BACKEND ──────────────────────────────────────────────
  saveResultToBackend(lastRes);
}

async function saveResultToBackend(res) {
  const token = (typeof getToken === 'function') ? getToken() : null;
  if (!token) return; // not logged in, skip silently

  const answers = QUESTIONS.map(q => ({
    question_id:  q.id,
    category:     q.s,
    answer_value: ANS[q.id] ?? 0
  }));

  try {
    const response = await fetch(`${APP_API_BASE}/results`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        depression_score: res.dS,
        anxiety_score:    res.aS,
        stress_score:     res.sS,
        depression_level: res.dL,
        anxiety_level:    res.aL,
        stress_level:     res.sL,
        test_language:    curLang,
        answers
      })
    });

    if (response.ok) {
      console.log('\u2705 Result saved to database');
    } else {
      const err = await response.json();
      console.warn('\u26a0\ufe0f Could not save result:', err.message);
    }
  } catch (error) {
    console.warn('\u26a0\ufe0f Backend not reachable, result not saved:', error.message);
  }
}

function renderResultsUI(res) {
  const t = T[curLang];
  const colors = {
    Normal: '#2E7D52', Mild: '#8B6200', Moderate: '#864200',
    Severe: '#8B1A1A', 'Extremely Severe': '#5E0E0E',
  };
  const lvCls = l => (l === 'Extremely Severe' ? 'lv-Extreme' : 'lv-' + l);

  document.getElementById('result-grid').innerHTML = [
    { cls: 'dep', label: t.scales.d, score: res.dS, level: res.dL },
    { cls: 'anx', label: t.scales.a, score: res.aS, level: res.aL },
    { cls: 'str', label: t.scales.s, score: res.sS, level: res.sL },
  ].map(x => `
    <div class="result-card ${x.cls}">
      <div class="r-card-label">${x.label}</div>
      <div class="r-card-score" style="color:${colors[x.level]}">${x.score}</div>
      <span class="r-badge ${lvCls(x.level)}">${t.lvLabels[x.level]}</span>
    </div>`).join('');

  const severe = [res.dL, res.aL, res.sL].some(l => l === 'Severe' || l === 'Extremely Severe');
  const normal = [res.dL, res.aL, res.sL].every(l => l === 'Normal');
  const interp = severe ? t.interpS : normal ? t.interpN : t.interpM;

  document.getElementById('interp-area').innerHTML = `
    <div class="interp-banner ${interp.cls}">
      <div class="interp-icon">${interp.icon}</div>
      <div>
        <div class="interp-title">${interp.t}</div>
        <div class="interp-text">${interp.b}</div>
      </div>
    </div>`;

    // ── RECOMMENDATIONS ──────────────────────────────────────────
  const levelOrder = ['Normal','Mild','Moderate','Severe','Extremely Severe'];
  const worstLevel = [res.dL, res.aL, res.sL]
    .sort((a, b) => levelOrder.indexOf(b) - levelOrder.indexOf(a))[0];
  const rec = RECOMMENDATIONS[worstLevel];
  if (rec) {
    const tips = rec.tips[curLang].map(tip => `<li>${tip}</li>`).join('');
    document.getElementById('interp-area').innerHTML += `
      <div class="rec-box">
        <div class="rec-title">${rec.title[curLang]}</div>
        <div class="rec-summary">${rec.summary[curLang]}</div>
        <ul class="rec-tips">${tips}</ul>
      </div>`;
  }
}


function resetTest() {
  Object.keys(ANS).forEach(k => delete ANS[k]);
  lastRes = null;
  curPage = 0;
  document.getElementById('pane-results').classList.add('hidden');
  document.getElementById('pane-intro').classList.remove('hidden');
  document.getElementById('prog-fill').style.width = '0%';
  document.getElementById('prog-pct').textContent = '0%';
}

/* ── SERVICES SCREEN ────────────────────────────────────────────── */
function setView(v) {
  curView = v;
  document.getElementById('vplist').classList.toggle('active', v === 'list');
  document.getElementById('vpmap').classList.toggle('active', v === 'map');
  document.getElementById('list-view').style.display = v === 'list' ? 'block' : 'none';
  document.getElementById('map-view').style.display  = v === 'map'  ? 'block' : 'none';
  if (v === 'map') renderMapPins(displayed);
}

function hasRealUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim());
}

function webUrl(c) {
  if (hasRealUrl(c.web)) return c.web.trim();
  return 'https://www.google.com/search?q=' + encodeURIComponent(c.name + ' Phnom Penh mental health');
}

function mapUrl(c) {
  if (hasRealUrl(c.map)) return c.map.trim();
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.name + ' ' + c.loc + ' Phnom Penh');
}

function telUrl(c) {
  const tel = (c.tel || '').replace(/\s+/g, '');
  if (!tel || tel === 'N/A') return '';
  return 'tel:' + tel;
}

function getRecommendationType(res) {
  if (!res) return '';
  const levels = [res.dL, res.aL, res.sL];
  if (levels.some(l => l === 'Severe' || l === 'Extremely Severe')) return 'Hospital';
  if (levels.some(l => l === 'Moderate')) return 'Clinic';
  return 'NGO';
}

function updateRecommendationStrip() {
  const strip = document.getElementById('recommendation-strip');
  if (!strip) return;
  if (!lastRes) { strip.classList.remove('active'); strip.innerHTML = ''; return; }
  const t       = T[curLang];
  const recType = getRecommendationType(lastRes);
  let body = t.recNormal;
  if (recType === 'Hospital') body = t.recSevere;
  if (recType === 'Clinic')   body = t.recModerate;
  strip.classList.add('active');
  strip.innerHTML = `<strong>${t.recTitle}:</strong><br>${body}`;
}

function renderClinics(list) {
  displayed = list;
  updateRecommendationStrip();
  document.getElementById('count-badge').textContent = `${list.length} / ${CLINICS.length}`;
  const t       = T[curLang];
  const recType = getRecommendationType(lastRes);

  document.getElementById('clinic-list').innerHTML = list.map(c => {
    const isRecommended = lastRes && c.type === recType;
    const call = telUrl(c);
    return `
      <div class="clinic-card ${isRecommended ? 'recommended' : ''}">
        <div class="clinic-top">
          <div class="clinic-name">#${c.id} ${c.name}</div>
          <span class="c-badge b-${c.type}">${c.type}</span>
        </div>
        <div class="clinic-details">
          <div class="c-det"><span class="c-det-icon">📍</span>${c.loc}</div>
          <div class="c-det"><span class="c-det-icon">📞</span>${(!c.tel || c.tel === 'N/A') ? t.noTel : c.tel}</div>
          <div class="c-det"><span class="c-det-icon">🕐</span>${c.hours}</div>
          <div class="c-det"><span class="c-det-icon">👤</span>${c.target}</div>
        </div>
        <div class="clinic-footer">
          ${c.nssf === 'Yes' ? '<span class="nssf-pill">✓ NSSF</span>' : ''}
          ${c.cat !== 'General' && c.cat !== c.type ? `<span class="cat-pill">${c.cat}</span>` : ''}
        </div>
        <div class="clinic-actions">
          ${call ? `<a class="action-link call" href="${call}">📞 ${t.callBtn}</a>` : ''}
          <a class="action-link web" href="${webUrl(c)}" target="_blank" rel="noopener noreferrer">🌐 ${t.websiteBtn}</a>
          <a class="action-link map" href="${mapUrl(c)}" target="_blank" rel="noopener noreferrer">🗺️ ${t.mapBtn}</a>
        </div>
      </div>`;
  }).join('');

  if (curView === 'map') renderMapPins(list);
}

function renderMapPins(list) {
  const typeColor = { Clinic: '#4A7C6F', Hospital: '#3A6AC8', NGO: '#6A40C8', Service: '#C4845A' };
  const noteEl = document.getElementById('map-note-area');
  if (!noteEl) return;
  noteEl.innerHTML =
    `<strong style="font-size:12px;color:var(--sage-deep)">Showing ${list.length} locations:</strong><br>` +
    list.slice(0, 20).map(c =>
      `<span style="color:${typeColor[c.type] || '#888'}">●</span> ` +
      `<a href="${mapUrl(c)}" target="_blank" rel="noopener noreferrer" style="color:var(--sage-deep);text-decoration:none">${c.name}</a> — ${c.loc}`
    ).join('<br>') +
    (list.length > 20 ? `<br><em style="color:var(--muted)">…and ${list.length - 20} more</em>` : '');
}

function filterAll() {
  const q    = (document.getElementById('search-inp').value || '').toLowerCase();
  const type = document.getElementById('type-sel').value;
  const nssf = document.getElementById('nssf-sel').value;
  renderClinics(CLINICS.filter(c =>
    (!q    || c.name.toLowerCase().includes(q) || c.loc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)) &&
    (!type || c.type === type) &&
    (!nssf || c.nssf === nssf)
  ));
}

function goRecommended() {
  if (!lastRes) { goTab('services'); return; }
  const recType = getRecommendationType(lastRes);
  document.getElementById('type-sel').value  = recType;
  document.getElementById('nssf-sel').value  = '';
  document.getElementById('search-inp').value = '';
  filterAll();
  goTab('services');
  updateRecommendationStrip();
}

/* ── CHAT SCREEN ────────────────────────────────────────────────── */
function buildChips() {
  document.getElementById('chip-row').innerHTML = T[curLang].chips
    .map(c => `<button class="chip" onclick="useChip('${c.replace(/'/g, "\\'")}'">${c}</button>`)
    .join('');
}


function showAuthPrompt(tab) {
  const modal = document.getElementById('auth-prompt-modal');
  const msg = document.getElementById('auth-prompt-msg');
  if (msg) {
    msg.textContent = tab === 'test'
      ? T[curLang].authPromptTestMsg
      : T[curLang].authPromptServicesMsg;
  }
  if (modal) modal.classList.remove('hidden');
}

function closeAuthPrompt() {
  const modal = document.getElementById('auth-prompt-modal');
  if (modal) modal.classList.add('hidden');
}

function handleAuthPromptSignin() {
  closeAuthPrompt();
  goToSignIn();
}

function handleAuthPromptSignup() {
  closeAuthPrompt();
  goToSignUp();
}

function useChip(t) {
  document.getElementById('chat-inp').value = t;
  sendChat();
}

async function sendChat() {

  const inp = document.getElementById('chat-inp');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';

  const area = document.getElementById('chat-msgs');
  const btn  = document.getElementById('send-btn');
  btn.disabled = true;

  // Render user bubble safely
  const userBubble = document.createElement('div');
  userBubble.className = 'msg msg-user';
  userBubble.textContent = msg;
  area.appendChild(userBubble);

  // Typing indicator
  const typing = document.createElement('div');
  typing.className   = 'msg msg-ai msg-typing';
  typing.textContent = 'Thinking…';
  area.appendChild(typing);
  area.scrollTop = area.scrollHeight;
  
  if (chatHist.length > 20) chatHist.splice(0, chatHist.length - 20);
  chatHist.push({ role: 'user', content: msg });

  const ctx = lastRes
    ? `The user completed DASS-21: Depression=${lastRes.dS}(${lastRes.dL}), Anxiety=${lastRes.aS}(${lastRes.aL}), Stress=${lastRes.sS}(${lastRes.sL}).`
    : 'User has not completed the DASS-21 test yet.';

  // GEMINI_KEY is defined near the top from window.CONFIG

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are a compassionate mental health support assistant for an app called YOUR HOPE in Phnom Penh, Cambodia. Help users understand mental health, interpret DASS-21 results, and find local services. Be warm, empathetic, and concise (2-4 sentences). Never diagnose. Always recommend professional help for serious concerns. ${ctx} Respond in the same language as the user.`
            }]
          },
          contents: chatHist.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        }),
      }
    );

    const d     = await r.json();
    const reply = d.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Sorry, I could not process that. Please try again.';

    chatHist.push({ role: 'assistant', content: reply });
    typing.className   = 'msg msg-ai';
    typing.textContent = reply;

  } catch (err) {
    typing.className   = 'msg msg-ai';
    typing.textContent = curLang === 'kh'
      ? 'មុខងារ AI ត្រូវការអ៊ីនធឺណិត។ សូមព្យាយាមម្តងទៀត។'
      : 'AI feature requires internet connection. Please try again.';
  }

  btn.disabled   = false;
  area.scrollTop = area.scrollHeight;
}

/* ── PDF EXPORT ─────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — printResults() replacement
   INSTRUCTIONS:
     1. Open your app.js
     2. Find the entire printResults() function (lines ~574–607)
     3. DELETE it completely
     4. PASTE this entire file content in its place
   ═══════════════════════════════════════════════════════════════════ */

function printResults() {
  if (!lastRes) {
    alert(curLang === 'kh' ? 'សូមធ្វើតេស្តមុន' : 'Please complete the DASS-21 test first.');
    goTab('test');
    return;
  }

  const t   = T[curLang];
  const isKh = curLang === 'kh';

  /* ── Colour map ───────────────────────────────────────────────── */
  const COLORS = {
    Normal:           { text: '#1a6b3a', bg: '#e8f5ee', badge: '#2E7D52' },
    Mild:             { text: '#7a5400', bg: '#fff8e1', badge: '#8B6200' },
    Moderate:         { text: '#7a3a00', bg: '#fff3e0', badge: '#864200' },
    Severe:           { text: '#7a1a1a', bg: '#ffebee', badge: '#8B1A1A' },
    'Extremely Severe':{ text: '#500000', bg: '#f9e4e4', badge: '#5E0E0E' },
  };

  /* ── User info ───────────────────────────────────────────────── */
  const session   = (typeof getSession === 'function') ? getSession() : null;
  const userName  = session?.full_name || session?.fullName || '—';
  const userEmail = session?.email || '—';
  const userId    = session?.user_id  || session?.userId   || '—';
  const testDate  = new Date().toLocaleDateString(
    isKh ? 'km-KH' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const testTime  = new Date().toLocaleTimeString(
    isKh ? 'km-KH' : 'en-GB',
    { hour: '2-digit', minute: '2-digit' }
  );

  /* ── Labels (bilingual) ──────────────────────────────────────── */
  const LBL = {
    title:       isKh ? 'លទ្ធផលការវាយតម្លៃ DASS-21'          : 'DASS-21 Assessment Results',
    subtitle:    isKh ? 'ការវាយតម្លៃសុខភាពផ្លូវចិត្ត'         : 'Mental Health Screening',
    name:        isKh ? 'ឈ្មោះ'                               : 'Name',
    email:       isKh ? 'អ៊ីមែល'                              : 'Email',
    id:          isKh ? 'លេខសម្គាល់អ្នកប្រើ'                  : 'User ID',
    date:        isKh ? 'កាលបរិច្ឆេទ'                         : 'Date',
    time:        isKh ? 'ម៉ោង'                                 : 'Time',
    section1:    isKh ? 'ពិន្ទុការវាយតម្លៃ'                    : 'Assessment Scores',
    dep:         isKh ? 'ធ្លាក់ទឹកចិត្ត'                       : 'Depression',
    anx:         isKh ? 'ការថប់បារម្ភ'                         : 'Anxiety',
    str:         isKh ? 'ភាពតានតឹង'                           : 'Stress',
    score:       isKh ? 'ពិន្ទុ'                               : 'Score',
    level:       isKh ? 'កម្រិត'                               : 'Level',
    section2:    isKh ? 'ព័ត៌មានលម្អិតតាម척度'                  : 'Scale Breakdown',
    cutoffs:     isKh
      ? 'ចំណុចកាត់ DASS-21: ធ្លាក់ទឹកចិត្ត ធម្មតា ≤9 · ការថប់បារម្ភ ធម្មតា ≤7 · ភាពតានតឹង ធម្មតា ≤14'
      : 'DASS-21 Cutoffs: Depression Normal ≤9 · Anxiety Normal ≤7 · Stress Normal ≤14',
    section3:    isKh ? 'អនុសាសន៍'                             : 'Recommendations',
    disclaimer:  isKh
      ? 'នេះគឺជាឧបករណ៍ការស្ទង់មតិប៉ុណ្ណោះ — វាមិនមែនជាការធ្វើរោគវិនិច្ឆ័យតាមគ្លីនិកឡើយ។ សូមពិគ្រោះជាមួយអ្នកជំនាញសុខភាពផ្លូវចិត្ត។'
      : 'This is a validated screening tool only — it does not constitute a clinical diagnosis. Please consult a qualified mental health professional for assessment and treatment.',
    ref:         isKh
      ? 'ឯកសារយោង: Lovibond, S.H. & Lovibond, P.F. (1995). Manual for the Depression Anxiety & Stress Scales. (2nd Ed.) Sydney: Psychology Foundation.'
      : 'Reference: Lovibond, S.H. & Lovibond, P.F. (1995). Manual for the Depression Anxiety & Stress Scales. (2nd Ed.) Sydney: Psychology Foundation.',
    normal:      isKh ? 'ធម្មតា'       : 'Normal',
    mild:        isKh ? 'តិចតួច'      : 'Mild',
    moderate:    isKh ? 'មធ្យម'        : 'Moderate',
    severe:      isKh ? 'ធ្ងន់'        : 'Severe',
    extSevere:   isKh ? 'ធ្ងន់ណាស់'   : 'Extremely Severe',
    overallTitle:isKh ? 'ការវាយតម្លៃរួម'                     : 'Overall Assessment',
    worstLabel:  isKh ? 'កម្រិតអាក្រក់បំផុត'                 : 'Worst Level',
    appName:     'YOUR HOPE',
    appTag:      isKh ? 'ជំនួយសុខភាពផ្លូវចិត្ត ·ភ្នំពេញ'    : 'Mental Health Support · Phnom Penh',
    pageOf:      isKh ? 'ទំព័រ'                              : 'Page',
  };

  /* ── Worst level ─────────────────────────────────────────────── */
  const ORDER = ['Normal','Mild','Moderate','Severe','Extremely Severe'];
  const worst = [lastRes.dL, lastRes.aL, lastRes.sL]
    .sort((a, b) => ORDER.indexOf(b) - ORDER.indexOf(a))[0];
  const worstCol = COLORS[worst];

  /* ── Recommendation ─────────────────────────────────────────── */
  const rec = RECOMMENDATIONS[worst];

  /* ── Helper: level badge HTML ───────────────────────────────── */
  const badge = (level) => {
    const c = COLORS[level];
    const labelMap = {
      Normal: LBL.normal, Mild: LBL.mild, Moderate: LBL.moderate,
      Severe: LBL.severe, 'Extremely Severe': LBL.extSevere,
    };
    return `<span style="
      display:inline-block;
      background:${c.bg};
      color:${c.text};
      border:1px solid ${c.badge}40;
      font-size:11px;font-weight:700;
      padding:3px 10px;border-radius:20px;
      letter-spacing:.3px;
    ">${labelMap[level]}</span>`;
  };

  /* ── Score bar HTML ─────────────────────────────────────────── */
  const bar = (score, maxScore, level) => {
    const pct = Math.round((score / maxScore) * 100);
    const c   = COLORS[level];
    return `
      <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
        <div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${c.badge};border-radius:4px;"></div>
        </div>
        <span style="font-size:11px;color:#888;min-width:32px;text-align:right">${score}/42</span>
      </div>`;
  };

  /* ── Tips list ──────────────────────────────────────────────── */
  const tips = rec
    ? rec.tips[curLang].map(tip =>
        `<li style="margin-bottom:5px;line-height:1.5">${tip}</li>`
      ).join('')
    : '';

  /* ── Overall status icon ────────────────────────────────────── */
  const statusIcon = ORDER.indexOf(worst) <= 0 ? '💚'
                   : ORDER.indexOf(worst) <= 1 ? '💛'
                   : ORDER.indexOf(worst) <= 2 ? '🟠'
                   : '🔴';

  /* ── Build full print HTML ───────────────────────────────────── */
  const html = `
    <!-- HEADER BAR -->
    <div style="
      background: linear-gradient(135deg, #1e4d35 0%, #2c6b4a 50%, #1e4d35 100%);
      color:#fff; padding:28px 36px 20px; margin-bottom:0;
      display:flex; justify-content:space-between; align-items:flex-end;
    ">
      <div>
        <div style="font-family:'Georgia',serif;font-size:30px;font-weight:700;letter-spacing:-0.5px;margin-bottom:2px;">
          ${LBL.appName}
        </div>
        <div style="font-size:12px;opacity:.8;letter-spacing:.5px;">${LBL.appTag}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:15px;font-weight:700;margin-bottom:2px;">${LBL.title}</div>
        <div style="font-size:11px;opacity:.75;">${testDate} · ${testTime}</div>
      </div>
    </div>

    <!-- ACCENT LINE -->
    <div style="height:4px;background:linear-gradient(90deg,#4a9e72,#8bc4a5,#c4a55a,#8bc4a5,#4a9e72);"></div>

    <!-- PATIENT INFO CARD -->
    <div style="
      background:#f7fbf8; border:1px solid #d4e8db;
      border-top:none; padding:16px 36px;
      display:flex; gap:48px; flex-wrap:wrap;
    ">
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#6b9e7e;font-weight:600;margin-bottom:2px;">${LBL.name}</div>
        <div style="font-size:14px;font-weight:700;color:#1a3d2b;">${userName}</div>
      </div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#6b9e7e;font-weight:600;margin-bottom:2px;">${LBL.email}</div>
        <div style="font-size:14px;color:#1a3d2b;">${userEmail}</div>
      </div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#6b9e7e;font-weight:600;margin-bottom:2px;">${LBL.id}</div>
        <div style="font-size:14px;color:#1a3d2b;">#${userId}</div>
      </div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#6b9e7e;font-weight:600;margin-bottom:2px;">${LBL.date}</div>
        <div style="font-size:14px;color:#1a3d2b;">${testDate}</div>
      </div>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div style="padding:28px 36px; display:flex; gap:24px; flex-wrap:wrap;">

      <!-- LEFT COLUMN -->
      <div style="flex:1;min-width:260px;">

        <!-- SCORES TABLE -->
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#4a7c6f;font-weight:700;margin-bottom:10px;">
          ${LBL.section1}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
          <thead>
            <tr style="background:#1e4d35;color:#fff;">
              <th style="padding:10px 14px;text-align:left;font-weight:600;font-size:12px;border-radius:0;">&nbsp;</th>
              <th style="padding:10px 14px;text-align:center;font-weight:600;font-size:12px;">${LBL.dep}</th>
              <th style="padding:10px 14px;text-align:center;font-weight:600;font-size:12px;">${LBL.anx}</th>
              <th style="padding:10px 14px;text-align:center;font-weight:600;font-size:12px;">${LBL.str}</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#fff;">
              <td style="padding:12px 14px;font-weight:700;color:#333;border-bottom:1px solid #eee;">${LBL.score}</td>
              <td style="padding:12px 14px;text-align:center;border-bottom:1px solid #eee;">
                <span style="font-size:24px;font-weight:800;color:${COLORS[lastRes.dL].badge};">${lastRes.dS}</span>
              </td>
              <td style="padding:12px 14px;text-align:center;border-bottom:1px solid #eee;">
                <span style="font-size:24px;font-weight:800;color:${COLORS[lastRes.aL].badge};">${lastRes.aS}</span>
              </td>
              <td style="padding:12px 14px;text-align:center;border-bottom:1px solid #eee;">
                <span style="font-size:24px;font-weight:800;color:${COLORS[lastRes.sL].badge};">${lastRes.sS}</span>
              </td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="padding:10px 14px;font-weight:700;color:#333;">${LBL.level}</td>
              <td style="padding:10px 14px;text-align:center;">${badge(lastRes.dL)}</td>
              <td style="padding:10px 14px;text-align:center;">${badge(lastRes.aL)}</td>
              <td style="padding:10px 14px;text-align:center;">${badge(lastRes.sL)}</td>
            </tr>
          </tbody>
        </table>

        <!-- SCALE BREAKDOWN BARS -->
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#4a7c6f;font-weight:700;margin-bottom:12px;">
          ${LBL.section2}
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:20px;">
          ${[
            { label: LBL.dep, score: lastRes.dS, level: lastRes.dL },
            { label: LBL.anx, score: lastRes.aS, level: lastRes.aL },
            { label: LBL.str, score: lastRes.sS, level: lastRes.sL },
          ].map(x => `
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                <span style="font-size:12px;font-weight:600;color:#333;">${x.label}</span>
                ${badge(x.level)}
              </div>
              ${bar(x.score, 42, x.level)}
            </div>`).join('')}
        </div>

        <!-- CUTOFFS NOTE -->
        <div style="
          background:#f0f7f3;border-left:3px solid #4a7c6f;
          padding:10px 14px;border-radius:0 6px 6px 0;
          font-size:11px;color:#3d6b55;line-height:1.7;margin-bottom:0;
        ">
          ${LBL.cutoffs}
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div style="width:220px;flex-shrink:0;">

        <!-- OVERALL STATUS -->
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#4a7c6f;font-weight:700;margin-bottom:10px;">
          ${LBL.overallTitle}
        </div>
        <div style="
          background:${worstCol.bg};
          border:2px solid ${worstCol.badge}40;
          border-radius:12px; padding:20px 16px; text-align:center;
          margin-bottom:20px;
        ">
          <div style="font-size:32px;margin-bottom:8px;">${statusIcon}</div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:${worstCol.text};margin-bottom:4px;">${LBL.worstLabel}</div>
          <div style="font-size:18px;font-weight:800;color:${worstCol.badge};">
            ${t.lvLabels[worst]}
          </div>
        </div>

        <!-- SCORE REFERENCE TABLE -->
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#4a7c6f;font-weight:700;margin-bottom:8px;">
          ${isKh ? 'តារាងយោង' : 'Reference Ranges'}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#e8f0eb;">
              <th style="padding:6px 8px;text-align:left;font-weight:600;color:#2c5f3a;">${isKh?'កម្រិត':'Level'}</th>
              <th style="padding:6px 8px;text-align:center;font-weight:600;color:#2c5f3a;">D</th>
              <th style="padding:6px 8px;text-align:center;font-weight:600;color:#2c5f3a;">A</th>
              <th style="padding:6px 8px;text-align:center;font-weight:600;color:#2c5f3a;">S</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { label: LBL.normal,    d:'0–9',   a:'0–7',   s:'0–14',  col:'#2E7D52' },
              { label: LBL.mild,      d:'10–13', a:'8–9',   s:'15–18', col:'#8B6200' },
              { label: LBL.moderate,  d:'14–20', a:'10–14', s:'19–25', col:'#864200' },
              { label: LBL.severe,    d:'21–27', a:'15–19', s:'26–33', col:'#8B1A1A' },
              { label: LBL.extSevere, d:'28+',   a:'20+',   s:'34+',   col:'#5E0E0E' },
            ].map((row, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fbf9'};">
                <td style="padding:5px 8px;color:${row.col};font-weight:600;">${row.label}</td>
                <td style="padding:5px 8px;text-align:center;color:#555;">${row.d}</td>
                <td style="padding:5px 8px;text-align:center;color:#555;">${row.a}</td>
                <td style="padding:5px 8px;text-align:center;color:#555;">${row.s}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- RECOMMENDATIONS -->
    ${rec ? `
    <div style="
      margin:0 36px 28px; padding:20px 24px;
      background:linear-gradient(135deg,#f4faf7,#fdf9f5);
      border:1px solid #d4e8db; border-radius:10px;
      border-left:4px solid ${worstCol.badge};
    ">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#4a7c6f;font-weight:700;margin-bottom:8px;">
        ${LBL.section3}
      </div>
      <div style="font-size:14px;font-weight:700;color:#1a3d2b;margin-bottom:4px;">
        ${rec.title[curLang]}
      </div>
      <div style="font-size:12px;color:#4a6355;margin-bottom:12px;">
        ${rec.summary[curLang]}
      </div>
      <ul style="margin:0;padding-left:20px;color:#333;font-size:12px;">
        ${tips}
      </ul>
    </div>` : ''}

    <!-- FOOTER -->
    <div style="
      margin:0; padding:16px 36px;
      background:#f7fbf8; border-top:1px solid #d4e8db;
    ">
      <p style="font-size:10.5px;color:#555;line-height:1.7;margin:0 0 6px;">
        ${LBL.disclaimer}
      </p>
      <p style="font-size:10px;color:#888;margin:0;">${LBL.ref}</p>
    </div>
  `;

  /* ── Inject into print-zone & print ─────────────────────────── */
  const zone = document.getElementById('print-zone');
  if (zone) {
    // Remove old sub-elements — we control everything from here
    zone.innerHTML = html;
  }

  window.print();
}

/* ── AUTHENTICATION ───────────────────────────────────────────── */


/* ── INIT ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildChips();
  renderClinics(CLINICS);
});
/* ── ADMIN DASHBOARD ────────────────────────────────────────────── */
let adminLoaded = false;
let currentAdminPanel = 'overview';

function isAdminUser() {
  const session = typeof getSession === 'function' ? getSession() : null;
  return session && session.role === 'admin';
}

function updateAdminAccessUI() {
  const btn = document.getElementById('nav-admin-btn');
  if (!btn) return;
  btn.classList.toggle('hidden', !isAdminUser());
}

function adminApi(path, options = {}) {
  const token = typeof getToken === 'function' ? getToken() : null;
  return fetch(`${APP_API_BASE}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Admin request failed');
    return data;
  });
}

function setAdminStatus(message, isError = false) {
  const el = document.getElementById('admin-status');
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('error', isError);
}

function levelBadge(level) {
  const safe = String(level || 'Normal').replace(/\s+/g, '-');
  return `<span class="admin-level-badge admin-level-${safe}">${level || 'Normal'}</span>`;
}

function formatDateTime(value) {
  if (!value) return '—';
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

async function loadAdminDashboard(force = false) {
  if (!isAdminUser()) {
    setAdminStatus('Admin access required.', true);
    return;
  }
  if (adminLoaded && !force) return;

  try {
    setAdminStatus('Loading admin dashboard…');
    const data = await adminApi('/summary');
    const s = data.summary || {};
    const stats = [
      ['Total Users', s.total_users ?? 0, '👥'],
      ['Total Tests', s.total_tests ?? 0, '📋'],
      ['High Risk', s.high_risk_tests ?? 0, '⚠️', 'danger'],
      ['Clinics', s.total_clinics ?? 0, '🏥'],
    ];
    const statsEl = document.getElementById('admin-stats-grid');
    if (statsEl) {
      statsEl.innerHTML = stats.map(([label, value, icon, cls]) => `
        <div class="admin-stat-card ${cls || ''}">
          <div class="admin-stat-icon">${icon}</div>
          <span>${label}</span>
          <strong>${value}</strong>
        </div>`).join('');
    }

    const riskEl = document.getElementById('admin-risk-breakdown');
    if (riskEl) {
      const total = Math.max(Number(s.total_tests || 0), 1);
      const rows = data.risk_breakdown || [];
      riskEl.innerHTML = rows.length ? rows.map(r => {
        const pct = Math.round((Number(r.total) / total) * 100);
        return `<div class="admin-risk-row"><span>${levelBadge(r.worst_level)}</span><strong>${r.total}</strong><div class="admin-risk-bar"><i style="width:${pct}%"></i></div></div>`;
      }).join('') : '<p class="admin-empty">No results yet.</p>';
    }

    const avgEl = document.getElementById('admin-average-scores');
    if (avgEl) {
      avgEl.innerHTML = `
        <div class="admin-average-item dep"><span>Depression</span><strong>${s.avg_depression ?? 0}</strong></div>
        <div class="admin-average-item anx"><span>Anxiety</span><strong>${s.avg_anxiety ?? 0}</strong></div>
        <div class="admin-average-item str"><span>Stress</span><strong>${s.avg_stress ?? 0}</strong></div>`;
    }

    const recentEl = document.getElementById('admin-recent-results');
    if (recentEl) {
      const rows = data.recent_results || [];
      recentEl.innerHTML = rows.length ? rows.map(r => `
        <tr>
          <td><strong>${r.full_name || 'Unknown'}</strong><small>${r.email || ''}</small></td>
          <td>${r.depression_score}</td><td>${r.anxiety_score}</td><td>${r.stress_score}</td>
          <td>${levelBadge(r.worst_level)}</td>
          <td>${formatDateTime(r.created_at)}</td>
        </tr>`).join('') : '<tr><td colspan="6">No screening results yet.</td></tr>';
    }

    await Promise.allSettled([loadAdminUsers(), loadAdminResults(), loadAdminClinics(), loadAdminQuotes()]);
    adminLoaded = true;
    setAdminStatus('Dashboard ready. Data loaded from backend.');
  } catch (err) {
    console.error('[loadAdminDashboard]', err);
    setAdminStatus(err.message || 'Could not load admin dashboard.', true);
  }
}

function switchAdminPanel(panel) {
  currentAdminPanel = panel;
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(el => el.classList.remove('active'));
  const btns = Array.from(document.querySelectorAll('.admin-tab'));
  const idx = ['overview','users','results','clinics','quotes'].indexOf(panel);
  if (btns[idx]) btns[idx].classList.add('active');
  const panelEl = document.getElementById(`admin-panel-${panel}`);
  if (panelEl) panelEl.classList.add('active');
  if (panel === 'users') loadAdminUsers();
  if (panel === 'results') loadAdminResults();
  if (panel === 'clinics') loadAdminClinics();
  if (panel === 'quotes') loadAdminQuotes();
}

async function loadAdminUsers() {
  if (!isAdminUser()) return;
  const q = document.getElementById('admin-user-search')?.value || '';
  const role = document.getElementById('admin-user-role')?.value || '';
  const data = await adminApi(`/users?q=${encodeURIComponent(q)}&role=${encodeURIComponent(role)}&limit=50`);
  const body = document.getElementById('admin-users-body');
  if (!body) return;
  body.innerHTML = (data.users || []).length ? data.users.map(u => `
    <tr>
      <td><strong>${u.full_name}</strong><small>${u.email}</small></td>
      <td>${u.job || '—'}<small>${u.age ? `${u.age} yrs` : 'Age —'} · ${u.gender || 'Gender —'}</small></td>
      <td><select class="admin-mini-select" onchange="updateAdminUser(${u.user_id}, { role: this.value })"><option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option></select></td>
      <td><select class="admin-mini-select" onchange="updateAdminUser(${u.user_id}, { status: this.value })"><option value="active" ${u.status === 'active' ? 'selected' : ''}>active</option><option value="inactive" ${u.status === 'inactive' ? 'selected' : ''}>inactive</option><option value="blocked" ${u.status === 'blocked' ? 'selected' : ''}>blocked</option></select></td>
      <td>${formatDateTime(u.created_at)}</td>
    </tr>`).join('') : '<tr><td colspan="5">No users found.</td></tr>';
}

async function updateAdminUser(userId, payload) {
  try {
    await adminApi(`/users/${userId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    setAdminStatus('User updated successfully.');
  } catch (err) {
    setAdminStatus(err.message, true);
    loadAdminUsers();
  }
}

async function loadAdminResults() {
  if (!isAdminUser()) return;
  const q = document.getElementById('admin-result-search')?.value || '';
  const level = document.getElementById('admin-result-level')?.value || '';
  const data = await adminApi(`/results?q=${encodeURIComponent(q)}&level=${encodeURIComponent(level)}&limit=50`);
  const body = document.getElementById('admin-results-body');
  if (!body) return;
  body.innerHTML = (data.results || []).length ? data.results.map(r => `
    <tr>
      <td><strong>${r.full_name}</strong><small>${r.email}</small></td>
      <td>D ${r.depression_score} · A ${r.anxiety_score} · S ${r.stress_score}</td>
      <td><small>D: ${r.depression_level}<br>A: ${r.anxiety_level}<br>S: ${r.stress_level}</small></td>
      <td>${levelBadge(r.worst_level)}</td>
      <td>${formatDateTime(r.created_at)}</td>
    </tr>`).join('') : '<tr><td colspan="5">No results found.</td></tr>';
}

async function loadAdminClinics() {
  if (!isAdminUser()) return;
  const res = await fetch(`${APP_API_BASE}/clinics?limit=8`);
  const data = await res.json();
  const el = document.getElementById('admin-clinics-body');
  if (!el) return;
  el.innerHTML = (data.clinics || []).length ? data.clinics.map(c => `
    <div class="admin-mini-item">
      <div><strong>${c.name}</strong><small>${c.type} · ${c.location || 'No location'} · NSSF ${c.nssf}</small></div>
      <button onclick="deleteAdminClinic(${c.clinic_id})">Delete</button>
    </div>`).join('') : '<p class="admin-empty">No clinics in database yet.</p>';
}

async function createAdminClinic() {
  try {
    const payload = {
      name: document.getElementById('admin-clinic-name').value.trim(),
      type: document.getElementById('admin-clinic-type').value,
      location: document.getElementById('admin-clinic-location').value.trim() || null,
      phone: document.getElementById('admin-clinic-phone').value.trim() || null,
      nssf: document.getElementById('admin-clinic-nssf').value,
    };
    await adminApi('/clinics', { method: 'POST', body: JSON.stringify(payload) });
    ['admin-clinic-name','admin-clinic-location','admin-clinic-phone'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    setAdminStatus('Clinic added successfully.');
    await loadAdminClinics();
    adminLoaded = false;
  } catch (err) { setAdminStatus(err.message, true); }
}

async function deleteAdminClinic(id) {
  if (!confirm('Delete this clinic?')) return;
  try {
    await adminApi(`/clinics/${id}`, { method: 'DELETE' });
    setAdminStatus('Clinic deleted.');
    await loadAdminClinics();
  } catch (err) { setAdminStatus(err.message, true); }
}

async function loadAdminQuotes() {
  if (!isAdminUser()) return;
  const data = await adminApi('/quotes');
  const el = document.getElementById('admin-quotes-body');
  if (!el) return;
  el.innerHTML = (data.quotes || []).length ? data.quotes.slice(0, 20).map(q => `
    <div class="admin-mini-item quote">
      <div><strong>${q.quote_text}</strong><small>${q.language} · ${q.category} · ${q.is_active ? 'active' : 'inactive'}</small></div>
      <button onclick="deleteAdminQuote(${q.quote_id})">Delete</button>
    </div>`).join('') : '<p class="admin-empty">No quotes yet.</p>';
}

async function createAdminQuote() {
  try {
    const payload = {
      quote_text: document.getElementById('admin-quote-text').value.trim(),
      language: document.getElementById('admin-quote-language').value,
      category: document.getElementById('admin-quote-category').value.trim() || 'hope',
      is_active: true,
    };
    await adminApi('/quotes', { method: 'POST', body: JSON.stringify(payload) });
    document.getElementById('admin-quote-text').value = '';
    setAdminStatus('Quote added successfully.');
    await loadAdminQuotes();
  } catch (err) { setAdminStatus(err.message, true); }
}

async function deleteAdminQuote(id) {
  if (!confirm('Delete this quote?')) return;
  try {
    await adminApi(`/quotes/${id}`, { method: 'DELETE' });
    setAdminStatus('Quote deleted.');
    await loadAdminQuotes();
  } catch (err) { setAdminStatus(err.message, true); }
}

document.addEventListener('DOMContentLoaded', updateAdminAccessUI);
