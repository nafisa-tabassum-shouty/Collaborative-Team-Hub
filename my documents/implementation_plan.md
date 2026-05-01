# Collaborative Team Hub - Implementation Plan

This document outlines the step-by-step plan for building the Collaborative Team Hub full-stack application, ensuring all requirements from the Technical Assessment are met. We will use a parallel development approach where possible.

## Phase 1: Foundation & Monorepo Setup
**Goal:** Initialize the project structure and shared configurations.
1. **Turborepo Initialization:** Create a new Turborepo workspace.
2. **Apps Setup:**
   - `apps/web`: Next.js 14+ (App Router, JavaScript, Tailwind CSS).
   - `apps/api`: Node.js + Express.js.
3. **Database Setup:** 
   - Initialize PostgreSQL.
   - Set up Prisma ORM in the backend.
   - Create the initial database schema (Users, Workspaces, Goals, Milestones, Announcements, ActionItems, AuditLogs).
4. **Shared Packages (Optional):** Setup shared ESLint and Prettier configs.

## Phase 2: Backend Development (API Core & Real-time)
*Note: This phase can run in parallel with early Frontend UI development.*
1. **Authentication:** Implement JWT-based auth (access & refresh tokens via httpOnly cookies). Endpoints for register, login, logout, refresh.
2. **RESTful Endpoints:**
   - **Users:** Profile management, Cloudinary avatar upload.
   - **Workspaces:** CRUD operations, invites, role management (Admin/Member).
   - **Goals & Milestones:** CRUD operations, progress tracking.
   - **Announcements:** Rich-text posts, reactions, comments, pinning.
   - **Action Items:** Kanban/List operations, assignment, priority.
3. **Real-time (Socket.io):** Setup Socket.io server to emit events on updates (new posts, status changes, online presence).
4. **Advanced Feature 1 - Audit Log:** Implement an interceptor/middleware to log workspace changes to an `AuditLog` table.
5. **Bonus - Swagger Docs:** Integrate `swagger-ui-express` for API documentation at `/api/docs`.

## Phase 3: Frontend Development (Web App UI & Logic)
1. **State Management & Routing:** 
   - Setup Zustand for global state (User, Active Workspace, Socket connection).
   - Create protected route wrappers.
2. **Authentication UI:** Login and Registration pages.
3. **Dashboard & Workspaces:**
   - Workspace switcher, creation modal, and invite system.
   - Dashboard analytics with Recharts (Goals chart, item stats).
4. **Goals & Action Items:**
   - Goal creation forms, nested milestones.
   - Action Items with Kanban board (drag-and-drop or simple column move) and List view toggle.
5. **Announcements Feed:**
   - Rich-text editor for announcements.
   - Reaction and comment components.
6. **Advanced Feature 2 - Optimistic UI:** Use Zustand and React state to immediately reflect user actions (like completing a milestone or adding a reaction) before API confirmation, reverting on error.
7. **Bonus - Theming:** Implement system preference detection for Dark/Light mode.

## Phase 4: Integration & Real-time Polish
1. **Socket.io Client:** Connect Next.js app to backend socket, listen for live updates, and update Zustand/local state dynamically.
2. **Online Status:** Track and display online workspace members.
3. **Notifications:** Implement in-app toasts for @mentions and live updates.

## Phase 5: Deployment & Final Review
1. **Railway Provisioning:**
   - Setup PostgreSQL plugin.
   - Create 2 services (`api` and `web`).
2. **Environment Configuration:** Inject required variables (DATABASE_URL, JWT secrets, Cloudinary credentials, URLs).
3. **Deployment Pipeline:** Ensure Turborepo builds run correctly on Railway.
4. **Testing:** Seed demo data, record walkthrough video, and finalize README.

---
### Selected Advanced Features:
1. **Optimistic UI:** Provides a snappy, highly responsive feel on the frontend.
2. **Audit Log:** Essential for "team hubs" to track changes; robust backend feature.

### Parallel Execution Strategy (Agentic Workflow)
Once Phase 1 (Foundation) is complete, we can spawn separate browser/command agents to handle:
- Agent A: Backend API endpoints and Prisma Schema.
- Agent B: Frontend UI components and Tailwind styling. 
We will coordinate their progress via this central plan.

---

## Phase 6: Advanced Collaborative Editing (Phase 2 Add-on)

# Feature 1: Real-time Collaborative Editing Implementation Plan

### Backend Changes (apps/api)
1. **Socket Service Enhancement:**
   - Create `services/presenceService.js` to manage active users in goals.
   - Update `socket.js` to handle `goal:join`, `goal:update`, and `goal:cursor-move`.
   - Implement broadcasting logic to exclude the sender.

2. **Route Update:**
   - Ensure Goal update API is optimized for batch updates.

### Frontend Changes (apps/web)
1. **Zustand Store:**
   - Add `activeCollaborators` and `isTyping` states.
   - Implement actions to update remote cursors.

2. **Components:**
   - Build `CollaborativeEditor.jsx` using a controlled textarea or rich-text library (like TipTap/Quill in simple mode).
   - Show avatars of active users at the top of the editor.
   - Render "Remote Cursors" over the text area.

3. **Logic:**
   - Use `useSocket` to emit `goal:cursor-move` on mouse/selection change.
   - Emit `goal:update` on change.
   - Implement `useDebounce` to call `api.put('/goals/:id')` after typing stops.

### Testing Strategy
- Open two browser tabs and verify:
  - Cursors move in sync.
  - Text updates reflect instantly.
  - User list updates when a tab is closed.

---

# Phase 2: Advanced Staff-Level Features Walkthrough Summary

The **Collaborative Team Hub** is now equipped with five industry-standard advanced features. Below is a summary of the implementation and how to use them.

### 🚀 1. Real-time Collaborative Editing
**Technical Detail:** Uses Socket.io rooms (`goal_${id}`) and an in-memory `presenceService` on the backend.
- **How to use:** Open two different browser sessions for the same Goal. You will see avatars of active users and instant text synchronization as you type.
- **Key Logic:** Debounced persistence (2s) ensures database writes are efficient.

### ⚡ 2. Optimistic UI System
**Technical Detail:** Integrated into Zustand stores (`goalStore`, `actionItemStore`).
- **How to use:** Update a goal status or drag a task in the Kanban board. The UI updates instantly before the server confirms.
- **Resilience:** If the API fails, the system automatically rolls back to the previous state and shows an error toast.

### 📡 3. Offline Support (PWA + Queue System)
**Technical Detail:** Uses `localStorage` persistence and a custom `offlineStore` with an action queue.
- **How to use:** Disable your internet (Airplane mode) and try to create a Goal.
- **Sync Logic:** The app will show a "You are offline" notification. Once you reconnect, it will automatically sync all pending actions and show a success toast.

### 🛡️ 4. Advanced RBAC
**Technical Detail:** Granular permission matrix mapped to `ADMIN` and `MEMBER` roles.
- **How to use:** Login as a `MEMBER`. You will notice you cannot delete the workspace or invite new members (backend middleware and frontend `usePermission` hook enforcement).
- **Security:** Every sensitive API endpoint is protected by `requirePermission(PERMISSIONS.ACTION)`.

### 📜 5. Audit Log System
**Technical Detail:** Asynchronous, non-blocking logging service with an immutable database trail.
- **How to use:** Navigate to the "Workspace Activity" section (or `GET /api/workspaces/:id/audit-logs`).
- **Features:** A visual timeline of all actions (Who, What, When) and a **CSV Export** button for reporting.

---
**Final Status:** All 5 Advanced Features Implemented and Merged.

