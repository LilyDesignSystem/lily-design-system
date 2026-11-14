# EarlyWarningScoreView

## Metadata

- Component: early-warning-score-view
- PascalCase: EarlyWarningScoreView
- Description: a read-only display of an early warning score, with its band and escalation text
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .early-warning-score-view
- Interactive: no

## Key Behaviors

- Renders `<span class="early-warning-score-view">` with parts `-system`, `-score`, `-band` and `-escalation`
- `band` is the consumer's key, rendered as `data-band`; `bandLabel` is its words and is required with it (a development warning says so)
- Computes nothing: scoring systems differ by country and population, and scoring is the consumer's validated code

## ARIA

- No role and no `aria-label`; `label` renders as hidden text. The band is text, never colour alone

## Keyboard

- Not interactive

## Props

- `score`: string | number (required) — the score the consumer computed
- `system`: string (optional) — the scoring system's name, such as NEWS2
- `band`: string (optional) — the consumer's band key, rendered as `data-band`
- `bandLabel`: string (optional) — the band in words; required with `band`
- `escalation`: string (optional) — what to do
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> with class="early-warning-score-view"
- [x] Each part renders, and `band` renders as `data-band`
- [x] A band with no words raises a development warning
- [x] It contains no scoring code (review)
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .early-warning-score-view in css-style-sheet-template.css
- Spec: spec/healthcare-ui/index.md
