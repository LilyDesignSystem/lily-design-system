# `<text-size-select>` — Specification

Single source of truth for the
`lily-design-system-html-text-size-select` HTML helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

Sibling files in this directory:

- `text-size-select.ts` — the custom-element implementation
- `text-size-select.test.ts` — vitest + jsdom spec exercising §4–§7
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The Svelte canonical
(`lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/`)
shares the same numbered acceptance criteria; this spec mirrors it
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless text-size select that:

1. Renders an accessible native `<select>` of available size slugs.
2. **Applies the chosen size** by setting `data-text-size="{slug}"` on
   the document root (or on a consumer-supplied target).
3. Optionally persists the chosen slug to `localStorage`.
4. Ships zero CSS — the consumer maps each slug to real typography via
   CSS keyed on `[data-text-size="{slug}"]`.

This directly supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12
(Text Spacing) — by letting users pick a comfortable reading size that
the app remembers.

## 2. Non-goals

- **Typography**. The helper applies no `font-size`/scale; the CSS that
  maps a slug to typography is the consumer's.
- **Picking default sizes**. The consumer supplies the slug list.
- **Per-element scaling**. The helper writes one `data-text-size` to a
  single target; cascading typography is the consumer's CSS concern.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<text-size-select>`. The class is exported as `TextSizeSelect` from
  `text-size-select.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("text-size-select", TextSizeSelect)` on first
  module evaluation, guarded by a `customElements.get(...)` check.
- **Light DOM.** The element renders its `<select>` and `<option>`s as
  children, not in a shadow root.
- **The `data-text-size` attribute is the applied output.**
- **No managed `<link>`, no `lang`/`dir`.** Unlike the theme / locale
  siblings, this helper only writes a single `data-*` attribute.
- **No dependencies.**

## 4. Public API

### 4.1 Observed attributes

| Attribute        | Type            | Required | Default                       | Purpose |
| ---------------- | --------------- | -------- | ----------------------------- | ------- |
| `label`          | `string`        | yes      | —                             | Accessible name for the `<select>`. |
| `sizes`          | `string` (CSV)  | yes      | —                             | Available size slugs, comma-separated. The JS property `el.sizes` accepts `string[]`. |
| `value`          | `string`        | no       | `""`                          | Currently selected slug. |
| `default-value`  | `string`        | no       | `"medium"` if present, else first | Initial slug when nothing else is supplied. |
| `storage-key`    | `string`        | no       | `undefined`                   | If set, persist the selection to `localStorage` under this key. |
| `name`           | `string`        | no       | `"text-size"`                 | `name` attribute on the `<select>`. |
| `size-labels`    | `string` (JSON) | no       | `"{}"`                        | Pretty labels per slug, JSON-encoded object. |
| `class`          | `string`        | no       | `""`                          | Extra CSS class on the rendered `<select>`. |

### 4.2 JS properties

Mirror every attribute, plus:

- `el.target` (`HTMLElement | null`, default
  `document.documentElement`; not exposed as an attribute).

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` lists the kebab-case attributes in §4.1.
- `connectedCallback()` resolves the initial value (per §5.2), renders
  the children, and applies the size.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field, re-renders (if it's a markup-affecting
  attribute), and re-applies (if it's `value`).
- `disconnectedCallback()` does not unset `data-text-size`.

### 4.4 Events

The element fires a `textsizechange` `CustomEvent` after every applied
change. `event.detail` is `{ size: string }`. The event bubbles and is
composed.

### 4.5 DOM contract

```html
<text-size-select label="Text size" sizes="small,medium,large,x-large">
  <select class="text-size-select" aria-label="Text size" name="text-size">
    <option class="text-size-select-option" value="small">Small</option>
    <option class="text-size-select-option" value="medium" selected>Medium</option>
    <option class="text-size-select-option" value="large">Large</option>
    <option class="text-size-select-option" value="x-large">X Large</option>
  </select>
