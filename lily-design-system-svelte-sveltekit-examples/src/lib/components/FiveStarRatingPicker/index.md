# FiveStarRatingPicker

## Overview

A five-star rating input that lets users select a rating from 1 to 5 stars using
radio buttons. This is one of the most common rating patterns on the web, used for
product reviews, content ratings, and feedback forms. Each radio button is labeled
with "N star" or "N stars" for clear screen reader communication.

## What it does

A picker for selecting a 1-5 star rating using radio buttons.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<FiveStarRatingPicker label="Rate this" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the rating group via aria-label. |
| `value` | number, default 0 | Current rating (1-5, 0 = none); bindable via bind:value. |
| `name` | string, default "rating" | Radio group name for form submission. |
| `disabled` | boolean, default false | Whether the entire group is disabled. |
| `...restProps` | additional HTML attributes spread onto the fieldset |  |

## Examples

```svelte
<!-- Basic star rating with two-way binding -->
<FiveStarRatingPicker label="Rate this product" bind:value={rating} />

<!-- Disabled star rating -->
<FiveStarRatingPicker label="Your rating" bind:value disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveStarRatingPicker from "$lib/components/FiveStarRatingPicker/FiveStarRatingPicker.svelte";
</script>

<FiveStarRatingPicker label="Rate this" bind:value />
```

## Keyboard

- Tab: Focus the selected radio (or first if none selected)
- ArrowDown / ArrowRight: Move to next radio button
- ArrowUp / ArrowLeft: Move to previous radio button
- Space: Select the focused radio button

## Accessibility

- role="radiogroup" on the fieldset identifies the group as a set of radio buttons
- aria-label provides an accessible name for the entire rating group
- Each radio label reads "1 star", "2 stars", etc. for screen reader clarity

## Internationalization

- The label prop allows localized accessible names
- Star labels ("N star"/"N stars") are in the template; consumer can override via restProps

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
