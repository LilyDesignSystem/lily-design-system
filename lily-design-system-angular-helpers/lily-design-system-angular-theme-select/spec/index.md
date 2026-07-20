# ThemeSelect — Specification

Single source of truth for the `lily-design-system-angular-theme-select`
Angular helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `theme-select.component.ts` — the implementation
- `theme-select.component.spec.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-angular-headless/components/ThemeSelect.ts`) is a
pure container — `<select>` + projected `<option>` content. This
helper is the opinionated, reusable counterpart that owns the dynamic
loading lifecycle.

---

## 1. Goal

Give an Angular 20 application a drop-in, headless theme select that:

1. Renders an accessible native `<select>` of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the
   choice survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-select` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the component. Themes are
  author-owned static assets the consumer drops into their `public/`
  / `src/assets/` directory.
- Auto-discovering themes via directory listing. Browsers cannot list
  a directory, so the consumer always supplies the list of available
  theme slugs.
- Providing colour, spacing, or typography values. Theme tokens live
  inside each theme CSS file.
- Angular-specific render targets (SSR-only, Universal-only). The
  component depends on Angular 20 + DOM APIs and runs in any Angular
  20 host (standalone CLI app, Analog, Storybook).
- A `ThemeProvider` wrapper. Theme application happens at the
  document root, not in a wrapping element.

## 3. Architectural decisions

- **Standalone signal-based component.** The component is
  `standalone: true` (Angular 20 default), uses `input<T>()` and
  `input.required<T>()` for inputs, `output<T>()` for events, and
  `model<string>()` for two-way binding. The rendered control is a
  native `<select>`.
- **`OnPush` change detection** to match the headless library.
- **One `<link>` per select name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet"
  data-lily-theme-select="{name}">`. Multiple selects can coexist by
  passing distinct `name` inputs.
- **`data-theme` attribute is the activation switch.** Theme CSS
  files scope their `:root[data-theme="slug"]` rules so authors can
  preload multiple themes or rely on the single managed `<link>`.
- **TypeScript strict** on the public surface; types exported from
  `index.ts`.
- **SSR-safe.** DOM side-effects guard on `typeof document !==
  "undefined"` and run inside `effect()` which is scheduled in the
  browser.
- **No runtime dependencies** beyond `@angular/core` /
  `@angular/common`.
- **`model<string>()` for two-way bindable `value`.** Consumers use
  `[(value)]="x"` in their templates.
- **Template-cast pattern**: `$any($event.target).value` is the
  required form for reading the changed-input value in the template,
  per the Angular template-parser contract documented in
  angular-headless.

## 4. Public API

### 4.1 Inputs / outputs

| Input / output  | Type                                | Required | Default                          | Purpose |
| --------------- | ----------------------------------- | -------- | -------------------------------- | ------- |
| `label`         | `input.required<string>()`          | yes      | —                                | Accessible name for the `<select>`. |
| `placeholder`   | `input<string>()`                   | no       | `""` (→ falls back to `label`)   | Text of the always-displayed placeholder option. The closed control shows this rather than the active theme name. |
| `themesUrl`     | `input.required<string>()`          | yes      | —                                | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `input.required<string[]>()`        | yes      | —                                | Available theme slugs. |
| `value`         | `model<string>()`                   | no       | `""`                             | Currently selected theme slug. Two-way bindable. |
| `defaultValue`  | `input<string>()`                   | no       | `""`                             | Initial theme when nothing else is supplied. |
| `storageKey`    | `input<string>()`                   | no       | `""`                             | If non-empty, persist the selection to `localStorage` under this key. |
| `name`          | `input<string>()`                   | no       | `"theme"`                        | `name` attribute on the `<select>`. |
| `extension`     | `input<string>()`                   | no       | `".css"`                         | File extension appended to each slug when constructing the URL. |
| `target`        | `input<HTMLElement \| null>()`      | no       | `null` (→ `document.documentElement`) | Element that receives `data-theme`. |
| `themeLabels`   | `input<Record<string, string>>()`   | no       | `{}`                             | Optional pretty labels per slug. |
| `className`     | `input<string>()`                   | no       | `""`                             | Extra CSS class on the `<select>` root. |
| `themeChange`   | `output<string>()`                  | no       | —                                | Emits after the select applies a new theme. |

### 4.2 DOM contract

- Root element: `<select class="theme-select {className}"
  [attr.aria-label]="label" [name]="name">`.
- First child, always present: `<option class="theme-select-option
  theme-select-placeholder" value="" selected>{{ placeholder() ||
  label() }}</option>`. It is component-owned.
- Default children: one `<option class="theme-select-option"
  [value]="slug">{labelFor(slug)}</option>` per theme slug, following
  the placeholder.
- **The `<select>` is not bound to `value`.** No real option carries a
  `[selected]` binding; the element's own DOM selection stays pinned to
  the placeholder, so the closed control always reads
  `placeholder() || label()` and is only ever as wide as that word —
  never as wide as the longest theme name. On `change` the component
  reads the chosen slug, resets the element's `value` to `""`, and
  writes the slug to the `value` model signal. `value` remains the
  single source of truth for the active theme; every downstream
  behaviour (link swap, `data-theme`, persistence, `themeChange`) is
  driven from it and is unchanged.
