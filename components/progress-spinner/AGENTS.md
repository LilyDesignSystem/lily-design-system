# ProgressSpinner

## Metadata

- Component: progress-spinner
- PascalCase: ProgressSpinner
- Description: an indeterminate spinning progress indicator
- HTML tag: <div>
- CSS class: .progress-spinner
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="status"` for implicit live region semantics
- Uses `aria-live="polite"` to ensure screen readers announce the loading state without interruption
- Provides `aria-label` for accessible naming of the loading state
- Accepts an optional `children` slot for content inside (e.g., loading text)
- Spreads `restProps` for consumer customization

## ARIA

- `role="status"` -- identifies the element as a status region that receives non-urgent updates
- `aria-label="..."` -- provides an accessible name describing what is loading
- `aria-live="polite"` -- ensures content changes are announced by screen readers at the next opportunity without interrupting

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the loading state via `aria-label`
- `children`: slot (default: `undefined`) -- optional content rendered inside (e.g., "Loading...")
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="progress-spinner"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .progress-spinner in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/progress-spinner.html
- WAI-ARIA `status` role: https://www.w3.org/WAI/ARIA/apd/roles/status/
- MDN `aria-live`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
