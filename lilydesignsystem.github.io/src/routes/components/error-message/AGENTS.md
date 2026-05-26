# ErrorMessage

## Metadata

- Component: error-message
- PascalCase: ErrorMessage
- Description: an error message associated with a form field
- HTML tag: <span>
- CSS class: .error-message
- Interactive: no

## Key Behaviors

- Renders a `<p>` element with `role="alert"` for immediate screen reader announcement
- The alert role creates an implicit `aria-live="assertive"` region
- Children provide the error text content via a slot
- Spreads `restProps` onto the `<p>` element for consumer customization

## ARIA

- `role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- error message text content

## Acceptance Criteria

- [ ] Renders <span> element with class="error-message"
- [ ] Has role="alert"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .error-message in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/error-message.html
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
