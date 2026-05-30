# Draft

## Metadata

- Component: draft
- PascalCase: Draft
- Description: an early preliminary version of content such as an article, email, report, etc.
- HTML tag: <div>
- CSS class: .draft
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `draft`
- Optional `aria-label` describes the draft for screen readers
- Optional `data-status` attribute carries finer editorial state (e.g., "in-progress", "review", "ready-to-publish")

## ARIA

- `aria-label` -- describes the draft for screen readers when no visible heading is present

## Keyboard

- None -- drafts are content wrappers, not interactive

## Props

- `label`: string (optional) -- accessible label for the draft
- `status`: string (optional) -- editorial state, exposed as `data-status`
- `children`: slot (required) -- draft content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="draft"
- [ ] Has aria-label attribute when provided
- [ ] Has data-status attribute when status prop is provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .draft in css-style-sheet-template.css
