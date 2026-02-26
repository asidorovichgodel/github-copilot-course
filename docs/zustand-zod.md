# Zustand & Zod Integration

Zustand handles client-side state; Zod handles runtime validation.

## Files

- `src/lib/stores/useAppStore.ts` — Global UI state
- `src/lib/stores/useFormStore.ts` — Multi-step form state
- `src/lib/stores/index.ts` — Barrel exports
- `src/lib/schemas/userSchemas.ts` — User-related schemas
- `src/lib/schemas/formValidation.ts` — Form validation helpers
- `src/lib/schemas/index.ts` — Barrel exports
- `src/components/LoginForm.tsx` — Login form example
- `src/components/RegistrationForm.tsx` — Registration form example
- `src/components/AppSettings.tsx` — App-level settings example
- `src/components/MultiStepFormExample.tsx` — Multi-step example

## Quick Usage

```typescript
"use client";

import { useAppStore } from "@/lib/stores";

export function ThemeSwitcher() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current: {theme}
    </button>
  );
}
```

```typescript
import { loginSchema, validateFormData } from "@/lib/schemas";

const result = validateFormData(loginSchema, formData);
if (!result.success) {
  // result.errors is a field-error map
}
```

## Best Practices

- Use Zustand for **UI and workflow state**, not for server data (use React Query instead).
- Keep schemas colocated under `src/lib/schemas/` and export via the barrel file.
- Prefer the selector pattern in Zustand: `useStore((s) => s.slice)` to avoid re-renders.
- Validate on **both client and server** for critical flows.

For patterns and examples, see the example components in `src/components/`.
