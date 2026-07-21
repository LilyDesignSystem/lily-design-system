# ThemeChooser — Specification

Single source of truth for the `lily-design-system-svelte-theme-chooser`
Svelte helper. This file drives
implementation, testing, and documentation in the spec-driven-development
style: anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Sibling files in this directory:

- `ThemeChooser.svelte` — the implementation
- `ThemeChooser.test.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-svelte-headless/components/ThemeChooser/`) is a pure
container — a native `<select>` + `<option>` children. This helper is the
opinionated, reusable counterpart that owns the dynamic loading lifecycle.

---

## 1. Goal

Give a Svelte 5 application a drop-in, headless theme select that:

1. Renders an accessible icon button that opens a WAI-ARIA APG listbox
   of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-chooser` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the component. Themes are author-owned
  static assets the consumer drops into their `static/` or `public/`
  directory.
- Auto-discovering themes via directory listing. Browsers cannot list a
  directory, so the consumer always supplies the list of available theme
  slugs (or fetches a manifest themselves and passes the result in).
- Providing colour, spacing, or typography values. Theme tokens live inside
  each theme CSS file.
- SvelteKit-only features. The component only depends on Svelte 5 + DOM
  APIs and runs in any Svelte 5 host (SvelteKit, plain Vite + Svelte,
  Astro, Storybook).
- A `ThemeProvider` style wrapper. Theme application happens at the
  document root, not in a wrapping element.
- A combobox with a text input. The control is a button + listbox
  (APG Listbox pattern), not the APG Combobox pattern; there is no
  editable field and no autocomplete.

## 3. Architectural decisions

- **Icon button + listbox, not a native `<select>`.** The closed
  control is a single glyph-width button, so it costs the same page
  space whether the catalog holds three themes or forty-five with
  names like
  `united-kingdom-national-health-service-england-for-patients`. The
  cost is a hand-rolled listbox; §6 states that tradeoff honestly.
- **One `<link>` per select name.** Switching themes mutates `href` on a
  single `<link rel="stylesheet" data-lily-theme-chooser="{name}">`. Only
  the active theme is fetched; previously-active CSS is unloaded when the
  href changes. Multiple selects can coexist by passing distinct `name`
  props.
- **`data-theme` attribute is the activation switch.** Theme CSS files
  scope their `:root[data-theme="slug"]` rules so that authors can
  preload multiple themes (one `<link>` per theme) and switch between
  them with only the attribute change. The default loading strategy
  ("swap-link") covers the common case; consumers who want to preload
  all themes can drop their own `<link>` tags and rely on the attribute
  change alone — see §6.4.
- **TypeScript everywhere.** Public surface is fully typed via a `Props`
  type exported from `ThemeChooser.svelte` and re-exported from
  `index.ts`.
- **SSR-safe.** The component compiles cleanly under
  `@sveltejs/vite-plugin-svelte` SSR. All DOM mutations happen inside
  `$effect`, which only runs in the browser.
- **No dependencies beyond `svelte`.** No localStorage wrappers, no
  fetch wrappers, no UUID library.
- **Two-way bindable `value`.** Consumers can `bind:value` to the
  selected theme slug. The component is fully controlled when `value`
  is provided and uncontrolled (resolves from `defaultValue` or storage)
  otherwise.

## 4. Public API

### 4.1 Props

| Prop            | Type                                      | Required | Default                  | Purpose |
| --------------- | ----------------------------------------- | -------- | ------------------------ | ------- |
| `label`         | `string`                                  | yes      | —                        | Accessible name for **both** the button and the listbox. |
| `themesUrl`     | `string`                                  | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string[]`                                | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`         | `string` (bindable)                       | no       | `""`                     | Currently selected theme slug. |
| `defaultValue`  | `string`                                  | no       | `"light"` if present in `themes`, else first item | Initial theme when nothing else is supplied. |
| `storageKey`    | `string`                                  | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detectFromSystem` | `boolean`                              | no       | `false`                  | If true and no value/storage entry exists, resolve `prefers-color-scheme` to a supported theme. |
| `name`          | `string`                                  | no       | `"theme"`                | `name` of the hidden input; also discriminates the managed `<link>`. |
| `extension`     | `string`                                  | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `target`        | `HTMLElement \| null`                     | no       | `document.documentElement` | Element that receives `data-theme`. |
| `themeLabels`   | `Record<string, string>`                  | no       | `{}`                     | Optional pretty labels per slug. |
| `children`      | `Snippet<[ChildArgs]>`                    | no       | the `◑` glyph            | **Replaces the glyph inside the button.** It does not render options. |
| `onChange`      | `(theme: string) => void`                 | no       | `undefined`              | Fires after the select applies a new theme. |
| `class`         | `string`                                  | no       | `""`                     | Extra CSS class on the root `<div>`. |
| `...restProps`  | any HTML attributes                       | no       | —                        | Spread onto the root `<div>`. |

