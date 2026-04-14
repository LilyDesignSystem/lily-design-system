# Drawer

A drawer is a panel that slides in from an edge of the viewport, typically used for navigation menus, filters, or supplementary content. It overlays the main content and can be dismissed by the user. The component renders conditionally based on its `open` state and uses `role="dialog"` with `aria-modal="true"` for proper screen reader behavior.

The `side` prop indicates which edge the drawer enters from via a `data-side` attribute, allowing consumers to apply appropriate positioning and animation styles. The drawer supports keyboard dismissal with the Escape key and provides a `tabindex="-1"` to allow programmatic focus management.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Supports two-way binding on the `open` prop for two-way state binding
- Sets `aria-modal="true"` to indicate the drawer is a modal dialog
- Exposes `data-side` attribute for consumer CSS positioning (left, right, top, bottom)
- Sets `tabindex="-1"` to allow the drawer to receive focus programmatically
- Escape key handler sets `open` to `false`

## Props

- `open`: boolean (default: false) -- whether the drawer is visible, two-way bindable via `open`
- `label`: string (required) -- accessible name for the drawer
- `side`: "left" | "right" | "top" | "bottom" (default: "left") -- which edge the drawer enters from
- `children`: slot (required) -- drawer content

## Usage

Mobile navigation drawer sliding in from the left:

```html
<button onclick={() => (navOpen = true)}>Menu</button>
<Drawer label="Main navigation" open={navOpen} side="left">
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <button onclick={() => (navOpen = false)}>Close</button>
</Drawer>
```

Filter panel sliding in from the right:

```html
<Drawer label="Search filters" open={showFilters} side="right">
  <form>
    <fieldset>
      <legend>Date range</legend>
      <input type="date" name="from" />
      <input type="date" name="to" />
    </fieldset>
    <button type="submit">Apply filters</button>
  </form>
</Drawer>
```

## Keyboard Interactions

- Escape: closes the drawer by setting `open` to `false`

## ARIA

- `role="dialog"` -- identifies the drawer as a dialog for assistive technology
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the drawer is modal, restricting interaction to its contents
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

This headless component provides a `<div>` with `role="dialog"`, `aria-modal="true"`, accessible labeling via `aria-label`, a `data-side` attribute for positioning, keyboard dismissal via Escape, and two-way binding on `open`. The consumer provides all visual styling, animations, backdrop, and positioning CSS.


## Styles

The consumer provides all CSS styling. The component renders with a `.drawer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `drawer`
- Verify role="dialog"` -- identifies the drawer as a dialog for assistive technology
- Verify aria-label={label}` -- provides an accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button and consider adding a semi-transparent backdrop to indicate the main content is temporarily inaccessible. Animate the slide-in transition for a smooth experience.
- **Developers**: Trap focus within the drawer when it is open and return focus to the trigger element on close. Use the `data-side` attribute to apply directional CSS transitions.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
