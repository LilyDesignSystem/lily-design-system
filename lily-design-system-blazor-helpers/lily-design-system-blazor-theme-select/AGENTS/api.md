# API — ThemeSelect (Blazor)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Blazor-flavoured shape of the contract.

## Exports

Both types live in the `LilyDesignSystem.Blazor.Helpers` namespace
and are public:

```csharp
namespace LilyDesignSystem.Blazor.Helpers;

public sealed class ThemeSelectContext { /* … */ }
public partial class ThemeSelect : ComponentBase { /* … */ }
```

The two static helpers used by tests and consumers are public:

```csharp
public static string NormaliseThemesUrl(string themesUrl);
public static string ThemeHref(string themesUrl, string slug, string extension);
```

A consumer adds the namespace import once:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

…then uses `<ThemeSelect …>` and (rarely)
`ThemeSelect.NormaliseThemesUrl(…)`.

## Parameters

| Parameter            | Type                                | Required | Default                                          |
| -------------------- | ----------------------------------- | -------- | ------------------------------------------------ |
| `Label`              | `string`                            | yes      | `""`                                             |
| `ThemesUrl`          | `string`                            | yes      | `""`                                             |
| `Themes`             | `IReadOnlyList<string>`             | yes      | `Array.Empty<string>()`                          |
| `Value`              | `string`                            | no       | `""`                                             |
| `ValueChanged`       | `EventCallback<string>`             | no       | —                                                |
| `DefaultValue`       | `string?`                           | no       | `null` (resolves to `"light"` or `Themes[0]`)    |
| `StorageKey`         | `string?`                           | no       | `null`                                           |
| `Name`               | `string`                            | no       | `"theme"`                                        |
| `Extension`          | `string`                            | no       | `".css"`                                         |
| `ThemeLabels`        | `IReadOnlyDictionary<string,string>`| no       | empty `Dictionary<string, string>()`             |
| `OnChange`           | `EventCallback<string>`             | no       | —                                                |
| `ChildContent`       | `RenderFragment<ThemeSelectContext>?`| no      | `null` (default option markup)                   |
| `CssClass`           | `string`                            | no       | `""`                                             |
| `AdditionalAttributes` | `Dictionary<string, object>?`     | no       | `null`                                           |

`Value` is two-way bindable via `@bind-Value`. Other attributes
(`id`, `data-*`, ARIA overrides, `@onclick`) flow through
`AdditionalAttributes` thanks to the `[Parameter(CaptureUnmatchedValues = true)]`
declaration.

## Events

```csharp
[Parameter] public EventCallback<string> ValueChanged { get; set; }
[Parameter] public EventCallback<string> OnChange { get; set; }
```

`ValueChanged` is the half of `@bind-Value` that flows from the
component back to the parent. It fires:

- after a `<select>` change,
- once on first `OnAfterRenderAsync(true)` if the resolved initial
  value differs from the supplied `Value` parameter.

`OnChange` fires every time the select successfully applies a
theme. Use it for analytics, server sync, or cookie writes.

## ChildContent render fragment

`ThemeSelectContext` shape:

```csharp
public sealed class ThemeSelectContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

Consumers use it via `<ChildContent Context="ctx">`:

```razor
<ThemeSelect Label="Theme" ThemesUrl="/t/" Themes="@(new[]{ "light" })">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <button type="button" @onclick="@(() => ctx.SetTheme(t))">
                @ctx.LabelFor(t)
            </button>
        }
    </ChildContent>
</ThemeSelect>
```

When no `ChildContent` is supplied, the select renders the default
option markup documented in `spec.md §4.2`.

## Pure helpers

Two pure helpers are exported as `public static` methods on the
`ThemeSelect` class:

```csharp
public static string NormaliseThemesUrl(string themesUrl);
public static string ThemeHref(string themesUrl, string slug, string extension);
```

`NormaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`ThemeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code, or other components without instantiating the
select.

The internal `BuildApplyScript(name, href, slug, storageKey)`
helper builds the JS snippet that does the DOM mutation; it's
`internal` so the test suite can assert against its output without
exposing the implementation to consumers.

## DOM contract

Root element:

```html
<select class="theme-select {CssClass}" aria-label="{Label}" name="{Name}">
    <!-- ChildContent or default markup -->
</select>
```

Default option markup (one per `Themes` entry):

```html
<option class="theme-select-option" value="{slug}">{LabelFor(slug)}</option>
```

Document mutations (only inside `OnAfterRenderAsync(true)` and
subsequent `SetThemeAsync` calls):

```html
<link rel="stylesheet" data-lily-theme-select="{Name}" href="{ThemesUrl}{slug}{Extension}">
```

And on the document root:

```html
<html data-theme="{slug}">
```

## Type re-exports

There's no barrel-file mechanism in Blazor analogous to a TypeScript
`index.ts`. The `LilyDesignSystem.Blazor.Helpers` namespace plays
the role of the barrel: any consumer who adds the namespace import
can reach `ThemeSelect`, `ThemeSelectContext`, and the static
helpers without further plumbing.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing parameter) bumps
the minor version while v0.x; once v1.0 ships, breaking changes
bump the major.
