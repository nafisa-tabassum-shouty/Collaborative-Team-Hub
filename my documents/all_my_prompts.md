### Prompt 1
I am facing issues with Prisma (possibly version mismatch between Prisma v6 and v7) in my Node.js + Express backend.

Project setup:
- Node.js + Express
- Prisma ORM
- PostgreSQL database
- Monorepo (Turborepo)
- Prisma schema already defined and working structure exists

Problems:
- Prisma client not working correctly OR errors during migration / generate
- Possible version mismatch between prisma and @prisma/client
- Not sure if node_modules or cache is causing issues

Tasks:
1. Check and explain compatibility between Prisma v6 and v7
2. Tell me the correct versions I should use for:
   - prisma
   - @prisma/client
3. Provide exact commands to fix everything cleanly:
   - uninstall old versions
   - reinstall correct versions
   - regenerate prisma client
4. Fix common errors like:
   - "Prisma Client not generated"
   - "Cannot find module @prisma/client"
   - migration issues
5. Show correct folder structure and where schema.prisma should be
6. Provide final working setup steps

Important:
- Use JavaScript (not TypeScript)
- Keep it beginner-friendly
- Focus on fixing version issues cleanly

Goal:
I want a clean working Prisma setup without version conflicts so I can continue backend development.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 2
I am building a full-stack Collaborative Team Hub application as a technical assessment.

Tech stack (mandatory):
- Monorepo: Turborepo
- Frontend: Next.js 14 (App Router, JavaScript, no TypeScript), Tailwind CSS, Zustand
- Backend: Node.js + Express.js (REST API)
- Database: PostgreSQL with Prisma ORM
- Auth: JWT (access + refresh tokens in httpOnly cookies)
- Real-time: Socket.io
- File upload: Cloudinary
- Deployment: Railway (frontend and backend as separate services)

Current status:
- Monorepo is already set up using Turborepo
- apps/web (Next.js) is running correctly
- apps/api (Express) is set up with start script
- Project is ready for development

Now I want to start backend development with Prisma.

Tasks for you:
1. Create a complete Prisma schema for this project including:
   - User
   - Workspace
   - Membership (User ↔ Workspace with roles: Admin/Member)
   - Goal
   - Milestone
   - Announcement
   - ActionItem
2. Define proper relationships between models
3. Include necessary fields (title, description, status, due dates, etc.)
4. Add enums where necessary (roles, status, priority)
5. Keep it simple but scalable (suitable for interview project)

Then:
6. Show how to run Prisma migrations
7. Show how to connect Prisma with Express.js
8. Generate basic CRUD API structure for:
   - Auth (register/login)
   - Workspace
   - Goals

Important:
- Use JavaScript (not TypeScript)
- Keep code clean and beginner-friendly
- Follow best practices

Goal:
I want a working backend foundation so I can continue building features step by step.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 3
I have already set up my backend with:
- Express.js
- Prisma (schema completed with User, Workspace, Goal, etc.)
- PostgreSQL
- Basic route structure (auth, workspace, goal)

Now I want to implement full authentication system.

Tasks:
1. Implement user registration:
   - Hash password using bcrypt
   - Store user in database (Prisma)

2. Implement login:
   - Validate email and password
   - Generate JWT access token and refresh token

3. Token system:
   - Access token (short expiry)
   - Refresh token (long expiry)
   - Store tokens in httpOnly cookies

4. Middleware:
   - Create auth middleware to protect routes
   - Extract user from JWT

5. Logout:
   - Clear cookies properly

6. Token refresh endpoint:
   - Generate new access token using refresh token

Important:
- Use JavaScript (no TypeScript)
- Use best practices (secure cookies, error handling)
- Keep code simple and clean
- Use Express + Prisma properly

Goal:
I want a complete working authentication system (register, login, protected routes, logout, refresh token).

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 4
I have completed:
- Express backend setup
- Prisma ORM with full schema (User, Workspace, Goal, ActionItem, etc.)
- JWT authentication with httpOnly cookies
- Login, register, refresh token, logout
- Protected route middleware (requireAuth)
- PostgreSQL connected and working

