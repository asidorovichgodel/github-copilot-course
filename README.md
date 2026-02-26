# GitHub Copilot Course

A comprehensive course for learning GitHub Copilot and AI-assisted development through a real Next.js project (CV extraction app).

## 📚 About

This repository contains resources, exercises, and examples for learning how to effectively use GitHub Copilot and other AI agents in your development workflow.

The course project is a **CV extraction** application that turns uploaded PDFs into structured candidate profiles.

Core workflow:

1. Admin uploads a CV in PDF format.
2. The file is uploaded to the server via an API endpoint.
3. The file is parsed and structured with an LLM-assisted extraction step.
4. A user/candidate is created or updated from the extracted data (with conflict confirmation when needed).
5. The UI shows success or failure to the admin.

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
