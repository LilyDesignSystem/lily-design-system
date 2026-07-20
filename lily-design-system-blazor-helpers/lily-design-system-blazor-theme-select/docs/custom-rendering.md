# Custom rendering

The default markup is a native `<select>` with one `<option>` per
theme. When you need a different visual — swatch buttons, a custom
dropdown, a segmented control, a flyout menu — pass your own
`RenderFragment<ThemeSelectContext>`.

## The ThemeSelectContext contract

The fragment receives one record with five fields:

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

`SetTheme(slug)` performs the four-step apply in
[spec/index.md §5.3](../spec/index.md#53-applying-a-theme).

In Razor, the fragment is declared with `<ChildContent Context="ctx">`:

```razor
<ThemeSelect Label="…" ThemesUrl="/…" Themes="@(…)">
    <ChildContent Context="ctx">
        @* ctx.Themes, ctx.Value, ctx.SetTheme, ctx.Name, ctx.LabelFor *@
    </ChildContent>
</ThemeSelect>
```

The `Context="ctx"` attribute names the lambda parameter; without
it Blazor defaults to `context` (also fine).

## Patterns

### Swatch buttons

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <button type="button"
                    class="theme-select-swatch"
                    data-theme="@t"
                    aria-pressed="@(ctx.Value == t)"
                    @onclick="@(() => ctx.SetTheme(t))">
                @ctx.LabelFor(t)
            </button>
        }
    </ChildContent>
</ThemeSelect>
```

`aria-pressed` carries the active state on each swatch button. The
`data-theme` on each button lets your CSS preview the swatch colours
by hooking into the same `:root[data-theme]` cascade.

### Custom `<option>` markup

When you want the native `<select>` but control over the rendered
`<option>` set (extra attributes, grouping, custom labels), render
the options yourself. The fragment renders inside the root
`<select>`:

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark", "abyss" })">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <option class="theme-select-option" value="@t">
                @ctx.LabelFor(t)
            </option>
        }
    </ChildContent>
</ThemeSelect>
```

Note: the outer `<select>` is still present and owns the change
event, and the component still renders its own placeholder
`<option class="theme-select-option theme-select-placeholder" value=""
selected>` BEFORE your fragment. Do not mark your own options
`selected` — the placeholder is always the selected one, and the
select's value snaps back to it after every change. Read the active
theme from `ctx.Value`. If you want a non-`<select>` control entirely (swatch buttons,
a flyout), render that markup outside the component and call
`SetTheme` from a wrapping component instead.

### Segmented button group

A button-based control can't live inside a `<select>`, so render it
in a wrapping component and call `SetTheme` from there:

```razor
<div class="segment-group" role="toolbar" aria-label="Appearance">
    @foreach (var t in themes)
    {
        <button type="button"
                class="segment-group-item"
                aria-pressed="@(theme == t)"
                @onclick="@(() => SetTheme(t))">
            @Label(t)
        </button>
    }
</div>
```

`aria-pressed` carries each button's active state. Wire `SetTheme`
to write the bound `Value` that you also pass to a hidden
`<ThemeSelect>`, or drive the theme apply yourself.

## What the fragment should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  select own that lifecycle.
- Don't add a competing `name` to your markup — use the one
  provided by `ctx.Name`.
- Don't capture `ctx.SetTheme` in a closure and call it from a
  detached scope (e.g. an async loop that outlives the component);
  the call will throw if the component has been disposed.

## Why `RenderFragment<TContext>` and not a separate component

The `<TContext>` parameter is the Blazor pattern for "render-prop"
or "scoped slot". It gives the consumer:

- A strongly-typed context so IntelliSense surfaces the available
  fields (`Themes`, `Value`, `SetTheme`, `Name`, `LabelFor`).
- A single render-tree node owned by the select.
- Predictable lifetime — the fragment renders when the select
  renders, no extra wiring.

Compare to a child component approach: that would force consumers
to write a wrapper component and pass it as a generic type parameter,
which is more friction for the common case.

## Async `SetTheme`

`SetTheme` is `Func<string, Task>` — it returns a `Task`. Always
`await` it (or call it via `@onclick="@(async _ => await …)"`) so
the bUnit test harness can settle:

```razor
@onclick="@(async () => await ctx.SetTheme(t))"
```

In simple synchronous-looking handlers, the fire-and-forget form
also works (`@onclick="@(() => ctx.SetTheme(t))"`) — Blazor schedules
the continuation correctly — but `await`ing keeps the bUnit test
harness in sync.

## Composability

Multiple consumers can pass `ChildContent`; the select doesn't keep
state across instances. Selects with `Name="theme-a"` and
`Name="theme-b"` render independent `<select>` controls whose managed
`<link>` elements don't conflict.

---

Lily™ and Lily Design System™ are trademarks.
