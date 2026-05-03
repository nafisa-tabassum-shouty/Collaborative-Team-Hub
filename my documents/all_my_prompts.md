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

### Results:
- **Presence Service:** Created `apps/api/services/presenceService.js` to manage in-memory user sessions and cursors.
- **Socket Integration:** Updated `apps/api/socket.js` to handle real-time collaboration events (`goal:join`, `goal:update`, `goal:cursor-move`).
- **Collaborative Editor:** Built `apps/web/src/components/workspace/CollaborativeEditor.jsx` with debounced auto-save (2s) and presence visualization.
- **State Management:** Extended `apps/web/src/store/goalStore.js` to track active collaborators and remote cursor positions.


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

### Results:
- **Global Optimistic Logic:** Implemented in `apps/web/src/store/goalStore.js` and `apps/web/src/store/actionItemStore.js`.
- **Rollback Mechanism:** Developed an error-handling layer that restores the previous state using `getState()` if an API request fails.
- **UX Improvement:** User actions (like updating a goal or moving a task) are reflected in the UI instantly, providing a snappy experience.


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

### Results:
- **Offline Store:** Created `apps/web/src/store/offlineStore.js` using Zustand's `persist` middleware to manage a durable action queue.
- **Sync Engine:** Implemented a background processor in `apps/web/src/components/OfflineSync.jsx` that automatically retries queued actions upon reconnection.
- **Network Awareness:** Updated `apps/web/src/app/layout.js` with network event listeners and toast notifications for connectivity changes.


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

### Results:
- **Permission Matrix:** Defined a granular RBAC matrix in `apps/api/utils/permissions.js`.
- **RBAC Middleware:** Created `apps/api/middleware/rbac.middleware.js` to enforce server-side authorization checks for administrative actions.
- **Protected Routes:** Applied `requirePermission` to workspace invitation and deletion routes in `apps/api/routes/workspace.routes.js`.
- **Frontend Authorization:** Built the `apps/web/src/hooks/usePermission.js` hook for conditional UI rendering based on the user's role.


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

### Results:
- **Audit Service:** Developed `apps/api/services/auditService.js` for asynchronous, non-blocking activity logging.
- **Automated Logging:** Integrated logging triggers into `apps/api/routes/goal.routes.js` and `apps/api/routes/action-item.routes.js`.
- **Timeline UI:** Built `apps/web/src/components/workspace/AuditLogTimeline.jsx` to display a filterable history of all workspace changes.
- **CSV Export:** Implemented client-side CSV generation in `apps/web/src/store/auditStore.js` for reporting and documentation.


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

---

### Prompt 18 (Automated Atomic Git Commit Strategy)
I need a precise and automated guide for organizing my Git commits according to best practices. I have recently added several advanced features to my project, and each feature may contain sub-features. I want every single sub-feature to be committed separately, with a clear, descriptive commit message that accurately reflects what was implemented. 

**Requirements:**
- Commit each sub-feature separately following the Expert Git Workflow (Prompt 17).
- Use meaningful, descriptive commit messages (Conventional Commits).
- Ensure each commit is atomic and ties directly to a specific sub-feature or prompt.
- Provide a step-by-step automated guide to commit only relevant files and sections without manual intervention.
- Maintain a clean, organized, and descriptive commit history.

**Goal:**
Fully automate the commit process for complex features, ensuring each change is tracked as an independent, atomic unit according to best Git practices.

### Results:
- **Expert Workflow Applied:** Successfully organized connection resilience fixes into atomic, conventional commits on a dedicated `fix/connection-resilience` branch.
- **Automation Script:** Developed `scripts/atomic-commit.sh` to automatically group changed files by service (e.g., `apps/api`, `apps/web`) and facilitate atomic commits in a monorepo structure.
- **Branch Strategy:** Enforced `feat/`, `fix/`, and `chore/` naming conventions to maintain a professional and searchable Git history.

---

### Prompt 19 (AUTHENTICATION)
Build a complete production-grade authentication system for a full-stack app.

