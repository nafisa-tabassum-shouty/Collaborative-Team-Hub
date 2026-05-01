# 🧪 Collaborative Team Hub — Complete Testing & Finalization Guide

## ✅ Manual Testing Checklist

### 1. 🔐 Authentication Flow

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Register | POST `/api/auth/register` with name/email/password | 201 + user object returned | ☐ |
| Duplicate email | Register with same email twice | 400 "Email already exists" | ☐ |
| Login | POST `/api/auth/login` with correct credentials | 200 + cookies set in browser | ☐ |
| Wrong password | Login with incorrect password | 401 "Invalid credentials" | ☐ |
| Cookie check | After login, check DevTools → Application → Cookies | `accessToken` + `refreshToken` present | ☐ |
| Protected route | Call `/api/workspaces` without login | 401 Unauthorized | ☐ |
| Auto refresh | Wait 15 min (or manually expire accessToken), make API call | Token auto-refreshed, call succeeds | ☐ |
| Logout | POST `/api/auth/logout` | Cookies cleared, redirected to /login | ☐ |
| Session restore | Login → refresh page → still logged in | User session persists via /me endpoint | ☐ |

---

### 2. 🏢 Workspace System

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create workspace | POST `/api/workspaces` with name + description + accentColor | 201 + workspace created | ☐ |
| Creator is ADMIN | After create, check members | Creator has role ADMIN | ☐ |
| List workspaces | GET `/api/workspaces` | Only workspaces where user is a member | ☐ |
| Get single | GET `/api/workspaces/:id` | Full workspace with members array | ☐ |
| Update | PUT `/api/workspaces/:id` as ADMIN | 200 + updated | ☐ |
| Update as MEMBER | PUT `/api/workspaces/:id` as MEMBER | 403 Access denied | ☐ |
| Invite by email | POST `/api/workspaces/:id/invite` with valid email | User added as MEMBER | ☐ |
| Invite non-existent | Invite email that doesn't exist in system | 404 "User not found" | ☐ |
| Duplicate invite | Invite same user twice | 400 "Already a member" | ☐ |
| Delete workspace | DELETE `/api/workspaces/:id` as ADMIN | 200 + workspace deleted | ☐ |
| Delete as MEMBER | DELETE as MEMBER | 403 Access denied | ☐ |

---

### 3. 🎯 Goals & Milestones

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create goal | POST `/api/workspaces/:id/goals` | 201 + goal created with ownerId | ☐ |
| Missing title | Create goal without title | 400 validation error | ☐ |
| Get all goals | GET `/api/workspaces/:id/goals` | List sorted by createdAt desc | ☐ |
| Get single goal | GET `/api/goals/:goalId` | Full goal with milestones + actionItems | ☐ |
| Update status | PUT `/api/goals/:id` change status | Only owner/admin can update | ☐ |
| Delete as owner | DELETE `/api/goals/:id` as goal owner | 200 deleted | ☐ |
| Delete as other member | DELETE as non-owner MEMBER | 403 Access denied | ☐ |
| Create milestone | POST `/api/goals/:id/milestones` | 201 milestone created | ☐ |
| Update progress | PUT `/api/goals/:id/milestones/:mid` with progress 75 | Progress saved correctly | ☐ |
| Delete milestone | DELETE milestone | 200 removed | ☐ |

---

### 4. 📋 Action Items (Kanban)

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create task | POST `/api/goals/:id/action-items` | 201 with priority/status defaults | ☐ |
| Assign non-member | Assign to userId not in workspace | 400 "Assignee must be a member" | ☐ |
| Get by workspace | GET `/api/workspaces/:id/action-items` | All tasks in workspace | ☐ |
| Filter by status | GET `...?status=TODO` | Only TODO items returned | ☐ |
| Move to IN_PROGRESS | PUT `/api/action-items/:id` `{status: "IN_PROGRESS"}` | Status updated | ☐ |
| Move as non-assignee | Update as unrelated MEMBER | 403 | ☐ |
| Move as assignee | Update as the assigned user | 200 allowed | ☐ |
| Delete as admin | DELETE as workspace ADMIN | 200 deleted | ☐ |
| Delete as member | DELETE as non-owner MEMBER | 403 | ☐ |

---

### 5. 📢 Announcements + Reactions + Comments

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create as ADMIN | POST `/api/workspaces/:id/announcements` | 201 created | ☐ |
| Create as MEMBER | POST as MEMBER | 403 "Only admins can post" | ☐ |
| Pin announcement | Create with `isPinned: true` | Appears first in list | ☐ |
| Get sorted list | GET announcements | Pinned first, then newest | ☐ |
| Add reaction | POST `/api/announcements/:id/reactions` `{emoji: "👍"}` | Reaction saved | ☐ |
| Duplicate reaction | Add same emoji twice | 400 "Already reacted" | ☐ |
| Different emoji | Same user adds "❤️" | Allowed (different emoji) | ☐ |
| Remove reaction | DELETE `/api/announcements/:id/reactions` `{emoji: "👍"}` | Removed | ☐ |
| Reaction summary | GET announcements list | reactions object with count per emoji | ☐ |
| Add comment | POST `/api/announcements/:id/comments` | 201 comment created | ☐ |
| Edit own comment | PUT `/api/announcements/:id/comments/:cid` | 200 updated | ☐ |
| Edit others' comment | Edit comment as different user | 403 | ☐ |
| Delete as admin | DELETE comment as workspace ADMIN | 200 allowed | ☐ |

