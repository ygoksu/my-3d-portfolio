# 🌐 Yusuf Göksu - 3D Portfolio

Welcome to the source code of my interactive 3D portfolio! This project is a modern, high-performance web application built with a **React & Three.js** frontend and a **Go (Fiber)** backend.

## 🚀 Tech Stack

### Frontend (`apps/frontend`)
*   **React 19** & **Vite** for lightning-fast UI rendering.
*   **Three.js** & **React Three Fiber (R3F)** for the interactive 3D particle field and the Data Node model.
*   **Tailwind CSS** for responsive, modern glassmorphism styling.
*   **Framer Motion** for smooth scroll animations.

### Backend (`apps/backend`)
*   **Golang (Go 1.21)** for extreme performance and minimal memory footprint.
*   **Fiber v2** for ultra-fast HTTP routing and middleware handling.
*   **Clean Architecture** principles (Controller -> Usecase -> Repository).

## 🛠️ How to Run Locally

### 1. Start the Backend (Go)
```bash
cd apps/backend
go run ./cmd/main.go
# The server will start on http://localhost:3000
```

### 2. Start the Frontend (React)
```bash
cd apps/frontend
npm install
npm run dev
# The client will start on http://localhost:5173
```

## 🐳 Running with Docker
You can spin up the entire application (Frontend + Backend) synchronously using Docker Compose:
```bash
docker-compose up --build
```

## 🌍 Live Deployment
*   **Frontend:** Hosted on [Vercel](https://vercel.com/) (Automatically linked from the `apps/frontend` directory).
*   **Backend:** Hosted on [Fly.io](https://fly.io/) globally distributed edge servers.

## 📄 License
This project is for personal portfolio usage. All rights reserved.
