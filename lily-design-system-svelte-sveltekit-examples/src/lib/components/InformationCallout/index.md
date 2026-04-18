# InformationCallout

## Overview

A callout container that highlights important information in a semantically distinct
region. Renders an <aside> element with role="note" and an accessible label, making
the callout content identifiable to assistive technologies as supplementary information.
Useful for displaying notices, tips, warnings, beta announcements, or any content that
should stand out from the main flow.

## What it does

A callout box highlighting informational content.

## When to use

- Use when you need a callout box highlighting informational content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<InformationCallout label="Note">{children}</InformationCallout>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the callout via aria-label (e.g., "Note", "Warning", "Tip"). |
| `children` | Snippet, required | Callout content to display. |
| `...restProps` | additional HTML attributes spread onto the aside element |  |

## Examples

```svelte
<!-- Beta feature notice -->
<InformationCallout label="Note">
  <p>This feature is in beta.</p>
</InformationCallout>

<!-- Important warning callout -->
<InformationCallout label="Warning">
  <p>Changes cannot be undone after submission.</p>
</InformationCallout>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import InformationCallout from "$lib/components/InformationCallout/InformationCallout.svelte";
</script>

<InformationCallout label="Note">{children}</InformationCallout>
```

## Keyboard

- None — this is a passive container with no interactive behavior

## Accessibility

- role="note" identifies the content as supplementary information
- aria-label provides an accessible name describing the type of callout

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings
- All content comes through the children snippet

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- HTML aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
