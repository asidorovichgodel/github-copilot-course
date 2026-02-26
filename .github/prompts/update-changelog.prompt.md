---
description: 'Draft a new CHANGELOG.md entry based on recent git changes and staged work'
mode: 'agent'
tools: ['changes', 'runCommands', 'codebase']
---

# Update CHANGELOG

You are helping maintain `CHANGELOG.md` for this project.

The file follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and [Semantic Versioning](https://semver.org/).

## Steps

1. Run `git log --oneline -20` to inspect recent commits.
2. Run `git diff HEAD~1 --stat` (or use staged changes) to understand the scope of changes.
3. Determine the correct version bump:
   - **Patch** (0.0.X) — bug fixes, internal refactors, doc-only changes
   - **Minor** (0.X.0) — new features, backward-compatible additions
   - **Major** (X.0.0) — breaking changes
4. Write a new entry under `## [Unreleased]` (or promote it to a dated release if requested).

## Format

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...
```

Only include sections that have changes. Use concise, human-readable bullet points. Do not list individual file names unless they are meaningful to a consumer of the project.

## Rules

- Never delete previous entries.
- Keep the `[Unreleased]` section at the top for uncommitted/unreleased work.
- When promoting `[Unreleased]` to a release, add the date in `YYYY-MM-DD` format and replace the heading.
- Reference the current date: {{CURRENT_DATE}}.
