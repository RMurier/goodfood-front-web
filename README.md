# goodfood-front-web

Customer-facing web application for the [GoodFood](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF) platform. React + TypeScript + Vite.

**Status:** ✅ Implemented (auth flow) — the rest of the customer experience (browsing restaurants, ordering, tracking) isn't built yet; see the parent repo's [Implementation Status](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF#implementation-status).

## Table of Contents

- [Overview](#overview)
- [Pages & Routing](#pages--routing)
- [Security](#security)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Tests](#tests)
- [CI/CD](#cicd)

## Overview

Talks to [`goodfood-ms-auth`](https://github.com/RMurier/goodfood-ms-auth#readme) for account creation and login. `AuthContext` ([`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx)) holds the current user and exposes `login`/`register`/`logout`; `src/services/api.ts` wraps the auth API calls in an axios instance that automatically attaches the bearer token and transparently refreshes it on a `401`.

## Pages & Routing

Routing is handled by `react-router-dom` in [`App.tsx`](src/App.tsx):

| Route | Component | Access |
|-------|-----------|--------|
| `/auth` | [`Auth`](src/pages/Auth/Auth.tsx) | Public — login/register form |
| `/` | [`Home`](src/pages/Home/Home.tsx) | Protected — redirects to `/auth` if not logged in |
| `*` | — | Redirects to `/` |

## Security

- The axios client (`src/services/api.ts`) attaches `Authorization: Bearer <token>` to every request via a request interceptor, and on a `401` transparently calls `/api/auth/refresh` and retries once before giving up and redirecting to `/auth`.
- **Known tradeoff**: access and refresh tokens are stored in `localStorage`, which is readable by any script running on the page — i.e. vulnerable to token theft via XSS, unlike an `httpOnly` cookie. Acceptable for this dev/demo build; worth revisiting (e.g. httpOnly cookie + CSRF token) before anything resembling production traffic. See the parent repo's [Security](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF#security) section for the platform-wide picture.
- This service is also covered by the parent repo's CI/CD security gate — SonarQube, Trivy and OWASP Dependency-Check all run against it on every push.

## Tech Stack

- React 19, TypeScript, Vite 7
- `react-router-dom` 7
- `axios` for HTTP + interceptor-based token refresh
- Vitest for tests

## Environment Variables

Set at build/container time (see `docker-compose.dev.yml` in the [parent repo](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF)):

| Variable | Description |
|----------|--------------|
| `VITE_API_AUTH_URL` | Base URL of `ms-auth` (defaults to `http://localhost:3001`) |
| `VITE_API_RESTAURANT_URL` | Base URL of `ms-restaurant` |
| `VITE_API_PAIEMENT_URL` | Base URL of `ms-paiement` |
| `VITE_API_COMMANDES_URL` | Base URL of `ms-commandes` |
| `VITE_API_TRACKING_URL` | Base URL of `ms-tracking` |

Only `VITE_API_AUTH_URL` is actually consumed by code today (`src/services/api.ts`); the others are wired up in the compose file ahead of the corresponding pages being built.

## Running Locally

### Via the platform's docker-compose (recommended)

From the [parent repo](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF):

```bash
docker compose -f docker-compose.dev.yml up -d front-web-dev ms-auth-dev
```

Runs on `http://localhost:3000` with hot reload (Vite dev server behind port mapping `3000:5173`).

### Standalone

```bash
npm install
npm run dev
```

Point `VITE_API_AUTH_URL` at a running `ms-auth` instance (`.env` or shell env) if it's not on the default `http://localhost:3001`.

## Tests

```bash
npm test
```

Currently a single sanity check ([`src/test/sanity.test.ts`](src/test/sanity.test.ts)) rather than real component/integration coverage — a good next contribution if you're looking for one.

## CI/CD

Built, scanned (SonarQube, Trivy, OWASP Dependency-Check) and published on every push, gated on all of them passing — see the [parent repo's CI/CD Pipeline section](https://github.com/RMurier/BAC-5-CUBE-1-COLLABORATIF#cicd-pipeline) for how the pipeline is wired across repos.
