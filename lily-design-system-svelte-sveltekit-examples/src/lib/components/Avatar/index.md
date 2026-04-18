# Avatar

## Overview

A headless avatar container that displays a user's identity. Renders as
a <span role="img"> with an accessible label. The consumer provides
AvatarImage and/or AvatarText children to control the
avatar content. Commonly used in user profiles, comment threads,
contact lists, and messaging interfaces.

## What it does

An avatar indicator that shows an avatar image or avatar text.

## When to use

- Use when you need an avatar indicator that shows an avatar image or avatar text.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Avatar alt="Jane Doe">...</Avatar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `alt` | string, required | Accessible description of the person via aria-label. |
| `children` | Snippet, required | AvatarImage and/or AvatarText elements. |
| `...restProps` | additional HTML attributes spread onto the outer <span> |  |

## Examples

```svelte
<!-- Image avatar -->
<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
</Avatar>

<!-- Initials avatar -->
<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>

<!-- Image with initials fallback -->
<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Avatar from "$lib/components/Avatar/Avatar.svelte";
</script>

<Avatar alt="Jane Doe">...</Avatar>
```

## Keyboard

- None — this is a display-only element, not interactive.

## Accessibility

- role="img" on the outer <span> for assistive technologies
- aria-label provides the accessible name (the person's name)

## Internationalization

- alt comes through props
- No hardcoded strings

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
