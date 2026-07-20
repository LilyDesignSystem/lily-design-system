# Accessibility

The select targets WCAG 2.2 AAA and directly supports SC 1.4.4 (Resize
Text). It is an **icon button that opens a dropdown listbox**, built to
the WAI-ARIA Authoring Practices listbox pattern. It is not a native
`<select>`, and that choice has real accessibility consequences — they
are stated plainly below rather than buried.

## Roles and properties

| Element                         | Role / Property                                   | Source             |
| ------------------------------- | ------------------------------------------------- | ------------------ |
| `div.text-size-select`          | none (plain container)                            | Component          |
| `input[type=hidden]`            | `name` — form participation only                  | Component          |
| `button.text-size-select-button`| implicit `role="button"`                          | Browser            |
| `button.text-size-select-button`| `aria-label="@Label"`                             | Consumer parameter |
| `button.text-size-select-button`| `aria-haspopup="listbox"`                         | Component          |
| `button.text-size-select-button`| `aria-expanded="true\|false"`                     | Component          |
| `button.text-size-select-button`| `aria-controls="{list id}"`                       | Component          |
| `span.text-size-select-icon`    | `aria-hidden="true"`                              | Component          |
| `ul.text-size-select-list`      | `role="listbox"`, `tabindex="-1"`                 | Component          |
| `ul.text-size-select-list`      | `aria-label="@Label"`                             | Consumer parameter |
| `ul.text-size-select-list`      | `aria-activedescendant` (only while open)         | Component          |
| `ul.text-size-select-list`      | `hidden` while closed                             | Component          |
| `li.text-size-select-option`    | `role="option"`, `aria-selected="true\|false"`    | Component          |
| `li.text-size-select-option`    | `data-active` on the active option (styling hook) | Component          |

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

1. `data-text-size="<slug>"` on `<html>`.
2. The `@bind-Value` binding in user code, mirrored onto the hidden
   input's `value` for form participation.
3. `aria-selected="true"` on exactly one `<li role="option">`, so the
   selection *is* readable off the open listbox.

## WCAG 1.4.4 Resize Text — this helper's specific concern

This is the helper's reason to exist, so it deserves more than a
checkbox.

- **Map slugs to relative units, never to `px`.** The recommended shape
  is a percentage or `rem` on `:root`, which every descendant inherits:

  ```css
  :root[data-text-size="small"]   { font-size: 87.5%; }
  :root[data-text-size="medium"]  { font-size: 100%; }
  :root[data-text-size="large"]   { font-size: 112.5%; }
  :root[data-text-size="x-large"] { font-size: 125%; }
  ```

  If your layout uses `px` font sizes anywhere downstream, that subtree
  will silently ignore the user's choice.

- **This helper does not replace browser zoom or the user's own
  minimum font size.** SC 1.4.4 requires text to survive 200 % resize
  *by the user agent* — an in-page control is a convenience on top, not
  a substitute. Test your layout at 200 % browser zoom independently of
  this component, and make sure the two compose rather than fight:
  a `medium` slug must not pin `font-size` to a fixed value that
  overrides a user stylesheet.

- **Do not cap the scale below the user's need.** AAA-minded scales
  usually go past 125 %; consider offering an `xx-large` slug. The
  component imposes no limit — `Sizes` is entirely yours.

- **Verify reflow at the largest slug.** Scaling root text is the
  cheapest way to discover a layout that breaks under SC 1.4.10
  (Reflow). Check that nothing clips, truncates, or requires horizontal
  scrolling at your top slug.

- **The control itself must scale too.** Give
  `.text-size-select-button` and `.text-size-select-option` `em` / `rem`
  sizing so the user can still read and hit the control they just used
  to enlarge everything else.

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
That calculus bites a little harder here than for theme or locale: a
user reaching for a text-size control is, by definition, more likely to
have an access need.

### 3. The glyph is a font-dependent character, not an asset

The default glyph is `A` (U+0041 LATIN CAPITAL LETTER A). This package
ships no fonts, no icons, and no images, so what the user sees is
whatever the platform's font stack resolves.

