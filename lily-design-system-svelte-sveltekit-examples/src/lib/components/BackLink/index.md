# BackLink

## Overview

A headless navigation link for returning to a previous page or step.
Renders as a semantic <a> element with optional aria-label override.
Inspired by the GOV.UK back link pattern. Commonly placed at the top of
a page to let users return to the previous step in a multi-step flow,
or navigate up to a parent page.

## What it does

A navigation link to return to a previous page.

## When to use

- Use for navigation to another URL or in-page anchor.

## When not to use

- Do not use for in-page actions — use a `Button` instead.

## Usage

```svelte
<BackLink href="/previous">Back</BackLink>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `href` | string, required | The URL to navigate back to. |
| `label` | string, optional | Accessible label override via aria-label, for when visible link text is insufficient for screen readers. |
| `children` | Snippet, required | The link content (text or mixed content). |
| `...restProps` | additional HTML attributes spread onto <a> |  |

## Examples

```svelte
<!-- Basic back link -->
<BackLink href="/previous-page">Back to previous page</BackLink>

<!-- With accessible label override -->
<BackLink href="/dashboard" label="Return to dashboard">Back</BackLink>

<!-- In a multi-step form -->
<BackLink href="/step-2" data-step="3">Go back</BackLink>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import BackLink from "$lib/components/BackLink/BackLink.svelte";
</script>

<BackLink href="/previous">Back</BackLink>
```

## Keyboard

- Tab: Focus the link (native browser behavior)
- Enter: Activate the link (native browser behavior)

## Accessibility

- Implicit link role from the <a> element
- aria-label provides screen reader override when visible text is brief
- Place at the top of the page, before the main heading

## Internationalization

- Link text comes through children snippet
- Label override comes through label prop
- No hardcoded strings

## References

- GOV.UK back link pattern: https://design-system.service.gov.uk/components/back-link/
