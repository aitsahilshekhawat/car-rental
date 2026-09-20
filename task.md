# Car Rental: MongoDB -> PostgreSQL Migration Task Plan

## Objective

Migrate the Car Rental application from MongoDB/Mongoose to PostgreSQL/Prisma while preserving existing application behavior and keeping the original codebase untouched.

## Working Location

All work must happen in a separate Git worktree/copy:

`../car-rental-postgresql-migration`

Suggested branch:

`migration/postgresql-prisma`

The original checkout must remain untouched.

---

# Phase 0 — Safety and Baseline

### Task 0.1 — Create isolated migration worktree
- Check current Git status.
- Record current branch and commit SHA.
- Create the migration branch/worktree.
- Confirm all subsequent commands operate inside the migration worktree.

**Deliverable:** isolated migration workspace.

### Task 0.2 — Establish baseline
- Install/run the current project if required.
- Record package versions.
- Run available tests/lint/build.
- Confirm current MongoDB-backed application behavior as much as practical.

**Deliverable:** baseline recorded in `memory.md`.

---

# Phase 1 — Full Dependency and Data-Model Audit

### Task 1.1 — Audit MongoDB usage
Search the entire project for:
- mongoose
- ObjectId
- `_id`
- `populate`
- MongoDB operators such as `$regex`, `$in`, `$or`, `$and`, `$gte`, `$lte`
- `.find`, `.findOne`, `.findById`
- `.findByIdAndUpdate`
- `.findByIdAndDelete`
- MongoDB sessions/transactions
- `express-mongo-sanitize`

### Task 1.2 — Audit relational dependencies
Map:
- User -> Cars
- User -> Bookings
- User -> Reviews
- User -> Payments
- User -> Favorites
- Car -> Bookings
- Car -> Reviews
- Booking -> Payment

### Task 1.3 — Audit frontend database assumptions
Find every `_id`/Mongo-specific field assumption in the frontend.

### Task 1.4 — Audit inconsistencies
Explicitly identify:
- booking-status inconsistencies
- host role/host field inconsistencies
- payment/booking field mismatches
- duplicate or conflicting business rules

**Deliverable:** audit findings recorded in `memory.md`.

---

# Phase 2 — PostgreSQL + Prisma Foundation

### Task 2.1 — Install dependencies
Add the PostgreSQL/Prisma dependencies required by the current supported Prisma PostgreSQL setup.

### Task 2.2 — Initialize Prisma
Create:
- `prisma/schema.prisma`
- Prisma client configuration
- PostgreSQL `DATABASE_URL` support

### Task 2.3 — Design relational schema
Create models for the project's actual domain, based on Phase 1 findings.

Include:
- primary keys
- foreign keys
- unique constraints
- indexes where useful
- enums for stable status/role fields
- timestamps
- explicit relations

### Task 2.4 — Define canonical business statuses
Normalize booking/payment/user role status representations.

Do not invent business behavior. Base the final values on existing application behavior and document any required decision.

### Task 2.5 — Create first migration
Create and apply the initial Prisma migration to the development PostgreSQL database.

**Deliverable:** working PostgreSQL schema + Prisma client.

---

# Phase 3 — Database Infrastructure

### Task 3.1 — Create Prisma client module
Centralize database access.

### Task 3.2 — Replace MongoDB startup dependency
Update server startup/configuration to connect through Prisma/PostgreSQL.

### Task 3.3 — Environment configuration
Update `.env.example` with:
- `DATABASE_URL`

Keep real credentials out of source control.

### Task 3.4 — Remove obsolete runtime dependency only when safe
Do not immediately delete all MongoDB dependencies if migration is still in progress. Remove them module-by-module after replacement is verified.

**Deliverable:** application can start with PostgreSQL configured.

---

# Phase 4 — Migrate User and Authentication Data Access

### Task 4.1 — User model
Convert the User data model to Prisma.

### Task 4.2 — Authentication controllers/services
Migrate:
- signup
- login
- password reset
- profile lookup/update
- role handling
- Google/phone auth flows where applicable

### Task 4.3 — Preserve auth behavior
Keep:
- JWT behavior
- cookies/tokens
- password hashing
- existing route contracts

**Deliverable:** authentication works on PostgreSQL.

---

# Phase 5 — Migrate Cars

### Task 5.1 — Car schema
Create/verify the Car model and User -> Car relation.

### Task 5.2 — Convert car APIs
Migrate:
- create
- read/list
- search
- filters
- sorting
- update
- delete

### Task 5.3 — Convert Mongo-specific query behavior
Replace regex/operator/populate logic with Prisma/PostgreSQL equivalents while preserving behavior.

**Deliverable:** all car management APIs work on PostgreSQL.

---

