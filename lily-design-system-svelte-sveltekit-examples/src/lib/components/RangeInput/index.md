# RangeInput

## Overview

A headless slider control using the native <input type="range"> element for
selecting a numeric value within a defined range. It renders a draggable track
and handle with configurable minimum, maximum, and step values, and provides a
bindable value prop for two-way data binding. Commonly used for volume controls,
brightness settings, price filters, and continuous numeric spectrum selections.

## What it does

A slider input for selecting a value within a range <input type="range">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<RangeInput label="Volume" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | number, default 50 | Current numeric value; bindable with bind:value. |
| `min` | number, default 0 | Minimum allowed value. |
| `max` | number, default 100 | Maximum allowed value. |
| `step` | number, default 1 | Increment between selectable values. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Volume slider -->
<RangeInput label="Volume" bind:value min={0} max={100} />

<!-- Price range with step -->
<RangeInput label="Price range" bind:value={price} min={10} max={500} step={10} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RangeInput from "$lib/components/RangeInput/RangeInput.svelte";
</script>

<RangeInput label="Volume" bind:value />
```

## Keyboard

- Left Arrow / Down Arrow: decrease value by one step
- Right Arrow / Up Arrow: increase value by one step
- Home: set to minimum value
- End: set to maximum value
- Page Down: decrease by a larger step (browser-defined)
- Page Up: increase by a larger step (browser-defined)

## Accessibility

- aria-label provides the accessible name since no visible <label> is associated
- Native <input type="range"> provides implicit slider role and value announcements

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
