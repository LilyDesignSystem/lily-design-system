# FiveStarRatingView

## Overview

A read-only five-star rating display that renders filled and empty star characters
to visually represent a rating value from 0 to 5. This is the display-only companion
to FiveStarRatingPicker, used for showing ratings in product listings, review summaries,
and user profiles. Screen readers receive the full rating via aria-label.

## What it does

A read-only display of a five-star rating.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<FiveStarRatingView value={4} label="4 out of 5 stars" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | number, required | Rating value (0-5) to display. |
| `label` | string, required | Accessible description via aria-label (e.g., "4 out of 5 stars"). |
| `...restProps` | additional HTML attributes spread onto the outer span |  |

## Examples

```svelte
<!-- Display a product rating -->
<FiveStarRatingView value={4} label="4 out of 5 stars" />

<!-- Display an empty rating -->
<FiveStarRatingView value={0} label="No rating" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveStarRatingView from "$lib/components/FiveStarRatingView/FiveStarRatingView.svelte";
</script>

<FiveStarRatingView value={4} label="4 out of 5 stars" />
```

## Keyboard

- None — this is a passive, read-only display element

## Accessibility

- role="img" on the outer span indicates it represents a visual/graphic element
- aria-label provides the full rating description for screen readers
- aria-hidden="true" on inner star spans prevents reading individual characters
- data-value and data-filled attributes enable consumer CSS styling

## Internationalization

- The label prop allows localized rating descriptions
- Star characters are decorative; meaningful text is conveyed via aria-label

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
