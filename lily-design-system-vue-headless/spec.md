# Lily Design System — Vue Headless — Specification

Living specification for the Vue 3 headless implementation of the Lily Design
System. Single source of truth for spec-driven development of this subproject.
For project-wide rules, read the root [spec.md](../spec.md) first.

This file adds Vue-specific detail and tracks the implementation status of
the **492 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships the Vue 3 Composition API implementation of every
component in the Lily catalog. Every component is **headless**: zero CSS,
semantic HTML, ARIA, focus and keyboard behaviour only. Consumers bring their
own styles. The sibling subproject `lily-design-system-vue-nuxt-examples/`
consumes this library and renders it with NHS-aligned CSS.

This library does NOT depend on Nuxt. Components work in any Vue 3 host
(Nuxt, Vite + Vue, Quasar, Astro, Storybook, plain SPA).

## 2. Scope

### In scope

- Vue 3 Composition API single-file components for all 492 components.
- TypeScript types for every component's props and emits.
- A vitest test file per component asserting ARIA, keyboard, and structural
  contract.
- A Storybook story per component for visual exploration.

### Explicitly out of scope

- Nuxt features (routing, server, modules, auto-imports outside of Vue).
- CSS, stylesheets, scoped styles, Tailwind, DaisyUI.
- Hardcoded text — all user-facing strings via props.
- `@testing-library/jest-dom` matchers — vitest built-ins only (§5.2).
- Options API — Composition API only.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| UI framework        | Vue 3 Composition API                       |
| Language            | TypeScript (`<script setup lang="ts">`)     |
| Package manager     | pnpm                                        |
| Test runner         | vitest + @testing-library/vue + jsdom       |
| Storybook           | yes — `*.stories.ts` per component          |
| i18n                | none — consumer-supplied via props          |

### Vue 3 conventions

- `<script setup lang="ts">` syntax for all components.
- `defineProps<{}>()` with `withDefaults()` for prop definitions.
- `defineModel()` for two-way bindable props (v-model).
- `defineEmits<{}>()` for event types.
- `computed()` for derived values.
- `v-bind="$attrs"` on the root element for pass-through attributes.
- Emit events instead of callback props (Vue convention): `emit('change', value)`.
- Headless: no `<style>` block, no `<style scoped>`.

### File layout

```
lily-design-system-vue-headless/
├── components/                            ← flat per-component sources
│   ├── {PascalCase}.vue                   ← implementation
│   ├── {PascalCase}.test.ts               ← vitest spec
│   ├── {PascalCase}.stories.ts            ← Storybook story
│   └── {PascalCase}.md                    ← author-facing notes
├── package.json
├── vitest.config.ts
└── vitest-setup.ts
```

Per-component documentation lives in the **root** `../components/{kebab-case}/`
directory (`index.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `plan.md`,
`tasks.md`). It is canonical and shared across all six headless subprojects —
not duplicated here.

## 4. Per-component contract

Each component requires:

- `components/{PascalCase}.vue` — implementation.
- `components/{PascalCase}.test.ts` — vitest spec.
- `components/{PascalCase}.stories.ts` — Storybook story.
- `components/{PascalCase}.md` — author-facing notes.
- `../components/{kebab-case}/{index,README,AGENTS,CLAUDE,plan,tasks}.md` —
  canonical per-component documentation at the **repository root**, shared
  across all headless subprojects.

### Component source template

```vue
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  label: undefined,
});

const className = computed(() => `{kebab-case-base} ${props.class}`);
</script>

<!-- {PascalCase}.vue -->
<template>
  <{tag}
    :class="className"
    :aria-label="label"
    v-bind="$attrs"
  >
    <slot />
  </{tag}>
