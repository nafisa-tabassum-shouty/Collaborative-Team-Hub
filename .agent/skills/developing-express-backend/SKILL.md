---
name: developing-express-backend
description: Develops Node.js Express REST API and Socket.io. Use when building backend endpoints for Collaborative Team Hub.
---

# Express Backend Development Guide

This skill governs the development of the backend (`apps/api`) for the Collaborative Team Hub.

## Tech Stack
- Framework: Node.js + Express.js
- Database: PostgreSQL via Prisma ORM
- Auth: JWT (access & refresh tokens) in httpOnly cookies
- File Storage: Cloudinary (via multer)
- Real-time: Socket.io
- Docs: Swagger UI Express (Bonus)

## Core Principles
1. **REST API Design**: Follow standard RESTful patterns for routes (e.g., `/api/workspaces`, `/api/goals`).
2. **JWT Authentication**: Store tokens in HTTP-only cookies. Implement middleware to verify access tokens. Provide a refresh token endpoint.
3. **Audit Log (Advanced Feature)**: Create a middleware or Prisma extension/interceptor that automatically logs all data changes (creates, updates, deletes) to the `AuditLog` table for workspace tracking.
4. **Cloudinary Integration**: Use `multer` for parsing `multipart/form-data` and upload files (avatars, attachments) to Cloudinary.

## Socket.io Integration
- Emit events (`new_post`, `reaction_added`, `status_changed`, `user_online`) to the relevant workspace rooms.
- Handle socket authentication using JWTs.
