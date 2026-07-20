# `<theme-select>` — Specification

Single source of truth for the `lily-design-system-html-theme-select`
HTML helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `theme-select.ts` — the custom-element implementation
- `theme-select.test.ts` — vitest + jsdom spec exercising every clause in §4–§7
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-html-headless/components/theme-select.html`) is
a pure container plus a stub script. This helper is the opinionated,
reusable counterpart packaged as a single custom element that owns
the dynamic loading lifecycle.

The Svelte sibling
(`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-select/`)
shares the same numbered acceptance criteria; this spec mirrors §1–§9
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless theme select that:

1. Renders an accessible icon button that opens a dropdown listbox
   of available themes (WAI-ARIA APG listbox pattern).
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the
   choice survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-select` class hook on the element's children. This
   includes the dropdown's positioning: without consumer CSS the
   list renders in normal flow, not as an overlay.

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
- Popover positioning, collision detection, or overlay layering.
  The element toggles `hidden` on the list and nothing more;
  `position`, `z-index`, and flip/shift behaviour are the
  consumer's CSS.
- An icon font or SVG asset. The button glyph is a plain Unicode
  character, and consumers who need a guaranteed rendering override
  `renderButtonContent()`.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<theme-select>`. The class is exported as `ThemeSelect` from
  `theme-select.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("theme-select", ThemeSelect)` on first
  module evaluation, guarded by a `customElements.get(...)` check
  so re-imports are idempotent. Consumers who want to control
  registration themselves can import the class directly from
  `theme-select.ts` (which does not register) and call
  `customElements.define(...)` with their preferred tag.
- **Light DOM.** The element renders its `<div>` root, button, and
  listbox as children, not in a shadow root. Consumer CSS targets
  the kebab-case class hooks (`theme-select`,
  `theme-select-button`, `theme-select-icon`, `theme-select-list`,
  `theme-select-option`) directly.
- **Icon button + listbox, not a native `<select>`.** The control
  is a `<button aria-haspopup="listbox">` paired with a
  `<ul role="listbox">`, following the WAI-ARIA APG listbox
  pattern. Focus sits on the `<ul>` while open and the highlighted
  option is conveyed with `aria-activedescendant`. The tradeoffs
  this buys and costs are recorded in §6.5.
- **A hidden `<input>` carries form participation.** The listbox is
  not a form control, so the element renders
  `<input type="hidden" name="{name}" value="{value}">` inside the
  root. This also keeps `name` meaningful for the managed `<link>`
  discriminator.
- **Stable ids from a module counter.** `nextThemeSelectId()`
  increments a module-level integer. No `Math.random()` and no
  `Date.now()`, so ids are deterministic and SSR-safe.
- **One `<link>` per select name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet" data-lily-theme-select="{name}">`.
  Multiple selects can coexist on a page by passing distinct
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
| `label`         | `string`        | yes      | —                        | Accessible name. Applied as `aria-label` on both the button and the listbox. The control is icon-only, so this is the *entire* accessible name — see §6.5. |
| `themes-url`    | `string`        | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string` (CSV)  | yes      | —                        | Available theme slugs, comma-separated (e.g. `"light,dark,abyss"`). The JS property `el.themes` accepts `string[]`. |
| `value`         | `string`        | no       | `""`                     | Currently selected theme slug. |
| `default-value` | `string`        | no       | `"light"` if present in themes, else first item | Initial theme when nothing else is supplied. |
| `storage-key`   | `string`        | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detect-from-system` | `boolean` attr | no  | absent / `false`         | If present (and not `="false"`), resolve `prefers-color-scheme` to a supported theme on first visit. Mirrors locale-select's `detect-from-navigator`. |
| `name`          | `string`        | no       | `"theme"`                | `name` on the rendered hidden `<input>`, and the discriminator on the managed `<link data-lily-theme-select="{name}">`. |
| `extension`     | `string`        | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `theme-labels`  | `string` (JSON) | no       | `"{}"`                   | Pretty labels per slug, JSON-encoded object. The JS property `el.themeLabels` accepts `Record<string, string>`. |
| `class`         | `string`        | no       | `""`                     | Extra CSS class on the rendered root `<div>` (in addition to `theme-select`). |

### 4.2 JS properties

Mirror every attribute with a getter/setter on the element instance:

- `el.label`, `el.themesUrl`, `el.themes` (`string[]`), `el.value`,
  `el.defaultValue`, `el.storageKey`, `el.detectFromSystem`,
  `el.name`, `el.extension`,
  `el.themeLabels` (`Record<string, string>`), `el.target`
  (`HTMLElement | null`, default `document.documentElement`; not
  exposed as an attribute because arbitrary elements cannot be
  serialised).

