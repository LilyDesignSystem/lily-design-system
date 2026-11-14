# Allergy Record List

AllergyRecordList is a list of a patient's allergies and intolerances, whose status is never blank. It renders as a `<ul>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<ul class="allergy-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`
- For any status but `known`, `statusLabel` is the list's one item, `li.allergy-record-list-status`, so the list is never blank
- Holds `allergy-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `allergy-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<AllergyRecordList
  status="known"
  statusLabel="Known allergies"
>
  <AllergyRecordListItem
    substance="Penicillin"
    reaction="Anaphylaxis"
    severity="severe"
    severityLabel="Severe"
    criticality="high"
    criticalityLabel="High risk"
    clinicalStatus="active"
    clinicalStatusLabel="Active"
    verificationStatus="confirmed"
    verificationStatusLabel="Confirmed"
    typeLabel="Allergy"
    categoryLabel="Medication"
    updated="2026-11-03"
    updatedLabel="Updated 3 Nov 2026"
  />
</AllergyRecordList>

<AllergyRecordList
  status="none-known"
  statusLabel="No known allergies"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## When to Use

- Use for a patient's allergies, wherever a missing list could be misread.
- Use with `none-known`, `not-recorded`, `unavailable` or `omitted` when there is nothing to list: each is a different fact.

## When Not to Use

- Do not leave the list empty for "none": set `status` instead.
- Do not use for a list that is not part of a patient's record — use `list` or `summary-list`.
- For another part of the record, use its own record list, or `record-list`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.allergy-record-list` class hook, and every word.

## Styles

`.allergy-record-list`, `.allergy-record-list-status` and `[data-status]`.

## Testing

- Each of the five statuses renders its consumer text; `known` renders only its items
- `label` overrides the accessible name
- A missing status raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `allergy-record-list-item` — one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status
- `record-list` and the other record lists — the same status contract for each part of a record

## References

- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
