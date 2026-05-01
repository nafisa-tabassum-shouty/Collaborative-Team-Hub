# 🚀 Collaborative Team Hub

A production-ready, full-stack team collaboration platform built as a technical assessment. It combines the best features of **Slack**, **Notion**, and **Trello** into a single real-time workspace.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Express](https://img.shields.io/badge/Express-4-green?logo=express) ![Prisma](https://img.shields.io/badge/Prisma-5.22-blue?logo=prisma) ![Socket.io](https://img.shields.io/badge/Socket.io-4-white?logo=socket.io) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)

---

## 📌 Project Overview

**Collaborative Team Hub** is a multi-workspace SaaS platform where teams can:
- Collaborate in real time via announcements, reactions, and comments
- Track goals and milestones with visual progress indicators
- Manage tasks on a Kanban board with live updates
- Control access through role-based permissions (Admin / Member)
- See who's online with live presence indicators

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| Prisma ORM v5.22 | Database access layer |
| PostgreSQL | Primary database |
| Socket.io | Real-time WebSocket events |
| JWT (jsonwebtoken) | Access + Refresh token auth |
| bcryptjs | Password hashing |
| cookie-parser | httpOnly cookie management |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| Tailwind CSS | Utility-first styling |
| Zustand | Global state management |
| Axios | API client with interceptors |
| Socket.io Client | Real-time event listener |

### Infrastructure
| Service | Purpose |
|---|---|
| Railway | Backend + Frontend deployment |
| PostgreSQL (Railway) | Managed database |

---

## ✨ Features

### 🔐 Authentication
- Email/password registration & login
- JWT access tokens (15 min) + refresh tokens (7 days)
- Tokens stored in `httpOnly` cookies (XSS-safe)
- Auto token refresh on 401 responses
- Session persistence across page reloads

### 🏢 Workspace System
- Create multiple workspaces with custom accent colors
- Email-based invite system
- Role-based access: **ADMIN** / **MEMBER**
- Admins can manage all workspace resources
- Auto-assign creator as ADMIN

### 🎯 Goals & Milestones
- Create goals with title, description, due date, status
- Track status: `TODO` → `IN_PROGRESS` → `DONE`
- Nested milestones with 0–100% progress tracking
- Owner and workspace filtering
- Goal detail with linked action items

### 📋 Kanban Board (Action Items)
- Three-column board: **To Do / In Progress / Done**
- Priority levels: HIGH / MEDIUM / LOW
- Assignee management with avatar display
- **Optimistic UI updates** — instant feedback before API response
- **Real-time sync** via Socket.io

### 📢 Announcements (Newsfeed)
- Rich text announcements (admin only)
- Pinned posts always float to top
- **Emoji reactions** with per-user tracking (no duplicates)
- Comment threads on each announcement
- Comment edit (owner only) / delete (owner or admin)
- **Live feed updates** via Socket.io

### 👥 Members & Presence
- View all workspace members with roles
- **Real-time online/offline indicators** (green dot)
- Invite new members by email
- Duplicate membership prevention

### ⚡ Real-Time (Socket.io)
| Event | Description |
|---|---|
| `workspace:join` | Join workspace room (auth verified) |
| `announcement:new` | New post appears instantly for all members |
| `reaction:update` | Emoji counts update live |
| `actionItem:update` | Kanban cards move across all clients |
| `user:online` / `user:offline` | Presence tracking |
| `notification:new` | @mention notifications |

---

## 📁 Project Structure

```
collaborative-team-hub/
├── apps/
│   ├── api/                    # Express backend
│   │   ├── routes/             # Auth, Workspace, Goal, Action Item, Announcement
│   │   ├── middleware/         # requireAuth JWT middleware
│   │   ├── lib/prisma.js       # Prisma singleton
│   │   ├── socket.js           # Socket.io server logic
│   │   └── index.js            # Express app entry point
│   │   └── prisma/
│   │       └── schema.prisma   # Full DB schema
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/     # UI components
│           ├── store/          # Zustand stores
│           ├── providers/      # Auth + Socket providers
│           └── lib/            # api.js + socket.js
├── turbo.json
└── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/collaborative-team-hub.git
cd collaborative-team-hub
```

### 2. Install dependencies
```bash
npm install          # Root monorepo
cd apps/api && npm install
cd ../web && npm install
```

### 3. Configure environment variables

**Backend** — create `apps/api/.env`:
```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/teamhub
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend** — create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 4. Set up the database
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the development servers
```bash
# Terminal 1 — Backend
cd apps/api && node index.js

# Terminal 2 — Frontend
cd apps/web && npm run dev
```

**Backend:** http://localhost:5001  
**Frontend:** http://localhost:3000

---

## 🚂 Railway Deployment

### Backend
1. Create a new Railway project
2. Add a PostgreSQL plugin
3. Deploy from GitHub (`apps/api`)
4. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway PostgreSQL plugin)
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend.railway.app`
5. Set start command: `node index.js`

### Frontend
1. Add a new service from GitHub (`apps/web`)
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
3. Build command: `npm run build`
4. Start command: `npm start`

---

## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + set cookies |
| POST | `/api/auth/logout` | Clear cookies |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspaces` | List user workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/:id` | Get workspace details |
| PUT | `/api/workspaces/:id` | Update workspace (Admin) |
| DELETE | `/api/workspaces/:id` | Delete workspace (Admin) |
| POST | `/api/workspaces/:id/invite` | Invite member by email |

### Goals, Action Items, Announcements
Full CRUD available under `/api/workspaces/:workspaceId/goals`, `/api/goals/:goalId/action-items`, `/api/workspaces/:workspaceId/announcements`, and more.

---

## 🔒 Environment Variables Reference

| Variable | Service | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Backend | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Backend | Secret for refresh tokens |
| `PORT` | Backend | Server port (default: 5001) |
| `NODE_ENV` | Backend | `development` or `production` |
| `CLIENT_URL` | Backend | Frontend URL for CORS |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |

---

## 🧪 Quick Test

Register a user, create a workspace, then open the same workspace in two browser tabs to see real-time updates in action.

---

## ⚠️ Known Limitations

- File/image uploads not yet integrated (Cloudinary planned)
- No email notifications (invite is in-app only)
- Drag-and-drop for Kanban is planned (currently quick-move buttons)
- No pagination on large data sets (planned for v2)

---

## 👤 Author

Built as a technical assessment for a collaborative SaaS platform role.
