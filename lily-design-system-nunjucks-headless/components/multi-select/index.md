# MultiSelect

A native multiple-choice select.

## Implementation Notes

- Nunjucks macro `multiSelect` in `components/multi-select/macro.njk`; root is `<select multiple>` with base class `multi-select` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `label` (required): aria-label
- `value`: array of selected option values
- `options`: `{ value, text, html, selected, disabled }` descriptors, or caller `<option>` content
- `size`, `name`, `id`, `required`, `disabled`, `classes`, `attributes`

## Usage

```njk
{{ multiSelect({ label: "Toppings", value: ["a"], options: [{ value: "a", text: "Cheese" }] }) }}
```

## Keyboard Interactions

Native only.

## ARIA

`aria-label` on the select.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/multi-select/` in the canonical catalog.