</template>
```

The HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../AGENTS/components.md) suffix-to-tag mapping.

## 5. Testing

### 5.1 Stack

- vitest (NOT Jest) — `pnpm test` runs `vitest run`.
- @testing-library/vue — render and query.
- @testing-library/user-event — user interaction simulation.
- jsdom — DOM environment.

### 5.2 Matcher rules (CRITICAL)

Vitest built-in matchers ONLY. Never use `@testing-library/jest-dom`:

```ts
// CORRECT
expect(el).toBeTruthy();
expect(el.getAttribute("role")).toBe("button");
expect(el.textContent).toContain("hello");
expect(handleChange).toHaveBeenCalledOnce();

// WRONG
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
```

### 5.3 Test file template

```ts
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import Subject from "./{PascalCase}.vue";

describe("{PascalCase}", () => {
  test("renders with canonical class", () => {
    render(Subject, { props: { label: "Test" } });
    const el = screen.getByRole("{role}");
    expect(el).toBeTruthy();
    expect(el.className).toContain("{kebab-case-base}");
  });
});
```

## 6. Commands

```sh
pnpm install                         # install dependencies
pnpm test                            # run vitest
pnpm exec vitest run                 # explicit one-shot run
pnpm run storybook                   # run Storybook
```

## 7. Acceptance criteria

### 7.1 Catalog parity

- [ ] All 492 canonical components have a `{PascalCase}.vue` + `.test.ts` +
      `.stories.ts` + `.md` set.
- [x] Per-component docs live in the root `../components/{kebab-case}/`
      (shared canonical, not duplicated per subproject).
- [ ] Every component uses the canonical HTML tag.
- [ ] Every component sets the kebab-case base class on its root.
- [ ] No `<style>` / `<style scoped>` blocks anywhere.

### 7.2 Accessibility

- [ ] WCAG 2.2 AAA across every component.
- [ ] Required `label` / `aria-label` enforced.
- [ ] Keyboard contract from `AGENTS.md → Keyboard` works.

### 7.3 Testing

- [ ] Every component has a `*.test.ts`.
- [ ] `pnpm exec vitest run` passes.
- [ ] No `@testing-library/jest-dom` anywhere.

### 7.4 Internationalisation

- [ ] No hardcoded user-facing strings.
- [ ] Canonical text-prop names from
      [../AGENTS/internationalization.md](../AGENTS/internationalization.md).

### 7.5 Storybook

- [ ] `*.stories.ts` for every component.
- [ ] Storybook builds clean.

## 8. Implementation status

### 8.1 Done

- [x] Project infrastructure (`package.json`, `vitest.config.ts`, `tsconfig.json`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] Static wrappers, form inputs, links and views.
- [x] Table families with all sub-elements.
- [x] Navigation, list, bar, picker, menu, overlay patterns.
- [x] Form composition (form, field, fieldset, error-summary).
- [x] Layout components (grail-layout, sidebar, floating-panel, scroll-area).
- [x] Interactive specialty (combobox, carousel, slider, signature-pad).
- [x] Storybook integration with `*.stories.ts` files.
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 8.2 Verified

- [x] All 492 components have `{PascalCase}.vue` and compile.
- [x] `pnpm exec vitest run` passes: **2,187 / 2,187 tests, zero failures**.
- [x] CSS class-name audit: **492 / 492** components reference their canonical
      kebab-case base class.
- [x] Storybook story coverage: **492 / 492** components have a
      `*.stories.ts` file.

### 8.3 Open backlog

(none — all listed items verified)

## 9. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| Nuxt imports (`#app`, `#imports`) | this library is framework-only      |
| `<style>`, `<style scoped>`       | headless: zero CSS                  |
| `@testing-library/jest-dom`       | vitest matchers only                |
| Options API                       | Composition API only                |
| Tailwind, DaisyUI                 | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |

## 10. Tracking

- Package: `lily-design-system-vue-headless`
- Version: 0.2.0
- Framework: Vue 3 Composition API + TypeScript
- Test runner: vitest
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling example app: [../lily-design-system-vue-nuxt-examples/](../lily-design-system-vue-nuxt-examples/)
