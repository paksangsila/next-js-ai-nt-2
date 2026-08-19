<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# next-js-ai-nt-2

Next.js 16.3.1 (App Router) e-commerce site with a Thai-language storefront and auth. MySQL/MariaDB backend via Prisma 7.

## Commands

- `npm run dev` — dev server (`http://localhost:3000`)
- `npm run build` / `npm run start`
- `npm run lint` — ESLint (this is the only verification step; there is **no test or typecheck script**)
- After editing `prisma/schema.prisma`, run `npx prisma generate` (see below) — the generated client types must be refreshed or imports break.

## Architecture / non-obvious facts

- **Route groups**: `src/app/(front)/` is the public storefront; `src/app/(auth)/` holds login/signup. Shared shadcn/radix UI lives in `src/components/ui/`; page-specific components in `src/app/(front)/components/`.
- **Cache Components are ON** (`cacheComponents: true` in `next.config.ts`). Data-fetching pages/layouts opt out with `export const instant = false` and call `await connection()` from `next/server` — follow this existing pattern when adding dynamic routes rather than assuming a default.
- **Prisma 7 driver adapter, not the classic client**: the client is generated into `generated/prisma/` (gitignored) with `provider = "prisma-client"`. Import from `@/lib/prisma`, which wires it with `@prisma/adapter-mariadb` and the `DATABASE_URL`. `prisma.config.ts` (with `import "dotenv/config"`) is required for Prisma 7.
- **DB is MariaDB/MySQL**, set up via Docker and seed SQL in `docs/` (`install_mariadb_with_docker.txt`, `create_table_ecommerce.sql`, `insert_data_ecom_example_50_products.sql`). The schema is app models (product/Category/Order/…) plus better-auth tables (User/Session/Account/Verification). **Table naming**: only the better-auth models carry `@@map` (→ `user`/`session`/`account`/`verification`); the app models have **no** `@@map`, so they map to tables named exactly after the model (e.g. `product`, `Category`, `OrderItem`). Note the `docs/*.sql` scripts use different, plural/lowercase names (`products`, `categories`, `order_items`…) — they're a reference seed, not what Prisma queries.
- **Prisma `Decimal` must be converted to `number` before passing to client components** (see `src/app/(front)/product/page.tsx`).
- **Auth = better-auth**: server instance in `src/lib/auth.ts` (Prisma adapter), client in `src/lib/auth-client.ts`, catch-all route handler at `src/app/api/auth/[...all]/route.ts`. Use `authClient` in client components.
- **Client-side cart** uses zustand (`src/lib/cart-store.ts`).
- **`next/image` is host-allowlisted** in `next.config.ts` (`images.remotePatterns` lists `www.fffuel.co` and `api.codingthailand.com`). Product images are served from external hosts; adding a new hostname requires editing that allowlist or Next throws a domain error.
- **`@/*` → `src/*`** path alias. Code style is unquoted-multi-`"` TypeScript, 4-space indent in `src/lib`.

## Env & setup

- `.env` is gitignored (a local copy exists with real credentials — never commit it). Required vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GEMINI_API_KEY` (placeholder in local env). `src/lib/gemini.ts` reads `GEMINI_API_KEY`.
- The local `DATABASE_URL` points at a Dockerized MariaDB on `localhost:3306`; the Docker build runs `npx prisma generate` before `next build` and copies `generated/` and `prisma/` into the runner image.

## Gotchas

- `CLAUDE.md` is a one-line `@AGENTS.md` import — this file is the single source of truth for instructions; don't create divergent docs elsewhere.
- `src/lib/package.json` is a stray duplicate of the root manifest (identical content) — ignore it; the real package scripts/manifests live at the repo root.
- `.env` is **not** auto-loaded by Prisma itself — it works only because `prisma.config.ts` and `src/lib/prisma.ts` both do `import "dotenv/config"`.
- `generated/prisma/` is a build artifact; don't hand-edit it, regenerate instead.