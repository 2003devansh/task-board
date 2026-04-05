# 🏗️ High-Level Design (HLD) — Multi-Tenant Task Board

> Document version: 2.0  
> Last updated: April 2026

---

## 1. System Overview

This system is a full-stack **multi-tenant task management application** built around a Kanban-style workflow. Each user belongs to a tenant (workspace), and all tasks are strictly scoped within that tenant. The application allows users to create, update, delete, and organize tasks across three statuses: _todo_, _in_progress_, and _done_.

Core capabilities include authentication, task CRUD operations, drag-and-drop status updates, optimistic UI behavior, and inline editing through modal interfaces. A key requirement of the system is **strict tenant isolation**, enforced at the backend level.

The system is designed as a **Turborepo monorepo**, allowing both frontend and backend to share contracts, types, and validation logic. This ensures consistency, prevents duplication, and eliminates API contract drift.

---

## 2. Architecture Overview

The system follows a clear separation of concerns between frontend, backend, and shared logic:

Browser (Client)
↓
apps/web (Next.js frontend)
↓ HTTP (fetch)
apps/api (Express backend)
↓
Auth Middleware (JWT validation + tenant context)
↓
Controllers (business logic)
↓
Prisma ORM
↓
PostgreSQL Database

The frontend is responsible for rendering UI and managing interaction, while the backend handles authentication, validation, business rules, and persistence.

---

## 3. Monorepo Design

The repository is structured as a Turborepo workspace:

apps/
web/ → frontend application (Next.js)
api/ → backend application (Express)

packages/
core/ → shared contracts (types, schemas, utilities)

This structure ensures that shared logic is centralized and reused across both applications.

---

## 4. Application Responsibilities

### apps/web (Frontend)

Responsible for:

- Rendering the task board UI
- Managing client-side state
- Handling drag-and-drop interactions
- Calling backend APIs using fetch
- Displaying forms and modals

It does not contain business logic or database access.

---

### apps/api (Backend)

Responsible for:

- Authentication (JWT issuance and validation)
- Task CRUD operations
- Tenant isolation enforcement
- Request validation using Zod
- Database interaction via Prisma

It does not contain UI or presentation logic.

---

### packages/core (Shared Layer)

This package acts as the **single source of truth**.

It exports:

- Shared TypeScript types (Task, User, Tenant, ApiResponse)
- Zod validation schemas
- API request/response contracts
- Utility functions

Both frontend and backend import from this package, ensuring full type safety and consistency.

---

## 5. Data Flow

### Task Creation Flow

1. User submits task form in frontend
2. Frontend sends request:

POST /tasks

3. Backend:

- Verifies JWT
- Extracts tenantId
- Validates request using Zod
- Creates task via Prisma

4. Backend responds with created task

5. Frontend updates local state and re-renders UI

---

### Drag-and-Drop Flow (Optimistic UI)

1. User drags task to another column
2. Frontend immediately updates UI state
3. API request is sent:

PUT /tasks/:id

4. If request succeeds → UI remains
5. If request fails → state is rolled back

This ensures a fast and responsive user experience.

---

## 6. Authentication Flow

1. User registers or logs in
2. Backend validates credentials
3. JWT is issued containing:
   - userId
   - tenantId

4. Token is stored in frontend (localStorage)
5. All API requests include Authorization header

Backend middleware validates token and attaches user context to each request.

---

## 7. Multi-Tenancy Strategy

The system uses a **single database with tenant-based isolation**.

Each entity includes a tenantId field. All backend queries enforce:

where: { tenantId: req.user.tenantId }

This guarantees that users cannot access or modify data from other tenants, even with a valid JWT.

Tenant isolation is enforced strictly at the API layer and never relies on frontend filtering.

---

## 8. State Management Strategy

Frontend state is managed using React hooks.

The primary state includes:

- tasks
- loading
- error

State is centralized in the Dashboard component using a custom hook (useTasks), and passed down to child components via props.

Optimistic updates are used for drag-and-drop interactions to improve responsiveness.

No global state library (like Redux) is used, as the scope of the application does not require it.

---

## 9. Technology Choices

Turborepo was chosen to enable a monorepo architecture with shared packages and efficient builds.

Next.js is used for the frontend due to its modern React features and routing system.

Express is used for the backend to provide a simple and clear API layer.

Prisma ORM is used for type-safe database access and schema management.

PostgreSQL is used as the relational database for consistency and scalability.

Zod is used for runtime validation and shared schema enforcement.

dnd-kit is used for implementing drag-and-drop interactions.

---

## 10. Trade-offs and Limitations

The system uses JWT without refresh token rotation, which is sufficient for this scope but not production-grade.

Optimistic updates improve UX but require careful rollback handling on failure.

State management is kept simple using hooks instead of introducing global state libraries.

No real-time updates are implemented; users must refresh to see external changes.

---
