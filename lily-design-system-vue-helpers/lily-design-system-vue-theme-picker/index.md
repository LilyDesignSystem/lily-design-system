# ThemePicker (Vue helper)

A reusable, headless Vue 3 theme picker that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec.md](./spec.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Props](#props)
- [Events](#events)
- [Custom option rendering](#custom-option-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple pickers in one app](#multiple-pickers-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme pickers couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the picker via the
  `theme-picker` class hook.

The result is a small reusable widget that works in any Vue 3 host
(Nuxt 3, plain Vite + Vue, Astro Vue islands, Storybook) and against
any theme catalog — Lily's 41 DaisyUI-inspired themes, NHS-aligned
themes, or your own bespoke set.

The component is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-picker`. APIs and behaviour match;
only the framework idioms differ.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `vue` ≥ 3.

```ts
import ThemePicker from "./lily-design-system-vue-theme-picker/ThemePicker.vue";
// or via the barrel:
import { ThemePicker } from "./lily-design-system-vue-theme-picker";
import type { Props, SlotArgs } from "./lily-design-system-vue-theme-picker";
```

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `public/assets/themes/light.css`,
   `public/assets/themes/dark.css`. Each theme scopes its tokens to
   `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Render the picker, pointing it at the directory and listing the
   available slugs.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemePicker from "./lily-design-system-vue-theme-picker/ThemePicker.vue";

const theme = ref("");
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
        storage-key="lily-theme"
    />
</template>
```

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- emits `update:value` (driving `v-model:value`),
- emits `change` with the new slug.

## How it works

On every theme change the picker performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-picker="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   emit `change` with the slug.

All four steps are SSR-safe — the component only mutates the DOM
inside `onMounted` / `watch`, which never run on the server.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first mount is:

1. `value` prop (if non-empty)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `defaultValue` prop
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the picker waits for user interaction

The picker never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `themeLabels`.

## Props

The complete table is in [spec.md §4.1](./spec.md#41-props). Highlights:

| Prop           | Type                     | Required | Notes                                      |
| -------------- | ------------------------ | -------- | ------------------------------------------ |
| `label`        | `string`                 | yes      | `aria-label` on the radiogroup.            |
| `themesUrl`    | `string`                 | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`               | yes      | Available slugs.                           |
| `value`        | `string` (`v-model`)     | no       | Two-way bind for the current slug.         |
| `defaultValue` | `string`                 | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                 | no       | `localStorage` persistence.                |
| `name`         | `string`                 | no       | Radio `name`; defaults to `"theme"`.       |
| `extension`    | `string`                 | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`    | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>` | no       | Per-slug display label override.           |
| `class`        | `string`                 | no       | Extra class on the `<fieldset>` root.      |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `update:value`  | `string` | After selection, drives `v-model:value`.              |
| `change`        | `string` | After the picker applies a new theme (post-DOM-write). |

## Custom option rendering

Pass a default slot to take full control of the option markup. The
slot receives `{ themes, value, setTheme, name, labelFor }`:

```vue
<ThemePicker
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark', 'abyss']"
    v-model:value="theme"
>
    <template #default="{ themes, value, setTheme, labelFor }">
        <button
            v-for="t in themes"
            :key="t"
            type="button"
            class="theme-picker-swatch"
            :data-theme="t"
            :aria-pressed="value === t"
            @click="setTheme(t)"
        >
            {{ labelFor(t) }}
        </button>
    </template>
</ThemePicker>
```

Working example: [`examples/custom-rendering.vue`](./examples/custom-rendering.vue).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`. On
a fresh mount the picker reads back the stored slug as part of the
initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the picker
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/nuxt-cookie/`](./examples/nuxt-cookie/) recipe.

## Accessibility

- The root is a `<fieldset>` with `role="radiogroup"` and
  `aria-label={label}`.
- Native `<input type="radio">` elements give Arrow / Space / Tab
  semantics for free; the picker does not override any keyboard
  behaviour.
- The active state is exposed in three independent channels:
  `aria-checked` on the radio, `data-theme` on the root, and the
  `value` binding. No colour-only meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The picker compiles cleanly under Vue 3 SSR (Nuxt, plain
`vue/server-renderer`, Astro Vue islands). On the server no
lifecycle hook runs and no DOM is touched, so the markup renders
using whatever `value` (or empty string) the consumer supplies.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/nuxt-cookie/`](./examples/nuxt-cookie/).

## Preloading for zero-flicker switching

By default the picker swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The picker still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.vue`](./examples/preloaded.vue).

## Multiple pickers in one app

Pass a distinct `name` prop to each picker. The `name` is used as
both the radio-input `name` (so the radios form separate groups)
and the discriminator on the managed `<link>` element
(`data-lily-theme-picker="{name}"`).

Example: [`examples/multiple-pickers.vue`](./examples/multiple-pickers.vue).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Nuxt before render.
- Migrating from a `localStorage`-only picker to a cookie-backed one.
- Building a flyout / dropdown UI around the picker.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
  Otherwise the first-loaded theme leaks across.
- **404 on theme href.** Check the file is served from `themesUrl`
  and uses the configured `extension` (defaults to `.css`).
- **SSR mismatch warning.** Pass a server-resolved `value` (cookie)
  so the SSR markup matches what the lifecycle hook will set on the
  client.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available (not blocked by private mode).

## Testing

`pnpm test` under a vitest + jsdom + `@vue/test-utils` setup
exercises every numbered acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `ThemePicker.vue`     | The component implementation.                    |
| `ThemePicker.test.ts` | vitest suite covering every spec §7 item.        |
| `index.ts`            | Re-export barrel.                                |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable Vue 3 SFCs.                             |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
