# AspectRatioContainer

## Metadata

- Component: aspect-ratio-container
- PascalCase: AspectRatioContainer
- Description: a container that maintains a fixed aspect ratio
- HTML tag: <div>
- CSS class: .aspect-ratio-container
- Interactive: no

## Key Behaviors

- Pure layout utility -- no ARIA role needed
- Uses inline `aspect-ratio` CSS property
- `data-aspect-ratio` attribute exposed for consumer CSS selectors
- Ratio prop is a number (width/height), e.g., `16/9` evaluates to `1.777...`
- Content is provided through child elements

## ARIA

- None -- transparent layout container; content within maintains its own accessibility semantics

## Keyboard

- None -- this component is a passive layout container

## Props

- `ratio`: number (default: 1) -- aspect ratio as width/height
- `children`: slot (required) -- content to display within the container
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="aspect-ratio-container"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .aspect-ratio-container in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/aspect-ratio-container.html
