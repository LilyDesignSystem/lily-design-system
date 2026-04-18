# VitalSignBellyCircumferenceAsCmView

## Overview

A read-only display of a belly circumference value in centimeters. This is a
passive view element used for showing vital sign readings in patient monitors,
health dashboards, medical records, and fitness applications. Screen readers
receive the full description via aria-label.

## What it does

Number display of one vital sign belly circumference in centimetres with integers.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<VitalSignBellyCircumferenceAsCmView value={90} label="90 cm belly circumference" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | number, required | Belly circumference value in centimeters to display. |
| `label` | string, required | Accessible description via aria-label. |
| `...restProps` | additional HTML attributes spread onto the outer span |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import VitalSignBellyCircumferenceAsCmView from "$lib/components/VitalSignBellyCircumferenceAsCmView/VitalSignBellyCircumferenceAsCmView.svelte";
</script>

<VitalSignBellyCircumferenceAsCmView value={90} label="90 cm belly circumference" />
```

## Keyboard

- None — this is a passive, read-only display element

## Accessibility

- role="img" on the span indicates it represents a visual/graphic element
- aria-label provides the full belly circumference description for screen readers
- data-value attribute enables consumer CSS styling based on the numeric value
