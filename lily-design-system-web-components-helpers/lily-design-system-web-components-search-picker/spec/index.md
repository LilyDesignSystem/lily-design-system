# `<lily-search-picker>` — Specification

Single source of truth for the `@lilydesignsystem/web-components-search-picker`
HTML helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-search-picker`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md) the Svelte side
wins on behaviour; this file records the vanilla-custom-element idiom
and the places the API shape could not be carried over verbatim
(§4.3 property-only members, §4.4 `renderButtonContent()` for
`children`, §4.2 `value` semantics).

Sibling files:

- `search-picker.ts` — the implementation (custom-element class)
- `search-picker.test.ts` — vitest + jsdom spec exercising every clause in §7
- `index.ts` — barrel re-export + side-effectful registration
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give any HTML page a drop-in, headless site-search control that:

1. Renders a single-icon button (a bundled magnifying-glass SVG)
   matching the other Lily page-header helpers.
2. Opens a dropdown holding a search text field and, at its right, a
   submit button whose visible label is `⏎` (U+23CE RETURN SYMBOL).
3. On Return in the field, or on activating the submit button, performs
   a GET navigation to `/?<query>` — searching for `foo` goes to `/?foo`.
4. Ships zero CSS.

## 2. Non-goals

- **Running the search.** The control only navigates; the page at
  `/?<query>` (or a custom `action`) does the searching.
- **Suggestions, autocomplete, or a results list.** This is a field and a
  submit button, not a combobox. A typeahead would need a listbox of
  results the element has no source for.
- **Persistence.** There is no preference to remember. Nothing is written
  to `localStorage`, and nothing is applied to the document root.
- **A named query parameter.** The contract is the bare query string
  (`/?foo`), not `/?q=foo`; see §3.

## 3. Architectural decisions

- **A helper that owns an action, like `<lily-share-picker>`.** It applies
  nothing to the document and persists nothing; it is a helper because it
  owns a complete interaction end to end and ships the same headless
  contract. See `AGENTS/helpers.md`.
- **A disclosure holding a real `<form role="search">`, not a menu.** The
  popup is a native form: a `type="search"` field and a `type="submit"`
  button, so Return-to-submit, mobile "search" keyboards and form
  semantics all come from the platform. The form is a search landmark,
  named by `label`.
- **The bare query, so navigation is done in script.** A native GET form
  submission always sends `name=value` pairs (`/?q=foo`). The contract is
  `/?foo`, so the element cancels the native submission and navigates
  to `searchHref(query, action)` itself. The form keeps
  `action`/`method="get"` so its semantics stay truthful.
- **Encoded and trimmed.** The query is `trim()`med and passed through
  `encodeURIComponent`, so `foo bar` goes to `/?foo%20bar` and `a&b` to
  `/?a%26b` rather than producing a malformed or split query. An empty or
  whitespace-only query navigates nowhere.
- **`navigate` is overridable.** The default is `location.assign(href)`,
  a real GET request. Single-page apps assign their router's navigate
  function to the `navigate` property to stay client-side.
- **`⏎` is the visible label, never the accessible name.** It renders in
  an `aria-hidden` span; the button's name is the required
  `submit-label`, because a screen reader announcing "return symbol"
  names a key, not the action. Likewise `label` and `input-label` are
  required with no English default — see `AGENTS/internationalization.md`.
- **Rendered once, synced in place.** Unlike `<lily-share-picker>` (whose
  `label` / `copy-label` change which nodes exist), no attribute here
  changes the DOM's shape, so every attribute change after the first
  render is an in-place write. Focus inside an open panel always
  survives an attribute change.
- **The trigger composes `<lily-icon-button>`.** Like
  `<lily-share-picker>` (and the Svelte canonical's `IconButton`), the
  icon button is `@lilydesignsystem/web-components-headless`'s
  `<lily-icon-button base-class="search-picker-button">`, so the
  rendered `<button class="search-picker-button">` of §4.5 sits inside a
  `<lily-icon-button>` host. The panel stays self-built: it is a real
  form, not a listbox.
- **Light DOM, no Shadow DOM.** As with the sibling helpers, the
  consumer's CSS reaches the rendered markup through the kebab-case
  class hooks directly.

## 4. Public API

### 4.1 Observed attributes

| Attribute      | Type   | Required | Default     | Purpose                                                       |
| -------------- | ------ | -------- | ----------- | ------------------------------------------------------------- |
| `label`        | string | yes      | `""`        | Accessible name for the icon button and the search landmark.  |
| `input-label`  | string | yes      | `""`        | Accessible name for the search field.                         |
| `submit-label` | string | yes      | `""`        | Accessible name for the `⏎` submit button.                    |
| `placeholder`  | string | no       | —           | Placeholder for the field. No default (it would be English).  |
| `value`        | string | no       | `""`        | Seeds the search text (§4.2).                                 |
| `action`       | string | no       | `"/"`       | Path the query is appended to: `${action}?${query}`.          |
| `class`        | string | no       | `""`        | Extra class on the rendered root `<div>`.                     |

Attribute names follow the catalog's kebab-case convention
(`input-label` ↔ Svelte's `inputLabel`, `submit-label` ↔ `submitLabel`).

### 4.2 JS properties

Every attribute above has a mirrored camelCase property (`label`,
`inputLabel`, `submitLabel`, `placeholder`, `action`). Writing the
property writes the attribute; reading it reads the attribute. An empty
`action` reads back as `"/"`.

**`value` follows native `<input>` semantics, not the mirror rule.** The
`value` attribute seeds the search text; typing changes only the
`value` property, never the attribute (writing the attribute on every
keystroke would re-enter `attributeChangedCallback`). Writing the
property updates the field in place. Changing the attribute re-seeds the
live value, like a form reset. This is the custom-element form of
Svelte's bindable `value`.

Read-only: `open` (is the panel open?), `panelId` (id of the rendered
panel).

Methods: `openPanel()`, `closePanel(refocus = true)`, and the
overridable `renderButtonContent()` (§4.4).

### 4.3 Property-only members

Attributes are strings; these carry functions.

| Member                   | Why it cannot be an attribute | Paired event |
| ------------------------ | ----------------------------- | ------------ |
| `navigate(href)`         | Function-valued.              | —            |
| `onSearch(query, href)`  | Function-valued callback.     | `search`     |

The `search` event is a bubbling, composed `CustomEvent` whose `detail`
is `{ query, href }` — the event name follows this catalog's
convention of the callback name minus `on` (`onShare` → `share`), so
consumers who never touch JS properties can observe searches with
`addEventListener`. Callback first, then the event, then `navigate`.
(Some browsers fire a native, non-bubbling `search` event on
`<input type="search">` itself; that one targets the inner field and
carries no `detail`, so a listener on `<lily-search-picker>` in the bubble
phase only ever sees this element's event.)

### 4.4 Custom button content

Light DOM has no `<slot>`, so the Svelte `children` snippet becomes an
overridable method, as in `<lily-share-picker>`: subclass and override
`renderButtonContent(): Node`. It can read `this.open` and `this.value`
— the same information Svelte passes as `ChildArgs` (`open`, `query`) —
and re-runs on open, close, and every change to the query. Whatever it
returns goes inside the button; the button's own aria wiring is not the
subclass's to change.

### 4.5 DOM contract

```html
<lily-search-picker label="…" input-label="…" submit-label="…">
  <div class="search-picker {class}">
    <lily-icon-button base-class="search-picker-button" label="{label}" aria-expanded="false" aria-controls="{panelId}">
      <button
        type="button"
        class="search-picker-button"
        aria-label="{label}"
        aria-expanded="false"
        aria-controls="{panelId}"
      >
        <svg class="search-picker-icon" viewBox="0 0 16 16" width="1.05rem" height="1.05rem" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"></circle><path d="M10.5 10.5 14 14"></path></svg>
      </button>
    </lily-icon-button>
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

