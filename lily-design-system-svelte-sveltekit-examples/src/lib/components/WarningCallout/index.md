# WarningCallout

## Overview

A headless warning container that renders an <aside> element with
role="alert" for immediate screen reader announcements. Used to draw
attention to important alerts, potential issues, or critical information
that requires user attention. The role="alert" implicitly sets
aria-live="assertive", meaning content is announced immediately when
it appears or changes.

## What it does

A callout box highlighting a warning message.

## When to use

- Use when you need a callout box highlighting a warning message.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<WarningCallout label="Warning">...</WarningCallout>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Optional accessible name via aria-label. |
| `children` | Snippet, required | The warning content to display. |
| `...restProps` | additional HTML attributes spread onto the <aside> |  |

## Examples

```svelte
<!-- Warning with accessible label -->
<WarningCallout label="Warning">
  <p>Your session is about to expire.</p>
</WarningCallout>

<!-- Warning without label (alert content is self-descriptive) -->
<WarningCallout>
  <p>Unsaved changes will be lost.</p>
</WarningCallout>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import WarningCallout from "$lib/components/WarningCallout/WarningCallout.svelte";
</script>

<WarningCallout label="Warning">...</WarningCallout>
```

## Keyboard

- None -- passive container for alert content

## Accessibility

- role="alert" causes screen readers to announce content immediately
- aria-label provides an optional accessible name to distinguish multiple alerts

## Internationalization

- The label prop accepts any translated string
- All warning content is provided through the children snippet

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
