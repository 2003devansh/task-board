# 🧩 Multi-Tenant Task Board

> Full-stack assignment project built with Next.js, Express, PostgreSQL, and Prisma (v6) using a Turborepo monorepo architecture.

---

## 1. Overview

This project implements a multi-tenant task management system with a Kanban-style interface. Each user belongs to a tenant (workspace), and all tasks are strictly scoped within that tenant. The system allows users to create, update, delete, and organize tasks across three statuses: todo, in_progress, and done.

The application includes authentication, task CRUD operations, drag-and-drop functionality, optimistic UI updates, and inline editing through a modal interface. A key requirement of the system is strict tenant isolation, which is enforced at the backend API layer rather than relying on frontend filtering.

---

## 2. Tech Stack

Frontend:

- Next.js
- Ant Design
- dnd-kit

Backend:

- Express.js
- Prisma ORM (v6)
- PostgreSQL
- JWT authentication

Shared:

- TypeScript (strict mode enabled)
- Zod (validation)
- Turborepo (monorepo)

---

## 3. Monorepo Structure

The project is structured as a Turborepo workspace with clearly separated applications and shared packages.

apps/
web/ → frontend application (Next.js)
api/ → backend application (Express)

packages/
core/ → shared contracts (types, schemas, API definitions, utilities)

This structure ensures that shared logic is centralized and reused across both applications.

---

## 4. Shared Core Package

The packages/core module acts as the single source of truth across the system.

It exports shared TypeScript types such as Task, User, Tenant, and ApiResponse<T>, along with Zod schemas for validation, API contract definitions for request and response shapes, and reusable utility functions.

Both frontend and backend import from this package, ensuring type safety and eliminating duplication.

---

## 5. Setup Instructions

To run the project locally, first install dependencies:

npm install

---

Backend setup:

cd apps/api  
npx prisma generate  
npx prisma migrate dev  
npm run dev

The backend server runs on http://localhost:4000

---

Frontend setup:

cd apps/web  
npm run dev

The frontend runs on http://localhost:3000

---

## 6. Environment Configuration

Create a .env file inside apps/api with the following variables:

DATABASE_URL=postgresql://postgres:password@localhost:5432/db  
JWT_SECRET=your_secret

These values are required for database connection and JWT authentication.

---

## 7. Authentication Flow

Users can register or log in using email and password. During registration, a new tenant is created and linked to the user. Upon successful login, a JWT token is issued containing the userId and tenantId.

The token is stored in localStorage on the frontend and sent with every API request using the Authorization header in the format:

Authorization: Bearer <token>

The backend validates this token using middleware and attaches the user context to each request.

---

## 8. Multi-Tenancy Enforcement

The system uses a tenant-based multi-tenancy model with a single shared database. Each user and task is associated with a tenantId.

All backend queries are scoped using:

where: { tenantId: req.user.tenantId }

This ensures that users cannot access or modify data belonging to other tenants, even if they possess a valid JWT.

---

## 9. Task Board Functionality

Each task includes the following fields:

- id
- title
- description
- status (todo | in_progress | done)
- assigneeId
- tenantId
- createdAt
- updatedAt

The frontend displays tasks in a Kanban board with three columns corresponding to the status values.

---

Drag-and-drop allows users to move tasks between columns. When a task is dropped into a new column, the UI updates immediately using an optimistic update strategy, and a corresponding API request is sent to persist the change.

If the API request fails, the UI state is rolled back to its previous state.

---

Each task also supports inline editing. An edit icon on the task card opens a modal where users can update task details such as title, description, and status. Changes are sent to the backend via an update API.

---

## 10. API Overview

Authentication endpoints:

POST /auth/register  
POST /auth/login

---

Task endpoints:

GET /tasks  
POST /tasks  
PUT /tasks/:id  
DELETE /tasks/:id

All task endpoints require a valid JWT token.

---

## 11. State Management

Frontend state is managed using React hooks. A custom hook (useTasks) is responsible for fetching tasks, storing them in local state, and handling loading and error states.

The dashboard component acts as the single source of truth for task data and passes state down to child components such as TaskBoard and CreateTaskForm.

Optimistic updates are used to enhance user experience during drag-and-drop interactions.

---

## 12. Security Considerations

- JWT-based authentication ensures stateless security
- Passwords are hashed using bcrypt
- Tenant isolation is enforced at the API layer
- No sensitive data is exposed to the frontend

---

## 13. Key Design Decisions

The project uses a monorepo architecture to centralize shared contracts and maintain consistency across the stack. Zod is used for validation to ensure identical rules on both client and server. Prisma provides type-safe database access, and optimistic UI updates improve responsiveness.

The architecture prioritizes simplicity, maintainability, and strict type safety.

---

## 14. Future Improvements

- Implement refresh token mechanism for better authentication
- Add role-based access control within tenants
- Introduce real-time updates using WebSockets
- Add pagination and filtering for tasks
- Implement automated testing (unit, integration, e2e)

---

## 15. Summary

This project demonstrates a complete full-stack system with clear separation of concerns, strong type safety, secure multi-tenant architecture, and a responsive user experience.

The use of a shared core package ensures consistency across frontend and backend, while backend-enforced tenant isolation guarantees data security.
