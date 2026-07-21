# TextSizeChooser (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS text-size control that
applies the chosen size to the document root via `data-text-size`,
with optional `localStorage` persistence.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
user guide.

> **BREAKING (Unreleased).** This helper no longer renders a native
> `<select>`. It renders an icon button that opens a listbox, matching
> `theme-chooser` and `locale-chooser`. Consumers must now load
> `text-size-chooser.client.js` — without it the button is inert. See
> [CHANGELOG.md](./CHANGELOG.md) for the migration, and
> [docs/ssr.md](./docs/ssr.md) for the no-JS consequences.

## Why this exists

Most text-size controls couple selection, persistence, and the actual
typographic scale into one opinionated widget. This one splits the
contract cleanly:

- **This helper** owns the `data-text-size` lifecycle, accessibility,
  and persistence — via a Nunjucks macro for the markup and a small
  ES module for the runtime.
- **Your CSS** owns the actual typography, keyed on
  `[data-text-size="{slug}"]`.
- **Consumers** own the visual style of the control via the
  `text-size-chooser` class hooks.

The helper is a direct port of the Svelte canonical
`lily-design-system-svelte-text-size-chooser`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms differ.

## How the pieces fit

The helper is a **macro + client.js** pair:

- The macro (`text-size-chooser.njk`) renders the markup server-side or
  at static-site build time.
- The client (`text-size-chooser.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-text-size-chooser-*` hooks and owns **both** the
  browser-side lifecycle (storage, `data-text-size` apply, change
  events) **and** the whole listbox interaction (open/close, focus,
  keyboard, typeahead).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ textSizeChooser({…}) }}            │  import { autoInit } from
   │                                  │    "./text-size-chooser.client.js";
   ▼                                  │  autoInit();
<div class="text-size-chooser"         │     │
  data-lily-text-size-chooser-root     │     ▼
  data-lily-text-size-chooser-*>       │  finds [data-lily-text-size-chooser-root]
  <input type="hidden">               │     │
  <button aria-haspopup="listbox">    │     ▼
    <span aria-hidden="true">A</span> │  resolves initial slug
  </button>                           │     │
  <ul role="listbox" hidden>          │     ▼
    <li role="option">Medium</li>     │  applySize(slug):
    …                                 │    - target.dataset.textSize = slug
  </ul>                               │    - localStorage.setItem(...)
</div>                                │    - hidden input + aria-selected
                                      │    - opts.onChange(slug)
                                      │  …and wires the listbox keyboard
```

## Install

Copy the core files into your project or wire as a workspace
dependency:

| File                          | Purpose                  |
| ----------------------------- | ------------------------ |
| `text-size-chooser.njk`        | The Nunjucks macro.      |
| `text-size-chooser.client.js`  | The ES-module runtime.   |

Runtime dependencies: `nunjucks` ≥ 3 server-side and standard DOM
APIs client-side.

## Quick start

1. Render the macro in your Nunjucks template:

```njk
{% from "./lily-design-system-nunjucks-text-size-chooser/text-size-chooser.njk" import textSizeChooser %}

{{ textSizeChooser({
    label: "Text size",
    sizes: ["small", "medium", "large", "x-large"],
    storageKey: "lily-text-size"
}) }}

