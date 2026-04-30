# SummaryBox

## Metadata

- Component: summary-box
- PascalCase: SummaryBox
- Description: a boxed callout highlighting key takeaways or next steps from a longer page
- HTML tag: <aside>
- CSS class: .summary-box
- Interactive: no

## Key Behaviors

- Renders an `<aside>` (complementary landmark) with class `summary-box`
- `heading` prop is REQUIRED and rendered inside `<h3 class="summary-box-heading">`
- `aria-label` defaults to the heading text or uses the optional `label` override
- Children render inside `<div class="summary-box-body">`
- Pass-through attributes are forwarded to the root `<aside>`

## ARIA

- `<aside>` (complementary landmark) with `aria-label`
- aria-label defaults to heading text when label is not provided
- Heading is a real `<h3>` element appearing in the document outline

## Keyboard

- Tab: moves focus to interactive descendants of the body
- The box itself is not interactive

## Props

- `heading`: string (REQUIRED) -- box heading
- `label`: string (optional) -- aria-label override (defaults to heading)
- `children`: slot -- body content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <aside> with class="summary-box"
- [ ] Heading is rendered inside <h3 class="summary-box-heading">
- [ ] Heading text equals the heading prop
- [ ] aria-label defaults to heading when label is omitted
- [ ] aria-label uses label when supplied
- [ ] Children render inside <div class="summary-box-body">
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .summary-box in css-style-sheet-template.css
- US Web Design System Summary Box: https://designsystem.digital.gov/components/summary-box/
- WAI-ARIA complementary role: https://www.w3.org/TR/wai-aria-1.2/#complementary
