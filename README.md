# TODO App — Build & Run

This is a guide to build and run the project.

## Option A — Docker (recommended)

From the repository root:

```powershell
# Build images
docker compose build

# Start containers
docker compose up -d
```

Open in your browser:

- Frontend: http://localhost:3000
- API: http://localhost:5000/api

Stop containers:

```powershell
docker compose down
```

## Option B — Run locally (without Docker)

Backend (API):

```powershell
cd Backend
npm install
npm run start
# API will run at http://localhost:5000
```

Frontend (new terminal):

```powershell
cd Frontend
npm install
npm start
# App will open at http://localhost:3000
```
