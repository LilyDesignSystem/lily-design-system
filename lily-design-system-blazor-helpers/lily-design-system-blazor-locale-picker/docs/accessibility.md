# Accessibility

The picker targets **WCAG 2.2 AAA** and implements the WAI-ARIA APG
Radio Group pattern. This page lists what's built in and what
remains the consumer's responsibility.

## Built-in

| WCAG / APG item | How the picker satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each option carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<fieldset role="radiogroup" aria-label>` exposes the group; `<input type="radio">` exposes each option. |
| WCAG 2.1.1 Keyboard | Tab into the group; Arrow keys move selection; Space selects — all from native radio semantics. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the picker never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is announced via `aria-checked` and reflected in the `lang` attribute — not colour alone. |
| APG Radio Group pattern | Single-selection radio group with one `tabindex=0` representative and roving tabindex elsewhere — provided by the platform. |

## Per-option `lang` is important

The default rendering wraps each option in a `<label lang="…">`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the
`lang` attribute makes the reader switch to a French voice for the
duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you render a `<select>` via
`ChildContent`. Always carry the locale's BCP 47 tag onto each
`<option>`:

```razor
<select>
    @foreach (var l in ctx.Locales)
    {
        <option value="@l" lang="@ctx.TagFor(l)">@ctx.LabelFor(l)</option>
    }
</select>
```

## Keyboard contract

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab                    | Move focus into the radio group, landing on the checked option (or the first option if none is checked). |
| Tab again              | Move focus out of the group entirely; the group counts as one stop. |
| Arrow keys (`↑ ↓ ← →`) | Move selection between options inside the group. Selection follows focus by default in native radios. |
| Space                  | Select the focused option if it isn't already.                  |
| Home / End             | (Some browsers) Select first / last option.                     |

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`NavigationManager.NavigateTo` calls in `OnChange` that scroll the
page; if you must navigate, scroll-restore to the picker's position
so the user can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, group" → "English, selected, radio button, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language grouping" → "English radio button checked 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| Narrator   | Windows  | Edge      | "Language radio button group, English selected". |
| JAWS       | Windows  | Chrome    | "Language group, English radio button checked, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, radio button, 1 of 5, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs. Windows Narrator has built-in voices for most major
languages.

## When per-option `lang` does NOT help

If your `LocaleLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect (the visible text is English even though the
attribute says French). In that case, drop the `lang` attribute by
using a custom `ChildContent`:

```razor
<ChildContent Context="ctx">
    @foreach (var l in ctx.Locales)
    {
        <label class="locale-picker-option">
            <input type="radio"
                   name="@ctx.Name"
                   value="@l"
                   checked="@(ctx.Value == l)"
                   @onchange="@(async _ => await ctx.SetLocale(l))" />
            @ctx.LabelFor(l)
        </label>
    }
</ChildContent>
```

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, override the markup too.

## Native `<select>` accessibility

The `ChildContent` supports a `<select>` rendering (see
[examples/02_Select.razor](../examples/02_Select.razor)). Native
`<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the picker; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoff vs radios:

- Compact (one widget instead of N).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability).
- Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For 2–8 locales, prefer the radio default. For 9+, prefer
`<select>` or combobox.

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern.
The APG Combobox specification is intricate (focus-on-listbox vs
focus-on-input, auto-complete vs none, vertical vs grid). This
helper doesn't ship a combobox; use `ChildContent` to render an
established Blazor component (FluentUI Combobox, MudBlazor
MudAutocomplete) or roll your own.

See [examples/10_Combobox.razor](../examples/10_Combobox.razor)
for a minimal in-line combobox built on a `<datalist>` (≈ APG
Combobox with List Autocomplete and Manual Selection).

## Colour contrast

The picker ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility. A safe default
for the radio dot's checked state:

```css
.locale-picker-option:has(input:checked) {
    color: #003087; /* NHS blue — WCAG AAA-grade contrast against white */
    font-weight: 600;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused
element and the background.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves through the radios in the order they
appear in your `Locales` array, and Arrow Right (in RTL) moves to
the previous option, not the next. This is the browser's job, not
yours.

## High Contrast Mode

Raw `<input type="radio">` automatically respects Windows High
Contrast Mode and Forced Colors Mode — the OS provides the
selected / focused styling. Don't override
`forced-color-adjust` in consumer CSS unless you've measured the
trade-off.

## References

- WAI-ARIA APG — Radio Group:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
- WAI-ARIA APG — Combobox:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
- Microsoft Learn — Accessibility in ASP.NET Core Blazor:
  <https://learn.microsoft.com/aspnet/core/blazor/accessibility>
