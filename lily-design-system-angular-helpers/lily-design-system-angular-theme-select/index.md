# ThemeSelect (Angular helper)

A reusable, headless Angular 20 theme select that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
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
- [Keyboard](#keyboard)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one app](#multiple-selects-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into
one opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`)
  into a directory served by the app.
- **This component** owns selection, dynamic loading, persistence,
  and accessibility.
- **Consumers** own the visual style of the control via the
  `theme-select` class hooks — including positioning the list, which
  the package deliberately ships no CSS for.

The control is an icon button that opens a
[WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/),
not a native `<select>`. That buys a compact, fully styleable trigger
and costs the platform behaviour a native control gets for free; the
tradeoffs are stated plainly in
[docs/accessibility.md](./docs/accessibility.md#tradeoffs).

The result is a small reusable widget that works in any Angular 20
host (Analog v1, Angular CLI app, Storybook) and against any theme
catalog — Lily™'s 41 DaisyUI-inspired themes, NHS-aligned themes, or
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

The barrel also re-exports the optional `ThemeSelectIcon` marker
directive, the `CIRCLE_WITH_RIGHT_HALF_BLACK` glyph constant, the
`nextThemeSelectId` id generator, the pure helpers
`normaliseThemesUrl`, `themeHref`, `themeName`, and
`matchSystemTheme`, and the `ChildArgs` type.

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
            #themeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            storageKey="lily-theme"
        />

        <p class="theme-select-status" aria-live="polite">
            Active theme: {{ themeSelect.labelFor(theme()) }}
        </p>
    `,
})
export class Settings {
    themes = ["light", "dark", "abyss"];
    theme = signal("");
}
```

The status line is part of the pattern, not decoration. The closed
button shows only a glyph — it never names the active theme, visually
or in the accessibility tree — so on its own it never tells anyone
which theme is in effect. The `theme-select-status` element restores
that, in visible text, for sighted and screen-reader users alike;
`aria-live="polite"` announces only changes, so it is silent on first
paint and speaks once per switch. Keep it unless you have a specific
reason not to, and prefer visually hiding it over deleting it. Full
rationale and the opt-out: [docs/accessibility.md](./docs/accessibility.md).

You also need a little CSS before this looks right: the listbox is
unpositioned by default and will push page content around when it
opens. The minimum recipe is in [docs/styling.md](./docs/styling.md#positioning-the-list).

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- updates the `value` signal,
- emits `themeChange("dark")`.

## How it works

On every theme change the select performs four steps, in order:

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
3. `matchSystemTheme(themes)` — only if `detectFromSystem` is `true`
4. `defaultValue` input
5. `"light"` (if present in `themes`)
6. `themes[0]`
7. `""` — nothing is applied; the select waits for user interaction

Step 3 is the mirror of locale-select's `detectFromNavigator`, in the
same slot: `value > storage > detection > defaultValue > fallback`.
Set `detectFromSystem` and the select reads
`matchMedia("(prefers-color-scheme: dark)")` and resolves it to
`"dark"` or `"light"` — but only if that slug is in your `themes`, and
only on a first visit, since storage sits above it. It is a default,
not an override. `matchSystemTheme` is exported if you want the same
resolution server-side or in a test.

The select never displays the word `"default"`. Option labels
default to each hyphen-separated word of the slug title-cased
(e.g. `"light"` → `"Light"`, `"high-contrast"` → `"High Contrast"`);
override with `themeLabels`. That rule is the exported `themeName`,
the mirror of locale-select's `localeName` — import it rather than
re-deriving it when you build a sibling affordance.

## Rendered markup

```html
<div class="theme-select">
    <input type="hidden" name="theme" value="light" />

    <button type="button" class="theme-select-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
    </button>

    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true" data-active>Light</li>
        <li class="theme-select-option" id="theme-select-1-option-1"
            role="option" aria-selected="false">Dark</li>
    </ul>
