# `<theme-picker>` — Specification

Single source of truth for the `lily-design-system-html-theme-picker`
HTML helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `theme-picker.ts` — the custom-element implementation
- `theme-picker.test.ts` — vitest + jsdom spec exercising every clause in §4–§7
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-html-headless/components/theme-picker.html`) is
a pure container — `<div role="radiogroup">` plus a stub script. This
helper is the opinionated, reusable counterpart packaged as a single
custom element that owns the dynamic loading lifecycle.

The Svelte sibling
(`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-picker/`)
shares the same numbered acceptance criteria; this spec mirrors §1–§9
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless theme picker that:

1. Renders an accessible radio group of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the
   choice survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-picker` class hook on the element's children.

## 2. Non-goals

- Bundling theme CSS files inside the helper. Themes are
  author-owned static assets the consumer drops into their
  `public/` directory.
- Auto-discovering themes via directory listing. Browsers cannot list
  a directory, so the consumer always supplies the list of available
  theme slugs.
- Providing colour, spacing, or typography values. Theme tokens live
  inside each theme CSS file.
- A `ThemeProvider` style wrapper. Theme application happens at the
  document root, not in a wrapping element.
- Shadow DOM encapsulation. The element uses light DOM so the
  consumer's stylesheet reaches the rendered options directly.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<theme-picker>`. The class is exported as `ThemePicker` from
  `theme-picker.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("theme-picker", ThemePicker)` on first
  module evaluation, guarded by a `customElements.get(...)` check
  so re-imports are idempotent. Consumers who want to control
  registration themselves can import the class directly from
  `theme-picker.ts` (which does not register) and call
  `customElements.define(...)` with their preferred tag.
- **Light DOM.** The element renders its `<fieldset>` and radios as
  children, not in a shadow root. Consumer CSS targets the
  kebab-case class hooks (`theme-picker`, `theme-picker-option`,
  `theme-picker-option-label`) directly.
- **One `<link>` per picker name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet" data-lily-theme-picker="{name}">`.
  Multiple pickers can coexist on a page by passing distinct
  `name` attributes.
- **`data-theme` attribute is the activation switch.** Theme CSS
  files scope their `:root[data-theme="slug"]` rules.
- **TypeScript everywhere.** Public surface is fully typed.
- **No dependencies.** Implementation depends on the DOM and nothing
  else.

## 4. Public API

### 4.1 Observed attributes

All observed attributes are kebab-case. `attributeChangedCallback`
re-renders / re-applies as needed.

| Attribute       | Type            | Required | Default                  | Purpose |
| --------------- | --------------- | -------- | ------------------------ | ------- |
| `label`         | `string`        | yes      | —                        | Accessible name for the radiogroup. |
| `themes-url`    | `string`        | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string` (CSV)  | yes      | —                        | Available theme slugs, comma-separated (e.g. `"light,dark,abyss"`). The JS property `el.themes` accepts `string[]`. |
| `value`         | `string`        | no       | `""`                     | Currently selected theme slug. |
| `default-value` | `string`        | no       | `"light"` if present in themes, else first item | Initial theme when nothing else is supplied. |
| `storage-key`   | `string`        | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `name`          | `string`        | no       | `"theme"`                | `name` attribute shared by the radio inputs. |
| `extension`     | `string`        | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `theme-labels`  | `string` (JSON) | no       | `"{}"`                   | Pretty labels per slug, JSON-encoded object. The JS property `el.themeLabels` accepts `Record<string, string>`. |
| `class`         | `string`        | no       | `""`                     | Extra CSS class on the rendered `<fieldset>` (in addition to `theme-picker`). |

### 4.2 JS properties

Mirror every attribute with a getter/setter on the element instance:

- `el.label`, `el.themesUrl`, `el.themes` (`string[]`),
  `el.value`, `el.defaultValue`, `el.storageKey`, `el.name`,
  `el.extension`, `el.themeLabels` (`Record<string, string>`),
  `el.target` (`HTMLElement | null`, default
  `document.documentElement`; not exposed as an attribute because
  arbitrary elements cannot be serialised).

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` returns
  `["label", "themes-url", "themes", "value", "default-value",
    "storage-key", "name", "extension", "theme-labels", "class"]`.
