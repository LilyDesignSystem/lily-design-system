# SearchPicker — Specification

Single source of truth for the `lily-design-system-blazor-search-picker`
Blazor helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

This package is a port of the canonical Svelte helper
[`@lilydesignsystem/svelte-search-picker`](../../lily-design-system-svelte-search-picker/spec/index.md).
Per [`AGENTS/helpers.md`](../../AGENTS/helpers.md), Svelte is
canonical: the behaviour contract below is the Svelte contract, and the
§7 clause numbering is deliberately identical so the two suites can be
read side by side. Where Blazor forces a difference it is called out in
§9 rather than quietly absorbed.

Sibling files:

- `SearchPicker.razor` — Razor markup
- `SearchPicker.razor.cs` — C# code-behind (partial class)
- `SearchPickerTests.cs` — bUnit + xUnit spec exercising every clause in §7
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give a Blazor 10 application a drop-in, headless site-search control that:

1. Renders a single-icon button (a bundled magnifying-glass SVG) matching
   the other Lily page-header helpers.
2. Opens a dropdown holding a search text field and, at its right, a
   submit button whose visible label is `⏎` (U+23CE RETURN SYMBOL).
3. On Return in the field, or on activating the submit button, performs
   a GET navigation to `/?<query>` — searching for `foo` goes to `/?foo`.
4. Ships zero CSS and zero JS files.

## 2. Non-goals

- **Running the search.** The control only navigates; the page at
  `/?<query>` (or a custom `Action`) does the searching.
- **Suggestions, autocomplete, or a results list.** This is a field and a
  submit button, not a combobox.
- **Persistence.** There is no preference to remember. Nothing is written
  to `localStorage`.
- **A named query parameter.** The contract is the bare query string
  (`/?foo`), not `/?q=foo`; see §3.
- **Shipping a JS file.** The one browser question the component asks is
  reached through `IJSRuntime` `eval` from an event handler.

## 3. Architectural decisions

- **A helper that owns an action, like `share-picker`.** It applies
  nothing to the document and persists nothing; it is a helper because it
  owns a complete interaction end to end and ships the same headless
  contract. See `AGENTS/helpers.md`.
- **A disclosure holding a real `<form role="search">`, not a menu.** The
  popup is a native form: a `type="search"` field and a `type="submit"`
  button, so Return-to-submit, mobile "search" keyboards and form
  semantics all come from the platform. The form is a search landmark,
  named by `Label`.
- **The bare query, so navigation is done in C#.** A native GET form
  submission always sends `name=value` pairs (`/?q=foo`). The contract is
  `/?foo`, so the form carries `@onsubmit:preventDefault` and the
  component navigates to `SearchHref(query, Action)` itself. The form
  keeps `action`/`method="get"` so its semantics stay truthful.
- **Encoded and trimmed, byte-for-byte like JavaScript.** The query is
  trimmed and passed through a C# equivalent of `encodeURIComponent`:
  `Uri.EscapeDataString` with `! ' ( ) *` put back, because
  `EscapeDataString` escapes those five and `encodeURIComponent` does
  not. `foo bar` goes to `/?foo%20bar` and `a&b` to `/?a%26b`, the same
  URL every Lily catalog builds. An empty or whitespace-only query
  navigates nowhere.
- **`Navigate` is overridable.** The default is
  `NavigationManager.NavigateTo(href, forceLoad: true)`, a real GET
  request — the Blazor equivalent of `location.assign`. An app that wants
  the search routed in-app passes its own `Navigate`.
- **`⏎` is the visible label, never the accessible name.** It renders in
  an `aria-hidden` span; the button's name is the required `SubmitLabel`,
  because a screen reader announcing "return symbol" names a key, not
  the action. Likewise `Label` and `InputLabel` are required with no
  English default — see `AGENTS/internationalization.md`.
- **The trigger composes headless `IconButton`.** A real dependency on
  `LilyDesignSystem.Blazor.Headless`, the same "depend on, don't vendor"
  rule share-picker follows. The panel is a form, not a listbox, so
  headless `Listbox` is the wrong widget for it.

## 4. Public API

### 4.1 Parameters

