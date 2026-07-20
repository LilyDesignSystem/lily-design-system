# ThemeSelect (Svelte helper)

A reusable, headless Svelte 5 theme select that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
human-readable guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Props](#props)
- [Custom option rendering](#custom-option-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one app](#multiple-selects-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the select via the
  `theme-select` class hook.

The result is a small reusable widget that works in any Svelte 5 host
(SvelteKit, plain Vite, Astro, Storybook) and against any theme
catalog — Lily™'s 41 DaisyUI-inspired themes, NHS-aligned themes, or
your own bespoke set.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `svelte` ≥ 5.

```ts
import ThemeSelect from "./lily-design-system-svelte-theme-select/ThemeSelect.svelte";
// or via the barrel:
import { ThemeSelect } from "./lily-design-system-svelte-theme-select";
import type { Props, ChildArgs } from "./lily-design-system-svelte-theme-select";
```

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `static/assets/themes/light.css`, `static/assets/themes/dark.css`.
   Each theme scopes its tokens to `:root[data-theme="<slug>"]`
   (the convention every Lily theme uses).
2. Render the select, pointing it at the directory and listing the
   available slugs.

```svelte
<script lang="ts">
  import ThemeSelect from "./lily-design-system-svelte-theme-select/ThemeSelect.svelte";

  let theme = $state("");
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  bind:value={theme}
  storageKey="lily-theme"
/>
```

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- calls the optional `onChange("dark")` callback.

## How it works

On every theme change the select performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then call
   `onChange?.(slug)`.

All four steps are SSR-safe — the component only mutates the DOM
inside a `$effect`, which never runs on the server.

### The closed control always reads the placeholder

The `<select>` renders a leading placeholder option and pins its own
selection to it, so the closed control always shows the word
`placeholder ?? label` — "Theme" — rather than the name of the active
theme. That keeps the control as narrow as that one word instead of as
wide as the longest theme name, which matters when the catalog includes
slugs like `united-kingdom-national-health-service-england-for-patients`.

The active theme still lives in the bindable `value` prop, and all four
steps above are driven from it exactly as before. Only the element's own
`value` differs: it stays `""`.

Size the control in your own CSS — this package ships none:

```css
.theme-select:has(> .theme-select-placeholder) {
  width: auto;
  max-width: 12ch;
  field-sizing: content; /* Chromium: size to the displayed option */
}
```

The root [`themes/`](../../themes) stylesheets already carry this rule.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first mount is:

1. `value` prop (if non-empty)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `defaultValue` prop
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the select waits for user interaction

The select never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `themeLabels`.

## Props

The complete table is in [spec/index.md §4.1](./spec/index.md#41-props). Highlights:

| Prop          | Type                     | Required | Notes                                      |
| ------------- | ------------------------ | -------- | ------------------------------------------ |
| `label`       | `string`                 | yes      | `aria-label` on the `<select>`; also the default placeholder text. |
| `placeholder` | `string`                 | no       | Word the closed control always shows; defaults to `label`. |
| `themesUrl`   | `string`                 | yes      | Trailing `/` is auto-added.                |
| `themes`      | `string[]`               | yes      | Available slugs.                           |
| `value`       | `string` (bindable)      | no       | Two-way bind for the current slug.         |
| `defaultValue`| `string`                 | no       | Initial when nothing else applies.         |
| `storageKey`  | `string`                 | no       | `localStorage` persistence.                |
| `name`        | `string`                 | no       | `<select>` `name`; defaults to `"theme"`.  |
| `extension`   | `string`                 | no       | Defaults to `".css"`.                      |
| `target`      | `HTMLElement \| null`    | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels` | `Record<string, string>` | no       | Per-slug display label override.           |
| `onChange`    | `(slug) => void`         | no       | Callback fired after apply.                |
| `children`    | `Snippet<[ChildArgs]>`   | no       | Custom rendering of the options.           |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Custom option rendering

Pass a `children` snippet to take full control of the option markup.
The snippet receives `{ themes, value, setTheme, name, labelFor }`:

```svelte
<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  bind:value={theme}
>
  {#snippet children({ themes, value, setTheme, labelFor })}
    {#each themes as t (t)}
      <button
        type="button"
        aria-pressed={value === t}
        onclick={() => setTheme(t)}
      >
        {labelFor(t)}
      </button>
    {/each}
  {/snippet}
</ThemeSelect>
```

Working example: [`examples/custom-rendering.svelte`](./examples/custom-rendering.svelte).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`. On a
fresh mount the select reads back the stored slug as part of the
initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode, quota,
disabled storage) are silently swallowed — the select continues to
work in-memory.

If you need cookie-based persistence (so SSR can read the theme before
first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/sveltekit-cookie/`](./examples/sveltekit-cookie/) recipe.

## Accessibility

- The root is a native `<select>` (implicit `combobox` role) with
  `aria-label={label}` and a `name`.
- The native `<select>` gives Arrow / Home / End / typeahead
  semantics for free; the select does not override any keyboard
  behaviour.
- The active state is exposed via `data-theme` on the root and the
  `value` binding. No colour-only meaning is required.
- **Tradeoff.** The closed control always displays the placeholder word,
  not the active theme, so the active theme is *not* announced as the
  combobox value. Surface it separately where that matters — see
  [`docs/accessibility.md`](./docs/accessibility.md).
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The select compiles cleanly under `@sveltejs/vite-plugin-svelte` SSR.
On the server no effects run and no DOM is touched. The rendered markup
shows the placeholder option, as it always does — the supplied `value`
lives in the prop, not in the element's own selection, so there is
nothing for hydration to correct.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/sveltekit-cookie/`](./examples/sveltekit-cookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme is
fetched on demand. To switch instantly between themes, preload them
all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS is
scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.svelte`](./examples/preloaded.svelte).

## Multiple selects in one app

Pass a distinct `name` prop to each select. The `name` is used as
both the `<select>` `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/multiple-selects.svelte`](./examples/multiple-selects.svelte).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in SvelteKit before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Building a flyout / dropdown UI around the select.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common pitfalls:

- **CSS does not switch.** Check that each theme file scopes its rules
  to `:root[data-theme="<slug>"]` (not `:root` alone). Otherwise the
  first-loaded theme leaks across.
- **404 on theme href.** Check the file is served from `themesUrl` and
  uses the configured `extension` (defaults to `.css`).
- **SSR mismatch warning.** Pass a server-resolved `value` (cookie)
  so the SSR markup matches what the effect will set on the client.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available (not blocked by private mode).

## Testing

`pnpm test` under a vitest + jsdom + `@testing-library/svelte` setup
exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
