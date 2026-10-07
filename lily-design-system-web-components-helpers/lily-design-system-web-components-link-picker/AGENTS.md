# AGENTS — `<lily-link-picker>` (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md).

## What this package is

A vanilla custom element, `<lily-link-picker>`: a single-icon button (bundled home SVG) that opens a disclosure of page links the
**app defines**. Light DOM, no CSS, no routes, no English. An independent copy of `@lilydesignsystem/html-link-picker` with the `lily-` tag, composing `<lily-icon-button>`.

## Files

| File | Purpose |
| ---- | ------- |
| `link-picker.ts` | The element class (does not register). |
| `index.ts` | Barrel; registers `<lily-link-picker>` idempotently. |
| `link-picker.test.ts` | Vitest + jsdom, mapped to the spec §7 clauses. |
| `spec/index.md` | Contract. |
| `docs/` | Accessibility and styling. |
| `examples/` | Runnable pages: Home / About Us / Contact Us / Privacy Policy. |

## Surface

`label` (attribute), `links` (property or JSON attribute), `onNavigate`, the cancelable `navigate` event, `renderButtonContent()`,
`openList()`, `closeList()`, `items()`, `open`, `listId`. Exports `LinkPicker`, `linkId`, `nextLinkPickerId`, types `LinkItem`,
`LinkPickerProps`, `LinkPickerNavigateDetail`.

## HTML

`<div class="lily-link-picker">` → `<button class="link-picker-button">` (aria-hidden SVG) → `<div class="link-picker-tooltip"
role="tooltip">` → `<ul class="link-picker-list" hidden>` of `<li class="link-picker-list-item"><a class="link-picker-link">`.
Not a menu: real `<a>`; `aria-current="page"` where marked.