| Parameter              | Type                                    | Required | Default                                  | Purpose                                                          |
| ---------------------- | --------------------------------------- | -------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `Label`                | `string`                                | yes      | —                                        | Accessible name for the icon button and the search landmark.     |
| `InputLabel`           | `string`                                | yes      | —                                        | Accessible name for the search field.                            |
| `SubmitLabel`          | `string`                                | yes      | —                                        | Accessible name for the `⏎` submit button.                       |
| `Placeholder`          | `string?`                               | no       | `null`                                   | Placeholder for the field. No default (it would be English).     |
| `Value`                | `string`                                | no       | `""`                                     | The search text. Two-way via `@bind-Value`.                      |
| `ValueChanged`         | `EventCallback<string>`                 | no       | —                                        | Fires as the field's text changes.                               |
| `Action`               | `string`                                | no       | `"/"`                                    | Path the query is appended to: `{Action}?{query}`.               |
| `Navigate`             | `Action<string>?`                       | no       | `NavigateTo(href, forceLoad: true)`      | Performs the navigation.                                         |
| `OnSearch`             | `EventCallback<SearchEventArgs>`        | no       | —                                        | Fires with the trimmed query and destination, before navigating. |
| `ChildContent`         | `RenderFragment<SearchPickerContext>?`  | no       | the default SVG icon                     | Replaces the button icon.                                        |
| `CssClass`             | `string`                                | no       | `""`                                     | Extra class on the root.                                         |
| `AdditionalAttributes` | unmatched attributes                    | no       | —                                        | Spread onto the root `<div>`.                                    |

```csharp
public sealed class SearchPickerContext
{
    public required bool Open { get; init; }
    public required string Query { get; init; }
}

public sealed class SearchEventArgs
{
    public required string Query { get; init; }
    public required string Href { get; init; }
}
```

### 4.2 DOM contract

```html
<div class="search-picker {CssClass}" ...AdditionalAttributes>
  <button
    type="button"
    class="search-picker-button"
    aria-label="{Label}"
    aria-expanded
    aria-controls="{panelId}"
  >
    <svg class="search-picker-icon" viewBox="0 0 16 16" width="1.05rem" height="1.05rem" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
  </button>
  <div class="search-picker-tooltip" role="tooltip" id="{tooltipId}" hidden>{Label}</div>
  <div class="search-picker-panel" id="{panelId}" hidden>
    <form class="search-picker-form" role="search" aria-label="{Label}" action="{Action}" method="get">
      <input class="search-picker-input" type="search" aria-label="{InputLabel}" placeholder="{Placeholder}" enterkeyhint="search" />
      <button type="submit" class="search-picker-submit" aria-label="{SubmitLabel}">
        <span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>
      </button>
    </form>
  </div>
</div>
```

**Tooltip.** `.search-picker-tooltip` is a sibling of the button, always in
the DOM, `hidden` at rest, holding the button's `Label` text. It is shown
while the pointer is over the button or over the tooltip itself
(hoverable) and while the button has keyboard focus; `Escape` dismisses
it without moving focus, wherever focus is inside the picker while the tooltip is visible (until the pointer or focus re-enters); it is
never shown while the panel is open. It is purely visual: the text
duplicates the button's `aria-label`, so it is deliberately **not**
linked with `aria-describedby` (that would announce the name twice).
Position and appearance are consumer/theme CSS, via the `hidden`
attribute. Keyboard-versus-pointer focus is the one Blazor deviation —
see the deviations section.

The submit button follows the field in DOM order, so it sits at the
field's right in left-to-right layouts (and at its left under
`dir="rtl"`). Its placement is consumer CSS. `placeholder` is omitted
entirely when `Placeholder` is `null`.

### 4.3 Public surface

Component `SearchPicker` in namespace `LilyDesignSystem.Blazor.Helpers`,
plus the types `SearchPickerContext` and `SearchEventArgs`.

Blazor has no module barrel, so the Svelte package's re-exports become
`public` static members:

| Svelte export               | Blazor equivalent                                   |
| --------------------------- | --------------------------------------------------- |
| `RETURN_SYMBOL`             | `SearchPicker.ReturnSymbol` (`const string`, `"⏎"`) |
| `searchHref(query, action)` | `SearchPicker.SearchHref(query, action = "/")`      |
| `nextSearchPickerId()`      | `SearchPicker.NextSearchPickerId()`                 |
| types `Props`, `ChildArgs`  | the parameters above; `SearchPickerContext`         |

