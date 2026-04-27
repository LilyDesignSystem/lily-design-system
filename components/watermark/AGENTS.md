# Watermark

## Metadata

- Component: watermark
- PascalCase: Watermark
- Description: a decorative repeating overlay text or image marking a page
- HTML tag: <div>
- CSS class: .watermark
- Interactive: no

## Key Behaviors

- Renders <div class="watermark"> container with data-rotate and data-gap attributes
- Inner <div class="watermark-overlay" aria-hidden="true"> carries data-text and data-image-url
- Overlay is decorative and hidden from assistive tech
- Children render after the overlay element
- gap defaults to "100px"; rotate defaults to -22

## ARIA

- watermark-overlay has aria-hidden="true"
- Container has no ARIA role
- Underlying content remains fully accessible

## Keyboard

- None — purely decorative

## Props

- `text`: string (optional)
- `imageUrl`: string (optional)
- `gap`: string (default: "100px")
- `rotate`: number (default: -22)
- `children`: slot
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="watermark"
- [ ] data-rotate reflects rotate prop (default -22)
- [ ] data-gap reflects gap prop (default "100px")
- [ ] Inner <div class="watermark-overlay"> has aria-hidden="true"
- [ ] data-text is set on the overlay when text is provided
- [ ] data-image-url is set on the overlay when imageUrl is provided
- [ ] Children render after the overlay element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .watermark in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/watermark.html
- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
- Ant Design Watermark: https://ant.design/components/watermark
