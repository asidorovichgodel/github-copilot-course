# Code Style Instructions for GitHub Copilot

When generating code for this project, follow these guidelines:

## JavaScript/TypeScript

### Naming Conventions

- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and types
- Use `UPPER_SNAKE_CASE` for constants
- Prefix private class members with underscore: `_privateField`

### Code Structure

- Use 2 spaces for indentation
- Always use semicolons
- Prefer single quotes for strings (except template literals)
- Add trailing commas in multi-line objects and arrays
- Use arrow functions for callbacks
- Prefer `const` over `let`, avoid `var`

### Async Code

- Use async/await instead of raw promises
- Always include error handling with try-catch
- Add proper TypeScript types for async functions

### Example

```typescript
const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
```

## General Rules

### Comments

- Explain WHY, not WHAT
- Comment complex algorithms and business logic
- Avoid obvious comments
- Keep comments up-to-date with code changes

### Functions

- Keep functions small and focused (single responsibility)
- Use descriptive names that indicate purpose
- Limit parameters (max 3-4, use objects for more)
- Return early to avoid deep nesting

### Error Handling

- Always handle errors explicitly
- Provide meaningful error messages
- Log errors with context
- Fail fast for invalid inputs

### Testing

- Write testable code with clear inputs/outputs
- Avoid side effects in pure functions
- Use dependency injection for external dependencies
