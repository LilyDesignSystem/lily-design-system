# Pattern: Form validation

How a form built from Lily™ components tells people what is wrong, and when (tasks.md P23-T9). Lily ships no validation
rules: which answer is valid is the application's decision, and so are the words. Lily supplies the parts (`field`,
`label`, `hint`, `error-message`, `error-summary`) and the themes style the states. This page is the timing and the
wiring that joins them.

The recipes show the markup: [`field/with-error`](../../../recipes/field/with-error.html),
[`field/with-validity`](../../../recipes/field/with-validity.html) and
[`form/complete-form`](../../../recipes/form/complete-form.html).

## When an error appears

1. **Not on load.** An empty required field is not an error until the person has had a chance to answer it. The themes
   style `:user-invalid`, which matches only after the field has been edited and left, and `[aria-invalid="true"]`, which
   the application sets; neither matches a field nobody has touched.
2. **On leaving a field, for that field only, once it has been edited.** `:user-invalid` gives this styling for free.
   Showing the message itself on blur is optional; many services wait for submit, which is simpler and just as clear.
3. **While typing, only to clear an error already shown.** Re-check on `input` once a field shows an error, so it goes
   away as soon as the answer is fixed. Do not show a new error mid-keystroke.
4. **On submit, for every field.** Check everything, then show the error summary and move focus to it. Do not disable the
   submit button to prevent errors: a disabled button explains nothing and cannot be focused.

Set `novalidate` on the `<form>` when you show your own summary, so the browser's own bubbles do not appear as well; the
constraint attributes (`required`, `pattern`, `min`, `type="email"`) still work through `checkValidity()` and
`validity`, which is a reasonable place to start your rules.

## The error summary

- An `error-summary` at the top of the form, with a heading ("There is a problem", in your words) and a list with one
  link per error, `href="#{field-id}"`, whose text is the same message the field shows.
- On submit with errors, move focus to the summary (`tabindex="-1"` lets it take focus). Lily's `error-summary` also has
  `role="alert"`, so it is announced as it appears. Whether focus alone or focus and the alert is better with each
  screen reader is still being tested (tasks.md P23-T9, which waits on the screen-reader matrix, P16-T9); today Lily does
  both, as GOV.UK does.
- Each link moves focus to its field. For a group (a `radio-group` or `checkbox-group`), link to the first input.
- Put the error count or the first error in the page `<title>` too ("Error: Book an appointment"), so a screen-reader
  user who missed the summary hears it on the next page announcement.

## The field in error

- Set `aria-invalid="true"` on the control, and remove it once the answer is fixed.
- Show the message in an `error-message` next to the control, and link it twice: add its id to `aria-describedby`, which
  every screen reader reads, and name it in `aria-errormessage`, which says it is the error. A hidden element named in
  `aria-describedby` is still read out, so link the message only once it is shown.
- Keep the field's `hint`; do not replace it with the error. The error says what is wrong; the hint still says what is
  wanted.
- Never rely on colour alone: the message is text, and a theme may add an icon beside it.

## A warning that does not block

Some answers are allowed but unusual: a date far in the future, a dose above the usual range. Say so as hint text, not as
an error:

- Show it in the field's `hint` (or a second hint), linked with `aria-describedby`.
- Do not set `aria-invalid`, do not add it to the error summary, and do not stop the form from submitting.
- Word it as information ("This is more than the usual dose of 500 mg"), not as a failure.

## What Lily does not do

- Decide what is valid, or write any message: every word is the application's.
- Validate on the server or keep errors between pages. A server-rendered error is the same markup: `aria-invalid`, the
  message linked from the field, and the summary, with focus moved to it on load.

## Where it is tested

- `e2e/book-an-appointment.spec.ts` in each example app: the summary appears and takes focus on a failed step, and the
  page passes axe in its error state.
- `e2e/form-validation.spec.ts` in the HTML examples app: nothing is invalid on load, each summary link moves focus to its
  field, and the field in error carries `aria-invalid` with its message linked.

## Known gap

The example apps' booking flow links a field's message with `aria-errormessage` only, not also from `aria-describedby`
as this page recommends (tasks.md P23-T9).

## Related

- [`field`](../../../components/field/index.md), [`error-message`](../../../components/error-message/index.md),
  [`error-summary`](../../../components/error-summary/index.md), [`hint`](../../../components/hint/index.md)
- [The themes' invalid state](../../../AGENTS/theme.md#invalid-state)
- [Book an appointment](../book-an-appointment.md), the longest validated flow in the example apps

---

Lily™ and Lily Design System™ are trademarks.
