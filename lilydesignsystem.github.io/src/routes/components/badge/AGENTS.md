# Badge

## Metadata

- Component: badge
- PascalCase: Badge
- Description: a small label for counts, statuses, or categories
- HTML tag: <span>
- CSS class: .badge
- Interactive: no

## Key Behaviors

- Renders as `<span role="status">` for screen reader announcements of dynamic content
- `data-type` attribute exposes variant for consumer CSS styling
- `aria-label` provides expanded context when badge text alone is insufficient
- Five semantic variants: default, info, success, warning, error
- Content is provided through child elements

## ARIA

- `role="status"` -- creates an ARIA live region for dynamic content announcements
- `aria-label` -- optional expanded context for screen readers beyond the visible text

## Keyboard

- None -- badges are informational, not interactive

## Props

- `type`: "default" | "info" | "success" | "warning" | "error" (default: "default") -- badge variant for semantic meaning
- `label`: string (optional) -- accessible label for screen readers
- `children`: slot (required) -- badge content (text, number, etc.)
- `...restProps`: Any additional HTML attributes passed to the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="badge"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .badge in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/badge.html
