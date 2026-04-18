# ToggleGroup

## Overview

A headless container for a collection of related toggle buttons. Renders a
<div> with the ARIA group role and an accessible label to semantically
associate toggle buttons. Useful for text formatting toolbars (bold, italic,
underline), view mode selectors, or any interface where multiple options can
be independently toggled on or off. Each child button should use aria-pressed
to indicate its toggle state.

## What it does

A group of toggle buttons for selecting options.

## When to use

- Use when multiple related child components should be grouped semantically.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ToggleGroup label="Text formatting">...</ToggleGroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the group via aria-label. |
| `children` | Snippet, required | Toggle button elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Text formatting toggle group -->
<ToggleGroup label="Text formatting">
  <button aria-pressed="true">Bold</button>
  <button aria-pressed="false">Italic</button>
  <button aria-pressed="false">Underline</button>
</ToggleGroup>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ToggleGroup from "$lib/components/ToggleGroup/ToggleGroup.svelte";
</script>

<ToggleGroup label="Text formatting">...</ToggleGroup>
```

## Keyboard

- None at the container level; child buttons handle Tab, Enter/Space

## Accessibility

- role="group" identifies the container as a semantic grouping
- aria-label={label} provides an accessible name describing the toggle collection

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
