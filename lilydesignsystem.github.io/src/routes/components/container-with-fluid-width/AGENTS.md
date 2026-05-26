# ContainerWithFluidWidth

## Metadata

- Component: container-with-fluid-width
- PascalCase: ContainerWithFluidWidth
- Description: a full-width content wrapper with horizontal padding
- HTML tag: <div>
- CSS class: .container-with-fluid-width
- Interactive: no

## Key Behaviors

- Inline style `width: 100%; padding-inline: {paddingInline};` provides full-bleed plus edge padding
- `data-padding-inline` attribute mirrors the prop for consumer CSS hooks
- No max-width, background, or other visual treatment is applied

## ARIA

- None — purely structural

## Keyboard

- None

## Props

- `paddingInline`: string (default: "1rem") -- horizontal padding CSS value
- `children`: slot -- wrapped content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="container-with-fluid-width"
- [ ] Inline style sets width: 100%
- [ ] Inline style sets padding-inline to the paddingInline prop
- [ ] data-padding-inline attribute matches paddingInline prop
- [ ] Children content is preserved
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .container-with-fluid-width in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/container-with-fluid-width.html
- MDN padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline
