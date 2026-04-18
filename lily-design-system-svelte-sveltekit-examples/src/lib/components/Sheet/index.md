# Sheet

## Overview

A headless sliding panel overlay that appears from an edge of the viewport,
functioning as a modal dialog. Conditionally rendered based on the open state,
with Escape key to dismiss. Commonly used for navigation menus, settings panels,
detail views, or filter interfaces that slide in from the top, right, bottom, or left.

## What it does

A panel that slides in from a screen edge as an overlay.

## When to use

- Use when you need a panel that slides in from a screen edge as an overlay.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Sheet label="Settings" bind:open side="right">
  <p>Sheet content</p>
</Sheet>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the sheet dialog via aria-label. |
| `open` | boolean, default false | Whether the sheet is visible; bindable via bind:open. |
| `side` | "left" \| "right" \| "top" \| "bottom", default "right" | Which edge the sheet appears from. |
| `children` | Snippet, required | Content to render inside the sheet. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Left-side navigation sheet -->
<Sheet label="Navigation" bind:open={navOpen} side="left">
  <nav><a href="/">Home</a></nav>
</Sheet>

<!-- Bottom sheet for mobile actions -->
<Sheet label="Actions" bind:open={actionsOpen} side="bottom">
  <button>Share</button>
  <button>Delete</button>
</Sheet>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Sheet from "$lib/components/Sheet/Sheet.svelte";
</script>

<Sheet label="Settings" bind:open side="right">
  <p>Sheet content</p>
</Sheet>
```

## Keyboard

- Escape: closes the sheet by setting open to false
- Tab: moves focus between focusable elements within the sheet

## Accessibility

- role="dialog" identifies the sheet as a dialog window
- aria-label provides an accessible name for the dialog
- aria-modal="true" indicates the dialog is modal (content behind is inert)
- tabindex="-1" allows programmatic focus on the dialog container
- data-side attribute exposes the side for CSS targeting

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