---

### 6. ⚡ Real-Time Testing (Multi-Tab)

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Online presence | Open workspace in Tab 1 + Tab 2 | Both see each other as online | ☐ |
| Offline detection | Close Tab 2 | Tab 1 shows user offline within seconds | ☐ |
| Live announcement | Post announcement in Tab 1 | Tab 2 sees it instantly without refresh | ☐ |
| Live reaction | Add reaction in Tab 1 | Tab 2 reaction count updates live | ☐ |
| Kanban live update | Move card in Tab 1 | Tab 2 kanban board updates immediately | ☐ |
| Socket auth | Try connecting socket without valid cookie | Connection rejected | ☐ |
| Workspace room isolation | Create 2 workspaces; update in WS1 | WS2 does NOT receive WS1 events | ☐ |

---

### 7. 🚨 Edge Cases

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Access other workspace | Get workspace you're not a member of | 403 Access denied | ☐ |
| Invalid token | Call API with expired/invalid JWT | 401 Unauthorized | ☐ |
| Empty body | POST requests with empty body | 400 validation errors | ☐ |
| Non-existent resource | GET `/api/goals/nonexistent-id` | 404 Not found | ☐ |
| SQL injection attempt | Try malicious email input | Prisma parameterized queries block it | ☐ |

---

## 🐛 Bug Fix Checklist

### Cookie / CORS Issues
- [ ] Ensure `withCredentials: true` set in Axios
- [ ] Backend CORS has `credentials: true` and exact `CLIENT_URL` (no trailing slash)
- [ ] Cookies have `sameSite: 'none'` in production, `'lax'` in development
- [ ] Cookies have `secure: true` in production only

### Socket Issues
- [ ] Socket middleware verifies JWT from `cookie` header
- [ ] `socket.activeWorkspaces` cleanup runs on disconnect
- [ ] No duplicate event listeners (cleanup in `useEffect` return)
- [ ] `socket.connected` checked before emitting `workspace:join`

### Performance
- [ ] `fetchWorkspaces()` called only once in dashboard (not on every render)
- [ ] Zustand selectors prevent unnecessary re-renders (use `useStore(s => s.specificField)`)
- [ ] Announcement feed doesn't refetch on every reaction (uses local state update via `liveUpdateReaction`)

---

## 🎬 Video Walkthrough Script (3–5 min)

```
[0:00 - 0:30] INTRO
"Hi, I'm [Name]. Today I'll demo the Collaborative Team Hub — a full-stack 
real-time team collaboration platform I built as a technical assessment. 
It combines features of Slack, Notion, and Trello."

[0:30 - 1:00] TECH STACK
"The tech stack is: Next.js 14 with App Router on the frontend, 
Express.js with Prisma ORM on the backend, PostgreSQL for the database,
Socket.io for real-time features, and JWT with httpOnly cookies for 
secure authentication."

[1:00 - 1:45] AUTH DEMO
"Let me start by registering a new user... [register]
Now I'll log in... [login] — notice the httpOnly cookies being set in the 
browser. These are XSS-safe. The system auto-refreshes tokens using 
a Axios interceptor when they expire."

[1:45 - 2:30] WORKSPACE DEMO
"I'll create a new workspace with a custom color... [create workspace]
I'll invite my teammate by email... [invite] 
They're now a MEMBER. As an ADMIN, I have full control."

[2:30 - 3:15] REAL-TIME DEMO (KEY MOMENT - Open two browser tabs)
"Now the exciting part — real-time collaboration.
I'll open the same workspace in two tabs to simulate two users.
Watch what happens when I post an announcement in Tab 1... [post]
— it appears instantly in Tab 2 without any refresh.
Now I'll add a reaction... [react] — see the count update live.
And when I move a Kanban card here... [move card] — 
the other tab updates immediately. This is Socket.io with workspace-based rooms."

[3:15 - 3:45] ARCHITECTURE HIGHLIGHT
"Key design decisions:
1. JWT in httpOnly cookies — more secure than localStorage
2. Socket rooms per workspace — no cross-workspace data leaks  
3. Optimistic UI on the Kanban board — instant feedback, rollback on error
4. Zustand stores for clean state — each feature has its own store"

[3:45 - 4:00] CLOSE
"The project is deployed on Railway with a managed PostgreSQL database.
The code is clean, modular, and production-ready. Thank you!"
```

---

## 📦 Final Submission Checklist

### GitHub
- [ ] Clean commit history (feature-based commits)
- [ ] `.env` files in `.gitignore`
- [ ] `README.md` at root level
- [ ] No `node_modules` committed

### Environment
- [ ] `apps/api/.env` variables configured
- [ ] `apps/web/.env.local` pointing to correct API URL
- [ ] Production env has `NODE_ENV=production`

### Database
- [ ] Prisma migrations run (`npx prisma migrate deploy`)
- [ ] Schema matches codebase

### Demo
- [ ] Create a demo admin account
- [ ] Create a sample workspace with test data
- [ ] Test the full user flow end-to-end one final time

---

> **Pro tip for interview:** Focus the demo on the real-time Socket.io features — open two browser windows side by side. That visual impact is what makes the project stand out.
