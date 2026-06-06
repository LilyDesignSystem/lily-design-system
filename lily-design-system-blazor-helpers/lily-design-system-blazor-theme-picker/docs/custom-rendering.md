# Custom rendering

The default markup is a row of native radio inputs. When you need a
different visual — swatch buttons, a dropdown, a segmented control,
a flyout menu — pass your own `RenderFragment<ThemePickerContext>`.

## The ThemePickerContext contract

The fragment receives one record with five fields:

```csharp
public sealed class ThemePickerContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

`SetTheme(slug)` performs the four-step apply in
[spec.md §5.3](../spec.md#53-applying-a-theme).

In Razor, the fragment is declared with `<ChildContent Context="ctx">`:

```razor
<ThemePicker Label="…" ThemesUrl="/…" Themes="@(…)">
    <ChildContent Context="ctx">
        @* ctx.Themes, ctx.Value, ctx.SetTheme, ctx.Name, ctx.LabelFor *@
    </ChildContent>
</ThemePicker>
```

The `Context="ctx"` attribute names the lambda parameter; without
it Blazor defaults to `context` (also fine).

## Patterns

### Swatch buttons

```razor
<ThemePicker
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <button type="button"
                    class="theme-picker-swatch"
                    data-theme="@t"
                    aria-pressed="@(ctx.Value == t)"
                    @onclick="@(() => ctx.SetTheme(t))">
                @ctx.LabelFor(t)
            </button>
        }
    </ChildContent>
</ThemePicker>
```

`aria-pressed` carries the active state; the picker no longer
renders radios, so `aria-checked` is gone. The `data-theme` on each
button lets your CSS preview the swatch colours by hooking into the
same `:root[data-theme]` cascade.

### Native `<select>` dropdown

```razor
<ThemePicker
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark", "abyss" })">
    <ChildContent Context="ctx">
        <label class="theme-picker-select-label">
            <select value="@ctx.Value"
                    @onchange="@(async e => await ctx.SetTheme(e.Value?.ToString() ?? ""))">
                @foreach (var t in ctx.Themes)
                {
                    <option value="@t">@ctx.LabelFor(t)</option>
                }
            </select>
        </label>
    </ChildContent>
</ThemePicker>
```

Note: the outer `<fieldset role="radiogroup">` is still present.
If you don't want radiogroup semantics, render a `<select>` outside
the picker and call `SetTheme` from a wrapping component instead.

### Custom radio markup

If you want native radio semantics but a custom visual layout:

```razor
<ThemePicker
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <label class="@($"my-radio {(ctx.Value == t ? "is-active" : "")}")">
                <input type="radio"
                       name="@ctx.Name"
                       value="@t"
                       checked="@(ctx.Value == t)"
                       @onchange="@(async _ => await ctx.SetTheme(t))" />
                <span class="my-radio-swatch" aria-hidden="true"></span>
                <span class="my-radio-label">@ctx.LabelFor(t)</span>
            </label>
        }
    </ChildContent>
</ThemePicker>
```

### Segmented button group

```razor
<ThemePicker
    Label="Appearance"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark", "high-contrast" })">
    <ChildContent Context="ctx">
        <div class="segment-group" role="radiogroup" aria-label="Appearance">
            @foreach (var t in ctx.Themes)
            {
                <button type="button"
                        class="segment-group-item"
                        role="radio"
                        aria-checked="@(ctx.Value == t)"
                        @onclick="@(() => ctx.SetTheme(t))">
                    @ctx.LabelFor(t)
                </button>
            }
        </div>
    </ChildContent>
</ThemePicker>
```

When you replace the radios with buttons, add `role="radio"` and
`aria-checked` to keep the WAI-ARIA contract.

## What the fragment should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  picker own that lifecycle.
- Don't add a competing `name` to your inputs — use the one
  provided by `ctx.Name`.
- Don't render outside the `<fieldset>`; the picker assumes its
  ChildContent is inside the radiogroup container.
- Don't capture `ctx.SetTheme` in a closure and call it from a
  detached scope (e.g. an async loop that outlives the component);
  the call will throw if the component has been disposed.

## Why `RenderFragment<TContext>` and not a separate component

The `<TContext>` parameter is the Blazor pattern for "render-prop"
or "scoped slot". It gives the consumer:

- A strongly-typed context so IntelliSense surfaces the available
  fields (`Themes`, `Value`, `SetTheme`, `Name`, `LabelFor`).
- A single render-tree node owned by the picker.
- Predictable lifetime — the fragment renders when the picker
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

Multiple consumers can pass `ChildContent`; the picker doesn't keep
state across instances. Pickers with `Name="theme-a"` and
`Name="theme-b"` render independent radiogroups whose managed
`<link>` elements don't conflict.
