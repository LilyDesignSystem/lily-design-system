# Device Record List Item

DeviceRecordListItem is one medical device in a device record list, with its status and when it was used. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="device-record-list-item">` with parts `-device`, `-status`, `-timing`
- `status` (`active`, `completed`, `entered-in-error`, `intended`, `stopped`, `on-hold`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-timing` is a `<time datetime>`, shown only when its label is given
- The device is never truncated

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `device`: string (required) — the device; never truncated
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" (optional) — FHIR DeviceUseStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `timing`: string (optional) — when it was used, for <time datetime>
- `timingLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<DeviceRecordListItem
  device="Cardiac pacemaker"
  status="active"
  statusLabel="In use"
  timing="2021-02-08"
  timingLabel="Since 8 Feb 2021"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `device-record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `device-record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.device-record-list-item` class hook, and every word.

## Styles

`.device-record-list-item` and its parts, and `[data-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `device-record-list` — a list of a patient's medical devices, whose status is never blank

## References

- FHIR DeviceUseStatement: https://hl7.org/fhir/R4/deviceusestatement.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
