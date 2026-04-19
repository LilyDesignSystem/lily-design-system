# FiveFaceRatingPicker

## Overview

A five-face rating input that lets users select a satisfaction level from 1 to 5
using labeled radio buttons representing faces from "Very bad" to "Very good".
Commonly used in satisfaction surveys, feedback forms, and experience ratings
where face-based labels are more intuitive than numeric scales.

## What it does

A picker for selecting a 1-5 satisfaction rating using face labels.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<FiveFaceRatingPicker label="How was your experience?" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the rating group via aria-label. |
| `value` | number, default 0 | Current rating (1-5, 0 = none); bindable via bind:value. |
| `name` | string, default "face-rating" | Radio group name for form submission. |
| `labels` | string[], default ["Very bad", "Bad", "Okay", "Good", "Very good"] | Accessible labels for each face. |
| `disabled` | boolean, default false | Whether the entire group is disabled. |
| `...restProps` | additional HTML attributes spread onto the fieldset |  |

## Examples

```svelte
<!-- Basic face rating with two-way binding -->
<FiveFaceRatingPicker label="How was your experience?" bind:value={rating} />

<!-- Custom face labels -->
<FiveFaceRatingPicker label="Rate service" bind:value labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveFaceRatingPicker from "$lib/components/FiveFaceRatingPicker/FiveFaceRatingPicker.svelte";
</script>

<FiveFaceRatingPicker label="How was your experience?" bind:value />
```

## Keyboard

- Tab: Focus the selected radio (or first if none selected)
- ArrowDown / ArrowRight: Move to next radio button
- ArrowUp / ArrowLeft: Move to previous radio button
- Space: Select the focused radio button

## Accessibility

- role="radiogroup" on the fieldset identifies the group as a set of radio buttons
- aria-label provides an accessible name for the entire rating group
- Each radio button has a visible text label for screen reader announcement

## Internationalization

- All text content comes through the labels prop; no hardcoded user-facing strings
- The label prop allows localized accessible names

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
