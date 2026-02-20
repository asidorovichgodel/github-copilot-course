# Pull Request Instructions for GitHub Copilot

When helping with pull requests, follow these guidelines:

## Creating PR Descriptions

### Title Format
Use conventional commit format:
```
<type>(<scope>): <short description>
```

Examples:
- `feat(lessons): add GitHub Copilot Chat lesson`
- `fix(examples): correct type error in authentication demo`
- `docs(readme): update installation instructions`

### Description Template

```markdown
## Description
[Clear explanation of WHAT changed and WHY]

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📝 Documentation
- [ ] ♻️ Refactoring
- [ ] ⚡ Performance

## Changes Made
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

## Testing
[How this was tested]

## Screenshots
[If UI changes]
```

## Code Review Suggestions

### What to Look For

**Code Quality:**
- Is the code readable and maintainable?
- Does it follow the style guide?
- Are variable/function names descriptive?
- Is the code properly commented?
- Are functions small and focused?

**Functionality:**
- Does it solve the stated problem?
- Are edge cases handled?
- Is error handling comprehensive?
- Are there potential bugs?

**Performance:**
- Are there obvious performance issues?
- Is the algorithm efficient?
- Are resources properly cleaned up?

**Testing:**
- Are there tests for new code?
- Do tests cover edge cases?
- Are test names descriptive?

**Security:**
- Are inputs validated?
- Are credentials hardcoded?
- Are there SQL injection risks?
- Are dependencies secure?

### Review Comment Style

**Be Constructive:**
```markdown
// Good
Consider using `Array.map()` here for better readability:
```typescript
const names = users.map(user => user.name);
```

// Less Helpful
This code is bad.
```

**Ask Questions:**
```markdown
// Good
Could we extract this logic into a separate function? It seems like it might be reused elsewhere.

// Less Helpful
This should be a separate function.
```

**Suggest Alternatives:**
```markdown
// Good
**Suggestion:** Consider using a Set for O(1) lookups instead of Array.includes():
```typescript
const allowedIds = new Set(['id1', 'id2', 'id3']);
if (allowedIds.has(userId)) { ... }
```

// Less Helpful
Use a Set.
```

**Praise Good Work:**
```markdown
// Good
Nice use of the builder pattern here! This makes the code much more readable.

Great test coverage for edge cases!
```

## Review Checklist

### Before Submitting PR
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] No debug/console.log statements
- [ ] No commented-out code
- [ ] Commit messages are clear
- [ ] PR description is complete

### When Reviewing PR
- [ ] Understand the purpose and context
- [ ] Check code functionality
- [ ] Verify tests are adequate
- [ ] Look for potential bugs
- [ ] Consider edge cases
- [ ] Check error handling
- [ ] Verify documentation updates
- [ ] Consider performance implications
- [ ] Look for security issues
- [ ] Check for breaking changes

## Responding to Review Comments

### As PR Author

**Accept Feedback Gracefully:**
```markdown
Good catch! I'll update this to handle null values.
```

**Ask for Clarification:**
```markdown
Could you elaborate on the performance concern here? I'm not sure I follow.
```

**Explain Design Decisions:**
```markdown
I chose this approach because [reason]. However, I'm open to alternatives if you think there's a better way.
```

**Update and Confirm:**
```markdown
Fixed in commit abc123. Let me know if this addresses your concern.
```

##Merging Guidelines

### Ready to Merge When:
- All reviewers approve
- CI/CD passes
- Conflicts resolved
- Documentation updated
- Changelog updated (if applicable)
- Breaking changes documented

### Merge Strategy:
- **Squash and merge** - For feature branches with many small commits
- **Merge commit** - For larger features that should preserve history
- **Rebase and merge** - To maintain linear history

### After Merging:
- Delete the feature branch
- Close related issues
- Update project board/tracking
- Notify stakeholders if needed
