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
- [code-style.instructions.md](code-style.instructions.md) - Code formatting and style guidelines
- [documentation.instructions.md](documentation.instructions.md) - Documentation standards
- [testing.instructions.md](testing.instructions.md) - Testing patterns and practices
- [security.instructions.md](security.instructions.md) - Security best practices
- [pr-review.instructions.md](pr-review.instructions.md) - PR creation and review guidelines

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

### 3. Consistency
- Follow existing patterns in the codebase
- Use consistent naming conventions
- Maintain uniform code style
- Respect project structure

### 4. Documentation
- Document public APIs
- Explain non-obvious logic
- Include usage examples
- Keep comments up-to-date

## Language Preferences

### JavaScript/TypeScript
- Use TypeScript for type safety
- Prefer modern ES6+ syntax
- Use async/await over callbacks
- 2-space indentation

### Python
- Follow PEP 8 guidelines
- Use type hints
- Prefer f-strings for formatting
- 4-space indentation

### Markdown
- Follow CommonMark spec
- Use relative links for internal files
- Always specify language for code blocks
- Keep lines under 120 characters for readability

## Common Tasks

### Creating New Lessons
- Start with clear learning objectives
- Include practical examples
- Add exercises for practice
- Provide solution code with explanations

### Writing Examples
- Keep examples focused and minimal
- Show both correct and incorrect approaches
- Include comments explaining key concepts
- Test all code before committing

### Next.js App Router
- Use **App Router** (app directory) for all routes
- Leverage **Server Components** by default for better performance
- Use `'use client'` directive only when needed (interactivity, hooks, browser APIs)
- Implement **Server Actions** for form submissions and mutations
- Use **Route Groups** for layout organization without affecting URL structure

### Component Organization
- **Server Components** (default): Data fetching, static content, SEO-critical content
- **Client Components**: Interactive elements, state management, event handlers
- **Shared Components**: Place in `src/components/` directory
- **Page-specific Components**: Colocate with the page in the app directory

### Data Fetching
- Use `async` Server Components for data fetching
- Implement `loading.tsx` for loading states
- Use `error.tsx` for error boundaries
- Cache data appropriately with Next.js caching strategies

### State Management
- Use React hooks (useState, useReducer) for local state
- Context API for global state when needed
- Server Actions for server mutations
- URL state for shareable/bookmarkable state

### File Naming Conventions
- Pages: `page.tsx` (App Router convention)
- Layouts: `layout.tsx` (App Router convention)
- Components: `ComponentName.tsx` (PascalCase)
- Utilities: `utilityName.ts` (camelCase)
- Tests: `ComponentName.test.tsx` or `utilityName.test.ts`

### Routing Patterns
- `/` - Home page
- `/lessons` - Lessons index
- `/lessons/[slug]` - Individual lesson
- `/exercises` - Exercises index
- `/exercises/[slug]` - Individual exercise

### Testing Strategies
- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Critical user journeys (to be added with Playwright)
*To be updated as architecture emerges*

### When Project Structure is Defined:
- Routing patterns
- State management approach
- Data fetching strategies
- Component/module organization
- Testing strategies

## Conventions

### File Naming
- Use `kebab-case` for general files: `lesson-01-intro.md`
- Use `camelCase` for TypeScript/JavaScript: `userService.ts`
- Use `snake_case` for Python: `user_service.py`
- Test files: `*.test.ts` or `test_*.py`

### Import Order
1. External dependencies
2. Internal modules
3. Types/interfaces
4. Relative imports

```typescript
// External
import React from 'react';
import { useState } from 'react';

// Internal
import { UserService } from '@/services/UserService';

// Types
import type { User } from '@/types';

// Relative
import { Button } from './Button';
```

### Commit Messages
Follow Conventional Commits format:
```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Error Handling

### Always Handle Errors
```typescript
// Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // Re-throw after logging
  }
}
```

### Provide Helpful Error Messages
```typescript
// Good: Specific, actionable
throw new Error(`User with ID ${userId} not found. Please check the ID and try again.`);

// Bad: Generic, unhelpful
throw new Error('Error');
```

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
