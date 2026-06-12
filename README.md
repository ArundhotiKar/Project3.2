PUST Laboratory Management System (Project3.2)

Overview

This repository contains a frontend (React + Tailwind) and an existing backend (Express + MongoDB). The frontend uses Firebase auth for authentication and the backend stores application data (users, labs, equipment, issues) in MongoDB. The frontend is in the `frontend/` folder and the backend is in the `backend/` folder.

Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB Atlas or local MongoDB instance (the backend currently includes a MongoDB connection string in `backend/index.js`)

Quick start (Windows / PowerShell)

1) Backend

```powershell
cd backend
npm install
# Start server (development with nodemon):
npm run dev
# Or run once:
npm start
```

The backend runs on http://localhost:5000 by default.

2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs with Vite (default port 5173). Open the printed dev URL (e.g. http://localhost:5173).

Demo credentials (quick login / testing)

- Super Admin: superadmin@pust.ac.bd / super123
- Chairman CSE: chairman.cse@pust.ac.bd / chair123
- Chairman EEE: chairman.eee@pust.ac.bd / chair123
- Chairman ICE: chairman.ice@pust.ac.bd / chair123
- Teacher: teacher@pust.ac.bd / teach123
- Lab In-Charge: labincharge@pust.ac.bd / lab123
- Student: student@pust.ac.bd / stu123

Notes & Important details

- The backend currently connects to MongoDB using the connection string found in `backend/index.js`. If you want to use your own URI, update that file or switch to environment variables.
- The backend exposes endpoints (examples):
	- `GET /users/:email` — get full user info
	- `GET /users/role/:email` — get user role (+status)
	- `GET /users` — list users (supports query filters `department`, `role`, `status`)
	- `PATCH /users/approve/:id` — approve a pending user
	- `DELETE /users/:id` — delete a user
	- `GET /labs`, `GET /labs/:id`, `POST /labs`
	- `GET /equipment`, `GET /equipment/lab/:labId`, `POST /equipment`
	- `GET /issues`, `POST /issues`, `PATCH /issues/:id`

- The frontend includes an Approvals page (for Chairmen) that fetches pending users and allows approve/reject. Sign-up flows currently create users stored in MongoDB with status `pending` (unless they are chairmen or superadmin).

Troubleshooting

- If the backend fails to start because of MongoDB, either ensure your MongoDB URI is reachable or comment out the DB connection and seed logic temporarily for local testing.
- If the frontend complains about missing modules, run `npm install` inside the `frontend/` folder.

Next steps (suggested)

- Implement role-specific dashboards and finer UI elements.
- Add tests and seed scripts for initial data.
- Move sensitive configuration (Mongo URI) into `.env` and update `backend/index.js` to read from `process.env`.

Contacts

- This README was generated automatically as part of the project scaffolding updates. If something doesn't work, open an issue or ask for help with exact errors and I'll help debug.