{# The control is icon-only, so it never shows the active size.
   Pair it with a status region — see docs/accessibility.md. #}
<p class="text-size-chooser-status" aria-live="polite"></p>
```

2. Load the client.js once per page. **This is not optional** — the
   button does not open without it:

```html
<script type="module">
    import { autoInit } from "/path/to/text-size-chooser.client.js";
    const status = document.querySelector(".text-size-chooser-status");
    autoInit({
        onChange(slug) {
            status.textContent = `Text size: ${slug}`;
        },
    });
</script>
```

3. Style each size in your CSS. **This is the half that actually
   satisfies WCAG 1.4.4** — the helper only signals the choice:

```css
[data-text-size="small"]   { font-size: 0.875rem; }
[data-text-size="medium"]  { font-size: 1rem; }
[data-text-size="large"]   { font-size: 1.25rem; }
[data-text-size="x-large"] { font-size: 1.5rem; }
```

Use relative units throughout. Absolute `px` defeats both this control
and the user's own browser settings.

When the user picks `large`, the client:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- mirrors `"large"` into the hidden input and the options'
  `aria-selected`,
- fires `onChange("large")` if provided.

A worked end-to-end example, including the type scale, is in
[`examples/01-basic.njk`](./examples/01-basic.njk).

## Markup

```html
<div class="text-size-chooser" data-lily-text-size-chooser-root …>
  <input type="hidden" name="text-size" value="medium">
  <button type="button" class="text-size-chooser-button"
          aria-label="Text size" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="text-size-chooser-text-size-list">
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="text-size-chooser-text-size-list"
      role="listbox" aria-label="Text size" tabindex="-1" hidden>
    <li class="text-size-chooser-option" role="option"
        aria-selected="true" data-value="medium">Medium</li>
    …
  </ul>
</div>
```

The package ships **no CSS at all**, including none for positioning the
open listbox. Style it with `.text-size-chooser-list:not([hidden])` —
never `display: block`, which would override the `hidden` attribute
that is the open-state contract.

### Why the glyph is "A"

A plain Latin capital letter, not a pictograph. U+1F5DB DECREASE FONT
SIZE SYMBOL has no real glyph in common font stacks — it degrades to a
crude bitmap shape — and it means *decrease* rather than *size*. "A"
renders in the page's own font everywhere and is the conventional
text-size affordance.

Override it with a `{% call %}` block:

```njk
{% call textSizeChooser({label: "Text size", sizes: ["small", "large"]}) %}
    <span aria-hidden="true">Aa</span>
{% endcall %}
```

The block replaces the **glyph**, not the label, and does not render
options. Keep whatever you put there `aria-hidden="true"` — the
accessible name must stay on `aria-label`.

## Initial size

The initial slug on `initTextSizeChooser(root)` resolves to the first
non-empty value of:

1. `data-lily-text-size-chooser-value` (i.e. `opts.value`).
2. `localStorage.getItem(storageKey)` (when set and readable).
3. `data-lily-text-size-chooser-default-value` (i.e. `opts.defaultValue`).
4. `"medium"` if present among the option values.
5. The first option value, or `""` if none.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `sizes`. Optional: `value`, `defaultValue`,
`storageKey`, `name` (default `"text-size"`), `sizeLabels`, `id`
(default `"text-size-chooser-{name}"`), `classes`, `attributes`.

`label` is the accessible name for **both** the button and the
listbox. The button is icon-only, so this is the only accessible name
it has — it is load-bearing.

Default option labels title-case the slug per hyphen-word
(`x-large` → `X Large`). Pass `sizeLabels` to override any label;
typeahead matches the rendered label, so overrides participate.

There is deliberately **no** detection prop: unlike
`prefers-color-scheme` and `navigator.languages`, the web platform
exposes no OS "preferred text size" signal.

## Client.js API

```js
import {
    initTextSizeChooser,
    autoInit,
    sizeName,
    LATIN_CAPITAL_LETTER_A,
} from "./text-size-chooser.client.js";
```

- `autoInit(opts?)` — find every
  `[data-lily-text-size-chooser-root]` and wire it.
- `initTextSizeChooser(root, opts?)` — wire a single root; returns
  `{setSize, destroy}`.
- `sizeName(slug)` — `"x-large"` → `"X Large"`. The JS statement of
  the label rule the macro applies in template syntax.
- `LATIN_CAPITAL_LETTER_A` — the default glyph, `"A"`.

Optional `opts`:

- `onChange(size)` — fired after every apply; receives the slug.
- `target` — element receiving `data-text-size` (defaults to
  `<html>`).

## Keyboard

Owned entirely by the client.js; none of it works before that module
runs. On the button: `ArrowDown` / `Enter` / `Space` open (`ArrowUp`
opens on the last option). On the list: arrows move and clamp,
`Home` / `End` jump, `Enter` / `Space` select, `Escape` closes
unchanged, `Tab` closes and moves on, printable characters run
typeahead. Full table in
[docs/accessibility.md](./docs/accessibility.md).

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- Directly supports WCAG 1.4.4 (Resize Text) — provided your CSS
  actually delivers the resize.
- `aria-label` is the only accessible name the button has.
- **Without JavaScript the button cannot be operated at all**, which
  the old native `<select>` could. This matters more for a text-size
  control than for its siblings; browser zoom remains the backstop.

The honest tradeoffs — the `aria-label` dependency, weaker AT support
than a native `<select>`, and glyph rendering — are documented in
[docs/accessibility.md](./docs/accessibility.md), and the SSR and
no-JS consequences in [docs/ssr.md](./docs/ssr.md).

## Testing

`pnpm test` under a vitest + jsdom setup exercises every numbered
acceptance criterion in [spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
