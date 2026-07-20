# `<theme-select>` (HTML helper)

A reusable, headless vanilla HTML/JS theme select that **loads themes
dynamically at runtime** from a developer-specified directory,
packaged as a **web component (custom element)**.

The control is an **icon button that opens a dropdown listbox**
(WAI-ARIA APG listbox pattern) — not a native `<select>`.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [Rendered markup](#rendered-markup)
- [Styling is required](#styling-is-required)
- [How it works](#how-it-works)
- [Keyboard](#keyboard)
- [Default theme](#default-theme)
- [Attributes](#attributes)
- [JS properties](#js-properties)
- [Methods](#methods)
- [Events](#events)
- [Custom button rendering](#custom-button-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and static-site generation](#ssr-and-static-site-generation)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one page](#multiple-selects-in-one-page)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This element** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own every visual decision via the `theme-select`
  class hooks — including the dropdown's positioning.

The result is a small reusable widget that works in any HTML host
(static HTML, Eleventy, Astro, Hugo, plain Vite, any framework that
emits HTML) and against any theme catalog — Lily™'s 45 reference
themes (DaisyUI-inspired, NHS-aligned, and public-sector / vendor
reference themes), or your own bespoke set.

The element is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select`. APIs and behaviour match;
only the framework idioms differ. The change-notification path uses
a bubbling `CustomEvent` instead of Svelte's prop callback.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is the browser DOM.

```ts
// One side-effect import registers <theme-select> globally:
import "./lily-design-system-html-theme-select";

// Or grab the class + helpers + types:
import {
    ThemeSelect,
    normalizeThemesUrl,
    themeHref,
    nextThemeSelectId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    type ThemeSelectProps,
    type ThemeSelectChangeDetail,
} from "./lily-design-system-html-theme-select";
```

The barrel guards registration with
`customElements.get("theme-select")` so re-imports and SSR contexts
don't throw.

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `public/assets/themes/light.css`,
   `public/assets/themes/dark.css`. Each theme scopes its tokens to
   `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Place the custom element in your markup. On `connectedCallback`
   it renders an icon button plus a hidden dropdown listbox holding
   one option per theme.
3. **Add the positioning CSS.** The package ships no CSS, so the
   dropdown renders in flow until you position it. This is not
   optional — see [Styling is required](#styling-is-required).

```html
<script type="module" src="/dist/theme-select.js"></script>

<style>
    /* The minimum: make the dropdown float over the page. */
    .theme-select { position: relative; }
    .theme-select-list {
        position: absolute;
        inset-block-start: 100%;
        inset-inline-start: 0;
        z-index: 10;
    }
    .theme-select-option[data-active] { background: #eee; }
    .theme-select-option[aria-selected="true"] { font-weight: 600; }
</style>

<theme-select
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
    storage-key="lily-theme"
></theme-select>

<p class="theme-select-status" aria-live="polite">Active theme: Light</p>

<script type="module">
    await customElements.whenDefined("theme-select");

    const select = document.querySelector("theme-select");
    const status = document.querySelector(".theme-select-status");

    select.addEventListener("themechange", (e) => {
        status.textContent = `Active theme: ${select.labelFor(e.detail.theme)}`;
    });
</script>
```

**The status line is part of the pattern, not an optional extra.**
The closed control is an icon button — it shows a glyph and nothing
else — so this line is the only place the current selection is
displayed and announced. `aria-live="polite"` speaks on each change
and stays silent on first paint, which is why the initial text is
authored in the markup rather than written by JS on startup. Making
it visible (rather than `sr-only`) serves sighted and
cognitive-accessibility users too. `labelFor()` is a public method
on the element, so the line picks up `theme-labels` overrides and
translations for free. See
[`docs/accessibility.md`](./docs/accessibility.md) for the full
rationale and the visually-hidden variant.

When the user selects `dark`, the element:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- dispatches `new CustomEvent("themechange", { detail: { theme: "dark" }, bubbles: true, composed: true })`.

## Rendered markup

The element renders this into its light DOM:

```html
<theme-select label="Theme" themes-url="/assets/themes/" themes="light,dark,abyss">
    <div class="theme-select">
        <input type="hidden" name="theme" value="light" />
        <button type="button" class="theme-select-button"
                aria-label="Theme" aria-haspopup="listbox"
                aria-expanded="false" aria-controls="theme-select-1-list">
            <span class="theme-select-icon" aria-hidden="true">◑</span>
        </button>
        <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
            aria-label="Theme" tabindex="-1" hidden>
            <li class="theme-select-option" id="theme-select-1-option-0"
                role="option" aria-selected="true" data-active>Light</li>
            <li class="theme-select-option" id="theme-select-1-option-1"
                role="option" aria-selected="false">Dark</li>
            <li class="theme-select-option" id="theme-select-1-option-2"
                role="option" aria-selected="false">Abyss</li>
        </ul>
    </div>
</theme-select>
```

Points worth knowing:

- The **glyph** is U+25D1 CIRCLE WITH RIGHT HALF BLACK, exported as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is `aria-hidden="true"`, so the
  accessible name comes from the button's `aria-label` alone.
- The **hidden `<input>`** preserves form participation and carries
  `name` — a listbox is not a form control.
- **`aria-activedescendant`** appears on the `<ul>` only while open,
  pointing at the active option's id.
- **`data-active` is not `aria-selected`.** `data-active` marks the
  keyboard-highlighted option (where `Enter` would land);
  `aria-selected` marks the chosen one. They often differ while the
  list is open, and consumer CSS should style them differently.
- **ids** come from a module-level counter, so they are unique per
  instance, stable across runs, and SSR-safe.

Read the selection from `el.value` or the `themechange` detail. The
active theme is not visible anywhere while the list is closed, which
is why the [Quick start](#quick-start) pairs the element with a
status region by default; see [Accessibility](#accessibility).

## Styling is required

The package ships **no CSS at all**, and that includes positioning.
The element renders the dropdown as an ordinary `<ul>` and toggles
its `hidden` attribute; it sets no `position`, no `z-index`, and no
offsets.

So out of the box the list appears *below the button in normal
flow*, pushing subsequent content down when it opens. That is
expected, not a bug. The minimum fix:

```css
.theme-select { position: relative; }

.theme-select-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 10;
}
```

One trap to know about: if you set any `display` value on
`.theme-select-list`, it overrides the user-agent
`[hidden] { display: none }` rule and the closed list stays visible.
Re-assert `.theme-select-list[hidden] { display: none }` after your
rule, or scope yours with `:not([hidden])`.

Full hook list, state selectors, and a complete worked example:
[`docs/styling.md`](./docs/styling.md).

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
4. **Persist + notify**: if `storage-key` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   dispatch `themechange` with the slug in `event.detail.theme`.

All four steps are SSR-safe — the element only mutates the DOM inside
`connectedCallback` and `attributeChangedCallback`, which never run
in Node.

## Keyboard

The control implements the WAI-ARIA APG listbox pattern in
JavaScript; none of this comes from the platform.

On the button:

| Key                 | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `ArrowDown`         | Open the list with the selected option active (else the first). |
| `Enter` / `Space`   | Same as `ArrowDown`.                                          |
| `ArrowUp`           | Open the list with the **last** option active.                |

Opening moves focus to the `<ul>`. On the list:

| Key                 | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option; clamps at both ends (no wrapping). |
| `Home` / `End`      | Jump to the first / last option.                              |
| `Enter` / `Space`   | Select the active option, apply, close, refocus the button.   |
| `Escape`            | Close and refocus the button without changing the theme.      |
| `Tab`               | Close without stealing focus back.                            |
| printable character | Typeahead over the option labels; buffer resets after 500 ms. |

Focus sits on the `<ul>` while open, never on an `<li>` — the
highlighted option is conveyed by `aria-activedescendant`. That is
why consumer CSS must style `.theme-select-option[data-active]`
rather than `:focus`.

Clicking outside the control, or moving focus out of it, closes the
list.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first
`connectedCallback` is:

1. `value` attribute (if non-empty)
2. `localStorage[storage-key]` (if `storage-key` is set and readable)
3. `matchSystemTheme(themes)` (if `detect-from-system` is set) —
   `prefers-color-scheme` mapped to the `"dark"` / `"light"` slug, or
   `""` when that slug is absent or `matchMedia` is unavailable
4. `default-value` attribute
5. `"light"` (if present in `themes`)
6. `themes[0]`
7. `""` — nothing is applied; the select waits for user interaction

The control never displays the word `"default"`. Option labels
default to the title-cased slug, per hyphen-separated word
(`"light"` → `"Light"`, `"high-contrast"` → `"High Contrast"`);
override with `theme-labels` (JSON-encoded object).

## Attributes

The complete table is in [spec/index.md §4.1](./spec/index.md#41-observed-attributes).
Highlights:

| Attribute       | Type           | Required | Notes                                      |
| --------------- | -------------- | -------- | ------------------------------------------ |
| `label`         | string         | yes      | `aria-label` on the button and the listbox. The control is icon-only, so this is the entire accessible name. |
| `themes-url`    | string         | yes      | Trailing `/` is auto-added.                |
| `themes`        | string (CSV)   | yes      | Available slugs, e.g. `"light,dark"`.      |
| `value`         | string         | no       | Currently selected slug.                   |
| `default-value` | string         | no       | Initial when nothing else applies.         |
| `storage-key`   | string         | no       | `localStorage` persistence.                |
| `detect-from-system` | boolean attr | no  | Resolve `prefers-color-scheme` on first visit. Mirrors locale-select's `detect-from-navigator`. |
| `name`          | string         | no       | Hidden `<input>` `name` and managed-`<link>` discriminator; defaults to `"theme"`. |
| `extension`     | string         | no       | Defaults to `".css"`.                      |
| `theme-labels`  | string (JSON)  | no       | `{ "light": "Bright" }` overrides.         |
| `class`         | string         | no       | Extra class on the rendered root `<div>`.  |

There is no `placeholder` attribute; it was removed along with the
native `<select>`.

See [docs/attributes-reference.md](./docs/attributes-reference.md) for
a field-by-field reference.

## JS properties

Every observed attribute mirrors a JS property of the same name (in
camelCase):

| Property          | Type                     | Notes                                              |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `el.label`        | `string`                 | round-trips with `label` attribute                 |
| `el.themesUrl`    | `string`                 | round-trips with `themes-url`                      |
| `el.themes`       | `string[]`               | CSV-encoded in the `themes` attribute              |
| `el.value`        | `string`                 | round-trips with `value`                           |
| `el.defaultValue` | `string`                 | round-trips with `default-value`                   |
| `el.storageKey`   | `string`                 | round-trips with `storage-key`                     |
| `el.detectFromSystem` | `boolean`            | round-trips with `detect-from-system` (presence)   |
| `el.name`         | `string`                 | round-trips with `name`                            |
| `el.extension`    | `string`                 | round-trips with `extension`                       |
| `el.themeLabels`  | `Record<string, string>` | JSON-encoded in `theme-labels`                     |
| `el.target`       | `HTMLElement \| null`    | no attribute form (HTMLElement is not serialisable) |

Array / object properties accept the native form:

```ts
const select = document.querySelector("theme-select") as ThemeSelect;
select.themes = ["light", "dark", "abyss"];
select.themeLabels = { light: "Bright", dark: "Midnight" };
```

## Methods

Beyond the attribute mirrors, the element exposes the listbox state
and a small imperative API:

| Member                     | Type      | Notes                                                       |
| -------------------------- | --------- | ------------------------------------------------------------ |
| `el.open`                  | `boolean` | Read-only. Whether the listbox is open.                      |
| `el.listId`                | `string`  | Read-only. id of the rendered `<ul role="listbox">`.         |
| `el.optionId(index)`       | `string`  | id of the rendered option at `index`.                        |
| `el.openList(startIndex?)` | `void`    | Open the list; `startIndex` overrides the active option. Moves focus to the `<ul>`. |
| `el.closeList(refocus?)`   | `void`    | Close the list. Returns focus to the button unless `refocus` is `false`. |
| `el.labelFor(slug)`        | `string`  | Display label for a slug — applies `theme-labels`, else title-cases. |
| `el.renderButtonContent()` | `Node`    | Overridable hook building the button's content.              |

```ts
const select = document.querySelector<ThemeSelect>("theme-select")!;

select.openList();          // open on the selected option
select.closeList(false);    // close without moving focus
select.labelFor("light");   // → "Light"
```

## Events

| Event           | Detail              | Bubbles | Composed | When                                                  |
| --------------- | ------------------- | ------- | -------- | ----------------------------------------------------- |
| `themechange`   | `{ theme: string }` | yes     | yes      | After the select applies a new theme.                 |

```ts
const select = document.querySelector("theme-select")!;
select.addEventListener("themechange", (e) => {
    const { theme } = (e as CustomEvent<{ theme: string }>).detail;
    console.log("theme is now", theme);
});
```

Because the event bubbles, event delegation works too:

```ts
document.body.addEventListener("themechange", handleThemeChange);
```

## Custom button rendering

The HTML helpers don't expose Vue scoped slots or Svelte snippets —
`<slot>` is Shadow DOM only, and these helpers commit to light DOM.
The equivalent of the other frameworks' `children` is an overridable
method, **`renderButtonContent()`**. Whatever `Node` it returns
replaces the default glyph inside the button:

```ts
import { ThemeSelect } from "./lily-design-system-html-theme-select";

class MyThemeSelect extends ThemeSelect {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);   // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);           // ChildArgs.open
        return span;
    }
}

customElements.define("my-theme-select", MyThemeSelect);
```

`this.value`, `this.open`, and `this.labelFor(...)` stand in for the
`ChildArgs` the other frameworks pass. The base class still builds
the button and the listbox, so all the aria wiring and the whole
keyboard contract keep working — **this is the recommended
customisation path**, and the only one that cannot break
accessibility.

A subclass that needs a fundamentally different structure has to
post-process after `super.connectedCallback()` (`#render()` is a
private field and cannot be overridden), and in doing so takes over
the entire accessibility contract.

Working example: [`examples/09-custom-rendering.html`](./examples/09-custom-rendering.html).
Topic guide, both tiers, and the invariants:
[`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storage-key` to persist the active slug to `localStorage`.
On a fresh mount the select reads back the stored slug as part of
the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the select
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/eleventy-cookie/`](./examples/eleventy-cookie/) recipe.

## Accessibility

- The control implements the WAI-ARIA APG listbox pattern: a
  `<button aria-haspopup="listbox">` paired with a
  `<ul role="listbox">`, with `aria-label={label}` on both.
- The full keyboard contract is implemented in JS — see
  [Keyboard](#keyboard).
- The active state is exposed via `aria-selected`, `data-theme` on
  the root, the host's `value`, and the hidden input. No colour-only
  meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility — style
  `.theme-select-list:focus-visible` too, since focus moves to the
  `<ul>` while the list is open.

**Three tradeoffs to know about**, all documented in full in
[`docs/accessibility.md`](./docs/accessibility.md):

1. **Icon-only control.** `aria-label` is the entire accessible
   name. A vague `label` makes the control unusable to
   screen-reader users, and the absence of a visible label means the
   control fails WCAG 2.5.3 Label in Name unless you add one.
2. **A custom listbox is weaker than a native `<select>`.** The old
   native control got combobox semantics, platform keyboard
   behaviour, mobile OS pickers, and typeahead for free, all
   battle-tested in every AT. An APG listbox with
   `aria-activedescendant` has more variable support across screen
   readers and mobile browsers, and no native mobile picker.
3. **Glyph rendering is platform-dependent.** No font is bundled, so
   the glyph may render as colour emoji, monochrome, or tofu.
   Override `renderButtonContent()` with your own SVG when the
   appearance must be guaranteed.

Because the closed button shows only a glyph, the active theme is
not visible or announced anywhere unless you surface it. The status
region shown in [Quick start](#quick-start) is the **default
pattern** — ship it unless you have a specific reason not to.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and static-site generation

The element compiles cleanly under static-site generators (Eleventy,
Astro, Hugo, Jekyll). On the server no lifecycle hook runs and no
DOM is touched; the SSG emits the literal `<theme-select>` tag, and
the browser upgrades it after the JS loads.

For zero-flicker static rendering, resolve the theme at build time
(or via cookie for dynamic SSR) and pre-render two things:

- `<html data-theme="…">` in the document shell
- a matching `<link rel="stylesheet">` for the chosen theme

Then pass the resolved value as the `value` attribute on the host so
the select doesn't re-resolve from storage and clobber the inlined
attribute.

See [`docs/ssr.md`](./docs/ssr.md) and
[`examples/eleventy-cookie/`](./examples/eleventy-cookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/05-preloaded.html`](./examples/05-preloaded.html).

## Multiple selects in one page

Pass a distinct `name` attribute to each control. The `name` is used
as both the hidden `<input>`'s `name` and the discriminator on the
managed `<link>` element (`data-lily-theme-select="{name}"`). Option
and list ids are unique per instance automatically.

Example: [`examples/03-multiple-selects.html`](./examples/03-multiple-selects.html).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Eleventy before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Positioning the dropdown, and putting the theme name on the button.
- Opening / closing the list from your own code.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **The dropdown pushes the page down.** The package ships no CSS.
  Give the root `position: relative` and the list
  `position: absolute`.
- **The dropdown never hides.** A `display` rule on
  `.theme-select-list` beats the UA's `[hidden] { display: none }`.
  Re-assert it, or scope your rule with `:not([hidden])`.
- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
- **404 on theme href.** Check the file is served from `themes-url`
  and uses the configured `extension` (defaults to `.css`).
- **Flash of default theme.** Pass a build-time-resolved `value`
  attribute and inline `<html data-theme>` in the SSG output.
- **Theme does not persist.** Confirm `storage-key` is set and that
  `localStorage` is available (not blocked by private mode).

## Testing

```sh
pnpm test
```

Runs the vitest + jsdom suite that exercises every numbered
acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec/index.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `theme-select.ts`     | The custom-element class.                        |
| `theme-select.test.ts`| vitest suite covering every spec §7 item.        |
| `index.ts`            | Barrel + side-effectful `customElements.define`. |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable `.html` files.                          |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