- The `change` event is not stopped, so a consumer binding `(change)`
  on the host `<lily-theme-select>` still receives it — `change`
  bubbles out of the inner `<select>`.
- Width is a consumer-CSS concern; this package still ships zero CSS.
  See `docs/styling.md` for the `field-sizing` recipe, and the root
  `themes/` stylesheets for the shipped implementation.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied;
  otherwise the slug with its first character upper-cased. The select
  never emits the word "default".
- A single managed `<link rel="stylesheet"
  data-lily-theme-select="{name}">` in `document.head`. Created on
  first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every
  apply.

### 4.3 Re-exports

`index.ts` exports:

- `ThemeSelect` (the component class)
- `normaliseThemesUrl`, `themeHref` (pure helpers)

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
normalise(themesUrl) + slug + extension
```

`normalise` ensures exactly one trailing `/`. The component does not
URL-encode the slug; consumers must pick slugs that are safe URL path
segments (kebab-case ASCII is recommended).

### 5.2 Initial value resolution

On first effect run in the browser, the initial theme is the first
non-empty value of:

1. `value()` (if a consumer supplied a non-empty string)
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw)
3. `defaultValue`
4. `"light"` (if `"light"` is in `themes`)
5. `themes[0]`
6. `""` (no apply happens — the select waits for user interaction)

Resolution writes back to `value` (via `value.set(...)`) so consumers
observing the two-way binding see the resolved value.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-select="{name}"`).
2. Set `link.href = normalise(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target()` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch.
5. Emit `themeChange.emit(slug)`.

### 5.4 Reactivity

A single `effect()` re-applies the theme whenever `value()` changes
(including the write-back from initial-value resolution). Other input
changes (`themesUrl`, `extension`, `target`, `name`) take effect on
the next theme change, not retroactively.

### 5.5 SSR

During server rendering, the `effect()` runs but the
`document`-guard prevents DOM mutation. The markup renders with the
value supplied by the consumer (if any). Consumers wanting
flicker-free first paint pass a server-resolved `value` (from a
cookie, header, etc.).

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` with its implicit `role="combobox"` is the announced
  control.
- `[attr.aria-label]="label"` supplies the accessible name.
- Native `<option>` elements get the option role, selected state,
  and keyboard semantics for free.

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / away from the select.       |
| `Arrow Down/Up`   | Select the next / previous option.            |
| `Home` / `End`    | Select the first / last option.               |
| Typeahead         | Type characters to jump to a matching option. |
| `Enter` / `Space` | Open the option list (platform-dependent).    |
| `Escape`          | Close the option list.                        |

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 Preloading strategy (consumer choice)

The default ("swap-link") loads exactly one theme at a time.
Consumers wanting instant switching can drop their own `<link>` tags
for every theme (so all theme CSS is preloaded) and rely on the
attribute change alone — because every theme's CSS rule set is scoped
to `:root[data-theme="{slug}"]`, the active rules switch instantly
with the attribute.

## 7. Testing acceptance criteria

`theme-select.component.spec.ts` must assert every numbered item
below. Tests run under vitest + jsdom + `@angular/core/testing`
`TestBed`.

1. Renders a `<select>` with the supplied `name` attribute.
2. `aria-label` is the supplied `label`.
3. Renders one placeholder `<option>` plus one `<option>` per entry in
   `themes`.
4. Each option's `value` attribute is the theme slug, following the
   placeholder option whose `value` is `""`.
4a. The placeholder option carries the classes `theme-select-option
    theme-select-placeholder`, renders `placeholder() || label()` as
    its text, and remains the element's own selection
    (`select.value === ""`) even after a theme has been applied.
4b. The `placeholder` input, when supplied, overrides `label` as the
    placeholder text without changing the `aria-label`.
4c. Choosing an option applies that theme and snaps the element's own
    selection back to the placeholder.
5. The default rendering shows `themeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise. The word
   `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-select="{name}">` exists in `document.head` and
   its `href` equals `${normalise(themesUrl)}${initial}${extension}`.
8. Selecting a different option updates the link `href`,
   `document.documentElement.dataset.theme`, and emits `themeChange`
   with the new slug.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a non-empty input, the initial-value
    resolution skips storage and defaults and uses the supplied value.
11. When `themesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. The consumer's `className` is appended to the root `<select>`
    class list.
13. The pure helpers `normaliseThemesUrl` and `themeHref` are
    exported and behave per §5.1.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- A `prefers-color-scheme` integration that auto-picks light/dark on
  first visit.
- A non-`<link>` loader that injects a `<style>` block (useful for CSP
  contexts that block external stylesheets but allow inline).
- A `preload` input that adds `<link rel="preload" as="style">` tags
  for every available theme.

## 9. Tracking

- Package directory: `lily-design-system-angular-helpers/lily-design-system-angular-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
