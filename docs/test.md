We need to fix the routing structure and implement a production-ready Authentication Flow (Login & Register). STRICT AND NON-NEGOTIABLE RULES: 
1. NEVER use `"use client"` inside ANY `page.tsx` file. All `page.tsx` files MUST be strictly Server Components.
2. Put interactive UI (forms, stateful components) in separate files (e.g., inside `src/features/` or `src/components/`) with `"use client"` and import them into the server pages.
3. Use TanStack Query for mutations, tanstack Form + Zod for strict validation, and Shadcn UI for components.
4. Implement comprehensive error handling (catch API errors, show precise validation messages) and loading states (spinners, disabled buttons).

### STEP 1: Fix Root Routing (`/` and `/home`)
1. Move the current marketing homepage content from `src/app/page.tsx` to `src/app/home/page.tsx` (Ensure it is a Server Component).
2. Create a new `src/app/page.tsx` (Root Route). This will be the main Post Feed. For now, render a simple Server Component container that imports a placeholder `<FeedContainer />` (which you will create in `src/features/feed/FeedContainer.tsx` with `"use client"`).

### STEP 2: Create Auth Validations (`src/validations/auth.validation.ts`)
Create highly strict Zod schemas:
- `loginSchema`: requires `password`. Either `email` or `contactNumber` must be provided (use `.superRefine` or similar logic).
- `registerSchema`: requires `name`, `password` (min 6 chars), `role` (strictly Enum: USER, HOSPITAL, ORGANISATION). Always requires `email`, `contactNumber`.
- if each role must -> email, numbe, password,
- and then role wise give info reference @schema.prisma

### STEP 3: Create Auth API Services (`src/services/auth.service.ts`)
Create standard Axios callers:
- `loginApi(payload)`: POST `/auth/login`
- `registerApi(payload)`: POST `/auth/register`

### STEP 4: Build Client-Side Auth Forms (`src/features/auth/components/`)
Create highly polished forms using Shadcn UI (`Form`, `Input`, `Button`, `Select`).
1. **`LoginForm.tsx` (`"use client"`):**
   - Use `useMutation` for `loginApi`.
   - Show a spinner icon inside the login button while `isPending`.
   - On Success: Use Shadcn/Sonner `toast.success`, call `setAccessToken` (from axiosInstance utility), update Global Auth State (if applicable), and redirect (`router.push`) based on role/needsPasswordChange.
   - On Error: Parse the Axios error and show `toast.error(error.response?.data?.message || 'Login failed')`.
2. **`RegisterForm.tsx` (`"use client"`):**
   - Similar robust error handling and loading states.
   - Use dynamic fields based on the selected `role` (e.g., show "Hospital Name" if role is HOSPITAL).

### STEP 5: Assemble Auth Pages (Server Components)
1. Create `src/app/(auth)/login/page.tsx`. Do NOT use `"use client"`. Import `<LoginForm />` and render it inside a beautifully centered Shadcn `Card` layout.
2. Create `src/app/(auth)/register/page.tsx`. Do NOT use `"use client"`. Import `<RegisterForm />` and render it properly.

Please generate this robust, error-proof architecture.