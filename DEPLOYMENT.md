# Full Application Deployment Guide

You have successfully set up your **Database** (MongoDB Atlas). Now you need to deploy your **Application** (Node.js/Express) so users can access it on the internet.

We will use **Render** (free tier) for hosting the application.

---

## 🏗️ Architecture Overview

*   **MongoDB Atlas**: Hosts your data (User accounts, etc.).
*   **Render**: Hosts your code (HTML, CSS, Node.js server).
*   **GitHub**: Stores your code versioning.

---

## 🛠️ Step 1: Prepare for Deployment

### 1. Create a `.gitignore` file
(I have already created this for you). It prevents sensitive files like `.env` and heavy folders like `node_modules` from being uploaded.

### 2. Initialize Git
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. Push to GitHub
1.  Go to [GitHub.com](https://github.com) and create a **New Repository**.
2.  Name it `medisecure-app`.
3.  **Do not** initialize with README/gitignore (you already have them).
4.  Copy the commands to "push an existing repository from the command line":
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/medisecure-app.git
    git branch -M main
    git push -u origin main
    ```

---

## ☁️ Step 2: Deploy to Render

1.  **Create Account**: Go to [Render.com](https://render.com) and sign up with your GitHub account.
2.  **New Web Service**:
    *   Click **New +** button.
    *   Select **Web Service**.
3.  **Connect Repository**:
    *   Find `medisecure-app` in the list and click **Connect**.
4.  **Configure Service**:
    *   **Name**: `medisecure-app` (or unique name).
    *   **Region**: Closest to you (e.g., Singapore, Oregon).
    *   **Branch**: `main`.
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free.
5.  **Environment Variables** (Crucial!):
    *   Scroll down to **Environment Variables**.
    *   Click **Add Environment Variable**.
    *   **Key**: `MONGO_URI`
    *   **Value**: (Paste your connection string from MongoDB Atlas - same as in your `.env` file).
    *   Click **Add Environment Variable** again.
    *   **Key**: `JWT_SECRET`
    *   **Value**: (Paste your secret key or generate a new secure one).
6.  **Deploy**:
    *   Click **Create Web Service**.

---

## ✅ Step 3: Verify Deployment

Render will start building your app. It might take 2-3 minutes.
Once done, you will see a green **Live** badge.

*   Your URL will look like: `https://medisecure-app.onrender.com`
*   Open that link in your browser.
*   Try registering a user. It should save to your MongoDB Atlas database!

---

## 🔄 Common Issues

*   **"Build Failed"**: Check the logs. Usually due to missing dependencies in `package.json`.
*   **"Application Error"**: Usually means `MONGO_URI` is missing or incorrect in the Environment Variables on Render.
