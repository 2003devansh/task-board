# 🔬 Low-Level Design (LLD) — Multi-Tenant Task Board

> Document version: 2.0  
> Last updated: April 2026

---

## 1. Monorepo Workspace Structure

The system is implemented using a Turborepo monorepo to ensure shared contracts, strict type safety, and consistency across frontend and backend.

The repository is structured as follows:

apps/
web/ → Next.js frontend application  
 api/ → Express backend application

packages/
core/ → shared contracts (types, schemas, API definitions, utilities)

---

### apps/web (Frontend)

This application is responsible for UI rendering and client-side behavior.

Key folders:

- app/ → contains routes such as login, register, and dashboard
- components/ → reusable UI components (TaskBoard, TaskCard, TaskModal, CreateTaskForm)
- features/ → feature-specific logic (task API layer and types)
- hooks/ → custom hooks (useTasks for fetching and managing task state)
- lib/ → API utilities (fetch wrapper, auth helpers)

---

### apps/api (Backend)

This application exposes REST APIs and enforces all business rules.

Key folders:

- auth/ → handles login and register logic
- task/ → handles task CRUD operations
- middleware/ → JWT authentication middleware
- app.ts → Express app configuration
- server.ts → server entry point
- prisma/ → database schema and migrations

---

### packages/core (Shared Layer)

This package acts as the **single source of truth** shared between frontend and backend.

It contains:

- TypeScript types
- Zod schemas
- API contracts
- Utility functions

Both applications import from this package to ensure consistency.

---

## 2. Database Schema

The database is designed using PostgreSQL and accessed via Prisma ORM.

### Entities

Tenant:

- id (primary key)
- name

User:

- id (primary key)
- email (unique)
- password (hashed)
- tenantId (foreign key → Tenant.id)

Task:

- id (primary key)
- title
- description
- status (todo | in_progress | done)
- assigneeId (optional)
- tenantId (foreign key → Tenant.id)
- createdAt
- updatedAt

---

### Relationships

- A Tenant can have multiple Users
- A Tenant can have multiple Tasks
- A User belongs to a single Tenant

---

### Design Reasoning

The system uses a **tenant-based multi-tenancy model**.

- Every task includes tenantId
- Every user includes tenantId
- All queries are scoped by tenantId

This ensures strict isolation between tenants.

Status is stored as an enum to align directly with UI columns and enforce valid values.

---

## 3. API Contract Design

All API endpoints are implemented in the backend and typed using shared contracts from packages/core.

---

### Authentication

POST /auth/register

Request:
{
email: string
password: string
workspaceName?: string
}

Response:
{
token: string
}

Errors:

- 400 → User already exists
- 500 → Server error

---

POST /auth/login

Request:
{
email: string
password: string
}

Response:
{
token: string
}

Errors:

- 400 → Invalid credentials
- 500 → Server error

---

### Tasks

GET /tasks

Response:
{
tasks: Task[]
}

Errors:

- 401 → Unauthorized

---

POST /tasks

Request:
{
title: string
description: string
}

Response:
{
task: Task
}

Errors:

- 400 → Validation error
- 401 → Unauthorized

---

PUT /tasks/:id

Request:
{
title?: string
description?: string
status?: "todo" | "in_progress" | "done"
}

Response:
{
message: string
}

Errors:

- 404 → Task not found
- 400 → Validation error
- 401 → Unauthorized

---

DELETE /tasks/:id

Response:
{
message: string
}

Errors:

- 404 → Task not found
- 401 → Unauthorized

---

### Tenant Isolation Rule

Every task query enforces:

where: { tenantId: req.user.tenantId }

This ensures no user can access another tenant’s data.

---

## 4. Shared Package Design (packages/core)

The core package is responsible for maintaining shared logic and contracts across applications.

---

### Types

Includes:

- Task
- User
- Tenant
- ApiResponse<T>

These are used by both frontend and backend to ensure consistent data structures.

---

### Zod Schemas

Includes:

- CreateTaskSchema
- UpdateTaskSchema

These schemas are used for validation on both client and server, preventing duplication and ensuring consistency.

---

### API Contracts

Defines request and response shapes for:

- Authentication endpoints
- Task endpoints

This ensures that both frontend and backend strictly follow the same contract.

---

### Utilities

Includes:

- Error normalizers
- ID generators
- Date formatters

These utilities are shared to avoid duplication and maintain consistency.

---

### Usage Across Apps

- Backend uses schemas for validation and types for responses
- Frontend uses contracts for typing API calls
- Both import everything from core as a single source of truth

---

## 5. Feature Module Design — Task Feature

The task feature is implemented as a self-contained module across frontend and backend.

---

### Backend Task Module

Location:
apps/api/src/task/

Files:

- task.controller.ts → handles business logic
- task.routes.ts → defines API routes

---

Responsibilities:

- Validates input using Zod
- Enforces tenant isolation
- Performs CRUD operations via Prisma

---

### Frontend Task Module

Location:
apps/web/features/task/

Files:

- api.ts → contains API calls
- types.ts → defines task types

Components:

- TaskBoard → main board layout
- TaskColumn → column for each status
- TaskCard → individual task
- TaskModal → edit modal
- CreateTaskForm → task creation form

---

### Data Flow

User interacts with UI  
→ API call (features/task/api.ts)  
→ backend controller  
→ database  
→ response returned  
→ useTasks hook updates state  
→ UI re-renders

---

### Drag-and-Drop Flow

User drags task  
→ UI updates immediately (optimistic)  
→ API call to update status  
→ success → keep state  
→ failure → rollback

---

## 6. State Management Strategy

Frontend state is managed using React hooks.

---

### State Stored on Frontend

- tasks → list of tasks
- loading → API loading state
- error → error state

This state is managed inside a custom hook:

useTasks()

---

### State Ownership

- Dashboard component owns task state
- Child components receive state via props
- Ensures single source of truth

---

### Why This Approach

- Application scope is small → no need for Redux/Zustand
- Hooks provide sufficient control
- Simpler architecture with less overhead

---

### Optimistic Updates

Used for drag-and-drop:

setTasks(updated)
try {
await apiCall()
} catch {
setTasks(previous)
}

---

### Backend State

- Stateless (JWT-based)
- No session storage
- All persistent data stored in database

---

### Design Reasoning

This approach ensures:

- Fast UI updates
- Minimal complexity
- Strong consistency between frontend and backend
