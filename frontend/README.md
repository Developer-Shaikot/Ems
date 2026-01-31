# 🎨 EMS Frontend (Next.js 15 + Turbopack)

The modern, responsive user interface for the Employee Management System.

## 🚀 Quick Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Ensure your `.env.local` points to the running backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Note: This uses **Turbopack** for near-instant cold starts and hot-module replacement.*

---

## ⚡ Features & Performance
- **Turbopack**: Drastically reduced build times compared to Webpack.
- **Server Components**: Leverages Next.js 15 App Router for optimal rendering.
- **Tailwind CSS**: Pixel-perfect design with a "WOW" aesthetic.
- **Dark Mode**: Integrated with `next-themes` for a premium feel.
- **Axios Interface**: Pre-configured interceptors for JWT token handling.

---

## 📂 UI Architecture
- **/src/app**: Next.js App Router (Layouts, Pages, Auth).
- **/src/components**: Shared UI components (Sidebar, Dashboard cards, Modals).
- **/src/lib**: API client (`api.ts`) and Auth utilities (`auth.ts`).

---

## 📝 Frontend Commands Summary
- `npm run dev`: Start Next.js with Turbopack enabled.
- `npm run build`: Optimize and build for production.
- `npm run start`: Run the production build.
- `npm run lint`: Audit for accessibility and code quality.
