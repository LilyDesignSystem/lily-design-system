# Panel

## Overview

A headless labeled container for grouping related content, controls, or settings.
It renders a semantic <section> element with an accessible label, creating a
named region landmark that assistive technology can identify and navigate to.
Commonly used in dashboards, settings pages, sidebars, and multi-section layouts.

## What it does

A generic content panel with optional heading.

## When to use

- Use when you need a generic content panel with optional heading.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Panel label="Settings">{children}</Panel>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the panel region via aria-label. |
| `children` | Snippet, required | The panel content. |
| `...restProps` | additional HTML attributes spread onto the <section> |  |

## Examples

```svelte
<!-- Basic labeled panel -->
<Panel label="Settings">
  <p>Adjust your preferences below.</p>
</Panel>

<!-- Multiple panels on a page -->
<Panel label="Account information">
  <p>Name, email, and profile details.</p>
</Panel>
<Panel label="Notification preferences">
  <p>Choose how you want to be notified.</p>
</Panel>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Panel from "$lib/components/Panel/Panel.svelte";
</script>

<Panel label="Settings">{children}</Panel>
```

## Keyboard

- None — this is a passive container. Screen reader users can navigate to
- named regions using landmark navigation shortcuts.

## Accessibility

- <section aria-label="..."> creates a named region landmark
- Assistive technology can list and navigate to this section via landmarks
- The aria-label value should be concise and descriptive of the panel content

## Internationalization

- The label prop is the only text; consumer provides all content through children
- No hardcoded user-facing strings

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
- WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
