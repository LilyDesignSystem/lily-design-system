# ShowMore

A show more / show less toggle for long content. The content stays in the accessibility tree; the clamp is consumer CSS keyed on `data-expanded`.

## Implementation Notes

- Nunjucks macro `showMore` in `components/show-more/macro.njk`; root is `<div>` with base class `show-more` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)

## Deviations

Nunjucks ships no JavaScript, so the macro does not toggle itself (Svelte `bind:expanded` does). The button carries `data-module="show-more"`, `data-more-label` and `data-less-label`; consumer JS flips `aria-expanded`, `data-expanded` and the button text. Server render of an initially expanded state is supported via `expanded: true`.

## Props

- `moreLabel`, `lessLabel` (required, no default)
- `expanded` (default false), `id` (content id)
- `html` / `text` / caller content, `classes`, `attributes`

## Usage

```njk
{% call showMore({ moreLabel: "Show more", lessLabel: "Show less", id: "bio" }) %}Long text{% endcall %}
```

## Keyboard Interactions

Native button (Enter / Space) — but see Deviations.

## ARIA

Button `aria-expanded` + `aria-controls` -> content id; content has `data-expanded`.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/show-more/` in the canonical catalog.
