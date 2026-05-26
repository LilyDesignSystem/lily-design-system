# DateTime View

## Metadata

- Component: date-time-view
- PascalCase: DateTimeView
- Description: a read-only display of a formatted date and time
- HTML tag: <time>
- CSS class: .date-time-view
- Interactive: no

## Key Behaviors

- Renders semantic `<time>` element with `datetime={value}` attribute
- Display text fallback: children → format → value
- Does not localize — consumer supplies formatted display text
- `aria-label` rendered only when label prop provided

## ARIA

- Implicit `<time>` semantics
- `aria-label` for screen reader override (optional)

## Keyboard

- None — passive read-only display

## Props

- `value`: string (required) -- ISO 8601 datetime
- `format`: string (optional) -- pre-formatted display text
- `label`: string (optional) -- aria-label override
- `children`: slot (optional) -- overrides format
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <time> element with class="date-time-view"
- [ ] datetime attribute equals value prop
- [ ] Display text follows fallback chain: children → format → value
- [ ] aria-label is rendered when label prop is provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-time-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-time-view.html
- MDN time: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
