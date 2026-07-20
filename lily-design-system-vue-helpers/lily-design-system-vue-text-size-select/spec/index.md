# TextSizeSelect — Specification (Vue 3 helper)

Single source of truth for the `lily-design-system-vue-text-size-select`
Vue 3 helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

The canonical reference for this helper is the Svelte sibling at
`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/`.
This Vue port mirrors the contract and behaviour one-to-one, swapping
in Vue 3 idioms (Composition API, `defineProps`, `withDefaults`,
`defineEmits`, `ref`, `watch`, `onMounted`, scoped slot). When the
Vue port and the Svelte canonical disagree, the Svelte side wins.

Sibling files in this directory:

- `TextSizeSelect.vue` — the implementation
- `TextSizeSelect.test.ts` — vitest spec exercising every §7 clause
- `index.ts` — re-export barrel
- `index.md` — user-facing readme
- `docs/accessibility.md` — the accessibility rationale and tradeoffs

> **Breaking change (unreleased).** The control is no longer a native
> `<select>`. It is now an icon button (`A`, U+0041 LATIN CAPITAL
> LETTER A) that opens a WAI-ARIA APG listbox, matching `theme-select`
> and `locale-select` — all three helpers are now the same shape. The
> default slot now replaces the **button glyph** rather than the
> options, and its scoped props change from
> `{ sizes, value, setSize, name, labelFor }` to
> `{ value, open, labelFor }`. Everything downstream
> (`data-text-size` application, `localStorage` persistence, the
> `change` event, initial-value resolution, SSR safety) is unchanged.

---

## 1. Purpose

A headless control that lets a user pick a text size and have the app
remember it. The component owns DOM application + persistence; the
consumer owns the actual typography via CSS keyed on
`[data-text-size="{slug}"]`.

## 2. Scope

In scope: rendering the icon button + listbox, the APG listbox
keyboard contract, resolving the initial value, writing
`data-text-size` to a target, persistence, change events.

Out of scope: the CSS that maps a slug to a `font-size` / scale,
picking default sizes, any visual styling, and **OS-preference
detection** — there is no media query equivalent to
`prefers-color-scheme` or `navigator.languages` for text size, so this
helper deliberately ships no `detectFrom*` prop.

## 3. Architectural decisions

- **Icon button + listbox, not a native `<select>`.** Harmonised with
  `theme-select` and `locale-select` so a consumer wires all three
  identically. The cost of leaving the native control is documented
  in [`docs/accessibility.md`](../docs/accessibility.md).
- **`data-text-size` on the target is the activation switch.** The
  consumer's CSS keys typography off it; the component never sets a
  `font-size`.
- **A hidden input preserves form participation.** With the `<select>`
  gone, `name` moves onto `<input type="hidden">`.
- **Stable, SSR-safe ids.** Option ids come from an incrementing
  module counter (`nextTextSizeSelectId()`) — never `Math.random()` or
  `Date.now()`.
- **SSR-safe.** All DOM mutations happen inside `onMounted` / `watch`,
  which only run in the browser.
- **No dependencies beyond `vue`.**

## 4. Public API

### 4.1 Props

| Prop           | Type                       | Required | Default                    | Purpose |
| -------------- | -------------------------- | -------- | -------------------------- | ------- |
| `label`        | `string`                   | yes      | —                          | Accessible name for **both** the button and the listbox. The button is icon-only, so this is its only name. |
| `sizes`        | `string[]`                 | yes      | —                          | Available size slugs, e.g. `["small","medium","large","x-large"]`. |
| `value`        | `string` (`v-model:value`) | no       | `""`                       | Currently selected size slug. |
| `defaultValue` | `string`                   | no       | `"medium"` if present in `sizes`, else `sizes[0]` | Initial size. |
| `storageKey`   | `string`                   | no       | `undefined`                | If set, persist the selection to `localStorage` under this key. |
| `name`         | `string`                   | no       | `"text-size"`              | `name` of the hidden input that carries the value in a form. |
| `target`       | `HTMLElement \| null`      | no       | `document.documentElement` | Element that receives `data-text-size`. |
| `sizeLabels`   | `Record<string, string>`   | no       | `{}`                       | Optional pretty labels per slug. |
| `class`        | `string`                   | no       | `""`                       | Extra CSS class on the root `<div>`. |

There is no `placeholder` prop — it was removed with the `<select>` —
and no detection prop, per §2.

### 4.2 Events

| Event          | Payload  | Purpose                                        |
| -------------- | -------- | ---------------------------------------------- |
| `update:value` | `string` | Emitted on selection (drives `v-model:value`). |
| `change`       | `string` | Emitted after the select applies a new size.   |

