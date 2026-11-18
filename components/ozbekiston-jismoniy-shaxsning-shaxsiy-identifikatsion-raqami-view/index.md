# Ozbekiston Jismoniy Shaxsning Shaxsiy Identifikatsion Raqami View

OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView is a headless read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL), Uzbekistan's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
- Provides accessible name via the `label` prop
- Companion to OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal identification number (JShShIR / PINFL)">
    <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView
      label="Personal identification number (JShShIR / PINFL)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Personal identification number (JShShIR / PINFL) from Uzbekistan read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.

**Where to find it:** Printed on the back of the ID card and in the machine-readable zone of the passport, and used as the personal tax number.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input` — an input for entering Uzbekistan's Personal identification number (JShShIR / PINFL)
- `summary-list-item` — one key-value pair in a summary list

## References

- [Kun.uz: Where to find your PINFL](https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl)
- [Uzbekistan passport](https://en.wikipedia.org/wiki/Uzbekistan_passport)

---

Lily™ and Lily Design System™ are trademarks.
