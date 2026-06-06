# ThemePicker — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-theme-picker`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by a
test.

Sibling files in this directory:

- `theme-picker.njk` — the macro implementation
- `theme-picker.client.js` — the runtime JS that owns the lifecycle
- `theme-picker.test.ts` — vitest spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-nunjucks-headless/components/theme-picker/`) is a
pure macro container — `<fieldset>` + `role="radiogroup"`. This helper
is the opinionated, reusable counterpart split into:

- **macro** — server-side template that renders the markup with
  `data-lily-*` hooks
- **client.js** — browser-side ES module that picks up the markup and
  owns the dynamic loading lifecycle

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless theme picker
that:

1. Renders an accessible radio group of available themes from a
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
   `theme-picker` class hook.

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
  in the browser. The macro emits `data-lily-theme-picker-*` hooks
  and the client.js looks them up.
- **One `<link>` per picker name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet" data-lily-theme-picker="{name}">`.
  Only the active theme is fetched.
- **`data-theme` attribute is the activation switch.** Theme CSS
  files scope their `:root[data-theme="slug"]` rules so authors can
  preload multiple themes and switch with the attribute alone.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention (`{% from "…" import themePicker %}` then
  `{{ themePicker({label: "Theme", themesUrl: "/assets/themes/", themes: […]}) }}`).
- **Vanilla ES module client.js** — no framework dependency. The
  client exports `initThemePicker(root, opts?)` to wire one picker
  and `autoInit()` to find every `data-lily-theme-picker-root` on
  the page.
- **SSR-safe** — the macro is a pure template. The client.js guards
  every DOM read/write behind a `typeof document !== "undefined"`
  check so it can be imported in non-browser environments without
  side effects.

## 4. Public API

### 4.1 Macro parameters

`{% from "./theme-picker.njk" import themePicker %}` then
`{{ themePicker(opts) }}`.

| Key            | Type                       | Required | Default                  | Purpose |
| -------------- | -------------------------- | -------- | ------------------------ | ------- |
| `label`        | `string`                   | yes      | —                        | Accessible name for the radiogroup. |
| `themesUrl`    | `string`                   | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised at runtime. |
| `themes`       | `array<string>`            | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`        | `string`                   | no       | `""`                     | Initial selected theme slug to render checked. |
| `defaultValue` | `string`                   | no       | —                        | Initial theme when nothing else is supplied at runtime. |
| `storageKey`   | `string`                   | no       | `""`                     | If non-empty, the client.js persists the selection to `localStorage`. |
| `name`         | `string`                   | no       | `"theme"`                | `name` attribute shared by the radio inputs. |
| `extension`    | `string`                   | no       | `".css"`                 | File extension appended to each slug to build the URL. |
| `themeLabels`  | `object<string,string>`    | no       | `{}`                     | Optional pretty labels per slug. |
| `classes`      | `string`                   | no       | `""`                     | Extra CSS classes on the `<fieldset>` root. |

The macro never emits the word `"default"` for option labels; an
option's visible text comes from `themeLabels[slug]` when supplied
and otherwise from the slug with its first character upper-cased
(e.g. `"light"` → `"Light"`).

### 4.2 DOM contract (macro output)

- Root element: `<fieldset class="theme-picker {classes}"
  role="radiogroup" aria-label="{label}"
  data-lily-theme-picker-root
  data-lily-theme-picker-name="{name}"
  data-lily-theme-picker-themes-url="{themesUrl}"
  data-lily-theme-picker-extension="{extension}"
  data-lily-theme-picker-storage-key="{storageKey}"
  data-lily-theme-picker-default-value="{defaultValue}">`.
- One `<label class="theme-picker-option">` per slug containing
  `<input type="radio" name="{name}" value="{slug}" checked={value===slug}>`
  and `<span class="theme-picker-option-label">{labelFor(slug)}</span>`.
- The macro output contains NO inline `<style>` and NO `<script>` —
  the consumer loads `theme-picker.client.js` separately.

### 4.3 Client.js exports

`theme-picker.client.js` is an ES module exporting:

| Export              | Type                                                | Purpose |
| ------------------- | --------------------------------------------------- | ------- |
| `normaliseThemesUrl(url)` | `(string) => string`                          | Ensure exactly one trailing `/`. |
| `themeHref(url, slug, extension)` | `(string, string, string) => string`  | Build the theme href. |
| `initThemePicker(root, opts?)` | `(HTMLElement, object?) => {setTheme, destroy}` | Wire one picker fieldset. |
| `autoInit(opts?)`   | `(object?) => Array<{setTheme, destroy}>`           | Find every `[data-lily-theme-picker-root]` and init it. |

`initThemePicker` returns a controller with:

- `setTheme(slug)` — apply a theme imperatively (mirrors radio click).
- `destroy()` — remove event listeners (keeps applied DOM as-is).

Optional `opts` for both `initThemePicker` and `autoInit`:

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

### 5.2 Initial value resolution (client-side, on `initThemePicker`)

The initial theme is the first non-empty value of:

1. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
2. The `value` attribute of any radio that the macro rendered with
   `checked` (i.e. the consumer's `value` prop).
3. The fieldset's `data-lily-theme-picker-default-value` attribute.
4. `"light"` if present among the rendered radio values.
5. The first radio value, or `""` if none.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link
   rel="stylesheet" data-lily-theme-picker="{name}">` in
   `document.head`.
