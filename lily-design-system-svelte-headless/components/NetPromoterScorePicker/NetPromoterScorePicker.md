# NetPromoterScorePicker

A Net Promoter Score (NPS) rating input that allows users to select a score from 0 to 10, representing their likelihood to recommend a product, service, or organization. It is a widely used customer loyalty metric developed by Fred Reichheld and Bain & Company. The component renders as a fieldset with a radiogroup role containing 11 radio buttons, one for each score value. Scores are typically categorized as Detractors (0-6), Passives (7-8), and Promoters (9-10). This headless component provides the semantic structure and accessibility features while allowing consumers to apply their own visual styling.

## Implementation Notes

- Renders as `<fieldset role="radiogroup">` with 11 radio buttons (0-10)
- Each radio has `aria-label` with its numeric value for screen readers
- The `value` prop is `$bindable()` for two-way binding
- Default radio group name is "nps", customizable via `name` prop
- Radio values are strings ("0" through "10")

## Props

- `label`: string (required) -- accessible label for the radiogroup
- `value`: string (default: "") -- currently selected score, bindable
- `name`: string (default: "nps") -- name attribute for the radio group
- `...restProps`: Any additional HTML attributes spread onto the fieldset

## Usage

Basic NPS rating input:

```svelte
<script lang="ts">
  import NetPromoterScorePicker from './NetPromoterScorePicker.svelte';

  let score = $state("");
</script>

<NetPromoterScorePicker label="How likely are you to recommend us?" bind:value={score} />
<p>Selected score: {score}</p>
```

With a custom radio group name:

```svelte
<NetPromoterScorePicker
  label="Rate our service"
  bind:value={score}
  name="service-nps"
/>
```

With additional HTML attributes:

```svelte
<NetPromoterScorePicker
  label="Customer satisfaction"
  bind:value={score}
  data-section="feedback"
/>
```

## Keyboard Interactions

- Arrow keys navigate between radio buttons (native radio group behavior)
- Space selects the focused radio button
- Tab moves focus into/out of the radio group

## ARIA

- `role="radiogroup"` on the fieldset
- `aria-label` on the fieldset from the label prop
- Each radio has `aria-label` with its numeric value

## References

- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
- WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
