# Popup

A popup is a UI component that temporarily appears over the main content to convey information, prompt user actions, or display additional options without navigating away from the current screen. The Popup component is a headless `popover="auto"` dialog overlay: the browser's Popover API shows it in the top layer and closes it on Escape or a click outside, with proper dialog semantics for assistive technology.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

The component is similar to Popover but is designed as a general-purpose overlay dialog. It uses two-way binding on the `open` prop, so parent components can control visibility. The consumer provides the trigger (a `command="toggle-popover"` button, no script needed) and all content.

## Implementation Notes

- Always renders a `<div popover="auto" role="dialog">`, so a trigger can name its `id`; closed, the browser does not display it
- The native Popover API gives the top layer, light dismiss (a click outside) and Escape, with no script
- A trigger `<button command="toggle-popover" commandfor="{id}">` opens and closes it (Chrome 135, Firefox 144, Safari 26.2); add `popovertarget="{id}"` for engines before command/commandfor (Chrome 114, Firefox 125, Safari 17). Both work with JavaScript off, so the HTML and Nunjucks versions open with no script
- `open` is two-way bound: setting it calls `showPopover()` / `hidePopover()`, and the element's `toggle` event writes the browser's own changes back
- Where `showPopover` is missing (jsdom, older engines) the component falls back to the `hidden` attribute; Escape and outside-click are then the consumer's
- The `label` prop is required and provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element (Angular: `elementId` for the id; Blazor: `Id`)
- Content is provided via the `children` slot

## Props

- `label`: string (required) -- accessible name for the popup dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- whether the popup is shown; follows Escape, light dismiss and the trigger
- `id`: string (rest prop) -- lets a trigger name it with `commandfor` / `popovertarget`
- `children`: slot (required) -- the popup content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Quick action overlay:

```html
<button
  type="button"
  aria-haspopup="dialog"
  aria-controls="sort-options"
  command="toggle-popover"
  commandfor="sort-options"
  popovertarget="sort-options"
>
  Sort results
</button>
<Popup
  id="sort-options"
  label="Sort options"
  bind:open={showSort}
>
  <button onclick={() => sortBy("date")}>Date</button>
  <button onclick={() => sortBy("name")}>Name</button>
  <button onclick={() => sortBy("relevance")}>Relevance</button>
</Popup>
```

Opened from script instead of a trigger:

```html
<Popup
  id="edit-note"
  label="Edit note"
  bind:open={showEdit}
>
  <textarea>{noteText}</textarea>
  <button onclick={() => { saveNote(); showEdit = false; }}>Save</button>
</Popup>
```

## Keyboard Interactions

- Enter / Space on the trigger: the browser opens or closes the popup
- Escape: the browser closes it (Popover API) and `open` becomes false; without the API the consumer closes it
- Tab: not trapped -- the popup is non-modal

## ARIA

- `role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog
- On the consumer's trigger: `aria-haspopup="dialog"` and `aria-controls`; the browser exposes a `popovertarget` trigger's expanded state

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

The Popup headless component renders a `<div popover="auto" role="dialog">` with `aria-label` for accessible naming, and keeps a two-way `open` in step with the browser's Popover API. The consumer provides all visual styling, positioning (CSS anchor positioning works well) and the trigger element.

## Styles

The consumer provides all CSS styling. The component renders with a `.popup` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `popup`, `role="dialog"` and `aria-label`
- Verify it has `popover="auto"` and stays in the DOM when closed
- Verify setting `open` calls `showPopover()` / `hidePopover()` (stubbed in jsdom)
- Verify a `toggle` event (light dismiss, Escape, a trigger) updates `open`
- Verify the `hidden` fallback where the Popover API is missing
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give popups a clear visual elevation (shadow or border) and ensure they do not cover critical page actions the user may need to reach.
- **Developers**: Give the popup an `id` and open it with `command="toggle-popover" commandfor` on a real `<button>`: light dismiss and Escape come free. Use `dialog` instead when the content must be modal.

## Related components

- `popover` — a floating content box anchored to a trigger element
- `tooltip` — a small popup showing descriptive text on hover or focus
- `drawer` — a panel that slides in from the edge of the screen

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

---

Lily™ and Lily Design System™ are trademarks.
