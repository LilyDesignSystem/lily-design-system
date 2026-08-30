# Lily Design System - Vue Nuxt Examples

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- **Package**: lily-design-system-vue-nuxt-examples
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

Vue 3 + Nuxt 3 example application demonstrating the Lily Design System headless component library, styled with NHS UK design system colors, typography, spacing, and focus states.

### Tech Stack

- **Vue 3** with Composition API and TypeScript (`<script setup lang="ts">`)
- **Nuxt 3** for file-based routing and component auto-imports
- **Vitest** + **Vue Testing Library** + **jsdom** for testing
- **Component styling** from the runtime theme stylesheet (a managed `<link data-lily-theme-picker>` the theme-picker helper swaps among `/themes/*.css`, default NHS England for patients); `assets/css/app-shell.css` keeps only the fixed app-shell chrome that no theme should style

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm run dev`   | Start development server |
| `pnpm run build` | Build for production     |
| `pnpm test`      | Run all component tests  |

### Project Structure

```
├── app.vue                     # Root layout
├── nuxt.config.ts              # Nuxt configuration
├── components/                 # 490 headless Vue components
├── pages/                      # 13 example pages
├── assets/css/app-shell.css    # app-shell chrome (component styling comes from the runtime theme)
├── tests/components/           # 490 component test files
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
