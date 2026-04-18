# Icon

An icon is a compact visual element that represents actions, objects, or concepts using simplified graphical symbols. The Icon component provides a headless wrapper around icon content with proper accessibility semantics, supporting both meaningful icons (with accessible labels) and decorative icons (hidden from assistive technology).

This component is useful in buttons, menus, toolbars, and navigation where visual cues help users quickly identify functions. The consumer provides the actual icon content (text characters, SVG, or any markup), while the component handles the semantic role and ARIA attributes.

## Implementation Notes

- Renders a `<span>` element as the icon wrapper
- Uses `role="img"` for meaningful icons that convey information
- Uses `aria-hidden="true"` for decorative icons that should be ignored by screen readers
- When `decorative` is true, the `role` attribute is omitted entirely
- Supports rest props spread for consumer customization
- Consumer provides icon content via the `children` snippet

## Props

- `label`: string (optional) -- accessible name announced by screen readers for meaningful icons
- `decorative`: boolean (default: false) -- when true, hides the icon from assistive technology and removes the img role
- `children`: Snippet (required) -- the icon content (text, SVG, or other markup)
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
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

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- WAI-ARIA Practices - Images: https://www.w3.org/WAI/tutorials/images/decorative/
