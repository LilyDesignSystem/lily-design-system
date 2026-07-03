# Lily Design System — React Headless — Specification

Living specification for the React 19 headless implementation of the Lily
Design System. Single source of truth for spec-driven development of this
subproject. For project-wide rules, read the root [spec/index.md](../../spec/index.md) first.

This file adds React-specific detail and tracks the implementation status of
the **490 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships the React 19 implementation of every component in the
Lily catalog. Every component is **headless**: zero CSS, semantic HTML, ARIA,
focus and keyboard behaviour only. Consumers bring their own styles. The
sibling subproject `lily-design-system-react-next-examples/` consumes this
library and renders it with NHS-aligned CSS.

This library does NOT depend on Next.js. Components work in any React 18+
host (Next.js, Vite + React, Remix, Storybook, plain SPA).

## 2. Scope

### In scope

- React 19 functional components for all 490 components from `components.tsv`.
- TypeScript interfaces for every component's props.
- A vitest test file per component asserting ARIA, keyboard, and structural
  contract.
- A Storybook story per component for visual exploration.

### Explicitly out of scope

- Next.js features (server components, App Router, server actions).
- CSS, stylesheets, styled-components, Tailwind, DaisyUI.
- Hardcoded text — all user-facing strings via props.
- `@testing-library/jest-dom` matchers — vitest built-ins only (§5.2).
- Class components — functional only.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| UI framework        | React 19 (functional components, hooks)     |
| Language            | TypeScript                                  |
| Package manager     | pnpm                                        |
| Test runner         | vitest + @testing-library/react + jsdom     |
| Storybook           | yes — `*.stories.tsx` per component         |
| i18n                | none — consumer-supplied via props          |

### React 19 conventions

- Functional components only.
- `useState` for local state, `useRef` for DOM refs, `useEffect` for side
  effects.
- Controlled components: `value` + `onChange` callback pattern.
- Multiple bindable states use distinct callbacks: `onChange` for primary
  value, `onOpenChange` for open/close, `onEditingChange` for edit mode.
- Auto-generate ARIA-linking IDs with `Math.random().toString(36).slice(2, 9)`
  (prefer `useId()` in new components).
- All custom callbacks camelCase: `onChange`, `onClose`, `onOpenChange`,
  `onValueChange`, `onAdd`, `onInputChange`.
- React-required attribute casing: `className`, `htmlFor`, `tabIndex`,
  `autoComplete`, `inputMode`, `readOnly`, `dateTime`.
- Rest props spread to root: `...restProps`.

### File layout

```
lily-design-system-react-headless/
├── components/                            ← flat per-component sources
│   ├── {PascalCase}.tsx                   ← implementation
│   ├── {PascalCase}.test.tsx              ← vitest spec
│   ├── {PascalCase}.stories.tsx           ← Storybook story
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

- `components/{PascalCase}.tsx` — implementation.
- `components/{PascalCase}.test.tsx` — vitest spec.
- `components/{PascalCase}.stories.tsx` — Storybook story.
- `components/{PascalCase}.md` — author-facing notes.
- `../components/{kebab-case}/{index,README,AGENTS,CLAUDE,plan,tasks}.md` —
  canonical per-component documentation at the **repository root**, shared
  across all headless subprojects.

### Component source template

```tsx
import type React from "react";

