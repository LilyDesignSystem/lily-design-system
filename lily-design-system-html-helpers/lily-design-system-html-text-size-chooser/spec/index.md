# `<text-size-chooser>` — Specification

Single source of truth for the
`lily-design-system-html-text-size-chooser` HTML helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

Sibling files in this directory:

- `text-size-chooser.ts` — the custom-element implementation
- `text-size-chooser.test.ts` — vitest + jsdom spec exercising §4–§7
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The Svelte canonical
(`lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-chooser/`)
shares the same numbered acceptance criteria; this spec mirrors it
re-expressed for the custom-element idiom.

The control is structurally identical to its `theme-chooser` and
`locale-chooser` siblings in this catalog: an icon button that opens a
WAI-ARIA APG listbox. All three helpers are the same shape.

---

## 1. Goal

Give any HTML page a drop-in, headless text-size chooser that:

1. Renders an accessible icon button that opens a dropdown listbox of
   available sizes (WAI-ARIA APG listbox pattern).
2. **Applies the chosen size** by setting `data-text-size="{slug}"` on
   the document root (or on a consumer-supplied target).
3. Optionally persists the chosen slug to `localStorage`.
4. Ships zero CSS — the consumer maps each slug to real typography via
   CSS keyed on `[data-text-size="{slug}"]`, and supplies the list's
   positioning.

This directly supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12
(Text Spacing) — by letting users pick a comfortable reading size that
the app remembers.

## 2. Non-goals

- **Typography**. The helper applies no `font-size`/scale; the CSS that
  maps a slug to typography is the consumer's.
- **Picking default sizes**. The consumer supplies the slug list.
- **Per-element scaling**. The helper writes one `data-text-size` to a
  single target; cascading typography is the consumer's CSS concern.
- **Detecting a preferred size.** There is no OS "preferred text size"
  media query equivalent to `prefers-color-scheme` or
  `navigator.languages`, so this helper has no detection prop — unlike
  theme-chooser's `detect-from-system` and locale-chooser's
  `detect-from-navigator`.
- **Popover positioning**, collision detection, or overlay layering.
  The element toggles `hidden` on the list and nothing more.
