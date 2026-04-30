# Notification

## Metadata

- Component: notification
- PascalCase: Notification
- Description: a brief message about an event or update
- HTML tag: <div>
- CSS class: .notification
- Interactive: no

## Key Behaviors

- Renders a `<div>` element with a live region role
- Uses `role="status"` and `aria-live="polite"` by default for non-urgent notifications
- When `urgent` is true, switches to `role="alert"` and `aria-live="assertive"`
- The `label` prop provides an accessible name via `aria-label`
- Content is provided via the `children` slot
- Rest props are spread onto the `<div>` element

## ARIA

- `role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- `role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- `aria-label="..."` -- provides an accessible name for the notification region
- `aria-live="polite"` -- default live region politeness; waits for user idle before announcing
- `aria-live="assertive"` -- applied when `urgent` is true; announces immediately

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) -- accessible name for the notification region via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: slot (required) -- the notification message content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="notification"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .notification in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/notification.html
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/WAI/ARIA/apd/practices/live-regions/
