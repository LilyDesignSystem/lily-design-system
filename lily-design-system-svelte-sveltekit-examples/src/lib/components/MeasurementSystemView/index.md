# MeasurementSystemView

## Overview

A headless display component that shows a measurement system name in a
<span> element. A measurement system is a collection of units and rules for
measuring physical quantities, such as "metric", "imperial", or "SI". This
is a read-only display component, part of the Input/View pattern for
measurement data.

## What it does

A read-only display of a measurement system.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<MeasurementSystemView value="metric" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The measurement system name to display. |
| `label` | string, optional | Accessible name via aria-label for additional context. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Simple system name display -->
<MeasurementSystemView value="metric" />

<!-- With accessible label for abbreviated system name -->
<MeasurementSystemView value="SI" label="International System of Units" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MeasurementSystemView from "$lib/components/MeasurementSystemView/MeasurementSystemView.svelte";
</script>

<MeasurementSystemView value="metric" />
```

## Keyboard

- None — this is a display-only component with no interactive behavior.

## Accessibility

- aria-label optionally provides additional context beyond the displayed name
- Text content is inherently accessible to screen readers

## Internationalization

- All text comes through the value and label props
- No hardcoded user-facing strings

## References

- HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
