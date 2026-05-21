# Upyog Dashboard

Local development README — how to install, configure, seed data, and run the client and server.

## Requirements

- Node.js 18+ (LTS recommended)
- npm (or yarn)
- MongoDB (local or remote URI)

## Repository layout

- `client/` — React + Vite frontend
- `server/` — Express backend with MongoDB

## Install dependencies

Run installs for both folders:

```bash
# from repo root
cd client
npm install

# in a new terminal
cd ../server
npm install
```

## Environment variables

Create `.env` in the `server/` folder with at least the following values for local development:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/upyog
# MONGO_URI is also accepted if you prefer that name
JWT_SECRET=some_secret_here
AUTH_USER=admin
AUTH_PASS=secret123
# Optional (for GROQ LLM integration):
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-70b-versatile
```

For the client you can set (optional) in `client/.env`:

```
VITE_API=http://localhost:4000
```

## Seed the database

The server includes a seeding script that reads `client/src/assets/properties.json`.

```bash
# from server/
npm run seed:mongo
```

Make sure MongoDB is running and `MONGODB_URI` (or `MONGO_URI`) in `server/.env` is reachable.

## Run in development

Start the server and client in separate terminals:

```bash
# terminal 1: start server (with nodemon for auto-reload)
cd server
npm run dev

# terminal 2: start client
cd client
npm run dev
```

- Client default dev URL: `http://localhost:5173`
- Server default API: `http://localhost:4000`

If the server fails to start with `Exit Code 1`, open the server terminal to inspect stack traces.

## Production preview

You can build the client and preview:

```bash
cd client
npm run build
npm run preview
```

## Authentication

The server uses a simple username/password check against `AUTH_USER` / `AUTH_PASS` and issues a JWT cookie. For local testing the defaults are `admin` / `secret123` unless you override them in `server/.env`.

## AI / LLM integration

If you want the AI chat to forward to GROQ's API, set `GROQ_API_KEY` in `server/.env`. Without it the server uses local DB-backed rule handlers to answer dataset-related queries only.

## Helpful tips

- If the UI still shows stale content, hard-refresh the browser (Ctrl+Shift+R) or restart the client dev server.
- Add any local files you don't want committed to the repo to `.gitignore` at the repo root.

## Troubleshooting

- Server `Exit Code 1`: check `server` terminal logs and ensure `MONGODB_URI` (or `MONGO_URI`) is correct and MongoDB is reachable.
- CORS issues: ensure `client` dev origin matches `VITE_API_ORIGIN` or use the default `http://localhost:5173`.

---

If you want, I can also:
- Add a health-check endpoint to the server
- Create a docker-compose for quick local setup
- Add a `Makefile` or npm meta-scripts for starting both client + server

Tell me which you'd like next.
