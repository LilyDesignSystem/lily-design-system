# Pattern: Book an appointment

Lily's first pattern doc (plan P6-T2). "Book an appointment" is the
flagship composed-page demo: a multi-step GP-appointment booking wizard
that composes 32 components into one realistic flow, in the SvelteKit
example app at [`/book-an-appointment`](../../lily-design-system-svelte-sveltekit-examples/src/routes/book-an-appointment/+page.svelte).
It exists to answer a question the 12 required composed pages don't:
what does a *long*, *stateful*, *validated* flow look like when it's
built entirely from Lily's headless components?

Ported to the other six example apps in plan P6-T3.

## The flow

Five steps, each a distinct heading and (for steps 1–4) a `<Form>`:

1. **Before you start** — informational: an emergency notice, service
   description, and a disclosure of what to expect. No form.
2. **Reason for your appointment** — a `RadioGroup` of four reasons,
   with a conditional `TextAreaInput` + `CharacterCounter` when
   "Something else" is picked.
3. **Choose a date and time** — a `DateInput` (bounded to today or
   later) and a `Select` of times of day.
4. **Your details** — name, email, optional phone, and a checkbox for
   interpreter/support needs.
5. **Check your answers** — a `SummaryList` of every answer, each row
   with a "Change" link back to the step that owns it, then a
   confirmation checkbox and the real submit.
6. **Confirmation** — a `SuccessPanel` with a generated reference
   number, the `StepList` showing all steps finished, and a "what
   happens next" `Panel`.

A `StepList` above steps 2–5 tracks progress (`waiting` /
`in-progress` / `finished`), matching the status vocabulary in
[`step-list-item`'s AGENTS.md](../../components/step-list-item/AGENTS.md).

## Why one route, not five

GOV.UK- and NHS-style services usually give each step its own URL, so
the browser's own back button and bookmarking work for free. This
demo deliberately doesn't: every other composed page in this repo
(`/contact-form`, `/dialog-flow`, …) is a single route with in-memory
`$state`, and matching that convention means the flow needed no new
infrastructure — no cross-route store, no `sessionStorage`, and no
risk of a module-level store leaking between concurrent SSR requests
(a real hazard for naive per-user state in a server-rendered app).
`BackLink` — which requires a real `href` — is reserved for the one
real navigation on the page ("Back to examples", to `/`); moving
between wizard steps uses a plain `Button`, because WAI-ARIA authoring
practice is explicit that a control which performs an action rather
than navigating should be a button, not a link. A production service
handling real appointment data would very likely want real per-step
URLs; this pattern doc's job is to show what the *component
composition* looks like, and that lesson doesn't depend on the URL
shape.

## Patterns worth reusing elsewhere

**`novalidate` is required alongside a custom error summary.** Every
required `TextInput` / `DateInput` / `Select` in this flow also sets
the HTML `required` attribute (for baseline non-JS behaviour). Without
`novalidate` on the `<Form>`, the *browser's own* constraint validation
intercepts `Continue` first and blocks the `submit` event entirely —
the custom `ErrorSummary` never renders, `errors` never gets set, and a
screen reader announces whatever the browser's native validation
bubble says instead of Lily's error copy. This was caught by an actual
end-to-end run (not code review): step 2's "Continue" produced zero
error-summary elements the first time it was tested empty. Every
`<Form>` in this flow carries `novalidate`, and the same is worth
checking anywhere else `required` and a custom `ErrorSummary` coexist.

**Focus management on step change is the SPA's job.** A real route
change gets the browser's (and SvelteKit's) attention automatically —
focus resets, screen readers announce the new page. A single-page
wizard changing `$state` gets none of that for free. Each step's
heading carries `id="step-heading" tabindex="-1"`, and every
transition (`goNext`, `goBack`, `goToStep`, `startOver`) calls
`tick()` then `.focus()` on it — the same outcome a route change gives
elsewhere in this app, reproduced by hand. Failing validation instead
focuses `#booking-error-summary`, per the GOV.UK/NHS error-summary
convention `ErrorSummary`'s own doc comment describes.

