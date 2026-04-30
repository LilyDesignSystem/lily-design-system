# WarningCallout

## Metadata

- Component: warning-callout
- PascalCase: WarningCallout
- Description: a callout box highlighting a warning message
- HTML tag: <div>
- CSS class: .warning-callout
- Interactive: no

## Key Behaviors

- Renders an `<aside>` element with `role="alert"` for immediate screen reader announcements
- The `role="alert"` implicitly sets `aria-live="assertive"`, meaning content is announced immediately
- The `label` prop is optional since the alert content itself provides the message
- Accepts `...restProps` for forwarding additional attributes to the aside element

## ARIA

- `role="alert"` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes
- `aria-label={label}` -- optional accessible name to distinguish this alert from others on the page

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) -- accessible name applied via `aria-label`; useful when multiple alerts exist on the same page
- `children`: slot (required) -- the warning content to display

## Acceptance Criteria

- [ ] Renders <div> element with class="warning-callout"
- [ ] Has aria-label attribute
- [ ] Has role="alert"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .warning-callout in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/warning-callout.html
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
