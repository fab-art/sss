# HeroPath

HeroPath is a client-only, offline-first PWA for tracking heroic workout progression. The MVP keeps all state on-device: pure TypeScript domain rules calculate XP, ranks, streaks, and achievements; Zustand orchestrates state; Dexie persists durable records to IndexedDB; localStorage stores lightweight user preferences.

## Architecture

```text
src/
  domain/            pure rules: XP, ranks, streaks, progression, achievements
  db/                Dexie schema and repositories
  store/             Zustand stores that call domain functions and persist results
  features/          feature-oriented React UI
  components/        shared UI primitives
  hooks/             reusable React hooks
  lib/               formatting/date/id utilities
  app/               app composition
  pwa/               PWA notes; manifest config is in vite.config.ts
```

The domain layer has no React, Zustand, Dexie, DOM, or I/O imports so progression rules remain portable and easy to test.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```