- **An icon font or SVG asset.** The button glyph is a plain Unicode
  character; consumers who need a guaranteed rendering override
  `renderButtonContent()`.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<text-size-chooser>`. The class is exported as `TextSizeChooser` from
  `text-size-chooser.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("text-size-chooser", TextSizeChooser)` on first
  module evaluation, guarded by a `customElements.get(...)` check so
  re-imports are idempotent. Consumers who want to control
  registration themselves can import the class directly from
  `text-size-chooser.ts` (which does not register).
- **Light DOM.** The element renders its `<div>` root, button, and
  listbox as children, not in a shadow root. Consumer CSS targets the
  kebab-case class hooks (`text-size-chooser`,
  `text-size-chooser-button`, `text-size-chooser-icon`,
  `text-size-chooser-list`, `text-size-chooser-option`) directly.
- **Icon button + listbox, not a native `<select>`.** The control is a
  `<button aria-haspopup="listbox">` paired with a
  `<ul role="listbox">`, following the WAI-ARIA APG listbox pattern.
  Focus sits on the `<ul>` while open and the highlighted option is
  conveyed with `aria-activedescendant`. The tradeoffs are in §6.5.
- **A hidden `<input>` carries form participation.** The listbox is
  not a form control, so the element renders
  `<input type="hidden" name="{name}" value="{value}">` inside the
  root, keeping `name` and form submission meaningful.
- **Stable ids from a module counter.** `nextTextSizeChooserId()`
  increments a module-level integer. No `Math.random()` and no
  `Date.now()`, so ids are deterministic and SSR-safe.
- **The `data-text-size` attribute is the applied output.**
- **No managed `<link>`, no `lang`/`dir`.** Unlike the theme / locale
  siblings, this helper only writes a single `data-*` attribute.
- **No dependencies.**

## 4. Public API

### 4.1 Observed attributes

All observed attributes are kebab-case. `attributeChangedCallback`
re-renders / re-applies as needed.

| Attribute        | Type            | Required | Default                       | Purpose |
| ---------------- | --------------- | -------- | ----------------------------- | ------- |
| `label`          | `string`        | yes      | —                             | Accessible name. Applied as `aria-label` on both the button and the listbox. The control is icon-only, so this is the *entire* accessible name — see §6.5. |
| `sizes`          | `string` (CSV)  | yes      | —                             | Available size slugs, comma-separated. The JS property `el.sizes` accepts `string[]`. |
| `value`          | `string`        | no       | `""`                          | Currently selected slug. |
| `default-value`  | `string`        | no       | `"medium"` if present, else first | Initial slug when nothing else is supplied. |
| `storage-key`    | `string`        | no       | `undefined`                   | If set, persist the selection to `localStorage` under this key. |
| `name`           | `string`        | no       | `"text-size"`                 | `name` on the rendered hidden `<input>`. |
| `size-labels`    | `string` (JSON) | no       | `"{}"`                        | Pretty labels per slug, JSON-encoded object. The JS property `el.sizeLabels` accepts `Record<string, string>`. |
| `class`          | `string`        | no       | `""`                          | Extra CSS class on the rendered root `<div>` (in addition to `text-size-chooser`). |

### 4.2 JS properties

Mirror every attribute with a getter/setter on the element instance:

- `el.label`, `el.sizes` (`string[]`), `el.value`, `el.defaultValue`,
  `el.storageKey`, `el.name`, `el.sizeLabels`
  (`Record<string, string>`), `el.target` (`HTMLElement | null`,
  default `document.documentElement`; not exposed as an attribute
  because arbitrary elements cannot be serialised).

Read-only state and id accessors:

| Member               | Type      | Purpose                                            |
| -------------------- | --------- | -------------------------------------------------- |
| `el.open`            | `boolean` | Whether the listbox is currently open. Read-only.   |
| `el.listId`          | `string`  | id of the rendered `<ul role="listbox">`.           |
| `el.optionId(index)` | `string`  | id of the rendered option at `index`.               |

### 4.2.1 Public methods

| Method                      | Purpose |
| --------------------------- | ------- |
| `openList(startIndex?)`     | Open the listbox. `startIndex` overrides which option starts active; the default is the selected option, else index 0. Moves focus to the `<ul>`. No-op when `sizes` is empty. |
| `closeList(refocus = true)` | Close the listbox. Returns focus to the button unless `refocus` is `false`. |
| `labelFor(slug)`            | Resolve a slug to its display label — `sizeLabels[slug]` when supplied, otherwise `sizeName(slug)`. Public so subclasses and custom rendering can reuse it. |
| `renderButtonContent()`     | **Overridable rendering hook.** Returns the `Node` placed inside the button. See §4.7. |

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` returns
  `["label", "sizes", "value", "default-value", "storage-key",
    "name", "size-labels", "class"]`.