Now I want to implement the WORKSPACE SYSTEM.

Please help me build it step by step.

Tasks:

1. Workspace CRUD APIs:
   - Create workspace (name, description, accentColor)
   - Get all workspaces for logged-in user
   - Get single workspace by ID
   - Update workspace
   - Delete workspace (only admin)

2. Workspace Membership system:
   - When workspace is created, creator becomes ADMIN automatically
   - Add member by email (invite system)
   - Assign roles: ADMIN / MEMBER
   - Prevent duplicate membership

3. Access control:
   - Only workspace members can access workspace data
   - Only ADMIN can update/delete workspace or invite members

4. API structure:
   - /api/workspaces (GET, POST)
   - /api/workspaces/:id (GET, PUT, DELETE)
   - /api/workspaces/:id/invite (POST)

5. Use Prisma relations properly (Workspace, WorkspaceMember, User)

6. Add proper error handling and validation

Important:
- Use JavaScript (no TypeScript)
- Keep code clean and production-ready
- Use best practices for REST API design

Goal:
I want a fully working workspace system that supports multi-workspace collaboration with roles and access control.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 5
I have successfully implemented a complete Workspace system using Express + Prisma.

Features already done:
- Workspace CRUD
- Role-based access control (ADMIN / MEMBER)
- Member invite system
- Prisma PostgreSQL integration
- JWT authentication middleware

Now I want to implement the GOALS & MILESTONES system.

Please help me build:

1. Goals API:
   - Create goal (title, description, dueDate, status, owner, workspaceId)
   - Get all goals in a workspace
   - Get single goal with details
   - Update goal status
   - Delete goal (only ADMIN or owner)

2. Milestones API:
   - Create milestone under a goal
   - Update milestone progress (0–100%)
   - Delete milestone

3. Business rules:
   - Only workspace members can access goals
   - Only owner or admin can modify goals
   - Milestones belong to a goal

4. Prisma relations usage:
   - Goal ↔ Milestone
   - Goal ↔ Workspace
   - Goal ↔ User

5. Clean REST API structure:
   - /api/workspaces/:workspaceId/goals
   - /api/goals/:goalId
   - /api/goals/:goalId/milestones

6. Add proper validation + error handling

Important:
- JavaScript only (no TypeScript)
- Production-ready clean code
- Follow best practices used in real SaaS applications

Goal:
I want a fully functional goal tracking system with milestones and progress tracking.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 6
I have successfully implemented:
- Authentication system (JWT + cookies)
- Workspace system (roles, members, invites)
- Goals & Milestones system (CRUD + relations)
- Prisma PostgreSQL integration
- Express backend with modular routes

Now I want to implement the ACTION ITEMS system (Kanban-style task management).

Please help me build a complete backend system for it.

Requirements:

1. Action Item APIs:
   - Create action item (title, priority, dueDate, status, assigneeId, goalId)
   - Get all action items under a workspace
   - Get all action items under a specific goal
   - Update action item (status, priority, assignee, due date)
   - Delete action item (only owner or admin)

2. Kanban logic:
   - Status should support: TODO, IN_PROGRESS, DONE
   - Enable filtering by status
   - Enable grouping by status (for frontend Kanban board)

3. Business rules:
   - Only workspace members can access action items
   - Only admin or creator/assignee can modify action items
   - Action items must always belong to a goal

4. Prisma relations usage:
   - ActionItem ↔ Goal
   - ActionItem ↔ User (assignee)
   - ActionItem ↔ Workspace (via Goal)

5. API structure:
   - /api/workspaces/:workspaceId/action-items
   - /api/goals/:goalId/action-items
   - /api/action-items/:id

6. Add proper validation and error handling
7. Keep code modular and production-ready

Important:
- Use JavaScript only (no TypeScript)
- Follow REST best practices
- Keep security consistent with existing system

