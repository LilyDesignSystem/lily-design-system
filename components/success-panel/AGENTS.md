# SuccessPanel

## Metadata

- Component: success-panel
- PascalCase: SuccessPanel
- Description: a panel confirming a task has been completed
- HTML tag: <div>
- CSS class: .success-panel
- Interactive: no

## Key Behaviors

- Renders a `<div role="alert" aria-live="polite">` so completion is announced to assistive technology
- Contains a heading (configurable level) and a message body slot
- Optionally renders a follow-up actions area (links/buttons) inside the panel
- Best placed at the top of the post-submission page, replacing the form
- Spreads `restProps` onto the root `<div>`

## ARIA

- `role="alert"` exposes the panel as an alert region
- `aria-live="polite"` ensures the heading and body are announced when the panel renders
- Heading level is configurable via the `headingLevel` prop (default `<h1>` — confirmation pages typically use the panel as the page's main heading)

## Keyboard

- No keyboard interactions on the panel itself
- Focus is moved to the panel by the consumer when navigating to the confirmation page so screen readers announce it immediately

## Props

- `title`: string (required) (default: —) — Confirmation headline
- `headingLevel`: 1 | 2 | 3 | 4 | 5 | 6 (default: 1) — Heading level used for `title`
- `reference`: string (default: —) — Optional reference number shown beneath the title
- `children`: slot (default: —) — Body content (next steps, links, etc.)
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="success-panel"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.success-panel` in css-style-sheet-template.css
- [GOV.UK Confirmation pages pattern](https://design-system.service.gov.uk/patterns/confirmation-pages/)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)
