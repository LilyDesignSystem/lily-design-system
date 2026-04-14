# Popup

A popup is a UI component that temporarily appears over the main content to convey information, prompt user actions, or display additional options without navigating away from the current screen. The Popup component provides a headless conditional dialog overlay that renders its content only when the `open` state is true, using proper dialog semantics for assistive technology.

The component is similar to Popover but is designed as a general-purpose overlay dialog. It uses two-way binding on the `open` prop, so parent components can control visibility. The consumer provides trigger elements, open/close logic, and all content.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Supports two-way binding on the `open` prop
- The `label` prop is required and provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer must provide their own trigger element and manage open/close behavior
- Content is provided via the `children` slot

## Props

- `label`: string (required) -- accessible name for the popup dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- controls whether the popup is visible; supports two-way binding
- `children`: slot (required) -- the popup content rendered inside the dialog
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Quick action overlay:

```html
<button onclick={() => showPopup = !showPopup}>Sort results</button>
<Popup label="Sort options" open={showPopup}>
  <button onclick={() => { sortBy('date'); showPopup = false; }}>Date</button>
  <button onclick={() => { sortBy('name'); showPopup = false; }}>Name</button>
  <button onclick={() => { sortBy('relevance'); showPopup = false; }}>Relevance</button>
</Popup>
```

Inline editing overlay:

```html
<button onclick={() => showEdit = true}>Edit note</button>
<Popup label="Edit note" open={showEdit}>
  <textarea>{noteText}</textarea>
  <button onclick={() => { saveNote(); showEdit = false; }}>Save</button>
  <button onclick={() => showEdit = false}>Cancel</button>
</Popup>
```

## Keyboard Interactions

- Escape: Consumer should implement closing the popup by setting `open` to false
- Tab: Should trap focus within the popup when open (consumer responsibility)

## ARIA

- `role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## When to Use

- Use for temporary overlay content that appears above the page, such as dropdown panels, contextual options, or quick action forms.
- Use when the overlay does not require focus trapping or a modal backdrop -- it should allow background interaction.
- Use when a lightweight overlay is more appropriate than a full Dialog, such as for filter panels or inline editing.

## When Not to Use

- Do not use for modal interactions requiring focus trapping -- use Dialog or AlertDialog instead.
- Do not use for hover-triggered content -- use HoverCard or Tooltip instead.
- Do not use for persistent side panels -- use Drawer or Sheet instead.
- Do not use for permanent content sections -- use Panel or Card instead.

## Headless

The Popup headless component provides a conditionally rendered `<div>` with `role="dialog"` and `aria-label` for accessible naming. It manages open/close visibility via two-way binding. The consumer provides all visual styling, positioning, trigger elements, and focus trap logic.


## Styles

The consumer provides all CSS styling. The component renders with a `.popup` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `popup`
- Verify role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- Verify aria-label="..."` -- provides the accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give popups a clear visual elevation (shadow or border) and ensure they do not cover critical page actions the user may need to reach.
- **Developers**: Implement Escape key handling to close the popup, and return focus to the trigger element when the popup closes.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
