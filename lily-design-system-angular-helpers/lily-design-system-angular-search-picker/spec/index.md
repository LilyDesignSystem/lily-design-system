# SearchPicker — Specification

Single source of truth for the `@lilydesignsystem/angular-search-picker`
Angular helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

The canonical cross-framework contract is the Svelte helper's
[spec](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md);
per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree. This
file states the same contract in Angular 20 idiom. The §7 clause numbers
match the Svelte spec one for one.

Sibling files:

- `search-picker.component.ts` — the implementation
- `search-picker.component.spec.ts` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give an Angular 20 application a drop-in, headless site-search control
that:

1. Renders a single-icon button (a bundled magnifying-glass SVG) matching
   the other Lily page-header helpers.
2. Opens a dropdown holding a search text field and, at its right, a
   submit button whose visible label is `⏎` (U+23CE RETURN SYMBOL).
3. On Return in the field, or on activating the submit button, performs
   a GET navigation to `/?<query>` — searching for `foo` goes to `/?foo`.
4. Ships zero CSS.

## 2. Non-goals

- **Running the search.** The control only navigates; the page at
  `/?<query>` (or a custom `action`) does the searching.
- **Suggestions, autocomplete, or a results list.** This is a field and a
  submit button, not a combobox.
- **Persistence.** There is no preference to remember. Nothing is written
  to `localStorage`.
- **A named query parameter.** The contract is the bare query string
  (`/?foo`), not `/?q=foo`; see §3.

## 3. Architectural decisions

- **A helper that owns an action, like `share-picker`.** It applies
  nothing to the document and persists nothing. See `AGENTS/helpers.md`.
- **A disclosure holding a real `<form role="search">`, not a menu.** The
  popup is a native form: a `type="search"` field and a `type="submit"`
  button, so Return-to-submit, mobile "search" keyboards and form
  semantics all come from the platform. The form is a search landmark,
  named by `label`.
- **The bare query, so navigation is done in script.** A native GET form
  submission always sends `name=value` pairs (`/?q=foo`). The contract is
  `/?foo`, so the component cancels the native submission and navigates
  to `searchHref(query, action)` itself. The form keeps
  `action`/`method="get"` so its semantics stay truthful.
- **Encoded and trimmed.** The query is `trim()`med and passed through
  `encodeURIComponent`, so `foo bar` goes to `/?foo%20bar` and `a&b` to
  `/?a%26b`. An empty or whitespace-only query navigates nowhere.
- **`navigate` is overridable.** The default is `location.assign(href)`,
  a real GET request. Single-page apps pass a function wrapping their
  router (`(href) => router.navigateByUrl(href)`) to stay client-side.
- **`⏎` is the visible label, never the accessible name.** It renders in
  an `aria-hidden` span; the button's name is the required `submitLabel`.
  Likewise `label` and `inputLabel` are required with no English default
  — see `AGENTS/internationalization.md`.
- **Composes the headless `IconButton`.** The trigger is
  `@lilydesignsystem/angular-headless`'s `IconButton`, matching the
  sibling pickers. The panel is a form, not a listbox, so headless
  `Listbox` does not apply.
- **Angular-specific: an output, not a callback input, for `onSearch`.**
  Following `share-picker`'s idiom, the Svelte `onSearch(query, href)`
  prop becomes an `output()` carrying one `SearchEvent` object
  (`{ query, href }`), since Angular outputs emit one value.
- **Angular-specific: the output is named `searched`, not `search`.**
  `<input type="search">` fires a native, bubbling `search` DOM event in
  Chromium and WebKit, and Angular binds `(search)` on a component's
  host tag to both the component output and any same-named DOM event —
  a consumer's handler would receive a raw `Event` on every Return.
- **Angular-specific: `navigate` stays a function input.** It is not an
  event the consumer observes but a strategy the component calls, so it
  remains an `input<(href: string) => void>()`.
- **Angular-specific: `value` is a `model()` signal**, so it two-way
  binds with `[(value)]`, matching the sibling pickers' `value`.
- **Angular-specific: `class` is `className`.** `class` is not a legal
  Angular input name, matching the sibling helpers.
- **Angular-specific: no rest-props spread.** Angular has no equivalent
  of Svelte's `...restProps` onto an inner element; attributes written on
  the `<lily-search-picker>` host tag (e.g. `id`, `data-testid`) land on
  that host element through Angular's own mechanism — the same position
  `date-time-picker` documents.
