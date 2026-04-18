# Banner

## Overview

A headless banner for displaying prominent messages at the top or bottom
of an interface. Renders as a <div role="region"> with aria-live="polite"
and data-type for consumer styling. Supports optional dismiss functionality
with a close button. Commonly used for site announcements, cookie notices,
session warnings, and maintenance alerts.

## What it does

A prominent message bar across the top of a page.

## When to use

- Use for a top-of-page message that applies to the whole site or section.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Banner>Message</Banner>
<Banner dismissible closeLabel="Close" onclose={handler}>Message</Banner>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `type` | "info" \| "success" \| "warning" \| "error", default "info" | Semantic variant exposed as data-type. |
| `dismissible` | boolean, default false | Whether the banner can be dismissed. |
| `onclose` | () => void, optional | Callback when the banner is dismissed. |
| `closeLabel` | string, optional | Accessible label for the dismiss button (e.g., "Close banner" or "Dismiss"). |
| `children` | Snippet, required | The banner content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Simple info banner -->
<Banner>Important announcement here.</Banner>

<!-- Dismissible warning banner -->
<Banner type="warning" dismissible closeLabel="Dismiss"
  onclose={handleDismiss}>
  Your session will expire soon.
</Banner>

<!-- Error banner with custom attributes -->
<Banner type="error" data-testid="error-banner">
  Service unavailable. Please try again later.
</Banner>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Banner from "$lib/components/Banner/Banner.svelte";
</script>

<Banner>Message</Banner>
<Banner dismissible closeLabel="Close" onclose={handler}>Message</Banner>
```

## Keyboard

- Tab: Focus the dismiss button (when dismissible)
- Enter / Space: Activate the dismiss button

## Accessibility

- role="region" for landmark identification
- aria-live="polite" for announcing content changes
- Dismiss button has aria-label from closeLabel prop
- data-type exposes variant for consumer styling

## Internationalization

- All text comes through children snippet and closeLabel prop
- No hardcoded strings; consumer provides dismiss button label

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
