# Icon

An icon is a compact visual element that represents actions, objects, or concepts using simplified graphical symbols. The Icon component provides a headless wrapper around icon content with proper accessibility semantics, supporting both meaningful icons (with accessible labels) and decorative icons (hidden from assistive technology).

This component is useful in buttons, menus, toolbars, and navigation where visual cues help users quickly identify functions. The consumer provides the actual icon content (text characters, SVG, or any markup), while the component handles the semantic role and ARIA attributes.

## Implementation Notes

- Renders a `<span>` element as the icon wrapper
- Uses `role="img"` for meaningful icons that convey information
- Uses `aria-hidden="true"` for decorative icons that should be ignored by screen readers
- When `decorative` is true, the `role` attribute is omitted entirely
- Supports rest props spread for consumer customization
- Consumer provides icon content via the `children` slot

## Props

- `label`: string (optional) -- accessible name announced by screen readers for meaningful icons
- `decorative`: boolean (default: false) -- when true, hides the icon from assistive technology and removes the img role
- `children`: slot (required) -- the icon content (text, SVG, or other markup)
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Meaningful icon with accessible label -->
<Icon label="Close">x</Icon>

<!-- Decorative icon hidden from screen readers -->
<Icon decorative>*</Icon>

<!-- Icon with custom attributes -->
<Icon label="Search" data-testid="search-icon">Q</Icon>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard behavior depends on the parent interactive element (such as a button wrapping the icon).

## ARIA

- `role="img"` -- applied to meaningful icons so assistive technology treats the span as an image
- `aria-label="..."` -- provides the accessible name for meaningful icons
- `aria-hidden="true"` -- applied when `decorative` is true, hiding the icon from the accessibility tree

## When to Use

- Use to display a visual symbol representing an action, object, or concept in buttons, menus, toolbars, or navigation.
- Use with `decorative` for icons that are purely visual and have adjacent text labels.
- Avoid using a meaningful icon without a `label` prop; screen reader users would miss the icon's purpose.

## When Not to Use

- Do not use as the only target of a click — wrap interactive icons in `IconButton` or another button so they pick up button semantics and focus styles.
- Do not use to render a single emoji character that already has a textual meaning — use `Emoji` for that.
- Do not use as a substitute for a labeled image with caption — use `Figure` for content imagery.
- Do not use without `label` for an icon that conveys meaning standalone, and do not pass a `label` to a decorative icon.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label` for meaningful icons, or `aria-hidden="true"` for decorative icons. The consumer provides all visual content (SVG, text characters, icon fonts) and styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.icon` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `icon`
- Verify role="img"` -- applied to meaningful icons so assistive technology treats the span as an image
- Verify aria-label="..."` -- provides the accessible name for meaningful icons
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure icons are visually clear at small sizes. Pair icons with text labels when the meaning may be ambiguous. Maintain consistent icon sizing across the interface.
- **Developers**: Set `decorative={true}` when the icon is adjacent to a text label that conveys the same meaning. Always provide `label` for standalone icons.

## Related components

- `icon-button` — a button containing only an icon with a required accessible label
- `emoji` — a single emoji character with accessible name
- `qr-code` — a QR code image generated from text or URL data

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- WAI-ARIA Practices - Images: https://www.w3.org/WAI/tutorials/images/decorative/

---

Lily™ and Lily Design System™ are trademarks.
