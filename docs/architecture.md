# Architecture plan

## Stack decisions
- Next.js App Router for fast product iteration and server/client boundaries.
- TypeScript for predictable shared models and safer refactors.
- Prisma + PostgreSQL for a relational core.
- Supabase Auth as the eventual identity layer.
- Tailwind CSS and a lightweight component system for fast UI iteration.
- Zustand for future client state, while the first milestone uses typed mock data.

## Folder structure
- app/ — route-level screens and API endpoints.
- components/ — shared UI primitives.
- features/ — domain-specific experience modules.
- hooks/ — reusable client hooks.
- lib/ — shared utilities and data access.
- services/ — API and persistence adapters.
- types/ — domain types and contracts.
- prisma/ — schema and migrations.

## Data model strategy
The first milestone emphasizes the core entities required for planning and self-management:
- User
- Task
- Project
- Habit
- HabitLog
- Event
- Goal
- Milestone
- Budget
- Transaction
- Category

## Authentication strategy
- Use Supabase Auth for production sign-in.
- Keep a demo session abstraction in the app shell so the experience is testable without a live backend.
- Protect future authenticated routes via a shared server helper.
