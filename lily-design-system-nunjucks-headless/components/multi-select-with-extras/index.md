# MultiSelectWithExtras

A native multiple-choice select wrapped in a div with optional content before and after.

## Implementation Notes

- Nunjucks macro `multiSelectWithExtras` in `components/multi-select-with-extras/macro.njk`; root is `<div> wrapping <select multiple>` with base class `multi-select-with-extras` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `label` (required): aria-label on the inner select, not the wrapper
- `value`, `options`, `size`, `name`, `id`, `required`, `disabled`: as MultiSelect
- `before`, `after`: raw HTML around the select
- `classes`, `attributes`: applied to the wrapper

## Usage

```njk
{{ multiSelectWithExtras({ label: "Tags", before: "<span>Pick</span>", options: [{ value: "a", text: "A" }] }) }}
```

## Keyboard Interactions

Native only.

## ARIA

`aria-label` on the inner `<select>`.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/multi-select-with-extras/` in the canonical catalog.
