# Lily Design System - React Next Examples

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md

## Metadata

- **Package**: lily-design-system-react-next-examples
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

React 19 + Next.js 15 example application demonstrating the Lily Design System headless component library, styled with NHS UK design system colors, typography, spacing, and focus states.

## Architecture

- React 19 with TypeScript and Next.js 15 App Router
- All example pages use `"use client"` directive (interactive components need client rendering)
- Components imported from headless library via `@pgds/*` path alias
- Wrapper components in `components/` re-export from headless library for local imports
- NHS styling via `assets/css/nhs.css` (CSS custom properties for colors, typography, spacing)
- `typescript.ignoreBuildErrors: true` in next.config.ts (headless lib `[key: string]: unknown` rest props conflict with Next.js strict ReactNode typing)

### Path Aliases

```json
{
  "@/*": ["./*"],
  "@pgds/*": ["../lily-design-system-react-headless/components/*"]
}
```

### Component Integration

```tsx
// Import directly from headless library
import Button from "@pgds/Button";

// Or import from local wrapper
import Button from "@/components/Button";
```

### Wrapper Component Pattern

Each wrapper in `components/` is a thin re-export:

```tsx
export { default } from "@pgds/Button";
export type * from "@pgds/Button";
```

## Testing

### Stack

- **vitest** (not Jest) — `pnpm test` runs `vitest run`
- **@testing-library/react** — render and query
- **@testing-library/user-event** — user interaction simulation
- **jsdom** — DOM environment

### Matcher Rules (CRITICAL)

Vitest built-in matchers ONLY. Never use jest-dom matchers:

```tsx
// CORRECT — vitest matchers
expect(el).toBeTruthy(); // element exists
expect(el).toBeNull(); // element doesn't exist
expect(el.getAttribute("role")).toBe("button"); // check attribute
expect(el.textContent).toContain("hello"); // check text
expect(button.disabled).toBe(true); // check property
expect(handleClick).toHaveBeenCalledOnce(); // check callback

// WRONG — jest-dom matchers (NEVER use)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
expect(button).toBeDisabled();
```

### Auto-Generated IDs

Components auto-generate unique IDs for ARIA linking:

```tsx
const generatedId = `component-${Math.random().toString(36).slice(2, 9)}`;
const inputId = id ?? generatedId;
const descriptionId = `${inputId}-desc`;
const errorId = `${inputId}-error`;
```
