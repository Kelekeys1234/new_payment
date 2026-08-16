# Nehemiah Building Payment

A full-stack app for registering members/workers and recording their payments. MongoDB is the
data store.

```
payment-app-project/
├── backend/    Spring Boot 3 / Java 17 REST API (MongoDB)
└── frontend/   React + TypeScript (Vite) web app
```

Each folder has its own detailed README (`backend/README.md`, `frontend/README.md`). This file
covers the fastest path to running both together.

---

## 1. Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+ and npm
- A MongoDB connection string (MongoDB Atlas free tier, a self-hosted instance, or
  `mongodb://localhost:27017` for local development — see `backend/README.md` section 3)

---

## 2. Run the backend

```bash
cd backend

export MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nehemiah_building"
# (skip the line above to use a local MongoDB on the default port instead)

mvn spring-boot:run
```

Confirm it's up:
```bash
curl http://localhost:8080/api/health
# {"status":"UP"}
```

The backend listens on **http://localhost:8080**.

---

## 3. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens on **http://localhost:5173** and talks to the backend at
`http://localhost:8080/api` (configurable in `frontend/.env`).

---

## 4. Deploying

- **Backend**: package with `mvn clean package -DskipTests` and run the resulting jar
  (`java -jar target/nehemiah-building-payment-1.0.0.jar`) anywhere that gives you a Java 17
  runtime — Render, Railway, Fly.io, a VM, a container, etc. Set `MONGODB_URI` as an
  environment variable there.
- **Frontend**: `npm run build` produces a static `dist/` folder you can deploy to any static
  host (Vercel, Netlify, S3+CloudFront, etc.). Set `VITE_API_BASE_URL` to your deployed
  backend's `/api` URL before building.
