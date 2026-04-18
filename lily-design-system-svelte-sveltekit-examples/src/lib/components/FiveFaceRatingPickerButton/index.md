# FiveFaceRatingPickerButton

## Overview

A headless button representing one face in a five-face rating picker. Renders
a <button> with aria-pressed to indicate the selected state and data-value for
consumer CSS targeting. Each button represents a satisfaction level (1-5) with
a descriptive label (e.g. "Very bad", "Good"). Commonly used in satisfaction
surveys, feedback forms, and experience ratings.

## What it does

A picker button for selecting a 1-5 satisfaction rating using face labels.

## When to use

- Use as a single selectable option within the matching Picker.
- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<FiveFaceRatingPickerButton value={3} label="Okay" onclick={handleSelect} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | number, required | The rating value (1-5). |
| `label` | string, required | Accessible name for the button (e.g. "Very bad", "Good"). |
| `selected` | boolean, default false | Whether this face is currently selected. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `onclick` | (event: MouseEvent) => void, optional | Click handler. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Selected face button -->
<FiveFaceRatingPickerButton value={4} label="Good" selected={true} onclick={handleSelect} />
<!-- Disabled face button -->
<FiveFaceRatingPickerButton value={1} label="Very bad" disabled={true} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveFaceRatingPickerButton from "$lib/components/FiveFaceRatingPickerButton/FiveFaceRatingPickerButton.svelte";
</script>

<FiveFaceRatingPickerButton value={3} label="Okay" onclick={handleSelect} />
```

## Keyboard

- Tab: Move focus to the button
- Enter: Activate the button (native button behavior)
- Space: Activate the button (native button behavior)

## Accessibility

- aria-label provides an accessible name describing the face level
- aria-pressed indicates whether the face is currently selected
- data-value exposes the rating value for consumer CSS selectors

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
