# API — LocaleSelect (Blazor)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Blazor-flavoured shape of the contract.

## Exports

All public types live in the `LilyDesignSystem.Blazor.Helpers`
namespace:

```csharp
namespace LilyDesignSystem.Blazor.Helpers;

public sealed class LocaleSelectContext { /* … */ }

public partial class LocaleSelect : ComponentBase
{
    /// U+1F310 GLOBE WITH MERIDIANS — the default button glyph.
    public const string GlobeWithMeridians = "\U0001F310";

    /// Apply a locale imperatively.
    public Task SetLocaleAsync(string code);
}

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
| `ChildContent`        | `RenderFragment<LocaleSelectContext>?`| no       | `null` (the default globe glyph)                   |
| `CssClass`            | `string`                              | no       | `""`                                               |
| `AdditionalAttributes`| `Dictionary<string, object>?`         | no       | `null`                                             |

`Value` is two-way bindable via `@bind-Value`. Other attributes
fall through via `[Parameter(CaptureUnmatchedValues = true)]`.

There is **no `Placeholder` parameter**. It existed only to pin a
native `<select>`'s closed display; there is no `<select>` any more.

## Events

```csharp
[Parameter] public EventCallback<string> ValueChanged { get; set; }
[Parameter] public EventCallback<string> OnChange { get; set; }
```

`ValueChanged` is the half of `@bind-Value` that flows from the
component back to the parent. It fires:

- after a selection (option click, or `Enter` / `Space` on the active
  option), and after any `SetLocaleAsync` call that changes the value,
- once on first `OnAfterRenderAsync(true)` if the resolved initial
  value differs from the supplied `Value`.

`OnChange` fires every time the select successfully applies a
locale. Payload is the original consumer-form code (not the BCP 47
normalised tag).

## ChildContent render fragment

`ChildContent` **replaces the glyph inside the button**. It does not
render options — the listbox is always owned by the component.

`LocaleSelectContext` shape:

```csharp
public sealed class LocaleSelectContext
{
    /// Currently selected locale code (consumer form, not BCP 47).
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a locale code to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

The old `Locales`, `SetLocale`, `Name`, `TagFor`, and `IsRtl` members
are gone from the context; the pure helpers remain on the static
`Locales` class, and `SetLocaleAsync` is a public method on the
component.

Consumers use it via `<ChildContent Context="ctx">`:

```razor
<LocaleSelect Label="…" Locales="@(…)">
    <ChildContent Context="ctx">
        <span class="my-flag" data-open="@ctx.Open">@ctx.LabelFor(ctx.Value)</span>
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

An icon button plus a dropdown listbox:

```html
<div class="locale-select {CssClass}" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />
  <button type="button" class="locale-select-button"
          aria-label="{Label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox"
      aria-label="{Label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active
        lang="{TagFor(locale)}">{LabelFor(locale)}</li>
  </ul>
</div>
```

`ChildContent` replaces the `<span class="locale-select-icon">` only.
Option ids are `{instance}-option-{index}` and the list id is
`{instance}-list`, where `{instance}` is `locale-select-{n}` from a
monotonic process-wide counter — stable and SSR-safe.

The hidden input preserves form participation and the `Name`
parameter. There is no snap-back interop write: the previous
implementation reset a native `<select>`'s value after every change so
the placeholder stayed displayed, and that write is gone. The real
selection lives in `Value`, which remains two-way bindable.

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
