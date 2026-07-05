# Numera

A production-ready cross-platform (iOS & Android) numerology education app built with React Native and Expo. Numera teaches numerology through interactive lessons, personalized calculations, beautiful reports, and an **AI Numerology Coach** that acts as your personal teacher and guide.

> **Disclaimer:** Numerology is a spiritual and self-reflection practice intended for entertainment and personal exploration. It is not scientific fact and should not replace professional financial, legal, relationship, or medical advice.

## Features

### Core
- **AI Numerology Coach** — Streaming chat with multi-provider support (OpenAI, Anthropic, Gemini, local fallback)
- **14 Calculators** — Life Path, Expression, Soul Urge, Personality, Birthday, Maturity, Personal Year/Month/Day, Challenges, Pinnacles, Balance, Karmic Debt, Master Numbers
- **Step-by-step calculations** — Every number shows full derivation; AI never invents math
- **12 Interactive Lessons** — With quizzes, progress tracking, and achievements
- **Personalized Reports** — Strengths, career, relationships, lucky colors/days, journal prompts
- **Compatibility Analysis** — Compare two charts (Premium)
- **Daily Insights** — Personal day number, reflection, affirmation, journal prompt
- **Journal** — Mood tags, personal number tags, search, export (Premium)
- **Global Search** — Lessons, numbers, FAQs

### Authentication
- Continue as Guest
- Sign in with Apple
- Sign in with Google
- Email & password

### Premium (RevenueCat)
- Unlimited reports, compatibility, PDF export, journal export, themes, widgets, no ads

### Accessibility
- VoiceOver support, dynamic font sizes, high contrast mode, reduced motion

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Navigation | Expo Router |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| State | Zustand (persisted) |
| Server State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Storage | AsyncStorage |
| Auth & DB | Firebase Auth + Firestore |
| Subscriptions | RevenueCat |
| Notifications | Expo Notifications |
| AI | Multi-provider abstraction layer |
| Testing | Jest + React Native Testing Library |

## Project Structure

```
numera/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Welcome, sign-in, sign-up
│   ├── (onboarding)/             # Profile, experience, goals, complete
│   ├── (tabs)/                   # Home, Learn, Calculators, Coach, More
│   ├── calculator/[type].tsx     # Dynamic calculator screens
│   ├── lesson/[id].tsx           # Lesson detail + quiz
│   ├── report/[id].tsx           # Report viewer
│   ├── compatibility.tsx
│   ├── search.tsx
│   └── premium.tsx
├── src/
│   ├── features/
│   │   ├── authentication/
│   │   ├── coach/                # AI Coach hooks
│   │   ├── home/
│   │   ├── calculators/
│   │   ├── reports/
│   │   ├── learn/data/           # Lesson content
│   │   ├── journal/
│   │   └── settings/
│   └── shared/
│       ├── components/           # Button, Card, Input, NumberBadge, etc.
│       ├── constants/            # Theme, prompts, calculator types
│       ├── hooks/
│       ├── services/
│       │   ├── ai/               # Multi-provider AI abstraction
│       │   ├── api/              # React Query setup
│       │   ├── firebase.ts
│       │   ├── revenuecat.ts
│       │   ├── notifications.ts
│       │   └── search.ts
│       ├── store/                # Zustand stores
│       ├── types/
│       └── utils/
│           └── numerology.ts     # Deterministic calculation engine
├── firebase/
│   ├── schema.ts                 # Firestore schema documentation
│   └── firestore.rules
├── __tests__/                    # Unit & component tests
├── LAUNCH_CHECKLIST.md
└── app.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (for development) or Xcode/Android Studio (for builds)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd numera
npm install

# Configure environment
cp .env.example .env
# Fill in Firebase, RevenueCat, and AI API keys

# Start development server
npm start
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase project credentials |
| `EXPO_PUBLIC_REVENUECAT_APPLE_KEY` | RevenueCat iOS API key |
| `EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY` | RevenueCat Android API key |
| `EXPO_PUBLIC_AI_PROVIDER` | `openai`, `anthropic`, `gemini`, or `local` |
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key |
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Anthropic API key |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini API key |

Without API keys, the AI Coach runs in **local fallback mode** with educational template responses.

### Running

```bash
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm test           # Run Jest tests
npm run typecheck  # TypeScript check
```

## Architecture Highlights

### Numerology Calculation Engine
All numbers are computed deterministically in `src/shared/utils/numerology.ts`. The AI layer receives pre-calculated results and only generates natural-language explanations — it never invents numbers.

### AI Coach Architecture
```
UI (Coach Screen)
  └── useAICoach hook
        └── createAIProvider() ── OpenAI / Anthropic / Gemini / Local
        └── buildCoachMessages() ── System prompts + user context
        └── Calculation Engine ── Verified steps injected into context
```

### State Management
- **Zustand** — Auth, settings, coach conversations, app data (all persisted to AsyncStorage)
- **React Query** — Firestore sync with optimistic updates for reports and journal

### Database Schema
See `firebase/schema.ts` for the full Firestore collection structure. User data is scoped under `users/{userId}/` with subcollections for reports, journal, conversations, progress, and more.

## Design System

| Token | Value |
|-------|-------|
| Navy 900 | `#0A0E1A` |
| Gold | `#C9A84C` |
| Surface | `#12182A` |
| Typography | White on dark, gold accents |
| Style | Premium, calming, minimalist |

## Testing

```bash
npm test              # All tests
npm run test:coverage # With coverage report
```

Tests cover:
- All numerology calculation functions
- Number reduction, master numbers, karmic debt
- Compatibility scoring
- Search functionality
- UI component behavior

## Deployment

1. Complete items in `LAUNCH_CHECKLIST.md`
2. Configure EAS Build: `eas build:configure`
3. Build: `eas build --platform all`
4. Submit: `eas submit`

## License

Proprietary. All rights reserved.
