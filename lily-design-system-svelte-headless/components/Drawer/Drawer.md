# Drawer

A drawer is a panel that slides in from an edge of the viewport, typically used for navigation menus, filters, or supplementary content. It overlays the main content and can be dismissed by the user. The component renders conditionally based on its `open` state and uses `role="dialog"` with `aria-modal="true"` for proper screen reader behavior.

The `side` prop indicates which edge the drawer enters from via a `data-side` attribute, allowing consumers to apply appropriate positioning and animation styles. The drawer supports keyboard dismissal with the Escape key and provides a `tabindex="-1"` to allow programmatic focus management.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Uses `$bindable()` on the `open` prop for two-way state binding
- Sets `aria-modal="true"` to indicate the drawer is a modal dialog
- Exposes `data-side` attribute for consumer CSS positioning (left, right, top, bottom)
- Sets `tabindex="-1"` to allow the drawer to receive focus programmatically
- Escape key handler sets `open` to `false`

## Props

- `open`: boolean (default: false) -- whether the drawer is visible, bindable via `bind:open`
- `label`: string (required) -- accessible name for the drawer
- `side`: "left" | "right" | "top" | "bottom" (default: "left") -- which edge the drawer enters from
- `children`: Snippet (required) -- drawer content

## Usage

```svelte
<Drawer label="Navigation" bind:open side="left">
  <nav>...</nav>
</Drawer>
```

```svelte
<Drawer label="Filters" bind:open={showFilters} side="right">
  <form>...</form>
</Drawer>
```

## Keyboard Interactions

- Escape: closes the drawer by setting `open` to `false`

## ARIA

- `role="dialog"` -- identifies the drawer as a dialog for assistive technology
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the drawer is modal, restricting interaction to its contents
- `data-side={side}` -- data attribute for consumer CSS styling based on drawer position

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
