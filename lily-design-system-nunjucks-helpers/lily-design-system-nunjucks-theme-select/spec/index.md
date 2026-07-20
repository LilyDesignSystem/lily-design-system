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

1. Renders an accessible icon button that opens a listbox of available
   themes, from a Nunjucks macro (server-side / SSG-time).
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

- **Icon button + listbox, not a native `<select>`.** The control is a
  glyph-only `<button>` that opens a `<ul role="listbox">`. This buys a
  narrow, icon-sized control and full styling control over the open
  list, at the cost of the native control's free keyboard semantics and
  its no-JS operability (see §5.7 and §6).
- **Split between macro and client.js.** Nunjucks renders static HTML;
  both the listbox interaction (open/close, focus, keyboard, typeahead)
  and the lifecycle (storage, link swap, attribute set) can only happen
  in the browser. The macro emits the markup with
  `data-lily-theme-select-*` hooks and the client.js looks them up.
- **Ids come from a macro parameter, not a counter.** A Nunjucks macro
  is a pure template with no module-level mutable state, so it cannot
  mint an incrementing per-instance id the way the canonical Svelte
  helper does. The macro derives its id prefix from `name` instead, and
  accepts an explicit `id` override. Ids are therefore deterministic
  and SSR-safe (no `Math.random`, no `Date.now`) — but two instances
  sharing a `name` collide unless the consumer passes distinct `id`s.
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
| `label`        | `string`                   | yes      | —                        | Accessible name for BOTH the button and the listbox. The button is icon-only, so this is the only accessible name it has. |
| `themesUrl`    | `string`                   | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised at runtime. |
| `themes`       | `array<string>`            | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`        | `string`                   | no       | `""`                     | Initial theme slug. Emitted as `data-lily-theme-select-value` for the client to read (see §4.2). |
| `defaultValue` | `string`                   | no       | —                        | Initial theme when nothing else is supplied at runtime. |
| `storageKey`   | `string`                   | no       | `""`                     | If non-empty, the client.js persists the selection to `localStorage`. |
| `detectFromSystem` | `boolean`              | no       | `false`                  | When true, the client.js resolves `prefers-color-scheme` to `"dark"` / `"light"` if neither `value` nor storage supplied a slug. Client-only — see §5.2 and §5.8. |
| `name`         | `string`                   | no       | `"theme"`                | Hidden-input `name`, AND the discriminator on the managed `<link data-lily-theme-select="{name}">`, AND the default id prefix. |
| `extension`    | `string`                   | no       | `".css"`                 | File extension appended to each slug to build the URL. |
| `themeLabels`  | `object<string,string>`    | no       | `{}`                     | Optional pretty labels per slug. |
| `id`           | `string`                   | no       | `"theme-select-{name}"`  | Id prefix for the listbox (`{id}-list`) and its options (`{id}-option-{i}`). Pass an explicit value when two instances share a `name`. |
| `classes`      | `string`                   | no       | `""`                     | Extra CSS classes on the root `<div>`. |
| `attributes`   | `object<string,string>`    | no       | `{}`                     | Extra HTML attributes spread onto the root `<div>`. |

The `placeholder` parameter was **removed** in the icon-button release.
There is no `<select>` left to pin a placeholder onto, and the closed
control now shows a glyph rather than any word.

A `{% call %}` block body replaces the default glyph inside the button
— the Nunjucks equivalent of the canonical helper's `children`:

```njk
{% call themeSelect({label: "Theme", themesUrl: "/assets/themes/", themes: themes}) %}
  <svg class="my-icon" aria-hidden="true" viewBox="0 0 16 16">…</svg>
{% endcall %}
```

The block replaces only the glyph. It does not render options, and it
must not supply the accessible name — that stays on `aria-label`.

The macro never emits the word `"default"` for option labels; an
option's visible text comes from `themeLabels[slug]` when supplied
and otherwise from the slug with its first character upper-cased
(e.g. `"light"` → `"Light"`).

### 4.2 DOM contract (macro output)

```html
<div class="theme-select {classes}"
     data-lily-theme-select-root
     data-lily-theme-select-name="{name}"
     data-lily-theme-select-themes-url="{themesUrl}"
     data-lily-theme-select-extension="{extension}"
     data-lily-theme-select-storage-key="{storageKey}"
     data-lily-theme-select-default-value="{defaultValue}"
     data-lily-theme-select-value="{value}"
     {…attributes}>
  <input type="hidden" name="{name}" value="{selected}"
         data-lily-theme-select-input>
  <button type="button" class="theme-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{id}-list"
          data-lily-theme-select-button>
    <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-select-list" id="{id}-list" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      data-lily-theme-select-list>
    <li class="theme-select-option" id="{id}-option-{i}" role="option"
        aria-selected="true|false" data-value="{slug}">{labelFor(slug)}</li>
  </ul>
