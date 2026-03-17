# Lily Design System - Vue Nuxt Examples

@AGENTS.md
@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md

## Metadata

- **Package**: lily-design-system-vue-nuxt-examples
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

Vue 3 + Nuxt 3 example application demonstrating all 332 components from the Lily Design System headless component library, styled with NHS UK design system colors, typography, spacing, and focus states.

### Tech Stack

- **Vue 3** with Composition API and TypeScript (`<script setup lang="ts">`)
- **Nuxt 3** for file-based routing and component auto-imports
- **Vitest** + **Vue Testing Library** + **jsdom** for testing
- **NHS UK CSS** via `assets/css/nhs.css` (CSS custom properties)

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm run dev`   | Start development server |
| `pnpm run build` | Build for production     |
| `pnpm test`      | Run all 1342 tests       |

### Project Structure

```
├── app.vue                     # Root layout
├── nuxt.config.ts              # Nuxt configuration
├── components/                 # 332 headless Vue components
├── pages/                      # 13 example pages
├── assets/css/nhs.css          # NHS UK design tokens & styles
├── tests/components/           # 332 component test files
├── vitest.config.ts            # Vitest configuration
└── vitest-setup.ts             # Test setup (cleanup)
```

### Vue Component Conventions

- `<script setup lang="ts">` syntax for all components
- `defineProps<{}>()` with `withDefaults()` for prop definitions
- `defineModel()` for two-way bindable props (v-model)
- `computed()` for derived values
- Headless: no CSS embedded, uses CSS class names matching kebab-case component name
- `v-bind="$attrs"` for pass-through attributes
- Emit events instead of callback props (Vue convention)

## Internationalization

- All text content through props — no hardcoded strings
- Labels, descriptions, error messages all configurable
- Consumer provides localized text via props
