# YOUR HOPE — Mental Health Support App · Phnom Penh

A bilingual (English / ខ្មែរ) mental health web app for Phnom Penh.
No build step. Open `index.html` in any modern browser.

---

## File Structure

```
yourhope/
├── index.html   ← App shell and layout
├── style.css    ← Design tokens, components, responsive styles
├── data.js      ← QUESTIONS, CLINICS, RECOMMENDATIONS, translations (T), getLevel()
└── app.js       ← State, tabs, DASS-21 logic, services, AI chat, PDF export
```

---

## Features

**DASS-21 Screening**
- 21 questions across Depression, Anxiety, and Stress scales
- Scores multiplied × 2 per Lovibond & Lovibond (1995) guidelines
- 7-questions-per-page with validation before proceeding
- Results show score, severity level, and personalised recommendations
- Recommendations are bilingual and tiered by severity (Normal → Extremely Severe)

**Service Directory**
- 100 mental health services across all Phnom Penh districts
- Filter by type (Hospital / Clinic / NGO / Service) and NSSF coverage
- Smart recommendation after test: suggests Hospital, Clinic, or NGO based on severity
- Call, Map, and Website actions on every card

**AI Chat (Claude)**
- Powered by Claude via the Anthropic API
- DASS-21 results are passed as context so responses are personalised
- Responds in the same language the user types in
- Quick-prompt chips for common questions

**PDF Export**
- Print-friendly layout using CSS `@media print`
- Shows all three scores, severity levels, and date

**Bilingual**
- Full English and Khmer translations for all UI text
- Language toggle re-renders all dynamic content instantly
- Khmer font: Noto Sans Khmer (loaded via Google Fonts)

---

## Known Issues & To-Do

| Priority | Issue | Fix |
|----------|-------|-----|
| 🔴 High | API key is exposed in browser network traffic | Route chat through a backend proxy (Node/Express or Vercel function) |
| 🔴 High | No visible error when AI chat fails | Show a user-friendly message when the API call fails |
| 🟡 Medium | Google Maps iframe is static — doesn't update with filters | Use Google Maps JS API with dynamic markers per clinic |
| 🟡 Medium | User chat input inserted via `.innerHTML` (XSS risk) | Escape HTML or use `.textContent` for user bubbles |
| 🟡 Medium | NSSF filter labels not translated into Khmer | Apply `applyLang()` pattern to dropdown labels |
| 🟡 Medium | `services` field not shown on clinic cards | Add a collapsible row or tap-to-expand detail |
| 🟢 Low | All 100 clinic cards render at once | Add pagination or "Load more" (20 per page) |
| 🟢 Low | Chat messages disappear when switching tabs | Re-render `chatHist` on tab return |
| 🟢 Low | Most clinic website URLs are missing | Replace Google Search fallback with real URLs in `data.js` |

---

## DASS-21 Scoring Reference

| Scale      | Normal | Mild  | Moderate | Severe | Extremely Severe |
|------------|--------|-------|----------|--------|------------------|
| Depression | 0–9    | 10–13 | 14–20    | 21–27  | 28+              |
| Anxiety    | 0–7    | 8–9   | 10–14    | 15–19  | 20+              |
| Stress     | 0–14   | 15–18 | 19–25    | 26–33  | 34+              |

*Raw item sums × 2 — Lovibond & Lovibond (1995)*

---

## Disclaimer

This app is for informational and screening purposes only.
The DASS-21 is a validated tool but does not constitute a clinical diagnosis.
If you or someone you know is in crisis, please contact a qualified mental health professional immediately.
