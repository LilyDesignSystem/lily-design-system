# Emoji

## Overview

Wraps an emoji character with proper accessibility semantics so that screen
readers announce a meaningful description instead of the raw Unicode character.
Renders a <span> with role="img" and a required aria-label. Use for any emoji
that conveys meaning; decorative emoji should be hidden from assistive technology.

## What it does

A single emoji character with accessible name.

## When to use

- Use when you need a single emoji character with accessible name.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Emoji emoji="👍" label="Thumbs up" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `emoji` | string, required | The emoji character(s) to display. |
| `label` | string, required | Accessible name describing the emoji for screen readers. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Thumbs up emoji -->
<Emoji emoji="👍" label="Thumbs up" />

<!-- Warning emoji -->
<Emoji emoji="⚠️" label="Warning" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Emoji from "$lib/components/Emoji/Emoji.svelte";
</script>

<Emoji emoji="👍" label="Thumbs up" />
```

## Keyboard

- None — passive inline display element

## Accessibility

- role="img" identifies the emoji as an image for assistive technologies
- aria-label provides a textual description of the emoji character

## Internationalization

- The label prop accepts any string; consumers provide localized descriptions
- Emoji characters are locale-independent

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
