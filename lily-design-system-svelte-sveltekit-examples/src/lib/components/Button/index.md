# Button

## Overview

A headless button for triggering actions, built on the native HTML <button>
element for inherent accessibility and keyboard support. Supports action
buttons, submit/reset buttons, and toggle buttons via the pressed prop.
Commonly used for form submissions, dialogs, menus, and toolbar actions.

## What it does

A generic clickable button element.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<Button onclick={handleClick}>Click me</Button>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `type` | "button" \| "submit" \| "reset", default "button" | HTML button type. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `pressed` | boolean \| undefined, default undefined | Toggle button state; when provided, aria-pressed is rendered. |
| `label` | string, optional | Accessible label override via aria-label. |
| `onclick` | (event: MouseEvent) => void, optional | Click event handler. |
| `children` | Snippet, required | The button content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Submit button in a form -->
<Button type="submit" disabled={isSubmitting}>Submit</Button>

<!-- Toggle button with pressed state -->
<Button pressed={isBold} onclick={() => isBold = !isBold}>Bold</Button>

<!-- Button with accessible label override -->
<Button label="Close dialog" onclick={handleClose}>X</Button>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Button from "$lib/components/Button/Button.svelte";
</script>

<Button onclick={handleClick}>Click me</Button>
```

## Keyboard

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button

## Accessibility

- Implicit button role from <button> element
- aria-pressed for toggle button state (only when pressed prop is provided)
- aria-label for screen reader text override
- Native disabled attribute prevents clicks and signals aria-disabled

## Internationalization

- Button text comes through children snippet; no hardcoded strings
- Label override comes through label prop

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
