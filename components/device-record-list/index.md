# Device Record List

DeviceRecordList is a list of a patient's medical devices, whose status is never blank. It renders as a `<ul>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<ul class="device-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.device-record-list-status`, so the list is never blank
- Holds `device-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `device-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<DeviceRecordList
  status="known"
  statusLabel="Medical devices"
>
  <DeviceRecordListItem
    device="Cardiac pacemaker"
    status="active"
    statusLabel="In use"
    timing="2021-02-08"
    timingLabel="Since 8 Feb 2021"
  />
</DeviceRecordList>

<DeviceRecordList
  status="none-known"
  statusLabel="No known medical devices"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## When to Use

- Use for a patient's devices, wherever a missing list could be misread.
- Use with `none-known`, `not-recorded`, `unavailable` or `omitted` when there is nothing to list: each is a different fact.

## When Not to Use

- Do not leave the list empty for "none": set `status` instead.
- Do not use for a list that is not part of a patient's record — use `list` or `summary-list`.
- For another part of the record, use its own record list, or `record-list`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.device-record-list` class hook, and every word.

## Styles

`.device-record-list`, `.device-record-list-status` and `[data-status]`.

## Testing

- Each of the five statuses renders its consumer text; `known` renders only its items
- `label` overrides the accessible name
- A missing status raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `device-record-list-item` — one medical device in a device record list, with its status and when it was used
- `record-list` and the other record lists — the same status contract for each part of a record

## References

- FHIR DeviceUseStatement: https://hl7.org/fhir/R4/deviceusestatement.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
