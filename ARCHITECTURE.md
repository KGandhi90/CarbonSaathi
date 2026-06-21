# CarbonSaathi — Architecture

## Overview

CarbonSaathi is a React single-page application built with Vite. It follows a strict **layered architecture** where each layer has a single responsibility and dependencies only flow downward — UI → hooks → API/utils → data.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           PAGES (UI Layer)                          │
│         Dashboard.jsx · LogActivity.jsx · Chat.jsx                  │
│   Compose components, read from hooks, trigger user actions         │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ uses
┌────────────────────────────────▼────────────────────────────────────┐
│                    COMPONENTS (Presentational)                      │
│  Navbar · ScoreRing · CategoryCard · WeeklyChart · TipCard          │
│  ActivitySection · ToggleGroup · Stepper · ChatBubble · StatusBadge │
│      Pure view components — no side effects, no API calls           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ uses
┌────────────────────────────────▼────────────────────────────────────┐
│                     HOOKS (Business Logic)                          │
│   useDashboard · useLog · useChat · useTips                         │
│   Derive state from API data — own no UI, own no API details        │
└─────────────────┬──────────────────────────────┬────────────────────┘
                  │ calls                         │ reads from
┌─────────────────▼──────────────┐   ┌───────────▼────────────────────┐
│         API LAYER              │   │          DATA LAYER            │
│  firebase.js · geminiApi.js    │   │  mockData.js · constants.js    │
│  All async I/O lives here      │   │  Static seed data, factors     │
│  Uses safeAsync for errors     │   │  No side effects               │
└─────────────────┬──────────────┘   └────────────────────────────────┘
                  │ uses
┌─────────────────▼──────────────────────────────────────────────────┐
│                        UTILITIES                                    │
│   carbonCalc.js · helpers.js · analytics.js · errorHandler.js      │
│   Pure functions — zero side effects, fully unit-tested             │
└────────────────────────────────────────────────────────────────────┘
```

---

## Directory Map

```
src/
├── api/
│   ├── firebase.js       Firebase Firestore + Anonymous Auth
│   └── geminiApi.js      Gemini AI integration + system prompt
│
├── components/           Purely presentational
│   ├── ActivitySection.jsx   Collapsible log section
│   ├── CategoryCard.jsx      Per-category CO₂ display card
│   ├── ChatBubble.jsx        Chat message bubble
│   ├── ErrorBoundary.jsx     React error boundary fallback
│   ├── Navbar.jsx            Top navigation bar
│   ├── ScoreRing.jsx         Animated SVG carbon score ring
│   ├── StatusBadge.jsx       Inline status/trend badge
│   ├── Stepper.jsx           Numeric stepper ± control
│   ├── TipCard.jsx           Action tip with completion button
│   ├── ToggleGroup.jsx       Radio-style toggle button group
│   └── WeeklyChart.jsx       Recharts weekly bar chart
│
├── context/
│   └── AppContext.jsx     Global static data (emission factors, seed)
│
├── data/
│   └── mockData.js        Static emission factors, tips, profiles
│
├── hooks/
│   ├── useChat.js         Manages chat state + Gemini integration
│   ├── useDashboard.js    Fetches Firebase logs → derives dashboard values
│   ├── useLog.js          Log activity form state + save logic
│   └── useTips.js         Tip completion state
│
├── pages/
│   ├── Chat.jsx           AI Advisor chat page
│   ├── Dashboard.jsx      Main dashboard page
│   └── LogActivity.jsx    Activity logging form
│
├── test/                  Vitest + RTL test suite
│
└── utils/
    ├── analytics.js       GA4 event helpers
    ├── carbonCalc.js      Pure CO₂ calculation functions
    ├── constants.js       All magic numbers centralized
    ├── errorHandler.js    safeAsync wrapper
    └── helpers.js         Formatting, greetings, mock AI
```

---

## Key Design Patterns

### 1. Type Safety via JSDoc + TypeScript Checker
While written in JavaScript, the codebase uses JSDoc annotations validated by TypeScript's checker (`npm run type-check`) for compile-time-equivalent type safety without a build-step change.

```js
/**
 * @param {number} totalKg - Daily total in kg
 * @returns {number} Score 0–100
 */
export function calcScore(totalKg) { ... }
```

### 2. Centralized Constants
All magic numbers (emission factors, score thresholds, timing values, input bounds) are centralized in `/src/utils/constants.js` — never hardcoded inline.

```js
// ✅ Always this:
import { TOAST_DURATION_MS } from '../utils/constants';

// ❌ Never this:
setTimeout(() => ..., 5000);
```

### 3. Safe Async Error Handling
All async operations (Firebase, Gemini) use the `safeAsync` wrapper from `/src/utils/errorHandler.js`, ensuring consistent logging and safe fallback values without ever throwing to the UI.

```js
export async function getRecentLogs() {
  return safeAsync(
    async () => { /* real fetch */ },
    'getRecentLogs',
    []  // ← always returns this on failure
  );
}
```

### 4. Static Tailwind Class Mappings
Dynamic Tailwind classes use static mapping objects instead of template literals — required for Tailwind's JIT purge to work correctly.

```js
// ✅ Correct — Tailwind can see these literal strings:
const COLOR_MAP = { amber: 'bg-amber/10', coral: 'bg-coral/10' };

// ❌ Wrong — Tailwind cannot see interpolated strings:
const cls = `bg-${color}/10`;
```

### 5. User Data Isolation
Every Firestore read/write is scoped to `users/{uid}/activityLogs`. Firebase Anonymous Auth ensures users only ever access their own data. No personally identifiable information is stored.

### 6. Pre-commit Quality Gate
Husky + lint-staged runs ESLint and Prettier on staged files before every commit, preventing unformatted or broken code from entering `main`.

---

## Data Flow: Activity Log → Dashboard

```
User fills LogActivity form
        ↓
useLog hook calculates CO₂ via carbonCalc.js
        ↓
saveActivityLog() → Firestore: users/{uid}/activityLogs/{YYYY-MM-DD}
        ↓  (navigation to Dashboard)
useDashboard fetches getRecentLogs() from Firestore
        ↓
Client-side date filtering → todayLog, weeklyChartData, monthlyTotal
        ↓
calcScore(), getScoreLabel(), formatCO2() derive display values
        ↓
Dashboard renders real data (score, breakdown, chart)
```

---

## Testing Strategy

| Layer | Coverage Target | Approach |
|---|---|---|
| `utils/` | 95%+ | Pure function unit tests |
| `hooks/` | 75%+ | renderHook with Firebase mocked |
| `components/` | 75%+ | RTL render + user interaction tests |
| `pages/` | Not included | Integration tested manually |
| `api/` | Not included | Mocked at hook layer |

Run tests with:
```bash
npm run test:run        # one-shot
npm run test:coverage   # with v8 coverage report
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GEMINI_API_KEY` | Gemini AI API key |
| `VITE_FIREBASE_API_KEY` | Firebase project key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID |

All variables are prefixed `VITE_` so Vite exposes them to the browser bundle. **No secrets should be committed to the repository.**
