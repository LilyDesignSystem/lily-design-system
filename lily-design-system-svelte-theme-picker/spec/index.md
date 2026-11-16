# ThemePicker — Specification

Single source of truth for the `@lilydesignsystem/svelte-theme-picker`
Svelte helper. This file drives
implementation, testing, and documentation in the spec-driven-development
style: anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Sibling files in this directory:

- `ThemePicker.svelte` — the implementation
- `ThemePicker.test.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-svelte-headless/components/ThemePicker/`) is a pure
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
   `theme-picker` class hook.

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
  single `<link rel="stylesheet" data-lily-theme-picker="{name}">`. Only
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
  type exported from `ThemePicker.svelte` and re-exported from
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

| Prop               | Type                      | Required | Default                                           | Purpose                                                                                         |
| ------------------ | ------------------------- | -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `label`            | `string`                  | yes      | —                                                 | Accessible name for **both** the button and the listbox.                                        |
| `themesUrl`        | `string`                  | yes      | —                                                 | Base URL of the themes directory. Trailing `/` is auto-normalised.                              |
| `themes`           | `string[]`                | yes      | —                                                 | Available theme slugs (e.g. `["light", "dark", "abyss"]`).                                      |
| `value`            | `string` (bindable)       | no       | `""`                                              | Currently selected theme slug.                                                                  |
| `defaultValue`     | `string`                  | no       | `"light"` if present in `themes`, else first item | Initial theme when nothing else is supplied.                                                    |
| `storageKey`       | `string`                  | no       | `undefined`                                       | If set, persist the selection to `localStorage` under this key.                                 |
| `detectFromSystem` | `boolean`                 | no       | `false`                                           | If true and no value/storage entry exists, resolve `prefers-color-scheme` to a supported theme. |
| `systemLabel`      | `string`                  | no       | `undefined`                                       | Adds a first option, value `"system"`, that follows the device (§5.6). No English default.      |
| `systemThemes`     | `{ light; dark }`         | no       | `{ light: "light", dark: "dark" }`                | The themes the `"system"` option applies for a light and a dark device.                         |
| `cookieName`       | `string`                  | no       | `undefined`                                       | If set, keep the choice in a first-party cookie of this name (§5.7).                            |
| `name`             | `string`                  | no       | `"theme"`                                         | `name` of the hidden input; also discriminates the managed `<link>`.                            |
| `extension`        | `string`                  | no       | `".css"`                                          | File extension appended to each slug when constructing the URL.                                 |
| `target`           | `HTMLElement \| null`     | no       | `document.documentElement`                        | Element that receives `data-theme`.                                                             |
| `themeLabels`      | `Record<string, string>`  | no       | `{}`                                              | Optional pretty labels per slug.                                                                |
| `children`         | `Snippet<[ChildArgs]>`    | no       | the default SVG icon                              | **Replaces the icon inside the button.** It does not render options.                            |
| `onChange`         | `(theme: string) => void` | no       | `undefined`                                       | Fires after the select applies a new theme.                                                     |
| `variant`          | `"listbox" \| "select"`   | no       | `"listbox"`                                       | `"select"` renders a native `<select>` instead of the button and listbox; see §select.          |
| `class`            | `string`                  | no       | `""`                                              | Extra CSS class on the root `<div>`.                                                            |
| `...restProps`     | any HTML attributes       | no       | —                                                 | Spread onto the root `<div>`.                                                                   |

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
<div
  class="theme-picker {class}"
  ...restProps
>
  <input
    type="hidden"
    name="{name}"
    value="{value}"
  />
  <button
    type="button"
    class="theme-picker-button"
    aria-label="{label}"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{listId}"
  >
    <svg
      class="theme-picker-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
      />
      <path
        d="M8 2a6 6 0 0 1 0 12z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  </button>
  <div
    class="theme-picker-tooltip"
    role="tooltip"
    id="{tooltipId}"
    hidden
  >
    {label}
  </div>
  <ul
    class="theme-picker-list"
    id="{listId}"
    role="listbox"
    aria-label="{label}"
    tabindex="-1"
    hidden
    aria-activedescendant="{optionId of the active option, only while open}"
  >
    <li
      class="theme-picker-option"
      id="{optionId}"
      role="option"
      aria-selected="true|false"
      data-active
    >
      Light
    </li>
  </ul>
