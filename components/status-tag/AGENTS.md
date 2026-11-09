# StatusTag

## Metadata

- Component: status-tag
- PascalCase: StatusTag
- Description: a tag showing the current status of a task
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .status-tag
- Interactive: no

## Key Behaviors

- Renders a `<span>` with the status text inside
- The semantics are conveyed by the visible text and (optionally) `label`, rendered as hidden text in a `screen-reader-span` because a `<span>` cannot take a name — colour alone is never the indicator
- Accepts a `type` prop (`"default"`, `"info"`, `"success"`, `"warning"`, `"error"`), rendered as `data-type` for the theme or consumer CSS, as on `alert`, `badge` and `banner`
- Spreads `restProps` onto the root `<span>`

## ARIA

- `role="status"` is NOT applied by default — this component is a static label, not a live region
- Consumers wanting screen reader announcements when status changes should wrap the tag in a `Notification` or apply `aria-live="polite"` themselves

## Keyboard

- No keyboard interactions — this is a passive label

## Props

- `label`: string (optional) (default: —) — Hidden text read before the content
- `type`: "default" | "info" | "success" | "warning" | "error" (default: "default") — The status, rendered as `data-type`; the themes colour `.status-tag[data-type]`. Meaning still comes from the text (WCAG 1.4.1)
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
