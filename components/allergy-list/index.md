# Allergy List

AllergyList is a headless list of a patient's allergies and intolerances. It renders as a `<ul>`. Its status is required, because "no known allergies", "allergies not recorded" and "allergies unavailable" are different facts, and an empty list could be read as any of them.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<ul class="allergy-list">` with `data-status` and `aria-label`
- `status` is required: `known`, `none-known`, `not-recorded` or `unavailable`
- For any status but `known`, `statusLabel` is the list's one item, `li.allergy-list-status`, so the list is never blank
- Holds `allergy-list-item` children for status `known`
- A missing `status` or `statusLabel` raises a development warning

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `allergy-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<AllergyList
  status="known"
  statusLabel="Known allergies"
>
  <AllergyListItem
    substance="Penicillin"
    reaction="Anaphylaxis"
    severity="severe"
    severityLabel="Severe"
  />
</AllergyList>

<AllergyList
  status="none-known"
  statusLabel="No known allergies"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- A `<ul>` named by `aria-label` (the status words, or `label`). The status is text, never an icon or a colour alone

## When to Use

- Use to show a patient's allergies in a patient banner, summary or prescribing screen.
- Use whenever the absence of allergies must be distinguished from allergies not being recorded.
- Use with `medical-banner-box-for-danger` to keep known allergies prominent.

## When Not to Use

- Do not use for a general list — use `bullet-list` or `description-list`.
- Do not use to edit allergies — use a `form` with `field` and `text-input`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.allergy-list` class hook, and every word.

## Styles

`.allergy-list`, `.allergy-list-status`, and the `[data-status]` attribute (for example, the strongest emphasis on `known`).

## Testing

- Each status renders its words; for statuses other than `known` they are the one item
- The list is named by its status
- A missing status raises a development warning

## Advice

- Show when each allergy record was last updated, and link to the full record.
- Do not show clinical information such as allergies to people who should not see it; that is the consumer's access control.
- Never abbreviate the status words.

## Related components

- `allergy-list-item` — one allergy or intolerance in an allergy list
- `medical-banner-box-for-danger` — a medical record banner box for danger information

## References

- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md

---

Lily™ and Lily Design System™ are trademarks.
