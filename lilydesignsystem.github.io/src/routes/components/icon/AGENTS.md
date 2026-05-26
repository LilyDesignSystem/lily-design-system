# Icon

## Metadata

- Component: icon
- PascalCase: Icon
- Description: a container for displaying an icon
- HTML tag: <span>
- CSS class: .icon
- Interactive: no

## Key Behaviors

- Renders a `<span>` element as the icon wrapper
- Uses `role="img"` for meaningful icons that convey information
- Uses `aria-hidden="true"` for decorative icons that should be ignored by screen readers
- When `decorative` is true, the `role` attribute is omitted entirely
- Supports rest props spread for consumer customization
- Consumer provides icon content via the `children` slot

## ARIA

- `role="img"` -- applied to meaningful icons so assistive technology treats the span as an image
- `aria-label="..."` -- provides the accessible name for meaningful icons
- `aria-hidden="true"` -- applied when `decorative` is true, hiding the icon from the accessibility tree

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) -- accessible name announced by screen readers for meaningful icons
- `decorative`: boolean (default: false) -- when true, hides the icon from assistive technology and removes the img role
- `children`: slot (required) -- the icon content (text, SVG, or other markup)
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="icon"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .icon in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/icon.html
- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- WAI-ARIA Practices - Images: https://www.w3.org/WAI/tutorials/images/decorative/
