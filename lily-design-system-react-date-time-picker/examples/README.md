# Examples — DateTimePicker

| File | Shows |
| ---- | ----- |
| [basic.tsx](./basic.tsx) | The smallest useful call site: a labelled, controlled text field plus dialog, with minimal positioning CSS. |
| [nhs-booking.tsx](./nhs-booking.tsx) | `mode="datetime"`, `min`/`max`, `isDateDisabled` for a weekends-closed clinic, `shortcuts`, and a bilingual (English / Welsh) `locale` + `labels` switch. |

Every user-facing string is a prop, including the six required `labels`
keys — there is no English default anywhere in the component.
