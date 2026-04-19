# NetPromoterScorePickerButton

## Overview

A headless button representing one score in a Net Promoter Score picker.
Renders a <button> with aria-pressed to indicate the selected state and
data-value for consumer CSS targeting. Each button represents a score (0-10)
in the NPS scale. Commonly used in customer loyalty surveys and feedback forms.

## What it does

A picker button for selecting a 0-10 Net Promoter Score.

## When to use

- Use as a single selectable option within the matching Picker.
- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<NetPromoterScorePickerButton value={9} label="9" onclick={handleSelect} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | number, required | The NPS score value (0-10). |
| `label` | string, required | Accessible name for the button. |
| `selected` | boolean, default false | Whether this score is currently selected. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `onclick` | (event: MouseEvent) => void, optional | Click handler. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Selected NPS button -->
<NetPromoterScorePickerButton value={10} label="10" selected={true} onclick={handleSelect} />
<!-- Disabled NPS button -->
<NetPromoterScorePickerButton value={0} label="0" disabled={true} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NetPromoterScorePickerButton from "$lib/components/NetPromoterScorePickerButton/NetPromoterScorePickerButton.svelte";
</script>

<NetPromoterScorePickerButton value={9} label="9" onclick={handleSelect} />
```

## Keyboard

- Tab: Move focus to the button
- Enter: Activate the button (native button behavior)
- Space: Activate the button (native button behavior)

## Accessibility

- aria-label provides an accessible name for the button
- aria-pressed indicates whether the score is currently selected
- data-value exposes the score for consumer CSS selectors

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
