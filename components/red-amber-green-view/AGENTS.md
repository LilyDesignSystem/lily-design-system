# RedAmberGreenView

## Metadata

- Component: red-amber-green-view
- PascalCase: RedAmberGreenView
- Description: a read-only display of a red/amber/green status
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .red-amber-green-view
- Interactive: no

## Companion

- red-amber-green-picker

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Read-only display component, not interactive
- Value defaults to an empty string when not provided
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<span>` element for consumer extensibility
- No hardcoded user-facing strings; label and value are fully configurable

## ARIA

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the RAG status to display (e.g., "red", "amber", "green")
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="red-amber-green-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-amber-green-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-amber-green-view.html
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
