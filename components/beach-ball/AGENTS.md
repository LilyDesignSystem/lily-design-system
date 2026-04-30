# BeachBall

## Metadata

- Component: beach-ball
- PascalCase: BeachBall
- Description: a decorative animated beach ball element
- HTML tag: <div>
- CSS class: .beach-ball
- Interactive: no

## Key Behaviors

- Renders as a `<div>` with `role="status"` and `aria-live="polite"` for non-blocking loading announcements
- `aria-busy` reflects the `active` prop, signaling to assistive technologies whether loading is in progress
- `data-active` attribute mirrors the active state for CSS state selectors (e.g., `[data-active="true"]`)
- Inner `<span aria-hidden="true">` is only rendered when active; consumers target it for spinning/animation CSS
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `role="status"` -- identifies this as a status region that announces updates to screen readers
- `aria-live="polite"` -- ensures loading announcements do not interrupt the user's current task
- `aria-busy` -- set to `true` when active, signaling to assistive technologies that content is loading
- `aria-label` -- provides the accessible name describing what is loading, set from the `label` prop

## Keyboard

- None -- this is a passive informational indicator, not interactive

## Props

- `label`: string (required) -- accessible description of what is loading, via `aria-label`
- `active`: boolean (default: `true`) -- whether the loading indicator is currently active
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="beach-ball"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .beach-ball in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/beach-ball.html
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- ARIA aria-busy: https://www.w3.org/TR/wai-aria-1.2/#aria-busy
