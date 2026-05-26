# SectionHeading

## Metadata

- Component: section-heading
- PascalCase: SectionHeading
- Description: a styled heading introducing a major content section, with optional eyebrow and subtitle
- HTML tag: <header>
- CSS class: .section-heading
- Interactive: no

## Key Behaviors

- Uses a native <header> element with class section-heading
- heading is REQUIRED and renders as <h{level}> with class section-heading-heading
- level accepts 2 | 3 | 4 | 5 | 6 (default 2)
- eyebrow renders as <p class="section-heading-eyebrow"> above the heading when provided
- subtitle renders as <p class="section-heading-subtitle"> below the heading when provided
- No JavaScript behavior; the component is passive

## ARIA

- Implicit semantics from <header> and the chosen heading element
- Heading element exposes the heading role with the appropriate level
- No additional ARIA needed

## Keyboard

- None (passive element)

## Props

- `heading`: string (REQUIRED) -- main heading text
- `eyebrow`: string (optional) -- eyebrow text above the heading
- `subtitle`: string (optional) -- subtitle text below the heading
- `level`: 2 | 3 | 4 | 5 | 6 (default: 2)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <header> element with class="section-heading"
- [ ] Heading element matches level prop (defaults to <h2>)
- [ ] Heading element has class="section-heading-heading"
- [ ] Eyebrow <p class="section-heading-eyebrow"> renders only when eyebrow provided
- [ ] Subtitle <p class="section-heading-subtitle"> renders only when subtitle provided
- [ ] level validation accepts only 2 through 6
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .section-heading in css-style-sheet-template.css
- MDN <header>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header
- MDN Heading Elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
- Mozilla Protocol Design System: https://protocol.mozilla.org/
