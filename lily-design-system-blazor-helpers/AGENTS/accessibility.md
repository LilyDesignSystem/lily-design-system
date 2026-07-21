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
  `spec/index.md` calls it out.

## Two control shapes in this catalog

The helpers no longer share one root element. Read the shape first;
most of the notes below branch on it.

| Helper             | Root                | Shape                                              |
| ------------------ | ------------------- | -------------------------------------------------- |
| `ThemeChooser`      | `<div>`             | Icon button (`◑`) + dropdown `<ul role="listbox">`. |
| `LocaleChooser`     | `<div>`             | Icon button (`🌐`) + dropdown `<ul role="listbox">`. |
| `TextSizeChooser`   | `<div>`             | Icon button (`A`) + dropdown `<ul role="listbox">`. |

"The **listbox helpers**" below means all three: they share one shape.
They follow the WAI-ARIA APG listbox pattern: an icon-only
`<button type="button" aria-haspopup="listbox" aria-expanded
aria-controls>` and a `<ul role="listbox" tabindex="-1" hidden
aria-activedescendant>` of `<li role="option" aria-selected>`. A hidden
`<input name="{Name}" value="{Value}">` carries form participation. The
glyph lives in a `<span class="{helper}-icon" aria-hidden="true">`.

`TextSizeChooser` joined this shape last; before that it was a real
native `<select>` that inherited the platform's combobox semantics
wholesale. Its glyph is `A` (U+0041) rather than a pictograph — a plain
Latin letter is covered by every font stack, so it avoids the tofu /
emoji-substitution risk the other two carry.

No helper has a `Placeholder` parameter any more. It only existed to
pin a native `<select>`'s closed display, and there is no `<select>` to
pin.

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

No helper has a `<select>`, so none of them binds a change event:
selection is driven by the component's own click and keydown handlers,
and the hidden `<input>` is written from `Value` rather than read from.

### `RenderFragment<TContext>` and the rendering contract

`ChildContent` replaces the **glyph inside the button** in all three
helpers — it does not render options. The fragment receives
`{ Value, Open, LabelFor }` and its output sits inside the button, so
it must stay decorative: the accessible name is still the button's
`aria-label`, and content that duplicates it will double up. The
listbox itself is never consumer-rendered, so the listbox semantics —
roles, `aria-selected`, ids, `aria-activedescendant`, and
locale-chooser's per-option `lang` — cannot be broken by a consumer
override, and the APG keyboard contract stays intact. Consumers who
want to drive selection from their own UI call `SetThemeAsync` /
`SetLocaleAsync` / `SetSizeAsync` through a `@ref`.

See the per-helper `docs/accessibility.md` for patterns.

### Label vs aria-label

For every helper, `Label` is load-bearing in the strongest sense:
the trigger is icon-only and the glyph is `aria-hidden="true"`, so
`aria-label="@Label"` is the button's *entire* accessible name. The
same `Label` is also applied to the `<ul role="listbox">`. Without it
the control is unnameable.

No helper renders a visible `<label>` by default; consumers who want
one can associate it via `id` / `for` (or `aria-labelledby`) and the
`AdditionalAttributes` spread.

### `MarkupString` and XSS

The helpers never accept raw HTML strings. All user-facing content
flows through typed parameters (`string Label`, `IReadOnlyDictionary<…>
ThemeLabels`) and Razor escapes them by default. Don't change this —
`@((MarkupString)userInput)` is an XSS vector.

## Keyboard

### The listbox helpers (APG listbox)

Nothing is free here — the component implements the whole contract.

On the **button**:

| Key                 | Action                                                  |
| ------------------- | ------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).        |
| `Arrow Down`        | Open, active option = the selected one (else index 0).  |
| `Enter` / `Space`   | Open, active option = the selected one (else index 0).  |
| `Arrow Up`          | Open with the **last** option active.                   |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key               | Action                                                             |
| ----------------- | ------------------------------------------------------------------ |
| `Arrow Down`      | Move the active option down one; **clamps** at the last (no wrap). |
| `Arrow Up`        | Move the active option up one; **clamps** at the first (no wrap).  |
| `Home` / `End`    | Jump to the first / last option.                                   |
| `Enter` / `Space` | Select the active option, apply it, close, refocus the button.     |
| `Escape`          | Close and return focus **without** changing the value.             |
| `Tab`             | Close **without** stealing focus back.                             |
| Printable chars   | Typeahead over the option *labels*, 500 ms buffer reset.           |

Clicking an option selects, applies, and closes. Focus leaving the
root closes the listbox without changing the value.

Focus stays on the `<ul>` while open; the active option is conveyed by
`aria-activedescendant` (and mirrored by a `data-active` styling hook),
per the APG. Options are never focused directly.

### Blazor deviations from the canonical Svelte implementation

