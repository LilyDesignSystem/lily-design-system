# AvatarImage

## Overview

The image element within an Avatar. Renders a native <img> element
for displaying a user's profile photo. Must be used inside an Avatar
container.

## What it does

An avatar indicator inside image such as a user photo.

## When to use

- Use when you need an avatar indicator inside image such as a user photo.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<AvatarImage src="/photo.jpg" alt="Jane Doe" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `src` | string, required | URL of the avatar image. |
| `alt` | string, required | Accessible description for the image. |
| `...restProps` | additional HTML attributes spread onto the <img> |  |

## Examples

```svelte
<!-- Photo avatar inside Avatar -->
<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
</Avatar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AvatarImage from "$lib/components/AvatarImage/AvatarImage.svelte";
</script>

<AvatarImage src="/photo.jpg" alt="Jane Doe" />
```

## Keyboard

- None — display-only element.

## Accessibility

- Native <img> with alt text provides image accessibility
- aria-hidden="true" prevents duplicate announcements since the
- parent Avatar already has aria-label

## Internationalization

- alt text comes through props
- No hardcoded strings

## References

- HTML img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
