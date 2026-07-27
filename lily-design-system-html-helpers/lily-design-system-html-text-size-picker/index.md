# `<text-size-chooser>` (HTML helper)

A reusable, headless vanilla HTML/JS **text-size chooser**, packaged as
the `<text-size-chooser>` custom element. Renders an icon button that
opens a dropdown listbox (WAI-ARIA APG listbox pattern) of text-size
slugs and, on every change, sets `data-text-size="{slug}"` on a target
element (default `document.documentElement`), optionally persisting the
choice to `localStorage`.

It is structurally identical to its `theme-chooser` and `locale-chooser`
siblings — all three helpers in this catalog are the same shape.

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
`lily-design-system-svelte-text-size-chooser`. APIs and behaviour match;
only the framework idioms differ.

## Install

```ts
// One side-effect import registers <text-size-chooser> globally:
import "./lily-design-system-html-text-size-chooser";

// Or grab the class, helpers, and types:
import {
    TextSizeChooser,
    sizeName,                 // "x-large" → "X Large"
    nextTextSizeChooserId,
    LATIN_CAPITAL_LETTER_A,   // the default "A" glyph
    type TextSizeChooserProps,
    type TextSizeChooserChangeDetail,
} from "./lily-design-system-html-text-size-chooser";
```

The barrel guards registration with
`customElements.get("text-size-chooser")` so re-imports and SSR contexts
don't throw.

## Quick start

```html
<script type="module" src="/dist/text-size-chooser.js"></script>

<text-size-chooser
    label="Text size"
    sizes="small,medium,large,x-large"
    storage-key="lily-text-size"
></text-size-chooser>

<p class="text-size-chooser-status" aria-live="polite">Text size: Medium</p>
```

When the user picks `large`, the element:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- dispatches `new CustomEvent("textsizechange", { detail: { size: "large" }, bubbles: true, composed: true })`.

The element does **not** style anything — your CSS maps each slug to a
real font scale. The closed button shows only the "A" glyph, so the
status region above is the default pattern: it is the only thing that
tells a user which size is active. Wire `textsizechange` (or read
`el.value`) to keep it current:

```ts
const select = document.querySelector("text-size-chooser")!;
const status = document.querySelector(".text-size-chooser-status")!;

select.addEventListener("textsizechange", (e) => {
    const { size } = (e as CustomEvent<{ size: string }>).detail;
    status.textContent = `Text size: ${select.labelFor(size)}`;
});
```

Because the list is a plain flow element, give it positioning — the
helper ships no CSS at all:

```css
.text-size-chooser { position: relative; }
.text-size-chooser-list { position: absolute; z-index: 10; }
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

| Attribute       | Type          | Required | Notes                                       |
| --------------- | ------------- | -------- | ------------------------------------------- |
| `label`         | string        | yes      | `aria-label` on the button *and* the list.  |
| `sizes`         | string (CSV)  | yes      | Available slugs.                            |
| `value`         | string        | no       | Current slug.                               |
| `default-value` | string        | no       | Initial when nothing else applies.          |
| `storage-key`   | string        | no       | `localStorage` persistence.                 |
| `name`          | string        | no       | Defaults to `"text-size"`; on the hidden input. |
| `size-labels`   | string (JSON) | no       | Per-slug label overrides.                   |
| `class`         | string        | no       | Extra class on the root `<div>`.            |

There is no detection attribute. Unlike `theme-chooser`
(`detect-from-system`) and `locale-chooser` (`detect-from-navigator`),
the platform exposes no preferred-text-size signal to detect.

## Class hooks

| Class                      | Element                                      |
| -------------------------- | -------------------------------------------- |
| `text-size-chooser`         | root `<div>`                                 |
| `text-size-chooser-button`  | the icon `<button>`                          |
| `text-size-chooser-icon`    | the `<span>` holding the "A" glyph           |
| `text-size-chooser-list`    | the `<ul role="listbox">`                    |
| `text-size-chooser-option`  | each `<li role="option">`                    |

Style `[data-active]` (keyboard-highlighted) differently from
`[aria-selected="true"]` (chosen) — they mean different things.

## JS properties

Every observed attribute mirrors a camelCase JS property:

```ts
const select = document.querySelector("text-size-chooser") as TextSizeChooser;

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

## Custom rendering

Subclass and override `renderButtonContent()` to replace the glyph.
It is the HTML-helper stand-in for the `children` snippet the Svelte /
React / Vue siblings take, and `this.value`, `this.open`, and
`this.labelFor(...)` are all readable inside it:

```ts
class MyTextSizeChooser extends TextSizeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = `A — ${this.labelFor(this.value)}`;
        return span;
    }
}
customElements.define("my-text-size-chooser", MyTextSizeChooser);
```

The base class still builds the button and listbox, so the aria wiring
and the whole keyboard contract keep working.

## Accessibility

- The control is an icon button (`aria-haspopup="listbox"`,
  `aria-expanded`, `aria-controls`) opening a `<ul role="listbox">`.
  `aria-label={label}` names both.
- The keyboard contract is implemented in JS, not inherited from the
  platform: `ArrowDown`/`Enter`/`Space` open, `ArrowUp` opens on the
  last option, arrows clamp, `Home`/`End` jump, `Enter`/`Space`
  select, `Escape` closes unchanged, `Tab` moves on, printable
  characters run a 500 ms typeahead.
- Focus sits on the `<ul>` while open; the highlighted option is
  conveyed by `aria-activedescendant`. Style
  `.text-size-chooser-list:focus-visible` and
  `.text-size-chooser-option[data-active]`, or keyboard users get no
  feedback.
- Directly supports WCAG 2.2 — 1.4.4 (Resize Text), 1.4.10 (Reflow),
  and 1.4.12 (Text Spacing).
- Three known tradeoffs (icon-only naming, a custom listbox being
  weaker than a native `<select>`, font-dependent glyph rendering) are
  documented honestly in [docs/accessibility.md](./docs/accessibility.md).

## SSR and static-site generation

The element compiles cleanly under static-site generators. On the
server no lifecycle hook runs; the SSG emits the literal
`<text-size-chooser>` tag, and the browser upgrades it after the JS
loads. For zero-flicker first paint, pre-render `<html
data-text-size="…">` and the matching `<text-size-chooser value="…">`
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
| `spec/index.md`            | Single source of truth.                          |
| `AGENTS.md`                | Fast-index pointer; loads the AGENTS bundle.     |
| `CLAUDE.md`                | `@AGENTS.md`.                                    |
| `text-size-chooser.ts`      | The custom-element class.                        |
| `text-size-chooser.test.ts` | vitest suite.                                    |
| `index.ts`                 | Barrel + side-effectful `customElements.define`. |
| `index.md`                 | This file.                                       |
| `docs/accessibility.md`    | Roles, keyboard contract, known tradeoffs.       |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