Two clauses cannot be met faithfully with Blazor's declarative event
bindings. Both are behavioural refinements, not contract breaks, and
both are load-bearing — don't "fix" them without reading the specs.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to the arrow keys while sparing `Tab`. Arrow keys
  and `Space` therefore also scroll the page in their default way. A
  `<button>` synthesises a click for `Enter` and `Space`, so the
  component sets a suppress-next-click flag to stop the listbox
  toggling twice.
- **No document-level click listener.** The Svelte reference closes on
  any outside click via `<svelte:document onclick>`. Blazor has no
  declarative equivalent and these packages ship no JavaScript, so
  closing is driven by the root's `focusout` instead. Because Blazor's
  `FocusEventArgs` exposes no `relatedTarget`, the component flags the
  focus moves it makes itself (`_suppressFocusOut`) and ignores the
  matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>` — that one is
unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

## Focus management

No helper moves focus outside itself: changing the selection never
sends focus elsewhere on the page (WCAG 3.2.2, On Input).

The helpers **do** move focus within themselves, and only in response
to explicit user intent, which is what the APG
pattern requires: opening moves focus to the `<ul>`; `Enter`, `Space`,
and `Escape` return it to the button. Focus is moved with
`ElementReference.FocusAsync()`, deferred to `OnAfterRenderAsync`
because the `<ul>` cannot take focus while it still carries `hidden` —
the attribute has to come off in a completed render first.

When wiring `OnChange` to navigation (`NavigationManager.NavigateTo`),
preserve scroll position and avoid focus jumps.

## Screen-reader pronunciation (locale select)

Each locale option carries `lang="{TagFor(code)}"` (BCP 47 hyphen form)
so screen readers switch pronunciation per option — WCAG 3.1.2,
Language of Parts. The button and the list carry no `lang`.

The listbox rewrite made this *more* reliable, not less: platform
`<select>` popups are rendered by the OS and frequently ignore
per-`<option>` `lang`, whereas these options are ordinary DOM nodes
that assistive technology reads with the page's own rules.

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
    var cut = RenderComponent<ThemeChooser>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light" }));

    // Listbox helper: the name is on the button AND the list.
    Assert.Equal("Theme", cut.Find("button").GetAttribute("aria-label"));
    Assert.Equal("Theme", cut.Find("ul").GetAttribute("aria-label"));
    Assert.Equal("listbox", cut.Find("ul").GetAttribute("role"));
    Assert.Equal(1, cut.FindAll("li[role='option']").Count);
}
```

`LocaleChooser` and `TextSizeChooser` assert identically; only the
required parameters and the glyph class differ.

For full audits run axe-core in a real Blazor host (Blazor Server,
WebAssembly hosted, Blazor Web App). The catalog has no built-in
axe runner because the helpers ship no CSS — a meaningful audit
must run against the consumer's styled markup.

## EditForm and EditContext

The helpers don't integrate with `EditForm` / `EditContext` by
default — they're standalone widgets, not form controls. Consumers
wiring them into a form can bind `@bind-Value` to a model property
and the rest is conventional Blazor data binding.

## No `InputSelect<T>`, and no `<select>` at all

No helper uses Blazor's `InputSelect<T>`, or any `<select>`. Each is a
`<div>` / `<button>` / `<ul>` composition with a hidden `<input>` for
form participation, because:

1. `InputSelect<T>` requires an `EditContext` ancestor.
2. The helpers want explicit control of the `name` attribute (for
   multi-control scenarios) and of the closed trigger's width, which a
   native `<select>` pins to its longest option.
3. Hand-rolled markup keeps the class hooks framework-agnostic so
   consumers can apply their own CSS without fighting `InputSelect<T>`'s
   baked-in ones.

The cost of dropping the native control is real and is stated plainly
in each helper's `docs/accessibility.md` — a custom listbox has weaker
assistive-technology support than a native `<select>`, which remains
the better choice for some audiences.

The helpers sidestep the question entirely — they render no
`<select>` at all. Form participation rides a hidden
`<input name="{Name}" value="{Value}">`, which posts the same field a
`<select name>` would have, without inheriting any Blazor form
component's markup.

If you need `EditForm` integration, write a thin wrapper that
delegates `@bind-Value` to the helper.

## High contrast mode

Windows High Contrast Mode (and the newer Forced Colors Mode) overrides
the consumer's CSS.

A native `<select>` would get the OS-supplied focus and selected
styling for free. The helpers get no such gift: a `<div>` /
`<button>` / `<ul>` composition is styled entirely by the consumer, so under Forced Colors
the consumer's CSS must keep the trigger's focus ring and the active
and selected options distinguishable using system colour keywords
(`Highlight`, `HighlightText`, `ButtonText`) — the `data-active`
attribute and `aria-selected` are the hooks for that. The glyph is a
text character, so it inherits `CanvasText` and stays visible. Don't
lean on a background-colour-only treatment for the active option: it
will be flattened.

Don't override `forced-color-adjust` in consumer CSS unless you've
measured the trade-off.
