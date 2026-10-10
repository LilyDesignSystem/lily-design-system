# SettingsPicker (Svelte helper)

A headless Svelte 5 control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
cog SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import SettingsPicker from "@lilydesignsystem/svelte-settings-picker";
```

## Quick start

```svelte
<script lang="ts">
  import SettingsPicker from "@lilydesignsystem/svelte-settings-picker";
</script>

<SettingsPicker label="Settings">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><button type="button" onclick={signOut}>Sign out</button></li>
  </ul>
</SettingsPicker>
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

The content receives `{ open, close }`:

```svelte
<SettingsPicker label="Settings">
  {#snippet children({ close })}
    <form onsubmit={(e) => { e.preventDefault(); search(); close(); }}>
      <input type="search" aria-label="Search" />
    </form>
  {/snippet}
</SettingsPicker>
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`closeOnSelect={false}`, or opt one element or region out with a `data-settings-picker-keep-open` ancestor.

## Props

`label` (required), `open?` (bindable), `closeOnSelect?` (default `true`), `onOpenChange?`, `children?` (the panel's content),
`icon?` (replaces the **icon**, not the content), `class?`, plus rest props on the root.

## Styling

Headless: no CSS ships. Target `.settings-picker`, `.settings-picker-button`, `.settings-picker-icon`, `.settings-picker-tooltip`,
`.settings-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