</div>
```

**Tooltip.** `.theme-picker-tooltip` is a sibling right after the button, always in
the DOM, `hidden` at rest, holding the button's `label` text. It is shown
while the pointer is over the button or over the tooltip itself
(hoverable) and while the button has keyboard focus (`:focus-visible`);
`Escape` dismisses it without moving focus, wherever focus is while the
tooltip is visible (a document-level `keydown` listener present only
while it is visible, so hover-only tooltips are dismissable too —
WCAG 1.4.13) (until the pointer or focus re-enters); it is never shown while the listbox is open. It is purely
visual: the text duplicates the button's `aria-label`, so it is
deliberately **not** linked with `aria-describedby` (that would announce
the name twice). Position and appearance are consumer/theme CSS, via the
`hidden` attribute.

- **Root** is a `<div>` carrying `theme-picker` plus the consumer's
  `class`; rest-props spread onto it.
- **Hidden input** preserves form participation. Its `name` is the
  `name` prop, which _also_ discriminates the managed `<link>`.
- **Button icon** is a bundled SVG (contrast/half-circle, `viewBox="0
0 16 16"`), not a Unicode character (reversed 2026-09-16 — see §9).
  It is wrapped in `aria-hidden="true"`: the accessible name comes
  from the button's `aria-label`, never from the icon.
- **`children` replaces the icon**, not the options. It receives
  `ChildArgs` and renders inside the `<button>`. When it is supplied,
  no `.theme-picker-icon` span is emitted.
- **Listbox** is `hidden` while closed. `aria-activedescendant` is
  present only while open with an active option; focus sits on the
  `<ul>` itself (`tabindex="-1"`), per the APG listbox pattern.
- **Options** carry `aria-selected` reflecting the active theme, and
  `data-active` (a bare attribute) on the keyboard-active option.
- **Option ids** are unique per instance, generated by an incrementing
  module counter (`nextThemePickerId`) — SSR-safe, never
  `Math.random()` / `Date.now()`.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
  `themeName(slug)`, which title-cases each hyphen-separated word
  (`"high-contrast"` → `"High Contrast"`). The select never emits the
  word "default".
- A single managed `<link rel="stylesheet" data-lily-theme-picker="{name}">`
  in `document.head`. Created on first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every apply.
- The package ships zero CSS. **The listbox needs positioning CSS from
  the consumer** — without it the `<ul>` renders in normal flow rather
  than as an overlay. See `docs/styling.md`.

### 4.3 Re-exports

`ThemePicker.svelte`'s module script exports:

- `default` (the component)
- `normaliseThemesUrl`, `themeHref`, `themeName`, `matchSystemTheme`,
  `nextThemePickerId` (pure helpers)
- `SYSTEM_THEME` (`"system"`), `prefersDarkScheme`, `resolveTheme` (§5.6)
- `THEME_COOKIE_MAX_AGE`, `readThemeCookie`, `themeCookie` (§5.7)
- `type Props`, `type ChildArgs`

No glyph constant — the default icon is inline SVG markup in the
component, not a separately-exported swappable character value.

`index.ts` re-exports all of them except `nextThemePickerId`, with
`ThemePicker` as a named alias of the default export.

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
2. the `cookieName` cookie (only if `cookieName` is set, and only when it
   holds one of the choices — §5.7)
3. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw)
4. `matchSystemTheme(themes)` (only if `detectFromSystem` is true) —
   see §5.2.1
5. `defaultValue`
6. `"system"` (if `systemLabel` is set — §5.6)
7. `"light"` (if `"light"` is in `themes`)
8. `themes[0]`
9. `""` (no apply happens — the select waits for user interaction)

