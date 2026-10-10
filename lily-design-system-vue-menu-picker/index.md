# MenuPicker (Vue helper)

A headless Vue 3 control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
three-line hamburger SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import MenuPicker from "@lilydesignsystem/vue-menu-picker";
```

## Quick start

```vue
<script setup lang="ts">
import MenuPicker from "@lilydesignsystem/vue-menu-picker";
</script>

<template>
  <MenuPicker label="Menu">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about/">About Us</a></li>
      <li><button type="button" @click="signOut">Sign out</button></li>
    </ul>
  </MenuPicker>
</template>
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

The default slot receives `{ open, close }`:

```vue
<MenuPicker label="Menu" v-slot="{ close }">
  <form @submit.prevent="search(); close()">
    <input type="search" aria-label="Search" />
  </form>
</MenuPicker>
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`:close-on-select="false"`, or opt one element or region out with a `data-menu-picker-keep-open` ancestor.

## Props

`label` (required), `v-model:open?`, `closeOnSelect?` (default `true`), the default slot (the panel's content), the `icon` slot
(replaces the **icon**, not the content), `class?`.

## Styling

Headless: no CSS ships. Target `.menu-picker`, `.menu-picker-button`, `.menu-picker-icon`, `.menu-picker-tooltip`,
`.menu-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
