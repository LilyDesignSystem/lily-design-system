# ThemeSelectOption

## Overview

A single <option> element for use inside a ThemeSelect dropdown. Renders a
native <option> with a theme value and label text. Supports selected and
disabled states via native HTML attributes. Used as a compound child of
ThemeSelect to define available theme choices such as light, dark, or
high-contrast modes.

## What it does

One option in a theme select dropdown.

## When to use

- Use when you need one option in a theme select dropdown.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ThemeSelectOption value="dark">Dark</ThemeSelectOption>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The theme identifier submitted when selected. |
| `selected` | boolean, default false | Whether this option is pre-selected. |
| `disabled` | boolean, default false | Whether this option is disabled. |
| `children` | Snippet, required | The visible label text for the theme option. |
| `...restProps` | additional HTML attributes spread onto the <option> |  |

## Examples

```svelte
<!-- Theme options inside a ThemeSelect -->
<ThemeSelect label="Theme" bind:value={theme}>
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
  import ThemeSelectOption from "$lib/components/ThemeSelectOption/ThemeSelectOption.svelte";
</script>

<ThemeSelectOption value="dark">Dark</ThemeSelectOption>
```

## Keyboard

- None directly — keyboard behavior is managed by the parent <select> element
- (Up/Down arrows, Home/End, type-ahead search).

## Accessibility

- Native <option> element provides built-in accessibility via the parent <select>
- Screen readers announce the option text and selected state automatically

## Internationalization

- Option label text comes through the children snippet
- No hardcoded user-facing strings

## References

- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
