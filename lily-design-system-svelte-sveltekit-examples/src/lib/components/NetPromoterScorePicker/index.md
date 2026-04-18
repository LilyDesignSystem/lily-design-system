# NetPromoterScorePicker

## Overview

A headless Net Promoter Score (NPS) rating input that renders a fieldset
with role="radiogroup" containing 11 radio buttons (0-10). NPS is a widely
used customer loyalty metric where scores are categorized as Detractors (0-6),
Passives (7-8), and Promoters (9-10). The value prop is bindable for reactive
form integration.

## What it does

A picker for selecting a 0-10 Net Promoter Score.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<NetPromoterScorePicker label="How likely are you to recommend us?" bind:value={score} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the radiogroup via aria-label. |
| `value` | string, default "" | Currently selected NPS score ("0"-"10"); bindable via $bindable(). |
| `name` | string, default "nps" | Name attribute for the radio input group. |
| `...restProps` | additional HTML attributes spread onto the <fieldset> |  |

## Examples

```svelte
<!-- Basic NPS rating input -->
<NetPromoterScorePicker
  label="How likely are you to recommend us?"
  bind:value={score}
/>

<!-- With a custom radio group name -->
<NetPromoterScorePicker
  label="Rate our service"
  bind:value={score}
  name="service-nps"
/>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NetPromoterScorePicker from "$lib/components/NetPromoterScorePicker/NetPromoterScorePicker.svelte";
</script>

<NetPromoterScorePicker label="How likely are you to recommend us?" bind:value={score} />
```

## Keyboard

- Arrow keys: navigate between radio buttons (native radio group behavior)
- Space: select the focused radio button
- Tab: move focus into/out of the radio group

## Accessibility

- role="radiogroup" on the fieldset
- aria-label on the fieldset from the label prop
- Each radio button has aria-label with its numeric value

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
- WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
