# Popover

A popover is a UI component that displays contextual information or actions in an overlay that appears near the element that triggered it. The Popover component is a headless `popover="auto"` dialog: the browser's Popover API shows it in the top layer and closes it on Escape or a click outside, with proper dialog semantics for accessibility.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

Unlike tooltips, popovers can contain rich interactive content such as text, forms, buttons, or other controls. The component supports two-way binding on the `open` prop, allowing parent components to control visibility. The consumer provides the trigger, which opens it with `command="toggle-popover"` and `commandfor` — no script needed.

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

- `label`: string (required) -- accessible name for the popover dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- whether the popover is shown; follows Escape, light dismiss and the trigger
- `id`: string (rest prop) -- lets a trigger name it with `commandfor` / `popovertarget`
- `children`: slot (required) -- the popover content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

A trigger that needs no script:

```html
<button
  type="button"
  aria-haspopup="dialog"
  aria-controls="info"
  command="toggle-popover"
  commandfor="info"
  popovertarget="info"
>
  Toggle info
</button>
<Popover
  id="info"
  label="Additional information"
  bind:open={showInfo}
>
  <p>Here is some contextual information.</p>
  <button
    type="button"
    command="hide-popover"
    commandfor="info"
  >
    Close
  </button>
</Popover>
```

Popover with an inline edit form:

```html
<button
  type="button"
  command="toggle-popover"
  commandfor="edit-name"
>
  Edit name
</button>
<Popover
  id="edit-name"
  label="Edit display name"
  bind:open={editOpen}
>
  <form onsubmit={save}>
    <label for="display-name">Display name</label>
    <input
      type="text"
      id="display-name"
      value={name}
    />
    <button type="submit">Save</button>
  </form>
</Popover>
```

## Keyboard Interactions

- Enter / Space on the trigger: the browser opens or closes the popover
- Escape: the browser closes it (Popover API) and `open` becomes false; without the API the consumer closes it
- Tab: not trapped -- the popover is non-modal

## ARIA

- `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog
- On the consumer's trigger: `aria-haspopup="dialog"` and `aria-controls`; the browser exposes a `popovertarget` trigger's expanded state

## When to Use

- Use Popover to display rich interactive content like forms, menus, or detailed information near a trigger element.
- Use Popover when the overlay content needs to persist until the user explicitly dismisses it.
- Use Popover for inline editing interfaces, such as editing a profile field without leaving the page.
- Use Popover for filter panels or mini-forms that relate to a specific trigger element.
- Use Popover for contextual actions that need more space than a menu item label.

## When Not to Use

- Do not use for simple descriptive text on hover or focus -- use Tooltip instead.
- Do not use for content requiring a full modal with backdrop overlay -- use Dialog or AlertDialog instead.
- Do not use for preview content triggered by hover -- use HoverCard instead.
- Do not use for navigation menus -- use DropdownMenu or NavigationMenu instead.

## Headless

The Popover headless component renders a `<div popover="auto" role="dialog">` with `aria-label` for accessible naming, and keeps a two-way `open` in step with the browser's Popover API. The consumer provides all visual styling, positioning (CSS anchor positioning works well) and the trigger element.

## Styles

The consumer provides all CSS styling. The component renders with a `.popover` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `popover`, `role="dialog"` and `aria-label`
- Verify it has `popover="auto"` and stays in the DOM when closed
- Verify setting `open` calls `showPopover()` / `hidePopover()` (stubbed in jsdom)
- Verify a `toggle` event (light dismiss, Escape, a trigger) updates `open`
- Verify the `hidden` fallback where the Popover API is missing
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position popovers to avoid obscuring the trigger element, and ensure the popover has a clear visual boundary (border or shadow) to distinguish it from surrounding content.
- **Developers**: Give the popover an `id` and open it with `command="toggle-popover" commandfor` on a real `<button>`: light dismiss and Escape come free. Use `dialog` instead when the content must be modal.

## Related components

- `popup` — a temporary overlay that appears above page content
- `hover-card` — a card that appears on hover over a trigger element
- `tooltip` — a small popup showing descriptive text on hover or focus
- `popconfirm-dialog` — a popover dialog with confirm and cancel buttons

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

---

Lily™ and Lily Design System™ are trademarks.
