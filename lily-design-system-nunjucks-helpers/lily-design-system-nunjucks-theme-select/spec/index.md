# ThemeSelect — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-theme-select`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by a
test.

Sibling files in this directory:

- `theme-select.njk` — the macro implementation
- `theme-select.client.js` — the runtime JS that owns the lifecycle
- `theme-select.test.ts` — vitest spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-nunjucks-headless/components/theme-select/`) is a
pure macro container — a native `<select>` with `<option>` children.
This helper is the opinionated, reusable counterpart split into:

- **macro** — server-side template that renders the markup with
  `data-lily-*` hooks
- **client.js** — browser-side ES module that picks up the markup and
  owns the dynamic loading lifecycle

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless theme select
that:

1. Renders an accessible native `<select>` of available themes from a
   Nunjucks macro (server-side / SSG-time).
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`) via a companion client-side
   JS module.
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-select` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the macro. Themes are author-owned
  static assets the consumer drops into their `assets/` or `public/`
  directory.
- Auto-discovering themes via directory listing. Browsers cannot list
  a directory, so the consumer always supplies the list of available
  theme slugs.
- Providing colour, spacing, or typography values. Theme tokens live
  inside each theme CSS file.
- Eleventy-only or 11ty-only features. The macro only depends on
  Nunjucks 3 + DOM APIs and runs in any Nunjucks host (Eleventy,
  Express, raw `nunjucks.render`).
- A `ThemeProvider` style wrapper. Theme application happens at the
  document root, not in a wrapping element.
- Inline `<script>` tags inside the macro output. The client.js is a
  separate ES module the consumer loads once per page.

## 3. Architectural decisions

- **Split between macro and client.js.** Nunjucks renders static HTML;
  the lifecycle (storage, link swap, attribute set) can only happen
  in the browser. The macro emits a `<select>` with
  `data-lily-theme-select-*` hooks and the client.js looks them up.
- **One `<link>` per select name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet" data-lily-theme-select="{name}">`.
  Only the active theme is fetched.
- **`data-theme` attribute is the activation switch.** Theme CSS
  files scope their `:root[data-theme="slug"]` rules so authors can
  preload multiple themes and switch with the attribute alone.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention (`{% from "…" import themeSelect %}` then
  `{{ themeSelect({label: "Theme", themesUrl: "/assets/themes/", themes: […]}) }}`).
- **Vanilla ES module client.js** — no framework dependency. The
  client exports `initThemeSelect(root, opts?)` to wire one select
  and `autoInit()` to find every `data-lily-theme-select-root` on
  the page.
- **SSR-safe** — the macro is a pure template. The client.js guards
  every DOM read/write behind a `typeof document !== "undefined"`
  check so it can be imported in non-browser environments without
  side effects.

## 4. Public API

### 4.1 Macro parameters

`{% from "./theme-select.njk" import themeSelect %}` then
`{{ themeSelect(opts) }}`.

