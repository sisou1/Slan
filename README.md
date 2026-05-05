# Mini-tournois (MVP)

Stack:
- Frontend: Vue 3 + Vite + TypeScript + axios
- Backend: Node.js + Express + TypeScript
- DB: PostgreSQL

## Structure

```text
.
|-- backend
|   `-- src
|       |-- controllers
|       |-- services
|       |-- routes
|       |-- db
|       |-- app.ts
|       `-- server.ts
`-- frontend
    `-- src
        |-- api
        |-- types.ts
        `-- App.vue
```

## 1) Backend

```bash
cd backend
copy .env.example .env
```

Configure `DATABASE_URL` in `backend/.env`.
For Clever Cloud SSL, keep:
- `DATABASE_USE_SSL=true`
- `DATABASE_SSL_REJECT_UNAUTHORIZED=false`

Create/update tables with:

```bash
npm run db:init
```

Run in dev:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
npm start
```

API is available at `http://localhost:3000`.

## 2) Frontend

```bash
cd frontend
copy .env.example .env
npm run dev
```

Frontend is available at `http://localhost:5173`.

## Endpoints

- `GET /activities`
- `GET /activities/:id`
- `POST /activities`
- `PUT /activities/:id`
- `DELETE /activities/:id`
- `GET /activities/:id/participants`
- `POST /activities/:id/participants`