</text-size-select>
```

`data-text-size` is set on the resolved target on every apply.

### 4.6 Re-exports

`index.ts` exports:

- `TextSizeSelect` (the class)
- `type TextSizeSelectProps`, `type TextSizeSelectChangeDetail`

## 5. Behaviour

### 5.1 Label resolution

`labelFor(slug)` returns `sizeLabels[slug]` if present, otherwise the
slug title-cased per hyphen-word (`x-large` → `X Large`).

### 5.2 Initial value resolution

On first `connectedCallback` in the browser, the initial slug is the
first non-empty value of:

1. The `value` attribute (if non-empty).
2. `localStorage.getItem(storageKey)` (only if `storage-key` is set and
   the read does not throw).
3. The `default-value` attribute.
4. `"medium"` if present in `sizes`, else `sizes[0]`.
5. `""` (no apply happens — the select waits for user interaction).

### 5.3 Applying a size

Applying a slug performs, in order:

1. Resolve the target element (default `document.documentElement`).
2. Set `target.setAttribute("data-text-size", slug)`.
3. If `storage-key` is set, write `slug` to `localStorage` inside a
   try/catch.
4. Dispatch `textsizechange` `CustomEvent` with `detail: { size: slug }`.

### 5.4 Reactivity

Setting `el.value` or selecting a different `<option>` in the
`<select>` triggers a re-apply. Other attribute / property changes
re-render the children when relevant and take effect on the next apply.

### 5.5 SSR / no-JS

The element only registers in browsers with `customElements`. Without
JS, the element renders nothing.

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` (implicit `role="combobox"`) is the announced control.
- `aria-label={label}` supplies the accessible name.
- Native `<option>` elements get the implicit `role="option"`.

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key                  | Action                                           |
| -------------------- | ------------------------------------------------ |
| `Tab` / `Shift+Tab`  | Move focus into / out of the control.            |
| `Arrow Down` / `Up`  | Move selection to the next / previous option.    |
| `Home` / `End`       | Move selection to the first / last option.       |
| typeahead            | Jump to the option matching typed characters.    |
| `Enter` / `Space`    | Open the option list (where the platform pops one). |
| `Escape`             | Close the open option list.                      |

### 6.3 Internationalisation

- `label`, `sizeLabels`, and the consumer-supplied `sizes` list are all
  passed through verbatim.
- No user-facing strings are hardcoded.

## 7. Testing acceptance criteria

`text-size-select.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Numbering mirrors the Svelte sibling's §7.

### 7.1 Markup contract (§4.5)

1. §7.1 Renders a `<select>` (implicit `role="combobox"`).
2. §7.2 `aria-label` is the supplied `label`.
3. §7.3 Renders one `<option>` per entry in `sizes`; the `<select>`
   carries the supplied `name` attribute.
4. §7.4 Each `<option>`'s `value` attribute is the slug.
5. §7.5 Default labels title-case the slug; `sizeLabels` overrides.

### 7.2 Application (§5.2, §5.3)

6. §7.6 Initial value defaults to `"medium"` if present, else `sizes[0]`.
7. §7.7 Applies `data-text-size` to `document.documentElement`.
8. §7.8 Selecting an option updates `data-text-size` and fires
   `textsizechange`.
9. §7.9 Persists to `localStorage` and re-reads on a fresh mount.
10. §7.10 An explicit `value` wins over storage and defaults.
11. §7.11 A custom `target` element receives `data-text-size` instead of
    `document.documentElement`.

### 7.3 Property API

12. §7.12 Setting `el.sizes` as an array mirrors the CSV attribute and
    re-renders.
13. §7.13 Setting `el.sizeLabels` as an object mirrors the JSON attribute
    and re-renders.

## 8. Out-of-scope (future, not implemented here)

- A `<text-size-view>` companion element.
- Per-step CSS-variable emission (`--text-scale`).
- Built-in size presets.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
