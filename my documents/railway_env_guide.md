# Railway Deployment Environment Variables Guide (Live Values)

This file contains the exact environment variables needed to deploy the **Collaborative Team Hub** on Railway. 

---

## 1. Backend Service (apps/api)
Add these to your **api** service variables on Railway:

| Variable Name | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://web-production-c04a9.up.railway.app` |
| `FRONTEND_URL` | `https://web-production-c04a9.up.railway.app` |
| `JWT_ACCESS_SECRET` | `5d2f3a7c8e9b4a1d6f2c8a3e7b9d1f4c0a8e2b5d7c3a9f1e4b6d0c2a8f5e7b3` |
| `JWT_REFRESH_SECRET`| `a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `anisahmed50@gmail.com` |
| `SMTP_PASS` | `lwgymigwgnioamru` |
| `CLOUDINARY_CLOUD_NAME`| *(Your Cloudinary Cloud Name)* |
| `CLOUDINARY_API_KEY` | *(Your Cloudinary API Key)* |
| `CLOUDINARY_API_SECRET`| *(Your Cloudinary API Secret)* |

---

## 2. Frontend Service (apps/web)
Add these to your **web** service variables on Railway:

| Variable Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api-production-ade5.up.railway.app` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api-production-ade5.up.railway.app` |

---

### 🔄 How to apply changes:
1. Copy the values above into Railway's **Variables** tab for each service.
2. After saving the frontend variables, Railway will automatically trigger a new build.
3. Once the build is `Online`, your app will be fully connected.
