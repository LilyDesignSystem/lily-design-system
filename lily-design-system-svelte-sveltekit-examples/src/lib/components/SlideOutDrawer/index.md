# SlideOutDrawer

## Overview

A headless slide-out drawer that renders a modal dialog container which
slides in from the side of the screen. When open, it can be dismissed with
the Escape key. Commonly used for navigation menus, filters, settings panels,
or secondary content in mobile and web applications.

## What it does

A drawer that slides out from the side of the page.

## When to use

- Use when you need a drawer that slides out from the side of the page.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<SlideOutDrawer label="Menu" bind:open={isOpen}>
  <nav>Menu content</nav>
</SlideOutDrawer>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the dialog via aria-label. |
| `open` | boolean, default false | Whether the drawer is visible; bindable via bind:open. |
| `children` | Snippet, required | The drawer content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Navigation drawer with close button -->
<SlideOutDrawer label="Navigation menu" bind:open={isOpen}>
  <nav>
    <ul><li><a href="/">Home</a></li></ul>
  </nav>
  <button onclick={() => isOpen = false}>Close</button>
</SlideOutDrawer>

<!-- Settings panel -->
<SlideOutDrawer label="Settings panel" bind:open={settingsOpen}>
  <h2>Settings</h2>
  <form><label><input type="checkbox" /> Enable notifications</label></form>
</SlideOutDrawer>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SlideOutDrawer from "$lib/components/SlideOutDrawer/SlideOutDrawer.svelte";
</script>

<SlideOutDrawer label="Menu" bind:open={isOpen}>
  <nav>Menu content</nav>
</SlideOutDrawer>
```

## Keyboard

- Escape: closes the drawer by setting open to false

## Accessibility

- role="dialog" for modal overlay semantics
- aria-label describes the drawer purpose
- aria-modal="true" indicates modal behavior (content behind is inert)
- tabindex="-1" allows the dialog to receive programmatic focus
- WCAG 2.2 AAA: properly labeled modal with keyboard dismissal

## Internationalization

- The label prop externalizes the accessible label string
- No hardcoded user-facing strings

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
