# Troubleshooting

Symptom-first. Each entry names the likely cause and the fix.

## "`<html lang>` never changes when I pick a language"

Almost always a render-mode problem. All DOM writes go through
`IJSRuntime` inside `OnAfterRenderAsync`, which **never fires under
static SSR**.

Check, in order:

1. The page declares an interactive render mode —
   `@rendermode InteractiveServer`, `InteractiveWebAssembly`, or
   `InteractiveAuto`.
2. The circuit is actually connected (Blazor Server): a dropped
   connection silently stops all interop.
3. The browser console shows no interop exception.

If you need static SSR, the server must write `lang` itself from a
cookie — see [`ssr.md`](ssr.md#static-ssr-no-interactivity).

## "`dir` never changes, but `lang` does"

`ApplyDir` is false. Set it to true (the default) to let the component
own direction.

If `ApplyDir` is already true, the locale may not be detected as RTL.
`Locales.IsRtlLocale` checks script subtags first, then base language —
so `"az_Arab"` is RTL but a private-use or unregistered code may not be.
Verify directly:

```csharp
Assert.True(Locales.IsRtlLocale("ar"));
Assert.True(Locales.IsRtlLocale("az_Arab"));
```

If your code is legitimately RTL and returns false, it is missing from
`Locales.RtlLanguageTags` / `RtlScriptSubtags`.

## "The page flashes English before switching"

Expected with client-only persistence. `localStorage` and
`navigator.languages` are only readable *after* the client starts, so
the server necessarily paints something first.

The only real fix is a cookie the server can read before render. See
[`ssr.md`](ssr.md#strategy-1-cookie--apprazor-recommended).

## "The globe icon is blue, not monochrome"

The platform picked the colour-emoji font. The default glyph already
carries U+FE0E VARIATION SELECTOR-15 to request the text presentation,
but not every platform honours it.

Name a symbol font ahead of the emoji font:

```css
.locale-select-icon {
    font-family: "Segoe UI Symbol", "Noto Sans Symbols 2", system-ui, sans-serif;
}
```

If you need guaranteed monochrome, supply an inline SVG via
`ChildContent` — see [`custom-rendering.md`](custom-rendering.md#inline-svg-instead-of-the-glyph).

## "The globe renders as a tofu box"

The font stack has no glyph for U+1F310. Same fix as above: name a font
that covers it, or replace it with an SVG. Do not rely on the glyph
alone as the only indication of what the button does — the accessible
name comes from `Label` regardless, but sighted users need *something*
legible.

## "Options show codes, not names"

`Locales.DefaultLocaleLabels` has no entry for the code. The built-in
table covers 436 codes; anything else falls back to the code itself.

Two causes:

- **A typo or nonstandard code.** `"en-GB"` and `"en_GB"` both resolve;
  `"eng"` and `"en-gb"` do not — lookup is exact and case-sensitive.
- **A legitimately uncommon code.** Supply it yourself:

```razor
LocaleLabels="@(new Dictionary<string, string> { ["rm_CH"] = "Rumantsch" })"
```

## "The open list pushes my page around"

The package ships no CSS, including no positioning. The `<ul>` is
in-flow until you take it out:

```css
.locale-select { position: relative; display: inline-block; }
.locale-select-list {
    position: absolute;
    z-index: 10;
    inset-block-start: 100%;
    inset-inline-start: 0;
}
```

See [`styling.md`](styling.md#the-list-needs-positioning-css--the-package-ships-none).

## "The dropdown opens off the wrong edge after switching to Arabic"

The list is anchored with a physical property. Selecting an RTL locale
flipped `dir` on `<html>`, and `left: 0` no longer means "the start
edge".

Use logical properties: `inset-inline-start`, not `left`. This control
is the one that flips direction, so it is the one most likely to expose
physical-property bugs.

## "Endonyms render as boxes in the list"

A font-coverage problem, not a component problem. The per-option `lang`
is already there for the browser to act on; give it a font stack that
has the glyphs:

```css
.locale-select-option:lang(zh),
.locale-select-option:lang(ja),
.locale-select-option:lang(ko) { font-family: var(--font-cjk, system-ui); }
```

## "A screen reader reads 'Français' with an English voice"

The option markup is fine — each `<li>` carries its own `lang`. The
usual culprit is a **status region you rendered yourself** without one:

```razor
<!-- wrong -->
<span class="locale-select-status">@Endonyms[locale]</span>

<!-- right -->
<span class="locale-select-status" lang="@Locales.Bcp47LocaleTag(locale)">@Endonyms[locale]</span>
```

## "`DetectFromNavigator` picks the wrong language"

It matches `navigator.languages` against your `Locales`, exact first
then language-only. Two frequent surprises:

- **Language-only fallback is intentional.** A browser asking for
  `fr-CH` will settle for `fr` if `fr-CH` is not offered. If you want
  strict matching, do it yourself and pass `Value`.
- **`navigator.languages` order is the browser's, not the OS's.** Users
  rarely curate it, which is why detection is off by default.

Test the pure function directly:

```csharp
Assert.Equal("fr", Locales.MatchNavigatorLanguage(new[] { "fr-CH", "en" }, new[] { "en", "fr" }));
Assert.Equal("",   Locales.MatchNavigatorLanguage(new[] { "ja" },          new[] { "en", "fr" }));
```

## "`DetectFromNavigator` is ignored"

Something earlier in the resolution order won:

```
Value > StorageKey > DetectFromNavigator > DefaultValue > "en" > Locales[0]
```

A non-empty `Value`, or a previously-stored value under `StorageKey`,
both beat detection by design. Clear the storage key in devtools to
test detection.

## "The locale does not persist across reloads"

Check that `StorageKey` is set — persistence is opt-in. If it is set,
storage writes may be failing silently: the component swallows quota,
private-mode, and disabled-storage errors so it keeps working
in-memory. Confirm in devtools:

```js
localStorage.getItem("lily-locale");
```

Safari private browsing and some embedded webviews reject writes
entirely. Use a cookie there.

## "`@bind-Value` doesn't update my field"

Three usual causes:

- You passed `Value` without `ValueChanged`. `Value="@locale"` is
  one-way; `@bind-Value="locale"` is two-way.
- The field is not a `string`.
- The parent re-renders and overwrites the field from another source.

## "`Value` comes back with the wrong separator"

It does not — `Value` is always the **consumer form you supplied**. If
you passed `"pt_BR"` in `Locales`, `Value` reads back `"pt_BR"`. Only
the `lang` attribute gets the hyphenated BCP 47 form.

Convert explicitly where you need a tag:

```csharp
var tag = Locales.Bcp47LocaleTag(locale);       // "pt-BR"
var culture = new CultureInfo(tag);
```

Passing `"pt_BR"` straight to `CultureInfo` throws.

## "`CultureInfo` doesn't change, so my strings don't translate"

Expected. The component applies `lang` and `dir` and nothing else — it
deliberately owns no translation. Wire `CultureInfo` yourself in
`OnChange`; see
[`recipes.md`](recipes.md#switch-cultureinfo-when-the-locale-changes)
and [`i18n-integration.md`](i18n-integration.md).

## "My `ChildContent` options disappeared"

`ChildContent` no longer renders options — it replaces the **glyph
inside the button**. The listbox is always component-owned.

For a different affordance (button group, combobox), drive the
component with `@ref` + `SetLocaleAsync`:
[`custom-rendering.md`](custom-rendering.md#route-1-keep-the-component-drive-it-with-setlocaleasync).

## "My `Placeholder` no longer compiles"

`Placeholder` was removed with the native `<select>`. The closed control
shows a glyph, so there is nothing to pin.

To keep the active locale visible, render a status region —
[`styling.md`](styling.md#the-status-region).

## "`SetLocaleAsync` doesn't seem to apply"

Check:

- The `@ref` is non-null. It is only assigned after the first render,
  so calling from `OnInitializedAsync` gets a null reference.
- The code is non-empty — `SetLocaleAsync("")` is a no-op.
- The page has an interactive render mode.
- The code you passed is in `Locales`, otherwise no option shows as
  selected even though `lang` is applied.

## "Focus vanishes after choosing a language"

The component returns focus to its button after a selection. If you
visually hid that button with `display: none` — a common mistake when
driving it from external UI — focus goes nowhere.

Use a visually-hidden class instead, never `display: none` on the
control. See [`styling.md`](styling.md#donts).

## "Two selects disagree about the current language"

Multiple locale selects all write the same `<html lang>` — they are
views onto one shared document state. Bind them to the **same** field:

```razor
<LocaleSelect Name="header-locale" @bind-Value="locale" ... />
<LocaleSelect Name="footer-locale" @bind-Value="locale" ... />
```

Separate fields will drift apart the moment one is used.

## "`IJSRuntime` is null in tests"

bUnit needs the interop registered. Use `TestContext` and relax strict
mode:

```csharp
JSInterop.Mode = JSRuntimeMode.Loose;
JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
JSInterop.Setup<string[]?>("eval", _ => true).SetResult(Array.Empty<string>());
```

The `string[]?` setup is the `navigator.languages` probe; without it a
`DetectFromNavigator` test throws under strict mode.

## "`JSInterop.Invocations` is empty after first render"

`OnAfterRenderAsync` is async, so the interop call may not have
completed when the assertion runs. Yield first:

```csharp
var cut = RenderComponent<LocaleSelect>(/* … */);
await Task.Yield();
Assert.Contains(JSInterop.Invocations, i => i.Identifier == "eval");
```

## "Works in Blazor Server but not WebAssembly"

Usually culture data: the WASM runtime trims ICU data by default, so
`new CultureInfo("ar")` can behave differently or throw. Check
`BlazorWebAssemblyLoadAllGlobalizationData` in the project file, and see
[`i18n-integration.md`](i18n-integration.md#blazor-webassembly-culture-switching).

The component's own `lang` / `dir` writes are pure DOM and behave
identically in both.

## "The select mounts twice"

Symptom of prerendering: the component renders once on the server and
again on the client. `_initialised` guards the initial-value resolution
so the lifecycle runs once per instance, but your own `OnChange`
side-effects can fire twice. Make them idempotent, or gate them on
`firstRender` in the parent.

## See also

- [`ssr.md`](ssr.md) — render modes, cookies, FOUC.
- [`accessibility.md`](accessibility.md) — focus and naming rules.
- [`rtl.md`](rtl.md) — direction behaviour in depth.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.
