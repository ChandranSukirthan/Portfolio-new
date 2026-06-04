# Portfolio Project Deployment Guide (Vercel)

This guide provides step-by-step instructions to deploy your portfolio project to **Vercel**. 

Since your project is split into a **Vite Frontend** and a **Next.js Backend**, the recommended and cleanest approach is to deploy them as **two separate Vercel projects** linked to the same Git repository.

---

## 🏗️ Architecture Overview
* **Backend:** Next.js Application (`/backend`) hosting serverless API routes (`/api/...`).
* **Frontend:** Vite SPA (`/frontend`) using React Router for client-side navigation.

---

## 🛠️ Step 0: Prerequisites & Git Setup

Before deploying, make sure your project is pushed to a remote repository (e.g., GitHub, GitLab, or Bitbucket).

1. Initialize git in your project root (`e:/portfolio`) if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```
2. Create a repository on GitHub and push your code there.
3. Keep the repository name handy, as Vercel will import it.

---

## 💾 Step 1: Configure MongoDB Atlas (Crucial)

Because Vercel runs on serverless functions, the IP address of your backend server will change dynamically on every request. You must allow MongoDB Atlas to accept connections from any IP.

1. Log in to your **[MongoDB Atlas Dashboard](https://cloud.mongodb.com/)**.
2. Go to **Network Access** (under the Security section in the left sidebar).
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (which adds `0.0.0.0/0`).
5. Click **Confirm**.

---

## ⚙️ Step 2: Deploy the Backend on Vercel

1. Log in to your **[Vercel Dashboard](https://vercel.com/)** and click **Add New** > **Project**.
2. Import your Git repository.
3. Configure the project:
   * **Project Name:** `portfolio-backend` (or any name you prefer)
   * **Framework Preset:** Select **Next.js**
   * **Root Directory:** Click **Edit** and select the `backend` folder.
4. **Environment Variables:** Expand the environment variables section and add the following keys from your `backend/.env`:
   
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `your_super_secret_key` | Secret key for signing admin authentication tokens |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary name (for image/document uploads) |
   | `CLOUDINARY_UPLOAD_PRESET` | `your_upload_preset` | Cloudinary upload preset |
   | `FRONTEND_URL` | *Leave empty for now* | We will update this once the frontend is deployed |

5. Click **Deploy**.
6. Once deployment finishes, copy the generated **Production URL** (e.g., `https://portfolio-backend.vercel.app`).

---

## 🖥️ Step 3: Deploy the Frontend on Vercel

1. Go back to your Vercel Dashboard, click **Add New** > **Project**.
2. Import the **same Git repository**.
3. Configure the project:
   * **Project Name:** `portfolio-frontend`
   * **Framework Preset:** Select **Vite** (or **Other** if Vite is not listed)
   * **Root Directory:** Click **Edit** and select the `frontend` folder.
   * **Build and Output Settings:** (Expand to check)
     * Build Command: `npm run build`
     * Output Directory: `dist`
4. **Environment Variables:** Expand the environment variables section and add:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://portfolio-backend.vercel.app/api` | **Replace with your actual backend URL + `/api`** |

   > [!IMPORTANT]
   > Make sure the backend URL does **not** have a trailing slash before `/api` (e.g., `https://portfolio-backend.vercel.app/api` is correct, `https://portfolio-backend.vercel.app//api` will fail).

5. Click **Deploy**.
6. Once deployment finishes, copy your **Frontend Production URL** (e.g., `https://portfolio-frontend.vercel.app`).

---

## 🔗 Step 4: Link CORS (Frontend & Backend Handshake)

Your Next.js backend uses CORS middleware to prevent unauthorized sites from making API calls. You must tell your backend to allow your new frontend URL.

1. Go to your Vercel Dashboard and select your **`portfolio-backend`** project.
2. Go to **Settings** > **Environment Variables**.
3. Find or add the **`FRONTEND_URL`** variable.
4. Set its value to your **Frontend Production URL** (e.g., `https://portfolio-frontend.vercel.app`).
5. **Redeploy the Backend:**
   * Go to the **Deployments** tab of your backend project.
   * Click the three dots `...` next to your latest deployment.
   * Select **Redeploy** to apply the new environment variable.

---

## 🔄 SPA Routing Configuration (Already Done!)

Vite is a Single Page Application (SPA). If a user goes directly to `/admin`, `/login`, or refreshes the page on any sub-path, Vercel will attempt to find a static file at that location and return a `404: NOT_FOUND` page.

To prevent this, we have created a `vercel.json` file in your `frontend/` folder:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This configuration forces Vercel to route all requests back to `index.html` so that `react-router-dom` can handle the routing correctly.

---

## 🚨 Troubleshooting Common Errors

### ❌ CORS Error in Browser Console
* **Symptom:** API calls fail with `CORS error: This frontend URL is not allowed` in the console.
* **Fix:** Check if the `FRONTEND_URL` environment variable on your backend matches the frontend URL *exactly* (including `https://` and without a trailing `/`). Ensure you **redeployed** the backend after changing the environment variable.

### ❌ MongoDB Connection Timeout
* **Symptom:** Backend APIs return `500 Internal Server Error` and logs show `Database connection failed`.
* **Fix:** Ensure you configured your IP Access List in MongoDB Atlas to allow `0.0.0.0/0`.

### ❌ Image Uploads Fail
* **Symptom:** Uploading a project image or certificate fails.
* **Fix:** Verify your Cloudinary environment variables (`CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`) are spelled correctly and set in your Vercel backend project environment variables.
