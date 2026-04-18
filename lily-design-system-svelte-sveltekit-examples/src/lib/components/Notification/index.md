# Notification

## Overview

A headless notification/toast message that delivers timely messages to users
about events, updates, or actions. It renders a <div> with ARIA live region
semantics, using role="status" with aria-live="polite" by default, or
role="alert" with aria-live="assertive" when urgent. Commonly used for
success confirmations, error alerts, and informational updates.

## What it does

A brief message about an event or update.

## When to use

- Use for transient feedback that does not block the user.

## When not to use

- Do not use for critical content the user must act on — use an `AlertDialog` instead.

## Usage

```svelte
<Notification label="Success">Message here.</Notification>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, optional | Accessible name for the notification region via aria-label. |
| `urgent` | boolean, default false | When true, uses role="alert" and aria-live="assertive". |
| `children` | Snippet, required | The notification message content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Non-urgent notification with polite announcement -->
<Notification label="Success">Your changes have been saved.</Notification>

<!-- Urgent notification that interrupts immediately -->
<Notification label="Error" urgent>Something went wrong. Please try again.</Notification>

<!-- Notification without explicit label -->
<Notification>3 new messages</Notification>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Notification from "$lib/components/Notification/Notification.svelte";
</script>

<Notification label="Success">Message here.</Notification>
```

## Keyboard

- None — this is a passive announcement container; screen readers announce
- content automatically via ARIA live regions without user interaction.

## Accessibility

- role="status" (default) for polite, non-urgent announcements
- role="alert" (when urgent) for assertive, immediate announcements
- aria-label provides an accessible name for the notification region
- aria-live="polite" (default) waits for user idle before announcing
- aria-live="assertive" (when urgent) interrupts the user immediately

## Internationalization

- All text content comes through the children snippet and label prop
- No hardcoded user-facing strings

## References

- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/WAI/ARIA/apd/practices/live-regions/
