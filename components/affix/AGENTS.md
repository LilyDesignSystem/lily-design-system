# Affix

## Metadata

- Component: affix
- PascalCase: Affix
- Description: a wrapper that pins its content to a viewport position while the page scrolls
- HTML tag: <div>
- CSS class: .affix
- Interactive: no

## Key Behaviors

- Renders <div class="affix"> with inline style position: sticky
- Uses top: {offsetTop}px when offsetTop is provided
- Uses bottom: {offsetBottom}px when offsetBottom is provided
- Defaults to top: 0 if neither offset is provided
- Emits data-offset-top and data-offset-bottom for consumer CSS hooks
- Purely structural — no ARIA semantics

## ARIA

- None — purely structural

## Keyboard

- None — passive layout wrapper

## Props

- `offsetTop`: number (px, optional)
- `offsetBottom`: number (px, optional)
- `children`: slot — content to pin
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="affix"
- [ ] Inline style includes position: sticky
- [ ] Inline style applies top: {offsetTop}px when offsetTop is provided
- [ ] Inline style applies bottom: {offsetBottom}px when offsetBottom is provided
- [ ] Defaults to top: 0 when neither offset is provided
- [ ] data-offset-top and data-offset-bottom data attributes are emitted when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .affix in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/affix.html
- MDN position: sticky: https://developer.mozilla.org/docs/Web/CSS/position#sticky
- Ant Design Affix: https://ant.design/components/affix
