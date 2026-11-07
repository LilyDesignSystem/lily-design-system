# ReviewDate

## Metadata

- Component: review-date
- PascalCase: ReviewDate
- Description: a display of a content review date
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <time>
- CSS class: .review-date
- Interactive: no

## Key Behaviors

- Renders as `<time datetime={datetime}>` holding hidden text from `label` and the children slot
- The `datetime` attribute uses ISO 8601 format for machine readability
- Children slot provides localized human-readable date text
- Semantic `<time>` element enables browser and assistive technology date parsing
- All additional HTML attributes are spread onto the time element via `restProps`

## ARIA

- `label` is hidden text in a `screen-reader-span`, read before the date; a name on `<time>` is not reliably read
- `datetime` -- machine-readable date attribute on the `<time>` element

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- hidden text read before the date, in a `screen-reader-span`
- `datetime`: string (required) -- ISO 8601 date/time string for machine readability
- `children`: slot (required) -- human-readable display text for the date
- `...restProps`: any -- additional HTML attributes spread onto the time element

## Acceptance Criteria

- [ ] Renders <span> element with class="review-date"
- [ ] Has the label as hidden text
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .review-date in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/review-date.html
