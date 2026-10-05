# EmptyState

A placeholder shown when a list, table, or view has nothing to display yet.

## Implementation Notes

- Nunjucks macro `emptyState` in `components/empty-state/macro.njk`; root is `<div>` with base class `empty-state` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `label` (optional): adds `role="group"` and `aria-label`
- `html` / `text` / caller content
- `classes`, `attributes`, `id`

## Usage

```njk
{% call emptyState({ label: "No results" }) %}<h2>No results</h2>{% endcall %}
```

## Keyboard Interactions

None.

## ARIA

`role="group"` + `aria-label` only when `label` is given. No icon.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/empty-state/` in the canonical catalog.
