# MeasurementInstanceView

## Overview

A headless display component that shows a specific measurement instance
value in a <span> element. A measurement instance is a concrete data point
such as "72 kg", "98.6 F", or "120/80 mmHg". This is a read-only display
component, part of the Input/View pattern for measurement data.

## What it does

A read-only display of a measurement value and unit.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<MeasurementInstanceView value="72 kg" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The measurement instance value to display. |
| `label` | string, optional | Accessible name via aria-label for additional context. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Simple measurement display -->
<MeasurementInstanceView value="72 kg" />

<!-- With accessible label for screen reader context -->
<MeasurementInstanceView value="98.6 F" label="Body temperature" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MeasurementInstanceView from "$lib/components/MeasurementInstanceView/MeasurementInstanceView.svelte";
</script>

<MeasurementInstanceView value="72 kg" />
```

## Keyboard

- None — this is a display-only component with no interactive behavior.

## Accessibility

- aria-label optionally provides additional context beyond the displayed value
- Text content is inherently accessible to screen readers

## Internationalization

- All text comes through the value and label props
- No hardcoded user-facing strings

## References

- HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
