# InsetText

## Overview

An inset text block used to distinguish content from the surrounding text, drawing
attention to important information that a user needs to know. Commonly used in
government and institutional design systems to highlight supplementary information,
processing times, eligibility criteria, or important notices. Renders a <div> with
role="note" for semantic supplementary content indication.

## What it does

Indented text to distinguish it from surrounding content.

## When to use

- Use when you need indented text to distinguish it from surrounding content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<InsetText>It can take up to 8 weeks to process.</InsetText>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Content to display inside the inset text block. |
| `...restProps` | additional HTML attributes spread onto the container div |  |

## Examples

```svelte
<!-- Simple inset text notice -->
<InsetText>It can take up to 8 weeks to process.</InsetText>

<!-- Inset text with structured content -->
<InsetText>
  <p>You must apply before the deadline. Late applications will not be accepted.</p>
</InsetText>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import InsetText from "$lib/components/InsetText/InsetText.svelte";
</script>

<InsetText>It can take up to 8 weeks to process.</InsetText>
```

## Keyboard

- None — this is a passive container with no interactive behavior

## Accessibility

- role="note" identifies the content as supplementary information
- Screen readers announce it with appropriate context as a note

## Internationalization

- All content comes through the children snippet; no hardcoded user-facing strings

## References

- WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
- GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
- NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text
