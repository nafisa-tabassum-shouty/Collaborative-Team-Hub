---
name: managing-prisma-database
description: Manages PostgreSQL database using Prisma ORM. Use when creating or updating models, schemas, and queries.
---

# Prisma Database Management Guide

This skill governs the database schema and queries for the Collaborative Team Hub project located in `apps/api/prisma/schema.prisma`.

## Schema Requirements
You must define the following models:
- **User**: Email, Password (hashed), Name, Avatar (Cloudinary URL).
- **Workspace**: Name, Description, AccentColor.
- **WorkspaceMember**: Connects User and Workspace. Role (Admin/Member).
- **Goal**: Title, Owner, DueDate, Status. Belongs to a Workspace.
- **Milestone**: Belongs to Goal. Progress percentage.
- **Announcement**: Rich-text content. Belongs to Workspace. Author. IsPinned.
- **Reaction**: Emoji. Belongs to Announcement and User.
- **Comment**: Belongs to Announcement/Goal. Author.
- **ActionItem**: Assignee, Priority, DueDate, Status. Belongs to Goal.
- **AuditLog**: Action type, Entity, EntityId, User, Timestamp.

## Best Practices
1. **Relations**: Use proper one-to-many and many-to-many relations. Use onDelete cascades where appropriate.
2. **Migrations**: Always run `npx prisma migrate dev` after schema changes.
3. **Database URL**: Make sure to read the `DATABASE_URL` from the environment properly, especially for Railway deployment.
