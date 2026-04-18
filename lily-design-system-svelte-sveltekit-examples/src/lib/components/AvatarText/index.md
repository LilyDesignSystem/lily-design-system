# AvatarText

## Overview

The text/initials fallback within an Avatar. Renders a <span>
with aria-hidden="true" containing the initials or short text that
represents the user when no image is available. Must be used inside
an Avatar container.

## What it does

An avatar indicator inner text such as a user name.

## When to use

- Use when you need an avatar indicator inner text such as a user name.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<AvatarText>JD</AvatarText>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Initials or short text (e.g., "JD"). |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Initials fallback inside Avatar -->
<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>

<!-- Alongside an image as fallback -->
<Avatar alt="Jane Doe">
  <AvatarImage src="/photo.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AvatarText from "$lib/components/AvatarText/AvatarText.svelte";
</script>

<AvatarText>JD</AvatarText>
```

## Keyboard

- None — display-only element.

## Accessibility

- aria-hidden="true" prevents duplicate announcements since the
- parent Avatar already has aria-label

## Internationalization

- All text comes through the children snippet
- No hardcoded strings

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
