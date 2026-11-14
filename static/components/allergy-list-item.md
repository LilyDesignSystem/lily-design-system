# Allergy List Item

AllergyListItem is one allergy or intolerance in an `allergy-list`: the substance, the reaction, the severity and when the record was last updated. It renders as an `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="allergy-list-item">` with parts `-substance`, `-reaction`, `-severity` and `-updated`
- `severity` (`mild`, `moderate`, `severe`, the FHIR AllergyIntolerance reaction severity) renders as `data-severity`, and its words as text
- `-updated` is a `<time datetime>`, shown only when `updatedLabel` is given
- The substance is never truncated

## Props

- `substance`: string (required) — what the patient reacts to
- `reaction`: string (optional) — the manifestation
- `severity`: "mild" | "moderate" | "severe" (optional) — rendered as `data-severity`
- `severityLabel`: string (optional) — the severity in words
- `updated`: string (optional) — when the record was last updated, for `<time datetime>`
- `updatedLabel`: string (optional) — that date as the consumer writes it
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<AllergyListItem
  substance="Penicillin"
  reaction="Anaphylaxis"
  severity="severe"
  severityLabel="Severe"
  updated="2026-11-03"
  updatedLabel="Updated 3 Nov 2026"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; severity is text, never colour alone

## When to Use

- Use inside `allergy-list` for each recorded allergy or intolerance.
- Use when severity and the date of the record matter to the reader.

## When Not to Use

- Do not use outside an `allergy-list`.
- Do not use for a status such as "no known allergies" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.allergy-list-item` class hook, and every word.

## Styles

`.allergy-list-item` and its parts, and `[data-severity]`.

## Testing

- Each part renders, the date as a `<time datetime>`
- Only the given parts render

## Advice

- Write the substance as the consumer's terminology names it; do not shorten it.
- Format the date with `Intl.DateTimeFormat`, with the month as text so it is unambiguous.

## Related components

- `allergy-list` — a list of a patient's allergies and intolerances

## References

- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md

---

Lily™ and Lily Design System™ are trademarks.
