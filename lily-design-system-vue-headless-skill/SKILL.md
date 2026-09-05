---
name: lily-design-system-vue-headless-skill
description: Use when someone asks how to install or import Lily Design System's Vue headless components, wants the Vue 3 SFC-specific usage idiom (`:class` binding, `v-bind="$attrs"`, `<slot />`), needs the npm package name (`lily-design-system-vue-headless`), or is wiring a Lily component into a Vue 3 app (plain Vite, Nuxt, Quasar, Astro, or a Storybook setup) and wants the Composition-API-correct way to do it.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Vue Headless — concepts & usage

`lily-design-system-vue-headless` is the Vue 3 implementation of Lily's
canonical headless component catalog (`components.tsv` at the monorepo
root): semantic HTML, ARIA, focus management, and keyboard behaviour, with
**no CSS**. Each component is a `.vue` single-file component using
`<script setup lang="ts">` and the Composition API — no Options API, no
`mixins`, no `defineComponent` wrapper around the SFC.

```bash
pnpm install lily-design-system-vue-headless
# or: npm install lily-design-system-vue-headless
```

Peer dependency: `vue ^3.0.0`. Each component ships as its own `.vue` file
under `components/` (flat structure), imported directly:

```vue
<script setup lang="ts">
import { ref } from "vue";
import Button from "lily-design-system-vue-headless/components/Button.vue";
import TextInput from "lily-design-system-vue-headless/components/TextInput.vue";

const name = ref("");
</script>

<template>
  <TextInput label="Your name" v-model="name" placeholder="Enter your name" />
  <Button @click="alert(`Hello, ${name}!`)">Greet</Button>
</template>
```

## The Vue 3 consumption idiom

- **Class binding.** Every component's root element carries the kebab-case
  base class (its slug) plus the consumer's own class, combined as
  `:class="className"` where `className` is a `computed()` of
  `` `{base-class} ${props.class}` ``. Pass your own class through the
  ordinary `class` prop — Lily doesn't invent a differently-named prop for
  it.
- **`v-bind="$attrs"` on the root.** Fallthrough attributes (`id`, `data-*`,
  event handlers, ARIA overrides) land on the root element automatically.
  You don't need to name every attribute you want to pass through.
- **`<slot />` for children.** Content composition is the default Vue slot,
  not a `children`-style prop.
- **`defineModel()` for two-way binding.** Components that hold a value
  (`TextInput` and friends) use `defineModel()`, so you bind with plain
  `v-model` rather than a manual `:value` + `@update:value` pair.
- **Events, not callback props.** Interaction hooks are emitted events
  (`@click`, `@change`, …) per Vue convention, not `onClick`-style props.

## Theming and class hooks

Same contract as every other Lily catalog: the root class is the only
styling contract, sub-classes documented in a component's own docs are
stable, and no colour, spacing, typography, or breakpoint literal ships in
the library. See `AGENTS/theme.md` in the canonical monorepo and the
paired `lily-design-system-vue-nuxt-examples` app for a fully styled
reference (NHS UK by default).

## Naming, suffix mapping, and composition patterns

The suffix→HTML-element mapping (`-button` → `<button>`, `-nav` → `<nav>`,
table sub-elements, etc.) and the compound name families
(`*List`/`*ListItem`, `*Nav`/`*List`/`*ListItem`, `*Picker`/`*PickerButton`,
and so on) are catalog-wide, not Vue-specific — read them once in
`AGENTS/components.md` at the monorepo root rather than here. The worked
composition examples there (Form → Field → Input, Grail layout,
Nav → List → ListItem, Table → Head/Body → Row → TH/TD) translate directly
into Vue SFC markup: swap the JSX-flavoured tags for `<ComponentName>` in a
`<template>` block, keep the same prop names.

## When NOT this skill

- For the `*-picker` helpers (`theme-picker`, `locale-picker`,
  `text-size-picker`, `motion-picker`, `share-picker`, `date-time-picker`)
  in Vue, use `lily-design-system-vue-helpers-skill` instead — those are a
  separate npm catalog with their own icon-button-plus-listbox contract.
- For framework-agnostic Lily concepts (what "headless" means, what a
  class hook is, the catalog shape, picking a framework), use
  `lily-design-system-skill` instead — this skill only covers the Vue
  headless library's own install/import/consumption idiom.
