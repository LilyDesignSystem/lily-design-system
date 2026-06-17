# AGENTS — TextSizeSelect (Nunjucks helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless text-size picker that
applies the chosen size to the document root via `data-text-size`,
with optional `localStorage` persistence. Ships no CSS; consumer
styles the `text-size-select` class hook and maps each
`[data-text-size="…"]` slug to real typography.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, `data-text-size` application, change
  events).

## Files

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Specification-driven contract (canonical).       |
| `text-size-select.njk`        | Nunjucks macro (`textSizeSelect(opts)`).         |
| `text-size-select.client.js`  | ES module — `initTextSizeSelect`, `autoInit`.    |
| `text-size-select.test.ts`    | Vitest spec, one assertion per §7 acceptance.    |
| `index.md`                    | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./text-size-select.njk" import textSizeSelect %}`
- Call:   `{{ textSizeSelect({label, sizes, …}) }}`
- Required `opts` keys: `label`, `sizes`.
- Full table in [spec.md §4.1](./spec.md#41-macro-parameters).

### Client.js

- `import { initTextSizeSelect, autoInit } from "./text-size-select.client.js"`
- Required call: `initTextSizeSelect(rootElement, opts?)` or
  `autoInit(opts?)`.

## Behaviour contract (one paragraph)

The macro emits a `<select class="text-size-select">` with
`data-lily-text-size-select-*` hooks describing the picker's name,
storage key, and default value. On `initTextSizeSelect(root)`, the
client (1) resolves the initial slug from selected-option > storage >
default-value > `"medium"` > first-option, (2) sets
`data-text-size="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes to `localStorage`,
(4) selects the matching option (sets the `<select>` value), (5) calls
`onChange(slug)`. There is NO managed `<link>`, NO `lang`/`dir`, NO
navigator detection.

## HTML

`<select class="text-size-select {classes}" aria-label="{label}"
name="{name}" data-lily-text-size-select-root …>` containing one
`<option class="text-size-select-option" value="{slug}">…</option>`
per slug. Default labels title-case the slug per hyphen-word
(`x-large` → `X Large`); `sizeLabels[slug]` overrides.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- The native `<select>` provides Arrow / Home / End / typeahead /
  Tab semantics with no JS keyboard handlers.
- `aria-label` carries the consumer-supplied accessible name.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output.
