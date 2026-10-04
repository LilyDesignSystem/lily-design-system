# SearchPicker — Specification

Single source of truth for the `@lilydesignsystem/react-search-picker`
React helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

The canonical cross-framework contract is the Svelte helper's
[`spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md).
Per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree; this
file mirrors its §-numbering exactly so the two test suites line up
clause for clause.

Sibling files:

- `SearchPicker.tsx` — the implementation
- `SearchPicker.test.tsx` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing guide

---

## 1. Goal

Give a React 19 application a drop-in, headless site-search control that:

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
  submit button, not a combobox. A typeahead would need a listbox of
  results the component has no source for.
- **Persistence.** There is no preference to remember. Nothing is written
  to `localStorage`.
- **A named query parameter.** The contract is the bare query string
  (`/?foo`), not `/?q=foo`; see §3.

## 3. Architectural decisions

- **A helper that owns an action, like `share-picker`.** It applies
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
  `/?foo`, so the component cancels the native submission and navigates
  to `searchHref(query, action)` itself. The form keeps
  `action`/`method="get"` so its semantics stay truthful.
- **Encoded and trimmed.** The query is `trim()`med and passed through
  `encodeURIComponent`, so `foo bar` goes to `/?foo%20bar` and `a&b` to
  `/?a%26b` rather than producing a malformed or split query. An empty or
  whitespace-only query navigates nowhere.
- **`navigate` is overridable.** The default is `location.assign(href)`,
  a real GET request. Single-page apps pass their router's navigate
  function (Next.js's `router.push`, React Router's `navigate`) to stay
  client-side.
- **`⏎` is the visible label, never the accessible name.** It renders in
  an `aria-hidden` span; the button's name is the required `submitLabel`,
  because a screen reader announcing "return symbol" names a key, not
  the action. Likewise `label` and `inputLabel` are required with no
  English default — see `AGENTS/internationalization.md`.
- **The trigger composes the headless `IconButton`.** Only the trigger
  composes `@lilydesignsystem/react-headless`; the panel is a form, not a
  listbox, so headless `Listbox` is the wrong widget for it.

## 4. Public API

### 4.1 Props

| Prop           | Type                                    | Required | Default              | Purpose                                                          |
| -------------- | --------------------------------------- | -------- | -------------------- | ---------------------------------------------------------------- |
| `label`        | `string`                                | yes      | —                    | Accessible name for the icon button and the search landmark.     |
| `inputLabel`   | `string`                                | yes      | —                    | Accessible name for the search field.                            |
| `submitLabel`  | `string`                                | yes      | —                    | Accessible name for the `⏎` submit button.                       |
| `placeholder`  | `string`                                | no       | `undefined`          | Placeholder for the field. No default (it would be English).     |
| `value`        | `string`                                | no       | `undefined` (uncontrolled) | The search text. When supplied, the component is controlled. |
| `defaultValue` | `string`                                | no       | `""`                 | Initial search text when uncontrolled.                           |
| `onChange`     | `(value: string) => void`               | no       | —                    | Fires with the field's new text on every edit.                   |
| `action`       | `string`                                | no       | `"/"`                | Path the query is appended to: `${action}?${query}`.             |
| `navigate`     | `(href: string) => void`                | no       | `location.assign`    | Performs the navigation.                                         |
| `onSearch`     | `(query: string, href: string) => void` | no       | —                    | Fires with the trimmed query and destination, before navigating. |
| `children`     | `(args: ChildArgs) => React.ReactNode`  | no       | the default SVG icon | Replaces the button icon.                                        |
| `className`    | `string`                                | no       | `""`                 | Extra class on the root.                                         |
| `...restProps` | any HTML attributes                     | no       | —                    | Spread onto the root `<div>`.                                    |

```ts
type ChildArgs = { open: boolean; query: string };
```

`Props` extends `Omit<React.HTMLAttributes<HTMLDivElement>, "children" |
"onChange" | "defaultValue">`: `children` is a render prop rather than a
node, and `onChange` / `defaultValue` describe the search text rather
than the root `<div>`.

### 4.2 DOM contract

```html
<div class="search-picker {className}" ...restProps>
  <button
    type="button"
    class="search-picker-button"
    aria-label="{label}"
    aria-expanded
    aria-controls="{panelId}"
  >
    <svg class="search-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="1.05rem" height="1.05rem"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
  </button>
  <div class="search-picker-tooltip" role="tooltip" id="{tooltipId}" hidden>{label}</div>
  <div class="search-picker-panel" id="{panelId}" hidden>
    <form class="search-picker-form" role="search" aria-label="{label}" action="{action}" method="get">
      <input class="search-picker-input" type="search" aria-label="{inputLabel}" placeholder="{placeholder}" enterkeyhint="search" />
      <button type="submit" class="search-picker-submit" aria-label="{submitLabel}">
        <span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>
      </button>
    </form>
  </div>
</div>
```

**Tooltip.** `.search-picker-tooltip` is a sibling of the button, always in the DOM, `hidden` at rest, holding the button's `label` text. It is shown while the pointer is over the button or over the tooltip itself (hoverable) and while the button has keyboard focus (`:focus-visible`, falling back to shown where unsupported); `Escape` dismisses it without moving focus, wherever focus is while the tooltip is visible (a `document`-level `keydown` listener, present only while it is shown, so hover alone suffices; WCAG 1.4.13) (until the pointer enters or focus leaves and returns); it is never shown while the panel is open. It is purely visual: the text duplicates the button's `aria-label`, so it is deliberately **not** linked with `aria-describedby`. Position and appearance are consumer/theme CSS, via the `hidden` attribute. State lives in a small `usePickerTooltip` hook inside the component file; the added `.search-picker-tooltip` element is the only new API.

The submit button follows the field in DOM order, so it sits at the
field's right in left-to-right layouts (and at its left under
`dir="rtl"`, as it should). Its placement is consumer CSS.

The panel id comes from React's `useId`, matching the sibling helpers, so
it is stable across server and client render and survives hydration.

### 4.3 Re-exports

`index.ts` exports `default`, `SearchPicker`, `RETURN_SYMBOL` (the bare
`⏎` character), `searchHref`, `nextSearchPickerId`, and the types `Props`
and `ChildArgs`.

`nextSearchPickerId()` is exported for parity with the canonical Svelte
helper and for consumers labelling a control from outside the component
tree. The component itself uses `useId`, which is hydration-safe in a way
a module-level counter is not.

## 5. Behaviour

### 5.1 Searching

Return in the field or activating the submit button submits the form. The
component cancels the native submission, trims the query, and — when it
is non-empty — fires `onSearch(query, href)`, closes the panel, and calls
`navigate(href)` (default `location.assign(href)`), where
`href = searchHref(query, action)`. An empty or whitespace-only query
does nothing and leaves the panel open.

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
button) blurs the field with no new focus target, and closing there
would hide the panel before the click lands. Every focus move
the component makes on its own passes `{ preventScroll: true }`.

### 5.3 React specifics

- **`value` is controlled or uncontrolled**, the catalog's idiom (see
  `theme-picker`'s `value` + `onChange`). The Svelte helper's
  `bind:value` becomes `value` + `onChange` (controlled) or
  `defaultValue` (uncontrolled initial text). `onChange` fires in both
  modes.
- Focus moves in a `useEffect` keyed on `open`, after the commit, rather
  than in the handler — the field is `hidden` until the open is
  committed. The Svelte helper's `queueMicrotask` serves the same
  purpose.
- Focus leaving the root is detected with React's `onBlur`, which is the
  delegated equivalent of the native `focusout`: unlike the DOM's own
  `blur` it bubbles, so the root sees focus leaving any descendant. It
  closes only when `relatedTarget` is an element outside the root (§5.2,
  §7.24).
- The outside-click listener is attached to `document` only while the
  panel is open, and removed on close and on unmount.
- No DOM is read or written during render, and `location` is only read
  on submit behind a `typeof location !== "undefined"` guard, so the
  component renders under SSR.

## 6. Accessibility

WCAG 2.2 AAA target. The icon is `aria-hidden`; the button's accessible
name is `label`. The form is a search landmark (`role="search"`) named by
`label`; the field is named by `inputLabel`; the submit button by
`submitLabel`, with `⏎` hidden from assistive technology. All three names
are consumer-supplied and localisable.

Known costs, stated rather than glossed: the trigger's name rests
entirely on `aria-label`, with no visible text fallback; and `⏎` as the
only visible submit label assumes the symbol is understood, which is why
the accessible name never relies on it. Full treatment in
[docs/accessibility.md](../docs/accessibility.md).

## 7. Testing acceptance criteria

`SearchPicker.test.tsx` asserts every clause below.

1. Renders a `<button class="search-picker-button">` named by `label`, with `aria-expanded="false"` and `aria-controls` naming the panel.
2. The panel is hidden until the button is activated; activating opens it (`aria-expanded="true"`), activating again closes it.
3. The default icon is an `aria-hidden` SVG `.search-picker-icon`.
4. `children` replaces the icon and receives `ChildArgs` (`open`, `query`).
5. The panel holds a `<form role="search">` named by `label`, a `type="search"` field named by `inputLabel`, and a `type="submit"` button named by `submitLabel` after the field.
6. The submit button's visible content is `⏎` in an `aria-hidden` span.
7. Opening focuses the search field with `{ preventScroll: true }`.
8. Pressing Return in the field (submitting the form) navigates to `/?<query>`: `foo` → `/?foo`, and the native form submission is cancelled.
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
19. An initial `defaultValue` pre-fills the field, and typing replaces it; a controlled `value` + `onChange` receives every edit (React's equivalent of Svelte's bindable `value`).
20. `searchHref()` builds the same destination the component navigates to.
21. `RETURN_SYMBOL` is the bare `⏎` (U+23CE).
22. `className` is appended to `search-picker` on the root, and rest props spread onto the root.
23. The component renders no user-facing text of its own: with no `placeholder` the field has none, and the only text nodes are the `aria-hidden` `⏎` and the tooltip's `label`.
24. A focusout with no `relatedTarget` (Safari's click on `⏎` or on the icon button, a window blur) leaves the panel open, so the click that caused it still lands.
25. Renders `.search-picker-tooltip` with `role="tooltip"` right after the button, holding `label`, `hidden` at rest, and the button carries no `aria-describedby`.
26. Pointer over the button shows it; leaving hides it.
27. It stays visible while the pointer is over the tooltip itself.
28. Keyboard focus on the button (`:focus-visible`) shows it; blur hides it; mouse-induced focus does not.
29. `Escape` on the button dismisses it without moving focus; re-entering shows it again.
30. It is never shown while the panel is open.
31. Pointer hover shows it with focus elsewhere; `Escape` pressed on `document.body` or another element dismisses it without moving focus.
32. The `document` `keydown` listener exists only while the tooltip is visible: added once, removed on hide and on unmount.

## 8. Tracking

- Package: @lilydesignsystem/react-search-picker
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
- **2026-10-02**: created, ported from `@lilydesignsystem/svelte-search-picker`
  0.1.0: magnifying-glass icon button, dropdown with a search field and a
  `⏎` submit button, GET to `/?<query>`.

---

Lily™ and Lily Design System™ are trademarks.
