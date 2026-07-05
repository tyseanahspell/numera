# Numera Launch Checklist

## Pre-Development Setup
- [ ] Install Node.js 18+ and npm/yarn
- [ ] Install Expo CLI: `npm install -g expo-cli`
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Authentication: Email, Google, Apple, Anonymous
- [ ] Create Firestore database (production mode)
- [ ] Deploy `firebase/firestore.rules`
- [ ] Create RevenueCat project and configure products
- [ ] Obtain AI API keys (OpenAI, Anthropic, or Gemini)

## Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all `EXPO_PUBLIC_*` variables
- [ ] Update `app.config.ts` EAS project ID
- [ ] Configure Google Sign-In OAuth client IDs
- [ ] Configure Apple Sign-In in Apple Developer portal

## Assets
- [ ] Replace `assets/icon.png` (1024×1024)
- [ ] Replace `assets/splash-icon.png`
- [ ] Replace `assets/adaptive-icon.png`
- [ ] Replace `assets/favicon.png`
- [ ] Replace `assets/notification-icon.png`

## Build & Test
- [ ] Run `npm install`
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run typecheck` — no TypeScript errors
- [ ] Test on iOS simulator: `npm run ios`
- [ ] Test on Android emulator: `npm run android`
- [ ] Test guest flow end-to-end
- [ ] Test email sign-up/sign-in
- [ ] Test Apple Sign-In (physical iOS device)
- [ ] Test Google Sign-In
- [ ] Test all 14 calculators with step-by-step output
- [ ] Test AI Coach streaming (with and without API key)
- [ ] Test lesson completion and quiz scoring
- [ ] Test report generation and "Ask AI About This"
- [ ] Test compatibility (premium gate)
- [ ] Test journal create/search
- [ ] Test RevenueCat purchase flow (sandbox)
- [ ] Test restore purchases
- [ ] Test push notifications
- [ ] Test offline mode (AsyncStorage persistence)
- [ ] Test accessibility: VoiceOver, font scaling, high contrast, reduced motion

## App Store Preparation
- [ ] Write App Store description emphasizing educational/entertainment nature
- [ ] Include numerology disclaimer in app description
- [ ] Prepare screenshots (6.7", 6.5", 5.5" iOS + Android)
- [ ] Prepare app preview video
- [ ] Set age rating (likely 4+)
- [ ] Configure privacy policy URL
- [ ] Configure terms of service URL
- [ ] Complete App Privacy questionnaire (data collection disclosure)
- [ ] Submit for App Store review
- [ ] Submit for Google Play review

## Post-Launch
- [ ] Monitor Firebase Analytics / Crashlytics
- [ ] Monitor RevenueCat subscription metrics
- [ ] Seed Firestore `lessons` collection for remote updates
- [ ] Set up CI/CD with EAS Build
- [ ] Plan widget implementation (iOS/Android)
- [ ] Plan community features roadmap