### 4.3 Slots

Default slot — when provided, replaces the **button glyph**. It does
not render the options: the listbox, its `<li role="option">`
children, the keyboard contract, and the apply lifecycle are all
component-owned. The slot receives:

```ts
type SlotArgs = {
  /** Currently selected size slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (size: string) => string;
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the
canonical Svelte helper's type name.

Whatever the slot renders is decorative: the button's accessible name
always comes from `label` via `aria-label`. Slot content should be
`aria-hidden="true"` or text-free so it does not compete with that
name.

### 4.4 DOM contract

```html
<div class="text-size-select {class}" ...$attrs>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="text-size-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="text-size-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{labelFor(slug)}</li>
  </ul>
</div>
```

- Root element: a `<div class="text-size-select {class}">`. `$attrs`
  falls through to it via the default Vue `inheritAttrs` behaviour.
- The button is icon-only. The glyph is `A` (U+0041 LATIN CAPITAL
  LETTER A), exported as `LATIN_CAPITAL_LETTER_A`, wrapped in
  `aria-hidden="true"` so it can never become the accessible name.
  A plain letter is deliberate: U+1F5DB DECREASE FONT SIZE SYMBOL has
  no real glyph in common font stacks and means *decrease* rather than
  *size*.
- The hidden input preserves form participation and carries `name`.
- `aria-expanded` tracks the open state; `aria-controls` points at the
  listbox id.
- The listbox carries `hidden` while closed, `tabindex="-1"` so it can
  receive focus on open, and `aria-activedescendant` **only while
  open** — it is removed on close.
- One `<li class="text-size-select-option" role="option">` per slug,
  with a stable per-instance `id`, `aria-selected` reflecting the
  committed slug, and `data-active` on the keyboard-active option.
- The selection lives in `value` / `v-model:value`, in the hidden
  input, and in `data-text-size` on the target.

### 4.5 Re-exports

`index.ts` exports:

- `default` (the component)
- `TextSizeSelect` (named alias of the default export)
- `sizeName` (pure label resolver)
- `nextTextSizeSelectId` (per-instance id generator)
- `LATIN_CAPITAL_LETTER_A` (the default button glyph)
- `type Props`, `type SlotArgs`, `type ChildArgs`

## 5. Behaviour

### 5.1 Initial value resolution

On `onMounted` in the browser, the initial size is the first non-empty
value of:

1. `value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set).
3. `defaultValue`.
4. `"medium"` (if `"medium"` is in `sizes`).
5. `sizes[0]`.
6. `""` (no apply happens — the select waits for user interaction).

There is no detection step, so the chain is the `theme-select` chain
minus its step 3:

```
value > storage > defaultValue > "medium" > first
```

Resolution emits `update:value` so consumers binding via
`v-model:value` see the resolved value.

### 5.2 Applying a size

Applying a size `slug` performs, in order:

1. Set `data-text-size="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use `document.documentElement`.
2. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
3. Emit `change` with the slug.

### 5.3 Reactivity

An internal `current` ref is the source of truth so the select works
both controlled (consumer drives `v-model:value`) and uncontrolled
(no binding — the select resolves and applies a default itself). A
`watch(() => props.value, …)` mirrors external changes into `current`;
a `watch(current, …)` applies.

### 5.4 Labels

`labelFor(slug)` returns `sizeLabels[slug]` if present, else
`sizeName(slug)` — the slug title-cased per hyphen-word (`x-large` →
`X Large`). `sizeName` is exported so there is exactly one
implementation of the rule, mirroring `themeName` in theme-select and
`localeName` in locale-select. The word "default" is never emitted.

### 5.5 SSR

During server rendering, no `onMounted` or `watch` callback fires and
no DOM is touched. The markup renders with the value supplied by the
consumer.

## 6. Accessibility

WCAG 2.2 AAA target; directly supports **1.4.4 (Resize Text)** — this
helper's specific concern — by letting users pick and persist a
comfortable reading size.

### 6.1 Roles and properties

- A `<button aria-haspopup="listbox" aria-expanded aria-controls>` is
  the trigger. Because it is icon-only, `aria-label={label}` is its
  **only** accessible name — the glyph is `aria-hidden="true"`.
- A `<ul role="listbox" aria-label={label}>` holds one
  `<li role="option" aria-selected>` per slug.
- The active option is conveyed with `aria-activedescendant` on the
  listbox (focus stays on the `<ul>`), per the APG listbox pattern.
- `data-active` mirrors the keyboard-active option for consumer CSS;
  `aria-selected` mirrors the committed selection for assistive
  technology.

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG listbox
pattern. Focus moves to the `<ul>` on open and returns to the button
on commit or cancel.

On the **button**:

| Key                 | Action                                               |
| ------------------- | ---------------------------------------------------- |
| `ArrowDown`         | Open, active option = the selected one (or index 0). |
| `Enter` / `Space`   | Open, active option = the selected one (or index 0). |
| `ArrowUp`           | Open, active option = the **last** option.           |
| `Tab` / `Shift+Tab` | Move focus away (native).                            |

On the **listbox**:

| Key                  | Action                                                         |
| -------------------- | -------------------------------------------------------------- |
| `ArrowDown`          | Move the active option down one. **Clamps** — no wrapping.     |
| `ArrowUp`            | Move the active option up one. **Clamps** — no wrapping.       |
| `Home` / `End`       | Jump to the first / last option.                               |
| `Enter` / `Space`    | Select the active option, apply it, close, refocus the button. |
| `Escape`             | Close and refocus the button **without** changing the value.   |
| `Tab`                | Close without stealing focus back.                             |
| Printable characters | Typeahead over the option **labels**, 500 ms buffer reset.     |

Pointer and focus behaviour: clicking an option selects it; clicking
the button again closes the listbox; clicking outside the root closes
it; focus leaving the root closes it.

### 6.3 Internationalisation

- `label` and entries of `sizeLabels` are passed through verbatim.
- No user-facing strings are hardcoded, including the word "default".
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`TextSizeSelect.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@vue/test-utils`.

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` pointing at an
   element with `role="listbox"`. The root is a `<div>` carrying the
   `text-size-select` class hook plus the consumer's `class`. The
   button renders `A` (U+0041) inside
   `<span class="text-size-select-icon" aria-hidden="true">`.