The submit button follows the field in DOM order, so it sits at the
field's right in left-to-right layouts (and at its left under
`dir="rtl"`, as it should). Its placement is consumer CSS.

### 4.6 Exports

`index.ts` exports `SearchPicker`, `RETURN_SYMBOL` (the bare `⏎`
character), `searchHref`, `nextSearchPickerId`, and the types
`SearchPickerProps` and `SearchPickerSearchDetail`, and registers
`<lily-search-picker>` when `customElements` exists and the tag is free.

## 5. Behaviour

### 5.1 Searching

Return in the field or activating the submit button submits the form. The
element cancels the native submission, trims the query, and — when it
is non-empty — fires `onSearch(query, href)`, dispatches the `search`
event, closes the panel, and calls `navigate(href)` (default
`location.assign(href)`), where `href = searchHref(query, action)`. An
empty or whitespace-only query does nothing and leaves the panel open.

### 5.2 Keyboard

| Key               | On the icon button                      | In the panel                                   |
| ----------------- | --------------------------------------- | ---------------------------------------------- |
| `Enter` / `Space` | Opens (or closes) the panel             | In the field: `Enter` searches. On ⏎: searches. |
| `Escape`          | —                                       | Closes and returns focus to the icon button    |
| `Tab`             | Moves on                                | Native order: field → ⏎ → out, which closes    |

