# Accessibility — LocaleChooser (Blazor)

The select targets WCAG 2.2 AAA. It is an icon button that opens a
dropdown listbox following the WAI-ARIA APG listbox pattern — not a
native `<select>`. The canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                    | Role / Property                          | Source             |
| -------------------------- | ---------------------------------------- | ------------------ |
| `<button>`                 | `aria-haspopup="listbox"`                | Component          |
| `<button>`                 | `aria-expanded="true\|false"`            | Component          |
| `<button>`                 | `aria-controls="{listId}"`               | Component          |
| `<button>`                 | `aria-label="@Label"`                    | Consumer parameter |
| `<span class="locale-chooser-icon">` | `aria-hidden="true"`            | Component          |
| `<ul>`                     | `role="listbox"`                         | Component          |
| `<ul>`                     | `tabindex="-1"`                          | Component          |
| `<ul>`                     | `aria-label="@Label"`                    | Consumer parameter |
| `<ul>`                     | `aria-activedescendant` (open only)      | Component          |
| `<li>`                     | `role="option"`                          | Component          |
| `<li>`                     | `aria-selected="true\|false"`            | Component          |
| `<li>`                     | `data-active` (styling hook)             | Component          |
| `<li>`                     | `lang` (per-option, WCAG 3.1.2)          | Component          |

The button is icon-only, so `Label` is its **entire** accessible name:
the glyph is `aria-hidden="true"` and contributes nothing. The same
`Label` names the listbox.

Focus stays on the `<ul>` while the list is open; the active option is
conveyed by `aria-activedescendant`, per the APG listbox pattern. The
`lang` attribute on each `<li>` satisfies WCAG 3.1.2 (Language of
Parts) — screen readers switch pronunciation per option. The button
and the list carry **no** `lang`.

## Keyboard contract

Implemented by the component. On the **button**:

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

Pointer and focus: clicking an option selects, applies, and closes;
focus leaving the root closes the listbox without changing the value.

## Blazor deviations

Two APG refinements cannot be met faithfully with Blazor's declarative
event bindings. Neither is a contract break.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to the arrow keys while sparing `Tab`. Arrow keys
  and `Space` therefore keep their default scrolling behaviour.
  Because a `<button>` synthesises a click for both `Enter` and
  `Space`, the component sets a suppress-next-click flag on keydown so
  the listbox is not toggled twice.
- **No document-level click listener.** The canonical Svelte
  implementation closes on any outside click; this package ships no
  JavaScript, so closing is driven by the root's `focusout` instead.
  Blazor's `FocusEventArgs` has no `relatedTarget`, so the component
  flags the focus moves it makes itself and ignores the matching
  `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`: that one is
unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

## State signals

The active state is exposed in independent channels — no
colour-only meaning is required:

1. `lang="<tag>"` on the document root.
2. `dir="rtl|ltr"` on the root (skipped if `ApplyDir=false`).
3. `aria-selected="true"` on exactly one `<li>`.
4. The `@bind-Value` binding in user code.

The tradeoffs this shape carries — the icon-only button's name
depending wholly on `aria-label`, a custom listbox having weaker
assistive-technology support than a native `<select>`, and the glyph
rendering differently or not at all in some platform fonts — are
discussed in [`../docs/accessibility.md`](../docs/accessibility.md).

## Per-option `lang` is important

Each `<li class="locale-chooser-option">` carries `lang="…"`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the
`lang` attribute makes the reader switch to a French voice for the
duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The attribute is emitted unconditionally by the component, in BCP 47
hyphen form via `TagFor`:

```html
<li class="locale-chooser-option" role="option"
    aria-selected="false" lang="fr-CA">Français (Canada)</li>
```

`ChildContent` cannot change this: it replaces the glyph inside the
button and never renders options.

## Focus management on locale change

Selecting an option closes the listbox and returns focus to the
button — a return to the control the user activated, not a context
change, so WCAG 3.2.2 (On Input) is satisfied. Avoid
`NavigationManager.NavigateTo` calls in `OnChange` that scroll the
page; if you must navigate, scroll-restore to the select's position
so the user can keep choosing.

Both focus moves are deferred to `OnAfterRenderAsync`, because the
`<ul>` cannot take focus while it still carries `hidden`. See
[`./lifecycle.md`](./lifecycle.md).

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when the user lands on the button |
| ---------- | -------- | --------- | -------------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed". |
| NVDA       | Windows  | Firefox   | "Language button, collapsed". |
| Narrator   | Windows  | Edge      | "Language button, collapsed". |
| JAWS       | Windows  | Chrome    | "Language button, collapsed". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate". |

Once opened, the reader announces the listbox by its `aria-label`
and then the active option — "English, 1 of 5" — as
`aria-activedescendant` moves. The "lang-correct pronunciation"
depends on the reader having a matching voice package installed.

## When per-option `lang` does NOT help

If your `LocaleLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect: the text really is English, not French.

There is no parameter that suppresses it. Weigh this when choosing
label style: endonyms ("Français", "العربية") are both the friendlier
choice for a locale picker and the one the markup is correct for.

## RTL focus order

In RTL layout, focus moves visually right-to-left but logically in
source order — which is the same source order as LTR. The button
is a single tab stop and the open listbox is a second one; the
options follow the order they appear in your `Locales` array.

## References

- WAI-ARIA Authoring Practices — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA Authoring Practices — Select-Only Combobox:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
