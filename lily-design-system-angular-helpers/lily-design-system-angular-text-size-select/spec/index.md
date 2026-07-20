# TextSizeSelect — Specification

Single source of truth for the
`lily-design-system-angular-text-size-select` Angular helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

This is the Angular port of the canonical Svelte contract in
[`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md).
When the Angular port and the Svelte canonical disagree, the Svelte
side wins and the Angular side is patched.

Sibling files in this directory:

- `text-size-select.component.ts` — the implementation
- `text-size-select.component.spec.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

## 1. Goal

Give an Angular 20 application a drop-in, headless text-size select
that:

1. Renders an **icon button that opens a WAI-ARIA APG listbox** of
   available size slugs — the same shape as the sibling `theme-select`
   and `locale-select` helpers.
2. **Applies the chosen size** by setting `data-text-size="{slug}"`
   on the document root (or on a consumer-supplied target).
3. Optionally persists the chosen size to `localStorage` so the
   choice survives reload.
4. Ships zero CSS — the consumer maps each `[data-text-size="…"]`
   slug to real typography via CSS targeting the `text-size-select`
   class hook, and supplies the listbox positioning.

## 2. Non-goals

- **Typography**. This component does not set `font-size` or any
  scale; the consumer owns the CSS keyed on `[data-text-size]`.
- **Picking the default size set**. The consumer always supplies the
  `sizes` array.
- **OS preference detection.** There is no "preferred text size"
  media query equivalent to `prefers-color-scheme` or
  `navigator.languages`, so this helper has no `detectFromSystem`
  counterpart to theme-select's.
- **Custom default rendering**. The default is the icon-button +
  listbox pair for symmetry with the sibling helpers. Consumers who
  want a different widget bind it to the same `[(value)]` signal.

## 3. Architectural decisions

- **Standalone signal-based component.** Uses `input<T>()`,
  `input.required<T>()`, `output<T>()`, and `model<string>()`.
- **`OnPush` change detection.**
- **`data-text-size` is the wire format.** Slugs are written verbatim.
- **TypeScript strict** on the public surface.
- **SSR-safe.** DOM side-effects guard on `typeof document`.
- **No dependencies beyond `@angular/core` / `@angular/common`.**
- **Custom listbox, not a native `<select>`.** The component owns
  every role, state, focus move, and keystroke. This is a deliberate
  tradeoff — see §6 and
  [`../docs/accessibility.md`](../docs/accessibility.md).
- **Element ids come from a module counter** (`nextTextSizeSelectId`),
  so they are deterministic, unique per instance, and identical
  across server and client renders. No `Math.random` / `Date.now`.
- **No template casts are needed.** The component handles `(click)` /
  `(keydown)` with typed handler methods rather than reading
  `$event.target` inline. (The catalog's `$any($event.target).value`
  rule still applies to helpers that bind a native input's value.)

## 4. Public API

### 4.1 Inputs / outputs

| Input / output | Type                           | Required | Default                               | Purpose |
| -------------- | ------------------------------ | -------- | ------------------------------------- | ------- |
| `label`        | `input.required<string>()`     | yes      | —                                     | Accessible name for the button **and** the listbox. |
| `sizes`        | `input.required<string[]>()`   | yes      | —                                     | Available size slugs. |
| `value`        | `model<string>()`              | no       | `""`                                  | Currently selected size slug. Two-way bindable. |
| `defaultValue` | `input<string>()`              | no       | `""`                                  | Initial size when nothing else is supplied. |
| `storageKey`   | `input<string>()`              | no       | `""`                                  | If non-empty, persist the selection to `localStorage` under this key. |
| `name`         | `input<string>()`              | no       | `"text-size"`                         | `name` attribute of the hidden input that carries the value in a form. |
| `target`       | `input<HTMLElement \| null>()` | no       | `null` (→ `document.documentElement`) | Element that receives `data-text-size`. |
| `sizeLabels`   | `input<Record<string,string>>()` | no     | `{}`                                  | Optional pretty labels per size slug. |
| `className`    | `input<string>()`              | no       | `""`                                  | Extra CSS class on the root `<div>`. |
| `sizeChange`   | `output<string>()`             | no       | —                                     | Emits after the control applies a new size. |

### 4.2 DOM contract

```html
<div class="text-size-select {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="text-size-select-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden aria-activedescendant="{optionId, only while open}">
    <li class="text-size-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Medium</li>
  </ul>
</div>
```

- The default button glyph is `LATIN_CAPITAL_LETTER_A` — `"A"`,
  U+0041. A plain letter rather than a pictograph: U+1F5DB DECREASE
  FONT SIZE SYMBOL has no real glyph in common font stacks and means
  *decrease* rather than *size*, whereas "A" renders in the page's own
  font everywhere and stays monochrome like theme-select's `◑`.
- The hidden input preserves `name` and form participation.
- `aria-activedescendant` is emitted only while the listbox is open.
- `data-active` marks the keyboard cursor; `aria-selected` marks the
  size actually in effect. They are usually different options.
- A projected `<ng-template>` (queried via `contentChild(TemplateRef)`)
  replaces the **glyph** inside the button and receives `ChildArgs`
  (`{ $implicit, value, open, labelFor }`). It does **not** render
  options.
- `data-text-size="{slug}"` is set on the `target` element on every
  apply.

### 4.3 Re-exports

`index.ts` exports `TextSizeSelect` (the component class),
`TextSizeSelectIcon` (the optional marker directive
`ng-template[lilyTextSizeSelectIcon]`, for typed `let-` variables),
`LATIN_CAPITAL_LETTER_A` (the default glyph),
`nextTextSizeSelectId` (per-instance id generator), `sizeName` (the
pure label resolver), and the `ChildArgs` type.

## 5. Behaviour

### 5.1 Initial value resolution

On first effect run in the browser, the initial size is the first
non-empty value of:

1. `value()` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `defaultValue`.
4. `"medium"` if present in `sizes`, else `sizes[0]`.
5. `""` (no apply happens).

### 5.2 Default labels

`labelFor(slug)` returns `sizeLabels[slug]` if present, else delegates
to the exported `sizeName(slug)`, which title-cases the slug per
hyphen-word (`x-large` → `X Large`). `sizeName` mirrors `themeName`
in theme-select and `localeName` in locale-select, and is the single
implementation — `labelFor` does not duplicate it.

### 5.3 Applying a size

Applying a size `slug` performs, in order:

1. Resolve the target element. If `target()` is null/undefined, use
   `document.documentElement`.
2. Set `target` attribute `data-text-size = slug`.
3. If `storageKey` is set, write `slug` to `localStorage` inside a
   try/catch.
4. Emit `sizeChange.emit(slug)`.

### 5.4 Reactivity

A single `effect()` re-applies the size whenever `value()` changes.

### 5.5 SSR

`effect()` runs but the `document`-guard prevents DOM mutation.
Element ids come from a module counter, so server and client renders
agree and the `aria-controls` / `aria-activedescendant` wiring
survives hydration.

### 5.6 Open / close

- The button toggles the listbox. Opening activates the currently
  selected option (index 0 if the value is not in `sizes`) and moves
  focus to the `<ul>`; the active option is conveyed by
  `aria-activedescendant`, so focus never lands on an `<li>`.
- Closing restores focus to the button, except when the close was
  caused by `Tab`, a click outside the root, or focus leaving the
  root — those must not steal focus back.
- Clicking an option selects it, applies it, and closes.

## 6. Accessibility

### 6.1 Roles and properties

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) and
  1.4.12 (Text Spacing) by letting users pick a comfortable reading
  size that the app remembers. That is this helper's specific
  accessibility purpose, and it is why the control exists at all.
- There is **no native control underneath**. Every role, state, focus
  move, and keystroke below is code in this component. The full
  tradeoff discussion — the load-bearing `aria-label`, the weaker AT
  support of a hand-rolled listbox versus a native `<select>`, and
  the font-dependence of the glyph — is in
  [`../docs/accessibility.md`](../docs/accessibility.md).
- The button is icon-only, so `[attr.aria-label]="label"` is its
  **entire** accessible name. `label` is `input.required` because
  there is no safe default.
- The listbox carries the same `aria-label`, `tabindex="-1"`, and
  `aria-activedescendant` while open.
- No user-facing strings are hardcoded inside the component.

### 6.2 Keyboard contract

On the **button**: `Enter` / `Space` / `ArrowDown` open the listbox
with the selected option active (index 0 if none); `ArrowUp` opens
with the **last** option active. Opening moves focus to the `<ul>`.

On the **listbox**:

| Key               | Action                                                            |
| ----------------- | ----------------------------------------------------------------- |
| `Arrow Down`      | Active option down one. **Clamps** at the last option — no wrap.   |
| `Arrow Up`        | Active option up one. **Clamps** at the first option — no wrap.    |
| `Home` / `End`    | First / last option becomes active.                                |
| `Enter` / `Space` | Select the active option, apply it, close, refocus the button.     |
| `Escape`          | Close and refocus the button; the value is **not** changed.        |
| `Tab`             | Close without stealing focus back; the browser moves focus onward. |
| Printable chars   | Typeahead over the display **labels**; buffer resets after 500 ms. |

The typeahead matches the rendered label, not the slug — with
`sizeLabels` in play, typing `h` finds "Huge", not `x-large`.

## 7. Testing acceptance criteria

`text-size-select.component.spec.ts` must assert every numbered item
below. Tests run under vitest + jsdom + `@angular/core/testing`
`TestBed`.

### 7.1 Markup contract (mirrors §4.2)

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and `aria-controls` pointing at the
   `role="listbox"` element; the root is a `<div>` carrying the
   `text-size-select` class hook; the button renders `"A"` inside a
   `.text-size-select-icon` span marked `aria-hidden="true"`.
2. `aria-label` names the button **and** the listbox.
3. Renders one `<li role="option">` per entry in `sizes`; the hidden
   input carries the supplied `name` (default `"text-size"`); option
   ids are unique per instance and come from a monotonic counter.
4. The listbox is `hidden` until the button is activated, and the
   button toggles it closed again; while open exactly one option has
   `aria-selected="true"` and exactly one has `data-active`;
   `aria-activedescendant` is absent while closed.
5. The default rendering title-cases the slug; `sizeLabels`
   overrides it.

### 7.2 Initial value (mirrors §5.1)

6. The initial value defaults to `"medium"` when present, else
   `sizes[0]`.
7. After mount, `data-text-size` is set on
   `document.documentElement`.

### 7.3 Size application (mirrors §5.3)

8. Selecting an option updates `data-text-size`, emits `sizeChange`
   with the new slug, and updates the hidden input's value.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.

### 7.4 Initial-value resolution (mirrors §5.1)

10. A supplied non-empty `value` input wins over storage and
    defaults; `defaultValue` wins over the `"medium"` fallback.
11. A custom `target` element receives `data-text-size` instead of
    `document.documentElement`.

### 7.5 Class hook and custom glyph

12. The consumer's `className` is appended to the root `<div>` class
    list.
13. A projected `<ng-template>` replaces the glyph inside the button
    and receives `ChildArgs` (`value`, `open`, `labelFor`); the
    default `.text-size-select-icon` is then absent.

### 7.6 Keyboard contract (mirrors §6.2)

14. `ArrowDown`, `Enter`, and `Space` on the button all open the
    listbox with the selected option active; `ArrowUp` opens with the
    last option active; opening moves focus to the listbox.
15. `ArrowDown` / `ArrowUp` move the active descendant and **clamp**
    at both ends rather than wrapping; `Home` / `End` jump to the
    first / last option.
16. `Enter` and `Space` select the active option, apply it, close the
    listbox, and return focus to the button.
17. `Escape` closes without changing the size and returns focus to
    the button; `Tab` closes without stealing focus back.
18. Printable characters run a typeahead over the rendered labels;
    the buffer resets after 500 ms. Clicking an option selects and
    applies it; clicking outside the root closes the listbox.

### 7.7 Label resolver

19. `sizeName` title-cases each hyphen-separated word; `labelFor`
    delegates to it so there is one implementation; `sizeLabels`
    still override it.

## 8. Out-of-scope (future, not implemented here)

- A complementary `TextSizeView` helper.
- OS-preference detection (see §2 — no such media query exists).

## 9. Tracking

- Package directory: `lily-design-system-angular-helpers/lily-design-system-angular-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical contract: [`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md)