**`RadioGroup` already is a fieldset — don't nest it in another one.**
`RadioGroup` renders `<fieldset role="radiogroup" aria-label="...">`
itself. An earlier draft of the reason step wrapped it in a second
`Fieldset legend="..."` "for good measure"; that's two redundant
grouping regions announced back to back for no benefit. Reach for a
plain `Fieldset` only when grouping controls that don't already group
themselves (this flow's date+time step is the real example: neither
`DateInput` nor `Select` groups anything, so `Fieldset legend="Preferred
date and time"` around both is correct).

**`Label` wraps a control instead of relying on a floating `aria-label`
match.** `RadioInput` and `CheckboxInput` take their accessible name
from an `aria-label`, by design (per each component's own doc, for
custom radio/checkbox layouts where the visible label lives outside
the component). Wrapping each one in `<Label>{radio-or-checkbox} Visible
text</Label>` — Label's own documented "wrapping" form — gives sighted
users a bigger click/tap target via the native `<label>` behaviour and
keeps the visible and accessible names identical, rather than reaching
for a raw `<label>` element and losing the component-level contract.

**A "Change" link is a real link, not a `Button`.** Each `SummaryList`
row's "Change" anchor calls `event.preventDefault()` and updates
`step` in its `onclick`, same mechanism as the wizard's other internal
transitions — but it stays an `<a>` because GOV.UK's own change-link
pattern treats it as a link (open-in-new-tab and copy-link-address are
reasonable things a user might want here, even though this demo's
`href="#..."` placeholders don't carry a real destination).

## Verification

- **9 dedicated end-to-end tests** in
  [`e2e/book-an-appointment.spec.ts`](../../lily-design-system-svelte-sveltekit-examples/e2e/book-an-appointment.spec.ts):
  the full happy path through all five steps, one test per validation
  rule (reason required, "something else" requires detail, date must
  not be in the past, email must look like an email, the confirmation
  checkbox is required), a `Back` button, a `Change` link, and the
  reset. Run: `npx playwright test e2e/book-an-appointment.spec.ts`.
- **axe-core, zero violations, at all eight distinct UI states**: the
  start screen, the reason step both empty and with an error, the
  reason step with the conditional textarea open, date-and-time,
  your-details, check-your-answers, and the confirmation screen.
  wcag2a/2aa, wcag21a/21aa, wcag22aa rule sets (this repo's standard
  set; see [spec/testing](../../spec/testing/index.md)).
- The route is also included in the app's generic
  `accessibility.spec.ts` and `responsive.spec.ts` composed-page
  sweeps (covering the start screen at four viewports), and `pnpm run
  check` (svelte-check) reports no errors or warnings against this
  file.
- A production build (`pnpm run build && pnpm run preview`) was used
  for the definitive end-to-end pass — the dev server's on-demand
  compilation made an early, unscientific manual check flaky (a fresh
  `vite dev` cold start can take longer than a fixed test timeout to
  finish hydrating, which looks identical to a broken click handler
  until you wait longer or hit a warm server). That flakiness was in
  the test methodology, not the page: confirmed by testing the exact
  same interaction with `waitUntil: 'networkidle'`, which passed
  consistently on the same dev server.

## Porting to the other six apps (P6-T3)

Not yet done. When porting, keep per-app idiom (Vue's reactivity,
React's `useState`, Angular signals, Blazor's `@code` blocks, Nunjucks'
progressive-enhancement JS) but preserve the four patterns above
verbatim — they're framework-agnostic requirements, not Svelte-specific
workarounds. In particular: any app whose form components also set
native `required` needs its own equivalent of `novalidate`, and any
app without SvelteKit's implicit per-navigation focus reset needs the
same manual heading-focus pattern this flow uses.

---

Lily™ and Lily Design System™ are trademarks.
