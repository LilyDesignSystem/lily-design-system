# SlideOutDrawer

A slide-out drawer is a UI/UX component that slides in from the side of the
screen -- usually from the left or right -- to reveal additional content or
navigation options without leaving the current page. Often triggered by a button
or swipe gesture, it is commonly used for menus, filters, settings, or secondary
content in mobile and web applications. This component allows for efficient use
of screen space by keeping less frequently used options hidden until needed,
enhancing focus and minimizing clutter in the main interface while maintaining
easy access to extended functionality.

This component renders as a native `<dialog>` with `aria-label` and
`aria-modal="true"`, opened with `showModal()`, when open, and is completely removed from the DOM when
closed. The `open` prop is `$bindable()` for two-way binding, and the Escape key
closes the drawer.

## Implementation Notes

- Renders as `<dialog aria-label={label} aria-modal="true">` when open
- Opened with `showModal()`: the browser puts it in the top layer, makes the page behind it inert, traps Tab inside it and moves focus in; on close, focus returns to the element that opened it. Escape (keydown or the native `cancel` event) closes it. Where `showModal` is missing (jsdom) it falls back to the `open` attribute
- Conditionally rendered with `{#if open}` -- not in the DOM when closed
- The `open` prop is `$bindable()` for two-way binding
- Escape key closes the drawer via a keydown handler
- `tabindex="-1"` allows the dialog div to receive focus programmatically

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, bindable
- `children`: Snippet (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<dialog>`

## Usage

```svelte
<script>
  import SlideOutDrawer from "./SlideOutDrawer.svelte";

  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open menu</button>

<SlideOutDrawer
  label="Navigation menu"
  bind:open={isOpen}
>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <button onclick={() => (isOpen = false)}>Close</button>
</SlideOutDrawer>
```

Settings panel:

```svelte
<script>
  import SlideOutDrawer from "./SlideOutDrawer.svelte";

  let settingsOpen = $state(false);
</script>

<button onclick={() => (settingsOpen = true)}>Settings</button>

<SlideOutDrawer
  label="Settings panel"
  bind:open={settingsOpen}
>
  <h2>Settings</h2>
  <form>
    <label>
      <input type="checkbox" /> Enable notifications
    </label>
  </form>
</SlideOutDrawer>
```

## Keyboard Interactions

- Escape closes the drawer

## ARIA

- `role="dialog"` provided natively by the `<dialog>` element
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- `tabindex="-1"` for programmatic focus management

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
