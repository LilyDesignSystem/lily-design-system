# Examples — DateTimePicker

Self-contained Svelte 5 examples. Each is runnable as-is in a SvelteKit or
Vite + Svelte app; adjust the import to the published package name
(`lily-design-system-svelte-date-time-picker`) outside this repo.

| Example | Shows |
| ------- | ----- |
| [`basic.svelte`](./basic.svelte) | The smallest useful call site, plus the minimum CSS the dialog needs to overlay rather than sit in normal flow. |
| [`nhs-booking.svelte`](./nhs-booking.svelte) | The shape this was built for: a bilingual NHS Wales appointment booking with a weekends-closed clinic and a twelve-week window. Switching to Welsh switches the calendar itself, not just the buttons around it. |

The package ships no CSS. `basic.svelte` carries the smallest stylesheet
that makes the control behave like a picker; everything beyond that is
yours.
