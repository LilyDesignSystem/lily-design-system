---
name: lily-design-system-react-headless-skill
description: Explains how to install, import, and use Lily Design System's React headless component library — the npm package name, JSX usage, the className + rest-props spreading convention, controlled-prop patterns (value/onChange, open/onChange), and where the 491-component catalog and naming rules live. Use when someone asks how to install or import Lily Design System's React headless components, wants the React-specific usage idiom (JSX, className, rest-props spreading, controlled props), asks what React version or peer dependencies it needs, or needs the npm package name for a specific Lily component in React.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — React headless

`lily-design-system-react-headless` is the React 19 implementation of the
Lily Design System's canonical 491-component catalog. It is published on
npm and installable today:

```bash
pnpm install lily-design-system-react-headless
```

Peer dependencies: `react` and `react-dom`, `^18.0.0 || ^19.0.0`. The
library itself has zero runtime dependencies beyond React.

Like every Lily headless library it is **headless**: semantic HTML, ARIA,
focus management, and keyboard behaviour only — zero CSS, zero fonts, zero
icons, zero images. Consumers supply every visual decision. If a request is
about how a component *looks*, point at the sibling example app,
`lily-design-system-react-next-examples`, and its CSS — not this library.

## Import shape

Each component is its own module under `components/`, exported by
PascalCase name matching its catalog entry:

```tsx
import Button from "lily-design-system-react-headless/components/Button";
import TextInput from "lily-design-system-react-headless/components/TextInput";
import Alert from "lily-design-system-react-headless/components/Alert";
```

## The React-specific consumption idiom

- **Functional components only**, React 19, TypeScript. No class components.
- **`className`, not `class`.** Every component's root element sets a class
  combining its kebab-case slug with the consumer's `className`:

  ```tsx
  <Button className="my-custom">Click</Button>
  // renders: <button class="button my-custom">Click</button>
  ```

- **Rest-props spread onto the root.** Every props interface ends with
  `[key: string]: unknown`, and every component spreads `...restProps` onto
  its root element, so `id`, `data-*`, event handlers, and ARIA overrides
  pass straight through untouched.
- **Controlled components: `value` + `onChange`.** Text inputs' `onChange`
  receives the string value directly (not a React `ChangeEvent`); numeric
  inputs receive a number; boolean inputs (`CheckboxInput`, `SwitchButton`,
  `ToggleButton`) receive a boolean. `Select`'s `onChange` receives the
  selected value string.
- **Open/close components: `open` + `onChange`.** `Dialog`, `Drawer`,
  `Collapsible`, `Popover` all follow this pair rather than a bespoke
  `isOpen`/`onToggle` shape.
- **When a component has more than one bindable state**, it uses distinct
  callbacks rather than overloading one: `onChange` for the primary value,
  `onOpenChange` for open/close, `onEditingChange` for edit mode. E.g.
  `Combobox` has separate `onChange` (value) and `onOpenChange` (open
  state).
- **All custom callback props are camelCase** — `onChange`, `onClose`,
  `onOpenChange`, `onValueChange`, never a lowercase `onchange`.
- **React's own camelCase attribute casing applies in JSX** —
  `autoComplete`, `inputMode`, `tabIndex`, `htmlFor`, `readOnly`,
  `dateTime` — not the lowercase HTML attribute spelling.
- **A few components deviate from the obvious shape** — worth checking
  before wiring one up: `BreadcrumbListItem` has no `href` prop (wrap a
  child `<a>` instead); `Alert` takes `heading`, not `label`/`title`;
  `Dialog` takes `label`, not `title`; `ErrorSummary` takes `title` +
  `children` (no `errors` prop); `TabBarButton` requires `controls` (the id
  of its panel); `RadioInput.onChange` receives a React `ChangeEvent`,
  unlike every other input; `FileUpload` uses `onInputChange` rather than
  `onChange`.

## Theming and class hooks

Exactly the same contract as every other Lily catalog: the root element's
kebab-case class (e.g. `.button`, `.breadcrumb-nav`) is the one stable
styling contract. No component ships a stylesheet, inline `style`, font,
icon, or image. See `AGENTS/theme.md` for the token shape and the 45
reference theme stylesheets under `themes/` if you want a working example
of CSS targeting these classes rather than writing your own from scratch.

## Naming, suffixes, and composition patterns

This skill does not restate the catalog. For the suffix→HTML-element
mapping (`-button` → `<button>`, `-nav` → `<nav>`, the table sub-element
families, etc.) and the composition patterns (Form → Field → Input,
Nav → List → ListItem, Table → Head/Body → Row → TH/TD, GrailLayout), see
`AGENTS/components.md` — the JSX in this skill's examples matches those
patterns directly, e.g.:

```tsx
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem>
      <a href="/">Home</a>
    </BreadcrumbListItem>
    <BreadcrumbListItem current>Page</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

## When NOT this skill

- For the six `*-picker` helper packages (theme-picker, locale-picker,
  text-size-picker, motion-picker, share-picker, date-time-picker) — the
  opinionated, higher-level React packages that own a whole interaction
  rather than being a pure markup primitive — use
  `lily-design-system-react-helpers-skill` instead.
- For framework-agnostic Lily concepts (what "headless" means, what a
  class hook or slug is, the catalog at a glance, picking a framework) use
  `lily-design-system-skill` instead — it doesn't restate React specifics,
  and this skill doesn't restate its general concepts.
