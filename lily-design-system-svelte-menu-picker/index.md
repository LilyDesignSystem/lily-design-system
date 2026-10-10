# MenuPicker (Svelte helper)

A headless Svelte 5 control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
three-line hamburger SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import MenuPicker from "@lilydesignsystem/svelte-menu-picker";
```

## Quick start

```svelte
<script lang="ts">
  import MenuPicker from "@lilydesignsystem/svelte-menu-picker";
</script>

<MenuPicker label="Menu">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><button type="button" onclick={signOut}>Sign out</button></li>
  </ul>
</MenuPicker>
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

The content receives `{ open, close }`:

```svelte
<MenuPicker label="Menu">
  {#snippet children({ close })}
    <form onsubmit={(e) => { e.preventDefault(); search(); close(); }}>
      <input type="search" aria-label="Search" />
    </form>
  {/snippet}
</MenuPicker>
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`closeOnSelect={false}`, or opt one element or region out with a `data-menu-picker-keep-open` ancestor.

## Props

`label` (required), `open?` (bindable), `closeOnSelect?` (default `true`), `onOpenChange?`, `children?` (the panel's content),
`icon?` (replaces the **icon**, not the content), `class?`, plus rest props on the root.

## Styling

Headless: no CSS ships. Target `.menu-picker`, `.menu-picker-button`, `.menu-picker-icon`, `.menu-picker-tooltip`,
`.menu-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