I want a fully functional Kanban-style task management system integrated with Goals and Workspaces.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 7
I have successfully implemented a full backend system for:
- Authentication (JWT + httpOnly cookies)
- Workspace system (roles, invites, access control)
- Goals & Milestones (progress tracking system)
- Action Items (Kanban-style task management)
- Prisma + PostgreSQL schema fully integrated
- Express.js modular backend architecture

Now I want to implement the ANNOUNCEMENTS (Workspace Newsfeed) system.

This is a critical feature for collaboration and team communication.

Please help me design and implement a production-ready backend system.

---

## 1. Announcement APIs
- Create announcement (admin only)
  - content (rich text support)
  - isPinned (boolean)
- Get all announcements for a workspace (sorted: pinned first)
- Get single announcement
- Update announcement (admin only)
- Delete announcement (admin only)

---

## 2. Reactions System
- Add emoji reaction to an announcement
- Remove reaction
- Ensure:
  - One user can react with multiple emojis
  - But same emoji cannot be duplicated (already in schema constraint)

---

## 3. Comments System
- Add comment to announcement
- Edit comment (owner only)
- Delete comment (owner or admin)

---

## 4. Business Rules (VERY IMPORTANT)
- Only workspace members can access announcements
- Only ADMIN can create/update/delete announcements
- Members can:
  - view
  - react
  - comment
- Pinning announcements should prioritize them in feed

---

## 5. Prisma Relations
- Announcement ↔ Workspace
- Announcement ↔ User (author)
- Announcement ↔ Comments
- Announcement ↔ Reactions

---

## 6. API Structure
- /api/workspaces/:workspaceId/announcements
- /api/announcements/:id
- /api/announcements/:id/reactions
- /api/announcements/:id/comments

---

## 7. Advanced Requirements (for interview bonus)
- Sort pinned announcements on top
- Include author info in responses
- Return reaction summary (count per emoji)
- Optimize queries (avoid N+1 problem using Prisma include/select properly)

---

## 8. Code Quality Requirements
- Use JavaScript only (no TypeScript)
- Clean REST API design
- Strong error handling
- Proper authorization checks
- Production-ready structure

---

I want a real-world team collaboration feed system like Slack/Notion announcements with reactions, comments, and admin controls.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 8
I have successfully completed the full backend system for my Collaborative Team Hub:

- Authentication (JWT + httpOnly cookies)
- Workspace system (roles, invites, permissions)
- Goals & Milestones (progress tracking)
- Action Items (Kanban system)
- Announcements (newsfeed with reactions & comments)
- Prisma + PostgreSQL fully integrated
- Express.js modular API structure

Now I want to implement REAL-TIME FEATURES using Socket.io.

---

## 1. Real-time requirements

### A. Live Updates
- When a new announcement is created → instantly update all workspace members
- When a reaction is added → update reaction count in real time
- When a comment is added → update feed instantly
- When an action item status changes → reflect immediately in Kanban board

---

### B. Online Users
- Track which users are currently online in each workspace
- Show “active users list”
- Update in real time when users join/leave

---

### C. @Mention Notifications
- Detect @username mentions in comments or announcements
- Send real-time in-app notification to mentioned users

---

## 2. Socket Architecture

Please design:
- Socket server setup inside Express backend
- Authentication using JWT in socket handshake
- Workspace-based rooms (join workspace room)
- Event structure (emit/on design)

Example events:
- workspace:join
- announcement:new
- reaction:update
- comment:new
- actionItem:update
- user:online
- user:offline
- notification:new

---

## 3. Backend integration rules
- Use Prisma for user verification
- Only workspace members can join socket rooms
- Secure socket connection using auth middleware
- Avoid memory leaks and duplicate connections

---

## 4. Optimization requirements
- Use room-based broadcasting (not global emit)
- Prevent unnecessary re-renders
- Keep payload minimal (send only required data)

---

## 5. Bonus (interview level)
- Show typing indicator (optional)
- Show live presence (who is viewing workspace)
- Debounce frequent updates (reaction spam, etc.)

---

Goal:
I want a production-grade real-time collaboration system like Slack/Notion where everything updates instantly across users.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 9
I have successfully completed the full backend system for my Collaborative Team Hub:

