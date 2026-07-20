# Accessibility — `<locale-select>` (HTML helper)

The select targets WCAG 2.2 AAA and implements the **WAI-ARIA APG
listbox pattern** in JavaScript: an icon button that opens a
`role="listbox"` dropdown. It is not a native `<select>` and gets
nothing from the platform. The canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                       | Role / Property                                  | Source        |
| ----------------------------- | ------------------------------------------------ | ------------- |
| `<locale-select>` (host)      | none (transparent)                               | —             |
| Rendered `<div>` root         | none (styling container)                         | —             |
| `<input type="hidden">`       | `name` + current value (form participation)      | Select        |
| `<button>`                    | `aria-label={label}`                             | Consumer attr |
| `<button>`                    | `aria-haspopup="listbox"`                        | Select        |
| `<button>`                    | `aria-expanded` (kept in sync)                   | Select        |
| `<button>`                    | `aria-controls={listId}`                         | Select        |
| `<span class="…-icon">`       | `aria-hidden="true"`                             | Select        |
| `<ul>`                        | `role="listbox"`, `aria-label={label}`, `tabindex="-1"` | Select |
| `<ul>` (open only)            | `aria-activedescendant={optionId(active)}`       | Select        |
| `<li>`                        | `role="option"`, unique `id`, `aria-selected`    | Select        |
| `<li>`                        | `lang={tagFor(locale)}`                          | Select        |
| `<li>` (active only)          | `data-active`                                    | Select        |

The `lang` attribute on each `<li>` satisfies WCAG 3.1.2 (Language of
Parts) — screen readers switch pronunciation per option. **The button
and the `<ul>` carry no `lang`**: they are chrome, not
locale-specific content.

`aria-selected` (the applied locale) and `data-active` (the
keyboard-highlighted option) are different things. Arrowing moves
only `data-active` and `aria-activedescendant`; `Enter` / `Space` /
click move `aria-selected`.

## Focus model

Focus sits on the `<ul>` while the list is open — never on an
individual `<li>`. Options are not focusable and carry no `tabindex`.
"Which option is current" is communicated purely by
`aria-activedescendant`, which is present only while open and removed
on close.

The button is the control's only tab stop.

## Keyboard contract

Implemented in JS. Nothing is inherited from the platform.

On the **button**:

| Key                             | Action                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Tab / Shift+Tab                 | Move focus into / out of the control; it is one tab stop.     |
| ArrowDown / Enter / Space       | Open with the selected option active (or index 0 when none).  |
| ArrowUp                         | Open with the **last** option active.                         |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key                   | Action                                                                  |
| --------------------- | ----------------------------------------------------------------------- |
| ArrowDown / ArrowUp   | Move the active option; **clamps** at both ends, no wrapping.            |
| Home / End            | Jump to the first / last option.                                         |
| Enter / Space         | Select the active option, apply, close, return focus to the button.      |
| Escape                | Close and refocus the button **without** changing the value.             |
| Tab                   | Close without stealing focus back.                                       |
| printable character   | Typeahead over the option labels; 500 ms buffer reset; wraps once.       |

Pointer: clicking an option selects it; clicking the button toggles;
clicking outside the root closes; focus leaving the root closes.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the chosen `<li>`.
2. The hidden `<input>`'s value.
3. `lang="<tag>"` on the target element (default `<html>`).
4. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).

Consumer CSS must give `[aria-selected="true"]` and `[data-active]`
distinct, non-colour-only signals.

## Per-option `lang` is important

When a screen reader encounters the option "Français" inside an
English page, the `lang` attribute makes the reader switch to a
French voice for the duration of that item. Without it, "Français"
gets pronounced "Franc-ess" in an English voice.

```html
<ul role="listbox" aria-label="Language" tabindex="-1">
    <li role="option" aria-selected="true"  lang="en">English</li>
    <li role="option" aria-selected="false" lang="fr">Français</li>
    <li role="option" aria-selected="false" lang="ar">العربية</li>
</ul>
```

## Focus management on locale change

