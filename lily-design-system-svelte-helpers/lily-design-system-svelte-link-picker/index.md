# LinkPicker (Svelte helper)

A headless Svelte 5 control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of
links **your app defines** — "Home", "About Us", "Contact Us", "Privacy Policy", whatever your pages are.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import LinkPicker from "@lilydesignsystem/svelte-link-picker";
import type { LinkItem } from "@lilydesignsystem/svelte-link-picker";
```

## Quick start

```svelte
<script lang="ts">
  import LinkPicker, { type LinkItem } from "@lilydesignsystem/svelte-link-picker";

  const links: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
  ];
</script>

<LinkPicker label="Pages" {links} />
```

`label` is the button's accessible name, the list's name and the tooltip text. There is **no default list**: the package
ships no routes and no English, so the links, and every word on them, are yours.

## SvelteKit (client-side navigation)

```svelte
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import LinkPicker from "@lilydesignsystem/svelte-link-picker";

  const pages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
  ];
  const links = $derived(pages.map((p) => ({ ...p, current: page.url.pathname === p.href })));
</script>

<LinkPicker label="Pages" {links} navigate={(href) => goto(href)} />
```

With `navigate`, a plain left click is a client-side navigation; Ctrl/Cmd/Shift/Alt-click, middle-click and `newTab`
links stay native browser behaviour.

## `LinkItem`

| Field | Type | Notes |
| --- | --- | --- |
| `label` | `string` | Visible text. Yours, so it localises. |
| `href` | `string` | A route (`"/about/"`) or a full URL. |
| `id` | `string?` | Reported to `onNavigate`; defaults to `href`. |
| `current` | `boolean?` | Marks the current page with `aria-current="page"`. |
| `newTab` | `boolean?` | `target="_blank"` with `rel="noopener noreferrer"`. |

## Props

`label` (required), `links` (required), `navigate?`, `onNavigate?`, `children?` (replaces the **icon**, not the links),
`class?`, plus rest props on the root.

## Styling

Headless: no CSS ships. Target `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list`, `.link-picker-list-item`, `.link-picker-link`. The 45 reference themes in the monorepo's `themes/`
style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, and a SvelteKit one with `navigate` and `current`.
