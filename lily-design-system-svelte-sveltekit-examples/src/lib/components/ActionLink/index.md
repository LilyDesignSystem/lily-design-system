# ActionLink

## Overview

A headless action link that renders a semantic <a> element for prominent
navigation actions. Inspired by the NHS England action link pattern.
Use when you want to draw attention to a key navigational step, such as
"Continue to next step", "Find a service near you", or "Start application",
distinguishing these from standard inline text links.

## What it does

A hyperlink styled as an action trigger.

## When to use

- Use for navigation to another URL or in-page anchor.

## When not to use

- Do not use for in-page actions — use a `Button` instead.

## Usage

```svelte
<ActionLink href="/path">Link text</ActionLink>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `href` | string, required | The URL the link points to. |
| `label` | string, optional | Accessible label override via aria-label for when visible link text is insufficient for screen readers. |
| `children` | Snippet, required | The link content (text or mixed content). |
| `...restProps` | additional HTML anchor attributes spread onto <a> |  |

## Examples

```svelte
<!-- Basic action link -->
<ActionLink href="/next-step">Continue to next step</ActionLink>

<!-- With accessible label override -->
<ActionLink href="/find" label="Find a GP surgery near you">
  Find a GP
</ActionLink>

<!-- With custom attributes -->
<ActionLink href="/apply" data-track="apply-cta">
  Start your application
</ActionLink>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ActionLink from "$lib/components/ActionLink/ActionLink.svelte";
</script>

<ActionLink href="/path">Link text</ActionLink>
```

## Keyboard

- Tab: Focus the link (native browser behavior)
- Enter: Activate the link (native browser behavior)

## Accessibility

- Implicit link role from the <a> element
- aria-label provides screen reader override when link text is insufficient
- Ensure link text clearly describes the destination or action

## Internationalization

- All text content comes through children snippet and label prop
- No hardcoded strings

## References

- NHS England action link pattern
- WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link