Backend (Express + Prisma):
- Implement register, login, logout, refresh token endpoints
- Hash passwords using bcrypt
- Use JWT (access token 15m, refresh token 7d)
- Store tokens in httpOnly cookies
- Implement middleware `requireAuth` to protect routes
- Add `/api/auth/me` to return current user
- Handle errors properly (invalid credentials, duplicate email)

Frontend (Next.js + Zustand):
- Create login & register pages
- Store auth state using Zustand
- Call `/me` on app load to persist session
- Redirect unauthenticated users to login
- Add logout functionality

Bonus:
- Handle token refresh automatically using Axios interceptor
- Show loading & error UI

---

### Prompt 20 (WORKSPACES)
Build a complete workspace management system.

Backend:
- Create Workspace CRUD APIs
- Auto-add creator as ADMIN in WorkspaceMember table
- Invite users by email with role (ADMIN / MEMBER)
- Prevent duplicate membership
- Add access control:
  - Only ADMIN can update/delete workspace
  - Members can only view

Frontend:
- Dashboard page listing all workspaces
- Create workspace form (name, description, accent color)
- Workspace switcher UI (sidebar)
- Invite member modal

Bonus:
- Show member count and role badges
- Color-based UI theme per workspace

---

### Prompt 21 (GOALS & MILESTONES)
Build goals and milestones system with nested relationships.

Backend:
- CRUD APIs for Goals
- Each goal has: title, owner, dueDate, status
- Milestones nested under goals
- Milestone progress (0–100)
- Only goal owner or ADMIN can update/delete

Frontend:
- Goals panel with list view
- Create goal modal
- Show milestones inside each goal
- Progress bar UI for milestones

Bonus:
- Activity feed for goal updates
- Status filter (TODO, IN_PROGRESS, DONE)

---

### Prompt 22 (ANNOUNCEMENTS - NEWSFEED)
Build a real-time announcements system like Slack.

Backend:
- Create announcements (ADMIN only)
- Pin/unpin announcements
- Add reactions (emoji-based)
- Add comments system
- Prevent duplicate reactions

Frontend:
- Newsfeed UI with pinned posts on top
- Emoji reaction picker
- Comment section per post

Bonus:
- Show reaction counts grouped by emoji
- Show if current user reacted

---

### Prompt 23 (ACTION ITEMS - KANBAN)
Build a Kanban task management system.

Backend:
- CRUD for ActionItems
- Fields: title, assignee, priority, dueDate, status
- Link action item to goal
- Permission rules:
  - Assignee, goal owner, or ADMIN can update
  - Only owner/admin can delete

Frontend:
- Kanban board with 3 columns:
  - TODO
  - IN_PROGRESS
  - DONE
- Drag & drop or quick move buttons
- List view toggle

Bonus:
- Color-coded priority (LOW, MEDIUM, HIGH)

---

### Prompt 24 (REAL-TIME SYSTEM - Socket.io)
Implement real-time updates using Socket.io.

Backend:
- Authenticate socket connection using JWT
- Join users to workspace-specific rooms
- Broadcast events:
  - new announcement
  - reaction updates
  - action item updates
- Track online users

Frontend:
- Connect socket after login
- Join workspace room
- Update Zustand store on events

Bonus:
- Show online users in Members panel
- Show typing indicator or live updates

---

### Prompt 25 (ANALYTICS)
Build dashboard analytics system.

Backend:
- API to return:
  - total goals
  - completed this week
  - overdue goals
- CSV export endpoint

Frontend:
- Dashboard stats cards
- Goal completion chart (Recharts)
- Export button (download CSV)

Bonus:
- Weekly trends graph

---

### Prompt 26 (SUPER BONUS - INTERVIEW KILLER PROMPT)
Ensure the entire system is:
- Production-ready
- Scalable and modular
- Follows clean architecture
- Uses proper error handling
- Includes loading states and UX polish
- Uses optimistic UI where needed
- Fully integrated frontend + backend + socket

Also:
- Automatically create clean Git commits for each feature
- Use conventional commit format (feat, fix, chore, refactor)
- Maintain separation of concerns

