# ThemePicker

## Overview

A headless theme picker that renders a <fieldset> with the radiogroup role,
providing an accessible container for radio button options to select between
themes such as light, dark, or system preference. Useful for settings pages,
preference panels, or any interface where users need to select from a set of
theme options. Consumers provide the radio button markup as children.

## What it does

A picker for selecting a visual theme.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<ThemePicker label="Theme">...</ThemePicker>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the radio group via aria-label. |
| `children` | Snippet, required | Radio button option elements. |
| `...restProps` | additional HTML attributes spread onto the <fieldset> |  |

## Examples

```svelte
<!-- Theme picker with radio options -->
<ThemePicker label="Theme">
  <label><input type="radio" name="theme" value="light" /> Light</label>
  <label><input type="radio" name="theme" value="dark" /> Dark</label>
  <label><input type="radio" name="theme" value="system" /> System</label>
</ThemePicker>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ThemePicker from "$lib/components/ThemePicker/ThemePicker.svelte";
</script>

<ThemePicker label="Theme">...</ThemePicker>
```

## Keyboard

- Arrow keys: navigate between radio options (native radio behavior)
- Space: select the focused radio option (native radio behavior)

## Accessibility

- role="radiogroup" identifies the fieldset as a group of related radio buttons
- aria-label={label} provides an accessible name describing the theme selection

## Internationalization

- The label prop accepts any translated string
- Radio option labels are consumer-provided and can be localized

## References

- WAI-ARIA radiogroup role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
