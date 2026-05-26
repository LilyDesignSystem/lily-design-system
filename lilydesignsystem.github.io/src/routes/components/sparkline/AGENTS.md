# Sparkline

## Metadata

- Component: sparkline
- PascalCase: Sparkline
- Description: a small inline chart showing a data trend
- HTML tag: <span>
- CSS class: .sparkline
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="img"` to semantically represent a graphical image
- Consumer provides all chart rendering (SVG, canvas, etc.) via the `children` slot
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state or effects -- purely a structural wrapper

## ARIA

- `role="img"` -- identifies the container as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing what the sparkline represents

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the sparkline data, applied via `aria-label`
- `children`: slot (required) -- the visualization content to render inside the container

## Acceptance Criteria

- [ ] Renders <span> element with class="sparkline"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sparkline in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/sparkline.html
- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
