# Popover

## Overview

A headless conditional dialog overlay that displays contextual information or
actions near the element that triggered it. It renders a <div> with role="dialog"
only when the open state is true, using $bindable() for two-way binding of
visibility. Unlike tooltips, popovers can contain rich interactive content such
as forms, buttons, or other controls. Commonly used for contextual menus,
information panels, and inline editing.

## What it does

A floating content box anchored to a trigger element.

## When to use

- Use for supplemental, on-demand information tied to a trigger element.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Popover label="Info" bind:open>{children}</Popover>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the popover dialog via aria-label. |
| `open` | boolean, default false, bindable | Controls whether the popover is visible. |
| `children` | Snippet, required | The popover content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Popover with toggle trigger -->
<button onclick={() => showPopover = !showPopover}>Toggle info</button>
<Popover label="Additional information" bind:open={showPopover}>
  <p>Here is some contextual information.</p>
  <button onclick={() => showPopover = false}>Close</button>
</Popover>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Popover from "$lib/components/Popover/Popover.svelte";
</script>

<Popover label="Info" bind:open>{children}</Popover>
```

## Keyboard

- Escape: consumer should implement closing the popover by setting open to false
- Tab: consumer should consider trapping focus within the popover when open

## Accessibility

- role="dialog" identifies the popover as a dialog overlay
- aria-label provides the accessible name for the dialog
- Conditionally rendered; not in the DOM when closed

## Internationalization

- The label prop is the only text; all content comes through children
- No hardcoded user-facing strings

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
