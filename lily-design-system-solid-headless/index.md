# Lily Design System™ - Solid Headless

Headless, accessible, unstyled components for [Solid](https://www.solidjs.com/) 2.0. The same catalog, class hooks,
ARIA and keyboard contracts as the other Lily headless libraries, written for Solid's fine-grained reactivity.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide
structure, semantics, accessibility and behaviour.

## Status

All 637 catalog components, each with the React catalog's tests in their Solid form (3,998 tests, all passing), checked
by the same root-element, class-name, coverage and dev-warning gates as the other catalogs, and in CI.

## Install

```bash
pnpm add @lilydesignsystem/solid-headless
```

A Solid app (through `@solidjs/vite-plugin`) resolves the package's `solid` export condition, the JSX source, and
compiles it itself, for the browser or the server. Any other bundler gets `dist/index.js`, compiled for the browser.

## Requirements

- `solid-js` 2.0 and `@solidjs/web` 2.0 (peer dependencies)
- Node 26 for development

## Usage

```tsx
import { createSignal } from "solid-js";
import { Button, TextInput } from "@lilydesignsystem/solid-headless";

function Example() {
  const [name, setName] = createSignal("");
  return (
    <form>
      <TextInput
        label="Name"
        value={name()}
        onChange={setName}
      />
      <Button type="submit">Save</Button>
    </form>
  );
}
```

## How it differs from the React catalog

- `class`, not `className`, on every component (Solid's own attribute name, as in Svelte, Vue and HTML).
- Props are read through `withDefaults` and Solid's `omit`, never destructured, so every prop stays reactive and a
  default applies when a prop is `undefined`, as in the other catalogs.
- Text fields report each keystroke: the component listens to `input`, while its public prop is still `onChange`.
- An `aria-*` or `data-*` value that can be a boolean goes through `attr()`, so it renders `"true"` or `"false"`
  as ARIA requires. Solid alone would remove the attribute for `false`.
- A tag chosen by a prop (`as`, heading `level`) uses Solid 2's `dynamic()`.

## Development

```bash
pnpm install
pnpm test      # Vitest + @solidjs/testing-library in jsdom
pnpm check     # tsc --noEmit
pnpm build     # index.ts barrel, dist/source (JSX + types) and dist/index.js
```

`bin/convert-react-to-solid.py` is the porting aid that produced the components from the React catalog (`--hooks` for
the stateful ones). It
is a record of the port, not a generator: the components are maintained by hand from here.

---

Lily™ and Lily Design System™ are trademarks.
