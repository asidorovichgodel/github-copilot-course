# GitHub Copilot Instructions

This is the main instruction file for GitHub Copilot in this repository. Follow these guidelines when generating code, documentation, or suggestions.

## Project Overview

This is a GitHub Copilot course repository focused on teaching effective AI-assisted development. The project emphasizes:

- **Education**: Clear, well-documented examples
- **Best Practices**: Following industry-standard patterns
- **Accessibility**: Beginner-friendly content with progressive complexity
- **Practical Examples**: Real-world scenarios and use cases

## Quick Reference

For detailed instructions by category, see:

- [nextjs.instructions.md](nextjs.instructions.md) - Next.js best practices and patterns (App Router, caching, components)
- [code-style.instructions.md](code-style.instructions.md) - Code formatting and style guidelines
- [documentation.instructions.md](documentation.instructions.md) - Documentation standards
- [testing.instructions.md](testing.instructions.md) - Testing patterns and practices
- [security.instructions.md](security.instructions.md) - Security best practices (input validation, secrets, XSS, CSRF, rate limiting)
- [database.instructions.md](database.instructions.md) - Database conventions, schema design, and Prisma/SQL patterns
- [cicd.instructions.md](cicd.instructions.md) - CI/CD pipelines and GitHub Actions best practices
- [pr-review.instructions.md](pr-review.instructions.md) - PR creation and review guidelines