## Prompt 19: Implement Real-time Online/Offline Status Updates using Sockets

I need your help to implement real-time online/offline status updates in a workspace environment using sockets. Right now, the logic is not working even though the socket code was updated. I need a clear, step-by-step guide on how to ensure the following:

When a user logs in and clicks on a workspace, they should be immediately shown as "online" in that workspace.
The total number of online members in that workspace should also update in real-time.
An online indicator (like a green dot, similar to Facebook) should appear next to the user’s name when they’re online.

Please explain the socket logic in detail, step by step:

How should the server detect a user joining a workspace (what event triggers it)?
How should the server broadcast this user’s status to all other clients in that workspace?
How do we ensure the client listens for these updates and changes the UI (e.g., the green dot, the online count)?
What happens when a user logs out or leaves the workspace (how to handle them becoming "offline")?

I need the exact flow: both frontend logic (how we listen and update the UI) and backend logic (how the server tracks and broadcasts the status). Make sure that the code examples and logic are fully aligned so that no real-time updates get missed, and everything stays in sync.

Once you provide this full, clear logic, I will update my socket implementation accordingly. Thank you.


## Prompt 20: Full Debug and Fix for Online Status

I am giving you a REAL UI state from my application. You must FIX the issue completely.

========================
📸 CURRENT UI PROBLEM
========================

From the screenshot:

1. Sidebar shows: "0 online"
2. All members are showing "Offline"
3. Green status indicator is NOT active
4. Real-time updates are NOT happening

Expected behavior:
- When a user enters the workspace → they should instantly appear ONLINE
- Sidebar online count should update immediately
- Green dot should appear on avatar
- Other users should see updates in real-time

========================
🚨 IMPORTANT
========================
DO NOT assume anything is working.
Treat EVERYTHING as broken and re-check all logic.

========================
🧠 TASK: FULL DEBUG + FIX
========================

Step 1: CHECK SOCKET CONNECTION
- Verify socket is actually connecting
- Add console logs:
  - "Socket connected", socket.id
  - user.id
- If not connecting → FIX FIRST

------------------------

Step 2: VERIFY JOIN EVENT

Ensure this flow:

Frontend:
- Register listeners FIRST
- THEN emit:
  socket.emit("workspace:join", { workspaceId })

Backend:
- Receive "workspace:join"
- socket.join(room)
- Store user in memory (Map)

Add logs:
- "User joined workspace"
- workspaceId
- current users count

------------------------

Step 3: FIX EVENT FLOW (CRITICAL)

Backend MUST emit:

1. To others:
   socket.to(room).emit("user:online", user)

2. To self:
   socket.emit("workspace:active_users", usersList)

------------------------

Step 4: FIX FRONTEND LISTENERS

Ensure these exist and are working:

socket.on("workspace:active_users", ...)
socket.on("user:online", ...)
socket.on("user:offline", ...)

Add console logs for each event

------------------------

Step 5: FIX STATE (VERY IMPORTANT)

Problems might be:
- state not updating
- duplicate users
- wrong userId

Fix:
- Use Set or Map
- Always compare with user.id

------------------------

Step 6: FIX UI (MATCH SCREENSHOT)

From my UI:

✔ Sidebar:
- Must show real-time online count
- Fix: onlineUsers.length

✔ Member List:
- Show "Online" or "Offline"
- Add green dot if online

✔ Green Dot Logic:
isOnline = onlineUsers.some(u => u.id === member.userId)

------------------------

Step 7: HANDLE DISCONNECT

Backend:
- On "disconnect"
- Remove user from workspace map
- Emit: "user:offline"

------------------------

Step 8: DEBUG CHECKLIST (YOU MUST VERIFY)

[ ] When user enters workspace → join event fires
[ ] Online users list is received
[ ] Sidebar count updates
[ ] Green dot appears
[ ] Other users receive updates
[ ] On disconnect → user becomes offline
[ ] No stale users remain

------------------------

Step 9: OUTPUT FORMAT

You MUST provide:

1. FULL fixed backend socket code
2. FULL frontend socket logic
3. State management fix
4. EXACT reason why UI shows "0 online"
5. EXACT bug explanation
6. FINAL working flow