- Authentication system (JWT + httpOnly cookies)
- Workspace system (roles, invites, permissions)
- Goals & Milestones module
- Action Items (Kanban system)
- Announcements (feed with reactions + comments)
- Socket.io real-time architecture (live updates, notifications, online users)
- Prisma + PostgreSQL fully integrated
- Express.js production-ready backend

Now I want to build the FRONTEND using Next.js 14 (App Router) with Zustand.

---

## 1. Frontend Tech Requirements
- Next.js 14+ (App Router, JavaScript only)
- Tailwind CSS for styling
- Zustand for state management
- Socket.io client integration
- Axios or fetch for API calls

---

## 2. Application Pages Structure

Please design the full frontend architecture:

### Auth Pages
- /login
- /register
- Protected route handling

### Main App
- /dashboard (overview stats)
- /workspaces (list + switch workspace)
- /workspaces/[id] (main workspace dashboard)

---

## 3. Workspace Dashboard UI Modules

Inside a workspace page:

### A. Sidebar
- Workspace switcher
- Navigation:
  - Goals
  - Action Items (Kanban)
  - Announcements
  - Members

### B. Goals Module UI
- List of goals
- Progress indicators
- Milestone display
- Goal detail modal/page

### C. Kanban Board (Action Items)
- Columns: TODO / IN_PROGRESS / DONE
- Drag & drop support (optional)
- Real-time updates via Socket.io

### D. Announcements Feed
- Pinned posts on top
- Reactions (emoji UI)
- Comments section
- Real-time updates

### E. Members Panel
- Online users list (real-time)
- Roles (Admin / Member)

---

## 4. State Management (Zustand)
Create stores for:
- auth store (user, token state)
- workspace store (active workspace, list)
- goals store
- actionItems store
- socket store (connection + events)

---

## 5. API Integration Layer
- Central API service file
- Handle credentials (cookies based auth)
- Error handling system
- Loading states

---

## 6. Socket.io Frontend Integration
- Connect socket after login
- Join workspace room automatically
- Listen for events:
  - announcement:new
  - reaction:update
  - actionItem:update
  - comment:new
  - user:online/offline
  - notification:new

---

## 7. UX Requirements (IMPORTANT)
- Responsive UI (mobile + desktop)
- Loading skeletons
- Optimistic UI updates (bonus)
- Clean modern SaaS design

---

Goal:
I want a fully structured, production-ready Next.js frontend that integrates with my backend and behaves like a real collaborative SaaS platform (similar to Slack/Notion/Trello hybrid).

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 10
I have completed a full-stack Collaborative Team Hub project with:

- Backend (Express + Prisma + PostgreSQL)
- Authentication (JWT + httpOnly cookies)
- Workspace system (roles, invites)
- Goals & Milestones
- Action Items (Kanban with optimistic UI)
- Announcements (feed with reactions & comments)
- Real-time system (Socket.io: live updates, online users, notifications)
- Frontend (Next.js 14 App Router + Zustand + Tailwind CSS)

Now I want to FINALIZE the project for submission.

Please help me with:

---

## 1. Testing Checklist (IMPORTANT)
Give me a complete manual testing checklist:
- Auth flow (register, login, refresh, logout)
- Workspace creation, switching, invite
- Goals + milestones CRUD
- Action items (kanban flow)
- Announcements + reactions + comments
- Real-time updates (multi-tab testing)
- Edge cases (unauthorized access, invalid inputs)

---

## 2. Bug Fix Checklist
Common production issues to verify:
- Cookie issues (CORS, credentials)
- Socket reconnection issues
- Race conditions in optimistic UI
- API error handling consistency
- Prisma query optimization

---

## 3. Performance Improvements
- Reduce unnecessary API calls
- Optimize Zustand state updates
- Minimize re-renders
- Use proper loading states

---

## 4. UI/UX Improvements (INTERVIEW BOOST)
- Add loading skeletons
- Empty states (no goals, no tasks)
- Error messages
- Success toasts
- Responsive design fixes

---

