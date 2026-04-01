# MediSecure Authentication System

## Overview
A secure, healthcare-grade authentication system built with Node.js, Express, and MongoDB. It features robust JWT-based authentication, strict JSON response formatting, and comprehensive security hardening.

## Features
- **Secure Authentication**: JWT-based stateless authentication.
- **Role-Based Access Control (RBAC)**: Support for Patient, Doctor, Nurse, and Admin roles.
- **Security Hardening**:
  - `helmet` for secure HTTP headers.
  - `xss-clean` for cross-site scripting protection.
  - `express-mongo-sanitize` to prevent NoSQL injection.
  - `hpp` for HTTP parameter pollution protection.
  - `express-rate-limit` for rate limiting.
  - `cors` enabled.
- **Standardized Responses**: Strict JSON format for success and error responses.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JSON Web Tokens (JWT), bcrypt
- **Frontend**: HTML5, CSS3 (Pastel Healthcare Theme), Vanilla JS

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token
- `GET /api/auth/me` - Get current user profile (Protected)

### System
- `GET /api/health` - Check system status

## Setup
1. Install dependencies: `npm install`
2. Set up `.env` file (copy from `.env.example`).
3. Run server: `node server.js`
4. Open `index.html` in browser.

## Response Format
**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1"]
}
```