This is the same shape `locale-picker` uses, with system detection
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
`locale-picker`.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-picker="{name}"`).
2. Set `link.href = normalise(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. Call `onChange(slug)` if supplied.

The slug applied is `resolveTheme(value, prefersDark, systemThemes)`:
the value itself, or for `"system"` the device's theme (§5.6).

Applying is **idempotent**: a slug already applied is a no-op, so none
of the four steps repeat and `onChange` does not re-fire.

Keeping the choice is a separate step, once per change of **choice**
(not of applied theme: `"dark"` to `"system"` on a dark device applies
nothing new but is a new choice). If `storageKey` is set the choice is
written to `localStorage`, and if `cookieName` is set to the cookie,
each inside a try/catch (private-mode, quota and sandbox errors are
silently swallowed). The choice is kept, not the theme it applied, so
`"system"` stays `"system"` and the next visit follows the device again. The effect in
§5.4 can run for reasons other than a theme change, and a consumer
whose `onChange` writes reactive state would otherwise re-enter it until
Svelte abandons updating the component
(`effect_update_depth_exceeded`), freezing the listbox mid-open with a
stale `aria-expanded`.

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
`value` (from a cookie, header, etc.); with `cookieName` the server reads
the picker's own cookie with `readThemeCookie` (§5.7).

### 5.6 Follow this device (2026-11-16)

With `systemLabel`, the options are `"system"` first, labelled
`systemLabel` (for example "Follow this device"), then `themes`. The
`"system"` option carries a second class hook,
`theme-picker-option-system`, on the same element as
`theme-picker-option`. A listbox may hold only options and groups, so
the line between it and the themes is a border the theme draws on that
option (all 63 `themes/` do), never a separator element. The native
select variant puts `<hr class="theme-picker-separator">` after it, which
a `<select>` allows.

While `"system"` is chosen, the picker applies `systemThemes.dark` when
`matchMedia("(prefers-color-scheme: dark)")` matches and
`systemThemes.light` otherwise, and listens for that query's `change`
event: when the device switches, the page switches with it, and
`onChange` fires once with the new theme. Choosing any other option
removes the listener. The device's scheme is read when the component
is created, so a dark device never sees the light theme first. Without
`systemLabel` nothing changes from before: no option is added and
`"system"` is not a choice.

With `systemLabel` and nothing chosen or kept, the picker starts on
`"system"` (§5.2), since following the device is what most people want
before they choose. `detectFromSystem` still works and is the older,
one-time form of the same idea.

### 5.7 Kept in a cookie (2026-11-16)

With `cookieName`, each choice (§5.3) is written as
`themeCookie(cookieName, choice, secure)`:
`{name}={choice}; Path=/; Max-Age=34560000; SameSite=Lax`, plus
`; Secure` on an `https:` page. 34,560,000 seconds is 400 days, the
longest a browser keeps a cookie (RFC 6265bis); each visit renews it.
The cookie is first-party, readable by script (not `HttpOnly`, since the
picker writes it) and holds only the choice: a theme slug or `"system"`.

On start the cookie is read before `localStorage` (§5.2). A value that
is not one of the choices (`systemLabel`'s `"system"` and `themes`) is
ignored, so a forged cookie never reaches the stylesheet URL.

The cookie is what lets a server send the page in the right theme:
`readThemeCookie(request.headers.get("cookie"), name, allowed)` returns
the choice, or `""` when it is absent, cannot be decoded, or is not in
`allowed`. A server puts `data-theme` on `<html>` and the theme's
`<link>` in the page; for `"system"` it cannot know the device's scheme,
so it links both themes with `media="(prefers-color-scheme: …)"` and the
picker takes over on hydration. Recipe:
[docs/ssr.md](../docs/ssr.md#a-cookie-the-server-can-read).

A cookie set only when the user chooses, and holding only that
interface preference, is the kind EU and UK regulators describe as
"user interface customisation" and generally exempt from consent; the
decision for a given service is the adopter's, not Lily's.

## 6. Accessibility

### 6.1 Roles and properties

| Element        | Role / property                                 | Source        |
| -------------- | ----------------------------------------------- | ------------- |
| `<button>`     | implicit `role="button"`                        | Browser       |
| `<button>`     | `aria-label="{label}"`                          | Consumer prop |
| `<button>`     | `aria-haspopup="listbox"`                       | Component     |
| `<button>`     | `aria-expanded="true\|false"`                   | Component     |
| `<button>`     | `aria-controls="{listId}"`                      | Component     |
| `<span>` glyph | `aria-hidden="true"`                            | Component     |
| `<ul>`         | `role="listbox"`                                | Component     |
| `<ul>`         | `aria-label="{label}"`                          | Consumer prop |
| `<ul>`         | `aria-activedescendant="{optionId}"` while open | Component     |
| `<li>`         | `role="option"`                                 | Component     |
| `<li>`         | `aria-selected="true\|false"`                   | Component     |

The control follows the **WAI-ARIA APG Listbox** pattern (button +
popup listbox), not the Combobox pattern: there is no text input and
no autocomplete.

### 6.2 Keyboard contract

Implemented by the component — none of this comes from the platform.

On the **button**:

| Key                 | Action                                                         |
| ------------------- | -------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / from the button (one tab stop).                |
| `Enter`             | Open the listbox with the selected option active (or index 0). |
| `Space`             | Same as `Enter`.                                               |
| `Arrow Down`        | Same as `Enter`.                                               |
| `Arrow Up`          | Open the listbox with the **last** option active.              |

Opening moves focus to the `<ul>`; the active option is conveyed by
`aria-activedescendant`, not by moving DOM focus onto the `<li>`.

On the **listbox**:

| Key                 | Action                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Arrow Down`        | Move the active option down one. **Clamps** at the last option — it does not wrap.                                                                                                                                                                                  |
| `Arrow Up`          | Move the active option up one. Clamps at the first.                                                                                                                                                                                                                 |
| `Home`              | Make the first option active.                                                                                                                                                                                                                                       |
| `End`               | Make the last option active.                                                                                                                                                                                                                                        |
| `Enter`             | Select the active option, apply it, close, and return focus to the button.                                                                                                                                                                                          |
| `Space`             | Same as `Enter`.                                                                                                                                                                                                                                                    |
| `Escape`            | Close and return focus to the button **without** changing the value.                                                                                                                                                                                                |
| `PageUp`            | Move the active option up ten. Clamps at the first.                                                                                                                                                                                                                 |
| `PageDown`          | Move the active option down ten. Clamps at the last.                                                                                                                                                                                                                |
| `Tab`               | Close and move on — focus goes to the button first, without cancelling the key, so the browser's default Tab proceeds from the picker's position. Hiding the focused list first would drop focus to `<body>` and restart Tab from the top of the document.          |
| Printable character | Typeahead over the option **labels**; the buffer resets after 500 ms of inactivity. A single character advances to the **next** match and repeating it cycles onward; a buffer of differing characters refines the match from the active option. Search wraps once. |

Pointer behaviour: clicking an option selects it, applies it, **and
closes the listbox** — the same close the keyboard's `Enter` performs,
stated explicitly because a pointer path that selected without closing
would leave `aria-expanded="true"` over a hidden list; clicking outside
the root closes the listbox; focus leaving the root closes it.

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

`ThemePicker.test.ts` asserts every clause below, and each `test(...)`
title is prefixed with its clause number so a reviewer can spot a
missing one. Tests run under vitest + jsdom +
`@testing-library/svelte`.

Three untagged pure-helper tests also run: `normaliseThemesUrl` keeps
an existing trailing slash, appends a missing one, and `themeHref`
builds the href from both forms.

### Markup contract (mirrors §4.2)

| Clause | Test asserts                                                                                                                                                         |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §7.1   | Renders a `<button type="button">` with `aria-haspopup="listbox"`, `aria-expanded="false"`, and an `aria-controls` pointing at an element whose `role` is `listbox`. |
| §7.1   | The button renders the default SVG icon inside `.theme-picker-icon`, carrying `aria-hidden="true"`.                                                                  |
| §7.2   | `aria-label` names **both** the button and the listbox.                                                                                                              |
| §7.3   | One `.theme-picker-option` per entry in `themes`; the hidden input carries the supplied `name` and the resolved value.                                               |
| §7.4   | The listbox is `hidden` until the button is activated; activating it clears `hidden` and sets `aria-expanded="true"`.                                                |
| §7.4   | Exactly one option has `aria-selected="true"`, and it is the active theme.                                                                                           |
| §7.5   | Default labels title-case the slug; the word "default" never appears.                                                                                                |
| §7.5   | `themeLabels` overrides the default title-cased label.                                                                                                               |

### Dynamic loading (mirrors §5)

| Clause | Test asserts                                                                                                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §7.6   | The default initial value is `"light"` when present in `themes`.                                                                                                                    |
| §7.6   | It falls back to `themes[0]` when `"light"` is absent.                                                                                                                              |
| §7.7   | A managed `<link rel="stylesheet" data-lily-theme-picker="{name}">` is injected with the resolved href.                                                                             |
| §7.8   | Selecting an option with the pointer updates the link `href` and `data-theme`, fires `onChange` with the new slug, and closes the listbox (`aria-expanded="false"`, list `hidden`). |
| §7.9   | With `storageKey` set, the slug is written to `localStorage` and read back on a fresh mount.                                                                                        |
| §7.10  | A supplied `value` prop wins over storage and defaults.                                                                                                                             |
| §7.11  | A `themesUrl` with no trailing slash still yields exactly one slash.                                                                                                                |

### Spread and custom children (mirrors §4.1)

| Clause | Test asserts                                                                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| §7.12  | Extra attributes (e.g. `data-testid`) spread onto the root.                                                                                                                                                        |
| §7.13  | A `children` snippet **replaces the button glyph**: the custom node renders inside `.theme-picker-button`, no `.theme-picker-icon` is emitted, and the snippet receives `ChildArgs` (`value`, `open`, `labelFor`). |

### Keyboard contract (mirrors §6.2)

| Clause | Test asserts                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------ |
| §7.14  | `ArrowDown`, `Enter` and `Space` on the button all open the listbox.                             |
| §7.14  | `ArrowUp` opens with the **last** option active.                                                 |
| §7.15  | `ArrowDown` / `ArrowUp` move `aria-activedescendant` and clamp at the ends rather than wrapping. |
| §7.15  | `Home` and `End` jump to the first and last option.                                              |
| §7.16  | `Enter` selects the active option, applies it, closes the listbox, and clears `aria-expanded`.   |
| §7.16  | `Escape` closes without changing the theme.                                                      |
| §7.17  | A printable character runs typeahead over the labels and moves `aria-activedescendant`.          |

### Harmonised surface with locale-picker (mirrors §5.2.1)

| Clause | Test asserts                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| §7.18  | `themeName` title-cases each hyphen-separated word (`"high-contrast"` → `"High Contrast"`).                            |
| §7.18  | `themeName` is what the default option label uses.                                                                     |
| §7.19  | `matchSystemTheme` resolves the OS colour scheme to a supported slug, and returns `""` when that slug is not on offer. |
| §7.19  | `matchSystemTheme` resolves `"light"` when dark is not preferred.                                                      |
| §7.19  | `matchSystemTheme` returns `""` when `matchMedia` is unavailable (SSR).                                                |
| §7.20  | `detectFromSystem` resolves the initial theme.                                                                         |
| §7.20  | Storage still wins over system detection.                                                                              |
| §7.20  | Detection is off unless opted in.                                                                                      |

### Accessibility hardening

| Clause | Test asserts                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------- |
| §7.21  | `Tab` from the open list puts focus on the button before closing, so the default Tab proceeds from the picker's position. |
| §7.22  | A repeated typeahead character cycles through its matches; a multi-character buffer refines from the active option.       |
| §7.23  | `PageUp` / `PageDown` move the cursor by ten, clamped.                                                                    |
| §7.24  | An empty list opens without `aria-activedescendant`.                                                                      |

### Idempotent apply (mirrors §5.3)

| Clause | Test asserts                                                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| §7.25  | `onChange` fires once per changed value, not once per effect run: a prop change that re-runs the apply effect does not re-fire it. |

### Focus never scrolls the page

| Clause | Test asserts                                                                                                                                                                                                                                                                                       |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §7.26  | Every focus move the component makes on its own (opening the listbox, returning focus to the button on close/Tab) passes `{ preventScroll: true }`, so a listbox rendered partly off-screen by unstyled/un-overridden positioning CSS never forces the browser to scroll the whole page into view. |

### Tooltip

| Clause | Test asserts                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| §7.27  | Renders `.theme-picker-tooltip` with `role="tooltip"` right after the button, holding `label`, `hidden` at rest, and the button carries no `aria-describedby`.                                               |
| §7.28  | Pointer over the button shows it; leaving hides it.                                                                                                                                                          |
| §7.29  | It stays visible while the pointer is over the tooltip itself.                                                                                                                                               |
| §7.30  | Keyboard focus on the button shows it (mouse-induced focus does not); blur hides it.                                                                                                                         |
| §7.31  | `Escape` on the button dismisses it; re-entering shows it again.                                                                                                                                             |
| §7.32  | It is never shown while the listbox is open.                                                                                                                                                                 |
| §7.33  | While the tooltip is visible, `Escape` pressed anywhere (e.g. on `document.body` or another element, with the pointer hovering and focus elsewhere) dismisses it without moving focus or preventing default. |
| §7.34  | The document `keydown` listener exists only while the tooltip is visible: added once on show, never doubled, removed on hide and on unmount.                                                                 |

### Follow this device (mirrors §5.6) and kept in a cookie (mirrors §5.7)

`ThemePicker.system.test.ts`.

| Clause | Assertion                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| §7.35  | `systemLabel` adds a first option, value `"system"`, with the `theme-picker-option-system` hook; without it there is none.      |
| §7.36  | With `systemLabel` and nothing chosen or kept, the picker starts on `"system"` and applies the device's theme.                  |
| §7.37  | While following, a device switch applies the other theme and fires `onChange` once; choosing a theme removes the listener.      |
| §7.38  | `systemThemes` chooses the light and dark themes.                                                                               |
| §7.39  | The native select variant offers `"system"` first, followed by `<hr class="theme-picker-separator">`.                           |
| §7.40  | With `cookieName`, each choice is written to the cookie, the choice and not its theme, including a choice that applies nothing. |
| §7.41  | The cookie sets the starting choice, above `localStorage`.                                                                      |
| §7.42  | A cookie that is not one of the choices is ignored, and never reaches the stylesheet URL.                                       |
| §7.43  | `themeCookie` writes `Path=/`, 400 days, `SameSite=Lax` and `Secure` when asked; `readThemeCookie` finds, decodes and checks.   |

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme. The
  headless `ThemeView` already exists upstream.
- _Tracking_ `prefers-color-scheme` over the session. `detectFromSystem`
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

- Package directory: `lily-design-system-svelte-theme-picker/` (top-level subproject; until 2026-10-10 inside `lily-design-system-svelte-helpers/`)
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- **2026-09-16**: default icon changed from the Unicode glyph U+25D1
  CIRCLE WITH RIGHT HALF BLACK (exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`)
  to a bundled outline SVG. Maintainer-directed, applied to all five
  page-header pickers the same day. The glyph constant was removed, not
  renamed — there is no longer a single swappable character value.

## Open state and disabled (2026-10-16)

`open?: boolean` (bindable, default `false`), `onOpenChange?: (open: boolean) => void` and `disabled?: boolean` — the same three props `menu-picker` and `settings-picker` already had. `open` is the popup's state: the trigger's click, the keys, Escape, a selection and an outside click all write it, and so can the parent. `onOpenChange` is called once for each change from any source and not for the initial value. `disabled` is passed to the headless `IconButton` (a native `disabled`), so the button leaves the tab order and cannot be clicked, and an open popup is closed when it becomes true. Opening from outside does not move focus; the keys and the pointer still do. Tests: "open state and disabled".

## Native select variant (2026-10-29, RFC 3 prototype)

`variant?: "listbox" | "select"`, default `"listbox"`. With `"select"` the
root is `<div class="theme-picker {class}" data-variant="select" ...restProps>`
holding one `<select class="theme-picker-select" name="{name}" aria-label="{label}" disabled?>`
and one `<option class="theme-picker-option" value="{slug}" selected?>{labelFor(slug)}</option>`
per theme. No button, listbox, tooltip or hidden input is rendered. A
`change` sets `value`, and the existing apply path runs unchanged
(§5.3: managed `<link>`, `data-theme`, optional storage, `onChange` once
per change). Initial value resolution (§5.2) is unchanged and is
reflected as the `selected` option, so server-rendered markup is
already correct. `open` / `onOpenChange` do not apply (a native
select's popup state is not observable). Keyboard is the platform's:
the component adds no key handlers. Styling with
`appearance: base-select` belongs in theme CSS behind
`@supports (appearance: base-select)` (Chromium-only on 2026-10-29); the
snippet is in `docs/styling.md`, not shipped. Tests: 'variant="select"'
(markup and naming, labels as props, initial value applied, change
applies and persists, platform keyboard and Tab stop, disabled, parent
value, rest props). Ported to the other seven catalogs on 2026-10-30
(tasks.md P18-T12); the HTML example's `/demos/theme-select.html` and
`e2e/theme-select.spec.ts` check it in a browser, with and without
`appearance: base-select`.
