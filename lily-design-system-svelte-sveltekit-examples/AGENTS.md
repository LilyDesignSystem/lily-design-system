# Lily Design System - Svelte SvelteKit Examples

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md

## Metadata

- **Package**: lily-design-system-svelte-sveltekit-examples
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

Svelte 5 + SvelteKit 2 example application demonstrating all 332 components from the Lily Design System headless component library, styled with NHS UK design system colors, typography, spacing, and focus states.

## IMPORTANT Architecture

- Svelte 5
- SvelteKit 2
- TypeScript
- Runes
- vite

## Testing

### Stack

- **vitest** (not Jest) — `pnpm test` runs `vitest run`
- **@testing-library/svelte** — render and query
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
