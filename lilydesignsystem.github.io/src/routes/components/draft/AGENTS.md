# Draft

## Metadata

- Component: draft
- PascalCase: Draft
- Description: an early preliminary version of content such as an article, email, report, etc.
- Purpose: Marks content as an unfinished version, so nobody mistakes it for the published one.
- Status: experimental — recent catalog addition with the least accumulated depth; contract may still move
- HTML tag: <div>
- CSS class: .draft
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `draft`
- Optional `aria-label` describes the draft for screen readers
- Optional `data-status` attribute carries finer editorial state (e.g., "in-progress", "review", "ready-to-publish")

## ARIA

- With a `label`, the root is `role="group"`, because a plain `<div>` cannot be named. Without one it has no role
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

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .draft in css-style-sheet-template.css
