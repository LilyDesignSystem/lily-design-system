---
name: lily-design-system-svelte-headless-skill
description: Explains how to install and consume Lily Design System's Svelte headless component library — the npm package name, the Svelte 5 runes-specific usage idiom (the `class` prop convention, `$props()` with rest-props spread onto the root element, `$bindable()` for open/close state), and where the 491-component catalog and its naming/composition rules live. Use when someone asks how to install or import Lily's Svelte components, wants the Svelte 5 idiom for consuming a headless Lily component, asks what npm package to depend on, or asks how theming/class hooks work in the Svelte catalog.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Svelte headless

The Svelte 5 implementation of Lily's canonical 491-component catalog:
headless, unstyled, accessible components — semantic HTML, ARIA, focus
management, and keyboard behaviour, and **no CSS**. Published to npm as
[`lily-design-system-svelte-headless`](https://www.npmjs.com/package/lily-design-system-svelte-headless).

```sh
pnpm add lily-design-system-svelte-headless
```

The package ships a built `dist/` (via `svelte-package`) with a barrel entry
point — `main`/`types`/`svelte` all resolve through `package.json#exports`,
so a consumer imports named exports from the package root:

```ts
import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from "lily-design-system-svelte-headless";
```

This library does **not** depend on SvelteKit — it works in any Svelte 5
host (SvelteKit, plain Vite + Svelte, Astro, Storybook).

## The Svelte 5 consumption idiom

Every component follows the same runes-based shape:

- **The `class` prop.** Every component accepts a `class` prop (not
  `className`) — Svelte 5's own naming for the HTML `class` attribute.
  Internally the component destructures it to a local `className`
  variable and appends it to its own kebab-case base class:
  `class={`{kebab-case-base} ${className}`}`. The component's own class
  is always first, so a single selector (`.breadcrumb-nav`) is a stable
  styling contract regardless of what the consumer passes.
- **`$props()` with a rest-props spread.** Component props are typed and
  destructured via the `$props()` rune; anything not named explicitly
  lands in `...restProps` and is spread onto the root element, so a
  consumer can pass `id`, `data-*`, event handlers, or ARIA overrides
  without the component blocking them.
- **`$bindable()` for open/close and similar two-way state.** Components
  with an internal open/closed or selected/unselected state (dialogs,
  disclosures, comboboxes) expose it as a `$bindable()` prop so a
  consumer can either let the component own it or bind their own
  variable to it.
- **`$derived()` / `$state()`** for any other reactive or local values.
- **`Snippet` children.** Slotted content is typed `Snippet` and rendered
  with the optional-invocation form `{@render children?.()}`, so a
  component with no children passed doesn't throw.
- **No `<style>` blocks.** Headless components ship no CSS at all — not
  even Svelte's scoped styles.

```svelte
<script lang="ts">
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

<div class={`example-component ${className}`} aria-label={label} {...restProps}>
  {@render children?.()}
</div>
```

## Theming and class hooks

Theming works exactly the same way as every other Lily catalog: the
headless component bakes in no colour, spacing, typography, or breakpoint
literals — it only sets the kebab-case base class, ARIA, and `data-*`
attributes. Visual decisions live entirely in consumer CSS or in one of
the 45 ready-to-use reference stylesheets under the root `themes/`
directory, applied at runtime by the `theme-picker` helper (see
`lily-design-system-svelte-helpers-skill`).

## Naming conventions and composition patterns

The suffix→HTML-element mapping (`-button` → `<button>`, `-nav` →
`<nav>`, `-list`/`-list-item` → `<ol>`/`<li>`, the table family, etc.)
and the compound name-family patterns (`*List`/`*ListItem`,
`*Nav`/`*List`/`*ListItem`, `*Picker`/`*PickerButton`, table
sub-elements, and more) are catalog-wide rules, not Svelte-specific —
this skill does not restate them. See `AGENTS/components.md` at the
repository root (loaded into this skill's own `AGENTS.md`) for the full
mapping and the Form / Grail-layout / Navigation / Table composition
templates. For the general Svelte 5 + SvelteKit 2 conventions this repo
follows (runes, testing-library, vitest-only matchers), see
`AGENTS/sveltekit.md`.

## When NOT this skill

- For the Svelte `*-picker` helper packages (theme-picker, locale-picker,
  text-size-picker, motion-picker, share-picker, date-time-picker) — a
  different layer that owns a whole interaction, not a plain catalog
  component — use `lily-design-system-svelte-helpers-skill`.
- For framework-agnostic Lily concepts, terminology, and naming/composition
  patterns that apply across all seven frameworks, use
  `lily-design-system-skill`.
