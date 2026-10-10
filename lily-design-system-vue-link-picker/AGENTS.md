# AGENTS — LinkPicker (Vue)

Single source of truth: [spec/index.md](./spec/index.md); the contract is the Svelte package's, ported.

## What this package is

A headless Vue 3 page-links control: a single-icon button (a bundled home SVG) opening a disclosure list of page links the
**app defines**. No CSS, no routes, no English.

## Files

| File | Purpose |
| ---- | ------- |
| `LinkPicker.vue` | Implementation. |
| `LinkPicker.test.ts` | 24 tests mapped to the spec §7 clauses. |
| `spec/index.md` | Contract and this port's differences. |
| `index.md` | Guide. |
| `docs/accessibility.md` | Trade-offs, stated plainly. |
| `examples/` | Home / About Us / Contact Us / Privacy Policy, router integration, custom icon. |

## Surface

`default` / `LinkPicker`, `linkId`, `nextLinkPickerId`, types `Props`, `SlotArgs`, `ChildArgs`, `LinkItem`.

## HTML

`div.link-picker` → `button.link-picker-button` (aria-hidden SVG `link-picker-icon`) → `div.link-picker-tooltip[role=tooltip]` →
`ul.link-picker-list[hidden]` of `li.link-picker-list-item > a.link-picker-link`. Not a menu: real `<a href>`;
`aria-current="page"` where marked.
