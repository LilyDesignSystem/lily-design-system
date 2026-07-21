# Accessibility

The select targets **WCAG 2.2 AAA**. It is an **icon button that opens
a dropdown listbox**, built to the WAI-ARIA Authoring Practices listbox
pattern. It is not a native `<select>`, and that choice has real
accessibility consequences — they are stated plainly below rather than
buried. This page lists what's built in and what remains the consumer's
responsibility.

## Built-in

| WCAG / APG item | How the control satisfies it |
| --------------- | ---------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<li role="option">` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | The button exposes `aria-label` + `aria-haspopup="listbox"` + `aria-expanded`; the `<ul role="listbox">` exposes `aria-activedescendant`; exactly one `<li>` carries `aria-selected="true"`. **The name half rests entirely on `Label` — see tradeoff 1 below.** |
| WCAG 2.1.1 Keyboard | Full APG listbox keyboard contract, implemented by the component (see below). |
| WCAG 2.4.7 Focus Visible | The component never sets `outline: none`; the browser's default ring is preserved on the button and on the `<ul>`. |
| WCAG 1.4.1 Use of Color | Selection state is reflected in `aria-selected`, `data-active`, and the document root's `lang` / `dir` — not colour alone. |

## Roles and properties

| Element                      | Role / Property                                   | Source             |
| ---------------------------- | ------------------------------------------------- | ------------------ |
| `div.locale-chooser`          | none (plain container)                            | Component          |
| `input[type=hidden]`         | `name` — form participation only                  | Component          |
| `button.locale-chooser-button`| implicit `role="button"`                          | Browser            |
| `button.locale-chooser-button`| `aria-label="@Label"`                             | Consumer parameter |
| `button.locale-chooser-button`| `aria-haspopup="listbox"`                         | Component          |
| `button.locale-chooser-button`| `aria-expanded="true\|false"`                     | Component          |
| `button.locale-chooser-button`| `aria-controls="{list id}"`                       | Component          |
| `span.locale-chooser-icon`    | `aria-hidden="true"`                              | Component          |
| `ul.locale-chooser-list`      | `role="listbox"`, `tabindex="-1"`                 | Component          |
| `ul.locale-chooser-list`      | `aria-label="@Label"`                             | Consumer parameter |
| `ul.locale-chooser-list`      | `aria-activedescendant` (only while open)         | Component          |
| `ul.locale-chooser-list`      | `hidden` while closed                             | Component          |
| `li.locale-chooser-option`    | `role="option"`, `aria-selected="true\|false"`    | Component          |
| `li.locale-chooser-option`    | `lang` — BCP 47 hyphen form (WCAG 3.1.2)          | Component          |
| `li.locale-chooser-option`    | `data-active` on the active option (styling hook) | Component          |

Focus stays on the `<ul>` while the listbox is open; the active option
is conveyed by `aria-activedescendant`, never by moving DOM focus onto
an `<li>`. That is the APG listbox contract.

The button and the list carry **no** `lang` — only the options do. The
button shows a language-neutral glyph, so tagging it with any one
locale would be wrong.

## Per-option `lang` is important

Each `<li role="option">` carries `lang="…"`. This satisfies WCAG 3.1.2
(Language of Parts): when a screen reader encounters the option
"Français" inside an English page, the `lang` attribute makes the reader
switch to a French voice for the duration of that span.

Without the per-option `lang`, "Français" gets pronounced "Franc-ess"
in an English voice — comprehensible but ugly. With it, the reader says
"Fran-SAY".

This is one place where the custom listbox beats a native `<select>`:
several platform `<select>` implementations ignore per-option `lang`
entirely, because the OS draws the popup rather than the browser. Here
the options are real DOM nodes in the page, so the tag is honoured.

Note that `ChildContent` no longer renders options — it only replaces
the button's glyph — so this is now handled entirely by the component
and cannot be accidentally dropped by a consumer override.

## When per-option `lang` is NOT what you want

If your `LocaleLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), the per-option `lang` attribute is technically
incorrect: the visible text is English even though the attribute says
French.

The default labels show each locale **in its own language** (English /
Français / العربية), so the default is correct and helpful. If you
override `LocaleLabels` to be all in the viewer's language, you are
trading that correctness away; the component does not currently expose
a switch to suppress the per-option `lang`, so prefer endonyms in the
labels — they are also better for users who cannot read the surrounding
UI language.

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

