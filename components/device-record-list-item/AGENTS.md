# DeviceRecordListItem

## Metadata

- Component: device-record-list-item
- PascalCase: DeviceRecordListItem
- Description: one medical device in a device record list, with its status and when it was used
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .device-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="device-record-list-item">` with parts `-device`, `-status`, `-timing`
- `status` (`active`, `completed`, `entered-in-error`, `intended`, `stopped`, `on-hold`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-timing` is a `<time datetime>`, shown only when its label is given
- The device is never truncated

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `device`: string (required) — the device; never truncated
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" (optional) — FHIR DeviceUseStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `timing`: string (optional) — when it was used, for <time datetime>
- `timingLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <li> with class="device-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .device-record-list-item in css-style-sheet-template.css
- FHIR DeviceUseStatement: https://hl7.org/fhir/R4/deviceusestatement.html
- Spec: spec/healthcare-ui/index.md
