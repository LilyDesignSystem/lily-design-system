# Statistic

## Metadata

- Component: statistic
- PascalCase: Statistic
- Description: a numeric value display with title, prefix, and suffix
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .statistic
- Interactive: no

## Key Behaviors

- Renders <div class="statistic" role="group"> as container
- title prop is REQUIRED and rendered inside <div class="statistic-title">
- value prop is REQUIRED and rendered inside <div class="statistic-value">
- Optional prefix slot rendered inside <span class="statistic-prefix">
- Optional suffix slot rendered inside <span class="statistic-suffix">
- aria-label defaults to "{title}: {value}", overridable via the label prop
- Optional `change` renders `<div class="statistic-change">` with `data-trend` from `trend` (`up`, `down`, `flat`); the words
  name the comparison ("0.5 more than October 2024") and no arrow is rendered, since an arrow or colour alone is not meaning
- Optional `asOfLabel` renders `<time class="statistic-as-of" datetime="{asOf}">`; without the words there is no as-of line

## ARIA

- role="group"
- aria-label is the spoken summary of the statistic

## Keyboard

- None — passive display element

## Props

- `title`: string (REQUIRED)
- `value`: string (REQUIRED)
- `prefix`: slot (optional)
- `suffix`: slot (optional)
- `label`: string (optional)
- `change`: string (optional) — the change in words that name its comparison
- `trend`: "up" | "down" | "flat" (optional) — `data-trend` on the change, for the theme
- `asOf`: string (optional) — ISO 8601 date or date-time for the as-of `<time>`
- `asOfLabel`: string (optional) — when the value was measured, in words
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="statistic" and role="group"
- [ ] aria-label defaults to "{title}: {value}" when label is not provided
- [ ] aria-label equals the label prop when provided
- [ ] Title renders inside <div class="statistic-title">
- [ ] Value renders inside <div class="statistic-value">
- [ ] Prefix renders inside <span class="statistic-prefix"> only when provided
- [ ] Suffix renders inside <span class="statistic-suffix"> only when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .statistic in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/statistic.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- Ant Design Statistic: https://ant.design/components/statistic