| Key            | Type                       | Required | Default                  | Purpose |
| -------------- | -------------------------- | -------- | ------------------------ | ------- |
| `label`        | `string`                   | yes      | —                        | Accessible name for the `<select>`. |
| `placeholder`  | `string`                   | no       | value of `label`         | Text of the always-displayed placeholder option. The closed `<select>` shows this instead of the active theme name, so the control stays as narrow as this word. |
| `themesUrl`    | `string`                   | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised at runtime. |
| `themes`       | `array<string>`            | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`        | `string`                   | no       | `""`                     | Initial theme slug. Emitted as `data-lily-theme-select-value` for the client to read; it is **not** rendered as a `selected` option (see §4.2). |
| `defaultValue` | `string`                   | no       | —                        | Initial theme when nothing else is supplied at runtime. |
| `storageKey`   | `string`                   | no       | `""`                     | If non-empty, the client.js persists the selection to `localStorage`. |
| `name`         | `string`                   | no       | `"theme"`                | `<select>` `name` attribute (default "theme"). |
| `extension`    | `string`                   | no       | `".css"`                 | File extension appended to each slug to build the URL. |
| `themeLabels`  | `object<string,string>`    | no       | `{}`                     | Optional pretty labels per slug. |
| `classes`      | `string`                   | no       | `""`                     | Extra CSS classes on the `<select>` root. |

The macro never emits the word `"default"` for option labels; an
option's visible text comes from `themeLabels[slug]` when supplied
and otherwise from the slug with its first character upper-cased
(e.g. `"light"` → `"Light"`).

### 4.2 DOM contract (macro output)

- Root element: `<select class="theme-select {classes}"
  aria-label="{label}" name="{name}"
  data-lily-theme-select-root
  data-lily-theme-select-name="{name}"
  data-lily-theme-select-themes-url="{themesUrl}"
  data-lily-theme-select-extension="{extension}"
  data-lily-theme-select-storage-key="{storageKey}"
  data-lily-theme-select-default-value="{defaultValue}"
  data-lily-theme-select-value="{value}">`.
- `data-lily-theme-select-value` is emitted **only when `opts.value` is
  non-empty**; it is the sole channel by which the consumer's `value`
  prop reaches the client.
- The FIRST child of the `<select>` is the component-owned placeholder
  option: `<option class="theme-select-option theme-select-placeholder"
  value="" selected>{placeholder ?? label}</option>`. It is always
  rendered, always carries an empty `value`, and is the option the
  closed control displays.
- The placeholder is the **only** option that ever carries `selected`
  in the macro output. A `<select>` with two `selected` options is
  resolved by the browser in favour of the *last* one, so rendering
  `selected` on the matching real option would paint the theme name
  until the client snapped it back — a visible flash on every load
  where `opts.value` is set. The macro therefore never does it.
- Then one `<option class="theme-select-option"
  value="{slug}">{labelFor(slug)}</option>` per slug, inside
  the `<select>` — never `selected`.
- The `<select>`'s own `value` is therefore **not** a mirror of the
  active theme: after every apply it is snapped back to `""` (the
  placeholder) by the client. The active theme lives in `data-theme`
  on the target, in `localStorage` when `storageKey` is set, and in
  the `onChange(slug)` argument.
- The macro output contains NO inline `<style>` and NO `<script>` —
  the consumer loads `theme-select.client.js` separately.

### 4.3 Client.js exports

`theme-select.client.js` is an ES module exporting:

| Export              | Type                                                | Purpose |
| ------------------- | --------------------------------------------------- | ------- |
| `normaliseThemesUrl(url)` | `(string) => string`                          | Ensure exactly one trailing `/`. |
| `themeHref(url, slug, extension)` | `(string, string, string) => string`  | Build the theme href. |
| `initThemeSelect(root, opts?)` | `(HTMLElement, object?) => {setTheme, destroy}` | Wire one select `<select>`. |
| `autoInit(opts?)`   | `(object?) => Array<{setTheme, destroy}>`           | Find every `[data-lily-theme-select-root]` and init it. |

`initThemeSelect` returns a controller with:

- `setTheme(slug)` — apply a theme imperatively (mirrors a select change).
- `destroy()` — remove event listeners (keeps applied DOM as-is).

Optional `opts` for both `initThemeSelect` and `autoInit`:

- `onChange(slug)` — callback fired after every apply.
- `target` — `HTMLElement` that receives `data-theme` (defaults to
  `document.documentElement`).

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
normaliseThemesUrl(themesUrl) + slug + extension
```

`normaliseThemesUrl` ensures exactly one trailing `/`.

### 5.2 Initial value resolution (client-side, on `initThemeSelect`)

The initial theme is the first non-empty value of:

1. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
2. The `<select>`'s `data-lily-theme-select-value` attribute (i.e. the
   consumer's `value` prop). The macro omits the attribute entirely
   when `opts.value` is unset, so an absent attribute reads as `""`
   and falls through.
