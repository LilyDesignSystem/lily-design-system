# Examples — DateTimePicker

Self-contained Angular 20 examples for
`lily-design-system-angular-date-time-picker`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

| #   | File                                                 | Demonstrates                                                                             |
| --- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | [`basic.component.ts`](./basic.component.ts)         | The minimum call site: a labelled field, a locale, and the six required strings.          |
| 2   | [`nhs-booking.component.ts`](./nhs-booking.component.ts) | A bilingual (English/Welsh) `datetime` booking control: `min`/`max`, `isDateDisabled`, `minuteStep`, and locale-driven `shortcuts`. |

Every example assumes:

- Angular 20 with standalone components and signal inputs.
- No CSS dependency — the control is headless. Consumers style the
  `date-time-picker` (root), `-field`, `-input`, `-button`, `-icon`,
  `-dialog`, `-header`, `-previous-year`, `-previous-month`, `-period`,
  `-next-month`, `-next-year`, `-calendar`, `-weekday`, `-week-heading`,
  `-week`, `-day`, `-time`, `-time-label`, `-hour`, `-minute`,
  `-meridiem`, `-shortcuts`, `-shortcut`, `-footer`, `-clear`, `-cancel`,
  and `-confirm` hooks.
- **The dialog needs positioning CSS and this package ships none.** The
  `<div class="date-time-picker-dialog">` sits in normal document flow,
  so it pushes content down when opened unless you give it
  `position: absolute` inside a `position: relative` root. Use
  `inset-inline-start`, not `left`, so it follows `dir="rtl"`.

## Every user-facing string is an input

Including the six required navigation/footer strings in `labels` — there
is no English default, because a nav button named in English by the
component itself is precisely the defect this package exists to avoid.
`hour` / `minute` / `meridiem` / `week` gate their own optional UI;
`clear` gates the clear button.

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any Angular CLI project (or Analog), drop the example into a
   route component or a Storybook story.
2. Import `DateTimePicker` from this directory (or via the `index.ts`
   barrel).
3. `ng serve` (or `pnpm dev`) and visit the route.

## Why `.ts` files instead of `.html` + `.ts` pairs?

The catalog uses template-inline only — no `templateUrl`, no `styles`,
no `styleUrls`. Each example is a single `.ts` file with the template in
the `template:` field of the `@Component` decorator. This matches the
Angular 20 convention used throughout the angular-headless library.

## See also

- [`../docs/accessibility.md`](../docs/accessibility.md) — what the
  control does well, and what it costs.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.
