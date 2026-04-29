# Lily Design System - Vue Headless

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- **Package**: lily-design-system-vue-headless
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Project Overview

A headless Vue 3 component library with accessible, unstyled components. Based on the Lily Design System canonical component list in `AGENTS/components.md`.

## IMPORTANT Architecture

- Vue 3 with Composition API and TypeScript
- `<script setup lang="ts">` syntax for all components
- Headless design: zero CSS, zero styles
- WCAG 2.2 AAA accessibility
- Each component: `.vue` + `.test.ts` + `.md`
- All files in `components/` directory (flat structure)

## STRICT Prohibitions

- **No Nuxt** — pure Vue only
- **No @testing-library/jest-dom** — use vitest matchers only
- **No CSS/styles** — no Tailwind, no built-in styles
- **No images, icons, or fonts** — consumers provide these
- **No hardcoded user-facing strings** — all text through props

## Component Patterns

### File Naming

Each component has exactly three files:

```
{ComponentPascalCase}.vue       # Implementation
{ComponentPascalCase}.test.ts   # Tests
{ComponentPascalCase}.md        # Documentation
```

### Root Element CSS Class

Every component's first HTML element sets a class with the kebab-case name:

```vue
<button class="button">
<div class="banner">
<nav class="breadcrumb-nav">
```

### Vue Component Conventions

- `defineProps<{}>()` with `withDefaults()` for prop definitions
- `defineModel()` for two-way bindable props (v-model)
- `computed()` for derived values
- `v-bind="$attrs"` for pass-through attributes
- Emit events instead of callback props (Vue convention)

## Testing

### Stack

- **vitest** (not Jest) — `pnpm test` runs `vitest run`
- **Vue Testing Library** — render and query
- **@testing-library/user-event** — user interaction simulation
- **jsdom** — DOM environment

### Matcher Rules (CRITICAL)

Vitest built-in matchers ONLY. Never use jest-dom matchers:

```ts
// CORRECT — vitest matchers
expect(el).toBeTruthy(); // element exists
expect(el).toBeNull(); // element doesn't exist
expect(el.getAttribute("role")).toBe("button"); // check attribute
expect(el.textContent).toContain("hello"); // check text
expect(button.disabled).toBe(true); // check property

// WRONG — jest-dom matchers (NEVER use)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
```

## Headless Design Principles

- Semantic HTML structure
- ARIA attributes for accessibility
- Props and events for behavior
- Consumers provide all CSS
- No visual styling
- No stylesheets
- No CSS classes beyond semantic ones
- No built-in styles

## Internationalization

- All text content through props — no hardcoded strings
- Labels, descriptions, error messages all configurable
- Consumer provides localized text via props
