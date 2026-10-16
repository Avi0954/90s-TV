# 📺 CartoonHub (90s TV)

> Reliving classic cartoons, broadcast channels, and childhood nostalgia from the 90s and 2000s era. Built with a retro CRT/VHS visual identity.

[![ESLint](https://img.shields.io/badge/ESLint-Clean%20(0%20errors)-brightgreen)](file:///d:/90s%20Kid/eslint.config.js)
[![Tests](https://img.shields.io/badge/Tests-20%2F20%20Passing-brightgreen)](file:///d:/90s%20Kid/backend/tests)
[![Vulnerabilities](https://img.shields.io/badge/Frontend%20Vulnerabilities-0-brightgreen)](file:///d:/90s%20Kid/package.json)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-9.0-red)](https://mongoosejs.com/)

---

## 📑 Full Project Audit & Architecture Report

For the complete technical audit, security verification, video streaming architecture, and future YouTube IFrame Player API roadmap, see:
👉 **[PROJECT_AUDIT_REPORT.md](file:///d:/90s%20Kid/PROJECT_AUDIT_REPORT.md)**

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB instance

### 2. Environment Setup

#### Frontend (`.env` in root):
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret_key
ADMIN_BOOTSTRAP_SECRET=your_admin_bootstrap_secret_key
FRONTEND_URL=http://localhost:5173
```

### 3. Installation & Database Seeding

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Sync / Seed database channels & cartoons (upsert mode, preserves user data)
npm run seed
```

### 4. Running the Development Servers

```bash
# Terminal 1: Run Backend API (from /backend)
cd backend
npm run dev

# Terminal 2: Run Frontend (from project root)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing & Code Quality

```bash
# Run backend automated test suite (20 native node:test suites)
npm test --prefix backend

# Lint entire codebase (0 errors)
npm run lint

# Build production bundle
npm run build
```

---

## 🛡️ Admin Setup

Create the initial administrator using the offline bootstrap CLI tool:

```bash
node backend/bootstrap-admin.js <admin_username> <admin_password>
```

Once registered, log in at `http://localhost:5173/admin` to manage shows, channels, and hero banners.

---

## 📺 Video Streaming Architecture

- **Streaming Pipeline**: Video data is delivered directly via YouTube embeds using normalized video IDs. Your server does not store or transcode video files.
- **Progress Tracking**: Resume Playback stores timestamps safely in client storage with automatic prompt banners (`Resume at MM:SS` or `Start from Beginning`).
- **Future YouTube API Roadmap**: Prepared hook blueprint (`useYouTubePlayer`) for millisecond-accurate seeking, pause tracking, and automatic `onStateChange: ENDED` episode sequencing.

See **[PROJECT_AUDIT_REPORT.md](file:///d:/90s%20Kid/PROJECT_AUDIT_REPORT.md)** for full implementation details.
