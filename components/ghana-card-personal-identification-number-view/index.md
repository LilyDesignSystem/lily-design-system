# Ghana Card Personal Identification Number View

GhanaCardPersonalIdentificationNumberView is a headless read-only display of Ghana's Ghana Card PIN, Ghana's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to GhanaCardPersonalIdentificationNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
- Provides accessible name via the `label` prop
- Companion to GhanaCardPersonalIdentificationNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Ghana Card PIN">
    <GhanaCardPersonalIdentificationNumberView
      label="Ghana Card PIN"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Ghana Card PIN from Ghana read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ghana-card-personal-identification-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ghana-card-personal-identification-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.

**Where to find it:** Printed on the Ghana Card issued by the National Identification Authority (NIA); it is also the personal tax number (TIN) used by the Ghana Revenue Authority.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `ghana-card-personal-identification-number-input` — an input for entering Ghana's Ghana Card PIN
- `summary-list-item` — one key-value pair in a summary list

## References

- [Ghana Card](https://en.wikipedia.org/wiki/Ghana_Card)
- [National Identification Authority: The GhanaCard](https://nia.gov.gh/the-ghanacard-introduction/)

---

Lily™ and Lily Design System™ are trademarks.
