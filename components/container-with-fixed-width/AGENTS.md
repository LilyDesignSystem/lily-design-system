# ContainerWithFixedWidth

## Metadata

- Component: container-with-fixed-width
- PascalCase: ContainerWithFixedWidth
- Description: a centered content wrapper with a fixed max-width breakpoint
- HTML tag: <div>
- CSS class: .container-with-fixed-width
- Interactive: no

## Key Behaviors

- Inline style `max-width: {maxWidth}; margin-inline: auto;` provides the centering and width cap
- `data-max-width` attribute mirrors the prop for consumer CSS hooks
- No padding, background, or other visual treatment is applied

## ARIA

- None — purely structural

## Keyboard

- None

## Props

- `maxWidth`: string (default: "1200px") -- max-width CSS value
- `children`: slot -- wrapped content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="container-with-fixed-width"
- [ ] Inline style sets max-width to the maxWidth prop
- [ ] Inline style sets margin-inline: auto for centering
- [ ] data-max-width attribute matches maxWidth prop
- [ ] Children content is preserved
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .container-with-fixed-width in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/container-with-fixed-width.html
- MDN max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