------------------------

❌ DO NOT:
- Give partial code
- Skip debugging
- Assume anything works
- Give theory only

========================
✅ GOAL
========================

Make it behave like:
- Facebook Messenger online system
- Instant updates
- No refresh

---

### Prompt 27 (Kanban View Toggle - Board & List)
I want to add a view toggle INSIDE my existing Kanban Board page (NOT a separate page).

========================
🎯 GOAL
========================

Inside the Kanban Board page, users should be able to switch between:

1. Kanban Board View (default)
2. List View

Both views should use the SAME data.

========================
📍 UI PLACEMENT
========================

- Add the toggle in the TOP RIGHT of the Kanban Board page header
- Use icons:
  - Kanban icon (grid layout)
  - List icon (list layout)

- Highlight the active view

========================
🧠 FUNCTIONAL LOGIC
========================

1. Create a state:
   const [viewMode, setViewMode] = useState("kanban");

2. Default:
   - Kanban view

3. Toggle behavior:
   - Click Kanban icon → setViewMode("kanban")
   - Click List icon → setViewMode("list")

4. Conditional rendering:
   {
     viewMode === "kanban"
       ? <KanbanBoard />
       : <ListView />
   }

========================
📦 DATA HANDLING
========================

- Use SAME tasks/goals data for both views
- Do NOT fetch data again
- Do NOT duplicate logic

========================
📋 LIST VIEW REQUIREMENTS
========================

Render tasks in a clean table/list:

Each row should show:
- Task Title
- Status (Todo / In Progress / Done)
- Assignee
- Due Date

Optional:
- Status color badge

========================
📊 KANBAN VIEW (KEEP EXISTING)
========================

- Keep current Kanban implementation
- Do NOT break drag & drop
- Do NOT change existing logic

========================
💾 PERSISTENCE
========================

- Save selected view in localStorage:
  localStorage.setItem("viewMode", value)

- On page load:
  restore from localStorage

========================
🎨 UI/UX DETAILS
========================

- Active icon:
  - highlighted background
  - different color

- Smooth switching (no reload)

========================
📁 OUTPUT REQUIRED
========================

1. Updated Kanban page code (with toggle)
2. Toggle component code
3. ListView component
4. localStorage logic

========================
❌ DO NOT
========================

- Do NOT create a new page
- Do NOT break existing Kanban drag & drop
- Do NOT refetch data

========================
✅ FINAL RESULT
========================

User stays on SAME page and can switch views instantly,
like:
- Jira board ↔ list
- ClickUp board ↔ list

---

### Prompt 28 (COMPLETE ACTION ITEMS SYSTEM - Jira/ClickUp Style)
I want to IMPLEMENT a complete "Action Items" system in my application.

This feature is currently NOT built, so you must design and implement EVERYTHING from scratch.

========================
🎯 CORE FEATURES
========================

1. Create Action Items with:
   - Title
   - Description (optional)
   - Assignee (user)
   - Priority (Low / Medium / High)
   - Due Date
   - Status (Todo / In Progress / Done)

2. Link each Action Item to a parent GOAL

3. Show Action Items in:
   - Kanban Board View
   - List View (toggle inside same page)

========================
🧱 DATABASE DESIGN (MANDATORY)
========================

Create a new model:

ActionItem:
- id (string / uuid)
- title (string)
- description (text, optional)
- status (enum: todo | in_progress | done)
- priority (enum: low | medium | high)
- dueDate (datetime)
- goalId (foreign key)
- assigneeId (foreign key → User)
- workspaceId (foreign key)
- createdAt
- updatedAt

Relationships:
- ActionItem → belongs to Goal
- ActionItem → belongs to User (assignee)
- ActionItem → belongs to Workspace

========================
🔌 BACKEND (Node + Express + Prisma)
========================

Create APIs:

1. Create Action Item
POST /action-items

2. Get all Action Items (by workspace / goal)
GET /action-items?workspaceId=...

3. Update Action Item
PATCH /action-items/:id

