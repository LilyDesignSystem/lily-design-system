# Slide-Out Drawer

A slide-out drawer is a UI/UX component that slides in from the side of the
screen -- usually from the left or right -- to reveal additional content or
navigation options without leaving the current page. Often triggered by a button
or swipe gesture, it is commonly used for menus, filters, settings, or secondary
content in mobile and web applications. This component allows for efficient use
of screen space by keeping less frequently used options hidden until needed,
enhancing focus and minimizing clutter in the main interface while maintaining
easy access to extended functionality.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This component renders as a native `<dialog>` with `aria-label` and
`aria-modal="true"` when open, opened with `showModal()` so it is a real modal
(inert page, Tab trap, focus returns to the opener), and is completely removed
from the DOM when closed. The `open` prop is two-way binding, and the Escape key
closes the drawer.

## Implementation Notes

- Renders as `<dialog aria-label={label} aria-modal="true">` when open, opened with `showModal()` (falls back to the `open` attribute where `showModal` is missing)
- Moves focus inside on open and returns it to the opener on close
- Conditionally rendered with conditional rendering -- not in the DOM when closed
- The `open` prop is two-way binding
- Escape (keydown or the native `cancel` event) and the native `close` event close the drawer
- `tabindex="-1"` allows the dialog to receive focus programmatically

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, bindable
- `children`: slot (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<dialog>`

## Usage

```html
<button
  onclick="{()"
  =""
>
  (isOpen = true)}>Open menu
</button>

<SlideOutDrawer
  label="Navigation menu"
  open="{isOpen}"
>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <button
    onclick="{()"
    =""
  >
    (isOpen = false)}>Close
  </button>
</SlideOutDrawer>
```

Settings panel:

```html
<button
  onclick="{()"
  =""
>
  (settingsOpen = true)}>Settings
</button>

<SlideOutDrawer
  label="Settings panel"
  open="{settingsOpen}"
>
  <h2>Settings</h2>
  <form>
    <label> <input type="checkbox" /> Enable notifications </label>
  </form>
</SlideOutDrawer>
```

## Keyboard Interactions

- Escape closes the drawer
- Tab / Shift+Tab stay inside the drawer while it is open

## ARIA

- `role="dialog"` implicit on the native `<dialog>` element
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` is true: `showModal()` makes the content behind the drawer inert
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

This headless component provides a modal `<dialog>` opened with `showModal()` (top layer, inert page, Tab trap, focus return), `aria-modal="true"`, `aria-label`, Escape key dismissal, and `tabindex="-1"` for programmatic focus. The consumer provides all visual styling including slide-in animations, backdrop overlay, width, and positioning.

## Reduced motion

Reduced motion changes how content appears, never whether it does. Apply it in consumer CSS under `@media (prefers-reduced-motion: reduce)` and under the `motion-picker`'s `[data-motion="reduce"]` on the document root (the 63 reference themes already honour both for the preference hooks they style). For a drawer:

- **Suppress:** the slide-in and slide-out, and any backdrop fade longer than about 100 ms. Show and hide the drawer and its backdrop at once.
- **Keep:** the focus rules exactly as they are: focus moves into the drawer when it opens and returns to the trigger when it closes, Escape closes it, and the backdrop is present immediately. Motion never decides when the drawer is usable.

## Styles

The consumer provides all CSS styling. The component renders with a `.slide-out-drawer` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<dialog>` element with class `slide-out-drawer`, opened with `showModal()`
- Verify focus moves inside on open, stays inside while open, and returns to the trigger on close
- Verify role="dialog"` for modal dialog semantics
- Verify aria-label` from the label prop provides the accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button inside the drawer and use a semi-transparent backdrop to indicate the drawer is an overlay. Animate the slide transition to reinforce direction.
- **Developers**: Focus trapping and focus return come from `showModal()`; open the drawer from a button so focus has somewhere to return to.

## Related components

- `drawer` — a panel that slides in from the edge of the screen
- `sheet` — a panel that slides in from a screen edge as an overlay

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

---

Lily™ and Lily Design System™ are trademarks.
