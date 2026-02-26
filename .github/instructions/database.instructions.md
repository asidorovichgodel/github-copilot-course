# Database Instructions (PostgreSQL)

Use these rules for all database work in this repository.

## Naming Conventions

- Use plural nouns for table names (e.g., `users`, `roles`, `user_roles`).
- Use `snake_case` for table and column names.
- Use `snake_case` for indexes and constraints, prefixed by table name (e.g., `users_email_key`).

## Schema Design

- Include `id` as the primary key for all tables.
- Use `created_at` and `updated_at` timestamps for auditable tables.
- Prefer join tables for many-to-many relationships (e.g., `user_roles`).
- Use `NOT NULL` for required fields.
- Avoid storing derived or redundant data unless necessary.

## Data Types

- Use `uuid` or `text` for identifiers (match existing schema).
- Use `timestamp` with time zone for timestamps when possible.
- Use `text` for variable-length strings unless a hard limit is required.

## Indexing

- Add unique constraints for natural keys (e.g., `users.email`).
- Index foreign keys used in joins.
- Avoid over-indexing; add indexes based on query patterns.

## Migrations

- Keep migrations small and focused.
- Avoid data-destructive changes without a clear migration path.
- Ensure migrations preserve naming conventions and consistency.

## Security

- Never store plain text passwords; store a secure hash.
- Use parameterized queries or ORM methods to avoid SQL injection.
- Validate and sanitize inputs on the server side.
