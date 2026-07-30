# Examples

Self-contained HTML examples for `lily-design-system-html-date-time-picker`.
Each file is a runnable page that can be opened in any browser after
building the custom-element module.

Every example assumes a built copy of the module served at
`/dist/date-time-picker.js`. The catalog build (`npm run build` from
`lily-design-system-html-helpers/`) emits it as `dist/index.js`, so
either adjust the `<script type="module" src=…>` in each example or
serve that file at the nominal path. The path is a convention, not a
requirement.

| # | File | Demonstrates |
| - | ---- | ------------ |
| 1 | [`01-basic.html`](./01-basic.html) | The smallest useful call site: a labelled field, a locale, and the six required strings. |
| 2 | [`02-nhs-booking.html`](./02-nhs-booking.html) | The shape this component was built for: a bilingual `datetime` booking with a closed-weekends predicate, a twelve-week window, `minuteStep`, and shortcuts. |

## The package ships its own CSS in these examples only

`lily-design-system-html-date-time-picker` itself ships **zero CSS**,
including the dialog's positioning. Each example carries a `<style>`
block with the minimum needed to make the dialog render as an overlay
rather than in normal flow. The rule people forget is in there too:

```css
.date-time-picker-dialog[hidden] {
  display: none;
}
```

`hidden` is only `display: none` at the UA-stylesheet level, so the
`display` you set for positioning would otherwise win and leave the
closed dialog visible.

## `labels` — and in the second example, `shortcuts` / `isDateDisabled` — are set in JavaScript, always

Both examples wire `labels` as a **property**, never an attribute:
`labels` is required and carries several optional keys that gate
optional UI (`clear`, `week`, `meridiem`, `invalid`, `instructions`), so
a default here would be a hardcoded English string — see
[`../spec/index.md` §4.3](../spec/index.md#43-property-only-members).
The second example does the same for `shortcuts` and `isDateDisabled`,
the latter because a predicate cannot be a string attribute at all.

## Try the accessibility costs, not just the happy path

Each example is worth exercising in the states that go wrong — they are
the ones [`../docs/accessibility.md`](../docs/accessibility.md)
describes:

- Tab to the field, type an unparseable string, and blur. The field
  marks itself invalid, the typed text stays exactly as you left it, and
  — because both examples supply `labels.invalid` — the `role="status"`
  region under the field announces the refusal. Press `Escape` to
  discard the edit and get the committed value back.
- Open the dialog, arrow to the end of a month, and keep paging. Focus
  follows the cursor into the new month rather than falling off the end
  of the grid.
- In `02-nhs-booking.html`, try a shortcut that lands on a weekend (there
  is none, because the shortcuts are all Monday-safe by construction) —
  then try picking a Saturday directly in the grid, and confirm it is
  `aria-disabled` rather than merely styled to look closed: the cursor
  can land on it and it announces as unavailable, but `Enter` and a
  click both refuse to select it.
- Toggle the language in `02-nhs-booking.html` while the dialog is open.
  `locale` is a structural attribute (`spec/index.md` §5.8), so the
  dialog closes — this is a deliberate, documented cost of the vanilla
  port, not a bug.

---

Lily™ and Lily Design System™ are trademarks.
