# Footer

## Overview

A semantic page footer landmark located at the bottom of a web page or section,
typically used to provide secondary navigation, legal information, contact details,
and links to important but less prominent content like privacy policies, terms of
service, or social media profiles. Uses the native <footer> element.

## What it does

A page or section footer area.

## When to use

- Use when you need a page or section footer area.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Footer label="Site footer">{children}</Footer>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Optional accessible name via aria-label, useful when multiple footers exist. |
| `children` | Snippet, required | Footer content. |
| `...restProps` | additional HTML attributes spread onto the footer element |  |

## Examples

```svelte
<!-- Page footer with copyright -->
<Footer label="Site footer">
  <p>Copyright 2024</p>
</Footer>

<!-- Footer with navigation links -->
<Footer>
  <nav aria-label="Footer navigation">
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</Footer>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Footer from "$lib/components/Footer/Footer.svelte";
</script>

<Footer label="Site footer">{children}</Footer>
```

## Keyboard

- None — this is a passive container; keyboard interactions are determined by child elements

## Accessibility

- The <footer> element provides the contentinfo landmark role natively
- aria-label optionally distinguishes this footer from others on the page
- Screen reader users can navigate directly to the footer via landmark navigation

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings
- All content comes through the children snippet

## References

- MDN footer element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer
