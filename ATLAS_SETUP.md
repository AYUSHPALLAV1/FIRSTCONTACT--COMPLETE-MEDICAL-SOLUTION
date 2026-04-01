# MongoDB Atlas Setup & Migration Guide

This comprehensive guide will walk you through setting up a cloud database with MongoDB Atlas and connecting it to your MediSecure application.

---

## 🛑 Phase 1: Create an Account & Cluster

1.  **Sign Up**
    *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
    *   Create an account using your email or Google/GitHub login.

2.  **Deploy a Cluster**
    *   Once logged in, you will be prompted to "Build a Database".
    *   Select **M0 Sandbox (Shared)**. This is the **FREE** tier.
    *   **Provider**: Choose AWS, Google Cloud, or Azure (doesn't strictly matter for this app, but AWS/N. Virginia is a common default).
    *   **Region**: Select a region with a "Free Tier Available" tag closest to you.
    *   **Name**: You can leave it as `Cluster0` or name it `MediSecure-Cluster`.
    *   Click the green **Create Cluster** button at the bottom.
    *   *Note: It may take 1-3 minutes for the cluster to provision.*

---

## 🔐 Phase 2: Security Configuration (Crucial Step!)

You cannot connect to the database until you create a user and allow your IP address.

1.  **Create a Database User**
    *   In the "Security Quickstart" (or go to **Security > Database Access** on the left sidebar):
    *   Click **Add New Database User**.
    *   **Authentication Method**: Password.
    *   **Username**: Enter a name (e.g., `admin_user`).
    *   **Password**: Click "Autogenerate Secure Password" or type your own.
        *   ⚠️ **IMPORTANT**: Copy this password immediately and paste it into a notepad. You will not see it again.
    *   **Database User Privileges**: Select "Read and write to any database".
    *   Click **Add User**.

2.  **Whitelist Your IP Address**
    *   Go to **Security > Network Access** on the left sidebar.
    *   Click **Add IP Address**.
    *   **Option A (Easiest for Dev)**: Click **Allow Access from Anywhere**.
        *   This adds `0.0.0.0/0` to the whitelist.
        *   *Pros*: You can connect from home, coffee shops, etc.
        *   *Cons*: Less secure (but acceptable for development with a strong password).
    *   **Option B (Strict)**: Click **Add Current IP Address**.
        *   *Pros*: More secure.
        *   *Cons*: If your internet IP changes (e.g., you restart your router), connection will fail.
    *   Click **Confirm**.

---

## 🔗 Phase 3: Get the Connection String

1.  Go to **Database** (left sidebar) to see your cluster.
2.  Click the **Connect** button next to your cluster name.
3.  Select **Drivers** (Node.js, Python, etc.).
4.  **Driver**: Select `Node.js`.
5.  **Version**: Select `4.1 or later` (or the latest version).
6.  **Copy the Connection String**. It will look something like this:
    ```
    mongodb+srv://admin_user:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```

---

## ⚙️ Phase 4: Connect Your Application

1.  **Open Project Configuration**
    *   Open the `.env` file in the `FirstContact` folder.

2.  **Update `MONGO_URI`**
    *   Find the line `MONGO_URI=...`.
    *   Comment out the local address by adding `#` in front:
        ```env
        # MONGO_URI=mongodb://localhost:27017/medisecure
        ```
    *   Paste your Atlas string on a new line.

3.  **Format the String Correctly**
    *   **Replace Password**: Locate `<db_password>` inside the string and replace it with the password you saved in Phase 2.
        *   *Incorrect*: `...user:<mypassword>@...` (Remove the brackets!)
        *   *Correct*: `...user:mypassword@...`
    *   **Set Database Name**: By default, Atlas connects to `test`. Change it to `medisecure`.
        *   Insert `medisecure` immediately after `.mongodb.net/` and before the `?`.
    
    **Final Example in `.env`**:
    ```env
    MONGO_URI=mongodb+srv://admin_user:SuperSecretPassword123@cluster0.abcde.mongodb.net/medisecure?retryWrites=true&w=majority
    ```

---

## 🚀 Phase 5: Verify & Restart

1.  **Restart Server**
    *   Go to your terminal where `node server.js` is running.
    *   Press `Ctrl + C` to stop it.
    *   Run `node server.js` again.

2.  **Check Output**
    *   If successful, you will see:
        ```
        Server running on port 5001
        MongoDB Connected: cluster0-shard-00-00.abcde.mongodb.net
        ```
    *   If it says `localhost`, you didn't save the `.env` file.
    *   If it crashes with `MongoServerError: bad auth`, your password is wrong.
    *   If it hangs and times out, your IP is not whitelisted (See Phase 2).

---

## ❓ Troubleshooting Common Errors

| Error Message | Cause | Solution |
| :--- | :--- | :--- |
| `bad auth : Authentication failed` | Wrong username or password in `.env` | Check for typos. Did you remove `< >` brackets? Did you use the *Database User* password, not your *Atlas Account* password? |
| `MongooseServerSelectionError: connect ETIMEDOUT` | IP Address blocked by firewall | Go to Network Access in Atlas and ensure `0.0.0.0/0` (or your current IP) is Active. |
| `MongoParseError: Invalid connection string` | Typo in the URI | Ensure the string starts with `mongodb+srv://`. Ensure there are no spaces. |