4. Delete Action Item
DELETE /action-items/:id

5. Update status (for drag & drop)
PATCH /action-items/:id/status

Validation:
- Required fields: title, status, goalId, workspaceId
- Assignee must exist in workspace

========================
🎯 BUSINESS LOGIC
========================

- Only workspace members can create/update
- Action items must belong to a goal
- Status change should update instantly (for Kanban)

========================
🎨 FRONTEND (React)
========================

========================
1. CREATE PAGE
========================

Create a page:
"Action Items" (inside workspace)

========================
2. CREATE FORM (MODAL)
========================

Form fields:
- Title (input)
- Description (textarea)
- Assignee (dropdown users)
- Priority (select)
- Due Date (date picker)
- Status (default: Todo)
- Goal (dropdown)

Submit → call API

========================
3. VIEW TOGGLE (IMPORTANT)
========================

Add toggle INSIDE page header (top-right):

- Kanban icon (grid)
- List icon (list)

State:
viewMode = "kanban" | "list"

Persist in localStorage

========================
4. KANBAN VIEW
========================

Columns:
- Todo
- In Progress
- Done

Each column shows Action Items

Card UI:
- Title
- Assignee avatar
- Priority badge
- Due date

Drag & Drop:
- Move card between columns
- On drop → update status API

========================
5. LIST VIEW
========================

Table/List layout:

Columns:
- Title
- Goal
- Assignee
- Priority
- Due Date
- Status

Features:
- Status badge color
- Sort by due date (optional)

========================
⚡ REAL-TIME (OPTIONAL BUT PREFERRED)
========================

Use socket:

Events:
- action_item:created
- action_item:updated
- action_item:deleted

Update UI instantly

========================
🎨 UI/UX DETAILS
========================

- Priority colors:
  - High → red
  - Medium → yellow
  - Low → green

- Status colors:
  - Todo → gray
  - In Progress → blue
  - Done → green

- Clean modern UI (like Jira / ClickUp)

========================
📁 OUTPUT REQUIRED
========================

You MUST provide:

1. Prisma schema
2. Backend routes + controllers
3. API validation logic
4. React components:
   - ActionItemForm
   - KanbanBoard
   - ListView
   - Toggle component
5. State management (Zustand or React state)
6. Drag & Drop logic
7. localStorage persistence

========================
❌ DO NOT
========================

- Do NOT skip database design
- Do NOT give partial code
- Do NOT ignore relationships
- Do NOT break workspace logic

========================
✅ FINAL GOAL
========================

A fully working system like:
- Jira Tasks
- ClickUp Action Items

User can:
- Create tasks
- Assign people
- Track progress
- Switch between Kanban and List view
- Manage everything inside one page

### Prompt 29 (Collaborative Editing for Goal Description)
I want to implement REAL-TIME collaborative editing for a goal description, similar to Google Docs.

Multiple users should be able to edit the SAME goal description at the SAME time and see each other's cursor positions and changes live.

========================
🎯 CORE REQUIREMENTS
========================

1. Multiple users can open the same goal
2. All users can:
   - Edit text simultaneously
   - See updates instantly (no refresh)
   - See each other’s LIVE cursor position

3. Each user should have:
   - Unique cursor color
   - Name label near cursor (like Google Docs)

========================
🧠 SYSTEM DESIGN
========================

Use:
- Socket.io for real-time communication
- Rich text editor (Quill / TipTap / Slate)

Each goal will act as a "room":
room name → goal_${goalId}

========================
🔌 BACKEND LOGIC
========================

1. When user opens goal:
   socket.emit("goal:join", { goalId })

2. Server:
   - socket.join(goal_${goalId})
   - Track active users in that goal

3. Text Editing:
   socket.on("goal:update", { goalId, content })

   - Broadcast to others:
     socket.to(room).emit("goal:content_update", { content, userId })

4. Cursor Tracking:
   socket.on("goal:cursor_move", { goalId, cursor })

   - Broadcast:
     socket.to(room).emit("goal:cursor_update", {
       userId,
       cursorPosition
     })

5. On disconnect:
   - Remove user
   - Notify others

