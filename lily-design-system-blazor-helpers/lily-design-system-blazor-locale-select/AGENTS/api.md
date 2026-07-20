# API — LocaleSelect (Blazor)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Blazor-flavoured shape of the contract.

## Exports

All public types live in the `LilyDesignSystem.Blazor.Helpers`
namespace:

```csharp
namespace LilyDesignSystem.Blazor.Helpers;

public sealed class LocaleSelectContext { /* … */ }
public partial class LocaleSelect : ComponentBase { /* … */ }

public static class Locales
{
    public static string Bcp47LocaleTag(string locale);
    public static bool IsRtlLocale(string locale);
    public static string LocaleName(string locale);
    public static string MatchNavigatorLanguage(
        IReadOnlyList<string> navLangs,
        IReadOnlyList<string> locales);
    public static IReadOnlyDictionary<string, string> DefaultLocaleLabels { get; }
    public static IReadOnlySet<string> RtlLanguageTags { get; }
    public static IReadOnlySet<string> RtlScriptSubtags { get; }
}
```

A consumer adds the namespace import once:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

…and uses `<LocaleSelect …>` and the `Locales.*` helpers.

## Parameters

| Parameter             | Type                                  | Required | Default                                            |
| --------------------- | ------------------------------------- | -------- | -------------------------------------------------- |
| `Label`               | `string`                              | yes      | `""`                                               |
| `Placeholder`         | `string?`                             | no       | `null` (falls back to `Label`)                     |
| `Locales`             | `IReadOnlyList<string>`               | yes      | `Array.Empty<string>()`                            |
| `Value`               | `string`                              | no       | `""`                                               |
| `ValueChanged`        | `EventCallback<string>`               | no       | —                                                  |
| `DefaultValue`        | `string?`                             | no       | `null` (resolves to `"en"` or `Locales[0]`)        |
| `StorageKey`          | `string?`                             | no       | `null`                                             |
| `DetectFromNavigator` | `bool`                                | no       | `false`                                            |
| `Name`                | `string`                              | no       | `"locale"`                                         |
| `ApplyDir`            | `bool`                                | no       | `true`                                             |
| `LocaleLabels`        | `IReadOnlyDictionary<string,string>`  | no       | empty `Dictionary<string, string>()`               |
| `OnChange`            | `EventCallback<string>`               | no       | —                                                  |
| `ChildContent`        | `RenderFragment<LocaleSelectContext>?`| no       | `null` (default option markup)                     |
| `CssClass`            | `string`                              | no       | `""`                                               |
| `AdditionalAttributes`| `Dictionary<string, object>?`         | no       | `null`                                             |

`Value` is two-way bindable via `@bind-Value`. Other attributes
fall through via `[Parameter(CaptureUnmatchedValues = true)]`.

## Events

```csharp
[Parameter] public EventCallback<string> ValueChanged { get; set; }
[Parameter] public EventCallback<string> OnChange { get; set; }
```

`ValueChanged` is the half of `@bind-Value` that flows from the
component back to the parent. It fires:

- after a `<select>` change,
- once on first `OnAfterRenderAsync(true)` if the resolved initial
  value differs from the supplied `Value`.

`OnChange` fires every time the select successfully applies a
locale. Payload is the original consumer-form code (not the BCP 47
normalised tag).

## ChildContent render fragment

`LocaleSelectContext` shape:

```csharp
public sealed class LocaleSelectContext
{
    public required IReadOnlyList<string> Locales { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetLocale { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
    public required Func<string, string> TagFor { get; init; }
    public required Func<string, bool> IsRtl { get; init; }
}
```

Consumers use it via `<ChildContent Context="ctx">`:

```razor
<LocaleSelect Label="…" Locales="@(…)">
    <ChildContent Context="ctx">
        @* ctx.Locales, ctx.Value, ctx.SetLocale, ctx.Name,
           ctx.LabelFor, ctx.TagFor, ctx.IsRtl *@
    </ChildContent>
</LocaleSelect>
```

## Pure helpers (`Locales` static class)

Five pure helpers are exported from the static `Locales` class:

```csharp
public static string Bcp47LocaleTag(string locale);
public static bool IsRtlLocale(string locale);
public static string LocaleName(string locale);
public static string MatchNavigatorLanguage(
    IReadOnlyList<string> navLangs,
    IReadOnlyList<string> locales);
public static IReadOnlyDictionary<string, string> DefaultLocaleLabels { get; }
public static IReadOnlySet<string> RtlLanguageTags { get; }
public static IReadOnlySet<string> RtlScriptSubtags { get; }
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the select.

The internal `BuildApplyScript(code, applyDir, storageKey)` helper
builds the JS snippet that does the DOM mutation; it's `internal`
so the test suite can assert against its output.

## DOM contract

Root element:

```html
<select class="locale-select {CssClass}" aria-label="{Label}" name="{Name}">
    <!-- ChildContent or default markup -->
</select>
```

Default option markup (one per `Locales` entry):

```html
<option class="locale-select-option" value="{locale}" lang="{TagFor(locale)}">{LabelFor(locale)}</option>
```

Document mutations (only inside `OnAfterRenderAsync(true)` and
subsequent `SetLocaleAsync` calls):

```html
<html lang="{TagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `ApplyDir` is `true` (the default).

## Type re-exports

There's no barrel-file mechanism in Blazor analogous to a TypeScript
`index.ts`. The `LilyDesignSystem.Blazor.Helpers` namespace plays
that role.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing parameter) bumps
the minor version while v0.x; once v1.0 ships, breaking changes
bump the major.
