# TextSizeSelect (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS text-size select that
applies the chosen size to the document root via `data-text-size`,
with optional `localStorage` persistence.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
user guide.

## Why this exists

Most text-size controls couple selection, persistence, and the actual
typographic scale into one opinionated widget. This one splits the
contract cleanly:

- **This helper** owns the `data-text-size` lifecycle, accessibility,
  and persistence — via a Nunjucks macro for the markup and a small
  ES module for the runtime.
- **Your CSS** owns the actual typography, keyed on
  `[data-text-size="{slug}"]`.
- **Consumers** own the visual style of the select via the
  `text-size-select` class hook.

The helper is a direct port of the Svelte canonical
`lily-design-system-svelte-text-size-select`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms differ.

## How the pieces fit

The helper is a **macro + client.js** pair:

- The macro (`text-size-select.njk`) renders the `<select>` markup
  server-side or at static-site build time.
- The client (`text-size-select.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-text-size-select-*` hooks and owns the browser-side
  lifecycle (storage, `data-text-size` apply, change events).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ textSizeSelect({…}) }}            │  import { autoInit } from
   │                                  │    "./text-size-select.client.js";
   ▼                                  │  autoInit();
<select                               │     │
  class="text-size-select"            │     ▼
  aria-label="Text size"              │  finds [data-lily-text-size-select-root]
  name="text-size"                    │     │
  data-lily-text-size-select-root     │     ▼
  data-lily-text-size-select-*        │  resolves initial slug
  …>                                  │     │
  <option value="medium">             │     ▼
    Medium                            │  applySize(slug):
  </option>                           │    - target.dataset.textSize = slug
  …                                   │    - localStorage.setItem(...)
</select>                             │    - opts.onChange(slug)
```

## Install

Copy the core files into your project or wire as a workspace
dependency:

| File                          | Purpose                  |
| ----------------------------- | ------------------------ |
| `text-size-select.njk`        | The Nunjucks macro.      |
| `text-size-select.client.js`  | The ES-module runtime.   |

Runtime dependencies: `nunjucks` ≥ 3 server-side and standard DOM
APIs client-side.

## Quick start

1. Render the macro in your Nunjucks template:

```njk
{% from "./lily-design-system-nunjucks-text-size-select/text-size-select.njk" import textSizeSelect %}

{{ textSizeSelect({
    label: "Text size",
    sizes: ["small", "medium", "large", "x-large"],
    storageKey: "lily-text-size"
}) }}
```

2. Load the client.js once per page:

```html
<script type="module">
    import { autoInit } from "/path/to/text-size-select.client.js";
    autoInit();
</script>
```

3. Style each size in your CSS:

```css
[data-text-size="small"]   { font-size: 0.875rem; }
[data-text-size="medium"]  { font-size: 1rem; }
[data-text-size="large"]   { font-size: 1.25rem; }
[data-text-size="x-large"] { font-size: 1.5rem; }
```

When the user picks `large`, the client:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- fires `onChange("large")` if provided.

The select does NOT define the typographic scale — that is the
consumer's CSS job.

## Initial size

The initial slug on `initTextSizeSelect(root)` resolves to the first
non-empty value of:

1. The `value` of any `<option>` the macro rendered with `selected`
   (i.e. `opts.value`).
2. `localStorage.getItem(storageKey)` (when set and readable).
3. The `<select>`'s `data-lily-text-size-select-default-value`
   (i.e. `opts.defaultValue`).
4. `"medium"` if present among the rendered option values.
5. The first option value, or `""` if none.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `sizes`. Optional: `value`, `defaultValue`,
`storageKey`, `name` (default `"text-size"`), `sizeLabels`,
`classes`, `attributes`.

Default option labels title-case the slug per hyphen-word
(`x-large` → `X Large`). Pass `sizeLabels` to override any label.

## Client.js API

```js
import {
    initTextSizeSelect,
    autoInit,
} from "./text-size-select.client.js";
```

- `autoInit(opts?)` — find every
  `[data-lily-text-size-select-root]` and wire it.
- `initTextSizeSelect(root, opts?)` — wire a single `<select>`;
  returns `{setSize, destroy}`.

Optional `opts`:

- `onChange(size)` — fired after every apply; receives the slug.
- `target` — element receiving `data-text-size` (defaults to
  `<html>`).

## Accessibility

- `<select aria-label="…">` is the announced combobox container.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free.
- Directly supports WCAG 1.4.4 (Resize Text).
- WCAG 2.2 AAA is the target.

## Testing

`pnpm test` under a vitest + jsdom setup exercises every numbered
acceptance criterion in [spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
