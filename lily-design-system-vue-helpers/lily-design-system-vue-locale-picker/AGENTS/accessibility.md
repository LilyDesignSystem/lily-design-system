# Accessibility — LocaleChooser (Vue)

The chooser targets WCAG 2.2 AAA. It is an icon button that opens a
WAI-ARIA APG listbox, so — unlike the native `<select>` it replaced —
the roles, states, and keyboard contract are the component's own
responsibility. The canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                       | Role / Property                        | Source        |
| ----------------------------- | -------------------------------------- | ------------- |
| root `<div>`                  | none (grouping only)                   | —             |
| `<input type="hidden">`       | `name`                                 | Consumer prop |
| `<button>`                    | `aria-label={label}` (only name)       | Consumer prop |
| `<button>`                    | `aria-haspopup="listbox"`              | Select        |
| `<button>`                    | `aria-expanded="true\|false"`          | Select        |
| `<button>`                    | `aria-controls={listId}`               | Select        |
| `<span class="…-icon">`       | `aria-hidden="true"`                   | Select        |
| `<ul>`                        | `role="listbox"`, `aria-label={label}` | Select        |
| `<ul>`                        | `aria-activedescendant` (while open)   | Select        |
| `<li>`                        | `role="option"`, `aria-selected`       | Select        |
| `<li>`                        | `data-active` (keyboard-active option) | Select        |
| `<li>`                        | `lang={bcp47}`                         | Select        |

Focus stays on the `<ul>` while the listbox is open; the active
option is conveyed with `aria-activedescendant`, never by moving DOM
focus onto an `<li>`.

The `lang` attribute on each `<li role="option">` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option. The button and the listbox carry no `lang` of their own.

## Keyboard contract

Implemented by the component. Focus moves to the `<ul>` on open and
returns to the button on commit or cancel.

On the **button**:

| Key                    | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| ArrowDown              | Open; active option = the selected one (or index 0).                  |
| Enter / Space          | Open; active option = the selected one (or index 0).                  |
| ArrowUp                | Open; active option = the **last** option.                            |
| Tab / Shift+Tab        | Move focus away (native).                                             |

On the **listbox**:

| Key                    | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| ArrowDown              | Move the active option down one. Clamps — no wrapping.                |
| ArrowUp                | Move the active option up one. Clamps — no wrapping.                  |
| Home / End             | Jump to the first / last option.                                      |
| Enter / Space          | Select the active option, apply it, close, refocus the button.        |
| Escape                 | Close and refocus the button **without** changing the value.          |
| Tab                    | Close without stealing focus back.                                    |
| Printable characters   | Typeahead over the option labels, 500 ms buffer reset.                |

Pointer and focus behaviour: clicking an option selects it; clicking
outside the root closes the listbox; focus leaving the root closes it.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on exactly one `<li role="option">`, plus
   the hidden input's `value`.
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `v-model:value` binding in user code.

Note what is *not* in that list: the closed control itself. It shows
only a glyph, so consumers should surface the active locale in a
`.locale-chooser-status` live region — see
[`../docs/accessibility.md`](../docs/accessibility.md).

## Per-option `lang` is important

Every `<li role="option">` carries a `lang="…"` attribute. This
satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for the duration
of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

This survived the move away from the native `<select>` intact, and it
is the one place where the custom listbox is *more* dependable than
the platform control: some OS-native select popups ignore per-option
`lang` entirely, whereas `<li lang="fr">` is plain DOM the reader
handles the same way it handles any other inline language change.

Consumers do not need to do anything to get it — the component sets
it from `tagFor(locale)`. The default slot cannot affect it, since
the slot only replaces the button glyph.

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Committing an
option returns focus to the button it came from — deliberately, so
the user's place is preserved. Avoid `router.push` calls in `@change`
that scroll the page; if you must navigate, scroll-restore to the
button's position so the user can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the button |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed" → on open, "Language, list box, English, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language button collapsed" → on open, "Language list, English, 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language button" → on open, "Language list box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate". No OS picker — the in-page listbox opens. |

Two caveats, both consequences of the icon-button rewrite:

- The announced button name is `label` and nothing else. It never
  includes the active locale, because the closed control has no value
  to announce.
- Coverage of `role="listbox"` + `aria-activedescendant` is less
  uniform across AT than the native `<select>` was, and browse-mode /
  forms-mode behaviour varies by reader. Verify against your own
  support matrix rather than trusting the table above.

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect: the visible text is English even though the
attribute claims French.

The component always writes the per-option `lang`, and the default
slot cannot change that (it replaces the button glyph only). If this
matters for your label set, either keep endonyms as the labels — which
is what the `lang` attribute is there to support — or file it as a
known, minor deviation. In practice screen readers cope: an English
word read by a French voice is odd but comprehensible, and the
mismatch only arises when a consumer deliberately overrides endonyms.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still reaches the button in source order, and the
listbox mirrors visually. This is the browser's job, not yours.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the button + listbox shape):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