# Phase 6 — Migrate Reviews and Favorites

### Task 6.1 — Reviews
Migrate review create/read/update/delete and rating calculations.

### Task 6.2 — Favorites
Migrate favorites to a relational junction table if appropriate.

### Task 6.3 — Constraints
Add uniqueness/foreign-key protections to prevent invalid duplicate relations.

**Deliverable:** reviews and favorites work end-to-end.

---

# Phase 7 — Migrate Bookings

### Task 7.1 — Booking schema
Implement User -> Booking and Car -> Booking relations.

### Task 7.2 — Booking APIs
Migrate all booking create/read/update/cancel/admin/host flows.

### Task 7.3 — Booking conflict logic
Preserve the existing overlap/conflict rules for pickup/return dates.

### Task 7.4 — Transaction conversion
Replace MongoDB sessions/transactions with Prisma/PostgreSQL transactions.

### Task 7.5 — Status consistency
Use the single canonical booking-status representation everywhere.

**Deliverable:** complete booking workflow works on PostgreSQL.

---

# Phase 8 — Migrate Payments

### Task 8.1 — Payment schema
Create explicit User, Booking, and Car relations as required by the current payment flow.

### Task 8.2 — Razorpay integration
Keep Razorpay integration behavior unchanged except for database persistence code.

### Task 8.3 — Payment transaction flow
Convert MongoDB transaction logic to Prisma transaction logic.

### Task 8.4 — Payment/Booking relation
Resolve the existing payment/booking field mismatch cleanly.

**Deliverable:** payment persistence and booking creation/update flow work correctly.

---

# Phase 9 — Dashboard / Admin / Host Flows

Migrate all remaining database access used by:
- user dashboard
- admin dashboard
- host dashboard
- profile pages
- analytics/count queries
- booking history
- payment history

Verify role-based authorization still behaves correctly.

**Deliverable:** all dashboards function against PostgreSQL.

---

# Phase 10 — Frontend Compatibility

### Task 10.1 — `_id` -> `id`
Update frontend assumptions only where required by the migrated API.

### Task 10.2 — API response verification
Ensure the frontend receives the fields it expects.

### Task 10.3 — Booking/payment flow
Verify real API state rather than relying on stale/local MongoDB assumptions.

**Deliverable:** frontend works end-to-end with PostgreSQL backend.

---

# Phase 11 — Data Migration (Only If Existing Data Must Be Preserved)

### Task 11.1 — Define source/target mapping
Document every collection-to-table and field-to-field mapping.

### Task 11.2 — Build non-destructive migration script
The script must:
- never delete MongoDB data
- report invalid references
- preserve valid relationships
- produce useful counts/logs

### Task 11.3 — Validate counts and relations
Compare MongoDB source counts with PostgreSQL target counts.

Do not run destructive cleanup.

**Deliverable:** repeatable MongoDB -> PostgreSQL data migration procedure.

---

# Phase 12 — Remove MongoDB Runtime Dependencies

Only after all PostgreSQL flows are validated:

### Task 12.1
Remove migrated Mongoose models and database connection code from the migration branch.

### Task 12.2
Remove no-longer-used MongoDB packages.

### Task 12.3
Remove MongoDB-specific middleware if no longer required.

### Task 12.4
Run a global search again to find remaining MongoDB references.

**Deliverable:** migrated application runs without MongoDB runtime dependency.

---

# Phase 13 — Final Validation

Run, where available:
- unit tests
- integration/API tests
- lint
- type checking
- production build
- backend startup
- frontend startup

Manually verify:
- registration/login
- profile
- car listing/search/filter
- favorites
- reviews
- booking
- booking cancellation/status change
- payment flow
- dashboards
- admin/host flows

Verify there are no hidden `_id`/ObjectId/Mongoose references.

**Deliverable:** final migration report.

---

# Phase 14 — Documentation

Update:
- `README` or deployment/setup docs if required
- `.env.example`
- `memory.md`
- `task.md` checkboxes/statuses

`memory.md` must contain the complete chronological migration history.

---

# Definition of Done

The migration is complete only when all of the following are true:

- [x] Original checkout untouched
- [x] Migration branch/worktree used exclusively
- [x] PostgreSQL configured
- [x] Prisma configured
- [x] Prisma migration exists
- [x] User/auth migrated
- [x] Cars migrated
- [x] Reviews migrated
- [x] Favorites migrated
- [x] Bookings migrated
- [x] Payments migrated
- [x] Dashboards migrated
- [x] Frontend PostgreSQL compatibility verified
- [x] Data migration completed if required
- [x] MongoDB runtime dependencies removed from migrated code
- [x] Tests/build/lint checked
- [x] No secrets committed
- [x] `memory.md` fully updated
- [x] Final migration report written
