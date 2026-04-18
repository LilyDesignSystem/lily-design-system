# RedOrangeYellowGreenBlueView

## Overview

A headless ROYGB (Red/Orange/Yellow/Green/Blue) status view that displays
a five-level color-coded status value as read-only text inside a <span>.
Used to present previously captured ROYGB status data in dashboards, reports,
or detail views where the five-level scale offers more granularity than RAG.

## What it does

A read-only display of a five-level color status.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<RedOrangeYellowGreenBlueView label="Risk level" value="yellow" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The ROYGB status to display (e.g. "red", "orange", "yellow", "green", "blue"). |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display a dynamic status -->
<RedOrangeYellowGreenBlueView label="Alert status" value={level} />

<!-- With extra attributes for testing -->
<RedOrangeYellowGreenBlueView label="System health" value="blue" data-testid="health" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RedOrangeYellowGreenBlueView from "$lib/components/RedOrangeYellowGreenBlueView/RedOrangeYellowGreenBlueView.svelte";
</script>

<RedOrangeYellowGreenBlueView label="Risk level" value="yellow" />
```

## Keyboard

- None — this is a passive informational display, not an interactive element.

## Accessibility

- aria-label on the <span> for screen reader context
- Screen readers announce the label and displayed status value
- WCAG 2.2 AAA: properly labeled for assistive technology

## Internationalization

- The label prop externalizes the accessible label string
- The value is displayed as-is, allowing localized status names

## References

- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
