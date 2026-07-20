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

1. Renders an icon button that opens an accessible
   [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
   of the available themes, plus a hidden input so the control still
   participates in a surrounding `<form>`.
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
  `model<string>()` for two-way binding.
- **Icon button + custom listbox, not a native `<select>`.** The
  rendered control is a `<button>` that toggles a
  `<ul role="listbox">`. The component therefore owns the roles,
  states, focus moves, and the whole keyboard contract itself
  (§6.2) — none of it comes free from the platform. The tradeoffs
  this buys and costs are stated in `docs/accessibility.md`.
- **A hidden input carries the value.** `<input type="hidden">` keeps
  the control participating in a surrounding `<form>` now that no
  native form control remains.
- **Per-instance ids from a module counter.** `nextThemeSelectId()`
  increments a module-level integer, so option and listbox ids are
  stable and unique across instances without `Math.random()` or
  `Date.now()` — both of which would differ between the server and
  client renders and break hydration.
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
- **Custom glyph via a projected `<ng-template>`.** The Svelte
  canonical's `children` snippet maps to a projected
  `<ng-template>`, queried with `contentChild(TemplateRef)` and
  stamped with the `ChildArgs` context. The optional
  `ThemeSelectIcon` marker directive (`ng-template[lilyThemeSelectIcon]`)
  exists only to give consumers typed `let-` variables; the query
  does not depend on it.
- **Document-level listeners as host bindings.** Outside-click
  dismissal is a `host: { "(document:click)": … }` binding and
  focus-leave dismissal is a `(focusout)` binding on the root
  `<div>`, so Angular registers and tears both down with the
  component — no manual `addEventListener` / `removeEventListener`
  bookkeeping.

## 4. Public API

### 4.1 Inputs / outputs

| Input / output  | Type                                | Required | Default                          | Purpose |
| --------------- | ----------------------------------- | -------- | -------------------------------- | ------- |
| `label`         | `input.required<string>()`          | yes      | —                                | Accessible name; applied as `aria-label` to **both** the button and the listbox. |
| `themesUrl`     | `input.required<string>()`          | yes      | —                                | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `input.required<string[]>()`        | yes      | —                                | Available theme slugs. |
| `value`         | `model<string>()`                   | no       | `""`                             | Currently selected theme slug. Two-way bindable. |
| `defaultValue`  | `input<string>()`                   | no       | `""`                             | Initial theme when nothing else is supplied. |
| `storageKey`    | `input<string>()`                   | no       | `""`                             | If non-empty, persist the selection to `localStorage` under this key. |
| `detectFromSystem` | `input<boolean>()`               | no       | `false`                          | Resolve `prefers-color-scheme` to a supported theme on first visit. Mirrors `detectFromNavigator` on locale-select. |
| `name`          | `input<string>()`                   | no       | `"theme"`                        | `name` attribute on the hidden input **and** the discriminator on the managed `<link data-lily-theme-select="{name}">`. |
| `extension`     | `input<string>()`                   | no       | `".css"`                         | File extension appended to each slug when constructing the URL. |
| `target`        | `input<HTMLElement \| null>()`      | no       | `null` (→ `document.documentElement`) | Element that receives `data-theme`. |
| `themeLabels`   | `input<Record<string, string>>()`   | no       | `{}`                             | Optional pretty labels per slug. |
| `className`     | `input<string>()`                   | no       | `""`                             | Extra CSS class on the root `<div>`, appended after `theme-select`. |
| `themeChange`   | `output<string>()`                  | no       | —                                | Emits after the select applies a new theme. |

Content projection: an optional `<ng-template>` projected into
`<lily-theme-select>` replaces the default glyph inside the button.
It receives the `ChildArgs` context described in §4.2.

### 4.2 DOM contract

The rendered markup is:

```html
<div class="theme-select {className}">
  <input type="hidden" name="{name}" value="{value}" />

  <button type="button" class="theme-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
  </button>

  <ul class="theme-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden>
    <li class="theme-select-option" id="{listId-derived optionId}"
        role="option" aria-selected="true" data-active>Light</li>
    <li class="theme-select-option" id="…" role="option"
        aria-selected="false">Dark</li>
  </ul>
</div>
```

- **Root**: a `<div>` carrying the `theme-select` class hook plus the
  consumer's `className`. It is not a form control; it is a container.
- **Hidden input**: `<input type="hidden">` carrying `name` and the
  current `value`, so the control still participates in a surrounding
  `<form>`. `name` *also* discriminates the managed `<link>` (below),
  so two selects on one page need two distinct `name` values.
- **Button**: `type="button"` (never submits), `aria-haspopup="listbox"`,
  `aria-expanded` reflecting open state, and `aria-controls` pointing at
  the listbox `id`. Its accessible name comes entirely from
  `aria-label` — the glyph inside is `aria-hidden`.
- **Glyph**: `<span class="theme-select-icon" aria-hidden="true">`
  containing `◑` — U+25D1 CIRCLE WITH RIGHT HALF BLACK, `&#9681;`,
  exported as the constant `CIRCLE_WITH_RIGHT_HALF_BLACK`. A projected
  `<ng-template>` replaces the whole span; see below.
- **Listbox**: `<ul class="theme-select-list" role="listbox">` with the
  same `aria-label`, `tabindex="-1"` so it can take focus
  programmatically, and the `hidden` attribute while closed. While open
  it carries `aria-activedescendant` naming the active option's `id`;
  while closed the attribute is absent.
- **Options**: one `<li class="theme-select-option" role="option">` per
  slug, each with a stable per-instance `id`,
  `aria-selected="true|false"` for the selected theme, and a bare
  `data-active` attribute on the option the keyboard is currently
  pointing at. `data-active` is the consumer's styling hook for the
  "highlighted but not yet chosen" state; `aria-selected` is the
  assistive-technology channel for the chosen theme. They are usually
  different options while the user is arrowing around.
- **Ids**: `nextThemeSelectId()` returns `theme-select-{n}` from an
  incrementing module counter. The listbox is `{base}-list` and option
  *i* is `{base}-option-{i}`. Deterministic, unique per instance, and
  SSR-safe — no `Math.random()`, no `Date.now()`.
- **Custom glyph**: a projected `<ng-template>` (queried with
  `contentChild(TemplateRef)`) replaces the default
  `.theme-select-icon` span inside the button. Its context is
  `ChildArgs` — `{ $implicit, value, open, labelFor }`, where `value`
  is the selected slug, `open` is the listbox state, and `labelFor`
  resolves a slug to its display label. **The template does not render
  options**; it only replaces the button glyph. The listbox is always
  component-owned.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied;
  otherwise it delegates to the exported `themeName(slug)`, which
  title-cases each hyphen-separated word (`"high-contrast"` →
  `"High Contrast"`). `themeName` is the single implementation of that
  rule — consumers building their own affordance import it rather than
  re-deriving it, mirroring `localeName` on locale-select. The select
  never emits the word "default".
- A single managed `<link rel="stylesheet"
  data-lily-theme-select="{name}">` in `document.head`. Created on
  first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every
  apply.
- Positioning the listbox is a consumer-CSS concern; this package
  ships zero CSS. See `docs/styling.md`.

### 4.3 Re-exports

`index.ts` exports:

- `ThemeSelect` (the component class)
- `ThemeSelectIcon` (the optional icon-template marker directive)
- `CIRCLE_WITH_RIGHT_HALF_BLACK` (the default glyph constant)
- `nextThemeSelectId` (the per-instance id generator)
- `normaliseThemesUrl`, `themeHref` (pure helpers)
- `ChildArgs` (type-only export)

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
3. `matchSystemTheme(themes)` (only if `detectFromSystem` is `true`)
4. `defaultValue`
5. `"light"` (if `"light"` is in `themes`)
6. `themes[0]`
7. `""` (no apply happens — the select waits for user interaction)

System detection sits in exactly the position navigator detection
occupies for locale-select, so the two helpers resolve symmetrically:
`value > storage > detection > defaultValue > "light"/"en" > first`.
It is a *first-visit* default, never an override — a returning
visitor's stored choice still wins.

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

Nothing here is inherited from the platform. The component is a custom
[APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) and
owns every role, state, and focus move itself.

| Element                     | Role / property                                    | Source    |
| --------------------------- | -------------------------------------------------- | --------- |
| root `<div>`                | none (container)                                    | —         |
| `<input type="hidden">`     | `name`, `value`                                     | Component |
| `<button>`                  | implicit `role="button"`                            | Browser   |
| `<button>`                  | `aria-label` — the **only** accessible name it has  | Consumer  |
| `<button>`                  | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Component |
| `.theme-select-icon`        | `aria-hidden="true"`                                | Component |
| `<ul>`                      | `role="listbox"`, `aria-label`, `tabindex="-1"`     | Component |
| `<ul>` while open           | `aria-activedescendant="{active option id}"`        | Component |
| `<li>`                      | `role="option"`, `aria-selected`                    | Component |
| `<li>`                      | `data-active` (styling hook, not ARIA)              | Component |

The button is icon-only, so `aria-label` is its entire accessible
name. A vague or missing label leaves the control unusable to
screen-reader and voice-control users; `label` is `input.required`
for that reason. See `docs/accessibility.md` for the full tradeoff
accounting.

### 6.2 Keyboard contract

Implemented by the component, following the APG listbox pattern.

On the **button**:

| Key                       | Action                                                              |
| ------------------------- | ------------------------------------------------------------------- |
| `Enter` / `Space`         | Open the listbox; the active option is the selected one (or index 0). |
| `Arrow Down`              | Same as `Enter` / `Space`.                                           |
| `Arrow Up`                | Open the listbox with the **last** option active.                    |
| `Tab` / `Shift+Tab`       | Move focus to / away from the button.                                |

Opening always moves focus to the `<ul>`; the active option is
conveyed by `aria-activedescendant`, not by focus.

On the **listbox**:

| Key                | Action                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| `Arrow Down`       | Move the active option down one. **Clamps** at the last option — no wrap.  |
| `Arrow Up`         | Move the active option up one. **Clamps** at the first option — no wrap.   |
| `Home`             | Make the first option active.                                              |
| `End`              | Make the last option active.                                               |
| `Enter` / `Space`  | Select the active option, apply it, close, and return focus to the button. |
| `Escape`           | Close and return focus to the button **without** changing the value.       |
| `Tab`              | Close without stealing focus back; the browser moves focus onward.         |
| Printable chars    | Typeahead over the display **labels**; the buffer resets after 500 ms.     |

Pointer and focus behaviour alongside the keyboard:

- Clicking an option selects it, applies it, and closes the listbox.
- Clicking anywhere outside the root closes the listbox
  (`host: { "(document:click)": … }`).
- Focus leaving the root closes the listbox (`(focusout)` on the root
  `<div>`, ignoring moves to a descendant).

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

`theme-select.component.spec.ts` must assert every numbered clause
below, and every test in that file must name the clause it covers
(e.g. `test("§7.6 default initial value …")`). Tests run under vitest
+ jsdom + `@angular/core/testing` `TestBed`.

**7.1 — Skeleton.** The root is a `<div class="theme-select">`
carrying the consumer's `className`. It contains a
`<button type="button" class="theme-select-button">` with
`aria-haspopup="listbox"`, `aria-expanded="false"`, and an
`aria-controls` matching the `id` of a `<ul class="theme-select-list"
role="listbox">`. The button's default content is
`<span class="theme-select-icon" aria-hidden="true">` holding `◑`,
and the exported `CIRCLE_WITH_RIGHT_HALF_BLACK` equals that glyph.

**7.2 — Accessible name.** `label` is applied as `aria-label` to both
the button and the listbox.

**7.3 — Options and hidden input.** One `<li class="theme-select-option">`
is rendered per entry in `themes`. A `<input type="hidden">` carries
the supplied `name` and the resolved value. Option ids are non-empty
and unique across two concurrently mounted instances.

**7.4 — Open state.** The listbox carries `hidden` until the button is
activated; activating it removes `hidden` and flips `aria-expanded` to
`"true"`. Exactly one option carries `aria-selected="true"` — the
active theme. Exactly one option carries `data-active` while open.

**7.5 — Labels.** Default labels title-case each hyphen-separated word
of the slug, and the word `"default"` never appears. `themeLabels`
entries override the default label for their slug.

**7.6 — Initial value.** With no consumer-supplied
value / storage / `defaultValue`, the resolved initial value is
`"light"` when present in `themes`, otherwise `themes[0]`, and it is
written to `document.documentElement.dataset.theme`.

**7.7 — Managed link.** After mount a `<link rel="stylesheet"
data-lily-theme-select="{name}">` exists in `document.head` with
`href` equal to `${normalise(themesUrl)}${initial}${extension}`.

**7.8 — Applying a selection.** Choosing a different option updates
the link `href` and `document.documentElement.dataset.theme`, emits
`themeChange` with the new slug, and updates the hidden input's
`value`. A non-default `name` discriminates the managed `<link>`, so
no `data-lily-theme-select="theme"` link is created.

**7.9 — Persistence.** With `storageKey` set, the active slug is
written to `localStorage` and read back on a fresh mount.

**7.10 — Value precedence.** A non-empty `value` input wins over both
stored and defaulted values during initial resolution.

**7.11 — URL and target.** A `themesUrl` without a trailing `/` still
yields exactly one `/` before the slug. A supplied `target` receives
`data-theme` and the document root does not.

**7.12 — Class hook.** The consumer's `className` is appended to the
root `<div>`'s class list after `theme-select`.

**7.13 — Custom glyph.** A projected `<ng-template>` replaces the
default `.theme-select-icon` span inside the button (the default span
is then absent) and receives the `ChildArgs` context — `value`,
`open`, and a working `labelFor`.

**7.14 — Opening from the button.** `ArrowDown`, `Enter`, and `Space`
each open the listbox and set `aria-expanded="true"`, with
`aria-activedescendant` on the selected option. `ArrowUp` opens with
the **last** option active. Opening moves focus to the `<ul>`.

**7.15 — Moving the active option.** In the open listbox `ArrowDown` /
`ArrowUp` move `aria-activedescendant` by one and **clamp** at the
last / first option rather than wrapping. `Home` and `End` jump to the
first and last option.

**7.16 — Selecting.** `Enter` and `Space` select the active option,
apply it (`data-theme` updates), close the listbox
(`hidden` returns, `aria-expanded="false"`), and return focus to the
button.

**7.17 — Dismissing.** `Escape` closes the listbox without changing
the applied theme and returns focus to the button. `Tab` closes the
listbox without pulling focus back to the button, leaving the browser
to move focus onward.

**7.18 — Typeahead and pointer.** A printable character moves
`aria-activedescendant` to the first option whose **label** starts
with the buffer; the buffer resets after a 500 ms pause. Clicking an
option selects and applies it and closes the listbox. Clicking outside
the root closes the listbox.

**7.19 — Pure helpers.** `normaliseThemesUrl` and `themeHref` are
exported and behave per §5.1. `themeName` is exported, title-cases
each hyphen-separated word (`"high-contrast"` → `"High Contrast"`),
and is the implementation `labelFor` delegates to — `themeLabels`
entries still override it.

**7.20 — System-preference detection.** `matchSystemTheme(themes)` is
exported and resolves `matchMedia("(prefers-color-scheme: dark)")` to
`"dark"` or `"light"`, returning `""` when that slug is absent from
`themes` **or when `matchMedia` is unavailable** (SSR, and jsdom,
which does not implement it). With `detectFromSystem` set, the
resolved slug becomes the initial theme; storage and an explicit
`value` still win, and detection does not run unless opted in.

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
