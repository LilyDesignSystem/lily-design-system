# RedAmberGreenView

## Overview

A headless RAG (Red/Amber/Green) status view that displays a traffic-light
status value as read-only text inside a <span> element. Used to present
previously captured RAG status data in dashboards, reports, and detail views
where the status is informational rather than editable.

## What it does

A read-only display of a red/amber/green status.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<RedAmberGreenView label="Project status" value="green" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The RAG status value to display (e.g. "red", "amber", "green"). |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display a dynamic status -->
<RedAmberGreenView label="Health check" value={status} />

<!-- With extra attributes -->
<RedAmberGreenView label="Risk level" value="amber" data-testid="risk" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RedAmberGreenView from "$lib/components/RedAmberGreenView/RedAmberGreenView.svelte";
</script>

<RedAmberGreenView label="Project status" value="green" />
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
