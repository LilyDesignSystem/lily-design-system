# NetPromoterScoreView

## Metadata

- Component: net-promoter-score-view
- PascalCase: NetPromoterScoreView
- Description: a read-only display of a Net Promoter Score
- HTML tag: <div>
- CSS class: .net-promoter-score-view
- Interactive: no

## Companion

- net-promoter-score-picker

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NPS score value as inline text content
- Read-only display component, not interactive
- Uses props for prop destructuring with rest props spread
- Value defaults to empty string when not provided
- No score validation or classification logic; consumers handle categorization and styling
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the context of the displayed score

## Keyboard

- None -- this is a passive informational display, not interactive

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NPS score to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="net-promoter-score-view"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .net-promoter-score-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/net-promoter-score-view.html
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