- `connectedCallback()` resolves the initial value (per §5.2), renders
  the children, registers the document click listener, and applies the
  size.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field, re-renders (if it's a markup-affecting
  attribute: `sizes`, `size-labels`, `label`, `name`, `class`), and
  re-applies (if it's `value`). A `value` change deliberately does
  **not** rebuild the DOM — rebuilding while the listbox is open would
  destroy focus and the active descendant — so it only runs the state
  sync described in §4.5.
- `disconnectedCallback()` removes the document click listener and
  clears the typeahead timer. It does not unset `data-text-size`.

### 4.4 Events

The element fires a `textsizechange` `CustomEvent` after every applied
change. `event.detail` is `{ size: string }`. The event bubbles and is
composed.

### 4.5 DOM contract

After render, the element contains exactly one child `<div>` root
holding a hidden `<input>`, the icon button, and the listbox:

```html
<text-size-chooser label="Text size" sizes="small,medium,large,x-large">
  <div class="text-size-chooser {consumer class}">
    <input type="hidden" name="text-size" value="medium" />
    <button type="button" class="text-size-chooser-button"
            aria-label="Text size" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="text-size-chooser-1-list">
      <span class="text-size-chooser-icon" aria-hidden="true">A</span>
    </button>
    <ul class="text-size-chooser-list" id="text-size-chooser-1-list"
        role="listbox" aria-label="Text size" tabindex="-1" hidden>
      <li class="text-size-chooser-option" id="text-size-chooser-1-option-0"
          role="option" aria-selected="false">Small</li>
      <li class="text-size-chooser-option" id="text-size-chooser-1-option-1"
          role="option" aria-selected="true" data-active>Medium</li>
    </ul>
  </div>
</text-size-chooser>
```

Binding rules for that markup:

- **Root.** A `<div class="text-size-chooser {class}">` in light DOM.
  The consumer's `class` attribute on the host is mirrored onto it
  after the base hook.
- **Glyph.** The default button content is
  `<span class="text-size-chooser-icon" aria-hidden="true">` containing
  U+0041 LATIN CAPITAL LETTER A, exported as
  `LATIN_CAPITAL_LETTER_A`. A plain letter, not a pictograph: the
  obvious candidate U+1F5DB DECREASE FONT SIZE SYMBOL has no real
  glyph in common font stacks and means *decrease* rather than *size*.
  It is hidden from assistive technology, so the accessible name comes
  from the button's `aria-label` alone.
- **Hidden input.** `<input type="hidden" name="{name}" value="{value}">`
  preserves form participation. Its `value` tracks the real selection.
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
- **ids** come from `nextTextSizeChooserId()`, a module-level
  incrementing counter, so they are stable, unique per instance, and
  SSR-safe.

**State sync without rebuild.** `aria-expanded`, `hidden`,
`aria-activedescendant`, per-option `aria-selected` / `data-active`,
and the hidden input's `value` are updated in place. Only the
markup-affecting attributes in §4.3 rebuild the DOM, and a rebuild
always closes the list first because it cannot preserve focus inside
it.

**Reading the selection.** `this.value` is the real selection
(attribute + property). Consumers read it from `el.value` or from the
`textsizechange` detail.

`data-text-size="{slug}"` is set on the `target` element on every apply
(default `document.documentElement`).

**No CSS is shipped**, which includes positioning: the `<ul>` is a
normal flow element that the consumer must position (typically
`position: relative` on the root and `position: absolute` on the list)
if it is to overlay the page rather than push content down.

### 4.6 Re-exports

`index.ts` exports:

- `TextSizeChooser` (the class)
- `sizeName` (slug → title-cased label; the mirror of theme-chooser's
  `themeName` and locale-chooser's `localeName`. `labelFor` delegates
  to it, so there is exactly one implementation of the rule)
- `nextTextSizeChooserId` (the id counter)
- `LATIN_CAPITAL_LETTER_A` (the default glyph)
- `type TextSizeChooserProps`, `type TextSizeChooserChangeDetail`

### 4.7 `renderButtonContent()` — the custom-rendering hook

The Svelte, React, and Vue siblings pass a `children` snippet / render
prop / slot that replaces the glyph inside the button and receives
`{ value, open, labelFor }`. Custom elements in light DOM have no
equivalent mechanism — `<slot>` is Shadow DOM only — so the HTML
helper's stand-in is an overridable method:

```ts
class MyTextSizeChooser extends TextSizeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);  // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);          // ChildArgs.open
        return span;
    }
}
customElements.define("my-text-size-chooser", MyTextSizeChooser);
```

Contract:

- Whatever `Node` it returns is placed inside the button, replacing
  the default `<span class="text-size-chooser-icon">`.
- `this.value`, `this.open`, and `this.labelFor(...)` stand in for the
  `ChildArgs` the other frameworks pass.
- The base class still builds the button and the listbox, so the aria
  wiring and the whole §6.2 keyboard contract keep working.
- It is called during `#render()` **and** during every state sync, so
  derived content never goes stale on a `value` change or an
  open/close.

## 5. Behaviour

### 5.1 Label resolution

`labelFor(slug)` returns `sizeLabels[slug]` if present, otherwise
`sizeName(slug)` — the slug title-cased per hyphen-word (`x-large` →
`X Large`). The word "default" is never emitted.

### 5.2 Initial value resolution

On first `connectedCallback` in the browser, the initial slug is the
first non-empty value of:

1. The `value` attribute (if non-empty).
2. `localStorage.getItem(storageKey)` (only if `storage-key` is set and
   the read does not throw).
3. The `default-value` attribute.
4. `"medium"` if present in `sizes`, else `sizes[0]`.
5. `""` (no apply happens — the control waits for user interaction).

There is no detection step: the platform exposes no preferred-text-size
signal (§2).

### 5.3 Applying a size

Applying a slug performs, in order:

1. Resolve the target element (default `document.documentElement`).
2. Set `target.setAttribute("data-text-size", slug)`.
3. If `storage-key` is set, write `slug` to `localStorage` inside a
   try/catch.
4. Dispatch `textsizechange` `CustomEvent` with `detail: { size: slug }`.

### 5.4 Reactivity

Setting `el.value`, mutating the `value` attribute, or choosing an
option in the listbox all trigger an apply. Other attribute / property
changes re-render the children when relevant (`sizes`, `size-labels`,
`label`, `name`, `class`) and take effect on the next apply.

### 5.5 Open / close behaviour

- The button toggles the list: `openList()` when closed, `closeList()`
  when open.
- `openList(startIndex?)` sets the active option to `startIndex`, else
  the currently-selected option, else index 0; sets
  `aria-expanded="true"`; unhides the list; moves focus to the `<ul>`;
  and scrolls the active option into view where `scrollIntoView`
  exists.
- Choosing an option writes the slug to `this.value` and closes with
  focus returning to the button.
- A click outside the rendered root closes the list without refocusing
  (a `document`-level `click` listener registered in
  `connectedCallback` and removed in `disconnectedCallback`).
- Focus leaving the root closes the list without refocusing. The check
  is deferred to a microtask because some engines dispatch `focusout`
  with a null `relatedTarget` before the new focus target is committed.
- A structural re-render always closes the list first.

### 5.6 SSR / no-JS

The custom element only registers in browsers with `customElements`.
Without JS, the element renders nothing (it has no children until
`connectedCallback` runs). Consumers wanting flicker-free first paint
can place `data-text-size` on `<html>` manually, then upgrade with
this element. Because ids come from a module counter rather than a
random source, nothing in the rendered markup varies between runs.

## 6. Accessibility

### 6.1 Roles and properties

The control implements the WAI-ARIA APG listbox pattern with a
collapsed trigger:

| Element                            | Role / property |
| ---------------------------------- | --------------- |
| `<text-size-chooser>` (host)        | none — a transparent lifecycle container. |
| `<div class="text-size-chooser">`   | none — a styling root. |
| `<button>`                         | implicit `button` role; `aria-label={label}`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={listId}`. |
| `<span class="text-size-chooser-icon">` | `aria-hidden="true"` so the glyph never becomes the name. |
| `<ul>`                             | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` while closed, `aria-activedescendant` while open. |
| `<li>`                             | `role="option"`, unique `id`, `aria-selected`; `data-active` when keyboard-highlighted. |
| `<input type="hidden">`            | form participation only; not in the accessibility tree. |

**Focus model.** Focus moves to the `<ul>` when the list opens and
never to an individual `<li>`. The highlighted option is conveyed
solely through `aria-activedescendant`, which is what the APG
prescribes for a listbox with a roving active descendant.

### 6.2 Keyboard contract

Implemented in JavaScript — none of this comes from the platform.

On the **button**:

| Key                 | Action |
| ------------------- | ------ |
| `Tab` / `Shift+Tab` | Move focus onto / off the button. |
| `ArrowDown`         | Open the list with the selected option active (else index 0). |
| `Enter`             | Same as `ArrowDown`. |
| `Space`             | Same as `ArrowDown`. |
| `ArrowUp`           | Open the list with the **last** option active. |

On the **listbox** (`<ul>`, which holds focus while open):

| Key                 | Action |
| ------------------- | ------ |
| `ArrowDown`         | Move the active option down one. Clamps at the last option — no wrapping. |
| `ArrowUp`           | Move the active option up one. Clamps at the first option. |
| `Home`              | Make the first option active. |
| `End`               | Make the last option active. |
| `Enter`             | Select the active option, apply it, close, return focus to the button. |
| `Space`             | Same as `Enter`. |
| `Escape`            | Close and return focus to the button **without** changing the value. |
| `Tab`               | Close without stealing focus back — focus moves on normally. |
| printable character | Typeahead over the option *labels*; the buffer resets after 500 ms of no typing. The search starts at the active option and wraps once. |

Pointer equivalents: clicking the button toggles the list, clicking an
option selects it, clicking outside the root closes it.

### 6.3 Internationalisation

- `label` and entries of `sizeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 WCAG 1.4.4 (Resize Text)

This is the helper's specific accessibility purpose. 1.4.4 requires
text to be resizable to 200% without loss of content or functionality.
Browser zoom satisfies it, but an in-page control does better: it is
discoverable, it persists across visits, and it survives contexts
where zoom is awkward (kiosks, embedded webviews, users who do not
know the shortcut). Consumers should:

- Size typography in relative units (`rem`/`em`) keyed off
  `:root[data-text-size="…"]`, so the whole scale moves together.
- Offer a range reaching at least 200% of the base size.
- Ensure layout reflows rather than clipping at the largest size —
  1.4.10 (Reflow) and 1.4.12 (Text Spacing) are what break first.

The helper only records and applies the preference; meeting 1.4.4 is
the consumer's CSS.

### 6.5 Known tradeoffs

The icon-button-plus-listbox design buys a compact, fully-styleable
control and pays for it in three places — the same three as
theme-chooser and locale-chooser. All three are the consumer's to
mitigate.

1. **Icon-only control.** The accessible name depends entirely on
   `aria-label`, which is `label`. A vague `label` leaves the control
   unusable to screen-reader users. Because there is no visible text
   label, the control also fails WCAG 2.5.3 Label in Name unless the
   consumer adds a visible label of their own.
2. **A custom listbox is weaker than a native `<select>`.** The native
   control got combobox semantics, platform keyboard behaviour, mobile
   OS pickers, and typeahead for free, all battle-tested in every
   assistive technology. A hand-rolled `role="listbox"` +
   `aria-activedescendant` widget is well-specified by the APG but has
   weaker and more variable support across screen readers and mobile
   browsers, and it does not get the native mobile picker UI. A native
   `<select>` remains the better choice for some audiences.
3. **Glyph rendering is font-dependent.** The glyph is a plain Unicode
   character with no bundled font — Lily ships no fonts or icon
   assets. "A" is materially safer here than the pictograph
   alternatives: it is ASCII, it exists in every font ever shipped,
   and it inherits the page's own typeface, so it cannot render as
   tofu or as an unexpected colour emoji the way U+1F5DB or ◑ can.
   The residual risk is stylistic, not legibility.

Separately, the closed button shows only a glyph, so **the active size
is not visible anywhere** unless the consumer surfaces it. Pairing the
control with visible text or a polite live region updated on
`textsizechange` is the documented default pattern; see
[`../docs/accessibility.md`](../docs/accessibility.md).

## 7. Testing acceptance criteria

`text-size-chooser.test.ts` must assert every numbered item below, and
every test names the clause it covers (`§7.4 …`). Tests run under
vitest + jsdom. Several clauses carry more than one test; no clause is
without one.

The three pure-helper tests (`sizeName` title-casing one word, every
hyphen-separated word, and leaving an empty slug empty) exercise §5.1
and are not numbered here.

### Markup contract

1. The rendered root is a `<div class="text-size-chooser">` containing a
   `<button type="button" class="text-size-chooser-button">` with
   `aria-haspopup="listbox"`, `aria-expanded="false"`, and an
   `aria-controls` pointing at the rendered `<ul role="listbox">`. The
   button's default content is
   `<span class="text-size-chooser-icon" aria-hidden="true">` holding
   `"A"`, the value of the exported `LATIN_CAPITAL_LETTER_A`. No
   `<select>` and no `<option>` element is rendered.
2. `aria-label` carries the supplied `label` on **both** the button and
   the listbox.
3. One `<li class="text-size-chooser-option">` is rendered per entry in
   `sizes`, and the hidden `<input>` carries the supplied `name` and
   the resolved value.
4. The listbox starts `hidden` with `tabindex="-1"`; clicking the
   button unhides it and sets `aria-expanded="true"`. Exactly one
   option has `aria-selected="true"` and it is the active size.
   Clicking an option applies that size (`data-text-size`), closes the
   list, resets `aria-expanded` to `"false"`, and updates the hidden
   input's value.
5. Option text is `sizeLabels[slug]` when supplied, otherwise the
   title-cased slug (`"x-large"` → `"X Large"`). The word `"default"`
   never appears. `labelFor` delegates to the exported `sizeName`.

### Application

6. After mount with no consumer-supplied value / storage /
   `default-value`, the resolved initial value is `"medium"` when
   present in `sizes`, otherwise `sizes[0]`.
7. The resolved value is written to
   `document.documentElement`'s `data-text-size`.
8. Choosing a different option updates `data-text-size` and fires a
   `textsizechange` event carrying the new slug.
9. When `storage-key` is set, the active slug is written to
   `localStorage` and read back on a fresh element mount.
10. When `value` is set as an attribute, initial-value resolution skips
    storage and defaults and uses the supplied value.
11. A custom `target` element receives `data-text-size` instead of
    `document.documentElement`, which stays untouched.

### Element shape and property API

12. Extra DOM properties / attributes on the host survive re-rendering
    (`id`, `data-*` are untouched; the host stays the element). The
    consumer's `class` is appended to the root hook, giving
    `class="text-size-chooser my-sizer"`.
13. Setting `el.sizes` as an array property is equivalent to setting
    the `sizes` attribute as CSV, and `el.sizeLabels` accepts a native
    object. List and option ids are unique across instances on the
    same page.

### Keyboard contract (APG listbox)

14. On the button, `ArrowDown`, `Enter`, and `Space` all open the list;
    opening moves focus to the `<ul>` and sets `aria-activedescendant`
    (plus `data-active`) to the selected option. `ArrowUp` opens with
    the last option active.
15. In the list, `ArrowDown` / `ArrowUp` move the active descendant and
    clamp at both ends without wrapping; `Home` and `End` jump to the
    first and last option.
16. `Enter` selects the active option, applies it, closes the list,
    removes `aria-activedescendant`, and returns focus to the button.
    `Space` behaves identically.
17. `Escape` closes the list and returns focus to the button without
    changing the size. `Tab` closes the list without stealing focus
    back to the button.
18. A printable character runs typeahead over the option labels and
    moves the active descendant. A click outside the rendered root
    closes the list.

### Custom rendering

19. A subclass overriding `renderButtonContent()` replaces the default
    glyph — no `.text-size-chooser-icon` is rendered — while the
    button/listbox structure and aria wiring (`aria-haspopup`,
    `aria-label`, a resolvable `aria-controls`) are untouched.
    `this.value`, `this.open`, and `this.labelFor()` are readable from
    inside the hook; the hook re-runs on every structural rebuild
    **and** on every state sync (a `value` change, each open and
    close) so derived content never goes stale; and the subclass still
    fires `textsizechange` through the base lifecycle.

## 8. Out-of-scope (future, not implemented here)

- A `<text-size-view>` companion element.
- Per-step CSS-variable emission (`--text-scale`).
- Built-in size presets.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-text-size-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
