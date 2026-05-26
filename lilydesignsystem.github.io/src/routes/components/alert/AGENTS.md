# Alert

## Metadata

- Component: alert
- PascalCase: Alert
- Description: a status message for important information or feedback
- HTML tag: <div>
- CSS class: .alert
- Interactive: no

## Key Behaviors

- Uses `role="alert"` with `aria-live="assertive"` by default for immediate screen reader announcements
- Supports `role="status"` with `aria-live="polite"` for less urgent messages
- `aria-atomic="true"` ensures the entire alert is re-read when content changes
- `data-type` attribute exposes severity type for CSS styling by consumers
- Heading rendered as `<p><strong>` for semantic emphasis without assuming heading level
- The `live` prop can override the default aria-live value derived from the role

## ARIA

- `role="alert"` or `role="status"` for live region semantics
- `aria-live="assertive"` (default for alert role) or `aria-live="polite"` (default for status role)
- `aria-atomic="true"` ensures the entire region is re-announced on any change

## Keyboard

- None -- alerts are passive announcements, not interactive elements

## Props

- `type`: "info" | "success" | "warning" | "error" (default: "info") -- severity type
- `heading`: string (optional) -- heading text for the alert
- `role`: "alert" | "status" (default: "alert") -- ARIA role
- `live`: "assertive" | "polite" | "off" (optional) -- override for aria-live politeness
- `children`: slot (required) -- the alert content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="alert"
- [ ] Has role="alert"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .alert in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/alert.html
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