</div>
```

Notes on the pieces:

- The root is a **`<div>`**, not a form control. `className` lands
  here, after `theme-select`.
- The **hidden input** carries the value so the control still
  participates in a surrounding `<form>`. Its `name` also
  discriminates the managed `<link>`, so two selects on one page need
  two distinct `name` values.
- The **button** is icon-only. Its glyph — `◑`, U+25D1 CIRCLE WITH
  RIGHT HALF BLACK, exported as `CIRCLE_WITH_RIGHT_HALF_BLACK` — is
  `aria-hidden`, which makes `aria-label` the button's entire
  accessible name. Pass a good one.
- The **listbox** carries `hidden` while closed, and
  `aria-activedescendant` only while open.
- **Options** carry two different states: `aria-selected="true"` is
  the theme in effect; `data-active` is where the keyboard is
  pointing. They are usually different options mid-navigation, and
  should be styled differently.
- **Ids** come from an incrementing module counter
  (`nextThemeSelectId()`), so they are stable, unique per instance,
  and identical on the server and the client — which is what keeps
  hydration and the ARIA wiring intact.

Read the active theme from `[(value)]` or the `themeChange` output.
See [docs/styling.md](./docs/styling.md) for the positioning recipe,
and [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs
and how to surface the active theme name.

## Inputs

The complete table is in [spec/index.md §4.1](./spec/index.md#41-inputs--outputs).
Highlights:

| Input          | Type                         | Required | Notes                                      |
| -------------- | ---------------------------- | -------- | ------------------------------------------ |
| `label`        | `string`                     | yes      | `aria-label` on both the button and the listbox. The button's entire accessible name. |
| `themesUrl`    | `string`                     | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`                   | yes      | Available slugs.                           |
| `value`        | `string` (`model`)           | no       | Two-way bind for the current slug.         |
| `defaultValue` | `string`                     | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                     | no       | `localStorage` persistence.                |
| `name`         | `string`                     | no       | Hidden-input `name` **and** managed-`<link>` discriminator; defaults to `"theme"`. |
| `extension`    | `string`                     | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`        | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>`     | no       | Per-slug display label override; also what the typeahead matches. |
| `className`    | `string`                     | no       | Extra class on the root `<div>`.           |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Outputs

| Output         | Payload  | When                                                  |
| -------------- | -------- | ----------------------------------------------------- |
| `valueChange`  | `string` | Implicit on the `value` `model` signal — drives `[(value)]`. |
| `themeChange`  | `string` | After the select applies a new theme (post-DOM-write). |

## Custom rendering