</div>
```

- The root is a `<div>` carrying the `theme-select` class hook plus the
  consumer's `classes`; `attributes` spread onto it.
- The button glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`&#9681;`),
  wrapped in `aria-hidden="true"`. The accessible name comes from
  `aria-label` alone — the glyph is never the name.
- `data-lily-theme-select-value` is emitted **only when `opts.value` is
  non-empty**; it remains the sole channel by which the consumer's
  `value` prop reaches the client. It is a data attribute rather than
  baked-in control state precisely so the browser paints nothing the
  client will have to correct.
- The macro resolves a server-side `selected` slug as
  `value or defaultValue or ("light" if present else themes[0])`. It
  marks exactly ONE option `aria-selected="true"` and every other
  option `aria-selected="false"`, and pre-fills the hidden input with
  it. `storageKey` and navigator preferences are client-only inputs, so
  the client may resolve a different slug after it runs; that is
  expected, and the listbox is closed while it happens.
- The listbox renders `hidden`, the button renders
  `aria-expanded="false"`, no option carries `data-active`, and the
  list carries no `aria-activedescendant`. Those are all client-owned,
  open-state concerns.
- Option ids are deterministic: `{id}-option-{index}`, where `id`
  defaults to `theme-select-{name}`. No `Math.random`, no `Date.now`,
  so server and client markup always agree.
- The hidden `<input>` preserves form participation and the `name`
  prop. It is pre-filled server-side, so a form submitted without any
  JS still carries a theme.
- The macro output contains NO inline `<style>` and NO `<script>` —
  the consumer loads `theme-select.client.js` separately.

### 4.3 Client.js exports

`theme-select.client.js` is an ES module exporting:

| Export              | Type                                                | Purpose |
| ------------------- | --------------------------------------------------- | ------- |
| `normaliseThemesUrl(url)` | `(string) => string`                          | Ensure exactly one trailing `/`. |
| `themeHref(url, slug, extension)` | `(string, string, string) => string`  | Build the theme href. |
| `themeName(theme)`  | `(string) => string`                                | Resolve a slug to its display label: each hyphen-separated word title-cased (`"high-contrast"` → `"High Contrast"`). Mirrors `localeName` in locale-select. |
| `matchSystemTheme(themes)` | `(string[]) => string`                       | Resolve `prefers-color-scheme` to `"dark"` / `"light"`, or `""` when that slug is absent from `themes` or `matchMedia` is unavailable. Mirrors `matchNavigatorLanguage` in locale-select. |
| `CIRCLE_WITH_RIGHT_HALF_BLACK` | `string`                               | The default button glyph, U+25D1. |
| `initThemeSelect(root, opts?)` | `(HTMLElement, object?) => {setTheme, destroy}` | Wire one rendered root. |
| `autoInit(opts?)`   | `(object?) => Array<{setTheme, destroy}>`           | Find every `[data-lily-theme-select-root]` and init it. |

`initThemeSelect` returns a controller with:

- `setTheme(slug)` — apply a theme imperatively (mirrors choosing an option).
- `destroy()` — remove every event listener the module attached,
  including the one on `document`. The applied DOM is left as-is.

`initThemeSelect` returns an inert controller (both methods no-ops) when
`document` is undefined, when `root` is falsy, or when the expected
button / listbox children are missing.

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

1. The root's `data-lily-theme-select-value` attribute (i.e. the
   consumer's `value` prop). The macro omits the attribute entirely
   when `opts.value` is unset, so an absent attribute reads as `""`
   and falls through.
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `matchSystemTheme(values)` — only when `detectFromSystem` is true.
   Returns `""` when the preferred scheme is not among the rendered
   options, or when `matchMedia` is unavailable.
4. The root's `data-lily-theme-select-default-value` attribute.
5. `"light"` if present among the rendered option values.
6. The first option's `data-value`, or `""` if none.

**BREAKING (Unreleased): `value` now precedes storage.** Until this
change the order was storage-first, on the theory that a returning
user's saved choice should win. It should not. `opts.value` is the
channel a Nunjucks consumer uses to pass a theme they *already*
resolved on the server — from a cookie, a session, a signed-in user's
profile — and that is the whole point of rendering server-side. Under
storage-first, a stale `localStorage` entry silently overrode it, so a
user who changed their theme on another device, or whose account
preference was updated server-side, saw the old theme with no
indication why. Value-first also matches every other Lily helper,
including the canonical Svelte one.

Storage still wins over everything *below* `value`, so the returning
user with no server-resolved theme lands on their saved choice exactly
as before. Consumers who genuinely want the old behaviour can get it
explicitly by reading `localStorage` themselves and passing the result
as `opts.value`.