## 5. README.md (VERY IMPORTANT)
Generate a professional README including:
- Project overview
- Tech stack
- Features list
- Setup instructions (local + Railway)
- Environment variables
- API overview
- Advanced features implemented
- Known limitations

---

## 6. Video Walkthrough Script (3–5 min)
Give me a script to explain:
- Project overview
- Key features
- Real-time demo
- Architecture highlights

---

## 7. Final Submission Checklist
- GitHub repo ready (clean commits)
- Railway deployed (frontend + backend)
- Demo account created
- Env variables configured

---

Goal:
I want to submit a polished, production-ready project that stands out in a technical interview.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 11
Implement a production-ready Dark/Light theme system in my Next.js 14 app.

Requirements:
- Detect system preference (prefers-color-scheme)
- Allow manual toggle (dark/light/system)
- Persist theme in localStorage
- Apply Tailwind CSS dark mode properly
- Sync theme across all pages instantly
- Ensure SSR-safe implementation in App Router
- Add a ThemeProvider wrapper in layout

Update only frontend (apps/web), no backend changes needed.

**Result:**
- Viewed layout.js:1-21
- Edited layout.js
- Viewed Sidebar.jsx:1-106
- Edited Sidebar.jsx
- Listed directory app
- Listed directory (app)
- Listed directory workspaces
- Listed directory [id]
- Viewed page.jsx:1-65
- Edited page.jsx
- Viewed AnnouncementsFeed.jsx:1-203
- Edited AnnouncementsFeed.jsx
- Viewed GoalsPanel.jsx:1-151
- Edited GoalsPanel.jsx
- Viewed KanbanBoard.jsx:1-117
- Edited KanbanBoard.jsx
- Viewed MembersPanel.jsx:1-127
- Edited MembersPanel.jsx
- Listed directory dashboard
- Viewed page.jsx:1-113
- Edited page.jsx
- Listed directory (auth)
- Viewed page.jsx:1-88
- Edited page.jsx
- Viewed page.jsx:1-98
- Edited page.jsx

Successfully implemented a **Production-Ready Dark/Light Theme System** in the Next.js 14 app.

### Key Accomplishments:
1.  **Tailwind Config Update:** Enabled `darkMode: 'class'` for manual theme control.
2.  **Global CSS Variables:** Implemented a robust CSS variable system in `globals.css` (`--bg-primary`, `--accent`, etc.) that adapts automatically to dark/light modes.
3.  **SSR-Safe ThemeProvider:** Created a custom `ThemeProvider` that:
    *   Detects system preference (OS theme).
    *   Persists user choice in `localStorage`.
    *   Is fully SSR-safe for Next.js App Router.
4.  **No-Flash Script:** Added an inline `ThemeScript` to prevent the common "white flash" on page load by applying the theme before hydration.
5.  **Premium ThemeToggle:** Built a stylish `ThemeToggle` component usable across the app.
6.  **Full UI Refresh:** Login, Register, Dashboard, and all workspace modules (Goals, Kanban, Announcements, Members) are now fully theme-aware.

### How to use:
*   **Manual Toggle:** Use the theme toggle button located at the bottom of the Sidebar or in the Dashboard header.
*   **System Preference:** By default, it follows your OS color scheme.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 12
Add email notification system to my Express + Prisma backend.

Requirements:
- Use Nodemailer (SMTP-based)
- Send email on:
  1. Workspace invitation
  2. @mention in comments or announcements
- Create reusable email service (utils/email.js)
- Add queue-safe async function (non-blocking)
- Store email templates (HTML + text)
- Add environment variables for SMTP config
- Ensure production-ready error handling

Do not break existing APIs.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 13
Implement keyboard shortcut system in Next.js frontend.

Requirements:
- Add global command palette (like Ctrl/⌘ + K)
- Use a modal UI for search/navigation
- Support shortcuts:
  - K → open command palette
  - G D → go to dashboard
  - G W → switch workspace
- Use Zustand for state management
- Must be accessible (keyboard navigation support)
- Integrate with existing Sidebar routes

No backend changes required.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 14
Add full testing setup for my monorepo project.