There is one rendering escape hatch: a projected `<ng-template>` that
**replaces the glyph inside the trigger button**.

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-theme-select>
```

The template receives the `ChildArgs` context —
`{ value, open, labelFor }` — as both `$implicit` and named
properties. The component queries it with `contentChild(TemplateRef)`,
so any projected `<ng-template>` matches. The optional exported
`ThemeSelectIcon` marker directive
(`<ng-template lilyThemeSelectIcon let-args>`) gives typed `let-`
variables under `strictTemplates`; it changes nothing at runtime.

**The template does not render options.** The listbox, its options,
and the whole ARIA and keyboard contract stay component-owned — that
is the point of the helper. The most common use is swapping the
default `◑` for an inline SVG you control, since the default glyph's
appearance depends on the user's installed fonts.

If you need a different control shape entirely (swatch grid,
segmented control), build it against the pure helpers and the
behavioural contract in [spec/index.md §5](./spec/index.md#5-behaviour)
rather than fighting the template.

Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`.
On a fresh mount the select reads back the stored slug as part of
the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the select
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/analog-cookie/`](./examples/analog-cookie/) recipe.

## Accessibility

- The control is a custom WAI-ARIA APG listbox. Every role, state,
  focus move, and keystroke is implemented by the component —
  **nothing is inherited from a native control**.
- The button carries `aria-haspopup="listbox"`, `aria-expanded`, and
  `aria-controls`; the `<ul>` carries `role="listbox"` and, while
  open, `aria-activedescendant`; each `<li>` carries `role="option"`
  and `aria-selected`.
- The active state is exposed in four independent channels:
  `aria-selected`, the hidden input's `value`, `data-theme` on the
  target, and the `value` model signal. No colour-only meaning is
  required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility — for the **button and the `<ul>`**,
  since the list holds focus while open.

Three tradeoffs are worth knowing before you adopt this, all covered
honestly in [docs/accessibility.md](./docs/accessibility.md#tradeoffs):

1. The button is icon-only, so `aria-label` is its entire accessible
   name — a poor label makes the control unusable to screen-reader
   and voice-control users, and no automated check will catch it.
2. A custom listbox has weaker and less consistent assistive-tech
   support than a native `<select>`, which gets platform-native
   behaviour (including the mobile picker) for free. This is a real
   regression, not a neutral difference.
3. The default glyph may render at an odd weight, render as tofu, or
   be missing entirely depending on platform font coverage.

The closed button also never names the active theme, which is why the
status-region pattern in the [quick start](#quick-start) is the
default rather than an optional extra.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## Keyboard

On the **button**:

| Key                 | Action                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / away from the button.                               |
| `Enter` / `Space`   | Open the listbox with the selected option active (index 0 if none). |
| `Arrow Down`        | Same as `Enter` / `Space`.                                          |
| `Arrow Up`          | Open the listbox with the **last** option active.                   |

Opening moves focus to the `<ul>`; the active option is conveyed by
`aria-activedescendant`, never by focusing an `<li>`.

On the **listbox**:

| Key                | Action                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `Arrow Down`       | Active option down one. **Clamps** at the last — no wrap.               |
| `Arrow Up`         | Active option up one. **Clamps** at the first — no wrap.                |
| `Home` / `End`     | First / last option becomes active.                                     |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus to the button.  |
| `Escape`           | Close and return focus to the button; the value is **not** changed.     |
| `Tab`              | Close without stealing focus back; the browser moves focus onward.      |
| Printable chars    | Typeahead over the display **labels**; the buffer resets after 500 ms.  |

Pointer and focus: clicking an option selects and applies it; clicking
outside the root closes the listbox; focus leaving the root closes it.

## SSR and hydration

The select compiles cleanly under Angular SSR (Analog v1 + Nitro,
Angular CLI's `@angular/ssr`). On the server no `effect()` writes
DOM (guarded by `typeof document !== "undefined"`), so the markup
renders using whatever `value` the consumer supplies via the input.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/analog-cookie/`](./examples/analog-cookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself in `index.html`:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.component.ts`](./examples/preloaded.component.ts).

## Multiple selects in one app

Pass a distinct `name` input to each select. The `name` is used as
both the hidden input's `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`), so two selects
sharing a `name` will fight over the same stylesheet link.

Example: [`examples/multiple-selects.component.ts`](./examples/multiple-selects.component.ts).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Analog before render.
- Migrating from a `localStorage`-only select to a cookie-backed
  one.
- Loading themes from a CDN.
- Cache-busting via `extension`.
- Synchronising theme across multiple tabs.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **The list pushes the page around when it opens.** The package
  ships no positioning CSS. Add `position: relative` on
  `.theme-select` and `position: absolute` on `.theme-select-list` —
  see [docs/styling.md](./docs/styling.md#positioning-the-list).
- **The list never closes.** An unconditional `display` rule on
  `.theme-select-list` overrides the `hidden` attribute. Scope it
  with `:not([hidden])`.
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
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria)
(§7.1–§7.19), including the full APG keyboard contract. Each test
name starts with the clause it covers.

## Files in this directory

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `spec/index.md`                           | Single source of truth — API, behaviour, tests.  |
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

---

Lily™ and Lily Design System™ are trademarks.
