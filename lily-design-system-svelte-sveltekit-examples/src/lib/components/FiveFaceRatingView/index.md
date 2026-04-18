# FiveFaceRatingView

## Overview

A read-only five-face rating display that shows a text label corresponding to a
rating value from 1 to 5. This is the display-only companion to FiveFaceRatingPicker,
used for showing previously submitted ratings in summaries, review lists, or
dashboard displays. Renders a span with role="img" and the face label text.

## What it does

A read-only display of a five-face satisfaction rating.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<FiveFaceRatingView value={4} label="Good rating" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | number, required | Rating value (1-5) to display. |
| `label` | string, required | Accessible description via aria-label. |
| `labels` | string[], default ["Very bad", "Bad", "Okay", "Good", "Very good"] | Text labels for each face. |
| `...restProps` | additional HTML attributes spread onto the span |  |

## Examples

```svelte
<!-- Display a submitted face rating -->
<FiveFaceRatingView value={3} label="Okay rating" />

<!-- Custom face labels -->
<FiveFaceRatingView value={5} label="Excellent" labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveFaceRatingView from "$lib/components/FiveFaceRatingView/FiveFaceRatingView.svelte";
</script>

<FiveFaceRatingView value={4} label="Good rating" />
```

## Keyboard

- None — this is a passive, read-only display element

## Accessibility

- role="img" indicates the span represents a visual/graphic element (the face rating)
- aria-label provides the full rating description for screen readers
- data-value attribute exposes the numeric value for consumer CSS or testing

## Internationalization

- All text content comes through the labels and label props; no hardcoded user-facing strings

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
