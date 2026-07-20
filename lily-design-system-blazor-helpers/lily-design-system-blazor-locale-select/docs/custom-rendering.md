# Custom rendering

`ChildContent` **replaces the glyph inside the button**. It does not
render the options.

That boundary is deliberate. The listbox is the WAI-ARIA APG listbox
pattern — roles, `aria-activedescendant`, roving keyboard state,
per-option `lang` — and all of it is component-owned so a consumer
override cannot break the semantics. What is left for you to decide is
the button's face, which is a purely visual choice.

If you need a different *affordance* rather than a different glyph, skip
`ChildContent` and drive the component from your own UI — see
[Building a fully custom control](#building-a-fully-custom-control-instead).

## The LocaleSelectContext contract

```csharp
public sealed class LocaleSelectContext
{
    /// Currently selected locale code (consumer form, not BCP 47).
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a code to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

Three members, mirroring the canonical Svelte `ChildArgs`:

- `Value` is in the **consumer form you supplied** — `"pt_BR"` if that
  is what you put in `Locales`. Convert with
  `Locales.Bcp47LocaleTag(ctx.Value)` before using it as a `lang`
  attribute.
- `Open` lets the face react to the listbox state (a caret that flips,
  a pressed appearance).
- `LabelFor` is the *instance* resolver — it honours your
  `LocaleLabels` overrides, then the built-in table. Use it rather than
  reimplementing lookup.

The old `Locales`, `SetLocale` and `Name` members are gone: the fragment
no longer renders options, so it no longer needs them.

In Razor, name the context explicitly with `Context="ctx"` — otherwise
it is `context`, which collides confusingly inside nested fragments.

## Patterns

### Inline SVG instead of the glyph

The most common reason to use `ChildContent`: the default glyph is a
font character, and you want a real asset you control.

```razor
<LocaleSelect Label="Language" Locales="@codes" @bind-Value="locale">
    <ChildContent Context="ctx">
        <svg class="my-globe" aria-hidden="true" focusable="false"
             width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"
                  fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
    </ChildContent>
</LocaleSelect>
```

`aria-hidden="true"` and `focusable="false"` are both required:
`aria-hidden` keeps the artwork out of the accessible name, and
`focusable="false"` stops IE/Edge legacy behaviour making the `<svg>` a
tab stop inside the button.

Use `currentColor` so the icon inherits the button's colour and follows
theme changes for free.

### Glyph plus the active language code

An icon-only button is compact but opaque. Adding the active code makes
the control self-describing without much width:

```razor
<LocaleSelect Label="Language" Locales="@codes" @bind-Value="locale">
    <ChildContent Context="ctx">
        <span aria-hidden="true">
            @LocaleSelect.GlobeWithMeridians
            <span class="my-code">@ctx.Value.Split('_', '-')[0].ToUpperInvariant()</span>
        </span>
    </ChildContent>
</LocaleSelect>
```

Everything here stays `aria-hidden="true"`. The visible "FR" is a
convenience for sighted users; the accessible name is still `Label`.
Duplicating it into the accessible name would make a screen reader
announce "Language F R button", which is worse, not better.

If you want the *full* language name visible, prefer the status-region
pattern in [`styling.md`](styling.md#the-status-region) — it is
announceable via `aria-live` and does not stretch the button.

### State-dependent face

`Open` lets the face respond to the listbox:

```razor
<LocaleSelect Label="Language" Locales="@codes" @bind-Value="locale">
    <ChildContent Context="ctx">
        <span aria-hidden="true" class="my-face">
            @LocaleSelect.GlobeWithMeridians
            <span class="my-caret">@(ctx.Open ? "▴" : "▾")</span>
        </span>
    </ChildContent>
</LocaleSelect>
```

Do not add `aria-expanded` yourself — the component already puts it on
the button, and a second one inside would be both redundant and wrong.

### Showing the active language in its own script

```razor
<LocaleSelect Label="Language" Locales="@codes" LocaleLabels="@endonyms" @bind-Value="locale">
    <ChildContent Context="ctx">
        <span aria-hidden="true" lang="@Locales.Bcp47LocaleTag(ctx.Value)">
            @ctx.LabelFor(ctx.Value)
        </span>
    </ChildContent>
</LocaleSelect>
```

The `lang` here is for the *renderer*, not for assistive technology —
the span is `aria-hidden`, so no screen reader reads it, but `lang` still
drives font selection and shaping so an Arabic or Devanagari endonym
renders with the right glyphs.

## Building a fully custom control instead

`ChildContent` cannot give you a button group, a combobox, or a flag
grid — those are different affordances, not different glyphs. Two
routes.

### Route 1: keep the component, drive it with `SetLocaleAsync`

Recommended. The component keeps owning the lifecycle — `lang`, `dir`,
storage, `OnChange`, `Value` — while your UI supplies the presentation.

```razor
<LocaleSelect @ref="localeSelect"
              Label="Language"
              Locales="@codes"
              @bind-Value="locale"
              CssClass="visually-hidden-button" />

<div class="my-lang-buttons" role="group" aria-label="Language">
    @foreach (var code in codes)
    {
        <button type="button"
                lang="@Locales.Bcp47LocaleTag(code)"
                dir="@(Locales.IsRtlLocale(code) ? "rtl" : "ltr")"
                aria-pressed="@(code == locale ? "true" : "false")"
                @onclick="() => Apply(code)">
            @Locales.LocaleName(code)
        </button>
    }
</div>

@code {
    private LocaleSelect? localeSelect;
    private string locale = "";
    private readonly string[] codes = { "en", "fr", "ar" };

    private async Task Apply(string code) => await localeSelect!.SetLocaleAsync(code);
}
```

Two things to get right:

- **Hide the component's own button visually, not with
  `display: none`.** A `display: none` subtree can break `FocusAsync`
  and removes the control from the accessibility tree. Use a
  visually-hidden class on `.locale-select-button`. See
  [`styling.md`](styling.md#donts).
- **Give each of your buttons its own `lang`.** Endonyms need it for
  both pronunciation and font selection — WCAG 3.1.2 Language of Parts.

Worked examples: [`ExternalButtons.razor`](../examples/ExternalButtons.razor),
[`NhsStyle.razor`](../examples/NhsStyle.razor),
[`Combobox.razor`](../examples/Combobox.razor).

### Route 2: skip the component, use the statics

If you want no component at all, the `Locales` statics are public and
side-effect free, so you can build the whole thing yourself:

```csharp
var tag  = Locales.Bcp47LocaleTag("pt_BR");   // "pt-BR"
var rtl  = Locales.IsRtlLocale("ar");          // true
var name = Locales.LocaleName("fr");           // "French"
var best = Locales.MatchNavigatorLanguage(navLangs, codes);
```

You then own applying `lang` / `dir` and any persistence. That is the
part the component exists to do, so prefer Route 1 unless you have a
specific reason.

## What the fragment should *not* do

- **Don't render options.** They are component-owned; a duplicate set
  would produce two competing sources of selection.
- **Don't add an accessible name.** No `aria-label`, no visible text
  that duplicates `Label`. The button's name is `Label`, full stop.
- **Don't add `aria-expanded`, `aria-haspopup`, or `aria-controls`.**
  Already on the button.
- **Don't put a focusable element inside.** The button *is* the
  interactive element; a nested `<button>` or `<a>` is invalid HTML and
  creates a second tab stop that does nothing.
- **Don't attach a click handler that swallows the event.** The
  component's own `@onclick` on the button opens the listbox.
- **Don't write `lang` / `dir` on the document yourself.** Use
  `OnChange` if you need to react to a change.

## Why `RenderFragment<TContext>` and not a separate component

A `LocaleSelectButton` child component would need to reach the parent's
open state, active index, and label resolver — either through a
cascading value or a bespoke interface, both of which are more surface
area than a three-member context object. `RenderFragment<TContext>` is
the idiomatic Blazor answer for "render this bit, here's the state you
need", and it maps cleanly onto the canonical Svelte snippet.

## Composability

`ChildContent` is orthogonal to everything else. It changes the button's
face and nothing more:

```razor
<LocaleSelect Label="@Localizer["language"]"
              Locales="@codes"
              LocaleLabels="@endonyms"
              StorageKey="lily-locale"
              DetectFromNavigator="true"
              ApplyDir="true"
              OnChange="OnLocaleChange"
              @bind-Value="locale">
    <ChildContent Context="ctx">
        <svg class="my-globe" aria-hidden="true" focusable="false">...</svg>
    </ChildContent>
</LocaleSelect>
```

## See also

- [`parameters-reference.md`](parameters-reference.md) — every parameter.
- [`styling.md`](styling.md) — the class hooks the fragment interacts with.
- [`accessibility.md`](accessibility.md) — why the accessible name rule is strict.
- [`CustomRendering.razor`](../examples/CustomRendering.razor) — runnable example.

---

Lily™ and Lily Design System™ are trademarks.
