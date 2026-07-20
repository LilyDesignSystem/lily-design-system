# Custom rendering

The default markup is an icon button that opens a dropdown listbox,
and the button's whole content is one glyph: `◑` (U+25D1). When you
want a different mark — an inline SVG, a glyph plus a text label, a
glyph that reacts to the open state — pass your own
`RenderFragment<ThemeSelectContext>`.

`ChildContent` **replaces the glyph inside the button**. It does not
render the options: the listbox is owned by the component and built
from the `Themes` parameter.

## The ThemeSelectContext contract

The fragment receives one record with three fields:

```csharp
public sealed class ThemeSelectContext
{
    public required string Value { get; init; }
    public required bool Open { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

`Value` is the active theme slug, `Open` is true while the listbox is
open, and `LabelFor(slug)` resolves a slug to its display label
(`ThemeLabels[slug]` when supplied, otherwise the title-cased slug).

In Razor, the fragment is declared with `<ChildContent Context="ctx">`:

```razor
<ThemeSelect Label="…" ThemesUrl="/…" Themes="@(…)">
    <ChildContent Context="ctx">
        @* ctx.Value, ctx.Open, ctx.LabelFor *@
    </ChildContent>
</ThemeSelect>
```

The `Context="ctx"` attribute names the lambda parameter; without
it Blazor defaults to `context` (also fine).

## Patterns

### Inline SVG instead of the glyph

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })">
    <ChildContent Context="ctx">
        <svg class="theme-select-icon" aria-hidden="true" focusable="false"
             viewBox="0 0 16 16" width="16" height="16">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
            <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
        </svg>
    </ChildContent>
</ThemeSelect>
```

Keep `aria-hidden="true"` (and `focusable="false"` on SVG). The
button is icon-only and its entire accessible name is the `Label`
parameter — a mark that is exposed to assistive technology competes
with that name instead of adding to it.

### Glyph plus a text label

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })">
    <ChildContent Context="ctx">
        <span class="theme-select-icon" aria-hidden="true">@ThemeSelect.CircleWithRightHalfBlack</span>
        <span class="theme-select-text" aria-hidden="true">@ctx.LabelFor(ctx.Value)</span>
    </ChildContent>
</ThemeSelect>
```

Both spans stay `aria-hidden`, so the button still announces as
"Theme". If you want the current theme announced too, put it in the
`Label` you pass in (`Label="@($"Theme: {theme}")"`) rather than in
visible-but-exposed markup — that keeps one accessible name instead
of two competing ones.

### State-dependent glyph

`ctx.Open` lets the mark reflect whether the listbox is showing, and
`ctx.Value` lets it reflect the active theme:

```razor
<ChildContent Context="ctx">
    <span class="theme-select-icon" aria-hidden="true">
        @(ctx.Open ? "▾" : ctx.Value == "dark" ? "●" : "◑")
    </span>
</ChildContent>
```

The open state is already conveyed to assistive technology by
`aria-expanded` on the button, so this is purely visual — which is
exactly why the mark stays `aria-hidden`.

## Building a fully custom control instead

`ChildContent` cannot replace the listbox, so a swatch row, a
segmented control, or a flyout of your own is a different job. Two
supported routes.

### Route 1: keep the component, drive it with `SetThemeAsync`

Take a `@ref` to the component and call its public
`Task SetThemeAsync(string slug)` from your own markup. The
component still owns the `<link>` swap, `data-theme`, persistence,
and the callbacks:

```razor
<ThemeSelect @ref="select"
             Label="Theme"
             ThemesUrl="/assets/themes/"
             Themes="@themes"
             @bind-Value="theme"
             CssClass="visually-hidden" />

<div class="segment-group" role="group" aria-label="Appearance">
    @foreach (var t in themes)
    {
        var slug = t;
        <button type="button"
                class="segment-group-item"
                aria-pressed="@(theme == slug)"
                @onclick="@(async () => await select!.SetThemeAsync(slug))">
            @slug
        </button>
    }
</div>

@code {
    private ThemeSelect? select;
    private string[] themes = { "light", "dark" };
    private string theme = "";
}
```

`aria-pressed` carries each button's active state. `SetThemeAsync`
returns a `Task` — `await` it so the apply (and the bUnit test
harness) settles before the next statement runs.

### Route 2: skip the component, use the statics

When you want none of the component's markup, drive the apply
yourself. `ThemeSelect` exposes the URL construction as pure
statics:

```csharp
ThemeSelect.NormaliseThemesUrl("/assets/themes")          // "/assets/themes/"
ThemeSelect.ThemeHref("/assets/themes", "dark", ".css")   // "/assets/themes/dark.css"
```

Going this route means you also own the four apply steps in
[spec/index.md §5.3](../spec/index.md#53-applying-a-theme): locating
or creating the managed `<link rel="stylesheet"
data-lily-theme-select="{Name}">`, setting its `href`, setting
`data-theme` on `document.documentElement`, and the optional
`localStorage` write. Prefer route 1 unless you specifically need to
own that lifecycle.

## What the fragment should *not* do

- Don't render `<option>` or `<li role="option">` elements. The
  listbox is built from `Themes`; markup you add lands inside the
  `<button>`, where option semantics are invalid.
- Don't expose the mark to assistive technology. Keep
  `aria-hidden="true"` on it; `Label` is the accessible name.
- Don't nest an interactive element (a `<button>`, an `<a>`) inside
  the fragment — it renders inside the trigger `<button>`, and
  nested interactive content is invalid HTML.
- Don't mutate `document.head` or `data-theme` directly; let the
  select own that lifecycle.

## Why `RenderFragment<TContext>` and not a separate component

The `<TContext>` parameter is the Blazor pattern for "render-prop"
or "scoped slot". It gives the consumer:

- A strongly-typed context so IntelliSense surfaces the available
  fields (`Value`, `Open`, `LabelFor`).
- A single render-tree node owned by the select.
- Predictable lifetime — the fragment renders when the select
  renders, no extra wiring.

Compare to a child component approach: that would force consumers
to write a wrapper component and pass it as a generic type parameter,
which is more friction for the common case.

## Composability

Multiple consumers can pass `ChildContent`; the select doesn't keep
state across instances. Selects with `Name="theme-a"` and
`Name="theme-b"` render independent controls whose managed `<link>`
elements don't conflict.

---

Lily™ and Lily Design System™ are trademarks.
