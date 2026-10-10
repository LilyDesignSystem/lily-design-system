# Lifecycle — `<lily-search-picker>` (HTML helper)

## `connectedCallback`

1. `#render()` — build the light-DOM subtree once, seeding the field
   from `this.value`, then `#syncAttributes()`.
2. Attach the document-level click listener used for outside-click
   dismissal.

No initial-value resolution, no `localStorage` read, no "apply on
connect": this helper owns an action, not a preference.

## `attributeChangedCallback`

- Returns early when the old and new values are equal (idempotent).
- `value` re-seeds the live value (like a form reset) and updates the
  field in place.
- Every other attribute → `#syncAttributes()`, an in-place write on
  existing nodes. Nothing is ever rebuilt after the first render, so
  focus inside an open panel always survives.

## `disconnectedCallback`

Removes the document click listener.

## State changes

`openPanel()` / `closePanel()` → `#syncState()`: `aria-expanded`, the
panel's `hidden`, and the button content (re-rendered so an overriding
`renderButtonContent()` stays current). Typing re-renders the button
content too, since the override may read `this.value`.

The focus-out handler closes **only** when `relatedTarget` is a known
element outside the root; a null `relatedTarget` never closes. Unlike
the sibling pickers, there is no deferred `document.activeElement`
re-check: Safari does not focus a `<button>` on click, so `⏎` blurs the
field with a null target and `<body>` as the active element, and any
close there hides the panel before the click lands (spec §5.2, §7.24).
Outside clicks are the document click listener's job.