Internal statics, visible to the test project: `EncodeUriComponent(value)`
`FocusLeftScript(panelId)`, and `ClickWaitMilliseconds`.

## 5. Behaviour

### 5.1 Searching

Return in the field or activating the submit button submits the form. The
native submission is cancelled (`@onsubmit:preventDefault`); the
component trims the query and — when it is non-empty — fires
`OnSearch(new SearchEventArgs { Query, Href })`, closes the panel, and
calls `Navigate(href)` (default `NavigationManager.NavigateTo(href,
forceLoad: true)`), where `href = SearchHref(query, Action)`. An empty or
whitespace-only query does nothing and leaves the panel open.

### 5.2 Keyboard

| Key               | On the icon button            | In the panel                                    |
| ----------------- | ----------------------------- | ----------------------------------------------- |
| `Enter` / `Space` | Opens (or closes) the panel   | In the field: `Enter` searches. On ⏎: searches. |
| `Escape`          | —                             | Closes and returns focus to the icon button     |
| `Tab`             | Moves on                      | Native order: field → ⏎ → out, which closes     |

Opening moves focus into the search field. Clicking outside, or focus
moving to an element outside the root, closes the panel without moving
focus. A focusout that is not a confirmed departure — Safari's click on
`⏎` or on the icon button (which blurs the field to `<body>` without
focusing the button), a window blur — does **not** close it, so the
click that caused it still lands. How Blazor tells these apart: §9. Every focus move the component makes on its own
passes `preventScroll: true`, and every one is deferred to
`OnAfterRenderAsync`: the field cannot take focus while the panel still
carries `hidden`.

## 6. Accessibility

WCAG 2.2 AAA target. The icon is `aria-hidden`; the button's accessible
name is `Label`. The form is a search landmark (`role="search"`) named by
`Label`; the field is named by `InputLabel`; the submit button by
`SubmitLabel`, with `⏎` hidden from assistive technology. All three names
are consumer-supplied and localisable.

Known costs, stated rather than glossed: the trigger's name rests
entirely on `aria-label`, with no visible text fallback; and `⏎` as the
only visible submit label assumes the symbol is understood, which is why
the accessible name never relies on it. Full treatment in
[`docs/accessibility.md`](../docs/accessibility.md).

## 7. Testing acceptance criteria

`SearchPickerTests.cs` asserts every clause below. Clause numbering
matches the canonical Svelte spec one-for-one.