3. The `<select>`'s `data-lily-theme-select-default-value` attribute.
4. `"light"` if present among the rendered option values.
5. The first option value, or `""` if none.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link
   rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. Set `link.href = normaliseThemesUrl(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element
   (defaults to `document.documentElement`).
4. If `storageKey` is non-empty, write the slug to `localStorage`
   inside a try/catch.
5. Set the `<select>` value to `""`, snapping the control back to its
   placeholder option so the closed control keeps reading the
   placeholder word rather than the active theme name.
6. Call `opts.onChange?.(slug)` if supplied.

### 5.4 Reactivity

The client.js attaches one `change` listener on the `<select>`. On
each change it reads the chosen slug, immediately resets
`select.value = ""`, and then applies the slug (choosing the
placeholder itself is a no-op). `setTheme` on the returned controller
performs the same apply.

Because the reset happens synchronously inside the listener, a
consumer's own `change` listener that reads `event.target.value` will
see `""`. Consumers who need the chosen slug should use the
`onChange(slug)` callback or read `data-theme` from the target.

### 5.5 SSR

The macro renders deterministic markup; no DOM access at template
time. The client.js touches `document` only after
`initThemeSelect(root)` is called, and only when
`typeof document !== "undefined"`.

## 6. Accessibility

- `<select aria-label="{label}">` has the implicit `combobox` role and
  is the announced control; each `<option>` has the implicit `option`
  role.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free.
- WCAG 2.2 AAA is the target. Focus styling is the consumer's CSS
  concern.
- The select never emits the word `"default"`.

## 7. Testing acceptance criteria

`theme-select.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Items 1–6 exercise the macro via
`nunjucks.renderString`; items 7–13 exercise the client.js against a
jsdom document populated from the macro output.

1. Macro renders a `<select>` (implicit `role="combobox"`).
2. Macro renders `aria-label` equal to the supplied `label`.
3. Macro renders one placeholder `<option>` plus one `<option>` per
   entry in `themes`; the `<select>` carries the supplied `name`
   attribute.
4. Each option's `value` attribute is the theme slug, preceded by the
   placeholder's empty `value`.
5. Default labels title-case the slug (`"light"` → `"Light"`); the
   word `"default"` never appears.
6. `themeLabels` override the default title-case label.
7. After `initThemeSelect(root)`, a `<link rel="stylesheet"
   data-lily-theme-select="{name}">` exists in `document.head` and
   its `href` equals `${normalise(themesUrl)}${initial}${extension}`,
   where `initial` resolves to `"light"` when present (else first
   theme).
8. Initial apply also sets
   `document.documentElement.dataset.theme` to the resolved slug.
9. Firing a `change` event on the `<select>` with a different value
   updates the link `href`, the `data-theme` attribute, and fires
   `onChange` with the new slug.
10. When `storageKey` is set, the active slug is written to
    `localStorage` and read back as the initial value on a fresh
    init.
11. When `themesUrl` lacks a trailing slash, the constructed href
    still has exactly one slash between directory and slug.
12. `normaliseThemesUrl` and `themeHref` are exported pure helpers
    that match §5.1.
13. Extra `attributes` keys in `opts` (e.g. `{"data-testid":"tp"}`)
    are spread onto the `<select>` root.
14. The placeholder option is the first child of the `<select>`,
    carries `class="theme-select-option theme-select-placeholder"`,
    renders the `label` text, and has `value=""`. After
    `initThemeSelect(root)` the `<select>`'s own value is still `""`
    while `data-theme` carries the resolved slug.
15. A supplied `placeholder` overrides `label` as the placeholder
    option's text, while `aria-label` still carries `label`.
16. Firing a `change` event with a real slug applies that theme AND
    snaps the `<select>` value back to `""`.
17. When `opts.value` is set, the server-rendered markup contains
    exactly ONE `selected` option and it is the placeholder. No real
    option carries `selected`, and the `<select>`'s value is `""`
    before any client code runs. (Regression guard for the
    pre-hydration flash — see §4.2.)
18. When `opts.value` is set, the `<select>` carries
    `data-lily-theme-select-value="{value}"`, and
    `initThemeSelect(root)` resolves the initial theme from it (in
    preference to `defaultValue`).
19. When `opts.value` is unset, the `<select>` carries no
    `data-lily-theme-select-value` attribute at all.

## 8. Out-of-scope (future)

- A `prefers-color-scheme` integration that auto-picks light/dark on
  first visit.
- An inline-style loader for CSP contexts that block external
  stylesheets.
- A `preload` option that emits `<link rel="preload" as="style">`
  for every available theme.

## 9. Tracking

- Package directory: `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
