# New Computer Setup

This repository contains:
- Root API server: Node.js + Express + Prisma
- `admin-panel`: Next.js admin portal
- `client-portal`: Next.js customer portal
- `hotel-portal`: Next.js hotel partner portal
- `merchant-portal`: Next.js merchant partner portal

## 1. Install prerequisites

- Node.js 20.x
- npm
- Docker Desktop or local PostgreSQL 15
- Git

## 2. Clone and enter the project

```bash
git clone git@github.com:jaycruz1987/AYAYA.git
cd AYAYA
git checkout main
git pull origin main
```

## 3. Install dependencies

Run these commands separately because this repo is not a monorepo workspace:

```bash
npm ci
cd admin-panel && npm ci && cd ..
cd client-portal && npm ci && cd ..
cd hotel-portal && npm ci && cd ..
cd merchant-portal && npm ci && cd ..
```

## 4. Create backend environment file

Copy `.env.example` to `.env` in the repository root:

```bash
cp .env.example .env
```

Recommended local values:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/citylink?schema=public"
JWT_SECRET="replace-with-your-own-local-secret"
JWT_EXPIRES_IN="7d"
```

Note:
- `.env.example` currently says `PORT=3000`
- The actual backend fallback is `3001`
- All frontends proxy API requests to `http://localhost:3001`
- For local development, use `PORT=3001`

## 5. Start database

Recommended option with Docker:

```bash
docker compose up -d db
```

This starts PostgreSQL on `localhost:5432`.

## 6. Start backend

From repository root:

```bash
npm run dev
```

Expected URL:
- API: `http://localhost:3001`

## 7. Start frontends

Run each app in its own terminal. Suggested ports:

```bash
cd admin-panel && npm run dev -- --port 3000
cd client-portal && npm run dev -- --port 3002
cd hotel-portal && npm run dev -- --port 3003
cd merchant-portal && npm run dev -- --port 3004
```

Suggested local URLs:
- Admin: `http://localhost:3000`
- Client: `http://localhost:3002`
- Hotel: `http://localhost:3003`
- Merchant: `http://localhost:3004`

## 8. What if login does not work?

Things to check:
- Backend is running on `3001`
- Database is up
- `.env` exists in the root
- `JWT_SECRET` is set
- The app may still need seed data or manual test users depending on the area you are testing

## 9. Important repo notes

- `token.json` is intentionally ignored and not committed
- Local secrets and tokens do not sync through Git
- This repo currently contains in-progress work across multiple portals

## 10. First file to read after cloning

Read this file next:
- `PROJECT_HANDOFF.md`

