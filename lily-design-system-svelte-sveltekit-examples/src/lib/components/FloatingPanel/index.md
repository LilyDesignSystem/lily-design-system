# FloatingPanel

## Overview

A floating panel container that overlays page content, typically used for tooltips,
popovers, dropdown menus, or contextual UI. It renders conditionally based on an
open prop, fully removing itself from the DOM when closed. Consumers are responsible
for positioning the panel relative to a trigger element using their own CSS.

## What it does

A panel that floats above page content.

## When to use

- Use when you need a panel that floats above page content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<FloatingPanel open={showPanel} label="Options">{children}</FloatingPanel>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `open` | boolean, default false | Whether the panel is visible. |
| `label` | string, required | Accessible name for the panel region via aria-label. |
| `children` | Snippet, required | Panel content to render inside. |
| `...restProps` | additional HTML attributes spread onto the div |  |

## Examples

```svelte
<!-- Conditionally shown options panel -->
<FloatingPanel open={showPanel} label="Options">
  <p>Panel content</p>
</FloatingPanel>

<!-- Floating filter panel -->
<FloatingPanel open={filtersVisible} label="Filters">
  <form>...</form>
</FloatingPanel>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FloatingPanel from "$lib/components/FloatingPanel/FloatingPanel.svelte";
</script>

<FloatingPanel open={showPanel} label="Options">{children}</FloatingPanel>
```

## Keyboard

- None — this is a passive container; consumers should implement focus management and Escape-to-close as needed

## Accessibility

- role="region" identifies the panel as a landmark region
- aria-label provides an accessible name for the region

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
