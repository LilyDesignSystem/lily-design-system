# ErrorSummary

## Metadata

- Component: error-summary
- PascalCase: ErrorSummary
- Description: a summary of all validation errors on a form
- HTML tag: <div>
- CSS class: .error-summary
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="alert"` for live-region announcement
- Uses `aria-labelledby` to associate the container with its heading
- Contains an `<h2>` element with a randomly generated ID for the `aria-labelledby` reference
- `tabindex="-1"` allows programmatic focus but does not place the element in the tab order
- Children slot is rendered after the heading for the error list content
- Spreads `restProps` on the outer `<div>` element
- Heading ID is generated with `Math.random().toString(36).slice(2, 9)` to avoid collisions

## ARIA

- `role="alert"` -- creates a live region that announces content to screen readers when the summary appears
- `aria-labelledby={titleId}` -- associates the alert region with its heading for context
- `tabindex="-1"` -- allows the error summary to receive programmatic focus without being in the natural tab order

## Keyboard

- **Tab**: Moves focus through the error links within the summary
- The container itself can receive programmatic focus via `element.focus()` due to `tabindex="-1"`

## Props

- `title`: string (required) -- heading text for the error summary (e.g., "There is a problem")
- `children`: slot (required) -- error list content, typically a `<ul>` with `<li>` items containing anchor links to error fields
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="error-summary"
- [ ] Has aria-label attribute
- [ ] Has role="alert"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .error-summary in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/error-summary.html
- GOV.UK Error Summary: https://design-system.service.gov.uk/components/error-summary/
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
