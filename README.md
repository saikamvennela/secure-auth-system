# Secure Authentication System

## Project Overview

The Secure Authentication System is a role-based authentication application built using Node.js, Express.js, TypeScript, and MySQL.

It allows users to register and log in securely. Passwords are encrypted using bcrypt, and JSON Web Tokens (JWT) are used to authenticate users when accessing protected API endpoints.

The system supports three roles: Student, Instructor, and Admin. Role-based authorization restricts access to specific resources according to the user's role.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Role-based authorization
- MySQL database integration
- Passport Local authentication
- Session-based authentication
- Security middleware using Helmet
- CORS configuration
- Request logging using Morgan

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MySQL
- bcrypt
- JSON Web Token (JWT)
- Passport.js
- Express Session
- Helmet
- CORS
- Morgan

## Project Structure

```text
src/
├── config/
│   ├── db.ts
│   └── passport.ts
├── controllers/
│   ├── authController.ts
│   └── userController.ts
├── middleware/
│   ├── authenticate.ts
│   └── authorize.ts
├── models/
│   └── userModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── userRoutes.ts
├── utils/
│   └── generateToken.ts
├── app.ts
├── express.d.ts
└── server.ts
```

## Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a template.

Configure your MySQL connection details, JWT secret, and session secret. Keep your actual secrets private.

### 3. Create the database

Create a MySQL database named `secure_auth_db` and a `users` table with the required fields: `id`, `name`, `email`, `password`, `role`, `google_id`, and `created_at`.

### 4. Run the development server

```bash
npm run dev
```

The server runs at:

`http://localhost:5000`

### 5. Check TypeScript compilation

```bash
npx tsc --noEmit
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check whether the API is running |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/login-local` | Log in using Passport Local |
| GET | `/api/auth/session` | Check the Passport session |
| GET | `/api/users/profile` | Access the authenticated user's profile |
| GET | `/api/users/instructor` | Access the instructor area |
| GET | `/api/users/admin` | Access the admin area |

## Testing the API

Use Postman to test the endpoints.

### Register a user

Send a POST request to `/api/auth/register` with a JSON body:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Log in

Send a POST request to `/api/auth/login` with the registered email and password. A successful response returns a JWT.

### Access a protected route

Send a GET request to `/api/users/profile` with this authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `YOUR_JWT_TOKEN` with the token returned by the login endpoint.

### Test role-based authorization

Use a valid JWT to access `/api/users/instructor` and `/api/users/admin`. A user without the required role receives a `403 Forbidden` response.

## Security

- Passwords are stored as bcrypt hashes.
- JWTs are verified before protected resources are accessed.
- Role-based middleware checks permissions.
- User input is passed to parameterized MySQL queries.
- `.env` is excluded from version control.

## Current Scope

JWT authentication, Passport Local authentication, and session handling are implemented. Google OAuth is not yet configured. It requires valid Google OAuth credentials and a configured callback flow.

## Author

Vennela