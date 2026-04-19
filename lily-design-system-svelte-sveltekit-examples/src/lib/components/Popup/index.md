# Popup

## Overview

A headless conditional overlay dialog that temporarily appears over the main
content to convey information, prompt user actions, or display additional
options. It renders a <div> with role="dialog" only when the open state is
true. Similar to Popover but designed as a general-purpose overlay dialog.
Commonly used for confirmations, prompts, contextual actions, and inline forms.

## What it does

A temporary overlay that appears above page content.

## When to use

- Use when you need a temporary overlay that appears above page content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Popup label="Info" bind:open>{children}</Popup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the popup dialog via aria-label. |
| `open` | boolean, default false, bindable | Controls whether the popup is visible. |
| `children` | Snippet, required | Content rendered inside the dialog. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Confirmation popup -->
<button onclick={() => showPopup = !showPopup}>Open popup</button>
<Popup label="Confirmation" bind:open={showPopup}>
  <p>Are you sure you want to proceed?</p>
  <button onclick={() => showPopup = false}>Yes</button>
  <button onclick={() => showPopup = false}>No</button>
</Popup>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Popup from "$lib/components/Popup/Popup.svelte";
</script>

<Popup label="Info" bind:open>{children}</Popup>
```

## Keyboard

- Escape: consumer should implement closing the popup by setting open to false
- Tab: consumer should consider trapping focus within the popup when open

## Accessibility

- role="dialog" identifies the popup as a dialog overlay
- aria-label provides the accessible name for the dialog
- Conditionally rendered; not in the DOM when closed

## Internationalization

- The label prop is the only text; all content comes through children
- No hardcoded user-facing strings

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
