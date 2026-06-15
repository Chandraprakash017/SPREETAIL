# Shared Expense App

## Overview
A production-grade shared expense management system with robust split calculations, immutable audit trails, and automated anomaly detection for CSV imports.

## Architecture
The application follows a standard **N-Tier Architecture**:
- **Presentation Layer**: Built with React, Vite, and Tailwind CSS. Employs React Router for SPA navigation.
- **API Routing Layer**: Express routers map HTTP requests to controllers. Includes input validation using `express-validator`.
- **Business Logic Layer**: Services (`authService`, `expenseService`, `groupService`, `anomalyDetectionEngine`) house core logic, keeping controllers lean and testable.
- **Data Access Layer**: Uses **Prisma ORM** connecting to a **Neon Serverless PostgreSQL** database.

## Setup Instructions

1. **Clone and Install**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` in the `backend/` directory:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<neon_host>/neondb?sslmode=require&pgbouncer=true"
   JWT_SECRET="your_secure_jwt_secret"
   PORT=5000
   ```

3. **Database Setup**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

4. **Run the Application**
   ```bash
   # Terminal 1 (Backend)
   cd backend
   npm run dev

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

## API List

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT

### Group Management
- `POST /api/groups` - Create a group
- `POST /api/groups/:id/members` - Add a member to a group
- `DELETE /api/groups/:id/members/:userId` - Remove a member (Soft Delete)

### Expense Management
- `POST /api/expenses` - Create an expense (Atomic Transaction)
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Soft-delete an expense

### Anomalies
- `POST /api/anomalies/:id/approve` - Approve flagged anomaly
- `POST /api/anomalies/:id/reject` - Reject flagged anomaly
- `POST /api/anomalies/:id/edit` - Edit and approve anomaly
