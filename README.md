# 🚀 Employee Management System (EMS)

A state-of-the-art, full-stack Employee Management System built with **NestJS**, **Next.js 15 (Turbopack)**, **Prisma**, and **SQLite**. Designed for high performance, type safety, and a premium user experience.

---

## 🏗️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: **SQLite** (Zero-configuration, local file-based)
- **Auth**: JWT with Role-Based Access Control (RBAC)

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Bundler**: **Turbopack** (Incremental, ultra-fast builds)
- **Styling**: Tailwind CSS with Dark/Light Mode support
- **Icons**: Lucide React

---

## 🛠️ Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install all dependencies:
```bash
# Install root, backend, and frontend dependencies at once
npm run install-all
```

### 3. Database & Prisma Setup (Backend)
Navigate to the `backend` directory and prepare the database:

```bash
cd backend

# 1. Generate Prisma Client
npx prisma generate

# 2. Run Database Migrations (Initializes SQLite dev.db)
npx prisma migrate dev --name init

# 3. Seed Test Data (Creates test accounts)
npx ts-node prisma/seed.ts
```

---

## 🖥️ Running the Application

### 🛰️ Backend (NestJS)
Due to Windows path compatibility (apostrophes in directory names), use the specialized script:
```bash
# In backend/
npm run start:win
```
*Port: `http://localhost:3001`*

### 🎨 Frontend (Next.js + Turbopack)
```bash
cd ../frontend
npm run dev
```
*Port: `http://localhost:3002`*

---

## 📊 Database Management (Prisma)

Developers can easily view and manage the local SQLite database using **Prisma Studio**.

### How to connect:
1. Open a terminal in the `backend/` folder.
2. Run:
   ```bash
   npx prisma studio
   ```
3. Open your browser to: **[http://localhost:5555](http://localhost:5555)**

| Command | Description |
| :--- | :--- |
| `npx prisma generate` | Regenerates the Prisma Client after schema changes |
| `npx prisma migrate dev` | syncs database with schema and creates migration files |
| `npx prisma studio` | Visual dashboard to view and edit database tables |
| `npx ts-node prisma/seed.ts` | Populates the database with initial admin and test data |

---

## 🔐 Test Accounts
Use these credentials after running the seed command:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ems.com` | `admin123` |
| **HR Manager** | `hr@ems.com` | `hr123` |
| **Employee** | `john.doe@ems.com` | `emp123` |

---

## 📂 Project Structure
- **/backend**: NestJS API, Prisma schema, and SQLite database.
- **/frontend**: Next.js 15 application with App Router and Turbopack.
- **TECHNICAL_DOCUMENTATION.md**: Deep dive into architecture and design decisions.

---

## 📝 Author
**Developer Shaikot**

## 📜 License
MIT
