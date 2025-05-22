<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="120" alt="React Logo" />
</p>

<h1 align="center">Goose Game – Fullstack Tech Task</h1>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/backend-NestJS-red?logo=nestjs" /></a>
  <a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/frontend-React-blue?logo=react" /></a>
  <a href="https://goose-fe.vercel.app/" target="_blank"><img src="https://img.shields.io/badge/demo-online-brightgreen" /></a>
</p>

---

## 🚀 Demo

**Live demo:** [https://goose-fe.vercel.app/](https://goose-fe.vercel.app/)

---

## 🛠️ Stack

- **Backend:** [NestJS](https://nestjs.com/) (TypeScript, PostgreSQL, Sequelize)
- **Frontend:** [React](https://react.dev/) (Vite, TypeScript)
- **Deployment:** Vercel (Frontend), Docker-ready (Backend)
- **API Auth:** JWT (with roles: admin, nikita, survivor)

---

## 👤 Credentials

You can use the following demo users to log in:

| Username | Password | Role      |
|----------|----------|-----------|
| admin    | admin    | admin     |
| nikita   | nikita   | nikita    |
| survivor1| test123  | survivor  |
| other    | test123  | survivor  |

---

## 📋 Task & Mockups

- **Original task (RU):** [https://github.com/round-squares/tech-task-for-interview/wiki#мокапы](https://github.com/round-squares/tech-task-for-interview/wiki#%D0%BC%D0%BE%D0%BA%D0%B0%D0%BF%D1%8B)
- **Mockups:** See the link above for UI/UX requirements.

---

## 📦 Project Structure

- `src/` – NestJS backend (API, business logic, DB)

---

## 🔑 API Endpoints

### Auth

- `POST /auth/login`  
  Login with `{ "username": "...", "password": "..." }`.  
  Returns JWT token (set as cookie).

- `POST /auth/logout`  
  Logout (clears cookie).

---

### Rounds

- `POST /rounds`  
  **Admin only.** Create a new round.

- `GET /rounds`  
  Get all rounds.

- `GET /rounds/:id/details`  
  Get round details (including winner, user stats, etc).

---

### Goose

- `POST /goose/tap/:roundId`  
  Tap the goose for the current round (increments your points).

---

### Health

- `GET /health`  
  Health check endpoint.

---

## 🏁 How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start backend (NestJS)

```bash
npm run start:dev
```

### 4. Access the app

- Backend API: [http://localhost:3000/](http://localhost:3000/)

---

## 📝 Notes

- All endpoints require authentication (except `/auth/login` and `/health`).
- See the [original task](https://github.com/round-squares/tech-task-for-interview/wiki#%D0%BC%D0%BE%D0%BA%D0%B0%D0%BF%D1%8B) for more details.

---

<p align="center">
  <b>Good luck and have fun! 🦆</b>
</p>
