# Drawer

A drawer is a panel that slides in from an edge of the viewport, typically used for navigation menus, filters, or supplementary content. It overlays the main content and can be dismissed by the user. The component renders conditionally based on its `open` state and renders a native `<dialog>` opened with `showModal()`, so it is a real modal: the page behind it is inert, Tab stays inside it, Escape closes it and focus returns to the element that opened it.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

The `side` prop indicates which edge the drawer enters from via a `data-side` attribute, allowing consumers to apply appropriate positioning and animation styles. The drawer supports keyboard dismissal with the Escape key and provides a `tabindex="-1"` to allow programmatic focus management.

## Implementation Notes

- Conditionally renders a native `<dialog>` only when `open` is true, opened with `showModal()` (falls back to the `open` attribute where `showModal` is missing, for example jsdom)
- Supports two-way binding on the `open` prop for two-way state binding
- Is modal, so `aria-modal="true"` is true: the page behind is inert and Tab cannot leave
- Moves focus inside on open and returns it to the opener on close
- Exposes `data-side` attribute for consumer CSS positioning (left, right, top, bottom)
- Sets `tabindex="-1"` to allow the drawer to receive focus programmatically
- Escape (keydown or the native `cancel` event) and the native `close` event set `open` to `false`

## Props

- `open`: boolean (default: false) -- whether the drawer is visible, two-way bindable via `open`
- `label`: string (required) -- accessible name for the drawer
- `side`: "left" | "right" | "top" | "bottom" (default: "left") -- which edge the drawer enters from
- `children`: slot (required) -- drawer content

## Usage

Mobile navigation drawer sliding in from the left:

```html
<button
  onclick="{()"
  =""
>
  (navOpen = true)}>Menu
</button>
<Drawer
  label="Main navigation"
  open="{navOpen}"
  side="left"
>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <button
    onclick="{()"
    =""
  >
    (navOpen = false)}>Close
  </button>
</Drawer>
```

Filter panel sliding in from the right:

```html
<Drawer
  label="Search filters"
  open="{showFilters}"
  side="right"
>
  <form>
    <fieldset>
      <legend>Date range</legend>
      <input
        type="date"
        name="from"
      />
      <input
        type="date"
        name="to"
      />
    </fieldset>
    <button type="submit">Apply filters</button>
  </form>
</Drawer>
```

## Keyboard Interactions

- Escape: closes the drawer by setting `open` to `false`
- Tab / Shift+Tab: move between the drawer's controls; focus cannot leave while it is open

## ARIA

- `role="dialog"` -- implicit on the native `<dialog>` element
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- true: `showModal()` makes the page behind inert
- `data-side={side}` -- data attribute for consumer CSS styling based on drawer position

## When to Use

- Use for a panel that slides in from the edge of the screen to show secondary content or navigation without leaving the page.
- Use for navigation menus, filters, or supplementary content that should overlay the main view temporarily.
- Use when the content is contextual and temporary, not a primary destination.
- Use for responsive layouts where side navigation collapses into a drawer on smaller screens.

## When Not to Use

- Do not use for modal confirmations or urgent messages -- use Dialog or AlertDialog instead.
- Do not use for tooltip-style content -- use Popover instead.
- Do not use when the overlay should behave like a bottom sheet on mobile devices -- use Sheet instead.
- Do not use for persistent side navigation that should always be visible -- use Sidebar instead.

## Headless

This headless component provides a modal `<dialog>` opened with `showModal()` (top layer, inert page, Tab trap, focus return), `aria-modal="true"`, accessible labeling via `aria-label`, a `data-side` attribute for positioning, keyboard dismissal via Escape, and two-way binding on `open`. The consumer provides all visual styling, animations, the `::backdrop`, and positioning CSS (reset the user-agent `<dialog>` margin, inset and max-height for an edge-docked panel).

## Styles

The consumer provides all CSS styling. The component renders with a `.drawer` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<dialog>` element with class `drawer`, opened with `showModal()`
- Verify focus moves inside on open, stays inside while open, and returns to the trigger on close
- Verify role="dialog"` -- identifies the drawer as a dialog for assistive technology
- Verify aria-label={label}` -- provides an accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button and consider adding a semi-transparent backdrop to indicate the main content is temporarily inaccessible. Animate the slide-in transition for a smooth experience.
- **Developers**: Focus trapping and focus return come from `showModal()`; open the drawer from a button so focus has somewhere to return to. Use the `data-side` attribute to apply directional CSS transitions.

## Related components

- `sheet` — a panel that slides in from a screen edge as an overlay
- `slide-out-drawer` — a drawer that slides out from the side of the page
- `sidebar` — a side panel for navigation or supplementary content

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

---

Lily™ and Lily Design System™ are trademarks.
