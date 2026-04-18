# Badge

## Overview

A headless inline badge for displaying status indicators, counts, or
short labels. Renders as a <span role="status"> with aria-label and
data-type for consumer styling. Commonly used for notification counts,
"New" labels, status pills, and category tags.

## What it does

A small label for counts, statuses, or categories.

## When to use

- Use when you need a small label for counts, statuses, or categories.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Badge>New</Badge>
<Badge label="3 unread messages">3</Badge>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `type` | "default" \| "info" \| "success" \| "warning" \| "error", default "default" | Semantic variant exposed as data-type. |
| `label` | string, optional | Accessible label for screen readers when badge text alone is insufficient (e.g., "3 unread messages"). |
| `children` | Snippet, required | The badge content (text, number, etc.). |
| `...restProps` | additional HTML attributes spread onto <span> |  |

## Examples

```svelte
<!-- Simple text badge -->
<Badge>New</Badge>

<!-- Count badge with accessible context -->
<Badge label="3 unread messages">3</Badge>

<!-- Warning badge -->
<Badge type="warning">Alert</Badge>

<!-- Error badge with custom attributes -->
<Badge type="error" data-testid="error-badge">Failed</Badge>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Badge from "$lib/components/Badge/Badge.svelte";
</script>

<Badge>New</Badge>
<Badge label="3 unread messages">3</Badge>
```

## Keyboard

- None — badges are display-only, not interactive.

## Accessibility

- role="status" for live region semantics (screen readers announce changes)
- aria-label provides additional context beyond the visible text
- data-type exposes variant for consumer styling (not for assistive tech)

## Internationalization

- All text comes through children snippet and label prop
- No hardcoded strings

## References

- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
