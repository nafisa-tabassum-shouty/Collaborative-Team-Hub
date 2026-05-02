# Railway Deployment Environment Variables Guide

To deploy the **Collaborative Team Hub** to Railway, you need to configure environment variables for both the **Backend (API)** and **Frontend (Web)** services.

## 1. Backend Service (apps/api)
These variables should be added to the Railway service running the Express.js backend.

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | The PostgreSQL connection string. | `postgresql://user:pass@host:port/db` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens. | Use a long random string. |
| `JWT_REFRESH_SECRET`| Secret key for refresh tokens. | Use a long random string. |
| `PORT` | The port the server runs on. | Default: `5001` (Railway usually provides this automatically). |
| `FRONTEND_URL` | The URL of your deployed frontend. | `https://your-app-web.up.railway.app` |
| `SMTP_HOST` | Email server hostname. | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port. | `465` (for SSL) or `587` (for TLS). |
| `SMTP_SECURE` | Whether to use SSL/TLS. | `true` for port 465. |
| `SMTP_USER` | Email address for sending notifications. | `your-email@gmail.com` |
| `SMTP_PASS` | App password (not your real password). | [Generate App Password](https://myaccount.google.com/apppasswords) |

## 2. Frontend Service (apps/web)
These variables should be added to the Railway service running the Next.js frontend.

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The public URL of your deployed backend. | `https://your-app-api.up.railway.app` |

---

### ⚠️ Security Reminders
1. **Never** hardcode these values in your source code.
2. Ensure `PORT` in the backend service matches the port exposed by Railway.
3. For **Database**, if you create a Postgres database on Railway in the same project, Railway will automatically provide a `DATABASE_URL` variable to your service.
4. **CORS:** Ensure `FRONTEND_URL` in the backend exactly matches your deployed frontend URL to avoid cross-origin errors.
