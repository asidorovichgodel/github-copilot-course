# GitHub Copilot Course

A comprehensive course for learning GitHub Copilot and AI-assisted development through a real project build.

## 📚 About

This repository contains resources, exercises, and examples for learning how to effectively use GitHub Copilot in your development workflow.
The course project is a CV extraction app that turns uploaded PDFs into structured user profiles.

## Project Idea: CV Extraction

Core workflow:

1. Admin uploads a CV in PDF format.
2. The file is uploaded to the server (locally) via an API endpoint.
3. The file is analyzed and structured with a Copilot-assisted extraction step.
4. A user is created or updated from the extracted data (with conflict confirmation when needed).
5. The UI shows success or failure to the admin.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- **Git** installed on your machine
- **GitHub account** with GitHub Copilot subscription
- **VS Code** with GitHub Copilot extension (recommended)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/github-copilot-course.git
   cd github-copilot-course
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the course website.

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run type-check` - Check TypeScript types

## 📖 Course Structure

The course is organized into progressive lessons:

- **Lessons** - Located in `/src/app/lessons`, accessible at `/lessons` route
- **Exercises** - Practice exercises (coming soon)
- **Examples** - Real-world code examples (coming soon)

### Current Lessons

1. Introduction to GitHub Copilot (Coming Soon)
2. Writing Effective Prompts (Coming Soon)
3. GitHub Copilot Chat (Coming Soon)
4. Best Practices & Security (Coming Soon)

## 🤖 GitHub Copilot Customization

This repository is configured with custom agents, instructions, and prompts to enhance your development experience with GitHub Copilot.

### Custom Agents (`.github/agents/`)

Custom agents are specialized assistants you can invoke by name in GitHub Copilot Chat:

#### **@nextjs-expert** ([nextjs-expert.agent.md](.github/agents/nextjs-expert.agent.md))

Your Next.js development expert with deep knowledge of:

- Modern App Router (14+) architecture and patterns
- Server Components vs Client Components best practices
- Data fetching, caching strategies, and Server Actions
- Performance optimization (code splitting, image/font optimization, PPR)
- TypeScript patterns and type safety
- Modern tooling: Zod, React Hook Form, TanStack Query, Zustand, shadcn/ui
- Deployment and DevOps with Vercel
- Testing with Jest, Testing Library, Playwright, MSW

**Usage:** `@nextjs-expert how should I implement authentication with Server Actions?`

### Instruction Files (`.github/instructions/`)

Instruction files provide persistent guidance that GitHub Copilot follows throughout the codebase:

- **[copilot-instructions.md](.github/instructions/copilot-instructions.md)** - Main instruction file covering project overview, structure, and code generation principles
- **[code-style.instructions.md](.github/instructions/code-style.instructions.md)** - Code formatting, naming conventions, and style guidelines
- **[documentation.instructions.md](.github/instructions/documentation.instructions.md)** - Documentation standards for functions, components, and APIs
- **[testing.instructions.md](.github/instructions/testing.instructions.md)** - Testing patterns, practices, and requirements
- **[security.instructions.md](.github/instructions/security.instructions.md)** - Security best practices and guidelines
- **[pr-review.instructions.md](.github/instructions/pr-review.instructions.md)** - Pull request creation and review guidelines

These instructions are automatically applied to provide context-aware suggestions aligned with project conventions.

### Reusable Prompts (`.github/prompts/`)

Prompts are templates for common development tasks that you can invoke with `#` in Copilot Chat:

#### **#create-nextjs-page** ([create-nextjs-page.prompt.md](.github/prompts/create-nextjs-page.prompt.md))

Scaffold new Next.js App Router pages following project conventions:

- Creates page files at `src/app/<route>/page.tsx`
- Updates navigation sidebar with appropriate icons
- Implements proper header sections with badges and titles
- Uses Server Components by default
- Matches existing design system and styling

**Usage:** `#create-nextjs-page create a dashboard page with user statistics`

#### **#add-shadcn-component** ([add-shadcn-component.prompt.md](.github/prompts/add-shadcn-component.prompt.md))

Add shadcn/ui components to the project:

- Installs component in `src/components/ui/`
- Ensures Tailwind styling consistency
- Maintains accessibility standards
- Aligns with existing component patterns

**Usage:** `#add-shadcn-component add the dialog component`

### How to Use

**Custom Agents:**

1. Open GitHub Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`)
2. Type `@` to see available agents
3. Select the agent and describe your need
4. Example: `@nextjs-expert explain when to use client vs server components`

**Prompts:**

1. Open GitHub Copilot Chat
2. Type `#` to see available prompts
3. Select the prompt and provide context
4. Example: `#create-nextjs-page create a settings page`

**Instructions:**

- Automatically applied - no action needed
- Copilot uses these to provide context-aware suggestions
- Review the instruction files to understand project conventions

## �🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting pull requests.

### Quick Links

- [Code Style Guide](.github/STYLE_GUIDE.md)
- [Code of Conduct](.github/CODE_OF_CONDUCT.md)
- [Security Policy](.github/SECURITY.md)
- [Changelog](CHANGELOG.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/editor/artificial-intelligence)

## 📫 Support

- **Issues**: [Report a bug or request a feature](.github/ISSUE_TEMPLATE)
- **Discussions**: [Join the conversation](https://github.com/YOUR_USERNAME/github-copilot-course/discussions)

## ⭐ Acknowledgments

_To be added as contributors join the project_
