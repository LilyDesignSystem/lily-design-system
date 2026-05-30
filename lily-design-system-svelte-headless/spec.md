# Lily Design System — Svelte Headless — Specification

Living specification for the Svelte 5 headless implementation of the Lily Design
System. This file is the single source of truth for spec-driven development of
this subproject. It binds together the canonical catalog (in the repository
root) with the Svelte-specific architecture, file conventions, testing rules,
and implementation status.

For project-wide rules, read the root [spec.md](../spec.md) first. This file
adds Svelte-specific detail and tracks the implementation status of the
**492 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships the Svelte 5 implementation of every component in the
Lily catalog. Every component is **headless**: zero CSS, semantic HTML, ARIA,
focus and keyboard behaviour only. Consumers bring their own styles. The
sibling subproject `lily-design-system-svelte-sveltekit-examples/` consumes
this library and renders it with NHS-aligned CSS.

This library does NOT depend on SvelteKit. Components are framework-only and
work in any Svelte 5 host (SvelteKit, plain Vite + Svelte, Astro, Storybook).

## 2. Scope

### In scope

- Svelte 5 implementation of all 492 components from `components.tsv`.
- TypeScript types for every component's props.
- A vitest test file per component asserting ARIA, keyboard, and structural
  contract.
- A Storybook story per component for visual exploration.
- Component documentation (`index.md`, `AGENTS.md`, `plan.md`, `tasks.md`) per
  component directory.

### Explicitly out of scope

- SvelteKit features (routing, server actions, load functions) — those live in
  the examples subproject.
- CSS, stylesheets, fonts, icons, images.
- i18n libraries (`svelte-i18n`, Paraglide). Strings come from props.
- `@testing-library/jest-dom` — vitest built-in matchers only (see §5.2).
- Animation choreography, motion design.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| UI framework        | Svelte 5 with runes                         |
| Language            | TypeScript everywhere                       |
| Build tool          | Vite                                        |
| Package manager     | pnpm                                        |
| Test runner         | vitest + @testing-library/svelte + jsdom    |
| Storybook           | yes — `*.stories.svelte` per component      |
| i18n                | none — consumer-supplied via props          |

### Svelte 5 conventions

