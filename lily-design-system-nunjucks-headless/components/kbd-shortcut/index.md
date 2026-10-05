# KbdShortcut

A keyboard shortcut: an outer kbd with one inner kbd per key and decorative separators.

## Implementation Notes

- Nunjucks macro `kbdShortcut` in `components/kbd-shortcut/macro.njk`; root is `<kbd>` with base class `kbd-shortcut` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `keys` (required): array of key names
- `separator` (default `+`), `label` (optional spoken form -> aria-label)
- `classes`, `attributes`, `id`

## Usage

```njk
{{ kbdShortcut({ keys: ["Ctrl", "K"], label: "Control K" }) }}
```

## Keyboard Interactions

None; display only.

## ARIA

Separators are `aria-hidden`; `label` overrides the spoken form.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/kbd-shortcut/` in the canonical catalog.
