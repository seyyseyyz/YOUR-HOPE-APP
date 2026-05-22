/* ═══════════════════════════════════════════════════════════════════
  YOUR HOPE — app.js
   Application logic: language, tabs, DASS-21 test, services, chat
   Depends on: data.js (QUESTIONS, CLINICS, T, getLevel)
   ═══════════════════════════════════════════════════════════════════ */

/* ── APP STATE ──────────────────────────────────────────────────── */
let curLang = 'eng';   // 'eng' | 'kh'
let curPage = 0;      // current question page (0–2, 7 questions each)
let curView = 'list'; // 'list' | 'map'
let isSignedUp = false; // track sign-up status
let userInfo = null;  // store user data
const ANS      = {};  // { questionId: 0|1|2|3 }
const chatHist = [];  // Anthropic messages array
let lastRes    = null;   // last computed DASS-21 result
let displayed  = [...CLINICS]; // currently visible clinics

/* ── LANGUAGE ───────────────────────────────────────────────────── */
function setLang(l) {
  curLang = l;
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
  sid('nssf-all', curLang === 'kh' ? 'NSSF: ទាំងអស់' : 'NSSF: All');
  sid('nssf-yes', curLang === 'kh' ? 'NSSF: មាន' : 'NSSF: Yes');
  sid('nssf-no',  curLang === 'kh' ? 'NSSF: គ្មាន' : 'NSSF: No');
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
  // Quotes
  sid('q-eye', t.qEye); sid('q-title', t.qTitle); sid('q-sub', t.qSub);
  // Nav
  sid('nav-home', t.navHome); sid('nav-test', t.navTest);
  sid('nav-services', t.navServices); sid('nav-quotes', t.navQuotes); sid('nav-chat', t.navChat);
  // AI greeting
  sid('ai-greeting', t.aiGreeting);
  // Search placeholder
  const si = document.getElementById('search-inp');
  if (si) si.placeholder = t.searchPH;
  // Rebuild dynamic content
  buildChips();
  renderClinics(displayed);
  if (lastRes) renderResultsUI(lastRes);
  if (document.getElementById('pane-questions').style.display !== 'none') renderPage();
}

/* ── TABS ───────────────────────────────────────────────────────── */

function goTab(tab) {
  // Check if user needs to sign up before accessing test or services
  if ((tab === 'test' || tab === 'services') && !isSignedUp) {
    alert('Please sign up first to access this feature.');
    goTab('signup');
    return;
  }
  
  document.querySelectorAll('.screen').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  const tabs = ['home', 'test', 'services', 'quotes', 'chat', 'about', 'signup', 'signin'];
  const tabIndex = tabs.indexOf(tab);
  if (tabIndex >= 0 && tabIndex < 5) {
    document.querySelectorAll('.nav-btn')[tabIndex].classList.add('active');
  }
  if (tab === 'services') renderClinics(displayed);
  if (tab === 'quotes') renderQuotes();
  window.scrollTo(0, 0);
}

/* ── SIGN IN ────────────────────────────────────────────────────── */
function completeSignin(e) {
  e.preventDefault();

  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  // Check if user exists in localStorage
  const stored = localStorage.getItem('yourHopeUser');
  if (!stored) {
    alert('No account found. Please create a new account.');
    goTab('signup');
    return;
  }

  try {
    userInfo = JSON.parse(stored);

    // Simple password check (in production, use proper hashing)
    // For demo purposes, accept any password for existing users
    if (userInfo.email.toLowerCase() === email.toLowerCase()) {
      isSignedUp = true;

      // Clear sign-in form
      document.getElementById('signin-email').value = '';
      document.getElementById('signin-password').value = '';
      document.getElementById('remember-check').checked = false;

      // Go to home
      goTab('home');
    } else {
      alert('Email not found. Please create a new account.');
      goTab('signup');
    }
  } catch (err) {
    alert('Sign in failed. Please try again or create a new account.');
    goTab('signup');
  }
}

/* ── SIGN UP ────────────────────────────────────────────────────── */
function completeSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('name-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const age = document.getElementById('age-input').value;
  const gender = document.getElementById('gender-input').value;
  const district = document.getElementById('district-input').value;
  
  if (!name || !email || !age || !gender || !district) {
    alert('Please fill in all fields');
    return;
  }
  
  // Store user info in localStorage
  userInfo = { name, email, age, gender, district, signupTime: new Date().toISOString() };
  localStorage.setItem('yourHopeUser', JSON.stringify(userInfo));
  isSignedUp = true;
  
  // Clear signup form and redirect to home
  document.getElementById('name-input').value = '';
  document.getElementById('email-input').value = '';
  document.getElementById('age-input').value = '';
  document.getElementById('gender-input').value = '';
  document.getElementById('district-input').value = '';
  document.getElementById('terms-check').checked = false;
  
  goTab('home');
}

