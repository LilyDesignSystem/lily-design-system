# Floating Panel

A floating panel is a container that overlays page content, typically used for tooltips, popovers, dropdown menus, or contextual UI. It renders conditionally based on an `open` prop, making it suitable for toggle-based visibility patterns. The component is headless, so consumers are responsible for positioning the panel relative to a trigger element using their own CSS.

## Implementation Notes

- Renders a `<div>` with `role="region"` only when the `open` prop is true
- Uses conditional rendering (fully removed from DOM when closed)
- Accepts a `children` slot for panel content
- Provides `aria-label` for accessible naming of the panel region
- Spreads `restProps` for consumer customization (e.g., positioning attributes)

## Props

- `open`: boolean (default: `false`) -- whether the panel is visible
- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: slot (required) -- panel content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

Chat widget floating above page content:

```html
<button onclick={() => (chatOpen = !chatOpen)}>Chat</button>
<FloatingPanel open={chatOpen} label="Live chat">
  <h3>Support chat</h3>
  <div class="messages">...</div>
  <input type="text" placeholder="Type a message..." />
</FloatingPanel>
```

Help panel triggered by a button:

```html
<FloatingPanel open={showHelp} label="Help">
  <h3>Need assistance?</h3>
  <p>Contact support at help@example.com</p>
</FloatingPanel>
```

## Keyboard Interactions

None -- this component is a passive container. Consumers should implement focus management and Escape-to-close behavior as needed for their use case.

## ARIA

- `role="region"` -- identifies the panel as a landmark region
- `aria-label="..."` -- provides an accessible name for the region

## When to Use

- Use for a panel that floats above page content, such as a chat widget or help panel.
- Use for tooltips, popovers, dropdown menus, or contextual UI that overlays page content.
- Use when content should be conditionally visible based on a toggle or trigger interaction.

## When Not to Use

- Do not use for modal overlays that block interaction with the rest of the page -- use Dialog instead.
- Do not use for slide-in panels -- use Drawer or Sheet instead.
- Do not use for persistent content that should always be visible -- use Panel or Card instead.

## Headless

This headless component provides a `<div>` with `role="region"` and `aria-label` that conditionally renders based on the `open` prop. The consumer provides all visual styling including positioning, shadows, borders, and z-index layering.


## Styles

The consumer provides all CSS styling. The component renders with a `.floating-panel` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `floating-panel`
- Verify role="region"` -- identifies the panel as a landmark region
- Verify aria-label="..."` -- provides an accessible name for the region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the floating panel has sufficient contrast and shadow to distinguish it from underlying content. Consider adding an arrow or caret pointing to the trigger element.
- **Developers**: Implement focus management and Escape-to-close behavior in your consumer code. Use CSS absolute/fixed positioning relative to the trigger element.

## References

- WAI-ARIA Practices - Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
