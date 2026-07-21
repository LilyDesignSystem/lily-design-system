# TextSizeChooser — Specification (React helper)

Port of the canonical Svelte contract
([`../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-chooser/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-chooser/spec/index.md)).
The §7 numbering matches the Svelte spec so cross-framework tests line up,
and it matches the sibling `theme-chooser` / `locale-chooser` specs so all
three helpers can be read side by side.

## 1. Purpose

A headless control that lets a user pick a text size and have the app
remember it. The component owns DOM application + persistence; the
consumer owns the actual typography via CSS keyed on
`[data-text-size="{slug}"]`.

## 2. Scope

In scope: rendering an icon button that opens a listbox of the available
sizes, owning the whole keyboard contract, resolving the initial value,
writing `data-text-size` to a target, persistence, change events.

Out of scope: the CSS that maps a slug to a `font-size`/scale, picking
default sizes, or any visual styling — including positioning the
listbox. There is no themesUrl/extension, no managed `<link>`, and no
locale/lang/dir logic — this helper sets one data attribute only.

There is deliberately **no detection prop**. Unlike `theme-chooser`
(`prefers-color-scheme`) and `locale-chooser` (`navigator.languages`),
the platform exposes no "preferred text size" signal a component could
read, so first-visit resolution falls straight through to
`defaultValue` / `"medium"`.

## 3. Architectural decisions

- **Button + listbox, not a native `<select>`.** The control is an icon
  button (`aria-haspopup="listbox"`) that toggles a `<ul role="listbox">`,
  following the WAI-ARIA APG listbox pattern. The component therefore
  owns the keyboard contract itself (§6.2) rather than inheriting it
  from the platform. This is the same shape `theme-chooser` and
  `locale-chooser` use, so a row of Lily preference controls in one
  banner is visually and semantically uniform. A hidden
  `<input type="hidden" name="{name}">` carries the active slug so the
  control still participates in ordinary form submission.
- **The glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A).** A plain
  letter, not a pictograph, deliberately. U+1F5DB DECREASE FONT SIZE
  SYMBOL has no real glyph in common font stacks — it falls back to a
  crude bitmap shape — and it means *decrease* rather than *size*. "A"
  renders in the page's own font everywhere, stays monochrome like
  theme-chooser's ◑, and is the conventional text-size affordance.
- **Ids come from `useId`.** The listbox id and every option id derive
  from React's `useId`, so they are stable across server and client
  render and survive hydration. No `Math.random`, no `Date.now`.
- **SSR-safe.** All DOM mutations happen inside `useEffect`, which only
  runs on the client.
- **No dependencies beyond `react`.**
- **Controlled or uncontrolled `value`.**

## 4. Public API

### 4.1 Props

| Prop           | Type                                   | Required | Default                    | Purpose |
| -------------- | -------------------------------------- | -------- | -------------------------- | ------- |
| `label`        | `string`                               | yes      | —                          | Accessible name for the button and the listbox. |
| `sizes`        | `string[]`                             | yes      | —                          | Available size slugs (e.g. `["small","medium","large","x-large"]`). |
| `value`        | `string`                               | no       | `undefined` (uncontrolled) | Currently selected size slug. When supplied, the component is controlled. |
| `defaultValue` | `string`                               | no       | `"medium"` if present in `sizes`, else first item | Initial size when nothing else is supplied. |
| `storageKey`   | `string`                               | no       | `undefined`                | If set, persist the selection to `localStorage` under this key. |
| `name`         | `string`                               | no       | `"text-size"`              | `name` of the hidden input that carries the value in a form. |
| `target`       | `HTMLElement \| null`                  | no       | `document.documentElement` | Element that receives `data-text-size`. |
| `sizeLabels`   | `Record<string, string>`               | no       | `{}`                       | Optional pretty labels per slug. |
| `children`     | `(args: ChildArgs) => React.ReactNode` | no       | the `"A"` glyph            | Replaces the glyph **inside the button**. It does not render the options — the component owns those. |
| `onChange`     | `(size: string) => void`               | no       | `undefined`                | Fires after the control applies a new size. |
| `className`    | `string`                               | no       | `""`                       | Extra CSS class on the root `<div>`. |
| `...restProps` | any HTML `<div>` attributes            | no       | —                          | Spread onto the root `<div>`. |

### 4.2 ChildArgs

```ts
type ChildArgs = {
  /** Currently selected size slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (size: string) => string;
};
```

The render output replaces the default
`<span class="text-size-chooser-icon" aria-hidden="true">A</span>`. It
sits inside the button, whose accessible name always comes from `label`
via `aria-label` — so custom glyph content should be `aria-hidden` and
must never be relied on for naming.

### 4.3 DOM contract

```html
<div class="text-size-chooser {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="text-size-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="text-size-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Medium</li>
  </ul>
</div>
```

- **Root element:** `<div className="text-size-chooser {className}">`.
  Rest props spread onto this `<div>`.
- **Hidden input** carries the active slug so the control participates
  in ordinary form submission.
- **Button.** `type="button"`, class hook `text-size-chooser-button`,
  `aria-label="{label}"`, `aria-haspopup="listbox"`, `aria-expanded`
  tracking open state, `aria-controls` pointing at the listbox id.
- **Glyph.** `<span class="text-size-chooser-icon" aria-hidden="true">A</span>`
  — U+0041, exported as `LATIN_CAPITAL_LETTER_A`. It is `aria-hidden`,
  so the button's accessible name comes solely from `label`. Supplying
  `children` replaces the glyph.
- **Listbox.** `<ul class="text-size-chooser-list" role="listbox"
  aria-label="{label}" tabindex="-1">`, `hidden` while closed. While
  open it carries `aria-activedescendant` set to the active option's id.
- **Options.** One `<li class="text-size-chooser-option" role="option">`
  per size slug, each with a `useId`-derived `id`, `aria-selected` set to
  whether it is the active size, and `data-active` present on the
  keyboard-active option only.
- `labelFor(slug)` returns `sizeLabels[slug]` when supplied; otherwise
  `sizeName(slug)`. The component never emits the word "default".
- `data-text-size="{slug}"` is set on the `target` element on every apply.
- The package ships no CSS, so the listbox has no positioning: consumers
  supply the `position: relative` / `position: absolute` pair.

### 4.4 Exports

`index.ts` exports:

- `TextSizeChooser` (the component, both default and named export)
- `sizeName` (the pure helper; the single implementation of the
  title-casing label rule, mirroring `themeName` in theme-chooser and
  `localeName` in locale-chooser)
- `LATIN_CAPITAL_LETTER_A` (the default glyph constant)
- `type Props`, `type ChildArgs`

## 5. Behaviour

### 5.1 Initial value resolution

On first effect run in the browser, the initial size is the first
non-empty value of:

1. `value` (controlled mode)
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw)
3. `defaultValue`
4. `"medium"` (if `"medium"` is in `sizes`)
5. `sizes[0]`
6. `""` (no apply happens — the control waits for user interaction)

No system-preference step exists; see §2.

### 5.2 Applying a size

Applying a size `slug` performs, in order:

1. Set `data-text-size="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use `document.documentElement`.
2. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
3. Call `onChange(slug)` if supplied.

### 5.3 Open / close lifecycle

- Opening sets the active option to the currently-selected size, or to
  index 0 when nothing matches — except `ArrowUp` on the button, which
  opens with the **last** option active.
- Opening moves focus to the `<ul role="listbox">` (it is `tabindex="-1"`);
  the active option is tracked with `aria-activedescendant`, not with
  roving DOM focus.
- Closing via a selection or `Escape` returns focus to the button.
  Closing via `Tab`, an outside click, or focus leaving the root does
  **not** move focus back.
- Selecting applies the size through §5.2. `Escape`, an outside click,
  and focus loss all close without changing the value.
- The active option is kept in view with `scrollIntoView({ block:
  "nearest" })` as it moves.

### 5.4 Labels

`labelFor(slug)` returns `sizeLabels[slug]` if present, else
`sizeName(slug)` — the slug title-cased per hyphen-word (`x-large` →
`X Large`). The word "default" is never emitted.

### 5.5 Reactivity and SSR

A single `useEffect` re-applies the size whenever the resolved value
changes. During server rendering no effects run and no DOM is touched;
the markup renders with the value supplied by the consumer (if any).
Controlled when `value !== undefined`; otherwise uncontrolled with
internal `useState`.

## 6. Accessibility

### 6.1 Roles and properties

| Element                | Role / property                                                   |
| ---------------------- | ----------------------------------------------------------------- |
| `<button>`             | `aria-label={label}`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` |
| glyph `<span>`         | `aria-hidden="true"` — never part of the accessible name.          |
| `<ul>`                 | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` while closed, `aria-activedescendant` while open |
| `<li>`                 | `role="option"`, `aria-selected`, `data-active` on the keyboard-active option |

WCAG 2.2 AAA target. This helper is the one that most directly serves
**1.4.4 (Resize Text)** and **1.4.12 (Text Spacing)**: it exists so a
user can pick a comfortable reading size the app then remembers.

The glyph carries no accessible name, so `label` is load-bearing: it is
the only name the control has. See [`../docs/accessibility.md`](../docs/accessibility.md)
for the tradeoffs this pattern accepts.

### 6.2 Keyboard contract

The component implements this itself; nothing is inherited from a native
`<select>`.

On the **button**:

| Key                             | Action                                                  |
| ------------------------------- | ------------------------------------------------------- |
| `Tab` / `Shift+Tab`             | Move focus to / from the button (one tab stop).         |
| `ArrowDown` / `Enter` / `Space` | Open, with the currently-selected option active (else index 0). Focus moves to the listbox. |
| `ArrowUp`                       | Open with the **last** option active. Focus moves to the listbox. |

On the **listbox**:

| Key                     | Action                                                         |
| ----------------------- | -------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends — it does not wrap.  |
| `Home` / `End`          | Jump to the first / last option.                                |
| `Enter` / `Space`       | Select the active option, apply it, close, and return focus to the button. |
| `Escape`                | Close and return focus to the button **without** changing the value. |
| `Tab`                   | Close without stealing focus back, letting focus move on.       |
| Printable character     | Typeahead over the option **labels**; the buffer accumulates and resets after 500 ms of inactivity. |

Pointer behaviour: clicking an option selects it; clicking the button
again closes the listbox; clicking outside the root closes it; focus
leaving the root closes it. None of the close-only paths change the
value.

### 6.3 Internationalisation

- `label` and entries of `sizeLabels` are passed through verbatim.
- No user-facing strings are hardcoded, including the word "default".
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`TextSizeChooser.test.tsx` must assert every numbered item below. Tests
run under vitest + jsdom + `@testing-library/react`.

1. Markup shape:
   1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
      `aria-expanded="false"`, and an `aria-controls` that resolves to an
      element with `role="listbox"`.
   2. The button holds `<span class="text-size-chooser-icon"
      aria-hidden="true">A</span>` (U+0041), equal to the exported
      `LATIN_CAPITAL_LETTER_A`.
   3. The root is a `<div>` whose class is `text-size-chooser` plus the
      consumer's `className`.
2. `aria-label` is the supplied `label` on **both** the button and the
   listbox.
3. Renders exactly one `.text-size-chooser-option` per entry in `sizes`,
   and the hidden input carries the supplied `name` (default
   `"text-size"`) and the resolved slug as its `value`.
4. Open state:
   1. The listbox is `hidden` until the button is activated; activating
      it removes `hidden` and flips `aria-expanded` to `"true"`.
   2. Exactly one option has `aria-selected="true"` — the active size.
5. The rendering shows `sizeLabels[slug]` when supplied, or the slug
   with each hyphen-separated word title-cased otherwise (e.g.
   `"x-large"` → `"X Large"`). The word `"default"` never appears.
6. After mount with no consumer-supplied value/storage, the resolved
   initial value is `"medium"` when present in `sizes`, otherwise
   `sizes[0]`; `defaultValue` wins over that fallback.
7. The resolved size is written as `data-text-size` on
   `document.documentElement`, or on `target` when supplied — in which
   case the document root is left untouched.
8. Choosing a different option updates `data-text-size` and fires
   `onChange` with the new slug.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a prop, the initial-value resolution
    skips storage and defaults and uses the supplied value.
11. *(reserved — no URL construction in this helper; the clause number
    is kept so the numbering aligns with theme-chooser.)*
12. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
13. A custom `children` render prop:
    1. Replaces the default glyph inside the button (the
       `.text-size-chooser-icon` span is absent) and receives `ChildArgs`
       — `value`, `open`, `labelFor`.
    2. Sees `open === true` once the listbox is expanded.
14. Opening from the button:
    1. `ArrowDown`, `Enter`, and `Space` each open the listbox.
    2. `ArrowUp` opens with the last option active.
    3. Opening moves focus to the listbox element.
15. Moving within the listbox:
    1. `ArrowDown` / `ArrowUp` move `aria-activedescendant` and clamp at
       the top rather than wrapping.
    2. `ArrowDown` clamps at the last option.
    3. Exactly one option carries `data-active`, and it is the active one.
    4. `Home` / `End` jump to the first / last option.
16. Committing and dismissing:
    1. `Enter` selects the active option, applies it, and closes
       (`hidden` returns, `aria-expanded` returns to `"false"`).
    2. `Enter` returns focus to the button.
    3. `Space` selects the active option and closes.
    4. `Escape` closes and refocuses the button without changing
       `data-text-size`.
    5. `Tab` closes the listbox without stealing focus back to the button.
17. Typeahead:
    1. A printable character moves `aria-activedescendant` to the first
       option whose label starts with it.
    2. Characters accumulate within the buffer window, so a longer prefix
       keeps matching the same option.
    3. The buffer resets after the 500 ms idle window, so the next
       character starts a fresh search.
18. Pointer interaction:
    1. Clicking an option selects and applies it, and closes the listbox.
    2. Clicking outside closes the listbox without changing the size.
    3. Clicking the button again closes the listbox.

The pure helper `sizeName` is additionally covered by a direct unit test,
plus a test that the component's default option text equals it.

## 8. Out-of-scope (future, not implemented here)

- A system text-size detection prop. No platform signal exists — see §2.
- A complementary `TextSizeView` helper that displays the active size.
- Shipping the typography scale. The slug → `font-size` mapping is
  consumer CSS, by design.

## 9. Tracking

- Package directory: `lily-design-system-react-helpers/lily-design-system-react-text-size-chooser/`
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
