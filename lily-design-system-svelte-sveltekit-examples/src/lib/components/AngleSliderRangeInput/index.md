# AngleSliderRangeInput

## Overview

A headless slider for selecting an angle value (0–360 degrees). Built on
the native <input type="range"> with full ARIA slider semantics. Useful
for rotation controls, compass direction pickers, hue angle selectors,
or any circular/angular value input.

## What it does

A range input for selecting an angle in degrees.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<AngleSliderRangeInput label="Rotation" bind:value={angle} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | number, default 0, bindable | Current angle in degrees. |
| `min` | number, default 0 | Minimum angle. |
| `max` | number, default 360 | Maximum angle. |
| `step` | number, default 1 | Step increment. |
| `label` | string, required | Accessible label for the slider. |
| `disabled` | boolean, default false | Whether the slider is disabled. |
| `name` | string, optional | Form field name for submission. |
| `id` | string, optional | Element ID. |
| `valueTextSuffix` | string, default "°" | Suffix for aria-valuetext (e.g., "°" makes "90°" for screen readers). |
| `...restProps` | additional HTML attributes spread onto <input> |  |

## Examples

```svelte
<!-- Basic angle slider -->
<AngleSliderRangeInput label="Rotation" bind:value={angle} />

<!-- Stepped compass direction -->
<AngleSliderRangeInput label="Direction" value={90} step={15} />

<!-- Custom range with suffix -->
<AngleSliderRangeInput label="Hue" min={0} max={360}
  valueTextSuffix=" degrees" bind:value={hue} />

<!-- Disabled slider -->
<AngleSliderRangeInput label="Locked angle" value={45} disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AngleSliderRangeInput from "$lib/components/AngleSliderRangeInput/AngleSliderRangeInput.svelte";
</script>

<AngleSliderRangeInput label="Rotation" bind:value={angle} />
```

## Keyboard

- Arrow Right / Arrow Up: Increase value by step
- Arrow Left / Arrow Down: Decrease value by step
- Home: Set to min value
- End: Set to max value
- (All provided by native <input type="range"> behavior.)

## Accessibility

- Implicit slider role from <input type="range">
- aria-label provides accessible name
- aria-valuemin, aria-valuemax, aria-valuenow for range semantics
- aria-valuetext provides human-readable value (e.g., "90°")

## Internationalization

- Label text comes through the label prop
- Value text suffix (e.g., "°" or " degrees") via valueTextSuffix prop
- No hardcoded user-facing strings

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
