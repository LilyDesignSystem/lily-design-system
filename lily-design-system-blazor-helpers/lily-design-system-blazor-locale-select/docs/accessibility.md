# Accessibility

The select targets **WCAG 2.2 AAA** and uses the native
`<select>` form control. This page lists what's built in and what
remains the consumer's responsibility.

## Built-in

| WCAG / APG item | How the select satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<option>` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<select aria-label>` exposes the control (implicit `combobox` role); each `<option>` exposes its value and selected state. |
| WCAG 2.1.1 Keyboard | Tab to the select; Arrow / Home / End move selection; typeahead jumps — all native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the select never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is the `<select>`'s implicit selected-option state and is reflected in the `lang` attribute — not colour alone. |
| Native `<select>` | Single-selection control with browser-provided keyboard, focus, and screen-reader semantics. |

## Per-option `lang` is important

The default rendering carries `lang="…"` on each `<option>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the
`lang` attribute makes the reader switch to a French voice for the
duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you supply custom `<option>` markup via
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

| Key               | Action                                          |
| ----------------- | ----------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).            |
| `Shift+Tab`       | Move focus away from the select.                |
| `Arrow Down`      | Select the next option.                         |
| `Arrow Up`        | Select the previous option.                     |
| `Home` / `End`    | Select the first / last option.                 |
| Typeahead         | Type characters to jump to a matching option.   |
| `Enter` / `Space` | Open the option list (platform-dependent).      |
| `Escape`          | Close the option list.                          |

This is all native behaviour. The select does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`NavigationManager.NavigateTo` calls in `OnChange` that scroll the
page; if you must navigate, scroll-restore to the select's position
so the user can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| Narrator   | Windows  | Edge      | "Language combo box, English selected". |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

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
        <option class="locale-select-option" value="@l">
            @ctx.LabelFor(l)
        </option>
    }
</ChildContent>
```

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, override the markup too.

## Native `<select>` accessibility

The default rendering is a native `<select>` (see
[examples/02_Select.razor](../examples/02_Select.razor) for a
customised variant). Native `<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the list; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoffs:

- Compact (one widget regardless of N).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability).
- Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For a handful of locales, a custom button group via `ChildContent`
can improve discoverability; for 9+, the native `<select>` is
ideal.

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

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility. A safe default
for the select control:

```css
.locale-select {
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
LTR. The `<select>` is a single tab stop; its option list follows
the order they appear in your `Locales` array. This is the
browser's job, not yours.

## High Contrast Mode

A native `<select>` automatically respects Windows High Contrast
Mode and Forced Colors Mode — the OS provides the selected /
focused styling. Don't override `forced-color-adjust` in consumer
CSS unless you've measured the trade-off.

## References

- HTML Living Standard — `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
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
