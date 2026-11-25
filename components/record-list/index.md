# Record List

RecordList is a list of records from one section of a patient's record, whose status is never blank. It renders as a `<ul>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- When `status` is `none-known` and the list holds an entry, the list never says both: the entry stays, and `conflictLabel`, your words for the conflict ("This list also says none are known. Check the source record."), replaces `statusLabel` as the item and the name. Without it, the status words go. An entry that is refuted or entered in error does not count.
- Renders `<ul class="record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.record-list-status`, so the list is never blank
- Holds `record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `conflictLabel`: string (optional) — your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; the list never says both
- `coverageLabel`: string (optional) — what the list is a view of, in the consumer's words: its window and order, what it leaves out and why, which sources did not answer. Rendered first, as `<li class="record-list-coverage">` (spec/lessons/zoblocks)
- `children`: slot (optional) — `record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<RecordList
  status="known"
  statusLabel="Vital signs"
>
  <RecordListItem
    status="final"
    statusLabel="Final"
    updated="2026-11-03"
    updatedLabel="Updated 3 Nov 2026"
    >Blood pressure 128/82 mmHg</RecordListItem
  >
</RecordList>

<RecordList
  status="none-known"
  statusLabel="No vital signs recorded"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## When to Use

- Use for a patient's records, wherever a missing list could be misread.
- Use with `none-known`, `not-recorded`, `unavailable` or `omitted` when there is nothing to list: each is a different fact.

## When Not to Use

- Do not leave the list empty for "none": set `status` instead.
- Do not use for a list that is not part of a patient's record — use `list` or `summary-list`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.record-list` class hook, and every word.

## Styles

`.record-list`, `.record-list-status` and `[data-status]`.

## Testing

- Each of the five statuses renders its consumer text; `known` renders only its items
- `label` overrides the accessible name
- A missing status raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `record-list-item` — one record in a record list, with its status and last update around the consumer's content
- `record-list` and the other record lists — the same status contract for each part of a record

## Known limitations

- In Svelte, React, Solid, Vue and Angular the entries are read from the page, so HTML from a server shows the status as given until the script runs. Nunjucks and Blazor decide on the server. In HTML and Alpine the markup is yours: write `data-status="conflict"` and your words.
- In Blazor and Compose only Lily's own items are counted.
- An entry about someone other than the patient counts.

## References

- IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
