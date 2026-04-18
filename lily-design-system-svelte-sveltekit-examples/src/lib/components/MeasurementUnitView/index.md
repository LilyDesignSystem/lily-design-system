# MeasurementUnitView

## Overview

A headless display component that shows a measurement unit in a <span>
element. A measurement unit is a standard quantity used to express a
physical measurement, such as "kg", "lb", "cm", or "inch". This is a
read-only display component, part of the Input/View pattern for measurement
data.

## What it does

A read-only display of a measurement unit.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<MeasurementUnitView value="kg" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The measurement unit to display. |
| `label` | string, optional | Accessible name via aria-label for additional context. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Simple unit abbreviation display -->
<MeasurementUnitView value="kg" />

<!-- With accessible label for abbreviated unit -->
<MeasurementUnitView value="lb" label="Pounds" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MeasurementUnitView from "$lib/components/MeasurementUnitView/MeasurementUnitView.svelte";
</script>

<MeasurementUnitView value="kg" />
```

## Keyboard

- None — this is a display-only component with no interactive behavior.

## Accessibility

- aria-label optionally provides additional context beyond the displayed unit
- Text content is inherently accessible to screen readers

## Internationalization

- All text comes through the value and label props
- No hardcoded user-facing strings

## References

- HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