========================
📡 FRONTEND LOGIC
========================

1. Join room when page loads

2. Listen events:

- goal:content_update
  → update editor content

- goal:cursor_update
  → render other users' cursors

- goal:user_list (optional)
  → show active collaborators

3. Emit events:

- On text change:
  socket.emit("goal:update", content)

- On cursor move:
  socket.emit("goal:cursor_move", cursorPosition)

========================
✍️ EDITOR BEHAVIOR
========================

- Use controlled editor state
- Avoid overwriting while typing
- Apply changes smoothly (diff-based update preferred)

========================
🧭 CURSOR SYSTEM
========================

Each user:
- Has unique color
- Cursor position tracked (index / range)

Render:
- Colored caret
- Small label with username

========================
⚡ PERFORMANCE
========================

- Debounce text updates (e.g., 100–300ms)
- Throttle cursor updates

========================
🔐 EDGE CASES
========================

- Two users typing same place → handle merge (last-write or OT/CRDT optional)
- User disconnect → remove cursor
- Late join → load latest content

========================
📁 OUTPUT REQUIRED
========================

1. Backend socket code
2. Frontend editor integration
3. Cursor rendering logic
4. Event flow diagram
5. Conflict handling strategy

========================
❌ DO NOT
========================

- Do NOT use page refresh
- Do NOT overwrite entire content blindly
- Do NOT ignore cursor sync

========================
✅ FINAL GOAL
========================

A real-time collaborative editor like:
- Google Docs
- Notion live editing

Where:
- Users type together
- See live cursors
- See instant updates

## promt 30 (OPTIMISTIC UI updates for application)

I want to implement OPTIMISTIC UI updates for my application.

User actions should reflect instantly in the UI BEFORE server confirmation, and if the server fails, the UI should ROLLBACK gracefully.

========================
🎯 GOAL
========================

1. When user performs an action (create/update/delete):
   - UI updates IMMEDIATELY
   - No waiting for API response

2. If API succeeds:
   - Keep the change

3. If API fails:
   - Revert UI to previous state
   - Show error message (toast)

========================
🧠 USE CASES
========================

Apply this to:

- Create Action Item
- Update Action Item (status, title, etc.)
- Delete Action Item
- Drag & Drop in Kanban

========================
⚙️ FRONTEND LOGIC
========================

For EACH action:

1. Save previous state:
   const prevState = getState()

2. Update UI immediately:
   updateStateOptimistically()

3. Call API:
   try {
     await apiCall()
   } catch (error) {
     rollback(prevState)
   }

========================
📦 EXAMPLES
========================

CREATE:

- Add item to UI instantly with temporary ID
- Replace with real ID after API success
- Remove if API fails

UPDATE:

- Change status instantly
- If API fails → revert to old status

DELETE:

- Remove from UI instantly
- If API fails → restore item

========================
🔄 KANBAN DRAG & DROP
========================

1. User drags card → update column instantly
2. Call API to update status
3. If fails → move card BACK to original column

========================
🧠 STATE MANAGEMENT
========================

- Use Zustand / Redux
- Store previous state snapshot for rollback

Optional:
- Use Immer for easy state cloning

========================
⚡ UX DETAILS
========================

- Show loading indicator (optional)
- Disable duplicate actions while pending
- Show toast on error:
  "Failed to update. Changes reverted."

========================
🔐 EDGE CASES
========================

- Multiple rapid updates → queue or debounce
- Duplicate requests → prevent
- Network failure → rollback safely

========================
📁 OUTPUT REQUIRED
========================

1. Example for:
   - Create
   - Update
   - Delete
   - Drag & Drop

2. State management implementation
3. Rollback logic
4. Error handling UI

========================
❌ DO NOT
========================

- Do NOT wait for API before updating UI
- Do NOT lose previous state
- Do NOT leave UI in inconsistent state

========================
✅ FINAL GOAL
========================

App should feel:
- Instant
- Smooth
- Responsive

Like:
- Notion
- Jira
- ClickUp
## prompt 31 (authentication issue)
My application is stuck in an infinite "Verifying session..." loading state.

