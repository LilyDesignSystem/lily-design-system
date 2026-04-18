# Alert

## Overview

A headless alert for displaying important messages to the user, such as
warnings, errors, confirmations, or status updates. Renders a <div> with
ARIA live region attributes so screen readers announce content automatically.

Supports severity types (info, success, warning, error) exposed via a
data-type attribute for consumer CSS styling. An optional heading is
rendered with <strong> emphasis without assuming a heading level.

## What it does

A status message for important information or feedback.

## When to use

- Use to announce important information to the user immediately.

## When not to use

- Do not use for non-urgent passive messages — use a `Notification` or status text instead.

## Usage

```svelte
<Alert>Message</Alert>
<Alert type="error" heading="Error">Details here.</Alert>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `type` | "info" \| "success" \| "warning" \| "error", default "info" | Severity type exposed as data-type attribute. |
| `heading` | string, optional | Heading text rendered as <p><strong>. |
| `role` | "alert" \| "status", default "alert" | ARIA role: "alert" for assertive (immediate), "status" for polite. |
| `live` | "assertive" \| "polite" \| "off", optional | Overrides the default aria-live value derived from the role. |
| `children` | Snippet, required | The alert content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Simple info alert (default) -->
<Alert>Something happened.</Alert>

<!-- Error alert with heading -->
<Alert type="error" heading="Error">Something went wrong.</Alert>

<!-- Success notification -->
<Alert type="success" heading="Saved">Your changes were saved.</Alert>

<!-- Polite status message -->
<Alert role="status">Loading complete.</Alert>

<!-- Warning with custom attributes -->
<Alert type="warning" data-testid="warn-alert">Check your input.</Alert>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Alert from "$lib/components/Alert/Alert.svelte";
</script>

<Alert>Message</Alert>
<Alert type="error" heading="Error">Details here.</Alert>
```

## Keyboard

- None — alerts are passive announcements, not interactive.

## Accessibility

- role="alert" with aria-live="assertive" for immediate announcements
- role="status" with aria-live="polite" for less urgent messages
- aria-atomic="true" ensures the entire region is re-read on change
- data-type exposes severity for consumer styling (not for assistive tech)

## Internationalization

- All text comes through children snippet and heading prop
- No hardcoded strings

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