Backend:
- Jest + Supertest
- Test auth routes (register/login/me)
- Test workspace creation API

Frontend:
- React Testing Library
- Test login page + dashboard rendering

Requirements:
- Create test config files
- Add sample test cases
- Ensure Prisma uses test database setup
- Add npm scripts: test, test:watch

Keep structure scalable for CI/CD.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 15
Add Swagger/OpenAPI documentation to my Express backend.

Requirements:
- Use swagger-ui-express
- Create /api/docs endpoint
- Document all major routes:
  - auth
  - workspaces
  - goals
  - action items
- Add request/response schema definitions
- Group APIs properly by tags
- Must be auto-mounted in index.js

Keep it production-grade and clean.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

### Prompt 16
Convert my Next.js frontend into a Production-ready PWA.

Requirements:
- Add manifest.json (name, icons, theme color)
- Enable service worker caching
- Offline support for dashboard view
- Cache API responses for last workspace
- Add install prompt (Add to Home Screen)
- Use next-pwa or custom service worker
- Ensure no break in Socket.io realtime features

Must work on mobile + desktop.

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

## Final Project Implementation Summary

All 16 prompts have been successfully implemented following a professional, branch-based Git workflow. The project is now a production-ready **Collaborative Team Hub**.

### Core Achievements:
1. **Architecture:** Full-stack Monorepo using Turborepo, Next.js 14, Express, and Prisma.
2. **UI/UX:** Premium design with Dark/Light theme, semantic colors, and a global Command Palette (Cmd+K).
3. **Real-time:** Integrated Socket.io for instant updates across workspaces, goals, and comments.
4. **Notifications:** Async email notification system via Nodemailer with @mention support.
5. **Reliability:** Comprehensive testing suite with Jest & Supertest (Backend) and React Testing Library (Frontend).
6. **Mobility:** Production-grade PWA with offline caching and app installation manifest.
7. **Documentation:** Auto-generated Swagger/OpenAPI documentation for all backend endpoints.

### Branch & History Strategy:
- Each feature developed in dedicated `feat/` branches.
- Atomic commits for clarity and maintainability.
- Clean merge history into `main` using `--no-ff` strategy.

**Final Status:** ✅ 100% Completed
**Date:** May 1, 2026

---

### Prompt 17 (Expert Git Workflow Strategy)
I want to organize my GitHub commits in an expert way so that each commit is meaningful and linked to a specific task. I have a list of prompts that describe each change I made in detail. Please guide me to commit each change separately based on these prompts.

**Requirements:**
- Ensure that each commit has a concise, descriptive message (Conventional Commits style).
- Implement proper branch usage (`feat/`, `fix/`, `docs/`) for each feature/task.
- Use a clean merge strategy (`--no-ff`) to maintain a structured history.
- Align each commit with a corresponding task from the prompt list.
- Keep the repository organized and scalable.

**Status:** ✅ Implemented and applied to all previous 16 prompts.

---

# PHASE 2: Advanced Staff-Level Architect Features

I want to implement 5 advanced features in a structured, scalable, and interview-ready way.

## FEATURE 1: Real-time Collaborative Editing (Google Docs style)
- Live cursors, user presence, and real-time syncing using Socket.io rooms.
- Conflict resolution and efficient persistence to PostgreSQL.

## FEATURE 2: Optimistic UI System
- Instant UI feedback with global rollback handler using Zustand.
- Handling race conditions and API failures gracefully.

## FEATURE 3: Offline Support (PWA + Queue System)
- OfflineQueue for pending mutations (Create/Update/Delete).
- Automatic sync on reconnection with retry logic.

## FEATURE 4: Advanced RBAC (Role-Based Access Control Matrix)
- Granular permissions (create_goal, manage_settings, etc.).
- Backend middleware enforcement and frontend UI conditional rendering.

## FEATURE 5: Audit Log System (Immutable Activity Timeline)
- Immutable activity tracking for all workspace actions.
- Timeline UI with advanced filtering and CSV export.

**Status:** ✅ Completed
**Final Completion Date:** May 2, 2026

