# ThemeSelect

## Overview

A headless theme selection control that renders a native <select> dropdown
for choosing between visual themes or color schemes. Commonly used for
light, dark, high-contrast, or system-default theme options. The consumer
provides <option> elements as children and is responsible for applying the
selected theme value to the page.

## What it does

A select dropdown for choosing a theme.

## When to use

- Use when you need a select dropdown for choosing a theme.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ThemeSelect label="Theme" bind:value>...</ThemeSelect>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable selected theme; supports bind:value. |
| `children` | Snippet, required | ThemeSelectOption elements representing available themes. |
| `...restProps` | additional HTML attributes spread onto the <select> |  |

## Examples

```svelte
<!-- theme select with multiple schemes -->
<ThemeSelect label="Color scheme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
  <ThemeSelectOption value="system">System Default</ThemeSelectOption>
</ThemeSelect>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ThemeSelect from "$lib/components/ThemeSelect/ThemeSelect.svelte";
</script>

<ThemeSelect label="Theme" bind:value>...</ThemeSelect>
```

## Keyboard

- Tab: moves focus to the select element (native behavior)
- Space/Enter: opens the dropdown (native behavior)
- ArrowUp/ArrowDown: navigates through options (native behavior)
- Escape: closes the dropdown (native behavior)

## Accessibility

- aria-label={label} provides an accessible name since no visible <label> is included

## Internationalization

- The label prop accepts any translated string
- Option text is consumer-provided and can be localized

## References

- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- WCAG 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
