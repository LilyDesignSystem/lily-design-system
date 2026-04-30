# StatusLight

## Metadata

- Component: status-light
- PascalCase: StatusLight
- Description: a small colored dot status indicator paired with a status label
- HTML tag: <span> with role="status"
- CSS class: .status-light
- Interactive: no

## Key Behaviors

- Renders <span class="status-light" role="status" data-variant={variant}>
- Renders <span class="status-light-dot" aria-hidden="true">
- Renders <span class="status-light-label">{label}</span>
- Variant defaults to "neutral"

## ARIA

- `role="status"` on the container
- Dot is `aria-hidden="true"` (color is decorative; the text label conveys state)
- Text label is the accessible content

## Variants

- `neutral` (default)
- `informative`
- `positive`
- `notice`
- `negative`
- `active`
- `inactive`

## Keyboard

- None — passive indicator

## Props

- `variant`: "neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive" (default "neutral")
- `label`: string (REQUIRED)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <span> element with class="status-light"
- [ ] role="status" is present
- [ ] data-variant equals the variant prop, defaulting to "neutral"
- [ ] Dot renders with class="status-light-dot" and aria-hidden="true"
- [ ] Label renders with class="status-light-label" and equals the label prop
- [ ] WCAG 2.2 AAA compliant (color is never the sole indicator)
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .status-light in css-style-sheet-template.css
- Adobe Spectrum Status Light: https://spectrum.adobe.com/page/status-light/
- WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