2. Set `link.href = normaliseThemesUrl(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element
   (defaults to `document.documentElement`).
4. If `storageKey` is non-empty, write the slug to `localStorage`
   inside a try/catch.
5. Check the matching radio (so `radio.checked` mirrors the active
   theme).
6. Call `opts.onChange?.(slug)` if supplied.

### 5.4 Reactivity

The client.js attaches one `change` listener on the fieldset (event
delegation). Every radio change triggers `applyTheme`. `setTheme` on
the returned controller does the same.

### 5.5 SSR

The macro renders deterministic markup; no DOM access at template
time. The client.js touches `document` only after
`initThemePicker(root)` is called, and only when
`typeof document !== "undefined"`.

## 6. Accessibility

- `<fieldset role="radiogroup" aria-label="{label}">` is the
  announced container.
- Native `<input type="radio">` gives Arrow / Space / Tab semantics
  for free.
- WCAG 2.2 AAA is the target. Focus styling is the consumer's CSS
  concern.
- The picker never emits the word `"default"`.

## 7. Testing acceptance criteria

`theme-picker.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Items 1–6 exercise the macro via
`nunjucks.renderString`; items 7–13 exercise the client.js against a
jsdom document populated from the macro output.

1. Macro renders a `<fieldset>` with `role="radiogroup"`.
2. Macro renders `aria-label` equal to the supplied `label`.
3. Macro renders one radio per entry in `themes`, sharing the
   supplied `name` attribute.
4. Each radio's `value` attribute is the theme slug.
5. Default labels title-case the slug (`"light"` → `"Light"`); the
   word `"default"` never appears.
6. `themeLabels` override the default title-case label.
7. After `initThemePicker(root)`, a `<link rel="stylesheet"
   data-lily-theme-picker="{name}">` exists in `document.head` and
   its `href` equals `${normalise(themesUrl)}${initial}${extension}`,
   where `initial` resolves to `"light"` when present (else first
   theme).
8. Initial apply also sets
   `document.documentElement.dataset.theme` to the resolved slug.
9. Firing a `change` event on a different radio updates the link
   `href`, the `data-theme` attribute, and fires `onChange` with the
   new slug.
10. When `storageKey` is set, the active slug is written to
    `localStorage` and read back as the initial value on a fresh
    init.
11. When `themesUrl` lacks a trailing slash, the constructed href
    still has exactly one slash between directory and slug.
12. `normaliseThemesUrl` and `themeHref` are exported pure helpers
    that match §5.1.
13. Extra `attributes` keys in `opts` (e.g. `{"data-testid":"tp"}`)
    are spread onto the `<fieldset>` root.

## 8. Out-of-scope (future)

- A `prefers-color-scheme` integration that auto-picks light/dark on
  first visit.
- An inline-style loader for CSP contexts that block external
  stylesheets.
- A `preload` option that emits `<link rel="preload" as="style">`
  for every available theme.

## 9. Tracking

- Package directory: `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-theme-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