There is **no `placeholder` prop.** It existed in 0.3.0 to name the
pinned option of a native `<select>`; there is no `<select>` and no
pinned option any more.

`ChildArgs` shape:

```ts
type ChildArgs = {
  /** Currently selected theme slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (theme: string) => string;
};
```

### 4.2 DOM contract

```html
<div class="theme-chooser {class}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">◑</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of the active option, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Light</li>
  </ul>
</div>
```

- **Root** is a `<div>` carrying `theme-chooser` plus the consumer's
  `class`; rest-props spread onto it.
- **Hidden input** preserves form participation. Its `name` is the
  `name` prop, which *also* discriminates the managed `<link>`.
- **Button glyph** is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`◑`,
  `&#9681;`), exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is wrapped
  in `aria-hidden="true"`: the accessible name comes from the button's
  `aria-label`, never from the glyph.
- **`children` replaces the glyph**, not the options. It receives
  `ChildArgs` and renders inside the `<button>`. When it is supplied,
  no `.theme-chooser-icon` span is emitted.
- **Listbox** is `hidden` while closed. `aria-activedescendant` is
  present only while open with an active option; focus sits on the
  `<ul>` itself (`tabindex="-1"`), per the APG listbox pattern.
- **Options** carry `aria-selected` reflecting the active theme, and
  `data-active` (a bare attribute) on the keyboard-active option.
- **Option ids** are unique per instance, generated by an incrementing
  module counter (`nextThemeChooserId`) — SSR-safe, never
  `Math.random()` / `Date.now()`.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
  `themeName(slug)`, which title-cases each hyphen-separated word
  (`"high-contrast"` → `"High Contrast"`). The select never emits the
  word "default".
- A single managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">`
  in `document.head`. Created on first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every apply.
- The package ships zero CSS. **The listbox needs positioning CSS from
  the consumer** — without it the `<ul>` renders in normal flow rather
  than as an overlay. See `docs/styling.md`.

### 4.3 Re-exports

`ThemeChooser.svelte`'s module script exports:

- `default` (the component)
- `normaliseThemesUrl`, `themeHref`, `themeName`, `matchSystemTheme`,
  `nextThemeChooserId` (pure helpers)
- `CIRCLE_WITH_RIGHT_HALF_BLACK` (the default glyph constant)
- `type Props`, `type ChildArgs`

`index.ts` currently re-exports a subset:

- `default`, `ThemeChooser` (named alias of the default export)
- `normaliseThemesUrl`, `themeHref`
- `type Props`, `type ChildArgs`

`themeName`, `matchSystemTheme`, and
`CIRCLE_WITH_RIGHT_HALF_BLACK` are importable from
`./ThemeChooser.svelte` directly but are **not yet** in the barrel.
Widening the barrel to match `locale-chooser`'s (which re-exports all
of its pure helpers) is a pending follow-up.

## 5. Behaviour

### 5.1 URL construction

For a theme slug, the loaded URL is exactly:

```
normalise(themesUrl) + slug + extension
```

`normalise` ensures exactly one trailing `/`. If `themesUrl` ends with
`/`, it is used as-is; otherwise one `/` is appended. The component does
not URL-encode the slug; consumers must pick slugs that are safe URL
path segments (kebab-case ASCII is recommended).

### 5.2 Initial value resolution

On first effect run in the browser, the initial theme is the first
non-empty value of:

1. `value` (if a consumer supplied a non-empty string)
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw)
3. `matchSystemTheme(themes)` (only if `detectFromSystem` is true) —
   see §5.2.1
4. `defaultValue`
5. `"light"` (if `"light"` is in `themes`)
6. `themes[0]`
7. `""` (no apply happens — the select waits for user interaction)

This is the same shape `locale-chooser` uses, with system detection
sitting in the slot navigator detection occupies there:
`value > storage > DETECTION > defaultValue > "light"/"en" > first`.

Rationale: `"light"` is the conventional baseline theme for Lily and
for the broader DaisyUI palette this helper draws from. The select
never displays the word "default" — option labels are derived from the
slugs (title-cased by `themeName`) or from `themeLabels`.

Resolution writes back to `value` (via the bindable) so consumers
observing the bound variable see the resolved value.

#### 5.2.1 System colour-scheme matching

