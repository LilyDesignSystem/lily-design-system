# Accessibility — LocaleChooser (Nunjucks)

The select targets WCAG 2.2 AAA. It is an icon button that opens a
listbox, following the WAI-ARIA APG listbox pattern; the roles,
states, and the whole keyboard contract are supplied by the macro and
`locale-chooser.client.js` rather than by the platform. The canonical
contract is in [`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                       | Role / Property                        | Source        |
| ----------------------------- | -------------------------------------- | ------------- |
| root `<div>`                  | none (plain container)                 | Macro         |
| `<button>`                    | implicit `role="button"`, `type="button"` | Macro      |
| `<button>`                    | `aria-label="{label}"`                 | `opts.label`  |
| `<button>`                    | `aria-haspopup="listbox"`              | Macro         |
| `<button>`                    | `aria-expanded="true|false"`            | Macro + client |
| `<button>`                    | `aria-controls="{id}-list"`            | Macro         |
| `<span class="locale-chooser-icon">` | `aria-hidden="true"`             | Macro         |
| `<ul>`                        | `role="listbox"`, `tabindex="-1"`      | Macro         |
| `<ul>`                        | `aria-label="{label}"`                 | `opts.label`  |
| `<ul>`                        | `aria-activedescendant="{option id}"`  | Client (open only) |
| `<li>`                        | `role="option"`, `aria-selected`       | Macro + client |
| `<li>`                        | `lang="{tagFor(locale)}"`              | Macro         |

The button is icon-only, so `aria-label` is its **only** accessible
name — the glyph is `aria-hidden` and contributes nothing. Never ship
a label-less instance.

The `lang` attribute on each `<li role="option">` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option. The button and the `<ul>` carry no `lang`: they are chrome,
not content.

## Keyboard contract

Implemented in `locale-chooser.client.js`. None of it exists before
that module runs.

| Key                       | Focus       | Action                                                          |
| ------------------------- | ----------- | --------------------------------------------------------------- |
| Tab / Shift+Tab           | Button      | Move focus to / from the control.                               |
| Enter / Space / ArrowDown | Button      | Open, with the selected option active (or the first).           |
| ArrowUp                   | Button      | Open, with the **last** option active.                          |
| ArrowDown / ArrowUp       | Listbox     | Move the active option; clamps at the ends, does not wrap.      |
| Home / End                | Listbox     | Jump to the first / last option.                                |
| Enter / Space             | Listbox     | Select the active option, apply it, close, refocus the button.  |
| Escape                    | Listbox     | Close and refocus the button; the locale is unchanged.          |
| Tab                       | Listbox     | Close without stealing focus back.                              |
| Printable characters      | Listbox     | Typeahead over the option labels; buffer resets after 500 ms.   |

Opening moves focus onto the `<ul>` and the active option travels via
`aria-activedescendant`, so the DOM focus ring stays on one element
throughout. Modifier chords (Ctrl / Meta / Alt + key) are excluded
from typeahead so browser and OS shortcuts still work.

Pointer equivalents: clicking the button toggles the listbox,
clicking an option selects it, and clicking outside the root — or
moving focus out of it — closes without applying.

## State signals

The active state is exposed in five independent channels — no
colour-only meaning is required:

1. `lang="<tag>"` on the target element (default `<html>`).
2. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
3. `aria-selected="true"` on exactly one `<li role="option">`.
4. The hidden input's `value` (which a `<form>` submit carries).
5. The `onChange` callback payload.

The **closed** control is deliberately not a channel: it shows a
globe glyph, never the active locale name, so the control's width
does not depend on the length of your locale labels. A screen-reader
user hears the button's label but not the active locale until the
listbox is opened. The compensating `.locale-chooser-status` region
(`aria-live="polite"`, fed from `onChange`) is part of the default
pattern and ships in the examples — see
[`../docs/accessibility.md`](../docs/accessibility.md).

## Per-option `lang` is important

The default rendering carries a `lang="…"` attribute on each
`<li role="option">`. This satisfies WCAG 3.1.2 (Language of
Parts): when a screen reader encounters the option "Français"
inside an English page, the `lang` attribute makes the reader
switch to a French voice for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

## Focus management on locale change

Committing an option closes the listbox and returns focus to the
trigger button — focus never lands on a removed or hidden element,
and it never escapes the control. Escape does the same without
applying. Tab and outside-clicks close with `refocus` off, so focus
goes where the user sent it.

This keeps the WCAG 3.2.2 (On Input) contract: changing a setting
must not cause an unexpected context change. Avoid hard navigations
in `onChange` that scroll the page; if you must navigate,
scroll-restore to the control's position.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced on the button, then on open |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed" → on open, "Language, list box, English, selected, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language button, collapsed" → on open, "Language list, English, 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language button, collapsed" → on open, "Language list box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate" → on open, the option list. |

Announcements vary by reader version; the load-bearing facts are that
`aria-label` names the button, `aria-expanded` conveys the state, and
`aria-activedescendant` moves the reader's cursor while the listbox
is open. The "lang-correct pronunciation" depends on the reader
having a matching voice package installed.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language
(e.g. you show "English", "French", "Arabic" — all in English so
the user recognises them), the per-option `lang` attribute is
technically incorrect (the visible text is English even though
the attribute says French). The macro always emits it, and the
`{% call %}` block only replaces the button glyph, so it cannot be
switched off from the macro. If the mismatch matters for your
audience, hand-write conforming markup without the `lang`
attributes (see [`../docs/concepts.md`](../docs/concepts.md)).

## Progressive enhancement: the honest position

The macro's output is **not** an operable control on its own. The
button opens nothing until `locale-chooser.client.js` runs, because
open / close, focus movement, the keyboard contract, and typeahead
all live in that module. This is a real accessibility and resilience
regression against the earlier native `<select>`, which the browser
operated with zero script.

What survives without JS:

- The hidden input is pre-filled server-side with the resolved
  locale, so a form submitted with no JS still carries a locale.
- The listbox markup is present and semantically correct, but
  `hidden`, so assistive technology does not expose stale options.

What does not:

- Every interaction. There is no `<noscript>` fallback in the macro.

If script-off operation is a requirement, render a plain `<form>` of
links or submit buttons alongside this control and hide it once the
module has initialised.

## Sizing tradeoff

The icon-only button keeps the control the same width whatever the
locale labels say, and the listbox scales to 100+ options with
typeahead. The costs are that the closed control shows no active
value, and that the choices are hidden until opened. For an
always-visible list of 2–8 locales, a plain set of links or submit
buttons is a better — and progressively-enhanced — fit than this
helper.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order
as LTR. So `Tab` still moves to and from the button in source
order, and the listbox mirrors visually. Arrow-key movement inside
the listbox is along the block axis (down = next), which is
direction-independent. This is the browser's job, plus your CSS
using logical properties.

## Nunjucks-specific notes

### Autoescape

`nunjucks.configure({ autoescape: true })` is mandatory. The
macro emits `opts.label` and locale codes inside HTML attributes;
without autoescape, a label like `Hello "
onclick="alert(1)` would inject script.

### Caller block and ARIA

A `{% call %}` block replaces the glyph **inside the button** and
nothing else — the options still come from `opts.locales`. Keep the
replacement `aria-hidden="true"` and non-focusable
(`focusable="false"` on inline SVG): the button's accessible name is
its `aria-label`, and visible glyph text would compete with it. Do
not put interactive elements inside the button.

## References

- WAI-ARIA Authoring Practices — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA Authoring Practices — Collapsible dropdown listbox
  example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
