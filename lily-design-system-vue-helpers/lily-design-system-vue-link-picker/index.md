# LinkPicker (Vue)

A headless control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". No CSS, no routes, no English.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```vue
<script setup lang="ts">
import LinkPicker, { type LinkItem } from "@lilydesignsystem/vue-link-picker";

const links: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
</script>

<template>
  <LinkPicker label="Pages" :links="links" />
</template>
```

`label` names the button, the list and the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side navigation

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import LinkPicker from "@lilydesignsystem/vue-link-picker";

const pages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
const route = useRoute();
const router = useRouter();
const links = computed(() => pages.map((p) => ({ ...p, current: route.path === p.href })));
</script>

<template>
  <LinkPicker label="Pages" :links="links" :navigate="(href) => router.push(href)" />
</template>
```

Ctrl/Cmd/Shift/Alt-click, middle-click and `newTab` links always stay native browser behaviour.

## `LinkItem`

| Field | Notes |
| --- | --- |
| label | Visible text. Yours, so it localises. |
| href | A route (`"/about/"`) or a full URL. |
| id | Reported when a link is chosen; defaults to the href. |
| current | Marks the current page with `aria-current="page"`. |
| newTab | `target="_blank"` with `rel="noopener noreferrer"`. |

## Props

| `label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `LinkItem[]` | yes | `{ id?, label, href, current?, newTab? }`. `id` defaults to `href`. |
| `navigate` | `(href: string) => void` | no | Client-side navigation hook (a router's `push`). |
| `navigate` event | `(id: string, href: string)` | no | Emitted after a link is chosen (the Svelte `onNavigate` callback). |
| default slot | `{ open }` | no | Replaces the **icon**, not the links. |
| `class` | `string` | no | Appended to the root class. |

## Styling

Headless: no CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list` (carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/`
style them all, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, router integration and a custom icon.
