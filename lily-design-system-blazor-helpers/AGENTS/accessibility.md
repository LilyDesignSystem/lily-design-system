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
| `ThemeSelect`      | `<div>`             | Icon button (`◑`) + dropdown `<ul role="listbox">`. |
| `LocaleSelect`     | `<div>`             | Icon button (`🌐`) + dropdown `<ul role="listbox">`. |
| `TextSizeSelect`   | `<select>`          | Native combobox with native `<option>` children.   |

"The **listbox helpers**" below means `ThemeSelect` and `LocaleSelect`.
They follow the WAI-ARIA APG listbox pattern: an icon-only
`<button type="button" aria-haspopup="listbox" aria-expanded
aria-controls>` and a `<ul role="listbox" tabindex="-1" hidden
aria-activedescendant>` of `<li role="option" aria-selected>`. A hidden
`<input name="{Name}" value="{Value}">` carries form participation. The
glyph lives in a `<span class="{helper}-icon" aria-hidden="true">`.

`TextSizeSelect` is unchanged: it is a real native `<select>` and
inherits the platform's combobox semantics wholesale.

Neither listbox helper has a `Placeholder` parameter any more. It only
existed to pin a native `<select>`'s closed display, and there is no
`<select>` to pin.

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

`@bind` works on `<select>` differently from Vue's
`v-model`. `TextSizeSelect` uses an explicit `@onchange` handler so the
event payload (the selected `<option>`'s `value`) is what flows to its
internal `SetValueAsync`. The listbox helpers have no `<select>` and no
change event: selection is driven by the component's own click and
keydown handlers, and the hidden input is written from `Value` rather
than read from.

### `RenderFragment<TContext>` and the two rendering contracts

`TextSizeSelect` emits one native `<option>` per slug inside the
`<select>`. A custom `ChildContent` replaces only the inside of the
`<select>` (the options), so the combobox container is preserved even
when consumers render their own `<option>` elements. If such a fragment
renders `<button>` swatches instead of options, the consumer must add
`aria-pressed` (button group).

For the listbox helpers, `ChildContent` **replaces the glyph inside the
button** — it does not render options. The fragment receives
`{ Value, Open, LabelFor }` and its output sits inside the button, so
it must stay decorative: the accessible name is still the button's
`aria-label`, and content that duplicates it will double up. The
listbox itself is never consumer-rendered, which keeps the APG
structure and the keyboard contract intact. Consumers who want to
drive selection from their own UI call `SetThemeAsync` /
`SetLocaleAsync` through a `@ref`.

See the per-helper `docs/accessibility.md` for patterns.

### Label vs aria-label

`TextSizeSelect` carries the consumer's accessible name as
`aria-label="@Label"` on its root `<select>`.

For the listbox helpers, `Label` is load-bearing in a stronger sense:
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

### `TextSizeSelect` (native `<select>`)

The native `<select>` provides Tab / Shift+Tab / Arrow Up / Arrow
Down / Home / End / typeahead / Enter / Space / Escape for free.
`TextSizeSelect` adds no keyboard handlers; if a `ChildContent`
fragment renders custom controls (e.g. `<button>` swatches) instead
of options, the consumer becomes responsible for keyboard behaviour.

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

`TextSizeSelect` never calls `.FocusAsync()`. Changing the selection
does not move focus elsewhere on the page (WCAG 3.2.2, On Input).

The listbox helpers **do** move focus, but only within themselves and
only in response to explicit user intent, which is what the APG
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
    var cut = RenderComponent<ThemeSelect>(p => p
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

`TextSizeSelect` keeps the `<select>` form of the same assertion:

```csharp
Assert.Equal("Text size", cut.Find("select").GetAttribute("aria-label"));
Assert.Equal(1, cut.FindAll("option").Count);
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

## InputSelect vs raw `<select>`

`TextSizeSelect` uses a raw `<select>` rather than Blazor's
`InputSelect<T>` component because:

1. `InputSelect<T>` requires an `EditContext` ancestor.
2. The helper wants explicit control of the `name` attribute (for
   multi-select scenarios).
3. A raw `<select>` keeps the markup framework-agnostic so consumers
   can apply their own CSS without fighting `InputSelect<T>`'s
   baked-in class hooks.

The listbox helpers sidestep the question entirely — they render no
`<select>` at all. Form participation rides a hidden
`<input name="{Name}" value="{Value}">`, which posts the same field a
`<select name>` would have, without inheriting any Blazor form
component's markup.

If you need `EditForm` integration, write a thin wrapper that
delegates `@bind-Value` to the helper.

## High contrast mode

Windows High Contrast Mode (and the newer Forced Colors Mode) overrides
the consumer's CSS.

`TextSizeSelect`'s raw `<select>` gets the OS-supplied focus and
selected styling automatically; no extra work is needed.

The listbox helpers get no such gift. A `<div>` / `<button>` / `<ul>`
composition is styled entirely by the consumer, so under Forced Colors
the consumer's CSS must keep the trigger's focus ring and the active
and selected options distinguishable using system colour keywords
(`Highlight`, `HighlightText`, `ButtonText`) — the `data-active`
attribute and `aria-selected` are the hooks for that. The glyph is a
text character, so it inherits `CanvasText` and stays visible. Don't
lean on a background-colour-only treatment for the active option: it
will be flattened.

Don't override `forced-color-adjust` in consumer CSS unless you've
measured the trade-off.
