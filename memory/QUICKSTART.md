# Quick Start Guide

## Prerequisites
- Node.js 20+ installed
- PostgreSQL database running
- Git (optional)

## Setup Instructions

### 1. Install Dependencies
```bash
# Install all dependencies at once
npm run install:all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/employee_management?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Setup Database
```bash
# Generate Prisma Client
cd backend
npm run prisma:generate

# Run migrations
npm run prisma:migrate
# When prompted, enter migration name: "init"

# Seed database with test data
npx prisma db seed
```

### 4. Start Development Servers

**Option 1: Using separate terminals**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Using root scripts**
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio** (optional): `npm run prisma:studio`

## Test Credentials

After seeding the database, use these credentials:

### Admin Account
- **Email**: admin@ems.com
- **Password**: admin123
- **Access**: Full system access

### HR Manager Account
- **Email**: hr@ems.com
- **Password**: hr123
- **Access**: Employee, department, attendance, and leave management

### Employee Account
- **Email**: john.doe@ems.com
- **Password**: emp123
- **Access**: View own data, check-in/out, request leaves

## Features to Test

1. **Authentication**
   - Login with different roles
   - Check role-based menu visibility
   - Test protected routes

2. **Employee Management** (Admin/HR only)
   - View employee list
   - Search and filter employees
   - Add new employee (requires creating user first)
   - Edit employee details
   - Delete employee

3. **Department Management** (Admin/HR only)
   - View departments
   - Create new department
   - Edit department
   - Delete department

4. **Attendance Tracking**
   - Check in for the day
   - Check out
   - View attendance history
   - View attendance reports (Admin/HR)

5. **Leave Management**
   - Request leave
   - View leave history
   - Approve/reject leaves (Admin/HR only)
   - View leave statistics

6. **Theme Toggle**
   - Switch between light and dark modes
   - Theme persists across sessions

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npm run prisma:generate`

### Frontend shows API errors
- Ensure backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in .env.local
- Clear browser cache and localStorage

### Database errors
- Drop and recreate database if needed
- Run migrations again
- Re-run seed script

### Port already in use
- Change PORT in backend .env
- Change port in frontend dev script
- Update NEXT_PUBLIC_API_URL accordingly

## Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

## Additional Commands

```bash
# View database in browser
npm run prisma:studio

# Reset database
npx prisma migrate reset

# Format code
cd backend && npm run format
cd frontend && npm run lint
```

## Support

For issues or questions:
1. Check the README.md
2. Review the walkthrough.md
3. Check console logs for errors
4. Verify environment variables
