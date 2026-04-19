# AccordionNav

## Overview

A headless navigation container for an accordion, rendered as a <nav>
element with an accessible label. Serves as the outermost wrapper for
collapsible accordion content. Contains an AccordionList which holds
AccordionListItem children. Commonly used for FAQs, settings panels,
filter groups, and mobile navigation menus.

## What it does

An accordion navigation area for collapsible accordion information.

## When to use

- Use to mark a region as primary navigation (landmark).

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<AccordionNav label="FAQ">
  <AccordionList>...</AccordionList>
</AccordionNav>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `children` | Snippet, required | AccordionList element. |
| `...restProps` | additional HTML attributes spread onto the <nav> |  |

## Examples

```svelte
<!-- FAQ accordion -->
<AccordionNav label="Frequently Asked Questions">
  <AccordionList>
    <AccordionListItem>
      <summary>What is this?</summary>
      <p>A design system.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AccordionNav from "$lib/components/AccordionNav/AccordionNav.svelte";
</script>

<AccordionNav label="FAQ">
  <AccordionList>...</AccordionList>
</AccordionNav>
```

## Keyboard

- None — this is a passive container. Keyboard interactions
- are handled by AccordionListItem children (Enter/Space to toggle).

## Accessibility

- <nav> element provides navigation landmark semantics
- aria-label provides the accessible name for screen readers

## Internationalization

- The label prop is the only user-facing string
- No hardcoded text; all content comes through props and children

## References

- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
