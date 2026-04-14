# Dialog

A modal or non-modal dialog that overlays the main interface to communicate information or prompt users for input. Dialogs are used for confirmations, alerts, forms, settings, and any interaction that requires focused user attention. Modal dialogs block interaction with the underlying page until dismissed, while non-modal dialogs allow background interaction.

This component uses the native `<dialog>` HTML element with conditional rendering. When `open` is false, the dialog is removed from the DOM entirely. The dialog supports keyboard dismissal via the Escape key and exposes a bindable `open` prop for programmatic control of visibility.

## Implementation Notes

- Renders a native `<dialog>` element conditionally via conditional rendering
- Supports two-way binding on the `open` prop with the parent
- The `open` HTML attribute is set directly on the dialog element (not using `.showModal()`)
- `tabindex="-1"` is set on the dialog to ensure it can receive focus and keyboard events
- Escape key handler sets `open` to false and prevents default browser behavior
- The `modal` prop controls whether `aria-modal` is set (defaults to true)
- When `modal` is false, `aria-modal` is omitted entirely (set to `undefined`)
- Accepts a `children` slot for dialog content including buttons, forms, or text
- Spreads `restProps` onto the `<dialog>` element for consumer customization

## Props

- `open`: boolean (default: false) -- whether the dialog is visible; bindable
- `label`: string (required) -- accessible name for the dialog
- `modal`: boolean (default: true) -- whether the dialog behaves as a modal
- `children`: slot (required) -- dialog body content

## Usage

Modal dialog with a form:

```html
<button onclick={() => showDialog = true}>Edit profile</button>

<Dialog label="Edit profile" open={showDialog}>
  <form>
    <label for="display-name">Display name</label>
    <input id="display-name" type="text" value={displayName} />

    <label for="bio">Bio</label>
    <textarea id="bio">{bio}</textarea>

    <button type="button" onclick={() => showDialog = false}>Cancel</button>
    <button type="submit">Save</button>
  </form>
</Dialog>
```

Non-modal dialog for supplementary information:

```html
<Dialog label="Release notes" open={showNotes} modal={false}>
  <p>Version 2.4 includes performance improvements and accessibility fixes.</p>
  <button onclick={() => showNotes = false}>Close</button>
</Dialog>
```

## Keyboard Interactions

- Escape: closes the dialog by setting `open` to false

## ARIA

- `role="dialog"` -- provided natively by the `<dialog>` element
- `aria-label="{label}"` -- provides an accessible name for the dialog
- `aria-modal="true"` -- present when the `modal` prop is true, indicating the dialog traps focus and blocks background interaction
- `tabindex="-1"` -- allows the dialog element itself to receive focus for keyboard event handling

## When to Use

- Use for modal or non-modal dialogs that present forms, detailed content, or multi-step workflows.
- Use when users need to complete a focused task without leaving the current page context, such as editing a profile or configuring settings.
- Use with `aria-label` to provide an accessible name and with `aria-modal` for modal focus trapping.
- Use the `modal` prop set to `false` for supplementary information that does not require blocking background interaction.

## When Not to Use

- Do not use for simple yes/no confirmations -- use AlertDialog for acknowledgment-style interactions.
- Do not use for brief tooltip-style information -- use Tooltip or Popover instead.
- Do not use when the content could be shown inline without an overlay -- avoid unnecessary modals.
- Do not use for persistent side panels -- use Drawer or Sheet instead.

## Headless

This headless component provides a native `<dialog>` element with conditional rendering, accessible labeling via `aria-label`, modal/non-modal support via `aria-modal`, keyboard dismissal with Escape, and two-way binding on the `open` prop. The consumer provides all visual styling, backdrop appearance, positioning, and dialog content.


## Styles

The consumer provides all CSS styling. The component renders with a `.dialog` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<dialog>` element with class `dialog`
- Verify role="dialog"` -- provided natively by the `<dialog>` element
- Verify aria-label="{label}"` -- provides an accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a clear close or cancel affordance in every dialog. For modal dialogs, dim the background to communicate that the main content is not interactive.
- **Developers**: Manage focus carefully -- move focus into the dialog when it opens and return it to the trigger element when it closes. Use the `modal` prop to control `aria-modal` behavior.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
