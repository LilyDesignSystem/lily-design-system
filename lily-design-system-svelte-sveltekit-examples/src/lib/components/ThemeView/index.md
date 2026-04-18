# ThemeView

## Overview

A headless display component that shows the current theme name as inline
text. Renders the theme value in a <span> element with an accessible label.
Commonly paired with ThemePicker in an Input/View pattern: ThemePicker
allows selection while ThemeView displays the active theme. Useful in
settings panels, status bars, or anywhere the current theme needs to be
communicated visually and programmatically.

## What it does

A read-only display of the current theme.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<ThemeView label="Current theme" value="dark" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the display element via aria-label. |
| `value` | string, required | The current theme name to display as text content. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display active theme in a status bar -->
<ThemeView label="Active theme" value={currentTheme} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ThemeView from "$lib/components/ThemeView/ThemeView.svelte";
</script>

<ThemeView label="Current theme" value="dark" />
```

## Keyboard

- None -- passive display element with no interactive behavior

## Accessibility

- aria-label={label} provides an accessible name describing what the displayed value represents

## Internationalization

- The label prop accepts any translated string
- The value prop should contain translated theme names

## References

- WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
