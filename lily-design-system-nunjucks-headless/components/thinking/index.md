# Thinking

A disclosure for an AI assistant reasoning trace, built on native details. Closed by default.

## Implementation Notes

- Nunjucks macro `thinking` in `components/thinking/macro.njk`; root is `<details>` with base class `thinking` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)


## Props

- `label` (required): summary text
- `open` (default false), `streaming` (default false -> `data-streaming` + `aria-busy`)
- `html` / `text` / caller content, `classes`, `attributes`, `id`

## Usage

```njk
{% call thinking({ label: "Thinking", streaming: true }) %}Step one...{% endcall %}
```

## Keyboard Interactions

Native summary: Enter / Space toggles.

## ARIA

`aria-busy="true"` and `data-streaming="true"` only while streaming.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/thinking/` in the canonical catalog.