**This is materially safer than the pictograph the other two helpers
use.** `A` is a plain Latin letter covered by every font on every
platform, rendered in the page's own typeface, always monochrome, never
substituted from an emoji font, and never a `□` tofu box. It was chosen
over U+1F5DB DECREASE FONT SIZE SYMBOL precisely for this reason: that
codepoint has no real glyph in common font stacks, falls back to a
crude bitmap shape, and means *decrease* rather than *size*.

The residual risk is smaller but not zero: `A` inherits the page's
font, so it changes weight and shape with your type choices — and,
being a text-size control, it will also scale with the very setting it
adjusts. Give `.text-size-select-button` a fixed `min-width` /
`min-height` (or size the glyph in `px`) if you need the target to stay
stable across slugs.

Because the glyph is `aria-hidden`, any glyph failure is a *visual*
failure, not a naming failure — the control stays operable and named.

## The status region is still the recommended pattern

The closed control shows only a glyph, so nothing on screen says which
size is active. The recommended shape is the control **plus** a status
region echoing the active size, and that is what
[`examples/Basic.razor`](../examples/Basic.razor) and the
[quick start](../index.md#quick-start) show.

```razor
<TextSizeSelect Label="Choose a text size" @bind-Value="size" ... />

<p class="text-size-select-status" aria-live="polite">
    @Localizer["currentTextSize", SizeLabel(size)]
</p>
```

Why this shape:

- **Visible, not `sr-only`, by default.** The closed control does not
  show the selection to *anyone*, so sighted users need the echo as
  much as screen-reader users do; visible text also helps cognitive
  accessibility, which AAA weighs heavily.
- **`aria-live="polite"`, not `assertive`.** A size change is not an
  interruption, and the change is already visible everywhere on the
  page. `polite` also means the region announces only on *mutation*, so
  it stays quiet on first paint and speaks once per change.
- **`role="status"` is an equivalent spelling.** `role="status"` implies
  `aria-live="polite"`; use either, not both plus a redundant one.
- **Show the human label, not the raw slug.** Use
  `TextSizeSelect.SizeName(slug)` so the echo matches the listbox
  exactly, or localise it alongside your `SizeLabels`.

The selection *is* also readable off the control itself: reopening the
listbox announces the active option as `aria-selected`. The status
region compensates for the closed button being a bare glyph, not for
missing semantics.

## Internationalisation

- `Label` is consumer-supplied; pass a translated string. See tradeoff
  1 — this one is load-bearing.
- `SizeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings.

A `IStringLocalizer<T>` example:

```razor
@inject IStringLocalizer<SharedResources> Localizer

<TextSizeSelect
    Label="@Localizer["chooseTextSize"]"
    Sizes="@(new[]{ "small", "medium", "large", "x-large" })"
    SizeLabels="@(new Dictionary<string, string>
    {
        ["small"] = Localizer["small"],
        ["medium"] = Localizer["medium"],
        ["large"] = Localizer["large"],
        ["x-large"] = Localizer["xLarge"],
    })"
    @bind-Value="size" />
```

## Visible focus

The component does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring — on the
**button**, on the **`<ul>`** (which takes focus while open), and on the
active option. NHS-UK and Lily™ themes ship a high-contrast focus
outline that meets AAA.

A safe default:

```css
.text-size-select-button:focus-visible,
.text-size-select-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

