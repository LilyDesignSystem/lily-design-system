# API — ThemeChooser (Blazor)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Blazor-flavoured shape of the contract.

## Exports

Both types live in the `LilyDesignSystem.Blazor.Helpers` namespace
and are public:

```csharp
namespace LilyDesignSystem.Blazor.Helpers;

public sealed class ThemeChooserContext { /* … */ }
public partial class ThemeChooser : ComponentBase { /* … */ }
```

The static helpers, the default-glyph constant, and the imperative
setter used by tests and consumers are public:

```csharp
public const string CircleWithRightHalfBlack = "◑"; // U+25D1
public static string NormaliseThemesUrl(string themesUrl);
public static string ThemeHref(string themesUrl, string slug, string extension);
public Task SetThemeAsync(string slug);
```

A consumer adds the namespace import once:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

…then uses `<ThemeChooser …>` and (rarely)
`ThemeChooser.NormaliseThemesUrl(…)`.

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
| `ChildContent`       | `RenderFragment<ThemeChooserContext>?`| no      | `null` (the default glyph)                       |
| `CssClass`           | `string`                            | no       | `""`                                             |
| `AdditionalAttributes` | `Dictionary<string, object>?`     | no       | `null`                                           |

There is **no `Placeholder` parameter**. It existed only to pin a
native `<select>`'s closed display; there is no `<select>` any more.

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

- when an option is chosen (by click or by `Enter` / `Space` in the
  listbox), via `SetThemeAsync`,
- once on first `OnAfterRenderAsync(true)` if the resolved initial
  value differs from the supplied `Value` parameter.

`OnChange` fires every time the select successfully applies a
theme. Use it for analytics, server sync, or cookie writes.

## ChildContent render fragment

`ChildContent` **replaces the glyph inside the button**. It does not
render options — the `<li role="option">` elements are always
component-owned.

`ThemeChooserContext` shape:

```csharp
public sealed class ThemeChooserContext
{
    /// Currently selected theme slug.
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a slug to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

Consumers use it via `<ChildContent Context="ctx">`:

```razor
<ThemeChooser Label="Theme" ThemesUrl="/t/" Themes="@(new[]{ "light", "dark" })">
    <ChildContent Context="ctx">
        <span aria-hidden="true">@(ctx.Open ? "▲" : "▼")</span>
    </ChildContent>
</ThemeChooser>
```

When no `ChildContent` is supplied, the button renders the default
glyph markup documented in `spec/index.md §4.2`.

To drive the control from your own UI instead, call the public
`SetThemeAsync(slug)` on a `@ref`-captured instance.

## Pure helpers

Two pure helpers are exported as `public static` methods on the
`ThemeChooser` class:

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

An icon button plus a dropdown listbox (`spec/index.md §4.2`):

```html
<div class="theme-chooser {CssClass}" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />
  <button type="button" class="theme-chooser-button"
          aria-label="{Label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox"
      aria-label="{Label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{LabelFor(slug)}</li>
  </ul>
</div>
```

`AdditionalAttributes` spread onto the root `<div>`. The glyph is the
`CircleWithRightHalfBlack` constant, `aria-hidden` so the accessible
name comes only from `aria-label`. The hidden input preserves form
participation; `Name` also discriminates the managed `<link>`.
`hidden` on the `<ul>` and `aria-expanded` on the button track the
same open state. Ids are `{instance}-list` and
`{instance}-option-{index}`, where `{instance}` is `theme-chooser-{n}`
from a monotonic process-wide counter — stable and SSR-safe.

There is no `<select>`, no placeholder option, and no snap-back
interop write. The real selection lives in `Value`, which remains
two-way bindable.

Document mutations (only inside `OnAfterRenderAsync(true)` and
subsequent `SetThemeAsync` calls):

```html
<link rel="stylesheet" data-lily-theme-chooser="{Name}" href="{ThemesUrl}{slug}{Extension}">
```

And on the document root:

```html
<html data-theme="{slug}">
```

## Type re-exports

There's no barrel-file mechanism in Blazor analogous to a TypeScript
`index.ts`. The `LilyDesignSystem.Blazor.Helpers` namespace plays
the role of the barrel: any consumer who adds the namespace import
can reach `ThemeChooser`, `ThemeChooserContext`, and the static
helpers without further plumbing.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing parameter) bumps
the minor version while v0.x; once v1.0 ships, breaking changes
bump the major.