The spinner keeps running and the app does NOT load properly.

========================
🚨 PROBLEM
========================

- "Verifying session" keeps spinning forever
- User is NOT redirected
- App does NOT render main content

========================
🎯 GOAL
========================

Fix the authentication flow so that:

1. Session is checked ONLY ONCE on app load
2. Loading state stops correctly
3. User is either:
   - Logged in → show app
   - Not logged in → redirect to login

========================
🧠 DEBUG TASK (MANDATORY)
========================

Step 1: Find infinite loop

Check:
- useEffect dependencies in AuthProvider
- Is useEffect running multiple times?

Fix:
useEffect(() => {
  checkSession();
}, []); // MUST be empty

------------------------

Step 2: Fix loading state

Ensure:

try {
  await checkSession()
} catch(e) {
  setUser(null)
} finally {
  setLoading(false) // MUST ALWAYS RUN
}

------------------------

Step 3: Fix API retry loop

Check:
- Is API failing?
- Is code retrying automatically?

If yes:
→ STOP infinite retry

------------------------

Step 4: Fix token / cookie issue

Check:
- Is token sent properly?
- Is backend returning 401?

If 401:
→ logout user
→ stop loop

------------------------

Step 5: Add debug logs

console.log("Checking session...");
console.log("User:", user);
console.log("Loading:", loading);

------------------------

Step 6: Prevent multiple calls

Ensure:
- checkSession is NOT called in multiple components
- Only called ONCE in AuthProvider

------------------------

Step 7: Fix render condition

Correct logic:

if (loading) return <Spinner />

if (!user) return <Login />

return <App />

========================
📁 OUTPUT REQUIRED
========================

1. Fixed AuthProvider code
2. Fixed useEffect logic
3. Correct loading handling
4. Exact reason why spinner was infinite

========================
❌ DO NOT
========================

- Do NOT call checkSession multiple times
- Do NOT keep loading = true forever
- Do NOT retry infinitely

========================
✅ FINAL RESULT
========================

- Spinner shows briefly
- Then app loads correctly
- No infinite loop

## prompt 32 (login and signup)
I want to build a COMPLETE and SECURE authentication system (Login + Signup) using database validation and JWT.

Treat this as a PRODUCTION-LEVEL system. Do NOT give partial or basic solutions.

========================
🎯 CORE REQUIREMENTS
========================

1. LOGIN SYSTEM
- User will enter:
  - Email (or username)
  - Password

- Backend MUST:
  ✔ Check if user exists in database
  ✔ Compare hashed password (bcrypt)

------------------------

2. SUCCESS CASE
IF user exists AND password is correct:

- Generate JWT token
- Send token securely (HTTP-only cookie recommended)
- Return user data (id, name, email)

Frontend:
- Save auth state
- Redirect user to Dashboard

------------------------

3. ERROR CASE (VERY IMPORTANT)

IF user does NOT exist:

- Show message:
  "No account found with this information. Please sign up first."

- Automatically provide a button or redirect:
  → Go to Signup page

------------------------

IF password is WRONG:

- Show message:
  "Incorrect password. Please try again."

------------------------

4. SIGNUP SYSTEM

- Allow new user registration
- Fields:
  - Name
  - Email
  - Password

Backend:
- Hash password using bcrypt
- Save user in database

After signup:
- Optionally auto-login OR redirect to login

------------------------

5. JWT AUTHENTICATION

- Generate token:
  jwt.sign({ userId }, SECRET, { expiresIn: "7d" })

- Middleware:
  - Verify token on protected routes
  - Attach user to request

------------------------

6. PROTECTED ROUTES

- Only logged-in users can access:
  - Dashboard
  - Workspace
  - Goals

If NOT authenticated:
→ Redirect to Login page

------------------------

7. FRONTEND LOGIC 

- AuthProvider:
  - Check session ONCE on app load
  - Store user in global state

- Login flow:
  → Submit form → API call → success → redirect

- Error handling:
  → Show toast or alert message

------------------------

8. UX REQUIREMENTS

