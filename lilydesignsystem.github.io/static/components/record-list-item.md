# Record List Item

RecordListItem is one record in a record list, with its status and last update around the consumer's content. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="record-list-item">` with parts `-status`, `-updated`
- `status` (the consumer's code) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-updated` is a `<time datetime>`, shown only when its label is given

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `children`: slot — the record itself, written by the consumer
- `status`: string (optional) — the record's status, as the consumer's code; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `updated`: string (optional) — when the record was last updated
- `updatedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<RecordListItem
  status="final"
  statusLabel="Final"
  updated="2026-11-03"
  updatedLabel="Updated 3 Nov 2026"
>
  Blood pressure 128/82 mmHg
</RecordListItem>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.record-list-item` class hook, and every word.

## Styles

`.record-list-item` and its parts, and `[data-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `record-list` — a list of records from one section of a patient's record, whose status is never blank

## References

- IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
