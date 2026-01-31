# ⚙️ EMS Backend (NestJS + Prisma)

This is the core API for the Employee Management System, built for security, scalability, and developer experience.

## 🚀 Quick Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   The system uses **SQLite** for zero-config setup. Ensure your `.env` looks like this:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=your_secret_here
   PORT=3001
   FRONTEND_URL=http://localhost:3002
   ```

3. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```

4. **Start Development Server**:
   ```bash
   # Standard Windows command to handle path apostrophes:
   npm run start:win

   # Or with auto-reload:
   npm run dev:win
   ```

---

## 💎 Prisma Operations

| Task | Command |
| :--- | :--- |
| **Visualize Data** | `npx prisma studio` |
| **Reset DB** | `npx prisma migrate reset` |
| **Check Schema** | `npx prisma validate` |
| **New Migration** | `npx prisma migrate dev --name <migration_name>` |

### Connecting Locally:
To view your SQLite tables directly, run `npx prisma studio`. This provides a beautiful UI at `http://localhost:5555` to browse your `dev.db` content.

---

## 🛠️ API Modules
- **Auth**: JWT Strategy & Roles Guard (Admin, HR, Employee).
- **Employee**: CRUD with status tracking and statistics.
- **Department**: Organizational grouping and employee aggregation.
- **Attendance**: Check-in/out logic with date-range reporting.
- **Leave**: Approval workflow with status management.

---

## 📝 Backend Commands Summary
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start:win`: Build and run the server.
- `npm run dev:win`: Hot-reload development using `ts-node-dev`.
- `npm run lint`: Fix code style and linting issues.