> **Package Versions & API Docs**: Always use **Context7 MCP** (`use context7`) when installing, updating, or asking about any npm package. See [Package Management](#package-management) below.

## GitHub Copilot Customization

This repository includes custom agents, instructions, and prompts to enhance the development experience.

### Custom Agents (`.github/agents/`)

Custom agents are specialized assistants invoked with `@` in GitHub Copilot Chat:

- **@nextjs-expert** ([nextjs-expert.agent.md](../agents/nextjs-expert.agent.md)) - Expert in modern Next.js development with App Router, best practices, performance optimization, and cutting-edge patterns. Use when you need guidance on:
  - Next.js 14+ App Router architecture
  - Server Components vs Client Components decisions
  - Data fetching and caching strategies
  - Server Actions and form handling
  - Performance optimization techniques
  - Modern tooling and library recommendations (Zod, TanStack Query, Zustand, shadcn/ui)
  - TypeScript patterns for Next.js
  - Testing strategies and deployment

**Usage:** Type `@nextjs-expert` in Copilot Chat, then describe your question or task.

### Reusable Prompts (`.github/prompts/`)

Prompts are templates for common development tasks invoked with `#` in Copilot Chat:

- **#create-nextjs-page** ([create-nextjs-page.prompt.md](../prompts/create-nextjs-page.prompt.md)) - Scaffold new Next.js App Router pages following project conventions. Automatically handles routing, styling, and navigation integration.

- **#add-shadcn-component** ([add-shadcn-component.prompt.md](../prompts/add-shadcn-component.prompt.md)) - Add shadcn/ui components to the project with proper configuration and styling alignment.

**Usage:** Type `#create-nextjs-page` or `#add-shadcn-component` in Copilot Chat, followed by your specific request.

## Build & Test Commands

- **Development**: `npm run dev` - Start Next.js development server at http://localhost:3000
- **Build**: `npm run build` - Create production build
- **Start**: `npm start` - Start production server
- **Lint**: `npm run lint` - Run ESLint to check for code issues
- **Lint Fix**: `npm run lint:fix` - Automatically fix linting issues
- **Format**: `npm run format` - Format code with Prettier
- **Format Check**: `npm run format:check` - Check code formatting without making changes
- **Type Check**: `npm run type-check` - Run TypeScript compiler to check types
- **Test**: `npm test` - Run Jest tests
- **Test Watch**: `npm run test:watch` - Run tests in watch mode
- **Test Coverage**: `npm run test:coverage` - Generate test coverage report
- **Audit**: `npm run audit` - Check for security vulnerabilities
- **Audit Fix**: `npm run audit:fix` - Automatically fix security vulnerabilities

## Package Management

**Always use Context7 MCP** (`use context7`) in the following situations:

### When to use Context7

- **Installing a new package** — Before adding any npm dependency, use Context7 to fetch the latest version, API surface, and official usage examples for that package.
- **Updating an existing package** — Before bumping a version in `package.json`, use Context7 to check changelogs, breaking changes, and migration notes for the target version.
- **API signatures & usage questions** — When unsure how to call a function, configure a library, or use a specific feature of any dependency, use Context7 to retrieve up-to-date, accurate documentation for that package.

### Rules

- Never rely on training-data knowledge alone for package versions or API details — library APIs evolve rapidly.
- Always resolve the **exact latest stable version** via Context7 before suggesting a version pin.
- Prefer Context7 over web search for package-specific documentation — it returns structured, version-pinned content directly from official docs/source.

### Example workflow

```
// 1. User asks to add Zustand
use context7 to get latest version and setup guide for zustand

// 2. User asks how to use useFormStatus from react-dom
use context7 to get the useFormStatus API signature and examples

// 3. User asks to upgrade @tanstack/react-query from v4 to v5
use context7 to get react-query v5 migration guide and breaking changes
```

---

## Project Structure

The project follows [Vercel's recommended Next.js structure](https://nextjs.org/docs/app/getting-started/project-structure).

```
.
├── .github/              # GitHub configuration and instructions
│   ├── workflows/        # CI/CD workflows
│   ├── agents/           # Copilot custom agent definitions
│   ├── instructions/     # Copilot instruction files
│   ├── prompts/          # Copilot reusable prompt templates
├── src/                  # Next.js application source (follows Vercel pattern)
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   │   ├── (_api)/   # Private route group for organizing API
│   │   │   │   └── _lib/ # Colocated API handlers (private)
│   │   │   └── [routes]/ # API endpoint routes
│   │   ├── lessons/      # Lessons pages
│   │   ├── layout.tsx    # Root layout with navigation
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles with Tailwind
│   │
│   ├── lib/              # ✨ Shared utilities (Vercel pattern)
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── errors.ts     # Error handling
│   │   ├── constants.ts  # Application constants
│   │   ├── helpers.ts    # Utility functions
│   │   ├── validation.ts # Input validation
│   │   ├── server/       # Server-specific utilities
│   │   └── index.ts      # Barrel exports
│   │
│   ├── _services/        # Private: Business logic layer
│   │   ├── *.Service.ts  # Service implementations
│   │   └── index.ts      # Exports
│   │
│   ├── _repositories/    # Private: Data access layer
│   │   ├── *.Repository.ts # Repository implementations
│   │   └── index.ts      # Exports
│   │
│   ├── components/       # Shared React components
│   └── ...
│
├── public/               # Static assets
├── PROJECT_STRUCTURE.md  # Quick reference guide
├── VERCEL_STRUCTURE.md   # Detailed structure documentation
├── MIGRATION_GUIDE.md    # What changed from previous structure
├── docs/                 # Project documentation
├── lessons/              # Lesson content markdown files
├── exercises/            # Practice exercises
└── tests/                # Test files (collocated with source)
```

### Key Directory Purposes

- **`src/lib/`** - Shared utilities, types, errors (Vercel recommended pattern)
- **`src/_services/`** - Business logic (private folder, non-routable)
- **`src/_repositories/`** - Data access (private folder, non-routable)
- **`src/app/api/(_api)/_lib/`** - API handlers colocated near routes

## Code Generation Principles

### 1. Educational Value

- Prioritize clarity over cleverness
- Add explanatory comments for complex concepts
- Provide context and reasoning
- Show multiple approaches when helpful

### 2. Production Quality

- Write code that's ready for real-world use
- Include proper error handling
- Add input validation
- Consider edge cases
- See [security.instructions.md](security.instructions.md) for security guidelines
- See [testing.instructions.md](testing.instructions.md) for testing standards

### 3. Consistency

- Follow existing patterns in the codebase
- Use consistent naming conventions — see [code-style.instructions.md](code-style.instructions.md)
- Maintain uniform code style
- Respect project structure

### 4. Documentation

- Document public APIs
- Explain non-obvious logic
- Include usage examples
- Keep comments up-to-date
- See [documentation.instructions.md](documentation.instructions.md) for detailed documentation standards

## Language Preferences

> Detailed code style rules (naming conventions, formatting, async patterns, error handling) are defined in [code-style.instructions.md](code-style.instructions.md). For Next.js-specific patterns (App Router, Server/Client Components, data fetching, caching, etc.), refer to [nextjs.instructions.md](nextjs.instructions.md).

### Key Defaults

- **TypeScript** for all JS/TS files — strict types, modern ES6+, async/await, 2-space indentation
- **Markdown**: CommonMark spec, relative links, language tags on code blocks, max 120 chars/line

## Conventions

### File Naming

> Full naming conventions are defined in [code-style.instructions.md](code-style.instructions.md) and [nextjs.instructions.md](nextjs.instructions.md).

- **General files**: `kebab-case` (e.g., `lesson-01-intro.md`)
- **Components**: `PascalCase` (e.g., `UserCard.tsx`)
- **Utilities/services**: `camelCase` (e.g., `userService.ts`)
- **Test files**: `*.test.ts` or `*.test.tsx`

### Import Order

> See [code-style.instructions.md](code-style.instructions.md) for import ordering rules with examples.

1. External dependencies
2. Internal modules
3. Types/interfaces
4. Relative imports

### Commit Messages

Follow Conventional Commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Error Handling

> Detailed error handling patterns and examples are defined in [code-style.instructions.md](code-style.instructions.md) and [security.instructions.md](security.instructions.md).

- Always handle errors explicitly with try/catch
- Provide meaningful, actionable error messages
- Log errors with context; avoid silent failures
- Fail fast for invalid inputs

## Performance Considerations

- Avoid premature optimization
- Profile before optimizing
- Cache expensive computations
- Use appropriate data structures
- Clean up resources (listeners, timers, connections)

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Provide alt text for images
- Maintain sufficient color contrast

## Notes for Contributors

When updating this file:

1. Keep instructions concise and actionable
2. Provide examples for clarity
3. Update related instruction files
4. Test suggestions with GitHub Copilot
5. Get feedback from users

---

**For AI Assistants**: These instructions guide code generation, documentation, and suggestions. Prioritize the principles and patterns defined here. When in doubt, prefer clarity and educational value over brevity.
