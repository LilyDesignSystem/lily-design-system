# ColorPicker

## Overview

A headless 2D area selector for choosing colors by saturation (X axis, 0-100)
and brightness (Y axis, 0-100). Users navigate the board with keyboard arrow
keys, with Shift held for larger steps (10 instead of 1). The component exposes
data-x and data-y attributes for CSS-based cursor positioning. Useful for
advanced color pickers requiring fine-grained 2D color property selection.

## What it does

A two-dimensional board for picking colors by hue and saturation.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<ColorPicker label="Color saturation and brightness" bind:x bind:y />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `x` | number, default 0 | Horizontal position (0-100, saturation); bindable via bind:x. |
| `y` | number, default 0 | Vertical position (0-100, brightness); bindable via bind:y. |
| `label` | string, required | Accessible name via aria-label. |
| `disabled` | boolean, default false | Whether the control is disabled. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Disabled board with initial position -->
<ColorPicker label="Select color" bind:x bind:y disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker/ColorPicker.svelte";
</script>

<ColorPicker label="Color saturation and brightness" bind:x bind:y />
```

## Keyboard

- ArrowRight: Increase X by 1 (Shift: by 10)
- ArrowLeft: Decrease X by 1 (Shift: by 10)
- ArrowUp: Decrease Y by 1 (Shift: by 10)
- ArrowDown: Increase Y by 1 (Shift: by 10)
- Home: Set X to 0
- End: Set X to 100

## Accessibility

- role="slider" identifies the element as a slider control
- aria-label provides an accessible name
- aria-valuenow reflects the current X value (0-100)
- aria-valuemin="0" and aria-valuemax="100" define the range
- aria-disabled is set when the control is disabled

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
