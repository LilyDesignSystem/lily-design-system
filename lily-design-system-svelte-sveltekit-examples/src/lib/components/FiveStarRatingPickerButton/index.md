# FiveStarRatingPickerButton

## Overview

A headless button representing one star in a five-star rating picker. Renders
a <button> with aria-pressed to indicate the selected state and data-value for
consumer CSS targeting. Each button represents a rating level (1-5) with a
descriptive label (e.g. "1 star", "3 stars"). Commonly used in product reviews,
content ratings, and feedback forms.

## What it does

A picker button for selecting a 1-5 star rating using radio buttons.

## When to use

- Use as a single selectable option within the matching Picker.
- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<FiveStarRatingPickerButton value={3} label="3 stars" onclick={handleSelect} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | number, required | The rating value (1-5). |
| `label` | string, required | Accessible name for the button (e.g. "1 star", "3 stars"). |
| `selected` | boolean, default false | Whether this star is currently selected. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `onclick` | (event: MouseEvent) => void, optional | Click handler. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Selected star button -->
<FiveStarRatingPickerButton value={4} label="4 stars" selected={true} onclick={handleSelect} />
<!-- Disabled star button -->
<FiveStarRatingPickerButton value={1} label="1 star" disabled={true} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FiveStarRatingPickerButton from "$lib/components/FiveStarRatingPickerButton/FiveStarRatingPickerButton.svelte";
</script>

<FiveStarRatingPickerButton value={3} label="3 stars" onclick={handleSelect} />
```

## Keyboard

- Tab: Move focus to the button
- Enter: Activate the button (native button behavior)
- Space: Activate the button (native button behavior)

## Accessibility

- aria-label provides an accessible name describing the star level
- aria-pressed indicates whether the star is currently selected
- data-value exposes the rating value for consumer CSS selectors

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
