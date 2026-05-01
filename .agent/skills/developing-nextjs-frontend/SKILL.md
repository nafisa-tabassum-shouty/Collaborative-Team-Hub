---
name: developing-nextjs-frontend
description: Develops Next.js 14 App Router UI with Tailwind CSS and Zustand. Use when working on the Collaborative Team Hub web frontend.
---

# Next.js Frontend Development Guide

This skill governs the development of the frontend (`apps/web`) for the Collaborative Team Hub.

## Tech Stack
- Framework: Next.js 14+ (App Router, JavaScript, NO TypeScript).
- Styling: Tailwind CSS.
- State Management: Zustand.
- Real-time: Socket.io Client.
- Charts: Recharts.

## Core Principles
1. **Zustand for State**: Use Zustand for global state (User auth session, active workspace, socket connection, optimistic updates).
2. **Optimistic UI**: For actions like adding a reaction, commenting, or moving a kanban item, update the local Zustand/React state immediately. Roll back state gracefully if the API call fails.
3. **No TypeScript**: Write pure `.js` and `.jsx` files. Do not use `.ts` or `.tsx`.
4. **Tailwind CSS**: Use utility classes for all styling. Maintain a clean, modern UI.

## Key Features to Implement
- **Authentication**: Email/password login, JWT handling (httpOnly cookies handled by API), protected routes.
- **Workspaces**: Workspace switcher, invite UI.
- **Goals & Action Items**: Nested milestones, Kanban board, list view toggle.
- **Announcements**: Rich text rendering, emoji reactions.
- **Analytics**: Dashboard stats, Recharts for Goal completion.
- **Real-time**: Listen to socket events to live-update feed, reactions, and online presence.
