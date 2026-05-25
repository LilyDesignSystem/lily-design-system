# Lily Design System — HTML Headless — Specification

Living specification for the plain HTML + vanilla JavaScript headless
implementation of the Lily Design System. Single source of truth for
spec-driven development of this subproject. For project-wide rules, read the
root [spec.md](../spec.md) first.

This file adds HTML-specific detail and tracks the implementation status of
the **407 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships a framework-free HTML + vanilla JavaScript implementation
of every component in the Lily catalog. No build step is required. Consumers
copy the HTML snippet into their page (or fetch it server-side) and bring
their own CSS. The sibling subproject `lily-design-system-html-css-js-examples/`
consumes this library and renders it with NHS-aligned CSS.

This is the **reference implementation** — the canonical semantic HTML, ARIA,
and keyboard behaviour that every other framework binding mirrors.

## 2. Scope

### In scope

- Plain HTML + vanilla JavaScript implementation of all 407 components.
- WebDriverIO browser tests per component.
- Zero build dependencies (no bundler required to use a component).
- Comprehensive per-component HTML file with embedded `<script>` block where
  interactivity is needed.

### Explicitly out of scope

- TypeScript. JavaScript only.
- Any UI framework (no React, Svelte, Vue, Angular).
- Build tools (no Vite, Webpack, esbuild).
- CSS, stylesheets, fonts, icons, images.
- Hardcoded text — all content via attributes / `data-*` / consumer JS.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| Output              | Plain HTML + vanilla JS                     |
| Language            | JavaScript (no TS)                          |
| Build               | None                                        |
| Package manager     | pnpm (dev-only)                             |
| Test runner         | WebDriverIO (real browser)                  |
| Storybook           | yes — `*.stories.ts` per component          |
| i18n                | none — consumer supplies all text           |

### Vanilla conventions

- Each component is a self-contained `.html` file with embedded `<script>` (IIFE)
  where interactivity is needed.
- Components rely only on browser APIs (no polyfills, no module loader).
- State via `data-*` attributes (`data-open`, `data-active`, `data-visible`).
- ARIA attributes set directly on the markup.
- Class hooks: kebab-case base class on the root element.

### File layout

```
lily-design-system-html-headless/
├── components/
│   ├── {kebab-case}.html                  ← component source
│   ├── {kebab-case}.stories.ts            ← Storybook story
│   └── {kebab-case}.test.js               ← WebDriverIO browser test
├── wdio.conf.js
└── package.json
```

Per-component documentation lives in the **root** `../components/{kebab-case}/`
directory (`index.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `plan.md`,
`tasks.md`). It is canonical and shared across all six headless subprojects —
not duplicated here.

## 4. Per-component contract

Each component requires:

- `components/{kebab-case}.html` — implementation.
- `components/{kebab-case}.test.js` — WebDriverIO browser test.
- `components/{kebab-case}.stories.ts` — Storybook story.
- `../components/{kebab-case}/{index,README,AGENTS,CLAUDE,plan,tasks}.md` —
  canonical per-component documentation at the **repository root**, shared
  across all headless subprojects.

### Component source template

```html
<!-- {kebab-case}.html -->
<!-- {PascalCase} component
  Description: {comprehensive description}
  Attributes:
    class — CSS class name(s) provided by consumer.
    data-label — accessible label for the component.
    ...
  Usage:
    <{tag} class="{kebab-case-base}" data-label="Example">…</{tag}>
-->

<{tag} class="{kebab-case-base}" role="{role}" aria-label="Example">
  …
</{tag}>

<script>
  // {PascalCase} behavior
  (function () {
    "use strict";
    // Vanilla JavaScript for interactivity (state, keyboard, focus)
  })();
</script>
```

The HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../AGENTS/components.md) suffix-to-tag mapping.

## 5. Testing

### 5.1 Stack

- WebDriverIO with a real browser (Chromedriver).
- Vanilla JavaScript test files (no TypeScript).
- Run via `pnpm exec wdio run wdio.conf.js`.

### 5.2 Per-component test minimums

Each `{kebab-case}.test.js` asserts:

1. Root element renders with the canonical kebab-case base class.
2. Required ARIA attributes are present.
3. Keyboard interactions from `AGENTS.md → Keyboard` work.
4. Inline `<script>` IIFE wires up state without throwing.

## 6. Commands

```sh
pnpm install                                  # install dev dependencies
pnpm exec wdio run wdio.conf.js               # run WebDriverIO tests
pnpm run storybook                            # run Storybook
```

## 7. Acceptance criteria

### 7.1 Catalog parity

- [ ] All 407 canonical components have a `{kebab-case}.html` + `.test.js` +
      `.stories.ts` set.
- [x] Per-component docs live in the root `../components/{kebab-case}/`
      (shared canonical, not duplicated per subproject).
- [ ] Every component uses the canonical HTML tag.
- [ ] Every component sets the kebab-case base class on its root.
- [ ] No `<style>` blocks anywhere.

### 7.2 Accessibility

- [ ] WCAG 2.2 AAA across every component.
- [ ] Required `data-label` / `aria-label` attribute support.
- [ ] Keyboard contract from each `AGENTS.md → Keyboard` works.

### 7.3 Testing

- [ ] Every component has a `*.test.js` WebDriverIO spec.
- [ ] `pnpm exec wdio run wdio.conf.js` passes.

### 7.4 Internationalisation

- [ ] No hardcoded user-facing strings in the `.html` source.
- [ ] Consumer supplies text via attributes, `data-*`, or JS configuration.

### 7.5 Storybook

- [ ] `*.stories.ts` for every component.
- [ ] Storybook builds clean.

## 8. Implementation status

### 8.1 Done

- [x] Project infrastructure (`package.json`, `wdio.conf.js`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] All 407 components have a `{kebab-case}.html` file (canonical reference).
- [x] Storybook integration with `*.stories.ts` files.
- [x] Catalog rename: `medical-record-red-box` → `medical-banner-box-for-danger`.

### 8.2 Open backlog

- [ ] Verify every component has a corresponding WebDriverIO test file.
- [ ] Run full `pnpm exec wdio run wdio.conf.js` and fix failures.
- [ ] Verify CSS class names match `../css-style-sheet-template.css`.
- [ ] Audit Storybook story coverage.

## 9. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| Framework imports (React, Svelte, Vue) | this is the framework-free reference |
| TypeScript                        | plain JavaScript only               |
| Build tools                       | components must work without a bundler |
| `<style>`, `<link rel="stylesheet">` | headless: zero CSS               |
| Tailwind, DaisyUI                 | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |
| `@testing-library/jest-dom`       | WebDriverIO, not vitest             |

## 10. Tracking

- Package: `lily-design-system-html-headless`
- Version: 0.2.0
- Framework: Plain HTML + vanilla JavaScript
- Test runner: WebDriverIO
- Build: none (no bundler)
- Package manager: pnpm (dev-only)
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 407 components
- Root spec: [../spec.md](../spec.md)
- Sibling example app: [../lily-design-system-html-css-js-examples/](../lily-design-system-html-css-js-examples/)
