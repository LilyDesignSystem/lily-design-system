# CharacterCounter

## Overview

A headless character counter that displays real-time character count
information for a text input. Renders a <span> with role="status" and
aria-live="polite" so screen readers announce updates without interrupting
the user. Shows "count / max" when a maximum is provided, or just the count
otherwise. Used alongside text inputs with character limits such as tweets,
SMS fields, form fields, or bios.

## What it does

A counter showing remaining or used characters in a text field.

## When to use

- Use when you need a counter showing remaining or used characters in a text field.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CharacterCounter count={text.length} max={280} label="Characters" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `count` | number, default 0 | Current character count. |
| `max` | number, optional | Maximum allowed characters; enables remaining/over-limit tracking. |
| `label` | string, optional | Accessible label for the counter via aria-label. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Counter with maximum limit -->
<CharacterCounter count={text.length} max={280} label="Character count" />

<!-- Counter without maximum (just shows count) -->
<CharacterCounter count={text.length} label="Characters typed" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CharacterCounter from "$lib/components/CharacterCounter/CharacterCounter.svelte";
</script>

<CharacterCounter count={text.length} max={280} label="Characters" />
```

## Keyboard

- None — this component is a passive status display.

## Accessibility

- role="status" identifies the element as a live region for advisory information
- aria-live="polite" announces updates at the next convenient pause
- aria-label provides context for what the counter represents
- data-count, data-max, data-remaining, data-over-limit for CSS selectors

## Internationalization

- Label text comes through the label prop; no hardcoded strings
- Display format is "count / max" — consumer can override via CSS or wrapper

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
