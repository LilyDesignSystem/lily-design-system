# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-locale-select`. Each file is a runnable
page that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly).

Every example assumes:

- Blazor 10 / .NET 10 with the helper installed (or its source
  files copied) under
  `LilyDesignSystem.Blazor.Helpers` namespace.
- A `_Imports.razor` that declares
  `@using LilyDesignSystem.Blazor.Helpers`.
- No CSS dependency — the select is headless. Consumers style
  the `locale-select`, `locale-select-option`,
  `locale-select-list`, `locale-select-select`, and
  `locale-select-option` class hooks.

| #  | File                                                  | Demonstrates                                                       |
|----|-------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01_Radios.razor`](./01_Radios.razor)                | Default native `<select>` rendering.                              |
| 2  | [`02_Select.razor`](./02_Select.razor)                | Custom native `<select>` dropdown via `ChildContent`.             |
| 3  | [`03_Buttons.razor`](./03_Buttons.razor)              | Toggle-button group with short codes / glyphs and `aria-pressed`.  |
| 4  | [`04_RtlDemo.razor`](./04_RtlDemo.razor)              | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| 5  | [`05_NhsStyle.razor`](./05_NhsStyle.razor)            | NHS UK-style language banner with endonyms and `CssClass`.         |
| 6  | [`06_WithIStringLocalizer.razor`](./06_WithIStringLocalizer.razor) | Binding to `IStringLocalizer<T>` shared resources.       |
| 7  | [`07_WithResX.razor`](./07_WithResX.razor)            | Per-component `.resx` driving labels.                              |
| 8  | [`08_SsrCookie.razor`](./08_SsrCookie.razor)          | Cookie + `IHttpContextAccessor` for flicker-free SSR.              |
| 9  | [`09_ScopedTarget.razor`](./09_ScopedTarget.razor)    | Multiple per-region selects, each scoped to its own panel.         |
| 10 | [`10_Combobox.razor`](./10_Combobox.razor)            | Native `<datalist>` type-ahead for all 436 built-in locales.       |

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

Every example that uses `ChildContent` destructures these via
`Context="ctx"`:

```csharp
public sealed class LocaleSelectContext
{
    public IReadOnlyList<string> Locales { get; init; }
    public string Value { get; init; }
    public Func<string, Task> SetLocale { get; init; }
    public string Name { get; init; }
    public Func<string, string> LabelFor { get; init; }
    public Func<string, string> TagFor { get; init; }
    public Func<string, bool> IsRtl { get; init; }
}
```

The select still owns the apply lifecycle (`lang` / `dir` /
storage / `OnChange`) regardless of what markup the fragment
emits.

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
