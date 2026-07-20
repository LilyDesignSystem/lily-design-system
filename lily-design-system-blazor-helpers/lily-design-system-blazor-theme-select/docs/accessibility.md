# Accessibility

The select targets WCAG 2.2 AAA. It is an **icon button that opens a
dropdown listbox**, built to the WAI-ARIA Authoring Practices listbox
pattern. It is not a native `<select>`, and that choice has real
accessibility consequences — they are stated plainly below rather than
buried.

## Roles and properties

| Element                     | Role / Property                                   | Source             |
| --------------------------- | ------------------------------------------------- | ------------------ |
| `div.theme-select`          | none (plain container)                            | Component          |
| `input[type=hidden]`        | `name` — form participation only                  | Component          |
| `button.theme-select-button`| implicit `role="button"`                          | Browser            |
| `button.theme-select-button`| `aria-label="@Label"`                             | Consumer parameter |
| `button.theme-select-button`| `aria-haspopup="listbox"`                         | Component          |
| `button.theme-select-button`| `aria-expanded="true\|false"`                     | Component          |
| `button.theme-select-button`| `aria-controls="{list id}"`                       | Component          |
| `span.theme-select-icon`    | `aria-hidden="true"`                              | Component          |
| `ul.theme-select-list`      | `role="listbox"`, `tabindex="-1"`                 | Component          |
| `ul.theme-select-list`      | `aria-label="@Label"`                             | Consumer parameter |
| `ul.theme-select-list`      | `aria-activedescendant` (only while open)         | Component          |
| `ul.theme-select-list`      | `hidden` while closed                             | Component          |
| `li.theme-select-option`    | `role="option"`, `aria-selected="true\|false"`    | Component          |
| `li.theme-select-option`    | `data-active` on the active option (styling hook) | Component          |

Focus stays on the `<ul>` while the listbox is open; the active option
is conveyed by `aria-activedescendant`, never by moving DOM focus onto
an `<li>`. That is the APG listbox contract.

## Keyboard contract

Implemented by the component, not the browser.

On the **button**:

| Key                 | Action                                                 |
| ------------------- | ------------------------------------------------------ |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).       |
| `Arrow Down`        | Open, active option = the selected one (else index 0). |
| `Enter` / `Space`   | Open, active option = the selected one (else index 0). |
| `Arrow Up`          | Open with the **last** option active.                  |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key               | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `Arrow Down`      | Move the active option down one; **clamps** at the last (no wrap).     |
| `Arrow Up`        | Move the active option up one; **clamps** at the first (no wrap).      |
| `Home`            | Jump to the first option.                                              |
| `End`             | Jump to the last option.                                               |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus **without** changing the value.                 |
| `Tab`             | Close **without** stealing focus back.                                 |
| Printable chars   | Typeahead over the option *labels*, 500 ms buffer reset.               |

Clicking an option selects it; focus leaving the root closes the
listbox without changing the value.

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on `<html>`.
2. The `@bind-Value` binding in user code, mirrored onto the hidden
   input's `value` for form participation.
3. `aria-selected="true"` on exactly one `<li role="option">`, so the
   selection *is* readable off the open listbox.

## The tradeoffs of an icon button plus a custom listbox

Three costs come with this shape. None of them is a bug; all of them
are worth knowing before you ship.

### 1. The accessible name rests entirely on `aria-label`

The button renders one glyph, and that glyph is `aria-hidden="true"`.
There is no visible text, no `<label>`, and no fallback. If `Label` is
empty, missing, or untranslated, the control is **unnameable** — a
screen reader announces "button" and nothing more.

So: `Label` is not decoration. Treat it as a required, localised
string, and review it the way you would review visible copy.

### 2. A custom listbox has weaker assistive-technology support than a native `<select>`

A native `<select>` is rendered by the platform: it gets the OS picker,
the platform's own touch and rotor affordances, and years of
screen-reader special-casing. This control is `<div>` / `<button>` /
`<ul>` / `<li>` with ARIA on top. Correct ARIA is necessary but not
sufficient — real-world behaviour varies more, especially on mobile
screen readers and in virtual/browse modes, where an
`aria-activedescendant` listbox is announced less consistently than a
native picker.

If your users depend on the platform picker — a screen-reader-heavy or
mobile-first audience — a plain `<select>` bound to `Value` is the safer
control, and choosing it over this helper is a legitimate decision.

### 3. The glyph is a font-dependent character, not an asset

