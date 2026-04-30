# Figure

## Metadata

- Component: figure
- PascalCase: Figure
- Description: a self-contained figure with optional caption
- HTML tag: <figure>
- CSS class: .figure
- Interactive: no

## Key Behaviors

- Renders a `<figure>` element with `role="img"` for semantic figure representation
- The `<figure>` element provides a natural container for graphical content
- Consumer provides all figure rendering (SVG, canvas, D3, Figure.js, etc.) via the `children` slot
- Accepts `...restProps` for forwarding additional attributes to the figure element
- No internal state -- purely a structural wrapper

## ARIA

- `role="img"` -- identifies the figure as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing the figure content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing what the figure represents, applied via `aria-label`
- `children`: slot (required) -- the figure visualization content

## Acceptance Criteria

- [ ] Renders <figure> element with class="figure"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .figure in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/figure.html
- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
