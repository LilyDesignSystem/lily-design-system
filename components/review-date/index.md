# Review Date

A review date component displays a date associated with a review, audit, or scheduled check-in. It renders as a semantic HTML `<time>` element with a machine-readable `datetime` attribute in ISO 8601 format and human-readable display text provided through a children slot. This separation allows browsers and assistive technologies to parse the date for accurate interpretation while displaying a user-friendly formatted date.

The component is commonly used in dashboards, compliance tracking, audit logs, and scheduling interfaces where dates need to be both human-readable and machine-parseable.

## Implementation Notes

- Renders as `<time aria-label={label} datetime={datetime}>` with children slot
- The `datetime` attribute uses ISO 8601 format for machine readability
- Children slot provides localized human-readable date text
- Semantic `<time>` element enables browser and assistive technology date parsing
- All additional HTML attributes are spread onto the time element via `restProps`

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `datetime`: string (required) -- ISO 8601 date/time string for machine readability
- `children`: slot (required) -- human-readable display text for the date
- `...restProps`: any -- additional HTML attributes spread onto the time element

## Usage

```html
<!-- Display last reviewed and next review dates at the bottom of a content page -->
<p>
  Page last reviewed:
  <ReviewDate label="Last reviewed" datetime="2025-03-15">15 March 2025</ReviewDate>
</p>
<p>
  Next review due:
  <ReviewDate label="Next review due" datetime="2028-03-15">15 March 2028</ReviewDate>
</p>

<!-- Single review date in a compliance dashboard -->
<ReviewDate label="Last audit" datetime="2025-01-08">8 January 2025</ReviewDate>

<!-- Dynamic date with locale-formatted display text -->
<ReviewDate label="Next review" datetime={isoDate}>{formattedDate}</ReviewDate>
```

## Keyboard Interactions

None -- this is an informational display, not interactive.

## ARIA

- `aria-label` -- provides screen reader context from the `label` prop
- `datetime` -- machine-readable date attribute on the `<time>` element

## When to Use

- Use on content pages to reassure users that the information has been recently reviewed and is up to date
- Use when user research shows that knowing the review date increases trust in the content
- Use at the bottom of the page as low-priority supplementary information
- Use to display both the last reviewed date and the next review due date

## When Not to Use

- Do not use on transactional pages -- review dates are not meaningful in form-based journeys
- Do not use when only part of a page has changed -- the review date should reflect a full page review
- Do not use for real-time or frequently changing content -- the static date pattern does not suit dynamic data

## Headless

The ReviewDate headless component provides a `<time>` element with `aria-label` for accessible naming and a `datetime` attribute in ISO 8601 format for machine readability. The children slot renders human-readable text. The consumer provides all visual styling and date formatting.


## Styles

The consumer provides all CSS styling. The component renders with a `.review-date` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `review-date`
- Verify aria-label` -- provides screen reader context from the `label` prop
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display dates in a format familiar to your target audience (e.g., "June 15, 2025" for US, "15 June 2025" for UK) and visually distinguish upcoming vs. past review dates.
- **Developers**: Always pass a valid ISO 8601 string to `datetime` and format the children text using locale-appropriate date formatting for human readability.
