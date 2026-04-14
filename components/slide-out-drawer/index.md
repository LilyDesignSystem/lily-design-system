# Slide-Out Drawer

A slide-out drawer is a UI/UX component that slides in from the side of the
screen -- usually from the left or right -- to reveal additional content or
navigation options without leaving the current page. Often triggered by a button
or swipe gesture, it is commonly used for menus, filters, settings, or secondary
content in mobile and web applications. This component allows for efficient use
of screen space by keeping less frequently used options hidden until needed,
enhancing focus and minimizing clutter in the main interface while maintaining
easy access to extended functionality.

This component renders as a `<div>` with `role="dialog"`, `aria-label`, and
`aria-modal="true"` when open, and is completely removed from the DOM when
closed. The `open` prop is two-way binding, and the Escape key
closes the drawer.

## Implementation Notes

- Renders as `<div role="dialog" aria-label={label} aria-modal="true">` when open
- Conditionally rendered with conditional rendering -- not in the DOM when closed
- The `open` prop is two-way binding
- Escape key closes the drawer via a keydown handler
- `tabindex="-1"` allows the dialog div to receive focus programmatically

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, bindable
- `children`: slot (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Usage

```html
<button onclick={() => (isOpen = true)}>Open menu</button>

<SlideOutDrawer label="Navigation menu" open={isOpen}>
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

```html
<button onclick={() => (settingsOpen = true)}>Settings</button>

<SlideOutDrawer label="Settings panel" open={settingsOpen}>
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

- `role="dialog"` for modal dialog semantics
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- `tabindex="-1"` for programmatic focus management

## When to Use

- Use for a drawer that specifically slides out from the side of the page.
- Use for menus, filters, settings, or secondary content that should slide in from the side without navigating away.
- Use on mobile and responsive layouts to conserve screen space by hiding infrequently used options.

## When Not to Use

- Do not use when a standard Drawer with multi-directional support is sufficient -- use Drawer instead.
- Do not use for bottom sheets on mobile -- use Sheet instead.
- Do not use for primary content or critical actions that users should see without extra interaction -- use Dialog or AlertDialog instead.

## Headless

This headless component provides a modal dialog container with `role="dialog"`, `aria-modal="true"`, `aria-label`, Escape key dismissal, and `tabindex="-1"` for programmatic focus. The consumer provides all visual styling including slide-in animations, backdrop overlay, width, and positioning.


## Styles

The consumer provides all CSS styling. The component renders with a `.slide-out-drawer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `slide-out-drawer`
- Verify role="dialog"` for modal dialog semantics
- Verify aria-label` from the label prop provides the accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button inside the drawer and use a semi-transparent backdrop to indicate the drawer is an overlay. Animate the slide transition to reinforce direction.
- **Developers**: Implement focus trapping within the drawer so keyboard users cannot interact with content behind it. Restore focus to the trigger element when the drawer closes.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
