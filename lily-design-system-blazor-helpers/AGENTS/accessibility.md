# Accessibility — Lily Blazor Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Blazor-specific notes that are easy to miss when porting a helper
from Svelte to Blazor.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec.md` calls it out.

## Blazor-specific gotchas

### `@attributes` and `@bind`

Blazor's `@attributes` directive spreads a `Dictionary<string, object>?`
onto the element. Consumers can pass ARIA overrides this way without
the component blocking them. The helpers always declare:

```csharp
[Parameter(CaptureUnmatchedValues = true)]
public Dictionary<string, object>? AdditionalAttributes { get; set; }
```

…and bind it on the root via `@attributes="AdditionalAttributes"`.
This is the Blazor equivalent of React's `...rest` and Vue's
`v-bind="$attrs"`.

`@bind` works on `<input type="radio">` differently from Vue's
`v-model`. The helpers use explicit `@onchange` handlers so the
event payload (the radio's `value`) is what flows to the picker's
internal `SetValueAsync`, not the radio's `checked` boolean.

### `RenderFragment<TContext>` and the radiogroup contract

The default rendering wraps each option in a `<label>` containing a
native `<input type="radio">`. A custom `ChildContent` replaces only
the inside of the `<fieldset role="radiogroup">`, so the group
container is preserved even when consumers render `<button>` swatches
or a `<select>` dropdown.

If a custom render fragment drops the radios entirely, the consumer
must add `aria-pressed` (button group) or rely on `<select>`'s
implicit combobox role. See the per-helper `docs/accessibility.md`
for patterns.

### Label vs aria-label

The helpers carry the consumer's group name as `aria-label="@Label"`
on the root `<fieldset role="radiogroup">`. There is no separate
visible `<legend>` by default; consumers who want a visible legend
can add one inside the fieldset via the `ChildContent` render
fragment.

### `MarkupString` and XSS

The helpers never accept raw HTML strings. All user-facing content
flows through typed parameters (`string Label`, `IReadOnlyDictionary<…>
ThemeLabels`) and Razor escapes them by default. Don't change this —
`@((MarkupString)userInput)` is an XSS vector.

## Keyboard

Native `<input type="radio">` provides Tab / Shift+Tab / Arrow /
Space / Home / End for free. None of the helpers add keyboard
handlers; if a `ChildContent` fragment drops the radios, the
consumer becomes responsible for keyboard behaviour.

## Focus management

The helpers never call `.FocusAsync()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `OnChange` to navigation
(`NavigationManager.NavigateTo`), preserve scroll position and avoid
focus jumps.

## Screen-reader pronunciation (locale picker)

Each `<label>` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
`ChildContent` renderings must keep this attribute on the rendered
element.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles. NHS-UK and Lily themes ship high-contrast focus
outlines that meet AAA.

## Reduced motion

The helpers perform no animation. Theme CSS files that introduce
transitions on `data-theme` changes are responsible for honouring
`prefers-reduced-motion`.

## Testing for a11y

bUnit + xUnit is enough for ARIA-attribute assertions:

```csharp
[Fact]
public void Has_Aria_Label()
{
    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light" }));

    Assert.Equal("Theme", cut.Find("fieldset").GetAttribute("aria-label"));
    Assert.Equal("radiogroup", cut.Find("fieldset").GetAttribute("role"));
}
```

For full audits run axe-core in a real Blazor host (Blazor Server,
WebAssembly hosted, Blazor Web App). The catalog has no built-in
axe runner because the helpers ship no CSS — a meaningful audit
must run against the consumer's styled markup.

## EditForm and EditContext

The helpers don't integrate with `EditForm` / `EditContext` by
default — they're standalone widgets, not form controls. Consumers
wiring them into a form can bind `@bind-Value` to a model property
and the rest is conventional Blazor data binding.

## InputRadio vs raw `<input type="radio">`

The helpers use raw `<input type="radio">` rather than Blazor's
`InputRadio<T>` component because:

1. `InputRadio<T>` requires an `EditContext` ancestor.
2. The helpers want explicit control of the `name` attribute (for
   multi-picker scenarios).
3. Raw radios keep the markup framework-agnostic so consumers can
   apply their own CSS without fighting `InputRadio<T>`'s baked-in
   class hooks.

If you need `EditForm` integration, write a thin wrapper that
delegates `@bind-Value` to the helper.

## High contrast mode

Windows High Contrast Mode (and the newer Forced Colors Mode) overrides
the consumer's CSS. The helpers' raw `<input type="radio">` elements
get the OS-supplied focus and selected styling automatically; no
extra work is needed. Don't override `forced-color-adjust` in
consumer CSS unless you've measured the trade-off.