Changing the locale never moves focus elsewhere on the page (WCAG
3.2.2, On Input). The element does move focus *within* the control,
as the APG listbox pattern requires: opening moves focus to the
`<ul>`; selecting or cancelling returns it to the button; `Tab`
closes without pulling focus back. Avoid navigation calls
(`window.location = …`) in `localechange` handlers that scroll the
page; if you must navigate, preserve scroll position and focus.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced on the closed button |
| ---------- | -------- | --------- | -------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed". Opening announces the listbox; arrowing announces each option with `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language button collapsed", then "Language list box" on open. |
| JAWS       | Windows  | Chrome    | "Language button collapsed"; arrow keys announce each option and its selected state. |
| VoiceOver  | iOS      | Safari    | "Language, button". Touch swipe navigation reaches options individually; `aria-activedescendant` is not used by touch navigation, so the highlighted option and the swiped-to element can diverge. |
| TalkBack   | Android  | Chrome    | "Language, button, collapsed". Same divergence caveat. |

"lang-correct pronunciation" depends on the reader having a matching
voice package installed. NVDA's default ships with English only;
users add other voices through eSpeak NG or commercial voice packs.

## Tradeoffs

Stated in full in [`../docs/accessibility.md`](../docs/accessibility.md):

1. **Icon-only control.** The accessible name depends entirely on
   `aria-label`; a vague `label` leaves the control unusable. It also
   fails WCAG 2.5.3 Label in Name unless the consumer adds a visible
   label of their own.
2. **Custom listbox < native `<select>`.** The previous native
   `<select>` got combobox semantics, platform keyboard behaviour,
   the mobile OS picker, and typeahead free and battle-tested. A
   hand-rolled listbox is well-specified by the APG but has weaker,
   more variable support across screen readers and mobile browsers,
   and no native mobile picker.
3. **Glyph rendering is platform-dependent.** A bare Unicode
   codepoint with no bundled font may render as colour emoji, a
   monochrome glyph, or tofu. Override `renderButtonContent()` with
   an SVG for a guaranteed appearance.

Because the closed button shows only a glyph, the active locale is
not visible or announced anywhere in the control. The compensating
status region (visible text or a polite live region fed from
`localechange`) is the documented default pattern, not an optional
extra.

## When per-option `lang` does NOT help

If `localeLabels` are all in the **viewer's** language ("English",
"French", "Arabic" — all in English), the per-option `lang` is
technically incorrect: the visible text is English even though the
attribute says French. Drop it by subclassing:

```ts
class ViewerLanguageLocaleSelect extends LocaleSelect {
    connectedCallback() {
        super.connectedCallback();
        for (const option of this.querySelectorAll(".locale-select-option")) {
            option.removeAttribute("lang");
        }
    }
}
```

The default rendering assumes labels show **in their own language**
(English / Français / العربية), which makes per-option `lang` correct
and helpful. If you override the labels to be all in the viewer's
language, override the markup too.

## Subclassing and the accessibility contract

Two tiers, with very different risk — see
[`../docs/custom-rendering.md`](../docs/custom-rendering.md):

- **Tier 1**, overriding `renderButtonContent()`, cannot break
  accessibility: the base class still builds the button and the
  listbox. Keep the returned node `aria-hidden="true"` if it is
  decorative.
- **Tier 2**, replacing the rendering, takes over the entire
  accessibility contract *and* the keyboard contract — the base
  class's handlers are bound to the DOM it built.

## Consumer CSS responsibilities

The package ships no CSS, so these are the consumer's:

- **Positioning.** The `<ul>` renders in normal flow until the root
  gets `position: relative` and the list `position: absolute`.
  Without it the list shoves page content around when it opens.
- **Respect `hidden`.** Guard any `display` rule with
  `.locale-select-list[hidden] { display: none; }`.
- **Visible focus** on both the button and the `<ul>`; never
  `outline: none`.
- **Non-colour-only** distinction between `[data-active]` and
  `[aria-selected="true"]`.

## RTL focus order

The button is a single tab stop, so Tab order is unaffected by
direction. Inside the open list, ArrowDown / ArrowUp always move
through the options in source order — the same order as the `locales`
array. Position the dropdown with logical properties
(`inset-inline-start`) so it flips with the document direction.

## CustomEvent vs ARIA live region

`localechange` is a change notification for consumer code, not for
assistive technology. Selection changes are announced through
`aria-selected` while the list is open; the closed button announces
only its label and state. If you want the change announced, add a
separate `role="status"` or `aria-live` element and write into it
from your `localechange` listener.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 2.5.3 Label in Name:
  <https://www.w3.org/WAI/WCAG22/Understanding/label-in-name>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
