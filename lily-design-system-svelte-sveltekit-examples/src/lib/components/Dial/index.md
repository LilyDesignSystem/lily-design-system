# Dial

## Overview

A circular dial or knob control for adjusting a numeric value within a
defined range. Renders as a div with role="slider" and full keyboard
navigation. Common use cases include volume controls, thermostats, and
audio equipment settings in control panels and configuration interfaces.

## What it does

A rotary dial control for selecting a value.

## When to use

- Use when you need a rotary dial control for selecting a value.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Dial label="Volume" bind:value min={0} max={100} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | number, default 0 | Current dial value; bindable. |
| `min` | number, default 0 | Minimum allowed value. |
| `max` | number, default 100 | Maximum allowed value. |
| `step` | number, default 1 | Increment per key press. |
| `label` | string, required | Accessible name for the dial. |
| `disabled` | boolean, default false | Whether the dial is disabled. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Brightness dial with step of 5 -->
<Dial label="Brightness" bind:value={brightness} min={0} max={100} step={5} />

<!-- Disabled dial -->
<Dial label="Disabled control" value={30} disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Dial from "$lib/components/Dial/Dial.svelte";
</script>

<Dial label="Volume" bind:value min={0} max={100} />
```

## Keyboard

- ArrowRight/ArrowUp: increase value by one step
- ArrowLeft/ArrowDown: decrease value by one step
- Shift+Arrow: increase/decrease value by 10 steps
- Home: set value to minimum
- End: set value to maximum

## Accessibility

- role="slider" indicates a range input control
- aria-label provides the accessible name
- aria-valuenow, aria-valuemin, aria-valuemax communicate current range state
- aria-disabled="true" present only when disabled
- tabindex="0" when enabled, tabindex="-1" when disabled

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
- WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider
