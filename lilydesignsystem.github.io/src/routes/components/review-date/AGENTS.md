# ReviewDate

## Metadata

- Component: review-date
- PascalCase: ReviewDate
- Description: a display of a content review date
- HTML tag: <span>
- CSS class: .review-date
- Interactive: no

## Key Behaviors

- Renders as `<time aria-label={label} datetime={datetime}>` with children slot
- The `datetime` attribute uses ISO 8601 format for machine readability
- Children slot provides localized human-readable date text
- Semantic `<time>` element enables browser and assistive technology date parsing
- All additional HTML attributes are spread onto the time element via `restProps`

## ARIA

- `aria-label` -- provides screen reader context from the `label` prop
- `datetime` -- machine-readable date attribute on the `<time>` element

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `datetime`: string (required) -- ISO 8601 date/time string for machine readability
- `children`: slot (required) -- human-readable display text for the date
- `...restProps`: any -- additional HTML attributes spread onto the time element

## Acceptance Criteria

- [ ] Renders <span> element with class="review-date"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .review-date in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/review-date.html