- Clear error messages
- Redirect to signup if user not found
- No page reload
- Smooth navigation

------------------------

9. SECURITY (MANDATORY)

- NEVER store plain password
- Use bcrypt
- Use HTTP-only cookies for JWT
- Handle token expiration
- Prevent multiple login requests

------------------------

10. OUTPUT REQUIRED

You MUST provide:

1. Backend:
   - Auth routes (login, signup)
   - JWT middleware
   - Password hashing

2. Frontend:
   - Login form
   - Signup form
   - AuthProvider logic
   - Redirect logic

3. Error handling system

4. Exact explanation of flow

------------------------

❌ DO NOT

- Do NOT skip validation
- Do NOT store plain passwords
- Do NOT give incomplete code
- Do NOT ignore error cases

------------------------

✅ FINAL GOAL

System should behave like:

- Facebook login
- Google login (basic level)

User experience:
- Correct login → Dashboard
- Wrong info → clear error
- No account → redirect to signup
use only this stack
Area Technology
Monorepo Turborepo
Frontend Next.js 14+ — App Router, JavaScript (no TypeScript)
Styling Tailwind CSS
State Zustand
Backend Node.js + Express.js (REST API)
Database PostgreSQL + Prisma ORM
Auth JWT — access + refresh tokens in httpOnly cookies
Real-time Socket.io
File storage Cloudinary (avatars & attachments)
Deployment Railway — frontend & backend as separate services
Version control Git with clear, conventional commit history

### Prompt 33 (notification system)
I am building a full-stack web application with the following tech stack:

Frontend:
- Next.js 14+ (App Router, JavaScript only)
- Tailwind CSS
- Zustand (state management)

Backend:
- Node.js + Express.js (REST API)
- PostgreSQL with Prisma ORM
- JWT authentication (access + refresh tokens stored in httpOnly cookies)

Other:
- Real-time communication using Socket.io
- Cloudinary for file storage
- Monorepo setup using Turborepo
- Deployment on Railway

---

CURRENT REQUIREMENT:

I want to implement a scalable, Facebook-like notification system with the following requirements:

1. Notification Types:
- Comment on post
- Reaction on post
- Mention in comments or posts
- Added to a group or workspace
- Assigned in a group/workspace
- Any user-related activity across all workspaces

2. Core Features:
- All notifications must be stored in the database (persistent, never deleted automatically)
- Notifications should remain even after being marked as "read"
- "Mark all as read" functionality
- "See all history" page showing all past notifications
- Unread notification count badge
- Notifications should be linked to related entities (post, comment, workspace, etc.)

3. Real-time Behavior:
- Instant notification delivery using Socket.io
- If user is online → push instantly
- If offline → store and show later

4. Backend Requirements:
- First, analyze if notification-related tables already exist
- If NOT, design a proper Prisma schema for notifications:
    - id
    - userId (receiver)
    - actorId (who triggered it)
    - type
    - message
    - entityId (post/comment/workspace reference)
    - isRead
    - createdAt

- Create APIs:
    - GET /notifications (with pagination)
    - PATCH /notifications/mark-all-read
    - PATCH /notifications/:id/read

- Middleware to trigger notifications on:
    - comment creation
    - reaction
    - mention detection (@username)
    - workspace/group events

5. Frontend Requirements:
- Notification dropdown UI (like Facebook)
- Fix issue where actor name shows as "undefined"
- Show:
    - actor name
    - action message
    - timestamp
- Zustand store to manage notification state
- "See all history" page that fetches all notifications from backend

6. Bug Fix:
Currently, notification shows:
"@ undefined mentioned you in a comment"

Fix this by properly populating actor (user) data from backend.

7. Performance Considerations:
- Pagination or infinite scroll for notifications
- Avoid unnecessary re-renders
- Efficient socket event handling

---

EXPECTED OUTPUT:

- Prisma schema for Notification
- Backend API structure
- Socket.io event design
- Frontend Zustand store structure
- UI component structure for notification dropdown and history page
- Fix for "undefined actor" bug

Make the solution clean, scalable, and production-ready.