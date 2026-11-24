# Library Management System

Full-stack Library Management System built with NestJS, TypeScript, Prisma ORM, and PostgreSQL.

## Project Structure

- `api/` — NestJS backend API, Prisma schema, migrations, and seed script.

## Getting Started (`api/`)

1. Install dependencies:

       cd api
       npm install

2. Configure environment variables:

   Copy `api/.env.example` to `api/.env` and set your PostgreSQL `DATABASE_URL`.

3. Generate the Prisma client, run migrations, and seed the database:

       npx prisma generate
       npx prisma migrate dev --name init
       npx prisma db seed

4. Start the API server:

       npm run start:dev

## Schema Decisions

- **Role Enum (`PATRON`, `LIBRARIAN`) on `User`:** Enforces valid user roles at the PostgreSQL level instead of accepting arbitrary strings. New accounts default to `PATRON` (least privilege), while `email` is unique for authentication and `passwordHash` stores hashed credentials rather than plaintext passwords.
- **Separate `Genre` Table with Unique `name` and `slug`:** Normalizing genres into a dedicated model prevents inconsistent category spelling (e.g., `"Fiction"` vs. `"fiction"`), enables fast category listings, and provides a URL-safe `slug` for future REST routes and frontend filters.
- **One-to-Many `Genre` -> `Book` Relationship (`genreId` Foreign Key):** Each `Book` references `Genre` via `genreId` with `@relation(fields: [genreId], references: [id], onDelete: Restrict)` and `@@index([genreId])`. `Restrict` prevents accidentally deleting a genre that still contains books, and the index speeds up genre-filtered catalog queries.
- **Unique `isbn` and Explicit Inventory Counters (`totalCopies`, `availableCopies`):** Enforcing `@unique` on `isbn` prevents duplicate catalog records, while separating `totalCopies` from `availableCopies` prepares the catalog for future borrow-request and return transactions without recalculating stock from scratch.
- **Auto-Incrementing Integer Primary Keys & Timestamps:** Using `Int @id @default(autoincrement())` keeps foreign keys compact and URLs readable, while `createdAt` and `updatedAt` fields provide basic audit tracking across all models.
- **Prisma 7 Driver Adapter (`prisma7.config.ts` + `@prisma/adapter-pg`):** Keeps database connection strings out of `schema.prisma` and connects `PrismaService` using `pg.Pool` with CommonJS output (`moduleFormat = "cjs"`) for full compatibility with NestJS.