- `connectedCallback()` resolves the initial value (per §5.2) and
  renders the children.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field, re-renders (if it's a markup-affecting
  attribute), and re-applies (if it's `value`).
- `disconnectedCallback()` removes the managed `<link>` element only
  if no other `<theme-picker>` with the same `name` remains in the
  document.

### 4.4 Events

The element fires a `themechange` `CustomEvent` after every applied
change. `event.detail` is `{ theme: string }`. The event bubbles and
is composed.

### 4.5 DOM contract

After render, the element contains exactly one child `<fieldset>`:

```html
<theme-picker label="..." themes-url="..." themes="light,dark">
  <fieldset class="theme-picker" role="radiogroup" aria-label="Theme">
    <label class="theme-picker-option">
      <input type="radio" name="theme" value="light" checked>
      <span class="theme-picker-option-label">Light</span>
    </label>
    <label class="theme-picker-option">
      <input type="radio" name="theme" value="dark">
      <span class="theme-picker-option-label">Dark</span>
    </label>
  </fieldset>
</theme-picker>
```

`labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
the slug with its first character upper-cased. The word "default"
never appears.

A single managed `<link rel="stylesheet" data-lily-theme-picker="{name}">`
in `document.head` is created on first apply, reused thereafter.

`data-theme="{slug}"` is set on the `target` element on every apply
(default `document.documentElement`).

### 4.6 Re-exports

`index.ts` exports:

- `ThemePicker` (the class)
- `normalizeThemesUrl`, `themeHref` (pure helpers; American spelling
  to match the rest of the file)
- `type ThemePickerProps`, `type ThemePickerChangeDetail`

The American spelling `normalizeThemesUrl` matches DOM-API convention
(`document.normalize`, `Intl.NumberFormat`). The Svelte sibling uses
the British `normaliseThemesUrl`; both libraries document the
divergence.

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
normalizeThemesUrl(themesUrl) + slug + extension
```

`normalizeThemesUrl` ensures exactly one trailing `/`. If `themesUrl`
ends with `/`, it is used as-is; otherwise one `/` is appended. The
helper does not URL-encode the slug; consumers must pick slugs that
are safe URL path segments (kebab-case ASCII is recommended).

### 5.2 Initial value resolution

On `connectedCallback`, the initial theme is the first non-empty
value of:

1. The `value` attribute / property (if non-empty).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `defaultValue`.
4. `"light"` (if `"light"` is in `themes`).
5. `themes[0]`.
6. `""` (no apply happens — the picker waits for user interaction).

Resolution writes back to the `value` property and the matching
attribute.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-picker="{name}"`).
2. Set `link.href = normalizeThemesUrl(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Dispatch `themechange` `CustomEvent` with `detail: { theme: slug }`.

### 5.4 Reactivity

Setting `el.value`, mutating the `value` attribute, or selecting a
different radio input all trigger `applyTheme`. Other attribute /
property changes take effect on the next theme change or trigger a
re-render of the children (for `themes`, `name`, `theme-labels`,
`class`, `label`).

### 5.5 SSR / no-JS

The custom element only registers in browsers with
`customElements`. Without JS, the element renders nothing (it has
no children until `connectedCallback` runs). Consumers wanting
flicker-free first paint can place the `<link>` and `data-theme`
manually in the document head, then upgrade with this element.

## 6. Accessibility

### 6.1 Roles and properties

- `<fieldset>` (a child of `<theme-picker>`) with
  `role="radiogroup"` is the announced container.
- `aria-label={label}` supplies the group name.
- Native `<input type="radio">` elements get the radio role, checked
  state, and keyboard semantics for free.

### 6.2 Keyboard contract

Provided by the platform (native radio inputs):

| Key            | Action                                           |
| -------------- | ------------------------------------------------ |
| `Tab`          | Move focus into / out of the group.              |
| `Arrow` keys   | Move selection between options inside the group. |
| `Space`        | Select the focused option (when not already).    |

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 Preloading strategy (consumer choice)

The default loads exactly one theme at a time. Consumers who want
instant switching drop their own `<link rel="stylesheet">` tags for
every theme; this picker still updates `data-theme`, and theme CSS
scoped to `:root[data-theme="…"]` switches instantly.

## 7. Testing acceptance criteria

`theme-picker.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. The mirror of the Svelte sibling's §7 is
preserved verbatim where possible.

1. Renders a `<fieldset>` (as a child of `<theme-picker>`) with
   `role="radiogroup"`.
2. `aria-label` on the fieldset is the supplied `label` attribute.
3. Renders one radio input per entry in `themes`, sharing the
   supplied `name` attribute.
4. Each radio's `value` attribute is the theme slug.
5. The default rendering shows `themeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise (e.g.
   `"light"` → `"Light"`). The word `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`default-value`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-picker="{name}">` exists in `document.head` and
   its `href` equals
   `${normalizeThemesUrl(themesUrl)}${initial}${extension}`.
8. Selecting a different radio updates the link `href`,
   `document.documentElement.dataset.theme`, and fires a
   `themechange` event with the new slug.
9. When `storage-key` is set, the active slug is written to
   `localStorage` and read back on a fresh element mount.
10. When `value` is set as an attribute, the initial-value resolution
    skips storage and defaults and uses the supplied value.
11. When `themes-url` does not end with `/`, the constructed URL
    still has exactly one `/` between the directory and the slug.
12. Extra DOM properties / attributes on the element survive
    re-rendering (the element itself stays the rendered root; its
    `id`, `data-*`, etc. are untouched).
13. Setting `el.themes` as an array property is equivalent to
    setting the `themes` attribute as a comma-separated string.

## 8. Out-of-scope (future, not implemented here)

- A complementary `<theme-view>` custom element displaying the
  active theme name.
- A `prefers-color-scheme` integration.
- A non-`<link>` loader (inline `<style>` injection for strict CSP).
- A `preload` attribute that adds `<link rel="preload">` for every
  available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-theme-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
