# StatusTag

## Metadata

- Component: status-tag
- PascalCase: StatusTag
- Description: a tag showing the current status of a task
- HTML tag: <span>
- CSS class: .status-tag
- Interactive: no

## Key Behaviors

- Renders a `<span>` with the status text inside
- The semantics are conveyed by the visible text and (optionally) `aria-label` — colour alone is never the indicator
- Accepts a `tone` prop (e.g. `"success"`, `"warning"`, `"danger"`, `"info"`) which the consumer can use to drive class-based styling
- Spreads `restProps` onto the root `<span>`

## ARIA

- `role="status"` is NOT applied by default — this component is a static label, not a live region
- Consumers wanting screen reader announcements when status changes should wrap the tag in a `Notification` or apply `aria-live="polite"` themselves

## Keyboard

- No keyboard interactions — this is a passive label

## Props

- `label`: string (required) (default: —) — Status text shown to users
- `tone`: "neutral" | "success" | "warning" | "danger" | "info" (default: "neutral") — Tone hint used by consumers to drive styling
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<span>`

## Acceptance Criteria

- [ ] Renders <span> element with class="status-tag"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.status-tag` in css-style-sheet-template.css
- [GOV.UK Tag pattern](https://design-system.service.gov.uk/components/tag/)