Opening moves focus into the search field. Clicking outside, or focus
moving to an element outside the root, closes the panel without moving
focus. A focusout with no `relatedTarget` does **not** close it: Safari
does not focus a `<button>` on click, so pressing `⏎` (or the icon
button) blurs the field with no new focus target — and leaves
`document.activeElement` on `<body>`, so the sibling pickers' deferred
`activeElement` re-check does not help either. Closing there would hide
the panel before the click lands. Every focus move the element makes on
its own passes `{ preventScroll: true }`.

The outside-click check uses `event.composedPath()`, not containment of
`event.target`: opening re-renders the button content, so the clicked
icon is already detached by the time the click reaches the document
(the `<lily-share-picker>` regression).

## 6. Accessibility

WCAG 2.2 AAA target. The icon is `aria-hidden`; the button's accessible
name is `label`. The form is a search landmark (`role="search"`) named by
`label`; the field is named by `input-label`; the submit button by
`submit-label`, with `⏎` hidden from assistive technology. All three
names are consumer-supplied and localisable.

Known costs, stated rather than glossed: the trigger's name rests
entirely on `aria-label`, with no visible text fallback; and `⏎` as the
only visible submit label assumes the symbol is understood, which is why
the accessible name never relies on it. See `docs/accessibility.md`.

## 7. Testing acceptance criteria

`search-picker.test.ts` asserts every clause below. §7.1–§7.24 are the
canonical Svelte clauses, adapted to the custom-element idiom; §7.25 on
cover the custom-element surface.

1. Renders a `<button class="search-picker-button">` named by `label`, with `aria-expanded="false"` and `aria-controls` naming the panel.
2. The panel is hidden until the button is activated; activating opens it (`aria-expanded="true"`), activating again closes it.
3. The default icon is an `aria-hidden` SVG `.search-picker-icon`.
4. An overriding `renderButtonContent()` replaces the icon and sees `open` and `value` (the query).
5. The panel holds a `<form role="search">` named by `label`, a `type="search"` field named by `input-label`, and a `type="submit"` button named by `submit-label` after the field.
6. The submit button's visible content is `⏎` in an `aria-hidden` span.
7. Opening focuses the search field with `{ preventScroll: true }`.
8. Submitting the form (Return in the field) navigates to `/?<query>`: `foo` → `/?foo`, and the native form submission is cancelled.
9. Clicking the submit button navigates the same way.
10. The query is trimmed and URI-encoded: `  foo bar ` → `/?foo%20bar`, `a&b` → `/?a%26b`.
11. An empty or whitespace-only query does not navigate and leaves the panel open.
12. `action` changes the path: `action="/search"` sends `foo` to `/search?foo`.
13. `onSearch` fires with the trimmed query and the href, before `navigate`.
14. Without `navigate`, the default calls `location.assign(href)`.
15. A search closes the panel.
16. `Escape` closes the panel and returns focus to the button with `{ preventScroll: true }`.
17. Clicking outside closes the panel.
18. Focus moving to an element outside the root closes the panel.
19. An initial `value` attribute pre-fills the field, and typing updates the `value` property (not the attribute).
20. `searchHref()` builds the same destination the element navigates to.
21. `RETURN_SYMBOL` is the bare `⏎` (U+23CE).
22. `class` is appended to `search-picker` on the rendered root.
23. The element renders no user-facing text of its own: with no `placeholder` the field has none, and the only text node is the `aria-hidden` `⏎`.
24. A focusout with no `relatedTarget` (Safari's click on `⏎` or on the icon button, a window blur) leaves the panel open, so the click that caused it still lands.
25. A search dispatches a bubbling `search` CustomEvent with `{ query, href }`, after `onSearch` and before `navigate`.
26. Attributes and properties mirror each other; `action` reads back as `"/"` when absent; writing the `value` property updates the field.
27. Attribute changes sync in place: changing `label` / `placeholder` while the panel is open updates the DOM without moving focus out of the field, and re-writing an unchanged attribute is a no-op.
28. Disconnecting removes the document click listener.
29. The module is import-safe with no `customElements` (SSR).
30. A pointer click on the icon itself opens the panel and it stays open (the `composedPath()` guard).
31. Nothing is written to `localStorage` or the document root.

## 8. Tracking

- Package: @lilydesignsystem/web-components-search-picker
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
- **2026-10-02**: created (maintainer-directed), ported from the Svelte
  canonical the same day: magnifying-glass icon button, dropdown with a
  search field and a `⏎` submit button, GET to `/?<query>`. Same day:
  a focusout with no `relatedTarget` no longer closes the panel (Safari
  click-on-button fix; §5.2, §7.24).

---

Lily™ and Lily Design System™ are trademarks.
