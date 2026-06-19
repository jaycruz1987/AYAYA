# Project Handoff

This file is the handoff context for continuing the project on another computer or in a new AI session.

## Project structure

- Root: backend API with Express + Prisma
- `admin-panel`: admin operations portal
- `client-portal`: customer-facing portal
- `hotel-portal`: hotel partner portal
- `merchant-portal`: merchant partner portal

## Current branch and intent

- Primary branch: `main`
- Latest remote checkpoint includes unfinished but usable multi-portal work
- Goal: continue development from this checkpoint on another machine

## Major progress already completed

### Client portal

The `client-portal` has the most UI polish work so far, especially the hotel flow:

- Home and navigation polished
- Trips page visually updated
- Hotels landing page redesigned with:
  - bookmark-style top tabs
  - integrated white search card
  - refined spacing and alignment
  - improved premium look and feel
- Date selection UX iterated heavily
- Search flow connected:
  - hotels landing page
  - search results page
  - hotel details page
  - booking page
- Several pages use mock data so the flow can be tested without depending on unstable backend endpoints

### Booking flow state

The customer hotel booking flow is intentionally usable for demo/testing:

- Search opens hotel results
- Hotel card opens hotel details
- `Book Now` opens booking page
- Booking page was visually upgraded and includes guest information fields

## Important implementation notes

- Some client-side hotel pages were switched to mock data mode to avoid runtime issues from incomplete backend/API alignment
- The goal during recent work was to complete the user-facing flow and UI polish first
- Backend and portal work outside `client-portal` is still in progress

## Known technical mismatches

- Root `.env.example` says `PORT=3000`, but backend code falls back to `3001`
- Frontend rewrites proxy to `http://localhost:3001`
- For local dev, backend should run on `3001`
- `hotel-portal` token handling likely has an inconsistency:
  - reads `hotel_token`
  - clears merchant token keys on 401

## Recommended next priorities

1. Normalize environment and port configuration
2. Add a root README for full-project startup
3. Decide which flows should stay on mock data and which should reconnect to backend
4. Recheck authentication and test accounts
5. Verify search, hotel details, and booking data contracts end to end

## How to resume with AI on a new computer

After cloning the repository on the new computer:

1. Open the repo
2. Read `NEW_COMPUTER_SETUP.md`
3. Read this file
4. Start a new AI chat in the IDE
5. Paste the prompt below

## Prompt for the new AI session

```text
This repository was moved from another computer. Please use PROJECT_HANDOFF.md and NEW_COMPUTER_SETUP.md as the working context before making changes.

Current status:
- Multi-portal project with Express/Prisma backend and 4 Next.js portals
- client-portal hotel flow has been heavily polished
- some customer hotel pages use mock data to keep the demo flow working
- backend and other portals are still in progress

Please first inspect:
- PROJECT_HANDOFF.md
- NEW_COMPUTER_SETUP.md

Then help me continue from the current checkpoint without redoing already completed UI work.
```

## Recommended files to inspect first

- `package.json`
- `.env.example`
- `src/server.ts`
- `client-portal/src/app/(main)/hotels/page.tsx`
- `client-portal/src/app/(main)/hotels/search/page.tsx`
- `client-portal/src/app/(main)/hotels/[id]/page.tsx`
- `client-portal/src/app/(main)/hotels/[id]/book/page.tsx`

## Git checkpoint reference

Important recent commits:

- `78984bc` `feat: add client portal booking flow`
- `446bafe` `chore: checkpoint unfinished multi-portal project`

