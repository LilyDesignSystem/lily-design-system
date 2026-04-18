# ColorInput

## Overview

A headless color input wrapping the native HTML <input type="color"> element.
It provides a browser-native color picker with accessible labelling via aria-label.
The value is always a hex color string (e.g., "#ff0000"). Useful in settings panels,
theme editors, or any interface where users need to select a color.

## What it does

An input for selecting a color value <input type="color">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<ColorInput label="Background color" bind:value={color} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, default "#000000" | Current hex color string; bindable via bind:value. |
| `label` | string, required | Accessible name via aria-label. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `name` | string, default undefined | Form field name. |
| `id` | string, default undefined | Element ID. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Disabled color input with form name -->
<ColorInput label="Text color" bind:value={textColor} disabled name="text_color" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ColorInput from "$lib/components/ColorInput/ColorInput.svelte";
</script>

<ColorInput label="Background color" bind:value={color} />
```

## Keyboard

- None — keyboard behavior is provided by the browser-native color input

## Accessibility

- aria-label provides an accessible name since native color inputs have no visible label

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- MDN <input type="color">: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