2. `aria-label` is the supplied `label` on **both** the button and the
   listbox.
3. Renders one `<li class="text-size-select-option">` per entry in
   `sizes`, and a hidden input carrying the supplied `name` (default
   `"text-size"`) and the resolved value.
4. The listbox carries `hidden` until the button is activated; then
   `hidden` is dropped and `aria-expanded` becomes `"true"`. Exactly
   one option carries `aria-selected="true"` — the active size.
5. The default rendering shows `sizeLabels[slug]` when supplied, or
   the title-cased slug otherwise.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"medium"` when present in `sizes`,
   otherwise `sizes[0]`; `defaultValue` wins over that fallback.
7. Applies `data-text-size` to `document.documentElement`, or to
   `target` when supplied — and then not to `<html>`.
8. Clicking a different option updates `data-text-size`, emits
   `change` with the new slug, and round-trips `v-model:value`.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage and defaults and uses the supplied
    value. The hidden input mirrors the resolved value.
11. *(Reserved — the theme-select URL-construction clause has no
    text-size equivalent.)*
12. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
13. A custom default slot replaces the button glyph — the
    `.text-size-select-icon` span is absent — and receives the
    `SlotArgs` contract (`value`, `open`, `labelFor`). Its `open` flag
    tracks the listbox state, and its `labelFor` respects
    `sizeLabels`.
14. `ArrowDown`, `Enter` and `Space` on the button all open the
    listbox. Opening starts on the selected option. `ArrowUp` opens
    with the **last** option active. Opening moves focus to the `<ul>`.
15. On the listbox, `ArrowDown` / `ArrowUp` move
    `aria-activedescendant` and clamp at both ends rather than
    wrapping; `Home` / `End` jump to the first / last option; exactly
    one option carries `data-active`.
16. `Enter` and `Space` select the active option, apply it, close the
    listbox (`hidden` returns, `aria-expanded` becomes `"false"`), and
    return focus to the button. `Escape` closes and refocuses the
    button without changing the value. `Tab` closes without stealing
    focus back. `aria-activedescendant` is removed once closed.
17. Printable characters run a typeahead over the option labels,
    wrapping to find an earlier match; modified keys (Ctrl / Meta /
    Alt) do not trigger it. Clicking an option selects and applies it.
    Clicking the button again, or clicking outside the root, closes
    the listbox.
18. `sizeName(slug)` title-cases each hyphen-separated word, and
    `labelFor` delegates to it so there is exactly one implementation
    of the rule.

## 8. Out-of-scope (future, not implemented here)

- An OS text-size detection prop. There is no `prefers-text-size`
  media query; the platform exposes no equivalent signal. See §2.
- A complementary `TextSizeView` helper that displays the active size.
- Shipping the `[data-text-size="…"]` typography CSS. That is the
  consumer's, per §1.

## 9. Tracking

- Package directory:
  `lily-design-system-vue-helpers/lily-design-system-vue-text-size-select/`
- Spec version: 0.2.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
