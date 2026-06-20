# 🌱 CarbonSaathi

> Your Personal Sustainability Companion.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Google Services](#google-services)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Carbon Calculation Methodology](#carbon-calculation-methodology)
- [Deployment](#deployment)

---

## Overview

CarbonSaathi ("saathi" means companion in Hindi) is a carbon footprint tracker and AI advisor built specifically for urban Indians. It helps people understand, track, and reduce their daily environmental impact through simple activity logging, real-time insights, and a deeply knowledgeable AI chatbot.

**Live:** [carbonsaathi.vercel.app](https://carbonsaathi.vercel.app)  
**Repo:** [github.com/KGandhi90/CarbonSaathi](https://github.com/KGandhi90/CarbonSaathi)

---

## Problem Statement

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## Solution

CarbonSaathi solves this with three focused experiences:

**1. Dashboard**
A real-time view of your carbon footprint — today, this week, this month — with a live carbon score, category breakdown across Transport, Food, Energy, and Shopping, and quick action tips personalized to your highest-impact category.

**2. Log Activity**
A simple, fast logging form using India-specific emission factors — metro vs cab, veg vs non-veg meals, AC hours, and shopping spend — with live CO₂ calculation as you fill it in.

**3. AI Advisor**
A Gemini-powered chatbot with a system prompt specialized in Indian sustainability — city-specific transit data, Indian grid emission factors, EV adoption costs, and India's climate policy — giving advice no generic AI chatbot can match.

All activity logs are saved to Firebase, so the dashboard reflects real, personal data — not mock numbers.

---

## Features

| Feature | Description |
|---|---|
| 📊 Live Dashboard | Real carbon score, category breakdown, weekly trend chart — all from your own logged data |
| 📝 Activity Logger | India-specific emission factors for transport, food, energy, and shopping with live calculation |
| 🤖 AI Advisor | Gemini-powered, specialized in Indian sustainability — cities, EVs, diet, energy, policy |
| 🔥 Firebase Sync | Every log saved securely and anonymously, powering real dashboard insights |
| ✅ Daily Tips | Actionable, India-relevant suggestions with estimated CO₂ savings |
| 📱 PWA | Installable on mobile, works offline for static content |
| ♿ Accessible | ARIA labels, keyboard navigation, skip links, screen reader support |
| 📈 Analytics | Google Analytics 4 tracking activity logs, tip completions, and chat usage |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| AI | Google Gemini API (gemini-2.0-flash) |
| Database | Firebase Firestore + Anonymous Auth |
| Security | Firebase App Check (reCAPTCHA v3) |
| Analytics | Google Analytics 4 (react-ga4) |
| Icons | Lucide React |
| Charts | Recharts |
| Fonts | DM Serif Display · DM Sans · JetBrains Mono |
| Testing | Vitest + React Testing Library |
| PWA | vite-plugin-pwa |
| Deployment | Vercel |

---

## Google Services

CarbonSaathi integrates three Google services as core product functionality:

### 1. Google Gemini API
The AI Advisor runs on `gemini-2.0-flash` with a custom system prompt covering India-specific transport emission factors, regional diet patterns, state-wise grid emissions, India's climate policy (Net Zero 2070), and city-specific advice for major Indian metros.

### 2. Firebase Firestore
Every activity log is saved anonymously to Firestore, powering the dashboard's real carbon score, category breakdown, and weekly trend chart. Secured with validated security rules and Firebase App Check.

### 3. Google Analytics 4
Custom events tracked across the user journey:

| Event | Category | Action |
|---|---|---|
| Activity logged | Log | ActivitySaved |
| Tip completed | Dashboard | TipCompleted |
| Chat message sent | Chat | MessageSent |
| Quick reply used | Chat | QuickReplyUsed |
| Dashboard CTA clicked | Dashboard | CTAClicked |
| Render error caught | App | RenderError |

---

## Project Structure

```
carbonsaathi/
├── public/
│   ├── _headers              ← Security headers
│   ├── icon-192.png
│   └── icon-512.png
│
├── src/
│   ├── api/
│   │   ├── geminiApi.js      ← Gemini integration + system prompt
│   │   └── firebase.js       ← Firestore + Auth + App Check
│   │
│   ├── components/
│   │   ├── ActivitySection.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── ChatBubble.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScoreRing.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TipCard.jsx
│   │   └── WeeklyChart.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js       ← Static seed data (emission factors, tips)
│   │
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useDashboard.js   ← Real Firebase data + derived values
│   │   ├── useLog.js
│   │   └── useTips.js
│   │
│   ├── pages/
│   │   ├── Chat.jsx
│   │   ├── Dashboard.jsx
│   │   └── LogActivity.jsx
│   │
│   ├── test/
│   │   ├── setup.js
│   │   ├── carbonCalc.test.js
│   │   ├── helpers.test.js
│   │   ├── analytics.test.js
│   │   ├── CategoryCard.test.jsx
│   │   ├── ChatBubble.test.jsx
│   │   └── StatusBadge.test.jsx
│   │
│   ├── utils/
│   │   ├── analytics.js      ← GA4 helpers
│   │   ├── carbonCalc.js     ← Pure emission calculations
│   │   └── helpers.js        ← Shared utilities
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .github/workflows/
│   └── test.yml              ← CI pipeline
│
├── .env.example
├── vercel.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A free Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
- A Firebase project with Firestore and Anonymous Auth enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/carbonsaathi.git
cd carbonsaathi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your keys to .env

# Start development server
npm run dev
```

---

## Carbon Calculation Methodology

All emission factors are India-specific and based on publicly available data:

| Category | Factor | Source basis |
|---|---|---|
| Car (petrol) | 0.21 kg CO₂/km | Indian vehicle emission averages |
| Metro rail | 0.04 kg CO₂/km | Mumbai/Delhi metro grid efficiency |
| Auto-rickshaw | 0.07 kg CO₂/km | CNG auto emission averages |
| Flight | 0.255 kg CO₂/km | Domestic aviation averages |
| Veg meal | 0.5 kg CO₂ | Indian vegetarian thali lifecycle |
| Chicken meal | 1.5 kg CO₂ | Poultry production lifecycle |
| Mutton meal | 3.0 kg CO₂ | Red meat production lifecycle |
| AC (1 hour) | 0.5 kg CO₂ | India grid emission factor (~0.72 kg/kWh) |
| Shopping (₹1000) | 0.5–4.0 kg CO₂ | Category-dependent (groceries to electronics) |

---

## Deployment

**Frontend:** Vercel  
**Live URL:** [carbonsaathi.vercel.app](https://carbonsaathi.vercel.app)
