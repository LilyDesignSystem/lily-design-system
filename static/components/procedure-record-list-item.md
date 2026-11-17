# Procedure Record List Item

ProcedureRecordListItem is one procedure in a procedure record list, with its status and when it was performed. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="procedure-record-list-item">` with parts `-procedure`, `-status`, `-performed`
- `status` (`preparation`, `in-progress`, `not-done`, `on-hold`, `stopped`, `completed`, `entered-in-error`, `unknown`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-performed` is a `<time datetime>`, shown only when its label is given
- The procedure is never truncated

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `procedure`: string (required) — the procedure; never truncated
- `status`: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown" (optional) — FHIR Procedure status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `performed`: string (optional) — when it was performed, for <time datetime>
- `performedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<ProcedureRecordListItem
  procedure="Appendectomy"
  status="completed"
  statusLabel="Completed"
  performed="2018-04-22"
  performedLabel="22 Apr 2018"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `procedure-record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `procedure-record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.procedure-record-list-item` class hook, and every word.

## Styles

`.procedure-record-list-item` and its parts, and `[data-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `procedure-record-list` — a list of a patient's procedures, whose status is never blank

## References

- FHIR Procedure: https://hl7.org/fhir/R4/procedure.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
