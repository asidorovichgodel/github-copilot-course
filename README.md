# GitHub Copilot Course

A comprehensive course for learning GitHub Copilot and AI-assisted development through a real Next.js project (CV extraction app).

---

## 📋 Table of Contents

1. [App Overview](#-app-overview)
2. [Prompt History (Key Steps)](#-prompt-history-key-steps)
3. [Tools, Models & MCP Used](#-tools-models--mcp-used)
4. [Insights & Recommendations](#-insights--recommendations)
5. [Getting Started](#-getting-started)
6. [Project Structure & Architecture](#-project-structure--architecture)
7. [AI Agent Readiness](#-ai-agent-readiness)
8. [Key Integrations](#-key-integrations)
9. [Testing](#-testing)
10. [GitHub Copilot Customization](#-github-copilot-customization)

---

## 🧩 App Overview

This repository contains resources, exercises, and examples for learning how to effectively use GitHub Copilot and other AI agents in your development workflow.

The course project is a **CV Extraction & Candidate Management** application built with **Next.js 16 (App Router)**. It turns uploaded PDF CVs into structured candidate profiles stored in a relational database, managed through an admin dashboard.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database ORM | Prisma 6 + PostgreSQL |
| Authentication | NextAuth.js v4 |
| AI / LLM | OpenAI API (GPT-4.1) |
| PDF Parsing | pdfjs-dist |
| Client State | Zustand |
| Server State | TanStack React Query v5 |
| Validation | Zod v4 |
| Forms | React Hook Form |
| UI Components | Radix UI + shadcn/ui + Tailwind CSS v4 |
| Testing | Jest + React Testing Library + Playwright |

### Core Workflow

1. Admin uploads a CV in PDF format via the dashboard.
2. The file is sent to a server API endpoint and saved to disk.
3. The PDF is parsed with `pdfjs-dist` and the raw text is extracted.
4. An LLM (OpenAI GPT-4.1) structures the raw text into a typed candidate profile.
5. A candidate record is created or updated (overwritten) in the database via `Prisma`.
6. The uploaded CV is stored and linked to the candidate's profile — admins can browse the full upload history and download any CV from the candidate's profile page.
7. The UI surfaces success or failure feedback to the admin via toast notifications.

### Key Features

- **Role-based access**: `ADMIN` and `USER` roles enforced at both route and API level.
- **CV upload & parsing**: End-to-end PDF → structured data pipeline.
- **Auto-save & overwrite**: Candidate data is saved automatically; re-uploading a CV for an existing candidate overwrites their profile.
- **CV history**: All uploaded CVs are retained and accessible from the candidate's profile page, with individual download support.
- **Candidate management**: List, view, and manage candidate profiles.
- **User management**: Admin panel for managing platform users.
- **CI/CD**: GitHub Actions pipelines for lint, type-check, test, and build.

---

## 📜 Prompt History (Key Steps)

The following prompts were used (in order) to build this project with GitHub Copilot Agent Mode.

### 1. Scaffold the Next.js App
```
Plan: Create a plan for scaffolding a nextjs project -> Agent: make the changes according to the provided plan
```

### 2. Align Project Structure with Vercel Recommendations
```
Agent: check this (https://nextjs.org/docs/app/getting-started/project-structure) and adapt the structure to the recommended by vercel
```

### 3. Add Sign-In / Sign-Up
```
add sign-up and sign-in flows to the application:
1. Only authorized users should be allowed working with the application.
2. In case an un-authorized user is trying to interact with the system, he should be redirected to the "sign-in" page.
3. If user wants to sign up, he should enter all the required data which should be validated before send (react-hook-form + Zod)
4. Users should be saved and maintained in the database (postgresql) via prisma ORM. So the required database schema should be created (users, roles etc.)
5. A dedicated controller with auth actions should be created at the backend.
6. No external identity providers should be used. Only local JWT token generation and validation.
7. Use Next Auth as the best library for the nextjs apps.
```

### 4. Split Main and Admin Layouts
```
In the application I need to have two layouts: main and admin (which can be accessed only by users with admin role).
I need to put user management pages and role management pages (not in place yet, so you need to create) under the admin layout.

Main layout:
1. User should be able to see his details.
2. User should be able to upload a CV file in PDF format, verify the result and update own profile with the data from CV.
3. User cannot see a list of all the users.
4. User cannot see and manage the system roles.

Admin layout:
1. Admin user can see the list of existing users and manage them.
2. Admin user is able to upload a CV file for any user in the system and update his data.
3. Admin user is able to manage system roles and assign users to a specific role or a set of roles.

NOTE: uploaded PDF should be saved locally at this stage.
```

### 5. Add CV Processing
```
I need to add a PDF file processing flow:
1. User should be able to upload a PDF file with CV. If this CV is associated with an existing user then user data should be updated. If not, user association then create a new user in the system. It should not be considered as a new system user, but just an entity.
2. After upload, file should be saved on the server side locally.
3. File should be parsed using "pdfjs-dist" package.
4. Extracted user data should be passed to LLM (open ai or anthropic).
5. LLM should return a structured JSON with data like user name, description, past experience, technologies, certifications etc.
6. Save received data into appropriate tables in the DB.
7. On the frontend, user sees either success toast message and is redirected to a new user details page or a toast with error.
```

### 6. Convert API Endpoints to Server Actions
```
You need to perform a deep analysis and decide whether everything can be moved to the server actions or not. After analysis perform the required actions.
```

### 7. Test Coverage
```
1. Analyze the codebase, determine which parts of it can be covered with the tests and cover them. Take into account pages, components, services, helpers etc.
2. Create a set of e2e test scenarios using playwright.
```

### 8. CI/CD
```
Generate a GitHub Actions workflow for a GitFlow project:
- Branches: feature/*, develop, release/*, hotfix/*, main
- PR rules: feature/* -> develop, release/* -> main
- Quality gates: run unit tests with Jest, integration tests with React Testing Library, e2e tests with Playwright, enforce code coverage >= 80%, run security scan with npm audit
- Pre-commit: run ESLint and Prettier on JS/TS/JSX/TSX files, check formatting with Prettier
- Pipeline stages: install dependencies, build, lint, test, deploy to staging for develop branch, deploy to production for main branch
- Node.js environment: latest LTS
```

### 9. Documentation
```
Review all the documentation in the project and group, replace, restructure it to make the codebase more readable and ready for future development with AI agents (assistants or autonomic).
```

### 10. Clean Up
```
Review the codebase and do the following:
1. Delete empty folders.
2. Check all the API endpoints and if they are not used delete them.
```

---

## 🛠️ Tools, Models & MCP Used

### GitHub Copilot Features

| Feature | Usage |
|---|---|
| **Copilot Chat (Inline & Panel)** | Code generation, explanation, refactoring, debugging |
| **Copilot Edits / Agent Mode** | Multi-file edits, autonomous feature implementation |
| **Custom Instructions** | `.github/instructions/` files scoped per file type |
| **Reusable Prompts** | `.github/prompts/` for repeated scaffolding tasks |
| **Custom Agent** | `.github/agents/nextjs-expert.agent.md` — a Next.js 16 expert persona |

### Models

| Model | Role |
|---|---|
| **GPT-4.1** | Primary model used for the custom Next.js Expert agent (code generation, architecture) |
| **Claude Sonnet 4.6** | GitHub Copilot Chat model used during development sessions |
| **OpenAI GPT-4.1** (runtime) | LLM used at runtime inside the app to parse and structure CV text |

### MCP Servers

| MCP Server | Purpose |
|---|---|
| **Playwright MCP** | Browser automation inside Copilot agent sessions — used for E2E verification and interactive testing during development |
| **Context7 MCP** | Retrieves up-to-date library documentation and code examples directly inside Copilot Chat (e.g. Next.js, Prisma, Zod, TanStack Query) |

### Agent Tools Enabled

The custom Next.js Expert agent (`.github/agents/nextjs-expert.agent.md`) was configured with access to: `changes`, `codebase`, `edit/editFiles`, `extensions`, `fetch`, `findTestFiles`, `githubRepo`, `new`, `openSimpleBrowser`, `problems`, `runCommands`, `runNotebooks`, `runTasks`, `runTests`, `search`, `searchResults`, `terminalLastCommand`, `terminalSelection`, `testFailure`, `usages`, `vscodeAPI`.

### Instruction Files Used

| File | Scope |
|---|---|
| `copilot-instructions.md` | Global — project-wide Copilot behaviour |
| `code-style.instructions.md` | Global — code style and conventions |
| `nextjs.instructions.md` | Applied to `**/*.tsx`, `**/*.ts`, `**/*.jsx`, `**/*.js`, `**/*.css` |
| `cicd.instructions.md` | Applied to `.github/workflows/*.yml` |
| `security.instructions.md` | Global — security best practices |
| `testing.instructions.md` | Global — testing standards |
| `database.instructions.md` | Global — database patterns |
| `documentation.instructions.md` | Global — documentation standards |
| `pr-review.instructions.md` | Applied to all files — code review guidelines |

### Reusable Prompts

| Prompt | Purpose |
|---|---|
| `create-nextjs-page.prompt.md` | Scaffold a new Next.js App Router page |
| `add-shadcn-component.prompt.md` | Add and wire up a shadcn/ui component |
| `update-changelog.prompt.md` | Generate a CHANGELOG entry from recent changes |

---

## 💡 Insights & Recommendations

1. **Shared instructions, prompts, and agents are very useful.** Having them in `.github/` aligns the whole team on code styling, architecture approaches, and other technical decisions — Copilot behaves consistently across all contributors.

2. **Claude Sonnet 4.6 is a great fit for development.** It demonstrates strong understanding of complex codebases, multi-file refactoring, and architectural reasoning, making it well-suited for day-to-day engineering tasks.

3. **CI/CD pipelines can be created from scratch with ease.** GitHub Copilot generates solid GitHub Actions workflows quickly, and they are straightforward to amend and extend as the project evolves.

4. **Unit and E2E tests are easy to generate and maintain.** Copilot can analyse the codebase, identify testable areas, and scaffold Jest unit tests and Playwright E2E scenarios with minimal manual effort.

5. **Git commit messages can be generated by GitHub Copilot.** Auto-generated commit comments are descriptive and consistent, giving a much clearer understanding of what changed and why.

6. **Developers must stay attentive and review every change Copilot makes.** AI-generated code can introduce subtle issues or deviate from intent — keeping focus during review is essential to maintain code quality, correctness, and security.

---

## 📚 About

This repository contains a hands-on project for learning how to effectively use GitHub Copilot and other AI agents throughout a real development workflow — from scaffolding and feature implementation to testing, code review, and CI/CD.

See the [App Overview](#-app-overview) section above for full details on the application itself.

## 🚀 Getting Started

See [docs/getting-started.md](docs/getting-started.md) for prerequisites, installation, environment configuration, and E2E setup.

## 🏗️ Project Structure & Architecture

- High-level structure: [docs/project-structure.md](docs/project-structure.md)
- Layered architecture and data flow: [docs/architecture.md](docs/architecture.md)

The codebase follows Vercel-aligned Next.js conventions with a clear separation between routes, handlers, services, repositories, and shared utilities.

## 🤖 AI Agent Readiness

This project is explicitly designed to be extended and maintained by AI agents (assistants or autonomic):

- Stable data contracts for APIs and state
- Clear file and layer boundaries
- Centralized validation and error handling

For a concise map of extension points and best practices for agents, see:

- [docs/ai-agents.md](docs/ai-agents.md)

## 🧩 Key Integrations

- React Query: [docs/react-query.md](docs/react-query.md)
- Zustand & Zod: [docs/zustand-zod.md](docs/zustand-zod.md)

These docs explain how client-side data fetching, state management, and validation are wired into the app.

## 🧪 Testing

- Jest unit tests and coverage: `npm test`, `npm run test:coverage`
- Playwright E2E tests: `npm run e2e`

Details and environment setup steps are in [docs/getting-started.md](docs/getting-started.md).

## 🤖 GitHub Copilot Customization

This repository includes rich Copilot configuration under `.github/`:

- Custom agent: [ .github/agents/nextjs-expert.agent.md ](.github/agents/nextjs-expert.agent.md)
- Instruction files: [ .github/instructions/ ](.github/instructions)
- Reusable prompts: [ .github/prompts/ ](.github/prompts)

These are automatically picked up by GitHub Copilot in VS Code to keep suggestions aligned with this architecture.

## 🧭 Additional Docs

- Change history: [CHANGELOG.md](CHANGELOG.md)
- License: [LICENSE](LICENSE)

## 🤝 Contributing

We welcome contributions! Please see:

- [ .github/CONTRIBUTING.md ](.github/CONTRIBUTING.md)
- [ .github/CODE_OF_CONDUCT.md ](.github/CODE_OF_CONDUCT.md)

## 📫 Support

- Issues: use GitHub Issues
- Discussions: project discussions (if enabled) on GitHub

## ⭐ Acknowledgments

To be updated as contributors join the project.
