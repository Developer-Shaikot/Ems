# Technical Documentation: Employee Management System (EMS)

## 1. Executive Summary
The Employee Management System (EMS) is a modern, full-stack web application designed to streamline human resource operations, including employee tracking, department management, attendance logging, and leave processing. The system is built with a focus on performance, type safety, and modularity.

---

## 2. Technology Stack & Rationale

### 2.1 Backend: NestJS
**Why NestJS?**
- **Architecture**: NestJS provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications.
- **TypeScript First**: Leverages the power of TypeScript for early error detection and better developer tooling.
- **Modularity**: Uses a module-based system (`AuthModule`, `EmployeeModule`, etc.) that keeps features encapsulated and organized.
- **Dependency Injection**: Simplifies testing and promotes better code structure.

### 2.2 Frontend: Next.js 15
**Why Next.js?**
- **App Router**: Utilizes the latest React features like Server Components for better performance and SEO.
- **Developer Experience**: Fast Refresh and optimized builds.
- **Turbopack Integration**: As the next-generation successor to Webpack, Turbopack provides lightning-fast HMR (Hot Module Replacement) and build times.

### 2.3 ORM: Prisma
**Why Prisma?**
- **Type Safety**: Prisma generates a client that is tailored specifically to your database schema, providing full TypeScript intellisense.
- **Migrations**: Simplifies database evolution with `prisma migrate`, ensuring the schema is always in sync with the code.
- **Intuitive API**: Replaces complex SQL queries with a clean, readable JavaScript/TypeScript API.

### 2.4 Database: SQLite
**Why SQLite?**
- **Zero Configuration**: No need to install a separate database server (like PostgreSQL or MySQL).
- **Portability**: The entire database is stored in a single file (`backend/dev.db`), making it easy to share and set up across different environments.
- **Local Development**: Ideal for this project's current development phase to bypass complex environment setup issues while maintaining standard SQL features.

---

## 3. Database Architecture

### 3.1 Data Model
The database is managed via Prisma and stored locally in `backend/dev.db`.

**Key Entities:**
- **User**: Handles authentication and role-based access (ADMIN, HR, EMPLOYEE).
- **Employee**: Stores personal details, salary, and relates to a Department.
- **Department**: Organizational units within the company.
- **Attendance**: Daily logs of check-in/check-out times for employees.
- **Leave**: Management of leave requests (Sick, Casual, Annual) and their approval workflows.

### 3.2 Enum Handling in SQLite
Since SQLite does not natively support Enum types, the system uses **String validation** at the application level (NestJS `class-validator`) and comments in the `schema.prisma` to maintain data integrity.

---

## 4. System Components

### 4.1 Authentication System
- **JWT-based Authentication**: Secure, stateless session management.
- **Role-Based Access Control (RBAC)**: Custom `@Roles()` decorator and `RolesGuard` to protect sensitive endpoints.
- **Bcrypt Hashing**: Industry-standard password encryption.

### 4.2 Frontend Features
- **Responsive Dashboard**: Built with Tailwind CSS for seamless use on desktop and mobile.
- **Dynamic Forms**: Integrated with validation for adding/editing employees and requesting leaves.
- **Real-time Stats**: Dashboard summaries for HR and Admin users.

---

## 5. Development Workflow (Turbopack)
The project utilizes **Turbopack** for the frontend development server. 
- **Performance**: Up to 700x faster than Webpack in large projects.
- **Efficiency**: Only rebuilds the parts of the app that change, saving significant development time.

---

## 6. Setup & Deployment Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Install root dependencies: `npm install`
2. Install sub-project dependencies: `npm run install-all`

### Database Setup
1. Generate Prisma Client: `npx prisma generate` (in backend)
2. Run Migrations: `npx prisma migrate dev`
3. Seed Data: `npx ts-node prisma/seed.ts`

### Running the Application
- **Backend**: `npm run start:win` (Optimized for Windows paths)
- **Frontend**: `npm run dev` (Runs with Turbopack)

---

## 7. Conclusion
The EMS provides a robust foundation for organizational management by combining the best-in-class tools for backend stability (NestJS), database management (Prisma/SQLite), and frontend speed (Next.js/Turbopack).
