# Accessibility — LocalePicker (Nunjucks)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. The canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Macro         |
| `<fieldset>`                  | `aria-label="{label}"`     | `opts.label`  |
| `<label>`                     | `lang="{tagFor(locale)}"`  | Macro         |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Macro         |

The `lang` attribute on each `<label>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                    | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `Tab`                  | Move focus into the radio group, landing on the checked option (or the first option if none is checked). |
| `Tab` again            | Move focus out of the group entirely; the group counts as one stop.    |
| `Arrow Up/Down/Left/Right` | Move selection between options inside the group. Selection follows focus by default in native radios. |
| `Space`                | Select the focused option if it isn't already.                         |
| `Home` / `End`         | (Some browsers) Select first / last option.                            |

The client.js does not add JS keyboard handlers — the native
radios are the correct mechanism.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `onChange` callback payload.

## Per-option `lang` is important

The default rendering wraps each option in a
`<label lang="…">`. This satisfies WCAG 3.1.2 (Language of
Parts): when a screen reader encounters the option "Français"
inside an English page, the `lang` attribute makes the reader
switch to a French voice for the duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid hard
navigations in `onChange` that scroll the page; if you must
navigate, scroll-restore to the picker's position.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, group" → "English, selected, radio button, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language grouping" → "English radio button checked 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language group, English radio button checked, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, radio button, 1 of 5, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language
(e.g. you show "English", "French", "Arabic" — all in English so
the user recognises them), the per-option `lang` attribute is
technically incorrect (the visible text is English even though
the attribute says French). In that case, drop the `lang`
attribute using the caller-block pattern (see
[`../docs/concepts.md`](../docs/concepts.md)).

## Native `<select>` accessibility

The default rendering can be replaced with a `<select>` via the
caller block (see [examples/02-select.njk](../examples/02-select.njk)).
Native `<select>` is fully accessible:

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
- Can't show option text in mixed scripts as easily.

For 2–8 locales, prefer the radio default. For 9+, prefer
`<select>` or combobox.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order
as LTR. So `Tab` still moves through the radios in the order
they appear in `opts.locales`, and `Arrow Right` (in RTL) moves
to the previous option, not the next. This is the browser's
job, not yours.

## Nunjucks-specific notes

### Autoescape

`nunjucks.configure({ autoescape: true })` is mandatory. The
macro emits `opts.label` and locale codes inside HTML attributes;
without autoescape, a label like `Hello "
onclick="alert(1)` would inject script.

### Caller block and ARIA

When a consumer wraps the macro with `{% call %}`, the outer
`<fieldset role="radiogroup">` is preserved. The caller's markup
goes inside the fieldset; it must not introduce a competing
`role="group"` or `role="listbox"`.

## References

- WAI-ARIA APG — Radio Group pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