When `detectFromSystem` is true, `matchSystemTheme(themes)` reads
`matchMedia("(prefers-color-scheme: dark)")`, maps the result to the
slug `"dark"` or `"light"`, and returns it only if that slug is in
`themes`. It returns `""` when:

- the preferred scheme's slug is not in `themes`, **or**
- `window` / `window.matchMedia` is unavailable (SSR, and jsdom, which
  does not implement `matchMedia`).

Detection is off unless opted in, and storage always wins over it: a
user who explicitly picked a theme keeps it when they later change
their OS setting.

This mirrors `matchNavigatorLanguage(navLangs, locales)` in
`locale-chooser`.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-chooser="{name}"`).
2. Set `link.href = normalise(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Call `onChange(slug)` if supplied.

### 5.4 Reactivity

A single `$effect` re-applies the theme whenever `value` changes
(including the bind-back from a consumer or from initial-value
resolution). Other prop changes (`themesUrl`, `extension`, `target`,
`name`) take effect on the next theme change, not retroactively. This
keeps the effect's dependency graph small and avoids surprise re-fetches
when the consumer mutates labels.

### 5.5 SSR

During server rendering, no effects run and no DOM is touched. The
markup renders with the value supplied by the consumer (if any).
Consumers wanting flicker-free first paint pass a server-resolved
`value` (from a cookie, header, etc.).

## 6. Accessibility

### 6.1 Roles and properties

| Element  | Role / property | Source |
| -------- | --------------- | ------ |
| `<button>` | implicit `role="button"` | Browser |
| `<button>` | `aria-label="{label}"` | Consumer prop |
| `<button>` | `aria-haspopup="listbox"` | Component |
| `<button>` | `aria-expanded="true\|false"` | Component |
| `<button>` | `aria-controls="{listId}"` | Component |
| `<span>` glyph | `aria-hidden="true"` | Component |
| `<ul>`   | `role="listbox"` | Component |
| `<ul>`   | `aria-label="{label}"` | Consumer prop |
| `<ul>`   | `aria-activedescendant="{optionId}"` while open | Component |
| `<li>`   | `role="option"` | Component |
| `<li>`   | `aria-selected="true\|false"` | Component |

The control follows the **WAI-ARIA APG Listbox** pattern (button +
popup listbox), not the Combobox pattern: there is no text input and
no autocomplete.

### 6.2 Keyboard contract

Implemented by the component — none of this comes from the platform.

On the **button**:

| Key | Action |
| --- | ------ |
| `Tab` / `Shift+Tab` | Move focus to / from the button (one tab stop). |
| `Enter` | Open the listbox with the selected option active (or index 0). |
| `Space` | Same as `Enter`. |
| `Arrow Down` | Same as `Enter`. |
| `Arrow Up` | Open the listbox with the **last** option active. |

Opening moves focus to the `<ul>`; the active option is conveyed by
`aria-activedescendant`, not by moving DOM focus onto the `<li>`.

On the **listbox**:

| Key | Action |
| --- | ------ |
| `Arrow Down` | Move the active option down one. **Clamps** at the last option — it does not wrap. |
| `Arrow Up` | Move the active option up one. Clamps at the first. |
| `Home` | Make the first option active. |
| `End` | Make the last option active. |
| `Enter` | Select the active option, apply it, close, and return focus to the button. |
| `Space` | Same as `Enter`. |
| `Escape` | Close and return focus to the button **without** changing the value. |
| `Tab` | Close without stealing focus back, so focus moves on normally. |
| Printable character | Typeahead over the option **labels**; the buffer resets after 500 ms of inactivity. Search runs forward from the active option and wraps once. |

Pointer behaviour: clicking an option selects and applies it; clicking
outside the root closes the listbox; focus leaving the root closes it.

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 Preloading strategy (consumer choice)

The default ("swap-link") loads exactly one theme at a time. A consumer
who wants instant switching can:

1. Drop their own `<link rel="stylesheet"
   href="/assets/themes/{slug}.css">` tags for every theme in the
   document `<head>` (so all theme CSS files are preloaded and parsed).
2. Continue to use this select — the select still updates `data-theme`,
   and because every theme's CSS rule set is scoped to
   `:root[data-theme="{slug}"]`, the active rules switch instantly with
   the attribute.

This is documented in §6.4 of `index.md` for adopters who care about
zero-flicker switching.

### 6.5 Accessibility tradeoffs

Three costs come with the icon-button-plus-listbox shape. They are
stated in full, with mitigations, in
[`docs/accessibility.md`](../docs/accessibility.md):

1. The control is icon-only, so its accessible name rests entirely on
   `aria-label`.
2. A hand-rolled listbox has weaker assistive-technology support than a
   native `<select>`.
3. The glyph is a font-dependent character that may substitute or fail
   to render.

## 7. Testing acceptance criteria

`ThemeChooser.test.ts` asserts every clause below, and each `test(...)`
title is prefixed with its clause number so a reviewer can spot a
missing one. Tests run under vitest + jsdom +
`@testing-library/svelte`.

Three untagged pure-helper tests also run: `normaliseThemesUrl` keeps
an existing trailing slash, appends a missing one, and `themeHref`
builds the href from both forms.

### Markup contract (mirrors §4.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.1 | Renders a `<button type="button">` with `aria-haspopup="listbox"`, `aria-expanded="false"`, and an `aria-controls` pointing at an element whose `role` is `listbox`. |
| §7.1 | The button renders the half-circle glyph `◑` inside `.theme-chooser-icon`, carrying `aria-hidden="true"`. |
| §7.2 | `aria-label` names **both** the button and the listbox. |
| §7.3 | One `.theme-chooser-option` per entry in `themes`; the hidden input carries the supplied `name` and the resolved value. |
| §7.4 | The listbox is `hidden` until the button is activated; activating it clears `hidden` and sets `aria-expanded="true"`. |
| §7.4 | Exactly one option has `aria-selected="true"`, and it is the active theme. |
| §7.5 | Default labels title-case the slug; the word "default" never appears. |
| §7.5 | `themeLabels` overrides the default title-cased label. |

### Dynamic loading (mirrors §5)

| Clause | Test asserts |
| ------ | ------------ |
| §7.6 | The default initial value is `"light"` when present in `themes`. |
| §7.6 | It falls back to `themes[0]` when `"light"` is absent. |
| §7.7 | A managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">` is injected with the resolved href. |
| §7.8 | Selecting an option updates the link `href` and `data-theme`, and fires `onChange` with the new slug. |
| §7.9 | With `storageKey` set, the slug is written to `localStorage` and read back on a fresh mount. |
| §7.10 | A supplied `value` prop wins over storage and defaults. |
| §7.11 | A `themesUrl` with no trailing slash still yields exactly one slash. |

### Spread and custom children (mirrors §4.1)

| Clause | Test asserts |
| ------ | ------------ |
| §7.12 | Extra attributes (e.g. `data-testid`) spread onto the root. |
| §7.13 | A `children` snippet **replaces the button glyph**: the custom node renders inside `.theme-chooser-button`, no `.theme-chooser-icon` is emitted, and the snippet receives `ChildArgs` (`value`, `open`, `labelFor`). |

### Keyboard contract (mirrors §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.14 | `ArrowDown`, `Enter` and `Space` on the button all open the listbox. |
| §7.14 | `ArrowUp` opens with the **last** option active. |
| §7.15 | `ArrowDown` / `ArrowUp` move `aria-activedescendant` and clamp at the ends rather than wrapping. |
| §7.15 | `Home` and `End` jump to the first and last option. |
| §7.16 | `Enter` selects the active option, applies it, closes the listbox, and clears `aria-expanded`. |
| §7.16 | `Escape` closes without changing the theme. |
| §7.17 | A printable character runs typeahead over the labels and moves `aria-activedescendant`. |

### Harmonised surface with locale-chooser (mirrors §5.2.1)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | `themeName` title-cases each hyphen-separated word (`"high-contrast"` → `"High Contrast"`). |
| §7.18 | `themeName` is what the default option label uses. |
| §7.19 | `matchSystemTheme` resolves the OS colour scheme to a supported slug, and returns `""` when that slug is not on offer. |
| §7.19 | `matchSystemTheme` resolves `"light"` when dark is not preferred. |
| §7.19 | `matchSystemTheme` returns `""` when `matchMedia` is unavailable (SSR). |
| §7.20 | `detectFromSystem` resolves the initial theme. |
| §7.20 | Storage still wins over system detection. |
| §7.20 | Detection is off unless opted in. |

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme. The
  headless `ThemeView` already exists upstream.
- *Tracking* `prefers-color-scheme` over the session. `detectFromSystem`
  (§5.2.1) resolves it once on first visit; re-applying when the user
  flips their OS setting mid-session is the consumer's job — see
  `docs/recipes.md`.
- A non-`<link>` loader that injects a `<style>` block (useful for CSP
  contexts that block external stylesheets but allow inline). Could be
  added behind a `loader` prop.
- A `preload` prop that adds `<link rel="preload" as="style">` tags for
  every available theme.
- Shipped positioning CSS for the listbox. The package stays headless;
  the consumer positions the popup.

## 9. Tracking

- Package directory: `lily-design-system-svelte-helpers/lily-design-system-svelte-theme-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