Read-only state and id accessors:

| Member                      | Type      | Purpose                                                        |
| --------------------------- | --------- | -------------------------------------------------------------- |
| `el.open`                   | `boolean` | Whether the listbox is currently open. Read-only.               |
| `el.listId`                 | `string`  | id of the rendered `<ul role="listbox">`.                       |
| `el.optionId(index)`        | `string`  | id of the rendered option at `index`.                           |

### 4.2.1 Public methods

| Method                          | Purpose                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| `openList(startIndex?)`         | Open the listbox. `startIndex` overrides which option starts active; the default is the selected option, else index 0. Moves focus to the `<ul>`. No-op when `themes` is empty. |
| `closeList(refocus = true)`     | Close the listbox. Returns focus to the button unless `refocus` is `false`. |
| `labelFor(slug)`                | Resolve a slug to its display label — `themeLabels[slug]` when supplied, otherwise the slug title-cased per hyphen-separated word. Public so subclasses and custom rendering can reuse it. |
| `renderButtonContent()`         | **Overridable rendering hook.** Returns the `Node` placed inside the button. See §4.7. |

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` returns
  `["label", "themes-url", "themes", "value", "default-value",
    "storage-key", "detect-from-system", "name", "extension",
    "theme-labels", "class"]`.
- `connectedCallback()` resolves the initial value (per §5.2) and
  renders the children.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field, re-renders (if it's a markup-affecting
  attribute: `themes`, `theme-labels`, `label`, `name`, `class`),
  and re-applies (if it's `value`). A `value` change deliberately
  does **not** rebuild the DOM — rebuilding while the listbox is
  open would destroy focus and the active descendant — so it only
  runs the state sync described in §4.5.
- `disconnectedCallback()` removes the managed `<link>` element only
  if no other `<theme-select>` with the same `name` remains in the
  document.

### 4.4 Events

The element fires a `themechange` `CustomEvent` after every applied
change. `event.detail` is `{ theme: string }`. The event bubbles and
is composed.

### 4.5 DOM contract

After render, the element contains exactly one child `<div>` root
holding a hidden `<input>`, the icon button, and the listbox:

```html
<theme-select label="Theme" themes-url="/assets/themes/" themes="light,dark">
  <div class="theme-select {consumer class}">
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
    </ul>
  </div>
</theme-select>
```

Binding rules for that markup:

- **Root.** A `<div class="theme-select {class}">` in light DOM. The
  consumer's `class` attribute on the host is mirrored onto it after
  the base hook.
- **Glyph.** The default button content is
  `<span class="theme-select-icon" aria-hidden="true">` containing
  U+25D1 CIRCLE WITH RIGHT HALF BLACK (`&#9681;`), exported as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is hidden from assistive
  technology, so the accessible name comes from the button's
  `aria-label` alone.
- **Hidden input.** `<input type="hidden" name="{name}" value="{value}">`
  preserves form participation. Its `value` tracks the real
  selection.
- **Aria wiring.** The button carries `aria-haspopup="listbox"`,
  `aria-expanded`, and `aria-controls={listId}`; the list carries
  `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, and
  `hidden` while closed.
- **`aria-activedescendant`** appears on the `<ul>` only while open,
  pointing at `optionId(activeIndex)`. It is removed on close.
- **`data-active` vs `aria-selected`.** `data-active` marks the
  keyboard-highlighted option; `aria-selected` marks the chosen one.
  They are different things and frequently differ while the list is
  open.
- **ids** come from `nextThemeSelectId()`, a module-level
  incrementing counter, so they are stable, unique per instance, and
  SSR-safe.

`labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
the slug title-cased per hyphen-separated word (`"light"` → `"Light"`,
`"high-contrast"` → `"High Contrast"`). The word "default" never
appears.

**State sync without rebuild.** `aria-expanded`, `hidden`,
`aria-activedescendant`, per-option `aria-selected` / `data-active`,
and the hidden input's `value` are updated in place. Only the
markup-affecting attributes in §4.3 rebuild the DOM, and a rebuild
always closes the list first because it cannot preserve focus
inside it.

**Reading the selection.** `this.value` is the real selection
(attribute + property). Consumers read it from `el.value` or from
the `themechange` detail.

A single managed `<link rel="stylesheet" data-lily-theme-select="{name}">`
in `document.head` is created on first apply, reused thereafter.

`data-theme="{slug}"` is set on the `target` element on every apply
(default `document.documentElement`).

