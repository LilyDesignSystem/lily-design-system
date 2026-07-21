# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-locale-chooser`. Each file is a runnable
page that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly).

Every example assumes:

- Blazor 10 / .NET 10 with the helper installed (or its source
  files copied) under
  `LilyDesignSystem.Blazor.Helpers` namespace.
- A `_Imports.razor` that declares
  `@using LilyDesignSystem.Blazor.Helpers`.
- No CSS dependency — the select is headless. Consumers style
  the `locale-chooser`, `locale-chooser-button`,
  `locale-chooser-icon`, `locale-chooser-list`, and
  `locale-chooser-option` class hooks — plus the `[data-active]` and
  `[aria-selected]` attributes on the active / selected option, and
  `locale-chooser-status` for the consumer-rendered status region
  (see Example 1).

| #  | File                                                  | Demonstrates                                                       |
|----|-------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`Basic.razor`](./Basic.razor)                        | Default rendering — plain parameters plus a `locale-chooser-status` live region. |
| 2  | [`CustomRendering.razor`](./CustomRendering.razor)    | Custom button glyph via `ChildContent` (inline SVG, state-aware caret). |
| 3  | [`ExternalButtons.razor`](./ExternalButtons.razor)    | External toggle-button group driving `SetLocaleAsync` via `@ref`.  |
| 4  | [`RtlDemo.razor`](./RtlDemo.razor)                    | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| 5  | [`NhsStyle.razor`](./NhsStyle.razor)                  | NHS UK-style endonym banner driving `SetLocaleAsync` via `@ref`.   |
| 6  | [`WithIStringLocalizer.razor`](./WithIStringLocalizer.razor) | Binding to `IStringLocalizer<T>` shared resources.           |
| 7  | [`WithResX.razor`](./WithResX.razor)                  | Per-component `.resx` driving labels.                              |
| 8  | [`SsrCookie.razor`](./SsrCookie.razor)                | Cookie + `IHttpContextAccessor` for flicker-free SSR.              |
| 9  | [`ScopedTarget.razor`](./ScopedTarget.razor)          | Multiple per-region selects, each scoped to its own panel.         |
| 10 | [`Combobox.razor`](./Combobox.razor)                  | External `<datalist>` type-ahead over all built-in locales, driving `SetLocaleAsync`. |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Blazor Web App or Blazor Server project, drop the
   `.razor` file into your `Components/Pages/` directory.
2. Add the helper's source files (or NuGet reference) so the
   `LilyDesignSystem.Blazor.Helpers` namespace resolves.
3. `dotnet run` and visit the `@page` route declared at the top of
   the file.

## Render modes

Every example declares `@rendermode InteractiveServer` at the top.
Swap for `InteractiveWebAssembly` or `InteractiveAuto` depending on
your hosting model; the select's behaviour is identical in all
three.

For a fully-static SSR-only page (no `@rendermode`), the select
renders the markup but cannot mutate the DOM —
`OnAfterRenderAsync` never fires. Pair static SSR with a server-
resolved cookie strategy (see Example 8 and the
[docs/ssr.md](../docs/ssr.md) guide).

## Two-way binding conventions

The select exposes its bindable on `Value`. Always use
`@bind-Value="locale"` in markup, and pair with `OnChange` for
one-shot side effects (cookie writes, imperative culture changes,
analytics).

## ChildContent scoped args

`ChildContent` **replaces the glyph inside the button**. It does not
render the options — the listbox is always the component's own
WAI-ARIA APG listbox. Examples that use it destructure the context
via `Context="ctx"`:

```csharp
public sealed class LocaleChooserContext
{
    public string Value { get; init; }              // active locale code
    public bool Open { get; init; }                 // is the listbox open?
    public Func<string, string> LabelFor { get; init; } // code → display label
}
```

Whatever the fragment renders must stay `aria-hidden="true"`: the
button is icon-only and its entire accessible name is the `Label`
parameter.

## Driving the select from your own UI

For a button group, combobox, or any other external affordance, keep
a `@ref` to the component and call the public method:

```razor
<LocaleChooser @ref="localeSelect" Label="Language" Locales="@codes" @bind-Value="locale" />

@code {
    private LocaleChooser? localeSelect;
    private async Task Apply(string code) => await localeSelect!.SetLocaleAsync(code);
}
```

The pure statics on the `Locales` class — `Bcp47LocaleTag`,
`IsRtlLocale`, `LocaleName`, `MatchNavigatorLanguage`,
`DefaultLocaleLabels` — are public and side-effect free, so external
controls can resolve their own `lang` / `dir` / labels. See Examples
3, 5, and 10.

The select still owns the apply lifecycle (`lang` / `dir` / storage /
`OnChange`) however the selection is made.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / cookie /
  Accept-Language recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring `IStringLocalizer<T>`, ResX, custom culture switching.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