This position mirrors `detectFromNavigator` in locale-select: detection
slots in after storage and before `defaultValue` in both helpers.

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
5. Mirror the slug into the hidden input's `value`, and re-derive every
   option's `aria-selected` so exactly one reads `"true"`.
6. Call `opts.onChange?.(slug)` if supplied.

### 5.4 Reactivity

The client.js attaches listeners for `click` and `keydown` on the
button, `click` and `keydown` on the listbox, `focusout` on the root,
and `click` on `document` (for click-outside dismissal). Choosing an
option — by click or by Enter / Space — applies the slug and closes the
listbox. `setTheme` on the returned controller performs the same apply
without touching open state.

Note that `aria-selected` tracks the APPLIED theme, not the active
option. Moving the active option with the arrow keys changes
`data-active` and `aria-activedescendant` only; nothing is selected
until the user commits.

### 5.5 Open / close

Opening sets `list.hidden = false`, `aria-expanded="true"`, seeds the
active option, and moves focus to the `<ul>`. Closing sets
`list.hidden = true`, `aria-expanded="false"`, clears `data-active` and
`aria-activedescendant`, and — except after `Tab` and except when the
close was caused by a click outside or focus leaving the root — returns
focus to the button.

### 5.6 Keyboard contract (WAI-ARIA APG listbox)

On the **button**:

| Key | Action |
| --- | ------ |
| `ArrowDown`, `Enter`, `Space` | Open, active option = the selected one (or index 0). |
| `ArrowUp` | Open, active option = the LAST option. |

On the **listbox**:

| Key | Action |
| --- | ------ |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; does NOT wrap. |
| `Home` / `End` | Jump to the first / last option. |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape` | Close and return focus, leaving the value unchanged. |
| `Tab` | Close without stealing focus back, so the browser's own Tab handling proceeds. |
| Printable character | Typeahead over the option labels; the buffer accumulates and resets 500 ms after the last keystroke. Chords with Ctrl / Meta / Alt are ignored. |

Pointer behaviour: clicking an option selects it; clicking the button
toggles; clicking outside the root closes; focus leaving the root
closes.

### 5.7 SSR and the no-JS story

The macro renders deterministic markup; no DOM access at template
time. The client.js touches `document` only after
`initThemeSelect(root)` is called, and only when
`typeof document !== "undefined"`.

**The control is not operable before the client JS runs.** The button
is inert: it has no handler, so it will not open the listbox, and the
listbox stays `hidden`. This is a genuine regression from the native
`<select>` this helper used to render, which was fully usable with no
JS at all. The only no-JS affordance that survives is the pre-filled
hidden input, which lets a form submit still carry a theme. Consumers
for whom no-JS operability is a hard requirement should use the
headless catalog's plain `theme-select` `<select>` container instead of
this helper. See [docs/ssr.md](../docs/ssr.md).

### 5.8 Where detection lives, and why the server markup ignores it

`detectFromSystem` is resolved **only** in the client.js. `matchMedia`
does not exist at Nunjucks render time, so the macro cannot know the
user's colour-scheme preference and does not try: it emits the flag as
`data-lily-theme-select-detect-from-system` and nothing more.

The macro's own server-side `selected` resolution (§4.2) therefore stays
the narrower `value or defaultValue or ("light" if present else
themes[0])`. It is deliberately *not* the §5.2 chain — storage and
`matchMedia` are both client-only inputs — and the two are consistent
rather than contradictory: the server marks the best slug it can know
about, the listbox renders closed, and `initThemeSelect` runs
`applyTheme` on init, rewriting `aria-selected` and the hidden input if
the client resolves something different. No user ever sees the
intermediate state as an interactive control, because the button is
inert until the client runs (§5.7).

The consequence worth stating plainly: with `detectFromSystem` and no
`value`, the server-rendered `aria-selected` will often name a
different theme than the one that ends up applied. That is expected. A
consumer who needs the two to agree on first paint must resolve the
theme server-side — a cookie set from a client-side `matchMedia` probe
— and pass it as `opts.value`. This is the same tradeoff
`detectFromNavigator` carries in locale-select.

## 6. Accessibility

- The button carries `aria-haspopup="listbox"`, `aria-expanded`, and
  `aria-controls`; the `<ul>` carries `role="listbox"`; each `<li>`
  carries `role="option"` and an explicit `aria-selected`.
- The active option is conveyed with `aria-activedescendant` on the
  focused `<ul>`, per the APG listbox pattern — focus itself stays on
  the `<ul>`.
- `aria-label` is the ONLY accessible name the button has, because the
  glyph is `aria-hidden`. A missing or vague `label` leaves the control
  effectively unnamed.
- A custom listbox has weaker and less consistent assistive-technology
  support than a native `<select>`, and the glyph may render
  differently or be absent depending on platform fonts. Both tradeoffs
  are stated in [docs/accessibility.md](../docs/accessibility.md).
- WCAG 2.2 AAA is the target. Focus styling is the consumer's CSS
  concern, and the closed button shows no text, so the consumer is
  responsible for surfacing the active theme elsewhere if users need
  it.
- The control never emits the word `"default"`.

## 7. Testing acceptance criteria

`theme-select.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Items 1–6 exercise the macro via
`nunjucks.renderString`; items 7–13 exercise the client.js against a
jsdom document populated from the macro output.

