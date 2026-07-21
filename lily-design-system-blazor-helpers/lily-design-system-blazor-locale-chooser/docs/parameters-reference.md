# Parameters reference

Field-by-field reference for every public parameter. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `Label` — required, `string`

`aria-label` on **both** the button and the `<ul role="listbox">`.
Always supplied, always translatable.

```razor
<LocaleChooser Label="Language" ... />
```

With `IStringLocalizer<T>`:

```razor
<LocaleChooser Label="@Localizer["chooseLanguage"]" ... />
```

This one carries more weight than a typical label. The button renders
only a glyph, and the glyph is `aria-hidden="true"` — so `Label` is the
control's *entire* accessible name, with no visible-text fallback. See
[`accessibility.md`](accessibility.md#1-the-accessible-name-rests-entirely-on-aria-label).

A language chooser has a particular i18n trap: a user who cannot read
the current interface language still has to find this control. Consider
keeping `Label` in a widely-recognised form, or pairing it with the
endonym pattern in [`recipes.md`](recipes.md#show-each-language-in-its-own-language-endonyms).

## `Placeholder` — **removed**

There is no `Placeholder` parameter. It existed only to pin a native
`<select>`'s closed display to a short word; there is no `<select>` any
more. Passing it is a compile error.

The closed control shows a glyph, so if you want the active locale
visible, render a status region next to it — see
[`styling.md`](styling.md#the-status-region).

## `Locales` — required, `IReadOnlyList<string>`

The locale codes the select exposes as options, in the order you want
them listed. Codes may use either separator — `"pt_BR"` and `"pt-BR"`
are both accepted, and the component normalises to the hyphenated BCP 47
form when it writes `lang`.

```razor
Locales="@(new[] { "en", "fr", "ar", "zh_Hans" })"
```

The list is yours to order. The component does **not** sort it, because
the right order is locale-dependent (alphabetical by endonym, by user
population, or with a pinned "most likely" group at the top). See
[`bcp47.md`](bcp47.md) for what makes a well-formed code.

## `Value` — optional, `string` (`@bind-Value`)

The active locale code, in the **consumer form you supplied** — if you
passed `"pt_BR"` in `Locales`, `Value` reads back `"pt_BR"`, not
`"pt-BR"`. Only the `lang` attribute gets the hyphenated form.

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `StorageKey` and `DetectFromNavigator` are
both skipped on first interactive render. This is what makes the
server-resolved cookie pattern work: see [`ssr.md`](ssr.md).

```razor
<LocaleChooser @bind-Value="locale" ... />

@code { private string locale = ""; }
```

## `ValueChanged` — optional, `EventCallback<string>`

The other half of `@bind-Value`. You almost never set this directly;
`@bind-Value` desugars to `Value=` + `ValueChanged=`.

## `DefaultValue` — optional, `string?`

Used during initial-value resolution when `Value` is empty, nothing was
stored, and navigator detection produced no match. If `DefaultValue` is
itself empty / null, the resolver falls back to `"en"` (when present in
`Locales`) and then to `Locales[0]`.

```razor
<LocaleChooser DefaultValue="fr" ... />
```

## `StorageKey` — optional, `string?`

`localStorage` key for persistence. When set, the select:

- Reads the stored code during initial-value resolution.
- Writes the code after every successful apply.

Errors (private mode, quota, disabled storage) are silently swallowed —
the select continues to work in-memory.

```razor
<LocaleChooser StorageKey="lily-locale" ... />
```

Note that `localStorage` is client-only, so it cannot prevent a
first-paint flash of the wrong language. For that you need a cookie the
server can read — see [`ssr.md`](ssr.md).

## `DetectFromNavigator` — optional, `bool` — defaults to `false`

Opt in to resolving `navigator.languages` on first visit. The browser's
ordered preference list is matched against `Locales` by
`Locales.MatchNavigatorLanguage`: exact match first (treating `-` and
`_` as equivalent), then a language-only fallback, so a browser asking
for `fr-CH` will settle for `fr`.

Detection sits in the middle of the resolution order:

```
Value > StorageKey > DetectFromNavigator > DefaultValue > "en" > Locales[0]
```

so a returning visitor's stored choice always beats the browser's
preference — detection only ever decides the first visit.

```razor
<LocaleChooser DetectFromNavigator="true" StorageKey="lily-locale" ... />
```

It is off by default because it is a real trade-off, not a free win:
browser language settings are frequently wrong (shared machines, locked
corporate images, a default nobody changed), and silently switching
language can strand a user in a locale they cannot read. If you enable
it, make the control easy to find and pair it with `StorageKey` so one
correction sticks.

The counterpart on ThemeChooser is `DetectFromSystem`, which reads
`prefers-color-scheme` in the same slot.

## `Name` — optional, `string` — defaults to `"locale"`

The `name` attribute on the hidden input that carries `Value` for form
participation. Give each select a distinct `Name` if more than one
appears inside the same form.

```razor
<LocaleChooser Name="ui-language" ... />
```

Unlike ThemeChooser's `Name`, this one is *only* about form
participation — there is no managed `<link>` element to discriminate,
because a locale change writes attributes rather than swapping a
stylesheet.

## `ApplyDir` — optional, `bool` — defaults to `true`

When true the select writes `dir="rtl"` or `dir="ltr"` on the document
root alongside `lang`, using `Locales.IsRtlLocale` to decide. Set it to
false when something else already owns `dir`:

```razor
<LocaleChooser ApplyDir="false" ... />
```

Reasons to turn it off: your layout is deliberately direction-fixed;
another framework owns `dir`; or you apply direction to a subtree rather
than the root. `lang` is still written either way. See
[`rtl.md`](rtl.md#when-to-opt-out).

## `LocaleLabels` — optional, `IReadOnlyDictionary<string, string>`

Per-code display label override. When unset, labels come from the
built-in 436-entry table in `locales.tsv` (English names — `"fr"` →
`"French"`); a code with no entry falls back to the code itself.

Use `LocaleLabels` for endonyms, for abbreviations, or for any code
outside the built-in table:

```razor
LocaleLabels="@(new Dictionary<string, string>
{
    ["en"] = "English",
    ["fr"] = "Français",
    ["ar"] = "العربية",
})"
```

Endonyms are usually the right choice for a language chooser: a user
looking for Welsh scans for "Cymraeg", not "Welsh". Each option already
carries its own `lang` attribute, so screen readers pronounce endonyms
correctly. See [`accessibility.md`](accessibility.md#per-option-lang-is-important).

## `OnChange` — optional, `EventCallback<string>`

Fires every time the select successfully applies a locale, with the
consumer-form code. Use it for the work the component deliberately does
*not* do — it applies `lang` and `dir`, and nothing else:

```razor
<LocaleChooser OnChange="OnLocaleChange" ... />

@code {
    private async Task OnLocaleChange(string code)
    {
        // Persist server-side so the next request paints correctly.
        await Http.PostAsJsonAsync("/api/locale", new { locale = code });

        // Switch CultureInfo so IStringLocalizer resolves the new strings.
        var culture = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
    }
}
```

Translation is emphatically the consumer's job. See
[`i18n-integration.md`](i18n-integration.md).

## `ChildContent` — optional, `RenderFragment<LocaleChooserContext>?`

**Replaces the glyph inside the button.** It does *not* render the
options — those are always component-owned, so the listbox semantics
cannot be broken by a consumer override. See
[`custom-rendering.md`](custom-rendering.md).

```razor
<LocaleChooser ...>
    <ChildContent Context="ctx">
        <svg class="my-icon" aria-hidden="true" ...>...</svg>
    </ChildContent>
</LocaleChooser>
```

Supplying `ChildContent` removes the default `.locale-chooser-icon`
span. Keep whatever you render `aria-hidden="true"` — the accessible
name must keep coming from `Label`.

## `CssClass` — optional, `string`

Extra CSS class hook on the root `<div>`, always emitted after
`"locale-chooser"`.

```razor
<LocaleChooser CssClass="my-locale-chooser" ... />
```

The root ends up as `<div class="locale-chooser my-locale-chooser" …>`.

## `AdditionalAttributes` — optional, `Dictionary<string, object>?`

Captured by `[Parameter(CaptureUnmatchedValues = true)]`. Any attribute
not bound to a parameter falls through to the root `<div>`:

```razor
<LocaleChooser
    Label="Language"
    Locales="@(new[] { "en", "fr" })"
    data-testid="locale-chooser"
    id="ui-language" />
```

Both land on the root `<div>`, not the button. To target the button use
the `.locale-chooser-button` hook.

## Public method

### `SetLocaleAsync(string code)`

Applies a locale imperatively — the same lifecycle a click runs. Reach
it via `@ref` when an external affordance drives the selection:

```razor
<LocaleChooser @ref="localeSelect" Label="Language" Locales="@codes" @bind-Value="locale" />

@code {
    private LocaleChooser? localeSelect;
    private async Task Apply(string code) => await localeSelect!.SetLocaleAsync(code);
}
```

## Static helpers

Pure and side-effect free, on the `Locales` static class — usable
without rendering the component at all:

| Member | Purpose |
| ------ | ------- |
| `Bcp47LocaleTag(string)` | Consumer form → hyphenated BCP 47 tag. |
| `IsRtlLocale(string?)` | True when the code's script or base language is RTL. |
| `LocaleName(string)` | Code → English name from the built-in table. |
| `MatchNavigatorLanguage(IReadOnlyList<string>, IReadOnlyList<string>)` | Browser preference list → best supported code, or `""`. |
| `DefaultLocaleLabels` | The 436-entry code → English-name table. |
| `RtlLanguageTags` | Base language subtags that are RTL. |
| `RtlScriptSubtags` | Script subtags that are RTL. |

`LocaleName` is the label-resolution counterpart of ThemeChooser's
`ThemeName`: one public implementation of the rule, so external controls
render labels identically without duplicating it.

## Render fragment context

```csharp
public sealed class LocaleChooserContext
{
    /// Currently selected locale code (consumer form, not BCP 47).
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a code to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

Note `LabelFor` here is the *instance* resolver: it honours whatever
`LocaleLabels` overrides you passed, then falls back to the built-in
table. `Locales.LocaleName` is the static, override-free version.

## Two-way binding cheat sheet

```razor
<!-- One-way (Value only) — read but not write -->
<LocaleChooser Value="@locale" ... />

<!-- Two-way bind — read and write -->
<LocaleChooser @bind-Value="locale" ... />

<!-- Two-way bind + side-effect callback -->
<LocaleChooser @bind-Value="locale" OnChange="OnChange" ... />

<!-- Two-way bind + explicit ValueChanged (rarely needed) -->
<LocaleChooser Value="@locale" ValueChanged="@(v => locale = v)" ... />
```

---

Lily™ and Lily Design System™ are trademarks.
