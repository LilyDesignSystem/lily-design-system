# Separator

## Overview

A headless visual and semantic divider that renders an <hr> element with
an explicit role="separator". Used between sections of a page, groups of
menu items, or distinct areas of a form to organize content into logical
groups and improve visual hierarchy.

## What it does

A horizontal or vertical divider between content sections.

## When to use

- Use when you need a horizontal or vertical divider between content sections.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Separator />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Optional accessible label describing the separation. |
| `...restProps` | additional HTML attributes spread onto the <hr> |  |

## Examples

```svelte
<!-- Labeled separator between sections -->
<Separator label="End of introduction" />

<!-- With custom data attribute -->
<Separator label="Section break" data-section="divider" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Separator from "$lib/components/Separator/Separator.svelte";
</script>

<Separator />
```

## Keyboard

- None — the <hr> element is not focusable and does not receive keyboard input.

## Accessibility

- role="separator" explicitly identifies the element as a section divider
- aria-label provides optional descriptive context for screen readers

## Internationalization

- The optional label prop externalizes the separator description for localization

## References

- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
- MDN hr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