The default glyph is `◑` (U+25D1 CIRCLE WITH RIGHT HALF BLACK). This
package ships no fonts, no icons, and no images, so what the user sees
is whatever the platform's font stack resolves. Depending on OS,
browser, font settings, and the user's own stylesheet it may render at
a different weight or size than you designed for, get substituted from
a fallback font, appear as a colour emoji, or render as `□` if nothing
in the stack covers it.

Because the glyph is `aria-hidden`, a missing glyph is a *visual*
failure, not a naming failure — the control stays operable and named.
But it can leave a sighted user with an unlabelled blank button. If
that matters, supply your own `ChildContent` (an inline SVG is the
robust choice) and/or give `.theme-select-button` a visible
`min-width` / `min-height` so it stays a clear target either way.

## The status region is still the recommended pattern

The closed control shows only a glyph, so nothing on screen says which
theme is active. The recommended shape is the control **plus** a status
region echoing the active theme, and that is what
[`examples/Basic.razor`](../examples/Basic.razor) and the
[quick start](../index.md#quick-start) show.

```razor
<ThemeSelect Label="Choose a theme" @bind-Value="theme" ... />

<p class="theme-select-status" aria-live="polite">
    @Localizer["currentTheme", ThemeLabel(theme)]
</p>
```

Why this shape:

- **Visible, not `sr-only`, by default.** The closed control does not
  show the selection to *anyone*, so sighted users need the echo as
  much as screen-reader users do; visible text also helps cognitive
  accessibility, which AAA weighs heavily. If a design truly cannot
  spare the space, keep the element and apply a visually-hidden class
  (recipe in [styling.md](./styling.md#the-status-region)) — but treat
  that as the fallback, not the starting point.
- **`aria-live="polite"`, not `assertive`.** A theme change is not an
  interruption. `polite` also means the region announces only on
  *mutation*, so it stays quiet on first paint and speaks once per
  change.
- **`role="status"` is an equivalent spelling.** `role="status"` implies
  `aria-live="polite"`; use either, not both plus a redundant one.
- **Show the human label, not the raw slug.** The status text is
  consumer-supplied and should be localised alongside your `ThemeLabels`.

Unlike the old placeholder-pinned `<select>`, the selection *is* now
readable off the control itself: reopening the listbox announces the
active option as `aria-selected`. The status region is therefore no
longer compensating for missing semantics — it is compensating for the
closed button being a bare glyph.

## Internationalisation

- `Label` is consumer-supplied; pass a translated string. See tradeoff
  1 — this one is load-bearing.
- `ThemeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

A `IStringLocalizer<T>` example:

```razor
@inject IStringLocalizer<SharedResources> Localizer

<ThemeSelect
    Label="@Localizer["chooseTheme"]"
    ThemesUrl="/assets/themes/"
    Themes="@(new[]{ "light", "dark", "abyss" })"
    ThemeLabels="@(new Dictionary<string, string>
    {
        ["light"] = Localizer["light"],
        ["dark"] = Localizer["dark"],
        ["abyss"] = Localizer["abyss"],
    })"
    @bind-Value="theme" />
```

## Visible focus

The component does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring — on the
**button**, on the **`<ul>`** (which takes focus while open), and on the
active option. NHS-UK and Lily™ themes ship a high-contrast focus
outline that meets AAA.

A safe default:

```css
.theme-select-button:focus-visible,
.theme-select-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

/* The active option is not focused; give it its own visible cue. */
.theme-select-option[data-active] {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: -2px;
}
```

Styling `[data-active]` is not optional polish. Focus sits on the
`<ul>`, so without a visual cue on the active option a sighted keyboard
user cannot see where the arrow keys have moved them.

## Reduced motion

The component performs no animation, including on open and close. If
you add a dropdown transition in consumer CSS, gate it:

```css
@media (prefers-reduced-motion: reduce) {
    .theme-select-list {
        transition: none;
    }
}
```

Theme CSS files are likewise responsible for respecting
`prefers-reduced-motion` if they introduce transitions on the
`data-theme` swap.

## Screen-reader behaviour matrix

Announcements for a custom listbox vary more than for a native
`<select>`; verify against your own targets rather than treating this
as a guarantee.

| Reader     | OS       | Browser   | Closed button                       | Open listbox                          |
| ---------- | -------- | --------- | ----------------------------------- | ------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Choose a theme, pop-up button".    | "Light, selected, 1 of 3".            |
| NVDA       | Windows  | Firefox   | "Choose a theme button collapsed".  | "list box, Light 1 of 3 selected".    |
| Narrator   | Windows  | Edge      | "Choose a theme button collapsed".  | "Light selected, 1 of 3".             |
| JAWS       | Windows  | Chrome    | "Choose a theme button collapsed".  | "list box, Light, 1 of 3".            |
| TalkBack   | Android  | Chrome    | "Choose a theme, button".           | Varies; verify on your target device. |

## Common mistakes to avoid

- **Shipping without a meaningful `Label`.** The button is icon-only;
  `Label` is the entire accessible name. See tradeoff 1.
- **Putting text in `ChildContent` and dropping `Label`.**
  `ChildContent` replaces the glyph, but the accessible name still comes
  from the button's `aria-label`. Set both.
- **Hiding the options with `display: none`.** That removes them from
  the accessibility tree. The component's own `hidden` on the `<ul>` is
  the correct mechanism; do not add a second one.
- **Styling `.theme-select-list` without positioning it.** The package
  ships no CSS, so an open list participates in normal flow and shoves
  the page around. Give the root `position: relative` and the list
  `position: absolute`. See [styling.md](./styling.md).
- **Forgetting a visible cue for `[data-active]`.** See "Visible focus".
- **Forgetting to translate `ThemeLabels`.** The component only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.

## Focus order under RTL

In RTL layout, focus moves visually right-to-left but logically in
source order — `Tab` still reaches the button in source order, and the
option order inside the listbox follows `Themes`.

## High contrast mode

`<button>` and `<ul>` do not get the automatic Forced Colors Mode
treatment a native `<select>` does, so this is now your responsibility:
test the control in Windows High Contrast / Forced Colors Mode and make
sure the button border, the open list's boundary, and the
`[data-active]` and `[aria-selected]` cues all survive. Prefer
`currentColor`, `ButtonText`, `Highlight` and `HighlightText` system
colours over fixed values, and do not override `forced-color-adjust`
unless you have measured the trade-off.

## Testing for a11y in bUnit

```csharp
[Fact]
public void Has_Accessible_Name_And_Listbox_Wiring()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var button = cut.Find("button.theme-select-button");
    Assert.Equal("Theme", button.GetAttribute("aria-label"));
    Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
    Assert.Equal("false", button.GetAttribute("aria-expanded"));

    var list = cut.Find("ul.theme-select-list");
    Assert.Equal(button.GetAttribute("aria-controls"), list.GetAttribute("id"));
    Assert.Equal("Theme", list.GetAttribute("aria-label"));
    Assert.True(list.HasAttribute("hidden"));

    // The glyph must never become the accessible name.
    Assert.Equal("true", cut.Find(".theme-select-icon").GetAttribute("aria-hidden"));
}
```

For broader a11y testing run axe-core in a real Blazor host. Automated
tools will confirm the ARIA wiring, but they cannot tell you whether a
real screen reader announces the listbox usefully — see tradeoff 2, and
test manually.

## Blazor-specific deviations

Two clauses of the canonical (Svelte) keyboard contract could not be
implemented identically in Blazor. Both are behavioural refinements
rather than contract breaks, and both are visible to users:

- **Arrow keys and `Space` do not suppress page scroll.** Blazor
  evaluates `@onkeydown:preventDefault` at render time, not per event,
  so it cannot be applied to the arrow keys while sparing `Tab`
  (suppressing `Tab`'s default would trap focus — a far worse
  accessibility failure). The component therefore calls no
  `preventDefault` on keydown. To keep `Enter` / `Space` from toggling
  the listbox twice — a `<button>` synthesises a click for both — it
  swallows the click that follows a keydown it already handled.
- **Outside clicks close via `focusout`, not a document listener.**
  This package ships no JavaScript and Blazor has no declarative
  document-level event binding, so the root's `focusout` drives closing.
  Because Blazor's `FocusEventArgs` does not expose `relatedTarget`, the
  component flags the focus moves it makes itself and ignores the
  matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`: that one is
unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

## References

- WAI-ARIA Authoring Practices — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA Authoring Practices — Select-Only Combobox:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 1.4.1 Use of Color:
  <https://www.w3.org/WAI/WCAG22/Understanding/use-of-color>
- WCAG 2.4.7 Focus Visible:
  <https://www.w3.org/WAI/WCAG22/Understanding/focus-visible>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- Microsoft Learn — Accessibility in Blazor:
  <https://learn.microsoft.com/aspnet/core/blazor/accessibility>

---

Lily™ and Lily Design System™ are trademarks.