- **Angular-specific: focus moves are synchronous.** Opening removes the
  panel's `hidden` attribute and focuses the field in the same task,
  rather than in a `queueMicrotask` as the Svelte reference does: under
  zone.js, change detection (which would remove `hidden`) runs after the
  microtask queue drains, so a microtask focus could land on a field
  that is still hidden. Closing via `Escape` focuses the trigger before
  hiding the panel, so focus never drops to `<body>` in between.

## 4. Public API

### 4.1 Inputs / outputs

| Input         | Type                                   | Required | Default           | Purpose                                                   |
| ------------- | -------------------------------------- | -------- | ----------------- | --------------------------------------------------------- |
| `label`       | `string`                               | yes      | —                 | Accessible name for the icon button and the search landmark. |
| `inputLabel`  | `string`                               | yes      | —                 | Accessible name for the search field.                     |
| `submitLabel` | `string`                               | yes      | —                 | Accessible name for the `⏎` submit button.                |
| `placeholder` | `string \| undefined`                  | no       | `undefined`       | Placeholder for the field. No default (it would be English). |
| `value`       | `string` (`model()`, `[(value)]`)      | no       | `""`              | The search text.                                          |
| `action`      | `string`                               | no       | `"/"`             | Path the query is appended to: `${action}?${query}`.      |
| `navigate`    | `((href: string) => void) \| undefined` | no      | `location.assign` | Performs the navigation.                                  |
| `className`   | `string`                               | no       | `""`              | Extra class on the root `<div>`.                          |

| Output     | Payload                              | Fires                                                    |
| ---------- | ------------------------------------ | -------------------------------------------------------- |
| `searched` | `SearchEvent` (`{ query, href }`)    | A non-empty search was submitted, before navigating.     |
| `valueChange` | `string`                          | The field's text changed (from `model()`).               |

Content projection: a single `<ng-template>` (queried via
`contentChild(TemplateRef)`) replaces the default icon inside the
trigger and receives `ChildArgs` as both `$implicit` and named
properties. The optional `SearchPickerIcon` marker directive
(`ng-template[lilySearchPickerIcon]`) types the `let-` variables. The
template replaces the **icon only** — it never renders the panel.

```ts
type ChildArgs = { open: boolean; query: string };
type SearchEvent = { query: string; href: string };
```

### 4.2 DOM contract

```html
<lily-search-picker>  <!-- Angular host; attributes on it stay here -->
  <div class="search-picker {className}">
    <button
      type="button"
      class="search-picker-button"
      aria-label="{label}"
      aria-expanded
      aria-controls="{panelId}"
    >
      <svg class="search-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="1.05rem" height="1.05rem"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
    </button>
    <div class="search-picker-panel" id="{panelId}" hidden>
      <form class="search-picker-form" role="search" aria-label="{label}" action="{action}" method="get">
        <input class="search-picker-input" type="search" aria-label="{inputLabel}" placeholder="{placeholder}" enterkeyhint="search" />
        <button type="submit" class="search-picker-submit" aria-label="{submitLabel}">
          <span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>
        </button>
      </form>
    </div>
  </div>
</lily-search-picker>
```

The `<button>` is rendered inside the headless `<lily-icon-button>`
host, which carries `display: contents` and so adds no box. The submit
button follows the field in DOM order, so it sits at the field's right
in left-to-right layouts (and at its left under `dir="rtl"`).

### 4.3 Re-exports

`index.ts` exports `SearchPicker`, `SearchPickerIcon`, `RETURN_SYMBOL`
(the bare `⏎` character), `searchHref`, `nextSearchPickerId`, and the
types `ChildArgs` and `SearchEvent`.

`nextSearchPickerId()` is an incrementing module counter — stable,
unique per instance, and SSR-safe (no `Math.random`, no `Date.now`). It
mints `search-picker-{n}`; the panel id is that plus `-panel`.

## 5. Behaviour

### 5.1 Searching

Return in the field or activating the submit button submits the form.
The component cancels the native submission, trims the query, and —
when it is non-empty — emits `searched({ query, href })`, closes the
panel, and calls `navigate(href)` (default `location.assign(href)`),
where `href = searchHref(query, action)`. An empty or whitespace-only
query does nothing and leaves the panel open.

### 5.2 Keyboard