---

I am building a production-grade Collaborative Team Hub using a Next.js + Express + Prisma + Socket.io monorepo architecture.

Now I want to implement 5 advanced features in a structured, scalable, and interview-ready way.

Please act as a senior staff-level full-stack architect and provide:

1. System design overview
2. Backend + frontend architecture changes
3. Database considerations (Prisma updates if needed)
4. Socket.io real-time design (if applicable)
5. API endpoints design
6. State management changes (Zustand)
7. Step-by-step implementation plan
8. Folder/file structure updates
9. Potential edge cases & performance concerns

Then implement each feature one by one in a clean, production-ready manner.

---

# FEATURE 1: Real-time Collaborative Editing (Google Docs style)

Requirements:
- Multiple users can edit a Goal description simultaneously
- Show live cursors per user
- Show user presence in the editor
- Changes must sync in real time using Socket.io
- Conflict resolution strategy (prefer last-write-wins or operational update model)
- Optimize for low latency updates
- Ensure backend does NOT get overloaded (debounce or batching updates)

Design expectations:
- Use Socket rooms per goalId
- Emit events like:
  - goal:join
  - goal:update
  - goal:cursor-move
- Store minimal state in memory
- Persist final updates to PostgreSQL efficiently (not every keystroke)

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

# FEATURE 2: Optimistic UI System

Requirements:
- All create/update/delete actions should reflect instantly in UI
- Rollback UI changes if API fails
- Implement globally reusable optimistic handler
- Must work for:
  - Goals
  - Action Items (Kanban board)
  - Announcements reactions/comments

Design expectations:
- Zustand middleware or utility hook (useOptimisticUpdate)
- Track:
  - previous state
  - pending state
  - error rollback handler
- Handle race conditions

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

# FEATURE 3: Offline Support (PWA + Queue System)

Requirements:
- App should work offline (at least read-only mode)
- Store API responses in localStorage or IndexedDB
- Queue user actions when offline
- Sync queued actions when reconnecting

Design expectations:
- Create offlineQueue system
- Detect network status (navigator.onLine + event listeners)
- Store pending mutations:
  - CREATE_GOAL
  - UPDATE_ACTION_ITEM
  - POST_COMMENT
- Sync strategy on reconnect with retry logic
- Handle conflict resolution when server state differs

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

# FEATURE 4: Advanced RBAC (Role-Based Access Control Matrix)

Requirements:
- Implement granular permission system beyond ADMIN/MEMBER

Define permissions:
- create_goal
- update_goal
- delete_goal
- post_announcement
- invite_member
- manage_workspace_settings

Design expectations:
- Extend Prisma schema OR create permission mapping layer
- Role → Permission mapping system
- Middleware: requirePermission(action)
- Frontend UI should hide disabled actions
- API must enforce strict backend authorization (not just UI)

Bonus:
- Allow future custom roles expansion

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

# FEATURE 5: Audit Log System (Immutable Activity Timeline)

Requirements:
- Track ALL important actions inside workspace
- Immutable logs (cannot be edited or deleted)
- Must include:
  - who did action
  - what action
  - entity type (goal, workspace, action item, announcement)
  - timestamp
  - metadata (JSON details)

Design expectations:
- Prisma AuditLog model enhancement if needed
- Auto-log middleware or service wrapper
- Capture:
  - CREATE / UPDATE / DELETE actions
- Build API:
  - GET /audit-logs?workspaceId=
- Frontend:
  - Timeline UI
  - Filter by user, action type, date
  - Export CSV feature

**Commit Instruction:** Follow the Expert Git Workflow (Prompt 17) to commit these changes separately in a dedicated feature branch with a concise, descriptive message.

---

# FINAL OUTPUT REQUIREMENTS

For each feature:
- Provide architecture first
- Then implementation steps
- Then code structure
- Then example code snippets
- Then testing approach
- Then potential edge cases

Ensure:
- Production-ready quality
- Clean code separation
- Scalable monorepo structure
- Interview-level explanation quality

Do NOT skip design explanation before coding.
