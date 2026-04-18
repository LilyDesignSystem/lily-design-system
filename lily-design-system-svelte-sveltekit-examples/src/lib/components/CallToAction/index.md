# CallToAction

## Overview

A headless call-to-action (CTA) component that prompts users to take a
specific action. Renders as an <a> element when href is provided (for
navigation CTAs like "Sign Up") or a <button> when no href is given (for
action CTAs like "Get Started"). This dual-mode approach ensures correct
semantic HTML for accessibility and SEO.

## What it does

A prominent prompt encouraging user action.

## When to use

- Use when you need a prominent prompt encouraging user action.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CallToAction href="/signup">Sign Up Now</CallToAction>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `href` | string, optional | If provided, renders as a link; otherwise renders as a button. |
| `label` | string, optional | Accessible label override via aria-label. |
| `disabled` | boolean, default false | Disables the button (button mode only). |
| `onclick` | (event: MouseEvent) => void, optional | Click handler (button mode). |
| `children` | Snippet, required | The CTA content. |
| `...restProps` | additional HTML attributes spread onto the <a> or <button> |  |

## Examples

```svelte
<!-- Navigation CTA (renders as <a>) -->
<CallToAction href="/signup">Sign Up Now</CallToAction>

<!-- Action CTA (renders as <button>) -->
<CallToAction onclick={handleAction}>Get Started</CallToAction>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CallToAction from "$lib/components/CallToAction/CallToAction.svelte";
</script>

<CallToAction href="/signup">Sign Up Now</CallToAction>
```

## Keyboard

- Tab: Focus the element
- Enter: Activate the link or button
- Space: Activate the button (button mode only; links do not respond to Space)

## Accessibility

- Implicit link role when rendered as <a>
- Implicit button role when rendered as <button>
- Optional aria-label for screen reader text override
- disabled only applies in button mode (links cannot be disabled natively)

## Internationalization

- CTA text comes through children snippet; no hardcoded strings
- Label override comes through label prop

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
- WAI-ARIA Link Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/link/