// Check for existing user session on page load
function checkExistingUser() {
  const stored = localStorage.getItem('yourHopeUser');
  if (stored) {
    try {
      userInfo = JSON.parse(stored);
      isSignedUp = true;
      // Show sign out button (user is logged in)
      document.getElementById('signout-btn').style.display = 'inline-block';
      // Pre-fill the email field so they just need to enter password
      document.getElementById('signin-email').value = userInfo.email;
      // Stay on sign-in screen - user needs to confirm by signing in
      // goTab('signin'); // Already on signin by default
    } catch (e) {
      isSignedUp = false;
    }
  }
}

// Sign out function
function signOut() {
  localStorage.removeItem('yourHopeUser');
  userInfo = null;
  isSignedUp = false;
  document.getElementById('signout-btn').style.display = 'none';
  goTab('signin');
}

/* ── TEST SCREEN ────────────────────────────────────────────────── */
function startTest() {
  document.getElementById('pane-intro').style.display     = 'none';
  document.getElementById('pane-questions').style.display = 'block';
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
  document.getElementById('btn-prev').style.display = curPage > 0 ? '' : 'none';
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
  document.getElementById('pane-questions').style.display = 'none';
  document.getElementById('pane-results').style.display   = 'block';
  renderResultsUI(lastRes);
  window.scrollTo(0, 0);
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
  document.getElementById('pane-results').style.display = 'none';
  document.getElementById('pane-intro').style.display   = 'block';
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
          <div class="c-det"><span class="c-det-icon">📞</span>${c.tel || t.noTel}</div>
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

  // Render user bubble
  area.innerHTML += `<div class="msg msg-user">${msg}</div>`;

  // Typing indicator
  const typing = document.createElement('div');
  typing.className   = 'msg msg-ai msg-typing';
  typing.textContent = 'Thinking…';
  area.appendChild(typing);
  area.scrollTop = area.scrollHeight;

  chatHist.push({ role: 'user', content: msg });

  const ctx = lastRes
    ? `The user completed DASS-21: Depression=${lastRes.dS}(${lastRes.dL}), Anxiety=${lastRes.aS}(${lastRes.aL}), Stress=${lastRes.sS}(${lastRes.sL}).`
    : 'User has not completed the DASS-21 test yet.';

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a compassionate mental health support assistant for an app called MindCare PP in Phnom Penh, Cambodia. Help users understand mental health, interpret DASS-21 results, and find local services. Be warm, empathetic, concise (2-4 sentences). Never diagnose. Always recommend professional help for serious concerns. ${ctx} Respond in the same language as the user.`,
        messages: chatHist,
      }),
    });

    const d     = await r.json();
    const reply = d.content?.map(i => i.text || '').join('') || 'Sorry, I could not process that. Please try again.';
    chatHist.push({ role: 'assistant', content: reply });
    typing.className   = 'msg msg-ai';
    typing.textContent = reply;
  } catch (err) {
    typing.className   = 'msg msg-ai';
    typing.textContent = curLang === 'km'
      ? 'មុខងារ AI ត្រូវការអ៊ីនធឺណិត និង API Key។ នេះជាកំណែបង្ហាញ។'
      : 'AI feature requires API connection. This is a demo version.';
  }

  btn.disabled   = false;
  area.scrollTop = area.scrollHeight;
}

/* ── PDF EXPORT ─────────────────────────────────────────────────── */
function printResults() {
  if (!lastRes) {
    alert(curLang === 'km' ? 'សូមធ្វើតេស្តមុន' : 'Please complete the DASS-21 test first.');
    goTab('test');
    return;
  }
  const t      = T[curLang];
  const colors = {
    Normal: '#2E7D52', Mild: '#8B6200', Moderate: '#864200',
    Severe: '#8B1A1A', 'Extremely Severe': '#5E0E0E',
  };
  sid('pm-meta', `${t.pmMeta} — ${lastRes.date}`);
  document.getElementById('print-content').innerHTML = `
    <table class="print-table">
      <thead>
        <tr><th></th><th>${t.pDep}</th><th>${t.pAnx}</th><th>${t.pStr}</th></tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:left;font-weight:600">${t.pScore}</td>
          <td style="font-size:22px;font-weight:700;color:${colors[lastRes.dL]}">${lastRes.dS}</td>
          <td style="font-size:22px;font-weight:700;color:${colors[lastRes.aL]}">${lastRes.aS}</td>
          <td style="font-size:22px;font-weight:700;color:${colors[lastRes.sL]}">${lastRes.sS}</td>
        </tr>
        <tr>
          <td style="text-align:left;font-weight:600">${t.pLevel}</td>
          <td style="color:${colors[lastRes.dL]};font-weight:600">${t.lvLabels[lastRes.dL]}</td>
          <td style="color:${colors[lastRes.aL]};font-weight:600">${t.lvLabels[lastRes.aL]}</td>
          <td style="color:${colors[lastRes.sL]};font-weight:600">${t.lvLabels[lastRes.sL]}</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:12px;color:#666;margin-top:8px">
      DASS-21 Cutoffs: Depression Normal ≤9 · Anxiety Normal ≤7 · Stress Normal ≤14
    </p>`;
  window.print();
}

/* ── AUTHENTICATION ───────────────────────────────────────────── */
function initAuth() {
  const stored = localStorage.getItem('yourHopeUser');
  if (stored) {
    try {
      userInfo = JSON.parse(stored);
      isSignedUp = true;
      showMainApp();
      applyLang();
    } catch (e) {
      console.error('Auth init error:', e);
      isSignedUp = false;
    }
  }
}

function toggleAuthMode() {
  const signupForm = document.getElementById('signup-form');
  const signinForm = document.getElementById('signin-form');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  
  if (signupForm.style.display === 'none') {
    signupForm.style.display = 'block';
    signinForm.style.display = 'none';
    title.textContent = 'Create Account';
    subtitle.textContent = 'Welcome to YOUR HOPE';
  } else {
    signupForm.style.display = 'none';
    signinForm.style.display = 'block';
    title.textContent = 'Sign In';
    subtitle.textContent = 'Welcome back to YOUR HOPE';
  }
  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleSignup() {
  clearAuthErrors();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  
  let valid = true;
  
  if (!name) {
    document.getElementById('error-name').textContent = 'Name is required';
    valid = false;
  }
  
  if (!email) {
    document.getElementById('error-email').textContent = 'Email is required';
    valid = false;
  } else if (!validateEmail(email)) {
    document.getElementById('error-email').textContent = 'Invalid email format';
    valid = false;
  }
  
  if (!password) {
    document.getElementById('error-password').textContent = 'Password is required';
    valid = false;
  } else if (password.length < 6) {
    document.getElementById('error-password').textContent = 'Password must be at least 6 characters';
    valid = false;
  }
  
  if (password !== confirm) {
    document.getElementById('error-confirm').textContent = 'Passwords do not match';
    valid = false;
  }
  
  if (!valid) return;
  
  const users = JSON.parse(localStorage.getItem('yourHopeUsers') || '[]');
  if (users.some(u => u.email === email)) {
    document.getElementById('error-email').textContent = 'Email already registered';
    return;
  }
  
  const user = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
  users.push(user);
  localStorage.setItem('yourHopeUsers', JSON.stringify(users));
  localStorage.setItem('yourHopeUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  
  userInfo = { id: user.id, name: user.name, email: user.email };
  isSignedUp = true;
  showMainApp();
  applyLang();
}

function handleSignin() {
  clearAuthErrors();
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  
  let valid = true;
  
  if (!email) {
    document.getElementById('error-email-login').textContent = 'Email is required';
    valid = false;
  }
  
  if (!password) {
    document.getElementById('error-password-login').textContent = 'Password is required';
    valid = false;
  }
  
  if (!valid) return;
  
  const users = JSON.parse(localStorage.getItem('yourHopeUsers') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    document.getElementById('error-email-login').textContent = 'Invalid email or password';
    return;
  }
  
  localStorage.setItem('yourHopeUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  userInfo = { id: user.id, name: user.name, email: user.email };
  isSignedUp = true;
  showMainApp();
  applyLang();
}

function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    localStorage.removeItem('yourHopeUser');
    userInfo = null;
    isSignedUp = false;
    ANS = {};
    chatHist.length = 0;
    lastRes = null;
    curPage = 0;
    showAuthScreen();
  }
}

function showMainApp() {
  document.getElementById('tab-signup').classList.remove('active');
  document.getElementById('app-main').style.display = '';
  document.querySelectorAll('.screen').forEach((s, i) => {
    s.classList.toggle('active', i === 1);
  });
}

function showAuthScreen() {
  document.getElementById('app-main').style.display = 'none';
  document.getElementById('tab-signup').classList.add('active');
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('auth-title').textContent = 'Create Account';
  document.getElementById('auth-subtitle').textContent = 'Welcome to YOUR HOPE';
  clearAuthErrors();
  document.getElementById('signup-name').value = '';
  document.getElementById('signup-email').value = '';
  document.getElementById('signup-password').value = '';
  document.getElementById('signup-confirm').value = '';
  document.getElementById('signin-email').value = '';
  document.getElementById('signin-password').value = '';
}

window.addEventListener('DOMContentLoaded', initAuth);
    "ធ្វើការលើសុបិន្តរបស់អ្នកក្នុងពេលវេលាដែលងាយស្រួលនឹងមិនដំណើរការទេ។ ពេលដែលអ្នកក្លាហាននឹងសុបិន្ត អ្នកក៏ត្រូវក្លាហាននឹងលទ្ធផល",
    "ធ្វើឱ្យបង្វែលក្រុមទីពីររបស់អ្នក វាដឹងលក្ខណៈផ្លូវ",
    "ខ្ញុំឈប់ស្វាងជីវិតរបស់ខ្ញុំប្រឆាំងនឹងមនុស្សដែលបានទទួលផ្តើមដោយស្វាភាវិក",
    "ការថប់បារម្ភសង្គមបង្កើតចេញពីការស្ថិតក្នុងរង្វង់បងប្អូនដែលប្រឆាំងនឹងអ្នក",
    "ប្រសិនបើអ្នកមានគំនិតល្អ វានឹងភ្លឺលាស់ដូចកាំរស្មីព្រះអាទិត្យ ហើយអ្នកនឹងតែងតែមើលឃើញពន្លឺ",
    "សុបិន្តក្លាយជាសក្សមចាប់តាំងពីវាស្ថិតក្នុងចិត្ត មិនដាំក្នុងដីនៃសកម្មភាពទេ",
    "ពិភពលោកក្នុងទូរស័ព្ទរបស់អ្នកគឺវាស្ត ប៉ុន្តែពិភពលោកខាងក្រៅវាគ្មានដែនកំណត់",
    "បន្ទាប់ពីរៀបចំឡាន អ្នកអាចលើកលែងឱ្យមនុស្សណាម្នាក់ សូម្បីតែក្រុមគ្រួសាររបស់ខ្លួនក៏ដោយ",
    "យើងមិនបានជ្រើសរើសក្រុមគ្រួសាររបស់យើង ប៉ុន្តែយើងអាចជ្រើសរើសមិត្ត។ ដោយក្លាហាន យើងអាចលុបបង្គោលមនុស្សឆ្កួត ហើយផ្តោតលើអ្នកដែលពិតជាគោរពយើង",
    "គ្រួសារគឺគួរតែជាដ្ឋានសុវត្ថិភាពរបស់យើង ប៉ុន្តែឯកសារច្រើនដង វាជាកន្លែងដែលយើងរកឃើញការឈឺចាប់ជ្រើលជ្រាល",
    "សូមស្វាគមន៍ចំពោះឱកាសគ្រប់គ្រាន់ដែលជីវិតផ្តល់ឱ្យអ្នក",
    "ប្រកាសលម្អដែលអ្នកបានប្រឹងប្រែង",
    "ផ្កាកូសនឹងរីកចម្រើននៅក្នុងបេតុង ក្រោយក្រោយក្រោយ វាឈានទៅមុខ។ ក្លាយជាផ្កាលោក ហើយលូតលាស់",
    "ឈប់ការគិតគូរច្រើនដង ហើយមើលថាតើរលាយល្អរីករាយកើតឡើងដោយរបៀបណា",
    "ដោះលែងដូចម្តេចដែលលែងបម្រើយើង",
    "ថ្ងៃនឹងមកដែលអ្នកមិនចង់싸싹ដល់ប៉ុន្តែបង្ខំឱ្យលើកស្រមាប់រំលាក់",
    "មនុស្សខ្លាំងបំផុតគឺមនុស្សដែលបានប្រឈមប្រឈង ហើយសម្រេចចិត្តលង្គឹងវា",
    "អ្នកបង្ខំខ្លួនឯង ថែមទាំងពេលដែលអ្នកស្ឋិតក្នុងភាពយ៉ាង ខ្ញុំឃើញលេបរណ្ដៅក្នុងអ្នក",
    "ចងចាំថា មិនថាសប្តាហ៍នេះនាំមកផ្លូវដូចម្តេចក្តី អ្នកអាចគាំងវាបាន",
    "ពេលខ្លះអ្នកត្រូវរំដោះខ្លួនឱ្យឃើញយ៉ាងច្បាស់",
    "ស្វាយថាតើអ្វីដែលធ្វើឱ្យលេងលឺ ហើយធ្វើវាច្រើនទៀត",
    "គំនិតរបស់អ្នកនឹងផ្លាស់ប្តូរជីវិតរបស់អ្នក។ ជ្រើសរើសវាដោយប្រាជ្ញា",
    "ពិការភាព និងកង្វល់របស់អ្នកគឺផ្នែកល្អបំផុតរបស់អ្នក ធ្វើឱ្យមាននឹក",
    "អ្នកបានឆ្លងកាត់불 ឥឡូវ វេលាកសិកម្មដ្ឆាប់វាឡើងមុខ",
    "ការថប់បារម្ភរបស់អ្នកឈកចាប់របស់អ្នក អ្នកត្រូវបានស្រឡាញ់ អ្នកត្រូវបានទទួលយក ហើយអ្នកត្រូវការ",
    "គ្មានការបាត់បង់ទេ មានតែឱកាសក្នុងការរៀនសូត្របង្វឺត",
    "សូម្បីថ្ងៃខាងក្រោមរបស់អ្នកក្៏ខណៈពេលដប៉ាន់ម៉ាង។ ព្រះអាទិត្យនឹងលិច ហើយថ្ងៃថ្មីនឹងក្រោក",
    "ប្រសិនបើអ្នកក្រោកស្មោះប្តាប់ដើម្បីថ្ងៃក្រោយល្អ ប្រាប់ឡើងវិលមកវិលលេងថ្ងៃថ្មីដែលល្អ",
    "ទំព័ររឌ័រនេះប្រហែលជាមិនដែលរបស់អ្នកទេ ប៉ុន្តែវគ្គចាប់ក្រោយក្រោយក្នុងជីវិតរបស់អ្នក នឹងវាលឆ្ងាយ",
    "ឬឯងក្នុងស្ថានការណ៍ដ៏ពិបាក អ្នកមានគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីឆ្លងកាត់វា",
    "ជីវិតអាចមានព្យុះលេចចេញ។ ឡើងកម្ពស់ ហើយដោះលែងក្នុងការរង្ហន់។ ឈាក់នឹងប្រឹងឡើងយ៉ាងលឿន",
    "នៅពេលដែលស្ដិតរបស់អ្នក និងខួរក្បាលស្ស្ស័ នុំនឹង បង្វែលលេងលឺ",
    "មិនថាមានអ្វីកើតឡើងក្ដី អ្នកខ្លាំងគ្រាន់គាំងវា",
    "វាមិនតែងតែងាយស្រួល វាមិនតែងតែសប្បាយក្បាលទេ។ ប៉ុន្តែលទ្ធផល វាតែងតែមានតម្លៃ",
    "ដូច្នេះ ថែមទាំងក្នុងស្ថានការណ៍មិនទាន់អាចរើសយក",
    "ពេលខ្លះវាត្រូវការស្វាលក្រោយមកដើម្បីឈានទៅចៀងថ្មី",
    "ធ្វើការល្អបំផុតដែលស្ដិតរបស់អ្នក ឯណាយ៉ាងក៏ដោយ",
    "អ្នកត្រូវការ អ្នកសមរម្យដែលល្អបំផុត អ្នកនៅទីនេះដោយហេតុផល",
    "អ្វីគ្រប់យ៉ាងកើតឡើងដោយហេតុផល។ ជីវិតបង្វិលក្នុងលោងក្រោយ ដូច្នេះអ្នកអាចរំណើរដ្ឆាប់។ រស់នៅក្នុងជីវិត ឆាប់ឆ្ងើយ ឡើងលែង។ ដោះលែងចាប់ពីអតីតកាល"
  ]
};

function renderQuotes() {
  const quotes = QUOTES[curLang];
  const container = document.getElementById('quotes-container');
  if (!container) return;
  container.innerHTML = '';
  
  quotes.forEach(quote => {
    const card = document.createElement('div');
    card.className = 'quote-card';
    card.innerHTML = `<p class="quote-text">${quote}</p>`;
    container.appendChild(card);
  });
}

/* ── INIT ───────────────────────────────────────────────────────── */
checkExistingUser();
buildChips();
renderClinics(CLINICS);
