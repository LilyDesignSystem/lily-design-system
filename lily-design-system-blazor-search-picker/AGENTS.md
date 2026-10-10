# AGENTS — SearchPicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Blazor 10 headless site-search control. A single-icon button (a
bundled magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `{Action}?{encodeURIComponent(query.Trim())}` —
by default `/?<query>`. Ships no CSS and no JS file.

The canonical implementation is the Svelte helper
[`@lilydesignsystem/svelte-search-picker`](../lily-design-system-svelte-search-picker/);
this is a direct port with Blazor idioms swapped. When the two disagree,
Svelte wins — see [spec/index.md §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation)
for the deviations that could not be avoided.

## Files

| File                     | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).    |
| `SearchPicker.razor`     | Razor markup.                                 |
| `SearchPicker.razor.cs`  | C# code-behind (partial class).               |
| `SearchPickerTests.cs`   | bUnit + xUnit spec, mapped to the §7 clauses. |
| `index.md`               | User guide.                                   |
| `docs/accessibility.md`  | Tradeoffs, stated plainly.                    |
| `examples/`              | Copy-pasteable Razor snippets.                |

## Public surface

- Component: `SearchPicker` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Types: `SearchPickerContext` (`Open`, `Query`), `SearchEventArgs`
  (`Query`, `Href`).
- Statics: `ReturnSymbol` (the bare `⏎`), `SearchHref(query, action = "/")`,
  `NextSearchPickerId()`.
- Required parameters: `Label`, `InputLabel`, `SubmitLabel`
  (`[EditorRequired]`, no English defaults).
- Internal statics (visible to the test project):
  `EncodeUriComponent(value)`, `FocusLeftScript(panelId)`, `ClickWaitMilliseconds`.
- **No persistence.** Like `SharePicker`, this owns an action, not a
  preference.

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field
(`preventScroll: true`, deferred to `OnAfterRenderAsync`). Submitting
the form (Return in the field, or the `⏎` button) is cancelled natively
(`@onsubmit:preventDefault` — the native GET would send `/?name=value`);
the component trims the query and, if non-empty, fires `OnSearch`,
closes the panel, and calls `Navigate(href)` (default
`NavigationManager.NavigateTo(href, forceLoad: true)`). `Escape` closes
and returns focus to the button; clicking outside, or focus moving to an
element outside the root, closes. A focusout that is not a confirmed
departure (Safari's click-without-focus on `⏎` or the icon button)
never closes.

## Encoding

`SearchHref` must match JavaScript's `encodeURIComponent` exactly, so the
same query reaches the same URL from every catalog. `Uri.EscapeDataString`
alone is wrong: it also escapes `! ' ( ) *`. `EncodeUriComponent` puts
those five back. There is a dedicated test; keep it.

## Focus leaving the root (and Safari)

`FocusEventArgs` has no `relatedTarget`, and Tab between the field, `⏎`
and the trigger is native (not component-driven), so a suppress flag like
`SharePicker`'s cannot tell an internal move from a departure. The
focusout handler asks the browser via `eval` (`FocusLeftScript`), after
`setTimeout(0)`: a real active element outside the root is "left";
`<body>`/none is the null-`relatedTarget` case and is **not** a
departure — the script waits for the click that caused it and calls it
"left" only if that click landed outside the root. Only a confirmed
"left" closes; an interop failure keeps the panel open. Do not go back
to "close unless focus is confirmed inside": in Safari, clicking the
icon button blurs the field to `<body>`, the panel closed, and the click
re-opened it — the toggle never closed (spec §7.24).

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`), Blazor 10 / .NET 10.
- `[Parameter, EditorRequired]` for the three labels;
  `[Parameter(CaptureUnmatchedValues = true)]` for spread.
- The trigger composes `LilyDesignSystem.Blazor.Headless`'s `IconButton`.
- `EventCallback<T>` for events; `RenderFragment<SearchPickerContext>`
  for the custom icon.
- All browser access through `IJSRuntime` from event handlers or
  `OnAfterRenderAsync`, so the component is SSR / prerender safe.
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from parameters. `⏎` is a symbol shown to
  sighted users only; it is never an accessible name.
