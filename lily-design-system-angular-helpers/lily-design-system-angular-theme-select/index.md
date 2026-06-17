# ThemeSelect (Angular helper)

A reusable, headless Angular 20 theme picker that **loads themes
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
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Custom rendering](#custom-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple pickers in one app](#multiple-pickers-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme pickers couple selection, persistence, and styling into
one opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`)
  into a directory served by the app.
- **This component** owns selection, dynamic loading, persistence,
  and accessibility.
- **Consumers** own the visual style of the picker via the
  `theme-select` class hook.

The result is a small reusable widget that works in any Angular 20
host (Analog v1, Angular CLI app, Storybook) and against any theme
catalog — Lily's 41 DaisyUI-inspired themes, NHS-aligned themes, or
your own bespoke set.

The component is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select`. APIs and behaviour match;
only the framework idioms differ.

## Install

The directory is published as a folder-style import. Consumers
either copy it into their project or wire it as a workspace
dependency. The only runtime dependencies are `@angular/core` and
`@angular/common` (Angular 20+).

```ts
import { ThemeSelect } from "./lily-design-system-angular-theme-select";
```

The barrel also re-exports the pure helpers `normaliseThemesUrl`
and `themeHref`.

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `src/assets/themes/light.css`, `src/assets/themes/dark.css`. Each
   theme scopes its tokens to `:root[data-theme="<slug>"]` (the
   convention every Lily theme uses).
2. Import the standalone `ThemeSelect` component and render it.

```ts
import { Component, signal } from "@angular/core";
import { ThemeSelect } from "./lily-design-system-angular-theme-select";

@Component({
    selector: "app-settings",
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            storageKey="lily-theme"
        />
    `,
})
export class Settings {
    themes = ["light", "dark", "abyss"];
    theme = signal("");
}
```

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- updates the `value` signal,
- emits `themeChange("dark")`.

## How it works

On every theme change the picker performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the
   new theme's CSS is fetched and applied. The previous theme's
   CSS is unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   emit `themeChange` with the slug.

All four steps are SSR-safe — the component only mutates the DOM
inside an `effect()` guarded by `typeof document !== "undefined"`.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` array. The full resolution order on first effect run is:

1. `value` input (if non-empty)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `defaultValue` input
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the picker waits for user interaction

The picker never displays the word `"default"`. Option labels
default to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `themeLabels`.

## Inputs

The complete table is in [spec.md §4.1](./spec.md#41-inputs--outputs).
Highlights:

| Input          | Type                         | Required | Notes                                      |
| -------------- | ---------------------------- | -------- | ------------------------------------------ |
| `label`        | `string`                     | yes      | `aria-label` on the `<select>`.            |
| `themesUrl`    | `string`                     | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`                   | yes      | Available slugs.                           |
| `value`        | `string` (`model`)           | no       | Two-way bind for the current slug.         |
| `defaultValue` | `string`                     | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                     | no       | `localStorage` persistence.                |
| `name`         | `string`                     | no       | `<select>` `name`; defaults to `"theme"`.  |
| `extension`    | `string`                     | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`        | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>`     | no       | Per-slug display label override.           |
| `className`    | `string`                     | no       | Extra class on the `<select>` root.        |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Outputs

| Output         | Payload  | When                                                  |
| -------------- | -------- | ----------------------------------------------------- |
| `valueChange`  | `string` | Implicit on the `value` `model` signal — drives `[(value)]`. |
| `themeChange`  | `string` | After the picker applies a new theme (post-DOM-write). |

## Custom rendering

Today the component renders the default `<option>` markup
unconditionally. A future revision will expose a `ng-content`
projection slot and an `@ContentChild(TemplateRef)` for the option
template. In the interim, consumers who need bespoke rendering build
a thin wrapper around the pure helpers (`normaliseThemesUrl`,
`themeHref`) and the behavioural contract documented in
[spec.md §5](./spec.md#5-behaviour).

```ts
// Sketch of the swatch-button pattern with a future ng-template slot.
// Buttons aren't valid <select> children, so the swatch UI renders
// outside the native control and calls setTheme from a wrapper:
//
// <lily-theme-select label="Theme" themesUrl="/t/" [themes]="['light','dark']">
//   <ng-template #option let-theme="theme" let-value="value" let-setTheme="setTheme">
//     <button type="button" [attr.aria-pressed]="value === theme" (click)="setTheme(theme)">
//       {{ theme }}
//     </button>
//   </ng-template>
// </lily-theme-select>
```

Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`.
On a fresh mount the picker reads back the stored slug as part of
the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the picker
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/analog-cookie/`](./examples/analog-cookie/) recipe.

## Accessibility

- The root is a native `<select>` (implicit `combobox` role) with
  `[attr.aria-label]="label"` and a `name`.
- The native `<select>` gives Arrow / Home / End / typeahead
  semantics for free; the picker does not override any keyboard
  behaviour.
- The active state is exposed in three independent channels: the
  selected `<option>`, `data-theme` on the root, and the `value`
  model signal. No colour-only meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The picker compiles cleanly under Angular SSR (Analog v1 + Nitro,
Angular CLI's `@angular/ssr`). On the server no `effect()` writes
DOM (guarded by `typeof document !== "undefined"`), so the markup
renders using whatever `value` the consumer supplies via the input.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/analog-cookie/`](./examples/analog-cookie/).

## Preloading for zero-flicker switching

By default the picker swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself in `index.html`:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The picker still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.component.ts`](./examples/preloaded.component.ts).

## Multiple pickers in one app

Pass a distinct `name` input to each picker. The `name` is used as
both the `<select>` `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/multiple-pickers.component.ts`](./examples/multiple-pickers.component.ts).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Analog before render.
- Migrating from a `localStorage`-only picker to a cookie-backed
  one.
- Loading themes from a CDN.
- Cache-busting via `extension`.
- Synchronising theme across multiple tabs.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
  Otherwise the first-loaded theme leaks across.
- **404 on theme href.** Check the file is served from `themesUrl`
  and uses the configured `extension` (defaults to `.css`).
- **SSR mismatch warning.** Pass a server-resolved `value` (cookie)
  so the SSR markup matches what the lifecycle hook will set on
  the client.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available (not blocked by private mode).
- **`[(value)] = …` doesn't compile.** The model name is `value`,
  not the legacy `value` decorator name. Make sure the consumer
  field is a `WritableSignal<string>` (not a plain string).

## Testing

`pnpm test` under a vitest + jsdom + `@angular/core/testing`
`TestBed` setup exercises every numbered acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria).

## Files in this directory

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `spec.md`                           | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                         | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                           | Topic-by-topic agent files.                      |
| `CLAUDE.md`                         | `@AGENTS.md`.                                    |
| `theme-select.component.ts`         | The component implementation.                    |
| `theme-select.component.spec.ts`    | vitest suite covering every spec §7 item.        |
| `index.ts`                          | Re-export barrel.                                |
| `index.md`                          | This file.                                       |
| `docs/`                             | Deep-dive topic guides.                          |
| `examples/`                         | Runnable Angular component files.                |
| `CHANGELOG.md`                      | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
