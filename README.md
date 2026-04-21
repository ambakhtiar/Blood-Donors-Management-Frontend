<div align="center">
  <h1>🩸 BloodHelp - Frontend Unified Portal</h1>
  <p><b>Premium User Experience for Donors, Hospitals, and Organizations</b></p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.1.x-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154.svg?logo=react-query&logoColor=white)](https://tanstack.com/query)
  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black.svg?logo=vercel&logoColor=white)](https://bloodhelp.vercel.app)

  <p>
    <a href="#-project-overview">Overview</a> •
    <a href="#-role-based-access-rbac">RBAC</a> •
    <a href="#-ui--state-architecture">Architecture</a> •
    <a href="#-folder-structure">Structure</a> •
    <a href="#-getting-started">Setup</a>
  </p>
</div>

---

## 🎨 Visual Preview

<div align="center">
  <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1200&h=600" alt="BloodHelp UI Preview Concept" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
  <p><i>The UI leverages a refined "Glassmorphism" aesthetic with an absolute focus on accessibility and urgency.</i></p>
</div>

---

## 📖 Project Overview

**BloodHelp Frontend** is a fully responsive, visually stunning unified portal built to interact with the BloodHelp API Server. 

When a life is on the line, UI friction is unacceptable. We built this frontend using the bleeding edge of React and Next.js to ensure **instant transitions, optimistic UI updates, and zero layout shift**. Whether a hospital is recording a verified donation, an NGO is managing volunteers, or a user is funding a critical campaign via SSLCommerz—the experience is seamless.

> **Live Demo:** [https://bloodhelp.vercel.app](https://bloodhelp.vercel.app)

---

## 🛡️ Role-Based Access (RBAC) 

The platform adapts dynamically based on the logged-in user's role. Route guarding prevents layout flickering and ensures top-tier security.

| Role | Core Capabilities |
| :--- | :--- |
| 🌍 **Guest** | Browse public feed, Search donors by area, View crowdfunding campaigns. |
| 👤 **User (Donor)**| Open blood requests, manage personal health profile, comment/engage, make SSLCommerz donations. |
| 🏥 **Hospital** | Access official record portals. Create immutable, verified records of physical donations. |
| 🏢 **Organisation**| Manage regional volunteer networks, organize large-scale blood drives. |
| 🛡️ **Admin** | Overview platform analytics, moderate posts, block bad actors. |
| 👑 **Super Admin** | Total system configuration, assign new Admins. |

---

## 🏗 UI & State Architecture

We utilize an advanced component and state management strategy to maintain performance:

- **Next.js 16 App Router**: Leveraging Server Components for initial fast loads and Client Components for high interactivity.
- **TanStack Query (React Query)**: Absolute control over API data caching, background refetching, and optimistic UI updates (e.g., instant like/comment updates).
- **TanStack Form + Zod**: Highly performant, headless form state management paired with rigorous validation schemas to prevent bad data before it ever hits the server.
- **Custom Axios Interceptor**: A smart networked layer that automatically detects expired tokens, pauses pending requests, calls the `/refresh-token` endpoint (reading the HttpOnly cookie), and resumes the queued requests seamlessly without logging the user out.

---

## 📁 Folder Structure

Our `src/` directory uses a strict Feature-Sliced Design pattern to prevent the "spaghetti code" common in large specific applications.

```text
src/
├── app/                      # Next.js Routing
│   ├── (commonLayout)/       # Public feed, donor search, profiles
│   ├── (dashboards)/         # Protected admin/role-specific interfaces
│   └── auth/                 # Isolated authentication screens
├── components/               # Atomic UI Elements
│   ├── shared/               # Reusable blocks (RoleGuard, ImageUploader)
│   └── ui/                   # Shadcn UI low-level components
├── features/                 # Bound Domain Logic (The Core)
│   ├── auth/                 # Hooks/Forms for registration
│   ├── post/                 # CreatePost form, PostCard displays
│   ├── hospital/             # Hospital Record forms
│   └── payments/             # SSLCommerz Modal & logic
├── lib/                      # Utilities (Tailwind merge, formatting)
├── providers/                # React Contexts (Auth, Theme, QueryClient)
├── services/                 # Pure Axios API callers
├── types/                    # Frontend TS Interfaces mapped to backend
└── validations/              # Zod Schemas
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v20 or higher.
- A running instance of the [BloodHelp Backend](https://github.com/ambakhtiar/BloodHelp-Backend).

### 2. Installation
```bash
git clone https://github.com/ambakhtiar/BloodHelp-Frontend.git
cd BloodHelp-Frontend

# Install dependencies using npm
npm install
```

### 3. Environment Variables
Create a `.env.local` file. You only need to point this to your running backend.

```env
# Point to your local or deployed backend API
# Ensure NO trailing slash
NEXT_PUBLIC_BASE_API="http://localhost:5000/api/v1"
```

### 4. Running the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `next dev` | Start development server with TurboPack/Hot-reload |
| `build` | `next build` | Compiles the application for production |
| `start` | `next start` | Serves the built `.next` production application |
| `lint` | `next lint` | Runs ESLint specifically tuned for Next.js rules |

---

## 🌐 Deployment (Vercel)

This application is ready for instant deployment on Vercel:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Dashboard, set the Environment Variable `NEXT_PUBLIC_BASE_API` to your production backend URL.
3. Click **Deploy**. Vercel will automatically detect Next.js and run the correct build commands.

---

## 🤝 Contributing & Support
Found a bug or have a feature request? Please check the issues tracker or open a Pull Request.  

---

<div align="center">
  <p>Distributed under the <b>MIT License</b>.</p>
  <p>Designed and Developed by <b>AM Bakhtiar</b>.</p>
</div>
