# DateTimePicker examples

Each file is a self-contained Nunjucks template fragment. They assume
`date-time-picker.njk` is resolvable by your environment's loader and
that `date-time-picker.client.js` is served somewhere the browser can
import it.

| File | Shows |
| ---- | ----- |
| [`01-basic.njk`](./01-basic.njk) | Minimal control: `"date"` mode, the six required labels, an initial value. |
| [`02-datetime-with-shortcuts.njk`](./02-datetime-with-shortcuts.njk) | `"datetime"` mode, shortcut buttons, `disabledDates`, week numbers, and the client-only `isDateDisabled` / `onChange` / `onShortcut` / `onInvalidInput` options. |

## Two things every example assumes

**The field shows the raw value until hydration.** The macro cannot
call `Intl`, so `opts.value` is rendered unformatted into the text
field; `initDateTimePicker` (via `autoInit`) reformats it the moment it
runs. See [`../spec/index.md` §3.4](../spec/index.md).

**There is no usable path without JavaScript.** Unlike
`share-picker`, this control's calendar interior does not exist in the
server-rendered markup at all — see
[`../docs/accessibility.md`](../docs/accessibility.md).

---

Lily™ and Lily Design System™ are trademarks.
