# EmailLink

## Overview

Displays an email address as a clickable mailto link. When clicked, it opens
the user's default email client with the address pre-filled. Used for
displaying email addresses in profiles, contact lists, or user cards.

## What it does

A mailto hyperlink for an email address.

## When to use

- Use for navigation to another URL or in-page anchor.

## When not to use

- Do not use for in-page actions — use a `Button` instead.

## Usage

```svelte
<EmailLink email="alice@example.com" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `email` | string, required | The email address to display and link to. |
| `label` | string, default undefined | Optional accessible label override via aria-label. |
| `...restProps` | additional HTML attributes spread onto the <a> element |  |

## Examples

```svelte
<!-- Basic email display -->
<EmailLink email="alice@example.com" />

<!-- With accessible label override for additional context -->
<EmailLink email="support@example.com" label="Contact support team" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EmailLink from "$lib/components/EmailLink/EmailLink.svelte";
</script>

<EmailLink email="alice@example.com" />
```

## Keyboard

- None custom — Tab to focus, Enter to activate (native <a> link behavior)

## Accessibility

- aria-label optionally overrides the accessible name when email text alone is insufficient
- Native <a> element provides built-in link semantics

## Internationalization

- The label prop accepts any string; consumers provide localized text
- Email address display is inherently locale-independent

## References

- MDN mailto links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address