export interface {PascalCase}Props {
  className?: string;
  label?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export default function {PascalCase}({
  className = "",
  label,
  children,
  ...restProps
}: {PascalCase}Props) {
  return (
    <{tag}
      className={`{kebab-case-base} ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </{tag}>
  );
}
```

HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../../AGENTS/components.md) suffix-to-tag mapping.

## 5. Testing

### 5.1 Stack

- vitest (NOT Jest) — `pnpm test` runs `vitest run`.
- @testing-library/react — render and query.
- @testing-library/user-event — user interaction simulation.
- jsdom — DOM environment.
- Auto cleanup in `vitest-setup.ts` (`afterEach(() => cleanup())`).

### 5.2 Matcher rules (CRITICAL)

Vitest built-in matchers ONLY. Never use `@testing-library/jest-dom`:

```tsx
// CORRECT
expect(el).toBeTruthy();
expect(el.getAttribute("role")).toBe("button");
expect(el.textContent).toContain("hello");
expect(button.disabled).toBe(true);
expect(handleClick).toHaveBeenCalledOnce();

// WRONG
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
expect(button).toBeDisabled();
```

### 5.3 Test file template

```tsx
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import Subject from "./{PascalCase}";

describe("{PascalCase}", () => {
  test("renders with canonical class", () => {
    render(<Subject label="Test">Content</Subject>);
    const el = screen.getByRole("{role}");
    expect(el).toBeTruthy();
    expect(el.className).toContain("{kebab-case-base}");
  });
});
```

## 6. Component API gotchas

Deviations from the obvious shape — keep in mind when implementing or testing:

- `BreadcrumbListItem` has NO `href` prop — wrap links in child `<a>` elements.
- `Alert` uses `heading` prop (not `label` or `title`).
- `Dialog` uses `label` prop (not `title`).
- `ErrorSummary` has `title` + `children` (no `errors` prop).
- `TabBarButton` requires `controls` prop (id of the associated panel).
- `RadioInput.onChange` receives a React ChangeEvent (not a value).
- `Combobox` has separate `onChange` (value) and `onOpenChange` callbacks.
- `FileUpload` uses `onInputChange` (not `onChange`).
- jsdom does not support `aspectRatio` CSS — test via data attributes.

## 7. Commands

```sh
pnpm install                         # install dependencies
pnpm test                            # run vitest
pnpm exec vitest run                 # explicit one-shot run
pnpm run storybook                   # run Storybook
```

## 8. Acceptance criteria

### 8.1 Catalog parity

- [ ] All 490 canonical components from [../components.tsv](../../components.tsv)
      have a `{PascalCase}.tsx` + `.test.tsx` + `.stories.tsx` + `.md` set.
- [x] Per-component docs live in the root `../components/{kebab-case}/`
      (shared canonical, not duplicated per subproject).
- [ ] Every component uses the canonical HTML tag from its `AGENTS.md`.
- [ ] Every component sets the kebab-case base class on its root element.
- [ ] No inline `style`, no CSS imports, no stylesheets shipped.

### 8.2 Accessibility

- [ ] WCAG 2.2 AAA across every component.
- [ ] Required `label` / `aria-label` props enforced where needed.
- [ ] Keyboard contract from each component's `AGENTS.md → Keyboard` works.

### 8.3 Testing

- [ ] Every component has a `*.test.tsx`.
- [ ] `pnpm exec vitest run` passes.
- [ ] No `@testing-library/jest-dom` usage anywhere.

### 8.4 Internationalisation

- [ ] No hardcoded user-facing strings.
- [ ] Canonical text-prop names from the root
      [AGENTS/internationalization.md](../../AGENTS/internationalization.md).

### 8.5 Storybook

- [ ] `*.stories.tsx` for every component.
- [ ] Storybook builds clean.

## 9. Implementation status

### 9.1 Done

- [x] Project infrastructure (`package.json`, `vitest.config.ts`,
      `vitest-setup.ts`, `tsconfig.json`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] Static wrappers, form inputs, links and views.
- [x] Table families (table, data-table, calendar-table, kanban-table,
      gantt-table) with all sub-elements.
- [x] Navigation, list, bar, picker, menu, overlay patterns.
- [x] Form composition (form, field, fieldset, error-summary).
- [x] Layout components (grail-layout, sidebar, floating-panel, scroll-area).
- [x] Interactive specialty (combobox, carousel, slider, signature-pad).
- [x] Storybook integration with `*.stories.tsx` files.
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 9.2 Verified

- [x] All 490 canonical components have `{PascalCase}.tsx` and compile.
- [x] `pnpm exec vitest run` passes: **2,205 / 2,205 tests, zero failures**.
- [x] CSS class-name audit: **490 / 490** components reference their canonical
      kebab-case base class.
- [x] Storybook story coverage: **490 / 490** components have a
      `*.stories.tsx` file.

### 9.3 Open backlog

(none — all listed items verified)

## 10. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| Next.js imports (`next/*`)        | this library is framework-only      |
| `<style>`, `import "*.css"`       | headless: zero CSS                  |
| `@testing-library/jest-dom`       | vitest matchers only                |
| Class components                  | functional only                     |
| Tailwind, DaisyUI, styled-comp    | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |
| Lowercase callback names          | use `onClick` not `onclick`         |

## 11. Tracking

- Package: `lily-design-system-react-headless`
- Version: 0.2.0
- Framework: React 19 + TypeScript
- Test runner: vitest
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../../components.tsv) — 490 components
- Root spec: [../spec/index.md](../../spec/index.md)
- Sibling example app: [../lily-design-system-react-next-examples/](../../lily-design-system-react-next-examples/)
