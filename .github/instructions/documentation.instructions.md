# Documentation Instructions for GitHub Copilot

When generating documentation for this project, follow these guidelines:

## Markdown Files

### Structure

- Start with a single H1 (`#`) title
- Use proper header hierarchy (don't skip levels)
- Include a table of contents for long documents
- Keep paragraphs concise and scannable

### Code Examples

- Always specify language for syntax highlighting
- Keep examples minimal and focused
- Add comments to explain non-obvious code
- Show both usage and output when helpful

```javascript
// Good: Clear, commented example
function calculateTotal(items) {
  // Sum prices using reduce
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Usage
const total = calculateTotal([{ price: 10 }, { price: 20 }]);
console.log(total); // Output: 30
```

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered lists (auto-numbering)
- Keep list items parallel in structure
- Indent nested lists with 2 spaces

### Links

- Use descriptive link text: `[GitHub Copilot docs](url)` not `[click here](url)`
- Prefer relative links for internal files: `[Guide](../docs/guide.md)`
- Open external links in context

## Code Comments

### Function Documentation

**JavaScript/TypeScript (JSDoc):**

````typescript
/**
 * Calculates the total price of all items in the cart
 *
 * @param items - Array of cart items with price property
 * @param discount - Optional discount percentage (0-100)
 * @returns Total price after applying discount
 * @throws {Error} If discount is invalid
 *
 * @example
 * ```typescript
 * const total = calculateTotal([{ price: 100 }], 10);
 * console.log(total); // 90
 * ```
 */
function calculateTotal(items: CartItem[], discount = 0): number {
  // implementation
}
````

**Python (Docstrings):**

```python
def calculate_total(items: list[CartItem], discount: float = 0.0) -> float:
    """Calculate the total price of all items in the cart.

    Args:
        items: List of cart items with price attribute
        discount: Optional discount percentage (0.0-100.0)

    Returns:
        Total price after applying discount

    Raises:
        ValueError: If discount is not between 0 and 100

    Example:
        >>> items = [CartItem(price=100)]
        >>> calculate_total(items, discount=10.0)
        90.0
    """
    # implementation
```

## README Files

### Project README Structure

1. **Title and Brief Description** - One sentence describing the project
2. **Badges** (if applicable) - Build status, coverage, version
3. **Table of Contents** - For longer READMEs
4. **About** - Detailed description and features
5. **Getting Started**
   - Prerequisites
   - Installation steps
   - Quick start example
6. **Usage** - Common use cases with examples
7. **API/Configuration** - Key interfaces or settings
8. **Contributing** - Link to CONTRIBUTING.md
9. **License** - License type and link
10. **Acknowledgments/Credits**

### Module/Package README

- Explain the module's purpose
- Show basic usage examples
- Document public API
- Link to main project docs

## Inline Comments

### When to Comment

- Complex algorithms or business logic
- Non-obvious workarounds or hacks
- TODO, FIXME, or HACK markers
- Important assumptions or constraints

### When NOT to Comment

- Obvious code that's self-explanatory
- Redundant descriptions of what code does
- Commented-out code (remove it)

### Comment Style

```typescript
// Good: Explains WHY
// Use binary search because dataset is pre-sorted
const index = binarySearch(data, target);

// Bad: States the obvious
// Search for the target in data
const index = binarySearch(data, target);
```

## Documentation Principles

1. **Clarity** - Write for beginners, be explicit
2. **Completeness** - Cover all public APIs and common use cases
3. **Currency** - Keep docs in sync with code
4. **Conciseness** - Be thorough but not verbose
5. **Examples** - Show, don't just tell
6. **Searchability** - Use clear, searchable terms
7. **Accessibility** - Use semantic HTML, alt text for images
