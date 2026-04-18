# NetPromoterScorePickerButton

A button representing one score in a Net Promoter Score picker. Renders a `<button>` with `aria-pressed` to indicate the selected state and `data-value` for consumer CSS targeting.

Compound component: use with NetPromoterScorePicker.

## Props

- `value`: number (required) -- the NPS score value (0-10)
- `label`: string (required) -- accessible name for the button
- `selected`: boolean (default false) -- whether this score is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onclick`: function (optional) -- click handler
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```svelte
{#each Array.from({ length: 11 }, (_, i) => i) as score}
  <NetPromoterScorePickerButton
    value={score}
    label={String(score)}
    selected={nps === score}
    onclick={() => nps = score}
  />
{/each}
```

## ARIA

- `aria-label` -- accessible name for the button
- `aria-pressed` -- indicates whether the score is currently selected
- `data-value` -- exposes the score value for consumer CSS selectors

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
