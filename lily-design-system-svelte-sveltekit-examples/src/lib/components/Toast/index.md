# Toast

## Overview

A headless notification toast that provides a brief, transient message to
the user via ARIA live regions. Uses role="status" with aria-live="polite"
by default, or role="alert" with aria-live="assertive" for urgent messages.
Toasts are typically used for success confirmations, error messages, and
informational updates without requiring user interaction.

## What it does

A brief auto-dismissing notification message.

## When to use

- Use for transient feedback that does not block the user.

## When not to use

- Do not use for critical content the user must act on — use an `AlertDialog` instead.

## Usage

```svelte
<Toast label="Success">Your changes have been saved.</Toast>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Optional accessible label via aria-label. |
| `urgent` | boolean, default false | When true, uses role="alert" and aria-live="assertive". |
| `children` | Snippet, required | The toast message content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Urgent error toast -->
<Toast label="Error" urgent>Something went wrong.</Toast>

<!-- Informational toast -->
<Toast label="Info">
  <p>3 new messages in your inbox.</p>
</Toast>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Toast from "$lib/components/Toast/Toast.svelte";
</script>

<Toast label="Success">Your changes have been saved.</Toast>
```

## Keyboard

- None -- passive notification container; announced via live regions

## Accessibility

- role="status" (default) for polite announcements at the next graceful opportunity
- role="alert" (when urgent) for immediate, time-sensitive announcements
- aria-live="polite" (default) waits for a pause before announcing
- aria-live="assertive" (when urgent) interrupts current speech
- aria-label provides optional descriptive label for the toast region

## Internationalization

- The label prop accepts any translated string
- All toast content is provided through the children snippet

## References

- WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
