# Accessibility — LocaleSelect (Nunjucks)

The select targets WCAG 2.2 AAA and uses a native `<select>`, whose
keyboard and role semantics the browser provides. The canonical
contract is in [`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<select>`                    | implicit `role="combobox"` | Browser       |
| `<select>`                    | `aria-label="{label}"`     | `opts.label`  |
| `<select>`                    | `name`                     | Macro         |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | `lang="{tagFor(locale)}"`  | Macro         |

The `lang` attribute on each `<option>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                    | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus to / from the select.                                      |
| Arrow Down / Arrow Up  | Select the next / previous option.                                    |
| Home / End             | Select the first / last option.                                       |
| Typeahead              | Type characters to jump to a matching option.                         |
| Enter / Space          | Open the option list (platform-dependent).                            |
| Escape                 | Close the option list.                                                |

This is all native behaviour. The client.js does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `lang="<tag>"` on the target element (default `<html>`).
2. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
3. The `onChange` callback payload.

The `<select>`'s own selected `<option>` is deliberately **not** a
channel: the placeholder is always the selected option and
`select.value` is snapped back to `""` after every apply. A
screen-reader user therefore cannot learn the active locale from the
control. The compensating `.locale-select-status` region
(`aria-live="polite"`, fed from `onChange`) is part of the default
pattern and ships in the examples — see
[`../docs/accessibility.md`](../docs/accessibility.md).

## Per-option `lang` is important

The default rendering carries a `lang="…"` attribute on each
`<option>`. This satisfies WCAG 3.1.2 (Language of
Parts): when a screen reader encounters the option "Français"
inside an English page, the `lang` attribute makes the reader
switch to a French voice for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid hard
navigations in `onChange` that scroll the page; if you must
navigate, scroll-restore to the select's position.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English" → on open, "English, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

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

The select renders a native `<select>` by default (see
[examples/02-select.njk](../examples/02-select.njk)).
Native `<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the select; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoff:

- Compact (one widget).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability than an
  always-visible list).
- Can't show option text in mixed scripts as easily (some OS
  selects don't honour per-option `lang`).

For an always-visible list of 2–8 locales, render buttons via the
caller block. For 9+, the native `<select>` default or a combobox is
the better fit.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order
as LTR. So `Tab` still moves to and from the `<select>` in source
order, and the option list mirrors visually. This is the browser's
job, not yours.

## Nunjucks-specific notes

### Autoescape

`nunjucks.configure({ autoescape: true })` is mandatory. The
macro emits `opts.label` and locale codes inside HTML attributes;
without autoescape, a label like `Hello "
onclick="alert(1)` would inject script.

### Caller block and ARIA

When a consumer forks the macro to take over rendering with a
`{% call %}` block, they own the markup inside the root. If they
render an always-visible list of buttons, give it a wrapping
`role="group"` with an `aria-label`; if they render `<option>`
markup, keep it inside the `<select>` so the implicit `combobox`
semantics stay intact. Do not introduce a competing `role`.

## References

- HTML Living Standard — the `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
