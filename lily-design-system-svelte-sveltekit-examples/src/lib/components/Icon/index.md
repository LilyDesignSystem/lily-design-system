# Icon

## Overview

An icon wrapper that provides proper accessibility semantics for icon content.
Supports both meaningful icons (with accessible labels announced by screen readers)
and decorative icons (hidden from assistive technology). The consumer provides the
actual icon content (text characters, SVG, or any markup) as children.

## What it does

A container for displaying an icon.

## When to use

- Use when you need a container for displaying an icon.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Icon label="Close">x</Icon>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Accessible name for meaningful icons via aria-label. |
| `decorative` | boolean, default false | When true, hides the icon from assistive technology. |
| `children` | Snippet, required | The icon content (text, SVG, or other markup). |
| `...restProps` | additional HTML attributes spread onto the span element |  |

## Examples

```svelte
<!-- Meaningful icon with accessible label -->
<Icon label="Close">x</Icon>

<!-- Decorative icon hidden from screen readers -->
<Icon decorative>*</Icon>

<!-- Icon with custom data attribute -->
<Icon label="Search" data-testid="search-icon">Q</Icon>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Icon from "$lib/components/Icon/Icon.svelte";
</script>

<Icon label="Close">x</Icon>
```

## Keyboard

- None — this is a passive container; keyboard behavior depends on the parent interactive element

## Accessibility

- role="img" applied to meaningful icons so assistive technology treats the span as an image
- aria-label provides the accessible name for meaningful icons
- aria-hidden="true" applied when decorative is true, hiding the icon from the accessibility tree
- When decorative is true, role is omitted entirely

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- WAI-ARIA Images Tutorial: https://www.w3.org/WAI/tutorials/images/decorative/