/* The active option is not focused; give it its own visible cue. */
.text-size-select-option[data-active] {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: -2px;
}
```

Styling `[data-active]` is not optional polish. Focus sits on the
`<ul>`, so without a visual cue on the active option a sighted keyboard
user cannot see where the arrow keys have moved them.

## Reduced motion

The component performs no animation, including on open and close, and
it does not transition the type scale when the size changes. If you add
either in consumer CSS, gate it:

```css
@media (prefers-reduced-motion: reduce) {
    .text-size-select-list {
        transition: none;
    }
}
```

Animating `font-size` on a root-level change is a particularly bad idea
for motion-sensitive users — the whole page reflows. Prefer an instant
swap.

## Screen-reader behaviour matrix

Announcements for a custom listbox vary more than for a native
`<select>`; verify against your own targets rather than treating this
as a guarantee.

| Reader     | OS       | Browser   | Closed button                          | Open listbox                          |
| ---------- | -------- | --------- | -------------------------------------- | ------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Choose a text size, pop-up button".   | "Medium, selected, 2 of 4".           |
| NVDA       | Windows  | Firefox   | "Choose a text size button collapsed". | "list box, Medium 2 of 4 selected".   |
| Narrator   | Windows  | Edge      | "Choose a text size button collapsed". | "Medium selected, 2 of 4".            |
| JAWS       | Windows  | Chrome    | "Choose a text size button collapsed". | "list box, Medium, 2 of 4".           |
| TalkBack   | Android  | Chrome    | "Choose a text size, button".          | Varies; verify on your target device. |

## Common mistakes to avoid

- **Shipping without a meaningful `Label`.** The button is icon-only;
  `Label` is the entire accessible name. See tradeoff 1.
- **Mapping slugs to `px`.** That defeats SC 1.4.4 for every subtree
  below the declaration. See the 1.4.4 section.
- **Putting text in `ChildContent` and dropping `Label`.**
  `ChildContent` replaces the glyph, but the accessible name still comes
  from the button's `aria-label`. Set both.
- **Hiding the options with `display: none`.** That removes them from
  the accessibility tree. The component's own `hidden` on the `<ul>` is
  the correct mechanism; do not add a second one.
- **Styling `.text-size-select-list` without positioning it.** The
  package ships no CSS, so an open list participates in normal flow and
  shoves the page around. Give the root `position: relative` and the
  list `position: absolute`. See [styling.md](./styling.md).
- **Forgetting a visible cue for `[data-active]`.** See "Visible focus".
- **Letting the control shrink out of reach at the small slug.** Keep a
  minimum target size (SC 2.5.8) regardless of the active scale.

## Focus order under RTL

In RTL layout, focus moves visually right-to-left but logically in
source order — `Tab` still reaches the button in source order, and the
option order inside the listbox follows `Sizes`.

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
    var cut = RenderComponent<TextSizeSelect>(p => p
        .Add(x => x.Label, "Text size")
        .Add(x => x.Sizes, new[] { "small", "medium", "large" }));

    var button = cut.Find("button.text-size-select-button");
    Assert.Equal("Text size", button.GetAttribute("aria-label"));
    Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
    Assert.Equal("false", button.GetAttribute("aria-expanded"));

    var list = cut.Find("ul.text-size-select-list");
    Assert.Equal(button.GetAttribute("aria-controls"), list.GetAttribute("id"));
    Assert.Equal("Text size", list.GetAttribute("aria-label"));
    Assert.True(list.HasAttribute("hidden"));

    // The glyph must never become the accessible name.
    Assert.Equal("true", cut.Find(".text-size-select-icon").GetAttribute("aria-hidden"));
}
```

For broader a11y testing run axe-core in a real Blazor host. Automated
tools will confirm the ARIA wiring, but they cannot tell you whether a
real screen reader announces the listbox usefully — see tradeoff 2, and
test manually.

## Blazor-specific deviations

Two clauses of the canonical (Svelte) keyboard contract could not be
implemented identically in Blazor. Both are shared with `ThemeSelect`
and `LocaleSelect`, and both are behavioural refinements rather than
contract breaks:

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
- WCAG 1.4.4 Resize Text:
  <https://www.w3.org/WAI/WCAG22/Understanding/resize-text>
- WCAG 1.4.10 Reflow:
  <https://www.w3.org/WAI/WCAG22/Understanding/reflow>
- WCAG 2.4.7 Focus Visible:
  <https://www.w3.org/WAI/WCAG22/Understanding/focus-visible>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- Microsoft Learn — Accessibility in Blazor:
  <https://learn.microsoft.com/aspnet/core/blazor/accessibility>

---

Lily™ and Lily Design System™ are trademarks.
