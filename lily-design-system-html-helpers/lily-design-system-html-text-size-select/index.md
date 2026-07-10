# `<text-size-select>` (HTML helper)

A reusable, headless vanilla HTML/JS **text-size select**, packaged as
the `<text-size-select>` custom element. Renders a native `<select>` of
text-size slugs and, on every change, sets `data-text-size="{slug}"` on
a target element (default `document.documentElement`), optionally
persisting the choice to `localStorage`.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide.

## Why this exists

Letting users resize text — beyond browser zoom — is a WCAG 2.2
commitment (1.4.4 Resize Text, 1.4.12 Text Spacing). This helper owns
the *selection + persistence + DOM application* of a text-size
preference; the consumer owns the typography itself via CSS keyed on
`[data-text-size="{slug}"]`:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

The element is a direct port of the Svelte canonical
`lily-design-system-svelte-text-size-select`. APIs and behaviour match;
only the framework idioms differ.

## Install

```ts
// One side-effect import registers <text-size-select> globally:
import "./lily-design-system-html-text-size-select";

// Or grab the class + types:
import {
    TextSizeSelect,
    type TextSizeSelectProps,
    type TextSizeSelectChangeDetail,
} from "./lily-design-system-html-text-size-select";
```

The barrel guards registration with
`customElements.get("text-size-select")` so re-imports and SSR contexts
don't throw.

## Quick start

```html
<script type="module" src="/dist/text-size-select.js"></script>

<text-size-select
    label="Text size"
    sizes="small,medium,large,x-large"
    storage-key="lily-text-size"
></text-size-select>
```

When the user picks `large`, the element:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- dispatches `new CustomEvent("textsizechange", { detail: { size: "large" }, bubbles: true, composed: true })`.

The element does **not** style anything — your CSS maps each slug to a
real font scale. Wire `textsizechange` (or read `el.value`) if you need
to react in JS:

```ts
const select = document.querySelector("text-size-select")!;
select.addEventListener("textsizechange", (e) => {
    const { size } = (e as CustomEvent<{ size: string }>).detail;
    // analytics, etc.
});
```

## Default size

The default slug is `"medium"` whenever `"medium"` appears in your
`sizes` list. The full resolution order on first `connectedCallback`:

1. `value` attribute (if non-empty)
2. `localStorage[storage-key]` (if `storage-key` is set and readable)
3. `default-value` attribute
4. `"medium"` (if present in `sizes`)
5. `sizes[0]`
6. `""` — nothing is applied; the select waits for user interaction

## Attributes

The complete table is in [spec/index.md §4.1](./spec/index.md#41-observed-attributes).
Highlights:

| Attribute       | Type          | Required | Notes                                |
| --------------- | ------------- | -------- | ------------------------------------ |
| `label`         | string        | yes      | `aria-label` on the `<select>`.      |
| `sizes`         | string (CSV)  | yes      | Available slugs.                     |
| `value`         | string        | no       | Current slug.                        |
| `default-value` | string        | no       | Initial when nothing else applies.   |
| `storage-key`   | string        | no       | `localStorage` persistence.          |
| `name`          | string        | no       | Defaults to `"text-size"`.           |
| `size-labels`   | string (JSON) | no       | Per-slug label overrides.            |
| `class`         | string        | no       | Extra class on the `<select>`.       |

## JS properties

Every observed attribute mirrors a camelCase JS property:

```ts
const select = document.querySelector("text-size-select") as TextSizeSelect;

select.sizes = ["small", "medium", "large", "x-large"]; // CSV-encoded in attribute
select.sizeLabels = { small: "Compact", large: "Comfortable" };
select.target = document.querySelector("section.panel") as HTMLElement;
```

`el.target` accepts `HTMLElement | null` and has no attribute form.

## Events

| Event            | Detail             | Bubbles | Composed |
| ---------------- | ------------------ | ------- | -------- |
| `textsizechange` | `{ size: string }` | yes     | yes      |

## Labels

`size-labels` overrides the default rendering per slug; otherwise the
slug is title-cased per hyphen-word (`x-large` → `X Large`).

## Persistence

Pass `storage-key` to persist the active slug to `localStorage`. On a
fresh mount the select reads back the stored slug as part of the
initial-value resolution. Storage errors are silently swallowed.

## Accessibility

- The rendered root is a `<select>` (implicit `role="combobox"`) with
  `aria-label={label}`.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free.
- Directly supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12 (Text
  Spacing).

## SSR and static-site generation

The element compiles cleanly under static-site generators. On the
server no lifecycle hook runs; the SSG emits the literal
`<text-size-select>` tag, and the browser upgrades it after the JS
loads. For zero-flicker first paint, pre-render `<html
data-text-size="…">` and the matching `<text-size-select value="…">`
host.

## Testing

```sh
pnpm test
```

Exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Single source of truth.                          |
| `AGENTS.md`                | Fast-index pointer; loads the AGENTS bundle.     |
| `CLAUDE.md`                | `@AGENTS.md`.                                    |
| `text-size-select.ts`      | The custom-element class.                        |
| `text-size-select.test.ts` | vitest suite.                                    |
| `index.ts`                 | Barrel + side-effectful `customElements.define`. |
| `index.md`                 | This file.                                       |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
