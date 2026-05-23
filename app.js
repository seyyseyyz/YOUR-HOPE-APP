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
let ANS      = {};  // { questionId: 0|1|2|3 }
const chatHist = [];  // Anthropic messages array
let lastRes    = null;   // last computed DASS-21 result
let displayed  = [...CLINICS]; // currently visible clinics

// Check if user is logged in via auth system
if (typeof getSession === 'function' && getSession()) {
  isSignedUp = true;
  const session = getSession();
  userInfo = session;
}

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
  // Quotes
  sid('q-eye',      t.qEye); sid('q-title', t.qTitle); sid('q-sub', t.qSub);
  sid('home-q-eye', t.qEye);
  // Nav
  sid('nav-home', t.navHome); sid('nav-test', t.navTest);
  sid('nav-services', t.navServices); sid('nav-quotes', t.navQuotes); sid('nav-chat', t.navChat);
  // About
  sid('a-eye', t.aEye); sid('a-title', t.aTitle); sid('a-sub', t.aSub);
  sid('a-mission-title', t.aMissionTitle); sid('a-mission-text', t.aMissionText);
  sid('a-vision-title', t.aVisionTitle); sid('a-vision-text', t.aVisionText);
  sid('a-values-title', t.aValuesTitle);
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
  if (document.getElementById('pane-questions').style.display !== 'none') renderPage();
}

/* ── TABS ───────────────────────────────────────────────────────── */

function goTab(tab) {
  // If already signed in, redirect to home instead of signin/signup
  if (isSignedUp && (tab === 'signin' || tab === 'signup')) {
    tab = 'home';
  }

  // Check if user needs to sign up before accessing test or services
  if ((tab === 'test' || tab === 'services') && !isSignedUp) {
    showAuthPrompt(tab);
    return;
  }
  
  document.querySelectorAll('.screen').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  const tabs = ['home', 'test', 'services', 'quotes', 'chat', 'about'];
  const tabIndex = tabs.indexOf(tab);
  if (tabIndex >= 0 && tabIndex < 6) {
    document.querySelectorAll('.nav-btn')[tabIndex].classList.add('active');
  }
  if (tab === 'services') renderClinics(displayed);
  if (tab === 'quotes') { renderQuotes(); renderQuoteFilters(); }
  window.scrollTo(0, 0);
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

function scrollToQuotes() {
  goTab('home');
  setTimeout(() => {
    const section = document.getElementById('quotes-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function showAuthPrompt(tab) {
  const modal = document.getElementById('auth-prompt-modal');
  const msg = document.getElementById('auth-prompt-msg');
  if (msg) {
    msg.textContent = tab === 'test'
      ? T[curLang].authPromptTestMsg
      : T[curLang].authPromptServicesMsg;
  }
  if (modal) modal.style.display = 'flex';
}

function closeAuthPrompt() {
  const modal = document.getElementById('auth-prompt-modal');
  if (modal) modal.style.display = 'none';
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
    typing.textContent = curLang === 'kh'
      ? 'មុខងារ AI ត្រូវការអ៊ីនធឺណិត និង API Key។ នេះជាកំណែបង្ហាញ។'
      : 'AI feature requires API connection. This is a demo version.';
  }

  btn.disabled   = false;
  area.scrollTop = area.scrollHeight;
}

/* ── PDF EXPORT ─────────────────────────────────────────────────── */
function printResults() {
  if (!lastRes) {
    alert(curLang === 'kh' ? 'សូមធ្វើតេស្តមុន' : 'Please complete the DASS-21 test first.');
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

let activeQuoteCategory = 'all';

function renderQuotes() {
  const container = document.getElementById('quotes-container');
  if (!container) return;
  container.innerHTML = '';
  const categories = QUOTES[curLang];
  Object.entries(categories).forEach(([key, quotesArr]) => {
    if (activeQuoteCategory !== 'all' && activeQuoteCategory !== key) return;
    quotesArr.forEach(quote => {
      const card = document.createElement('div');
      card.className = 'quote-card';
      card.innerHTML = `<p class="quote-text">${quote}</p>`;
      container.appendChild(card);
    });
  });
}

function renderQuoteFilters() {
  const filtersEl = document.getElementById('quotes-filters');
  if (!filtersEl) return;
  filtersEl.innerHTML = QUOTE_CATEGORIES.map(cat => `
    <button class="chip ${activeQuoteCategory === cat.key ? 'active' : ''}"
      onclick="setQuoteCategory('${cat.key}')">
      ${curLang === 'kh' ? cat.kh : cat.eng}
    </button>`).join('');
}

function setQuoteCategory(key) {
  activeQuoteCategory = key;
  renderQuotes();
  renderQuoteFilters();
}

/* ── INIT ───────────────────────────────────────────────────────── */
buildChips();
renderClinics(CLINICS);
