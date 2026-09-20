# PostgreSQL Migration Agent Rules

## 1. Mission

Migrate the existing Car Rental project from MongoDB/Mongoose to PostgreSQL/Prisma without breaking the existing application behavior.

The migration must preserve the existing frontend/backend API contract wherever practical. Do not redesign the application, change the UI, switch frameworks, or introduce unrelated features unless explicitly required by `task.md`.

## 2. CRITICAL: Protect the Original Codebase

The original checkout/codebase must remain untouched.

### Mandatory workflow
1. Do NOT edit files in the original working tree.
2. Before making any source-code change, create a separate working copy or Git worktree outside the original checkout.
3. Preferred worktree name:
   `../car-rental-postgresql-migration`
4. Preferred branch name:
   `migration/postgresql-prisma`
5. All migration work, generated files, package changes, schema changes, tests, and commits must happen only in that separate worktree/branch.
6. Never run destructive commands against the original checkout.
7. Never overwrite, reset, clean, or delete the original checkout.
8. Do not delete the MongoDB implementation from the original project.
9. Keep the original MongoDB implementation available until the PostgreSQL version has been validated.

If a separate worktree cannot be created, STOP before editing and report the exact blocker.

## 3. Git Safety

Before editing:
- Check `git status`.
- Check the current branch.
- Record the original commit SHA.
- Create/use only the migration branch/worktree described above.

Never use these commands on the original checkout:
- `git reset --hard`
- `git clean -fd`
- `git checkout -- .`
- `git restore .`
- force pushes
- destructive file deletion

Commit meaningful milestones in the migration worktree. Do not rewrite existing project history.

## 4. Scope

### In scope
- MongoDB -> PostgreSQL migration
- Mongoose -> Prisma migration
- PostgreSQL schema design
- Prisma migrations
- Prisma database client/configuration
- Conversion of MongoDB-specific controller/service/repository logic
- Conversion of MongoDB-specific query/filter/sort/populate logic
- Transaction conversion to Prisma/PostgreSQL transactions
- ID/relationship adjustments required by the database migration
- Environment variable changes required for PostgreSQL
- Tests and API verification
- Small bug fixes that are directly required for the migration to work correctly
- Documentation of migration progress in `memory.md`

### Out of scope unless explicitly requested
- Switching React to Angular
- Rewriting the UI
- Replacing Express/Node.js
- Rebuilding the project from scratch
- Large feature additions unrelated to the migration
- Unrelated refactoring
- Changing the product/business logic merely for style/preferences
- Removing working functionality without a migration reason

## 5. Preserve API Compatibility

Keep existing API routes, HTTP methods, response intent, authentication behavior, and frontend expectations unchanged unless a change is technically necessary.

If a response field changes because PostgreSQL/Prisma uses `id` instead of MongoDB `_id`, prefer updating the frontend/backend contract in a controlled way and document every affected endpoint.

Do not silently change field names, status values, or business rules.

## 6. Database Design Rules

Use PostgreSQL relational design rather than trying to imitate MongoDB documents.

Expected core entities include:
- User
- Car
- Booking
- Review
- Payment
- FavoriteCar/junction relation

Use:
- Primary keys
- Foreign keys
- Unique constraints where appropriate
- Appropriate indexes
- Explicit relation fields
- Enums for stable status/role values where appropriate
- Timestamps

Avoid duplicated data unless it is intentionally part of the existing business logic or required for an external integration.

## 7. Prisma Rules

- Use Prisma as the ORM/data-access layer.
- Keep the Prisma schema as the source of truth for the PostgreSQL structure.
- Use Prisma migrations for schema changes.
- Do not mix Mongoose and Prisma in production paths after a module has been migrated and validated.
- Keep database access centralized through the Prisma client/configuration layer.
- Use transactions for multi-step operations that must be atomic.

## 8. Known Migration Issues to Validate

The agent must verify and resolve these issues rather than blindly translating code:

