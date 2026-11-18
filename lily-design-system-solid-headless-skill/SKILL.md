---
name: lily-design-system-solid-headless-skill
description: Explains how to install, import, and use Lily Design System's Solid 2.0 headless component library — the npm package name, the two builds (the solid export condition and the compiled bundle), JSX usage with class and rest props, controlled props (value/onChange, open/onChange), and where the 637-component catalog and naming rules live. Use when someone asks how to install or import Lily Design System's Solid headless components, wants the Solid-specific usage idiom (class, signals, controlled props, form reset), asks what Solid version or peer dependencies it needs, or needs the npm package name for a Lily component in Solid.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Solid headless

`@lilydesignsystem/solid-headless` is the Solid 2.0 implementation of the Lily Design System's canonical 637-component
catalog. It is published on npm:

```bash
pnpm add @lilydesignsystem/solid-headless
```

Peer dependencies: `solid-js` and `@solidjs/web`, both `^2.0.0`. Solid 1.x is not supported: its props and effects API
differs (`splitProps`, `mergeProps`, `onMount`), and SolidStart is retired for Solid 2.0.

Like every Lily headless library it is **headless**: semantic HTML, ARIA, focus management and keyboard behaviour
only, with no CSS, fonts, icons or images. If a request is about how a component _looks_, point at the example app,
`lily-design-system-solid-examples`, and the theme stylesheets, not this library.

## Two builds

- **`solid` export condition** → `dist/source`: the components with their JSX kept. A Solid app (Vite with
  `@solidjs/vite-plugin`) resolves this condition and compiles the source itself, for the browser or the server.
- **default** → `dist/index.js`: compiled for the browser, for any other bundler.
- Types are in `dist/source`.

## Import shape

Every component is a named export of the package root, by its catalog PascalCase name:

```tsx
import { Button, TextInput, Alert, BreadcrumbNav } from "@lilydesignsystem/solid-headless";
```

## The Solid-specific consumption idiom

- **`class`, not `className`.** Each root element combines its kebab-case slug with your `class`:

  ```tsx
  <Button class="my-custom">Click</Button>
  // renders: <button class="button my-custom">Click</button>
  ```

- **Rest props spread onto the root**, so `id`, `data-*`, event handlers and ARIA overrides pass through. A `ref` is an
  ordinary prop (there is no `forwardRef`).
- **Controlled components: `value` + `onChange`**, with the value passed in from a signal:

  ```tsx
  const [name, setName] = createSignal("");
  <TextInput
    label="Full name"
    value={name()}
    onChange={setName}
  />;
  ```

  Text inputs call `onChange` on every keystroke (they listen for `input`); `onChange` receives the value, not an
  event. Open/close components (`Dialog`, `Drawer`, `Collapsible`, `Popover`) take `open` + `onChange`.

- **Defaults apply when a prop is `undefined`**, as in the React, Vue and Svelte catalogs, so forwarding an optional
  prop you do not set keeps the default.
- **ARIA and data booleans render as strings** (`aria-pressed="false"`), the same markup as every other catalog.
- **Form reset keeps bound values** (0.1.1 and later): a bound field also binds its default, so the browser's reset
  restores what your signal holds; `Select` puts its value back after a reset.
- **Solid attribute names**: `for`, `tabindex`, `readonly`, `autocomplete`, `inputmode` (the HTML spelling), and
  `onDblClick` for a double click.

## Theming and class hooks

The same contract as every Lily catalog: the root element's kebab-case class (`.button`, `.breadcrumb-nav`) is the one
stable styling hook. No component ships a stylesheet or inline style. See `AGENTS/theme.md` for the token shape, and the
reference stylesheets under `themes/` for working CSS that targets these classes.

## Naming, suffixes and composition

This skill does not restate the catalog. For the suffix→element mapping (`-button` → `<button>`, `-nav` → `<nav>`, the
table families) and the composition patterns (Form → Field → Input, Nav → List → ListItem, Table → Head/Body → Row →
TH/TD, GrailLayout), see `AGENTS/components.md`. The JSX matches those patterns directly:

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

## Native dialogs and popovers

Modal overlays (`dialog`, `alert-dialog`, `file-dialog`, `timeout-dialog`, `drawer`, `sheet`, `slide-out-drawer`) open
a real `<dialog>` with `showModal()`; light-dismiss popups (`popover`, `popup`, `contextual-help`, `dropdown-menu`,
`split-button`, `action-group`, `context-menu`) use the Popover API, so the browser can close them on Escape or an
outside click. Keep their open state two-way. Per-component decisions: each `components/{slug}/AGENTS.md`, "Native
platform".

## National identifiers

The 188 national personal identifier components (an `-input` and a `-view` for each of 94 identifier types: health
numbers, national identity numbers, tax numbers, passports) are not in the headless package since 2026-11-18. They are its
add-on, `@lilydesignsystem/solid-headless-identifiers`:

```bash
pnpm add @lilydesignsystem/solid-headless-identifiers
```

It has no dependency on `@lilydesignsystem/solid-headless`; install both to have the whole catalog. Change an identifier's import from the headless package to this one; the component, its props and class hooks are unchanged. Why: `spec/headless-identifiers`.

## When NOT this skill

- For the Solid helper packages (the eleven `*-picker` helpers, `picker-bar`, the grid-like helpers, the editors,
  `color-picker`, `locale-translations`), use `lily-design-system-solid-helpers-skill`.
- For the map of all three Solid layers and the example app, use `lily-design-system-solid-skill`.
- For framework-agnostic Lily concepts, use `lily-design-system-skill`.
