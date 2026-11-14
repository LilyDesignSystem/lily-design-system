# Immunization Record List Item

ImmunizationRecordListItem is one immunization in an immunization record list, with vaccine, date, dose and status. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="immunization-record-list-item">` with parts `-vaccine`, `-occurrence`, `-dose-number`, `-status`, `-lot-number`
- `status` (`completed`, `entered-in-error`, `not-done`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-occurrence` is a `<time datetime>`, shown only when its label is given
- The vaccine is never truncated

## Props

- `vaccine`: string (required) — the vaccine given; never truncated
- `occurrence`: string (optional) — when it was given, for <time datetime>
- `occurrenceLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `doseNumberLabel`: string (optional) — the dose in words ("Dose 2 of 2")
- `status`: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `lotNumber`: string (optional) — the vaccine's lot number
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<ImmunizationRecordListItem
  vaccine="MMR vaccine"
  occurrence="2025-09-12"
  occurrenceLabel="12 Sep 2025"
  doseNumberLabel="Dose 2 of 2"
  status="completed"
  statusLabel="Given"
  lotNumber="AB1234"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `immunization-record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `immunization-record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.immunization-record-list-item` class hook, and every word.

## Styles

`.immunization-record-list-item` and its parts, and `[data-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `immunization-record-list` — a list of a patient's immunizations, whose status is never blank

## References

- FHIR Immunization: https://hl7.org/fhir/R4/immunization.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
