# Examples — DateTimePicker

Self-contained Vue 3 SFCs. Each is runnable as-is in a Vite + Vue app;
adjust the import to the published package name
(`lily-design-system-vue-date-time-picker`) outside this repo.

| Example | Shows |
| ------- | ----- |
| [`basic.vue`](./basic.vue) | The smallest useful call site, plus the minimum CSS the dialog needs to overlay rather than sit in normal flow. |
| [`nhs-booking.vue`](./nhs-booking.vue) | The shape this was built for: a bilingual NHS Wales appointment booking with a weekends-closed clinic and a twelve-week window. Switching to Welsh switches the calendar itself, not just the buttons around it. |

The package ships no CSS. `basic.vue` carries the smallest stylesheet
that makes the control behave like a picker; everything beyond that is
yours.

Both examples bind the committed value with `v-model:value`, matching
`theme-picker` and `locale-picker` elsewhere in this catalog.
