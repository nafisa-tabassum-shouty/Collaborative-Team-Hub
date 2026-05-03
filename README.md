# 🚀 Collaborative Team Hub

A production-ready, full-stack team collaboration platform built as a technical assessment. It combines the best features of **Slack**, **Notion**, and **Trello** into a single real-time workspace with advanced enterprise-grade features.

**🚀 [Live Demo](https://web-production-c04a9.up.railway.app)**  
**📡 [API Server](https://api-production-ade5.up.railway.app)**

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Express](https://img.shields.io/badge/Express-4-green?logo=express) ![Prisma](https://img.shields.io/badge/Prisma-5.22-blue?logo=prisma) ![Socket.io](https://img.shields.io/badge/Socket.io-4-white?logo=socket.io) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)

---

## 📌 Project Overview

**Collaborative Team Hub** is a multi-workspace SaaS platform designed for high-performance teams.
- **Real-time Collaboration:** Live document editing and instant updates across the board.
- **Goal Management:** Track high-level goals and granular milestones with visual progress.
- **Kanban Task Tracking:** Agile task management with a smooth, responsive interface.
- **Enterprise Security:** Granular Role-Based Access Control (RBAC) and Audit Logging.
- **Offline Resilience:** PWA support with background synchronization.

---

## 🎬 Video Walkthrough
[![Collaborative Team Hub Walkthrough](https://img.youtube.com/vi/PeVMXAiNDiA/0.jpg)](https://youtu.be/PeVMXAiNDiA)

*Click the image above to watch the full project walkthrough on YouTube.*

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| **Monorepo** | Turborepo |
| **Frontend** | Next.js 14+ (App Router, JavaScript) |
| **Styling** | Tailwind CSS (Dark/Light mode) |
| **State** | Zustand (Global + Persisted) |
| **Backend** | Node.js + Express.js (REST API) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT (Access + Refresh tokens in httpOnly cookies) |
| **Real-time** | Socket.io |
| **File Storage** | Cloudinary (Avatars & Attachments) |
| **Deployment** | Railway |

---

## 🌟 Advanced Features (Implemented: 5/5)

I have implemented **all five** advanced challenges to demonstrate full-stack architectural depth:

### 1. ✍️ Real-time Collaborative Editing
Multiple users can edit a Goal description simultaneously. Includes:
- **Live Cursors:** See exactly where teammates are typing.
- **User Presence:** Visual indicators of active collaborators in the editor.
- **Conflict Resolution:** Last-write-wins model with low-latency sync.

### 2. ⚡ Optimistic UI System
Actions reflect instantly in the UI before server confirmation.
- **Snappy UX:** Zero-latency feel for goal creation, task movement, and reactions.
- **Rollback Logic:** Automatic UI reversion with toast notifications if an API request fails.

### 3. 📡 Offline Support (PWA + Sync Queue)
Full Progressive Web App capabilities with offline-first logic.
- **Action Queuing:** Create goals or update tasks while offline; actions are queued in local storage.
- **Background Sync:** Automatic synchronization with the server once connectivity is restored.

### 4. 🛡️ Advanced RBAC (Permission Matrix)
Granular control beyond simple Admin/Member roles.
- **Permission Matrix:** Defined capabilities for `create_goal`, `invite_member`, `manage_settings`, etc.
- **Strict Enforcement:** Validated both via frontend conditional rendering and backend middleware.

### 5. 📜 Immutable Audit Log
A complete, tamper-proof history of all workspace changes.
- **Activity Timeline:** Filterable UI showing Who, What, and When.
- **CSV Export:** Download the entire audit trail for compliance and reporting.

---

## 🎁 Bonus Features (Extra Credit)

- 🌓 **Dark / Light Theme:** Automatic system preference detection with manual toggle.
- 📧 **Email Notifications:** Automated invitation emails via Nodemailer.
- ⌨️ **Command Palette:** `Ctrl+K` (or `Cmd+K`) for global navigation and quick actions.
- 📖 **OpenAPI / Swagger:** Full API documentation served at `/api/docs`.
- 📱 **PWA:** Fully installable on mobile and desktop with offline shell support.

---

## ⚠️ Known Limitations
- **Offline Sync:** In extremely rare cases of complex concurrent edits while offline, the "Last-Write-Wins" model may overwrite intermediate changes.
- **Email Rate Limits:** Currently uses Gmail SMTP, which may be subject to daily sending limits.
- **Storage:** Large file attachments are subject to Cloudinary's free tier bandwidth and storage constraints.
- **Concurrency:** Optimized for small to medium-sized teams (up to 50 simultaneous users per workspace).

---

## ⚙️ Local Setup Instructions

Follow these steps to run the Collaborative Team Hub on your local machine.

### 1. Clone & Install Dependencies
First, clone the repository and install all required packages from the root directory.
```bash
git clone https://github.com/nafisa-tabassum-shouty/Collaborative-Team-Hub.git
cd Collaborative-Team-Hub
npm install
```

### 2. Environment Variables Reference
You need to create two separate `.env` files. One for the backend API and one for the frontend Web application.

**Backend (`apps/api/.env`):**
Create a `.env` file inside the `apps/api` folder with the following variables:
```env
# Server Port
PORT=5001

# PostgreSQL connection string (You can use a local DB or Neon/Supabase)
DATABASE_URL="postgresql://user:pass@localhost:5432/team_hub"

# JWT Secrets for authentication (Use strong random strings)
JWT_ACCESS_SECRET="your_secure_access_secret"
JWT_REFRESH_SECRET="your_secure_refresh_secret"

# Cloudinary credentials for avatar & file uploads
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"

# Nodemailer credentials for sending invitations via Gmail
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password" # Use an App Password, not your real password

# The URL of your frontend application
CLIENT_URL="http://localhost:3000"
```

**Frontend (`apps/web/.env.local`):**
Create an `.env.local` file inside the `apps/web` folder:
```env
# The URL where your backend API is running
NEXT_PUBLIC_API_URL="http://localhost:5001/api"

# The URL for Socket.io real-time connections
NEXT_PUBLIC_SOCKET_URL="http://localhost:5001"
```

### 3. Database Setup (Prisma)
Initialize the database and run migrations to create all required tables.
```bash
# Navigate to the API workspace
cd apps/api

# Run Prisma migrations
npx prisma migrate dev --name init
```

### 4. Start the Application
Return to the root directory and start both the frontend and backend simultaneously using Turborepo.
```bash
# From the root directory (Collaborative-Team-Hub)
npm run dev
```
The frontend will be available at `http://localhost:3000` and the API will be listening on `http://localhost:5001`.

---

## 👤 Author
Developed for the **Collaborative Team Hub** Technical Assessment. Focused on scalability, clean code, and premium user experience.