## The tradeoffs of an icon button plus a custom listbox

Three costs come with this shape. None of them is a bug; all of them
are worth knowing before you ship.

### 1. The accessible name rests entirely on `aria-label`

The button renders one glyph, and that glyph is `aria-hidden="true"`.
There is no visible text, no `<label>`, and no fallback. If `Label` is
empty, missing, or untranslated, the control is **unnameable** — a
screen reader announces "button" and nothing more.

There is a second-order i18n trap here specific to a locale select: the
user most likely to need this control is the user who cannot read the
current UI language, and `Label` is rendered in that current language.
The glyph is the only language-neutral affordance, and it is hidden
from assistive technology by design. Consider pairing the control with a
visible endonym (see "the status region", below) so the affordance does
not depend on reading the page's language at all.

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
(The per-option `lang` support noted above cuts the other way; weigh
both.)

### 3. The glyph is a font-dependent character, not an asset

The default glyph is `🌐︎` (U+1F310 GLOBE WITH MERIDIANS followed by
U+FE0E VARIATION SELECTOR-15, which requests the monochrome text
presentation so the globe matches ThemeChooser's `◑`). This package
ships no fonts, no icons, and no images, so what the user sees is
whatever the platform's font stack resolves. Depending on OS, browser,
font settings, and the user's own stylesheet it may render as a colour
emoji or a monochrome outline, sit on a different baseline, get
substituted from a fallback font, or render as `□` if nothing in the
stack covers it. U+1F310 is in the emoji block, so cross-platform
variation is *more* likely here than for a plain geometric character —
and VS15 is a *request*, not a guarantee: platforms that ignore it will
still paint a colour globe.

Because the glyph is `aria-hidden`, a missing glyph is a *visual*
failure, not a naming failure — the control stays operable and named.
But it can leave a sighted user with an unlabelled blank button. If
that matters, supply your own `ChildContent` (an inline SVG is the
robust choice) and/or give `.locale-chooser-button` a visible
`min-width` / `min-height` so it stays a clear target either way.

## The status region is still the recommended pattern

The closed control shows only a glyph, so nothing on screen says which
locale is active. The recommended shape is the control **plus** a status
region echoing the active locale, and that is what the
[quick start](../index.md#quick-start) shows.

```razor
<LocaleChooser Label="Choose a locale" @bind-Value="locale" ... />

<p class="locale-chooser-status" aria-live="polite">
    @Localizer["currentLanguage"]
    <span lang="@Locales.Bcp47LocaleTag(locale)">@Locales.LocaleName(locale)</span>
</p>
```

Why this shape:

- **Visible, not `sr-only`, by default.** The closed control does not
  show the selection to *anyone*, so sighted users need the echo as
  much as screen-reader users do; visible text also helps cognitive
  accessibility, which AAA weighs heavily. If a design truly cannot
  spare the space, keep the element and apply a visually-hidden class —
  never `display: none` or `visibility: hidden`, which drop it from the
  accessibility tree and silence the live region.
- **`aria-live="polite"`, not `assertive`.** A locale change is not an
  interruption. `polite` also means the region announces only on
  *mutation*, so it stays quiet on first paint and speaks once per
  change. (`role="status"` implies `aria-live="polite"` and is an
  equivalent spelling — use one, not both.)
- **Scope `lang` to the locale name, not the whole sentence.** The
  surrounding copy is in the viewer's language; only the endonym
  ("Français", "العربية") needs the locale's own tag, for the same
  WCAG 3.1.2 reason the options carry one.
- **Show the human label, not the raw code.** `Locales.LocaleName(code)`
  gives the pretty name from the built-in table.

Unlike the old placeholder-pinned `<select>`, the selection *is* now
readable off the control itself: reopening the listbox announces the
active option as `aria-selected`. The status region is therefore no
longer compensating for missing semantics — it is compensating for the
closed button being a bare glyph, and (per tradeoff 1) giving the
control a language-independent anchor.

## Focus management on locale change

Selecting an option returns focus to the button — a deliberate,
predictable move within the same control, not a context change. This
keeps the WCAG 3.2.2 (On Input) contract: changing a setting must not
throw the user somewhere unexpected. `Escape` likewise returns focus to
the button without changing anything, and `Tab` leaves without pulling
focus back.

Avoid `NavigationManager.NavigateTo` calls in `OnChange` that scroll the
page; if you must navigate, scroll-restore to the control's position so
the user can keep choosing.

## Screen-reader behaviour matrix

Announcements for a custom listbox vary more than for a native
`<select>`; verify against your own targets rather than treating this
as a guarantee.

| Reader     | OS       | Browser   | Closed button                         | Open listbox                          |
| ---------- | -------- | --------- | ------------------------------------- | ------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Choose a locale, pop-up button".     | "English, selected, 1 of 5".          |
| NVDA       | Windows  | Firefox   | "Choose a locale button collapsed".   | "list box, English 1 of 5 selected". Pronounces "Français" in a French voice if one is installed. |
| Narrator   | Windows  | Edge      | "Choose a locale button collapsed".   | "English selected, 1 of 5".           |
| JAWS       | Windows  | Chrome    | "Choose a locale button collapsed".   | "list box, English, 1 of 5".          |
| TalkBack   | Android  | Chrome    | "Choose a locale, button".            | Varies; verify on your target device. |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs. Windows Narrator has built-in voices for most major languages.

## Very large locale lists

For 50+ locales, a listbox with typeahead is workable but a filtering
combobox is better. The APG Combobox specification is intricate
(focus-on-listbox vs focus-on-input, auto-complete vs none, vertical vs
grid). This helper doesn't ship a combobox; if you need one, render an
established Blazor component (FluentUI Combobox, MudBlazor
MudAutocomplete) and drive it from `Locales.*` plus `SetLocaleAsync` —
`ChildContent` can no longer be used for this, since it now only
replaces the button's glyph.

## Visible focus and colour contrast

The component ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility, on the button, the open
list, and the option states.

The consumer's CSS is responsible for the visible focus ring — on the
**button**, on the **`<ul>`** (which takes focus while open), and on the
active option:

```css
.locale-chooser-button:focus-visible,
.locale-chooser-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

/* The active option is not focused; give it its own visible cue. */
.locale-chooser-option[data-active] {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: -2px;
}
```

Styling `[data-active]` is not optional polish. Focus sits on the
`<ul>`, so without a visual cue on the active option a sighted keyboard
user cannot see where the arrow keys have moved them.

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused element
and the background.

## Reduced motion

The component performs no animation, including on open and close. If
you add a dropdown transition in consumer CSS, gate it:

```css
@media (prefers-reduced-motion: reduce) {
    .locale-chooser-list {
        transition: none;
    }
}
```

## Common mistakes to avoid

- **Shipping without a meaningful `Label`.** The button is icon-only;
  `Label` is the entire accessible name. See tradeoff 1.
- **Putting text in `ChildContent` and dropping `Label`.**
  `ChildContent` replaces the glyph, but the accessible name still comes
  from the button's `aria-label`. Set both.
- **Hiding the options with `display: none`.** That removes them from
  the accessibility tree. The component's own `hidden` on the `<ul>` is
  the correct mechanism; do not add a second one.
- **Styling `.locale-chooser-list` without positioning it.** The package
  ships no CSS, so an open list participates in normal flow and shoves
  the page around. Give the root `position: relative` and the list
  `position: absolute`.
- **Forgetting a visible cue for `[data-active]`.** See above.
- **Localising `LocaleLabels` into the viewer's language.** See "When
  per-option `lang` is NOT what you want".

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but **logically**
in source order — which is the same source order as LTR. The button is
a single tab stop; the option order inside the listbox follows your
`Locales` array. This is the browser's job, not yours.

Note that this control can change `dir` on the document root while it is
open. The listbox will re-mirror around the button; make sure your
positioning CSS uses logical properties (`inset-inline-start` rather
than `left`) so the open list does not jump off-screen mid-interaction.

## High Contrast Mode

`<button>` and `<ul>` do not get the automatic Forced Colors Mode
treatment a native `<select>` does, so this is now your responsibility:
test the control in Windows High Contrast / Forced Colors Mode and make
sure the button border, the open list's boundary, and the
`[data-active]` and `[aria-selected]` cues all survive. Prefer
`currentColor`, `ButtonText`, `Highlight` and `HighlightText` system
colours over fixed values, and do not override `forced-color-adjust`
unless you have measured the trade-off.

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
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
- Microsoft Learn — Accessibility in ASP.NET Core Blazor:
  <https://learn.microsoft.com/aspnet/core/blazor/accessibility>

---

Lily™ and Lily Design System™ are trademarks.
