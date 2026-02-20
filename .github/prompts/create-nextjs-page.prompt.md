---
agent: 'agent'
name: create-nextjs-page
description: Create a new Next.js App Router page aligned with project structure and styling.
---
You are creating a new Next.js page using the App Router in this repository. Follow these instructions:

Goals
- Create a new page route using app directory conventions.
- Align layout, styling, and components with the existing app.
- Use current Next.js APIs and avoid deprecated patterns.

Project context
- App Router is used with src/app/.
- Prefer Server Components by default.
- Use 'use client' only when required (hooks, browser APIs, interactivity).
- Shared components live in src/components/ and src/components/ui/.
- Global styling is defined in src/app/globals.css.

Requirements
- Create page files at src/app/<route>/page.tsx.
- Update navigation sidebar to have a link to the new page with an appropriate icon.
- Use semantic HTML and accessible patterns (headings, labels, aria when needed).
- Match the design system: consistent spacing, typography, borders, and colors.
- Keep components small; extract reusable pieces to src/components/ when helpful.
- Avoid deprecated Next.js APIs and legacy React patterns.
- Add basic tests for the new page if applicable, but focus on the page implementation first.
- Each page should have a header section with a badge and title:
```
<section className="space-y-4">
  <Badge className="w-fit" variant="secondary">
    Lessons
  </Badge>
  <div>
    <h1 className="text-4xl font-semibold">Course lessons</h1>
    <p className="mt-2 text-lg text-muted-foreground">
      SHORT DESCRIPTION OF THE PAGE CONTENT AND PURPOSE.
    </p>
  </div>
</section>
```

Process
1) Determine the route path and create the page in src/app/.
2) Decide if the page can be a Server Component (default) or needs 'use client'.
3) Use existing UI components where possible; add minimal new ones if needed.
4) Add data fetching with async Server Components or server utilities when appropriate.
5) Add basic error handling for async work and validate any user input.

Quality checklist
- No deprecated APIs or unused imports.
- Consistent Tailwind classes with existing pages.
- Clear, descriptive component and variable names.
- Accessible markup with keyboard-friendly elements.

When responding
- Ask is the page has table or details form.
- Ask if the page needs to fetch data.
- Ask if the page needs to modify data.
- Summarize changes and cite modified files.
- If you did not run tests, list suggested commands (npm run lint, npm run build).