| Key               | On the icon button              | In the panel                                    |
| ----------------- | ------------------------------- | ----------------------------------------------- |
| `Enter` / `Space` | Opens (or closes) the panel     | In the field: `Enter` searches. On ⏎: searches. |
| `Escape`          | —                               | Closes and returns focus to the icon button     |
| `Tab`             | Moves on                        | Native order: field → ⏎ → out, which closes     |

Opening moves focus into the search field. Clicking outside, or focus
moving to an element outside the root, closes the panel without moving
focus. A focusout with no `relatedTarget` does **not** close it: Safari
does not focus a `<button>` on click, so pressing `⏎` (or the icon
button) blurs the field with no new focus target, and closing there
would hide the panel before the click lands. Every focus move the
component makes on its own passes `{ preventScroll: true }`.

### 5.3 SSR

No `localStorage`, no writes to the document root, no DOM writes outside
event handlers. The default navigation guards on `typeof location`.

## 6. Accessibility

WCAG 2.2 AAA target. The icon is `aria-hidden`; the button's accessible
name is `label`. The form is a search landmark (`role="search"`) named
by `label`; the field is named by `inputLabel`; the submit button by
`submitLabel`, with `⏎` hidden from assistive technology. All three
names are consumer-supplied and localisable.

Known costs, stated rather than glossed: the trigger's name rests
entirely on `aria-label`, with no visible text fallback; and `⏎` as the
only visible submit label assumes the symbol is understood, which is
why the accessible name never relies on it. Full treatment in
[docs/accessibility.md](../docs/accessibility.md).

## 7. Testing acceptance criteria

`search-picker.component.spec.ts` asserts every clause below, one test
per clause, each titled with its clause number.

1. Renders a `<button class="search-picker-button">` named by `label`, with `aria-expanded="false"` and `aria-controls` naming the panel.
2. The panel is hidden until the button is activated; activating opens it (`aria-expanded="true"`), activating again closes it.
3. The default icon is an `aria-hidden` SVG `.search-picker-icon`.
4. A projected `<ng-template>` replaces the icon and receives `ChildArgs` (`open`, `query`).
5. The panel holds a `<form role="search">` named by `label`, a `type="search"` field named by `inputLabel`, and a `type="submit"` button named by `submitLabel` after the field.
6. The submit button's visible content is `⏎` in an `aria-hidden` span.
7. Opening focuses the search field with `{ preventScroll: true }`.
8. Pressing Return in the field (submitting the form) navigates to `/?<query>`: `foo` → `/?foo`, and the native form submission is cancelled.
9. Clicking the submit button navigates the same way.
10. The query is trimmed and URI-encoded: `  foo bar ` → `/?foo%20bar`, `a&b` → `/?a%26b`.
11. An empty or whitespace-only query does not navigate and leaves the panel open.
12. `action` changes the path: `action="/search"` sends `foo` to `/search?foo`.
13. `searched` emits the trimmed query and the href, before `navigate`.
14. Without `navigate`, the default calls `location.assign(href)`. (Harness note: this catalog's jsdom window exposes `location` and `location.assign` as non-configurable, so neither `vi.stubGlobal` nor `vi.spyOn` can replace them; the test observes a real `location.assign` instead, using `action="#"` so the navigation is fragment-only — which jsdom implements — and asserting `location.hash === "#?foo"`.)
15. A search closes the panel.
16. `Escape` closes the panel and returns focus to the button with `{ preventScroll: true }`.
17. Clicking outside closes the panel.
18. Focus moving to an element outside the root closes the panel.
19. An initial `value` pre-fills the field, and typing updates the two-way-bound `value`.
20. `searchHref()` builds the same destination the component navigates to.
21. `RETURN_SYMBOL` is the bare `⏎` (U+23CE).
22. `className` is appended to `search-picker` on the root; attributes on the host tag land on the host element (Angular's stand-in for rest props, §3).
23. The component renders no user-facing text of its own: with no `placeholder` the field has none, and the only text node is the `aria-hidden` `⏎`.
24. A focusout with no `relatedTarget` (Safari's click on ⏎ or on the icon button, a window blur) leaves the panel open, so the click that caused it still lands.

Total: **24 cases**, all green.

## 8. Tracking

- Package: @lilydesignsystem/angular-search-picker
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
- **2026-10-02**: created (maintainer-directed), ported from the Svelte
  canonical `@lilydesignsystem/svelte-search-picker` the same day.

---

Lily™ and Lily Design System™ are trademarks.