1. Renders a `<button class="search-picker-button">` named by `Label`, with `aria-expanded="false"` and `aria-controls` naming the panel.
2. The panel is hidden until the button is activated; activating opens it (`aria-expanded="true"`), activating again closes it.
3. The default icon is an `aria-hidden` SVG `.search-picker-icon`.
4. `ChildContent` replaces the icon and receives `SearchPickerContext` (`Open`, `Query`).
5. The panel holds a `<form role="search">` named by `Label`, a `type="search"` field named by `InputLabel`, and a `type="submit"` button named by `SubmitLabel` after the field.
6. The submit button's visible content is `⏎` in an `aria-hidden` span.
7. Opening focuses the search field with `preventScroll: true`.
8. Pressing Return in the field (submitting the form) navigates to `/?<query>`: `foo` → `/?foo`, and the native form submission is cancelled.
9. Clicking the submit button navigates the same way.
10. The query is trimmed and URI-encoded: `  foo bar ` → `/?foo%20bar`, `a&b` → `/?a%26b` — exactly as `encodeURIComponent` would (a second test pins `! ' ( ) *` and UTF-8).
11. An empty or whitespace-only query does not navigate and leaves the panel open.
12. `Action` changes the path: `Action="/search"` sends `foo` to `/search?foo`.
13. `OnSearch` fires with the trimmed query and the href, before `Navigate`.
14. Without `Navigate`, the default calls `NavigationManager.NavigateTo(href, forceLoad: true)` (canonical: `location.assign(href)`).
15. A search closes the panel.
16. `Escape` closes the panel and returns focus to the button with `preventScroll: true`.
17. Clicking outside closes the panel (decided by the focus-left script — §9).
18. Focus moving to an element outside the root closes the panel; focus moving between the root's own controls does not.
19. An initial `Value` pre-fills the field, and typing updates the bound `Value` (`ValueChanged`).
20. `SearchHref()` builds the same destination the component navigates to.
21. `ReturnSymbol` is the bare `⏎` (U+23CE).
22. `CssClass` is appended to `search-picker` on the root, and unmatched attributes spread onto the root.
23. The component renders no user-facing text of its own: with no `Placeholder` the field has none, and the only text node is the `aria-hidden` `⏎` (the tooltip, which holds the button's `Label`, aside).
24. A focusout that is not a confirmed departure (Safari's click on `⏎` or on the icon button, a window blur, an interop failure) leaves the panel open, so the click that caused it still lands: the icon button then toggles the panel closed, and `⏎` searches.
25. The component renders a `<div class="search-picker-tooltip" role="tooltip">` as a sibling right after the icon button, always in the DOM, `hidden` at rest, with an `id` and text equal to the button's `Label`; the button carries no `aria-describedby`.
26. Pointer over the button shows the tooltip; leaving hides it.
27. The tooltip stays visible while the pointer is over the tooltip itself (hoverable); leaving it hides it.
28. Keyboard focus on the button shows the tooltip and blur hides it; a focus immediately preceded by a `mousedown` on the button (pointer-induced focus) does not show it, and the mark is consumed so the next focus is a keyboard focus (Blazor stand-in for `:focus-visible` — §9).
29. `Escape` on the button dismisses a visible tooltip without moving focus (no focus request); re-entering the button with the pointer shows it again.
30. The tooltip is never shown while the panel is open, whether by hover or focus.
31. While the tooltip is visible, `Escape` pressed anywhere inside the picker root dismisses it (pointer hover with focus on another child of the root; no focus request, default not prevented). Blazor deviation (no JS interop, so no document-level listener): Escape with focus entirely outside the root is not handled. Escape while the tooltip is hidden is a no-op and does not pre-dismiss the next show.

### 7.1 How focus is asserted

bUnit has no live focus model. `ElementReference.FocusAsync()` goes out
over JS interop as `Blazor._internal.domWrapper.focus`, carrying the
target's `ElementReference` and the `preventScroll` flag; bUnit stamps
every `@ref`'d element with a stable `blazor:elementReference` GUID in
the first render's markup, so the suite maps GUID → element once and
asserts exactly which element was focused, and how. Clauses 7 and 16
rest on this — the same mechanism `SharePickerTests` documents.

### 7.2 How navigation and the focus check are stubbed

bUnit registers a `FakeNavigationManager`, which records every
`NavigateTo` call (URI and `ForceLoad`) in `History` — clause 14. The
root's focusout asks the browser through `eval`; bUnit's Loose mode
returns `default(bool)` (`false`, "focus went outside") for an unmatched
call, and clause 18 stubs it `true` to model a move between the root's
own controls.

## 8. Verification

From this package's own `tests/` directory:

```sh
dotnet test
```

The whole catalog suite must be green. This package contributes 32
cases (30 clauses; clauses 10 and 24 split in two); the catalog total
is 374 (including PickerBar's two search-wiring cases).

## 9. Blazor deviations from the canonical Svelte implementation

Each of these is forced by the framework, not chosen.

- **No standing document-level click listener.** The Svelte version
  closes on an outside click via `<svelte:document onclick>`. This
  package ships no JS file and installs no permanent listener; an
  outside click is detected from the `focusout` it causes, by the
  focus-left script below. Clause 17 is asserted that way.
- **`FocusEventArgs` has no `relatedTarget`.** Blazor does not surface
  it, so the component cannot apply the canonical rule ("close only
  when `relatedTarget` is a known element outside the root; a null
  `relatedTarget` never closes") to the event itself. Unlike
  `SharePicker` — whose list items only move focus under the
  component's own control, so a suppress-next-focusout flag suffices —
  this panel has native Tab order between the field, `⏎`, and the
  trigger. So on `focusout` it asks the browser, through `eval`
  (`FocusLeftScript`), after a `setTimeout(0)` while focus settles:
  - the active element is a real element → "left" exactly when it is
    outside the root (clause 18; Tab between the root's own controls
    stays open);
  - the active element is `<body>` / none — the C# equivalent of a null
    `relatedTarget` (Safari's click on a button, a click on a
    non-focusable area) → not a departure by itself (clause 24). The
    script waits for the click that caused it (a one-shot capture
    listener, removed as soon as it fires) and answers "left" only if
    that click landed outside the root (clause 17). A click on the icon
    button lands inside, so the trigger's own click handler toggles the
    panel closed. No click within `ClickWaitMilliseconds` (5 s) — a
    window blur, say — answers "not left".

  Only a confirmed "left" closes; an interop failure keeps the panel
  open. Known residual: under `InteractiveServer` on a slow connection,
  a very fast outside click can fire before the script's listener is
  installed; the panel then stays open (never wrongly closes).
- **`⏎` keeps focus on mousedown.** The submit button carries
  `@onmousedown:preventDefault`, so pressing it with a pointer does not
  blur the field first. In a browser that does not focus buttons on
  click (Safari), that blur would otherwise send focus to `<body>`, close
  the panel, and the click would never land.
- **`Escape` may also clear the field.** The Svelte version calls
  `preventDefault()` on `Escape`. Blazor evaluates
  `@onkeydown:preventDefault` at render time, so it cannot be applied to
  one key — and applying it to every key would stop typing. Browsers
  whose `type="search"` field clears on `Escape` will therefore clear it
  (and report the empty value through `ValueChanged`) as the panel
  closes.
- **`navigate` is `Navigate`, an `Action<string>?`;** its default is
  `NavigationManager.NavigateTo(href, forceLoad: true)` rather than
  `location.assign(href)` — both a real GET.
- **`onSearch` carries a `SearchEventArgs`** rather than two positional
  arguments, because `EventCallback<T>` is single-argument.
- **`bind:value` is `@bind-Value`** (`Value` + `ValueChanged`).
- **`class` is `CssClass`.** `class` is a C# keyword.
- **`children` is `ChildContent`**, typed
  `RenderFragment<SearchPickerContext>` rather than a Svelte snippet.
- **An interactive render mode is required.** Under static SSR the
  markup renders, but no event handler runs, so the button cannot open
  the panel.
- **Tooltip keyboard focus has no `:focus-visible`.** The canonical Svelte
  `search-picker` asks the browser `button.matches(":focus-visible")`; Blazor
  cannot without JS interop, and this package ships none for the tooltip.
  Instead the button's `@onfocus` shows the tooltip unless a `@onmousedown`
  on the same button immediately preceded it (pointer focus), a mark that
  the focus, any button keydown, or blur consumes. Consequences: a
  programmatic refocus of the button after the popup closes (e.g. after
  a pointer pick) counts as keyboard focus and shows the tooltip until blur,
  and focus arriving by Tab after a pointer interaction elsewhere is
  correctly keyboard focus. Hover, Escape-dismissal and the never-while-open
  rule are identical to the canonical behaviour. Each tooltip event is a
  Blazor event callback (a server round trip under Blazor Server).
- **No document-level Escape listener.** The canonical picker listens for `Escape` on the
  document while the tooltip is visible, so a hover-shown tooltip dismisses with focus anywhere. Blazor
  cannot add one without JS interop, which this package does not use for the tooltip. Instead
  `@onkeydown` on the root wrapper and on the tooltip dismisses it (keydown from any focused child
  bubbles to the root). **Not supported:** Escape pressed while hovering with focus entirely outside
  the picker. The handler never moves focus and never prevents default.

## 10. Tracking

- Package: lily-design-system-blazor-search-picker
- Assembly / NuGet id: LilyDesignSystem.Blazor.SearchPicker
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause

### 10.1 Changelog

- **2026-10-02**: created (maintainer-directed), ported from the
  canonical Svelte helper the same day: magnifying-glass icon button,
  dropdown with a search field and a `⏎` submit button, GET to
  `/?<query>`. Not yet published.

---

Lily™ and Lily Design System™ are trademarks.
