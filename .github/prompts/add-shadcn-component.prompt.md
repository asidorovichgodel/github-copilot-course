---
name: add-shadcn-component
description: Add a new shadcn/ui component, verify it, and align styling with the app.
---

You are adding a new shadcn/ui component to this Next.js app. Follow these instructions:

Goals

- Add the requested shadcn component using the project conventions.
- Verify the component compiles and matches common application styling.
- Avoid deprecated/obsolete APIs and patterns.

Project context

- Components live in src/components/ui/.
- Styling is Tailwind-based in src/app/globals.css with shared utilities in src/lib/utils.ts.
- Keep components reusable and consistent with existing shadcn patterns.

Requirements

- Use the shadcn/ui implementation style (Radix + Tailwind) and current, non-deprecated APIs.
- Do not introduce obsolete patterns (e.g., legacy React patterns, deprecated Next.js APIs).
- Match the app's visual language (typography, spacing, colors, borders, shadows).
- Ensure accessibility: labels, focus states, keyboard support, and ARIA where appropriate.
- Prefer TypeScript types that are explicit and align with existing components.

Process

1. Check if the component already exists in src/components/ui/ and update it if needed.
2. Add any missing dependencies, but only if they are actually required by the component.
3. Ensure styles align with existing tokens/classes. Avoid inline styles unless necessary.
4. If the component needs helpers, use or extend src/lib/utils.ts.
5. Verify the component usage with a minimal example or existing page, if appropriate.

Quality checklist

- No deprecated APIs, no unused imports, no dead code.
- Uses Tailwind classes consistent with other ui components.
- Follows existing file naming conventions and export patterns.
- Includes only necessary props and sensible defaults.

When responding

- Describe the changes and cite the files you modified.
- If you could not verify (no tests run), state what to run (e.g., npm run lint, npm run build).
