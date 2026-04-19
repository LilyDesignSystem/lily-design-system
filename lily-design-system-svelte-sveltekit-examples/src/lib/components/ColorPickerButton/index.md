# ColorPickerButton

## Overview

A headless button representing a single predefined color choice within a color
picker interface. It renders a <button> with inline background-color styling and
communicates selected state through aria-pressed. The data-color attribute allows
consumers to target specific colors via CSS. Commonly used in color palette UIs,
theme builders, and product customization forms.

## What it does

A button showing a color swatch in a color picker.

## When to use

- Use as a single selectable option within the matching Picker.
- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<ColorPickerButton color="#ff0000" label="Red" onclick={handleSelect} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `color` | string, required | CSS color value applied as background-color and exposed via data-color. |
| `label` | string, required | Accessible name announced by screen readers (e.g., "Red", "Ocean Blue"). |
| `selected` | boolean, default false | Whether the swatch is currently selected; reflected in aria-pressed. |
| `disabled` | boolean, default false | Whether the swatch is disabled. |
| `onclick` | (event: MouseEvent) => void, default undefined | Click handler for selection. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Selected swatch -->
<ColorPickerButton color="#0066cc" label="Blue" selected={true} onclick={handleSelect} />
<!-- Disabled swatch -->
<ColorPickerButton color="#cccccc" label="Gray" disabled={true} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ColorPickerButton from "$lib/components/ColorPickerButton/ColorPickerButton.svelte";
</script>

<ColorPickerButton color="#ff0000" label="Red" onclick={handleSelect} />
```

## Keyboard

- Tab: Move focus to the swatch button
- Enter: Activate the button (native button behavior)
- Space: Activate the button (native button behavior)

## Accessibility

- aria-label provides an accessible name since the button has no visible text
- aria-pressed indicates whether the swatch is currently selected in a toggle context

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