### Booking statuses
Current project code has inconsistent booking statuses such as:
- Pending
- Confirmed
- Approved
- Rejected
- Completed
- Cancelled

Some controller/dashboard paths also use lowercase values.

Create one canonical status representation and update all affected code consistently. Document the final set in `memory.md`.

### Host fields/role
Host-related code references host-specific fields and the `host` role. Validate the current User model and controller assumptions before creating the Prisma schema.

### Payment/Booking relation
Payment flow references booking/payment relationships that must be represented explicitly in PostgreSQL. Validate all payment fields and relations before migrating.

### Frontend `_id` assumptions
The frontend currently contains MongoDB-style `_id` expectations in some areas. Search globally for `_id`, `ObjectId`, `mongoose`, and Mongo-specific operators before deciding the final compatibility strategy.

## 9. Search Before Edit

Before changing a model/controller:
1. Find every place the model is imported.
2. Find every field used by controllers, services, routes, and frontend.
3. Search for all status values.
4. Search for `_id`, `ObjectId`, `populate`, `$regex`, `$in`, `$or`, `$and`, `.findById`, `.findOne`, `.find`, `.findByIdAndUpdate`, `.findByIdAndDelete`, Mongoose sessions, and Mongo-specific operators.
5. Record dependencies before changing the schema.

Do not migrate one file in isolation if other files depend on its behavior.

## 10. Validation Rules

After each major migration phase:
- Run formatting/linting if configured.
- Run tests if available.
- Start the backend and verify database connection.
- Exercise the relevant API endpoints.
- Verify authentication flows.
- Verify booking conflict/transaction behavior.
- Verify payment flow where safely testable.
- Verify reviews/favorites/dashboard functionality.
- Check the frontend for `_id`/`id` regressions.

Do not declare a phase complete based only on compilation.

## 11. Data Migration

Do not overwrite or destroy existing MongoDB data.

Before any real data migration:
- Determine whether source MongoDB data exists.
- Define source-to-target field mappings.
- Define ID strategy.
- Define handling for missing/invalid references.
- Create a reversible/exportable migration process where practical.

Never drop MongoDB collections or PostgreSQL tables just to make a migration script pass.

## 12. Environment and Secrets

- Never hard-code credentials.
- Never commit real passwords, API keys, JWT secrets, Razorpay secrets, Cloudinary credentials, Firebase keys, or database passwords.
- Add/update `.env.example` rather than committing real `.env` values.
- Treat existing `.env` files as secrets.

## 13. Error Handling

Preserve meaningful error messages and HTTP status behavior where possible.

Do not expose raw SQL, stack traces, credentials, or database internals to clients.

## 14. Documentation / Memory Requirement

`memory.md` is the migration log and must be updated after each completed task.

Each update must include:
- Date/time
- Task completed
- Files changed
- Database/schema changes
- API changes, if any
- Tests/verification performed
- Known issues
- Next recommended task

Do not erase previous history. Append progress chronologically.

## 15. Completion Criteria

The migration is complete only when:
- PostgreSQL is the active database.
- Prisma is the active database layer.
- Required MongoDB/Mongoose runtime dependencies and code paths are removed from the migrated application.
- All major application flows have been tested.
- Existing functionality is preserved or any intentional behavior changes are documented.
- Environment documentation is updated.
- `task.md` reflects completed/pending work.
- `memory.md` contains a complete migration history.
- The original checkout remains untouched and recoverable.

## 16. Agent Behavior

When uncertain:
- Inspect first.
- Search all dependents.
- Prefer the smallest safe change.
- Do not guess schema fields or business rules.
- Document uncertainty in `memory.md`.
- Do not stop at the first compile error; trace the dependency chain and fix the root cause.

The agent must provide a concise final report containing:
1. What was changed.
2. What was verified.
3. What remains.
4. Where the migration worktree/branch is located.
5. Any commands needed to run the migrated project.
