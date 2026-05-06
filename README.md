# MindCare PP — Code Review & Project Notes

## File Structure (Separated)

```
mindcare/
├── index.html   ← HTML structure ONLY (no inline CSS or JS)
├── style.css    ← All visual styles, design tokens, responsive rules
├── data.js      ← All static data: QUESTIONS, CLINICS, T (translations), getLevel()
└── app.js       ← All application logic: state, tabs, test, services, chat, PDF
```

---

## ✅ What's Working Well

### 1. DASS-21 Implementation
- Correct scoring: raw scores × 2 as per Lovibond (1995) guidelines
- Correct thresholds for all three scales (Depression, Anxiety, Stress)
- 7-per-page pagination with validation before proceeding
- Progress bar tracks completion across all 21 items

### 2. Bilingual Support (EN / ខ្មែរ)
- Complete translation object for all UI strings
- Language toggle re-renders all dynamic content correctly
- Khmer question text included for all 21 DASS-21 items

### 3. Service Directory
- All 100 entries from dataset included with full details
- Filter by type (Hospital / Clinic / NGO / Service) and NSSF status
- Smart recommendation strip after test: routes to Hospital/Clinic/NGO based on severity
- Call, Map, and Website actions for each entry

### 4. AI Chat (Claude API)
- Context-aware: DASS-21 result is passed into the system prompt
- Responds in the same language as the user
- Includes quick-prompt chips for common questions

### 5. PDF Export
- Clean print layout using CSS `@media print`
- Shows all three scores and severity levels in a table

---

## ⚠️ Issues & Recommendations

### HIGH PRIORITY

**1. API Key Security** *(Critical)*
The app calls `https://api.anthropic.com/v1/messages` directly from the browser.
This exposes your Anthropic API key in network traffic.
> **Fix:** Route chat through a backend proxy (e.g. a simple Node/Express or Vercel function)
> that holds the key server-side. The browser never sees the key.

**2. Missing API Key Handling**
There's no visible API key configuration. The chat silently fails.
> **Fix:** Add a settings panel or environment variable system. Show a helpful error
> like "AI chat requires configuration — please contact the administrator."

**3. No Service Data for "Website" Links**
All clinic `web` fields are missing real URLs. Clicking "Website" opens a Google search.
> **Fix:** Add actual URLs for each clinic where available and store them in `data.js`.

---

### MEDIUM PRIORITY

**4. Map Shows One Static Embed**
The Google Maps iframe shows a fixed view of Phnom Penh regardless of filters.
Filtered results are shown as a text list below, which is functional but not visual.
> **Fix:** Use the Google Maps JavaScript API with dynamic markers, or embed one
> Google Maps link per clinic card instead of a single shared iframe.

**5. No Input Sanitization on Chat**
User input is inserted directly into the DOM via `.innerHTML` on the user bubble.
> **Fix:** Use `.textContent` or escape HTML entities before inserting user messages.

**6. NSSF Filter Label Not Translated**
The NSSF filter dropdown options ("NSSF: All / Yes / No") are hardcoded in English.
> **Fix:** Apply the same `applyLang()` pattern to filter labels.

**7. Services Page Doesn't Show "Services Offered" Field**
The clinic cards show Location, Phone, Hours, and Target Group but omit the
`services` field from the dataset, which contains useful detail.
> **Fix:** Add a collapsible "Services" row or show it on hover/tap.

---

### LOW PRIORITY / ENHANCEMENTS

**8. No Loading State for Services**
On slower connections, the clinic list renders all 100 cards at once.
> **Fix:** Add virtual scrolling or pagination (e.g. 20 per page with a "Load more" button).

**9. Chat History Not Preserved Across Tabs**
Navigating away from Chat and back clears the visible messages (though `chatHist` is kept in memory).
> **Fix:** Re-render `chatHist` messages when returning to the Chat tab.

**10. Print Results Accessible Before Test**
Clicking "Export PDF" from the Home card before taking the test shows an alert and
redirects to the test — this is handled, but the card label could say "Complete test first".
> **Fix:** Show a disabled/greyed state on the PDF card until `lastRes` is set.

**11. Khmer Font Not Loaded**
The Google Fonts import only loads "DM Serif Display" and "DM Sans".
Khmer Unicode text falls back to system fonts.
> **Fix:** Add `family=Noto+Sans+Khmer:wght@400;500;600` to the Google Fonts URL.
> Example: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Noto+Sans+Khmer:wght@400;500;600&display=swap`

---

## DASS-21 Reference

| Scale      | Normal | Mild  | Moderate | Severe | Ext. Severe |
|------------|--------|-------|----------|--------|-------------|
| Depression | 0–9    | 10–13 | 14–20    | 21–27  | 28+         |
| Anxiety    | 0–7    | 8–9   | 10–14    | 15–19  | 20+         |
| Stress     | 0–14   | 15–18 | 19–25    | 26–33  | 34+         |

*Scores are raw item sums × 2 (per Lovibond & Lovibond, 1995)*

---

## Quick Start

Open `index.html` in any modern browser. No build step required.
For the AI chat to work, the app needs a valid Anthropic API key
routed through a backend proxy (see Issue #1 above).
