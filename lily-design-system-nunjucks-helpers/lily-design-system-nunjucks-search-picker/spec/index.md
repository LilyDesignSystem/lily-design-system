# SearchPicker (Nunjucks) — Specification

Single source of truth for the `@lilydesignsystem/nunjucks-search-picker`
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

The canonical helper is the Svelte one
([`../../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md)).
Per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree; §3.3
below records where this port's macro/client split changes the shape of
the API, and why.

Sibling files:

- `search-picker.njk` — the macro (server-rendered markup)
- `search-picker.client.js` — the runtime (open/close, focus, submit, navigation)
- `search-picker.test.ts` — vitest spec exercising every clause in §7
- `index.md` — user-facing guide

---

## 1. Goal

Give a Nunjucks application a drop-in, headless site-search control that:

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
  to `localStorage`, and nothing is applied to the document root.
- **A named query parameter.** The contract is the bare query string
  (`/?foo`), not `/?q=foo`; see §3.1.

## 3. Architectural decisions

### 3.1 Inherited from the canonical helper

- **A helper that owns an action, like `share-picker`.** It applies
  nothing to the document and persists nothing.
- **A disclosure holding a real `<form role="search">`, not a menu.** A
  `type="search"` field and a `type="submit"` button, so
  Return-to-submit, mobile "search" keyboards and form semantics come
  from the platform. The form is a search landmark named by `label`.
- **The bare query, so navigation is done in script.** A native GET form
  submission always sends `name=value` pairs. The contract is `/?foo`,
  so the client cancels the native submission and navigates to
  `searchHref(query, action)` itself. The form keeps `action` /
  `method="get"` so its semantics stay truthful.
- **Encoded and trimmed.** `foo bar` goes to `/?foo%20bar`, `a&b` to
  `/?a%26b`. An empty or whitespace-only query navigates nowhere.
- **`navigate` is overridable.** The default is `location.assign(href)`;
  a client-side router passes its own navigate function.
- **`⏎` is the visible label, never the accessible name.** It renders in
  an `aria-hidden` span; the button's name is the required `submitLabel`.
  `label` and `inputLabel` are likewise required, with no English default.

### 3.2 The macro / client.js split

As with every helper in this catalog, the macro renders markup carrying
`data-lily-search-picker-*` hooks — with the panel `hidden` — and the
client module wires behaviour: toggling, focus, Escape, outside-click
and focus-out dismissal, and the submit. See §6 and `docs/ssr.md`.

### 3.3 Where the split reshapes the canonical API

None of these change behaviour; they move each canonical prop to the
side of the split that can actually honour it.

- **`navigate` and `onSearch` are client-only.** A Nunjucks macro cannot
  hold a function (only filters and globals registered on the
  environment are callable), so both are `initSearchPicker` /
  `autoInit` options, not macro parameters.
- **`action` is a macro parameter, overridable at init.** The macro
  renders it on the form's `action` attribute; the client reads that
  attribute (not the `form.action` property, which resolves to an
  absolute URL), and an init-time `action` wins.
- **`value` is initial only.** There is no two-way binding in a
  server-rendered template. The macro pre-fills the field; the client
  reads `input.value` at submit time, so typing is always what is
  searched for.
- **`children` becomes a `{% call %}` body.** It receives the canonical
  `ChildArgs` as a render-time snapshot, `{open: false, query: value}` —
  `open` is always `false` because the panel always renders closed, and
  the body is not re-rendered when either changes. The live open state
  is on the button's `aria-expanded`.
- **`class` / rest props become `classes` / `attributes`**, the
  catalog-wide Nunjucks convention.
- **Ids are derived from `name` / `id`**, not a module counter, because
  a macro has no counter shared across renders. `nextSearchPickerId()`
  is still exported for consumers building roots in JavaScript.

## 4. Public API

### 4.1 Macro parameters

`{% from "./search-picker.njk" import searchPicker %}` →
`{{ searchPicker(opts) }}`

| Key               | Type   | Required | Default                 | Purpose                                                       |
| ----------------- | ------ | -------- | ----------------------- | ------------------------------------------------------------- |
| `label`           | string | yes      | —                       | Accessible name for the icon button and the search landmark.  |
| `inputLabel`      | string | yes      | —                       | Accessible name for the search field.                         |
| `submitLabel`     | string | yes      | —                       | Accessible name for the `⏎` submit button.                    |
| `placeholder`     | string | no       | —                       | Placeholder for the field. No default (it would be English).  |
| `value`           | string | no       | `""`                    | Initial text in the field.                                    |
| `action`          | string | no       | `"/"`                   | Path the query is appended to: `${action}?${query}`.          |
| `name`            | string | no       | `"search"`              | Discriminator used to derive ids.                             |
| `id`              | string | no       | `search-picker-{name}`  | Id prefix for the panel and field.                            |
| `classes`         | string | no       | —                       | Extra classes on the root.                                    |
| `attributes`      | object | no       | —                       | Extra HTML attributes spread onto the root.                   |
| `{% call %}` body | —      | no       | the default SVG icon    | Replaces the icon; receives `{open, query}` (see §3.3).       |

### 4.2 DOM contract

```html
<div class="search-picker {classes}" data-lily-search-picker-root data-lily-search-picker-name="{name}">
  <button type="button" class="search-picker-button" aria-label="{label}"
          aria-expanded="false" aria-controls="{id}-panel" data-lily-search-picker-button>
    <svg class="search-picker-icon" viewBox="0 0 16 16" width="1.05rem" height="1.05rem" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
  </button>
  <div class="search-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>
  <div class="search-picker-panel" id="{id}-panel" hidden data-lily-search-picker-panel>
    <form class="search-picker-form" role="search" aria-label="{label}" action="{action}" method="get" data-lily-search-picker-form>
      <input class="search-picker-input" id="{id}-input" type="search" aria-label="{inputLabel}"
             placeholder="{placeholder}" value="{value}" enterkeyhint="search" data-lily-search-picker-input>
      <button type="submit" class="search-picker-submit" aria-label="{submitLabel}" data-lily-search-picker-submit>
        <span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>
      </button>
    </form>
  </div>
</div>
```

**Tooltip.** `.search-picker-tooltip` is a sibling right after the icon button, always in the markup, `hidden` at rest, holding the button's `label` text (no new macro argument, no new English). `client.js` shows it while the pointer is over the button or over the tooltip itself (hoverable) and while the button has keyboard focus (`:focus-visible`; a mouse click's focus does not count); `Escape` dismisses it without moving focus, wherever focus is while the tooltip is visible (a document-level `keydown` listener exists only while it is shown, so pointer-hover-only works too; WCAG 1.4.13), until the pointer re-enters or focus leaves and returns; it is never shown while the panel is open. It is purely visual: the text duplicates the button's `aria-label`, so it is deliberately **not** linked with `aria-describedby` (that would announce the name twice). Position and appearance are consumer/theme CSS, via the `hidden` attribute. Canonical reference: the Svelte helper's Tooltip paragraph.

`placeholder` and `value` are omitted entirely when not supplied. The
submit button follows the field in DOM order, so it sits at the field's
right in left-to-right layouts (and at its left under `dir="rtl"`).
Ids are deterministic and SSR-safe: `{id}-panel`, `{id}-input`.

### 4.3 client.js exports

`initSearchPicker`, `autoInit`, `RETURN_SYMBOL` (the bare `⏎`),
`searchHref(query, action = "/")`, `nextSearchPickerId`.

`initSearchPicker(root, opts?)` opts: `action`, `navigate(href)`,
`onSearch(query, href)`. Returns `{open, close, search, destroy}`;
`search(query?)` runs the §5.1 submit path for `query` (default: the
field's current text). `autoInit(opts?)` wires every
`[data-lily-search-picker-root]` on the page.

## 5. Behaviour

### 5.1 Searching

Return in the field or activating the submit button submits the form.
The client cancels the native submission, trims the query, and — when it
is non-empty — fires `onSearch(query, href)`, closes the panel, and calls
`navigate(href)` (default `location.assign(href)`), where
`href = searchHref(query, action)`. An empty or whitespace-only query
does nothing and leaves the panel open.

### 5.2 Keyboard

| Key               | On the icon button          | In the panel                                    |
| ----------------- | --------------------------- | ----------------------------------------------- |
| `Enter` / `Space` | Opens (or closes) the panel | In the field: `Enter` searches. On ⏎: searches. |
| `Escape`          | —                           | Closes and returns focus to the icon button     |
| `Tab`             | Moves on                    | Native order: field → ⏎ → out, which closes     |

Opening moves focus into the search field. Clicking outside, or focus
moving to an element outside the root, closes the panel without moving
focus. A focusout with no `relatedTarget` does **not** close it: Safari
does not focus a `<button>` on click, so pressing `⏎` (or the icon
button) blurs the field with no new focus target, and closing there
would hide the panel before the click lands. Every focus move the
client makes passes `{ preventScroll: true }`.

## 6. Degradation without JavaScript

Without the client module the control does nothing, and the spec says so
plainly: the panel is rendered `hidden`, only the client removes that,
and the icon button has no handler. The form is therefore unreachable.
This matches the canonical contract (the field carries no `name`, so a
native submission would not produce `/?<query>` in any case). A site
that needs a no-JS search should render its own always-visible
`<form role="search">`. See `docs/ssr.md`.

## 7. Testing acceptance criteria

`search-picker.test.ts` asserts every clause below. Clauses 1–24 map 1:1
onto the canonical Svelte spec's §7; 25–27 cover the Nunjucks-specific
surface.

1. Renders a `<button class="search-picker-button">` named by `label`, with `aria-expanded="false"` and `aria-controls` naming the panel.
2. The panel is hidden until the button is activated; activating opens it (`aria-expanded="true"`), activating again closes it.
3. The default icon is an `aria-hidden` SVG `.search-picker-icon`.
4. A `{% call %}` body replaces the icon and receives `ChildArgs` (`open`, `query`) as a render-time snapshot.
5. The panel holds a `<form role="search">` named by `label`, a `type="search"` field named by `inputLabel`, and a `type="submit"` button named by `submitLabel` after the field.
6. The submit button's visible content is `⏎` in an `aria-hidden` span.
7. Opening focuses the search field with `{ preventScroll: true }`.
8. Pressing Return in the field (submitting the form) navigates to `/?<query>`: `foo` → `/?foo`, and the native form submission is cancelled.
9. Clicking the submit button navigates the same way.
10. The query is trimmed and URI-encoded: `  foo bar ` → `/?foo%20bar`, `a&b` → `/?a%26b`.
11. An empty or whitespace-only query does not navigate and leaves the panel open.
12. `action` changes the path: `action: "/search"` sends `foo` to `/search?foo`; an init-time `action` wins.
13. `onSearch` fires with the trimmed query and the href, before `navigate`.
14. Without `navigate`, the default calls `location.assign(href)`.
15. A search closes the panel.
16. `Escape` closes the panel and returns focus to the button with `{ preventScroll: true }`.
17. Clicking outside closes the panel.
18. Focus moving to an element outside the root closes the panel.
19. An initial `value` pre-fills the field, and typing replaces it.
20. `searchHref()` builds the same destination the component navigates to.
21. `RETURN_SYMBOL` is the bare `⏎` (U+23CE).
22. `classes` is appended to `search-picker` on the root, and `attributes` spread onto the root.
23. The macro renders no user-facing text of its own: with no `placeholder` the field has none, and the only text nodes are the `aria-hidden` `⏎` and the tooltip's `label`.
24. A focusout with no `relatedTarget` (Safari's click on `⏎` or on the icon button, a window blur) leaves the panel open, so the click that caused it still lands.
25. Ids are deterministic, derived from `name` / `id`, and wired to `aria-controls`.
26. `autoInit` wires every root; `initSearchPicker` is inert on a missing or foreign root; the returned `open` / `close` / `search` work and `destroy` removes the listeners.
27. `nextSearchPickerId` mints stable, incrementing, SSR-safe ids.
28. Renders `.search-picker-tooltip` (`role="tooltip"`) as a sibling right after the icon button, holding the button's label, `hidden` at rest, and the button carries no `aria-describedby`.
29. Pointer over the button shows it; leaving hides it.
30. It stays visible while the pointer is over the tooltip itself.
31. Keyboard focus on the button (`:focus-visible`) shows it; blur hides it; mouse-induced focus does not.
32. `Escape` on the button dismisses it without moving focus; re-entering shows it again.
33. It is never shown while the panel is open.
34. Initialising the same root twice replaces the first tooltip wiring rather than doubling it.
35. Pointer hover shows the tooltip with focus elsewhere; Escape pressed on `document.body` or another element dismisses it (without `preventDefault`, without moving focus), and the document `keydown` listener exists only while the tooltip is visible (removed on hide, `destroy()` and re-init).

§6 is asserted too: without the client the panel stays hidden, and the
macro touches no document, storage, or navigator state.

## 8. Tracking

- Package: @lilydesignsystem/nunjucks-search-picker
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
- **2026-10-02**: created (maintainer-directed), ported from the canonical
  Svelte helper the same day: magnifying-glass icon button, dropdown with
  a search field and a `⏎` submit button, GET to `/?<query>`.

---

Lily™ and Lily Design System™ are trademarks.
