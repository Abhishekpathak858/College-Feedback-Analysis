# AGENTS.md

Instructions and architectural guidelines for AI coding agents working on this project.

## Code Conventions
- Use standard React Functional Components with hooks.
- Use `@/` alias for all imports inside `src/`.
- Maintain clean Tailwind utility classes and avoid inline styles.
- Components in `src/components/ui/` adhere to Shadcn UI patterns.
- Data fetching uses `@tanstack/react-query` or `@/api/base44Client.js`.

## Domain Entities
- `Feedback`: Represents a feedback entry submitted by a student or user. Contains ratings, comments, sentiment analysis tags, department, category, and timestamps.
- `User`: Represents students, faculty, and administrators with roles and department affiliations.