1. Macro renders a `<div class="theme-select">` root containing a
   `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and `aria-controls` pointing at a
   `<ul role="listbox" tabindex="-1">`.
   The button renders the U+25D1 glyph inside an `aria-hidden` span,
   so the glyph is never the accessible name.
2. `aria-label` equals the supplied `label` on BOTH the button and the
   listbox.
3. Macro renders one `<li role="option">` per entry in `themes`; the
   hidden input carries the supplied `name`.
4. Each option carries its slug on `data-value` and a unique,
   deterministic id; re-rendering the same macro call yields the same
   ids. An explicit `id` namespaces `{id}-list` and `{id}-option-{i}`.
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
9. Choosing an option updates the link `href`, the `data-theme`
   attribute, the hidden input's value, and fires `onChange` with the
   new slug.
10. When `storageKey` is set, the active slug is written to
    `localStorage` and read back as the initial value on a fresh
    init.
11. When `themesUrl` lacks a trailing slash, the constructed href
    still has exactly one slash between directory and slug.
12. `normaliseThemesUrl` and `themeHref` are exported pure helpers
    that match §5.1.
13. Extra `attributes` keys in `opts` (e.g. `{"data-testid":"tp"}`)
    are spread onto the root `<div>`; `destroy()` detaches every
    listener.
14. In the server markup, before any JS runs, the listbox is `hidden`,
    the button is `aria-expanded="false"`, no option carries
    `data-active`, and the list carries no `aria-activedescendant`.
15. In the server markup exactly ONE option has
    `aria-selected="true"` and every other option has an explicit
    `aria-selected="false"`. With `opts.value` set it is that value;
    with no value it is `"light"` when present, else `themes[0]`.
    (This replaces the retired placeholder-pinning guard — there is no
    placeholder and no `<select>` to pin.)
16. The hidden input is pre-filled server-side with the resolved slug,
    so a no-JS form submit still carries a theme.
17. When `opts.value` is set, the root carries
    `data-lily-theme-select-value="{value}"`, and
    `initThemeSelect(root)` resolves the initial theme from it (in
    preference to `defaultValue`).
18. When `opts.value` is unset, the root carries no
    `data-lily-theme-select-value` attribute at all.
19. A `{% call %}` block body replaces the default glyph inside the
    button; `aria-label` still carries the accessible name.
20. On the button, `ArrowDown` / `Enter` / `Space` open the listbox,
    set `aria-expanded="true"`, and move focus to the `<ul>`;
    `ArrowUp` opens with the LAST option active.
21. Opening seeds the active descendant on the selected theme.
    `ArrowDown` / `ArrowUp` move it and clamp at both ends rather than
    wrapping; `Home` / `End` jump to the first / last option.
22. `Enter` and `Space` on the listbox select the active option, apply
    it, close the listbox, and return focus to the button.
23. `Escape` closes and returns focus without changing the theme and
    without firing `onChange`. `Tab` closes without stealing focus
    back.
24. Printable characters run a typeahead over the option labels; the
    buffer accumulates across keystrokes and resets 500 ms after the
    last one; chords with Ctrl / Meta / Alt are ignored. Clicking an
    option selects it, clicking the button toggles, clicking outside
    closes, and focus leaving the root closes. `aria-selected` follows
    the applied theme rather than the merely-active option.
25. `themeName` is an exported pure helper that title-cases each
    hyphen-separated word of a slug, and the macro's rendered option
    labels agree with it for every slug.
26. `matchSystemTheme` resolves `"dark"` and `"light"` from
    `prefers-color-scheme`, returns `""` when that slug is absent from
    the supplied list, and returns `""` when `matchMedia` is
    unavailable (SSR — and jsdom, which does not implement it).
27. `detectFromSystem` resolves the initial theme when nothing above it
    in §5.2 did; detection is off unless opted in; storage beats
    detection; detection beats `defaultValue`. The macro emits
    `data-lily-theme-select-detect-from-system` (defaulting to
    `"false"`), and detection never changes the server-rendered
    `aria-selected`.
28. `opts.value` beats a conflicting `localStorage` entry; storage
    still applies when `opts.value` is absent; and the full order runs
    value > storage > detection > `defaultValue` > `"light"` > first.

## 8. Out-of-scope (future)

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
