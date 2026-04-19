# Listbox

## Overview

A headless listbox that presents a list of selectable options using the ARIA
listbox role with full keyboard navigation. It renders a <div> with
role="listbox" and manages focus movement between child option elements via
arrow keys. Used when users need to select one or more items from a visible
list, such as settings panels, filter selections, or multi-select interfaces.

## What it does

A list of selectable options with keyboard navigation.

## When to use

- Use when you need a list of selectable options with keyboard navigation.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Listbox label="Fruits">
  <div role="option" tabindex="-1">Apple</div>
</Listbox>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `children` | Snippet, required | Option elements (should have role="option" and tabindex="-1"). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Basic listbox with static options -->
<Listbox label="Fruits">
  <div role="option" tabindex="-1">Apple</div>
  <div role="option" tabindex="-1">Banana</div>
</Listbox>

<!-- Listbox with dynamic selection -->
<Listbox label="Select a color">
  {#each colors as color}
    <div role="option" tabindex="-1" aria-selected={selected === color}
      onclick={() => selected = color}>{color}</div>
  {/each}
</Listbox>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Listbox from "$lib/components/Listbox/Listbox.svelte";
</script>

<Listbox label="Fruits">
  <div role="option" tabindex="-1">Apple</div>
</Listbox>
```

## Keyboard

- ArrowDown: move focus to next option, wrapping from last to first
- ArrowUp: move focus to previous option, wrapping from first to last
- Home: move focus to the first option
- End: move focus to the last option

## Accessibility

- role="listbox" identifies the container as a listbox widget
- aria-label provides an accessible name describing the listbox purpose
- Child elements should use role="option" and optionally aria-selected

## Internationalization

- The label prop accepts any translated string
- All option content comes through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