- Props use `$props()` rune with TypeScript types.
- Two-way binding uses `$bindable()`.
- Derived values use `$derived()`.
- Local state uses `$state()`.
- Children slots use `Snippet` type with `{@render children?.()}` (the optional
  invocation form so missing children don't throw).
- Headless components do NOT include `<style>` blocks.
- All `{#each}` blocks must have a key expression.
- Rest props (`...restProps`) spread onto the root element.

### File layout

```
lily-design-system-svelte-headless/
├── components/{PascalCase}/              ← per-component sources
│   ├── index.md
│   ├── README.md → index.md (symlink)
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── plan.md
│   ├── tasks.md
│   ├── {PascalCase}.svelte               ← the component
│   ├── {PascalCase}.md                   ← author-facing notes
│   ├── {PascalCase}.test.ts              ← vitest spec
│   └── {PascalCase}.stories.svelte       ← Storybook story
├── src/lib/components/{PascalCase}/      ← mirror of components/ for SvelteKit
│                                           consumers (kept in sync)
├── package.json
├── vite.config.ts
├── vitest-setup.js
└── tsconfig.json
```

Both `components/` and `src/lib/components/` exist because consumers may
import either path depending on how they consume the library (raw vs.
SvelteKit lib alias). They are kept in sync 1:1.

## 4. Per-component contract

Each component lives in `components/{PascalCase}/` and
`src/lib/components/{PascalCase}/`. Required files in each directory:

- `index.md` — human documentation (description, when-to-use, when-not-to-use,
  usage, props, ARIA, keyboard, references).
- `README.md` symlink → `index.md`.
- `AGENTS.md` — canonical machine-readable metadata (HTML tag, ARIA, keyboard,
  props).
- `CLAUDE.md` — loads `AGENTS.md`.
- `plan.md` — per-component implementation plan.
- `tasks.md` — per-component task list.
- `{PascalCase}.svelte` — the component source.
- `{PascalCase}.md` — author-facing notes.
- `{PascalCase}.test.ts` — vitest spec.
- `{PascalCase}.stories.svelte` — Storybook story.

### Component source template

```svelte
<script lang="ts">
    // {PascalCase} component
    //
    // {one-paragraph description}
    //
    // Props:
    //   class — optional. CSS class hook appended to base class.
    //   label — string, optional. Accessible name.
    //   children — Snippet, optional. Inner content.
    //   ...restProps — passed through to the root element.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- {PascalCase}.svelte -->
<{tag}
    class={`{kebab-case-base} ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</{tag}>
```

The HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../AGENTS/components.md) suffix-to-tag mapping.

## 5. Testing

### 5.1 Stack

- vitest (NOT Jest) — `pnpm test` runs `vitest run`.
- @testing-library/svelte — render and query.
- @testing-library/user-event — user interaction simulation.
- jsdom — DOM environment.

### 5.2 Matcher rules (CRITICAL)

Vitest built-in matchers ONLY. Never use jest-dom matchers:

```ts
// CORRECT — vitest matchers
expect(el).toBeTruthy();                                // element exists
expect(el).toBeNull();                                  // element doesn't exist
expect(el.getAttribute("role")).toBe("button");         // attribute
expect(el.textContent).toContain("hello");              // text
expect(button.disabled).toBe(true);                     // property
expect(handleClick).toHaveBeenCalledOnce();             // callback

// WRONG — jest-dom matchers (NEVER use)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
expect(button).toBeDisabled();
```

### 5.3 Per-component test minimums

Each `{PascalCase}.test.ts` asserts:

1. The root element renders with the canonical kebab-case base class.
2. `class` prop appends correctly.
3. Required `label` / `aria-label` is reflected when supplied.
4. Required ARIA attributes from `AGENTS.md` are present.
5. Children / slot content renders.
6. Keyboard interactions specified in `AGENTS.md → Keyboard` work as
   documented (where applicable).

## 6. Commands

```sh
pnpm install                         # install dependencies
pnpm run dev                         # Vite dev server
pnpm run build                       # production build
pnpm test                            # run vitest
pnpm exec vitest run                 # explicit one-shot run
pnpm run storybook                   # run Storybook
```

## 7. Acceptance criteria

### 7.1 Catalog parity

- [ ] All 492 canonical components from [../components.tsv](../components.tsv)
      have a directory in `components/{PascalCase}/`.
- [ ] All 492 directories are mirrored under `src/lib/components/{PascalCase}/`.
- [ ] Each directory has the 10 required files (see §4).
- [ ] Every component implements the HTML tag specified in its
      `AGENTS.md → HTML tag`.
- [ ] Every component uses the kebab-case base class on its root element.
- [ ] No `<style>` blocks anywhere.

### 7.2 Accessibility

- [ ] Every component meets WCAG 2.2 AAA.
- [ ] Every interactive component implements its `AGENTS.md → Keyboard`
      contract.
- [ ] Every required `label` / `aria-label` prop is enforced.
- [ ] No colour-only meaning anywhere (WCAG 1.4.1).

### 7.3 Testing

- [ ] Every component has a `*.test.ts` file.
- [ ] `pnpm exec vitest run` passes (zero failures).
- [ ] Tests use vitest matchers exclusively (no jest-dom).

### 7.4 Internationalisation

- [ ] No hardcoded user-facing strings.
- [ ] All text-bearing props use the canonical names (`label`, `description`,
      `placeholder`, `error`, `helpText`, etc.) from the root
      [AGENTS/internationalization.md](../AGENTS/internationalization.md).

### 7.5 Storybook

- [ ] Every component has a `*.stories.svelte` file.
- [ ] Storybook builds without errors.

## 8. Implementation status

### 8.1 Done

- [x] Project infrastructure (`package.json`, `vite.config.ts`, `vitest-setup.js`,
      `tsconfig.json`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md
      at the subproject root.
- [x] Static wrapper components (badge, banner, card, panel, alert, etc.).
- [x] Form input components (text-input, email-input, checkbox-input, etc.).
- [x] Link components (action-link, back-link, skip-link, etc.).
- [x] View components (postal-code-view, measurement views, etc.).
- [x] Table families (table, data-table, calendar-table, kanban-table,
      gantt-table) with head/body/foot/row/th/td sub-elements.
- [x] Navigation patterns (accordion-nav, breadcrumb-nav, tree-nav, etc.).
- [x] List patterns (check-list, summary-list, task-list, etc.).
- [x] Bar patterns (tab-bar, menu-bar, tool-bar, action-bar, task-bar).
- [x] Picker patterns (color-picker, five-star-rating-picker, etc.).
- [x] Form composition (form, field, fieldset, error-summary).
- [x] Overlays and menus (dialog, popover, tooltip, dropdown-menu).
- [x] Layout components (grail-layout, sidebar, floating-panel, scroll-area).
- [x] Interactive specialty (combobox, carousel, slider, signature-pad).
- [x] Storybook integration with `*.stories.svelte` files.
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 8.2 Verified

- [x] All 492 canonical components compile cleanly.
- [x] `components/` ↔ `src/lib/components/` 1:1 mirror verified
      (815 test files = 2 × 492 + 1).
- [x] `pnpm exec vitest run` passes: **4,016 / 4,016 tests, zero failures**.
- [x] CSS class-name audit: **492 / 492** components reference their canonical
      kebab-case base class.
- [x] Storybook story coverage: **492 / 492** components have a
      `*.stories.svelte` file.

### 8.3 Open backlog

(none — all listed items verified)

## 9. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `<style>` block in `*.svelte`     | headless: zero CSS                  |
| `@testing-library/jest-dom`       | vitest matchers only                |
| SvelteKit imports (`$app/*`)      | this library is framework-only      |
| `svelte-i18n`, Paraglide          | strings come from props             |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |
| `role="button"` on `<div>`        | use `<button>` (semantic-first)     |

## 10. Tracking

- Package: `lily-design-system-svelte-headless`
- Version: 0.2.0
- Framework: Svelte 5 + TypeScript
- Test runner: vitest
- Build tool: Vite
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling example app: [../lily-design-system-svelte-sveltekit-examples/](../lily-design-system-svelte-sveltekit-examples/)