**No CSS is shipped**, which includes positioning: the `<ul>` is a
normal flow element that the consumer must position (typically
`position: relative` on the root and `position: absolute` on the
list) if it is to overlay the page rather than push content down.

### 4.6 Re-exports

`index.ts` exports:

- `ThemeSelect` (the class)
- `normalizeThemesUrl`, `themeHref` (pure helpers; American spelling
  to match the rest of the file)
- `themeName` (slug → title-cased label; the mirror of
  locale-select's `localeName`. `labelFor` delegates to it, so there
  is exactly one implementation of the rule)
- `matchSystemTheme` (OS colour-scheme preference → supported slug, or
  `""`; the mirror of locale-select's `matchNavigatorLanguage`)
- `nextThemeSelectId` (the id counter)
- `CIRCLE_WITH_RIGHT_HALF_BLACK` (the default glyph)
- `type ThemeSelectProps`, `type ThemeSelectChangeDetail`

### 4.7 `renderButtonContent()` — the custom-rendering hook

The Svelte, React, and Vue siblings pass a `children` snippet /
render prop / slot that replaces the glyph inside the button and
receives `{ value, open, labelFor }`. Custom elements in light DOM
have no equivalent mechanism — `<slot>` is Shadow DOM only — so the
HTML helper's stand-in is an overridable method:

```ts
class MyThemeSelect extends ThemeSelect {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);  // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);          // ChildArgs.open
        return span;
    }
}
customElements.define("my-theme-select", MyThemeSelect);
```

Contract:

- Whatever `Node` it returns is placed inside the button, replacing
  the default `<span class="theme-select-icon">`.
- `this.value`, `this.open`, and `this.labelFor(...)` stand in for
  the `ChildArgs` the other frameworks pass.
- The base class still builds the button and the listbox, so the
  aria wiring and the whole §6.2 keyboard contract keep working.
- It is called during `#render()`, so it is re-invoked on every
  structural rebuild but not on a bare `value` change.

This is the recommended customisation path. `#render()` itself is a
private field and genuinely cannot be overridden; a subclass that
wants a different structure must post-process after the base class
renders, and in doing so takes over the entire accessibility
contract. See [`../docs/custom-rendering.md`](../docs/custom-rendering.md).

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
3. `matchSystemTheme(themes)` (only if `detectFromSystem` is set).
   Yields `"dark"` or `"light"` per `prefers-color-scheme`, or `""`
   when that slug is absent from `themes` or `matchMedia` is
   unavailable (SSR / jsdom).
4. `defaultValue`.
5. `"light"` (if `"light"` is in `themes`).
6. `themes[0]`.
7. `""` (no apply happens — the control waits for user interaction).

Resolution writes back to the `value` property and the matching
attribute.

Step 3 occupies the same slot navigator detection occupies in
locale-select, giving both helpers one shared shape:

```
value > storage > DETECTION > defaultValue > "light" / "en" > first
```

Detection resolves the initial value only; it does not subscribe to
later OS changes.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-select="{name}"`).
2. Set `link.href = normalizeThemesUrl(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Dispatch `themechange` `CustomEvent` with `detail: { theme: slug }`.

### 5.4 Reactivity

Setting `el.value`, mutating the `value` attribute, or choosing an
option in the listbox all trigger `applyTheme`. Other attribute /
property changes take effect on the next theme change or trigger a
re-render of the children (for `themes`, `name`, `theme-labels`,
`class`, `label`).

### 5.5 Open / close behaviour

- The button toggles the list: `openList()` when closed,
  `closeList()` when open.
- `openList(startIndex?)` sets the active option to `startIndex`,
  else the currently-selected option, else index 0; sets
  `aria-expanded="true"`; unhides the list; moves focus to the
  `<ul>`; and scrolls the active option into view where
  `scrollIntoView` exists.
- Choosing an option writes the slug to `this.value` and closes with
  focus returning to the button.
- A click outside the rendered root closes the list without
  refocusing (a `document`-level `click` listener registered in
  `connectedCallback` and removed in `disconnectedCallback`).
- Focus leaving the root closes the list without refocusing. The
  check is deferred to a microtask because some engines dispatch
  `focusout` with a null `relatedTarget` before the new focus target
  is committed.
- A structural re-render always closes the list first.

### 5.6 SSR / no-JS

The custom element only registers in browsers with
`customElements`. Without JS, the element renders nothing (it has
no children until `connectedCallback` runs). Consumers wanting
flicker-free first paint can place the `<link>` and `data-theme`
manually in the document head, then upgrade with this element.
Because ids come from a module counter rather than a random source,
nothing in the rendered markup varies between runs.

## 6. Accessibility

### 6.1 Roles and properties

The control implements the WAI-ARIA APG listbox pattern with a
collapsed trigger:

| Element                       | Role / property                                             |
| ----------------------------- | ----------------------------------------------------------- |
| `<theme-select>` (host)       | none — a transparent lifecycle container.                   |
| `<div class="theme-select">`  | none — a styling root.                                      |
| `<button>`                    | implicit `button` role; `aria-label={label}`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={listId}`. |
| `<span class="theme-select-icon">` | `aria-hidden="true"` so the glyph never becomes the name. |
| `<ul>`                        | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` while closed, `aria-activedescendant` while open. |
| `<li>`                        | `role="option"`, unique `id`, `aria-selected`; `data-active` when keyboard-highlighted. |
| `<input type="hidden">`       | form participation only; not in the accessibility tree.     |

**Focus model.** Focus moves to the `<ul>` when the list opens and
never to an individual `<li>`. The highlighted option is conveyed
solely through `aria-activedescendant`, which is what the APG
prescribes for a listbox with a roving active descendant.

### 6.2 Keyboard contract

Implemented in JavaScript — none of this comes from the platform.

On the **button**:

| Key                 | Action                                                             |
| ------------------- | ------------------------------------------------------------------ |
| `Tab` / `Shift+Tab` | Move focus onto / off the button.                                  |
| `ArrowDown`         | Open the list with the selected option active (else index 0).      |
| `Enter`             | Same as `ArrowDown`.                                               |
| `Space`             | Same as `ArrowDown`.                                               |
| `ArrowUp`           | Open the list with the **last** option active.                     |

On the **listbox** (`<ul>`, which holds focus while open):

| Key                 | Action                                                             |
| ------------------- | ------------------------------------------------------------------ |
| `ArrowDown`         | Move the active option down one. Clamps at the last option — no wrapping. |
| `ArrowUp`           | Move the active option up one. Clamps at the first option.         |
| `Home`              | Make the first option active.                                      |
| `End`               | Make the last option active.                                       |
| `Enter`             | Select the active option, apply it, close, return focus to the button. |
| `Space`             | Same as `Enter`.                                                   |
| `Escape`            | Close and return focus to the button **without** changing the value. |
| `Tab`               | Close without stealing focus back — focus moves on normally.       |
| printable character | Typeahead over the option *labels*; the buffer resets after 500 ms of no typing. The search starts at the active option and wraps once. |

Pointer equivalents: clicking the button toggles the list, clicking
an option selects it, clicking outside the root closes it.

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 Preloading strategy (consumer choice)

The default loads exactly one theme at a time. Consumers who want
instant switching drop their own `<link rel="stylesheet">` tags for
every theme; this control still updates `data-theme`, and theme CSS
scoped to `:root[data-theme="…"]` switches instantly.

### 6.5 Known tradeoffs

The icon-button-plus-listbox design buys a compact, fully-styleable
control and pays for it in three places. All three are the
consumer's to mitigate.

1. **Icon-only control.** The accessible name depends entirely on
   `aria-label`, which is `label`. A vague `label` leaves the
   control unusable to screen-reader users. Because there is no
   visible text label, the control also fails WCAG 2.5.3 Label in
   Name unless the consumer adds a visible label of their own.
2. **A custom listbox is weaker than a native `<select>`.** The
   native control got combobox semantics, platform keyboard
   behaviour, mobile OS pickers, and typeahead for free, all
   battle-tested in every assistive technology. A hand-rolled
   `role="listbox"` + `aria-activedescendant` widget is
   well-specified by the APG but has weaker and more variable
   support across screen readers and mobile browsers, and it does
   not get the native mobile picker UI.
3. **Glyph rendering is platform-dependent.** The glyph is a plain
   Unicode character with no bundled font — Lily ships no fonts or
   icon assets — so it may render as a colour emoji, a monochrome
   glyph, or tofu depending on the platform's fonts. Consumers who
   need a guaranteed appearance override `renderButtonContent()`
   with their own inline SVG.

Separately, the closed button shows only a glyph, so **the active
theme is not visible anywhere** unless the consumer surfaces it.
Pairing the control with visible text or a polite live region
updated on `themechange` is the documented default pattern; see
[`../docs/accessibility.md`](../docs/accessibility.md).

## 7. Testing acceptance criteria

`theme-select.test.ts` must assert every numbered item below, and
every test names the clause it covers (`§7.4 …`). Tests run under
vitest + jsdom. Several clauses carry more than one test; no clause
is without one.

The three pure-helper tests (`normalizeThemesUrl` keeping and
appending a trailing slash, `themeHref` composing the href) exercise
§5.1 and are not numbered here.

### Markup contract

1. The rendered root is a `<div class="theme-select">` containing a
   `<button type="button" class="theme-select-button">` with
   `aria-haspopup="listbox"`, `aria-expanded="false"`, and an
   `aria-controls` pointing at the rendered `<ul role="listbox">`.
   The button's default content is
   `<span class="theme-select-icon" aria-hidden="true">` holding
   U+25D1 (`◑`), the value of the exported
   `CIRCLE_WITH_RIGHT_HALF_BLACK`.
2. `aria-label` carries the supplied `label` on **both** the button
   and the listbox.
3. One `<li class="theme-select-option">` is rendered per entry in
   `themes`, and the hidden `<input>` carries the supplied `name`
   and the resolved value. No `.theme-select-placeholder` element
   and no `<select>` element is rendered.
4. The listbox starts `hidden` with `tabindex="-1"`; clicking the
   button unhides it and sets `aria-expanded="true"`. Exactly one
   option has `aria-selected="true"` and it is the active theme.
   Clicking an option applies that theme (`data-theme`), closes the
   list, resets `aria-expanded` to `"false"`, and updates the hidden
   input's value.
5. Option text is `themeLabels[slug]` when supplied, otherwise the
   title-cased slug (`"light"` → `"Light"`). The word `"default"`
   never appears.

### Dynamic loading

6. After mount with no consumer-supplied value / storage /
   `default-value`, the resolved initial value is `"light"` when
   present in `themes`, otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-select="{name}">` exists in `document.head` and
   its `href` equals
   `${normalizeThemesUrl(themesUrl)}${initial}${extension}`.
8. Choosing a different option updates the link `href`,
   `document.documentElement.dataset.theme`, and fires a
   `themechange` event carrying the new slug. The managed `<link>`
   is discriminated by `name`, so a select named `appearance`
   creates no `theme`-named link.
9. When `storage-key` is set, the active slug is written to
   `localStorage` and read back on a fresh element mount.
10. When `value` is set as an attribute, initial-value resolution
    skips storage and defaults and uses the supplied value.
11. When `themes-url` does not end with `/`, the constructed URL
    still has exactly one `/` between the directory and the slug.

### Element shape and property API

12. Extra DOM properties / attributes on the host survive
    re-rendering (`id`, `data-*` are untouched; the host stays the
    element). The consumer's `class` is appended to the root hook,
    giving `class="theme-select my-picker"`.
13. Setting `el.themes` as an array property is equivalent to
    setting the `themes` attribute as CSV, and `el.themeLabels`
    accepts a native object. List and option ids are unique across
    instances on the same page.

### Keyboard contract (APG listbox)

14. On the button, `ArrowDown`, `Enter`, and `Space` all open the
    list; opening moves focus to the `<ul>` and sets
    `aria-activedescendant` (plus `data-active`) to the selected
    option. `ArrowUp` opens with the last option active.
15. In the list, `ArrowDown` / `ArrowUp` move the active descendant
    and clamp at both ends without wrapping; `Home` and `End` jump
    to the first and last option.
16. `Enter` selects the active option, applies it, closes the list,
    removes `aria-activedescendant`, and returns focus to the
    button. `Space` behaves identically.
17. `Escape` closes the list and returns focus to the button without
    changing the theme. `Tab` closes the list without stealing focus
    back to the button.
18. A printable character runs typeahead over the option labels and
    moves the active descendant. A click outside the rendered root
    closes the list.

### Custom rendering

19. A subclass overriding `renderButtonContent()` replaces the
    default glyph — no `.theme-select-icon` is rendered — while the
    button/listbox structure and aria wiring
    (`aria-haspopup`, `aria-label`, a resolvable `aria-controls`)
    are untouched. `this.value`, `this.open`, and `this.labelFor()`
    are readable from inside the hook; the hook re-runs on every
    structural rebuild **and** on every state sync (a `value`
    change, each open and close) so derived content never goes
    stale; and the subclass still fires `themechange` through the
    base lifecycle.

## 8. Out-of-scope (future, not implemented here)

- A complementary `<theme-view>` custom element displaying the
  active theme name.
- A `prefers-color-scheme` integration.
- A non-`<link>` loader (inline `<style>` injection for strict CSP).
- A `preload` attribute that adds `<link rel="preload">` for every
  available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
