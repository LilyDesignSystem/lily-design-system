# Accessibility

The control targets **WCAG 2.2 AAA** using an icon `<button>` that
opens a `<ul role="listbox">`, following the WAI-ARIA Authoring
Practices listbox pattern. This page lists what's built in, what
remains the consumer's responsibility, and — plainly — what the move
away from a native `<select>` cost.

## Built-in

| WCAG item | How the control satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | The client.js writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | The macro emits `lang="{tag}"` on each `<li role="option">`. The button and the `<ul>` carry none — they are chrome, not content. |
| WCAG 1.4.10 Reflow (RTL bidi) | The client.js writes `dir="rtl"` for RTL locales. |
| WCAG 4.1.2 Name, Role, Value | `aria-label` names the button and the listbox; `aria-haspopup` / `aria-expanded` / `aria-controls` expose the relationship; each `<li>` carries `role="option"` and an explicit `aria-selected`. |
| WCAG 2.1.1 Keyboard | The client.js implements the full APG listbox keyboard contract — see below. Nothing works before it runs. |
| WCAG 2.4.7 Focus Visible | The helper never sets `outline: none`. Consumer CSS must style focus on BOTH the button and the `<ul>`, which takes DOM focus while open. |
| WCAG 1.4.1 Use of Color | Selection state is exposed in `lang` / `dir` on the target, in the hidden input's value, and in `aria-selected` — not colour alone. |

## Roles and properties

| Element               | Role / Property                      | Source             |
| --------------------- | ------------------------------------ | ------------------ |
| `<div>` root          | none (a plain container)             | Macro              |
| `<button>`            | implicit `role="button"`             | Browser            |
| `<button>`            | `aria-label="{label}"`               | `opts.label`       |
| `<button>`            | `aria-haspopup="listbox"`            | Macro              |
| `<button>`            | `aria-expanded="true|false"`         | Macro + client     |
| `<button>`            | `aria-controls="{id}-list"`          | Macro              |
| `<span>` glyph        | `aria-hidden="true"`                 | Macro              |
| `<ul>`                | `role="listbox"`                     | Macro              |
| `<ul>`                | `aria-label="{label}"`               | `opts.label`       |
| `<ul>`                | `aria-activedescendant="{optionId}"` | Client, while open |
| `<li>`                | `role="option"`                      | Macro              |
| `<li>`                | `aria-selected="true|false"`         | Macro + client     |
| `<li>`                | `lang="{bcp47}"`                     | Macro              |
| `<input type=hidden>` | `name`                               | Macro              |

The active option is conveyed with `aria-activedescendant` on the
focused `<ul>`; DOM focus stays on the `<ul>` and never moves to an
individual `<li>`. That is the APG listbox pattern.

`aria-selected` tracks the **applied** locale, not the merely-active
option. Arrowing through the list changes `aria-activedescendant` and
`data-active`; nothing becomes selected until the user commits with
`Enter`, `Space`, or a click.

## The three tradeoffs of an icon button and a custom listbox

These are real costs. None of them is a bug to be fixed later; they
are consequences of the control shape.

### 1. The accessible name rests entirely on `aria-label`

The globe glyph is `aria-hidden="true"`, so it contributes nothing to
the accessible name. There is no visible label, no `<label>` element,
and no option text to fall back on while the listbox is closed. If
`opts.label` is missing, vague, or untranslated, the control is
effectively unnamed for screen-reader and voice-control users — a
straight WCAG 4.1.2 failure with no partial credit.

Voice control deserves specific mention: users of Voice Control and
Voice Access say the visible name of a control. An icon-only button
has none, so `aria-label` is also the *spoken* target. Keep it short,
literal, and matched to what a user would plausibly call it
("Language", not "Interface locale preference").

There is a locale-specific twist. `opts.label` should normally be in
the **current** document language, since that is what the current user
reads. But a user who cannot read the current language is exactly the
user most likely to be hunting for this control. Consider pairing the
control with a visible text label, or keeping the globe glyph — a
near-universal convention for language choice — rather than
substituting a more novel icon.

### 2. A custom listbox has weaker AT support than a native `<select>`

A native `<select>` is implemented by the platform. It gets the OS
picker on mobile, correct virtual-cursor behaviour in every screen
reader, and years of bug-for-bug compatibility work. A
`<ul role="listbox">` driven by `aria-activedescendant` is a
reimplementation, and support for it is good but not uniform —
browse-mode quirks, inconsistent announcement of `aria-selected`, and
mobile screen readers that handle `aria-activedescendant` less
reliably than real focus are all documented in the wild.

Per-option `lang` is affected too. Screen readers honour `lang` on an
`<li>` more consistently than some platforms honour it on an
`<option>`, so this is one place where the custom listbox is arguably
*better* — but verify it with the assistive technology your users
actually run rather than assuming.

If no-JS or maximal AT compatibility is a hard requirement, render
your own `<select>` and wire it with the exported pure helpers.

### 3. The glyph may not render

U+1F310 GLOBE WITH MERIDIANS is a Unicode character rendered with
whatever font the consumer's CSS resolves. On platforms whose font
stack lacks the glyph it degrades to a tofu box. It may be re-coloured
or hidden entirely by a user stylesheet or forced-colors mode.

The macro emits the glyph followed by U+FE0E VARIATION SELECTOR-15,
which requests the *text* presentation. Without it browsers reach for
the colour-emoji font and the globe renders blue — inconsistent with
theme-chooser's monochrome ◑, and at a different optical size and
baseline. VS15 is a request, not a guarantee: a platform with no text
presentation for the codepoint will still show the colour form.

Because the glyph is decorative and `aria-hidden`, a missing glyph is
never an accessibility failure — the accessible name survives. It is a
visual failure: the button becomes an empty box, and the
near-universal "this is the language switcher" affordance is lost with
it. Consumers who need a guaranteed rendering should override the
glyph with an inline SVG via the `{% call %}` block and keep
`aria-hidden="true"` on it.

## The status region is part of the pattern

The closed control shows a glyph and nothing else. A screen-reader
user focusing the button hears the label ("Language") — **not** the
locale that is currently active. A sighted user sees a globe that
looks the same whichever locale is applied. The active locale is not
discoverable from the closed control by anyone.

That cost is real and this page does not claim it away. What it does
claim is where the compensation belongs: **in the pattern, by
default.** Lily targets WCAG 2.2 AAA, so the locale chooser ships
alongside a status region in the quick start and in
[`../examples/01-basic.njk`](../examples/01-basic.njk). Pair the
control with the region; **opting out is the deliberate choice, not
opting in.**

```njk
{{ localeChooser({
    label: "Language",
    locales: ["en", "fr", "ar"]
}) }}
<p class="locale-chooser-status" aria-live="polite"></p>
```

```js
import { autoInit, localeName } from "./locale-chooser.client.js";

const status = document.querySelector(".locale-chooser-status");

autoInit({
    onChange(code) {
        status.textContent =
            translate("Active language: {name}", { name: localeName(code) });
    },
});
```

Why this shape:

- **Visible, not `sr-only`, by default.** A visible line helps sighted
  users and cognitive accessibility too, and satisfies WCAG 1.4.1
  without relying on the control. The visually-hidden variant is in
  [`./styling.md`](./styling.md) for designs that genuinely cannot
  spare the space — prefer shrinking it over deleting it.
- **`aria-live="polite"` announces mutations only**, so the region is
  silent on first paint and speaks on each subsequent change. That is
  the intended behaviour: no announcement the user did not cause.
- **The announcement text is consumer-supplied and translatable**, so
  this stays i18n-clean. `localeName(code)` resolves the human name
  from the built-in table, so the region shows "English (United
  States)" rather than `en_US`.
- **`.locale-chooser-status`** is the class hook, kebab-case like the
  rest of the system. See [`./styling.md`](./styling.md).
- **Mind the region's own `lang`.** The document `lang` changes at the
  same moment the region updates, so give the status element its own
  `lang` if the message is written in the newly selected language.

What this does *not* fix: focusing the closed button still announces
only the label. The status region tells the user what is active; it
does not make the control self-describing. Opening the listbox does
surface the state — the applied locale is the `aria-selected` option —
but that requires an interaction.

## Per-option `lang` is important

Each `<li role="option">` carries a `lang="…"` attribute. This
satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for the duration
of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The button and the `<ul>` deliberately carry no `lang`: the button has
no text at all, and the listbox is a container whose own accessible
name is in the document language.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language
(e.g. you show "English", "French", "Arabic" — all in English so
the user recognises them), the per-option `lang` attribute is
technically incorrect: you have labelled English text as French.

The macro always emits `lang`, so if you take that approach you have
two choices: accept the minor incorrectness (most readers will
mispronounce a handful of words), or strip the attribute in your own
post-processing. Rendering names in their own language ("Français",
not "French") is the better fix and the more usable one — a user
looking for their language recognises it in its own script.

## Keyboard contract

Owned entirely by `locale-chooser.client.js`. Nothing below works
before that module runs — see [`./ssr.md`](./ssr.md).

On the **button**:

| Key                          | Action                                                    |
| ---------------------------- | --------------------------------------------------------- |
| `Tab` / `Shift+Tab`          | Move focus to / away from the button (one stop).           |
| `ArrowDown`, `Enter`, `Space`| Open, with the selected locale active. Focus moves to the list. |
| `ArrowUp`                    | Open, with the LAST option active.                         |

On the **listbox**:

| Key                | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; no wrapping. |
| `Home` / `End`     | Jump to the first / last option.                              |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus.      |
| `Escape`           | Close and return focus, leaving the locale unchanged.         |
| `Tab`              | Close without stealing focus back.                            |
| Printable character| Typeahead over the option labels; 500 ms buffer reset.        |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the locale.

Note that typeahead matches the **rendered label**. If your labels are
in their own scripts ("Français", "العربية"), a user typing Latin
characters will not find them. That is a general limitation of prefix
typeahead over multi-script lists, not specific to this helper, but it
is worth knowing before you rely on it for a long locale list.

## Focus management on locale change

Choosing an option returns focus to the button, which is the same
element the user was on before opening — so the locale change does not
move the user anywhere. This satisfies WCAG 3.2.2 (On Input): changing
a setting must not cause a focus or context change.

Avoid hard navigations in `onChange` that scroll the page; if you must
navigate, scroll-restore to the control's position so the user can
keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced |
| ---------- | -------- | --------- | ---------------- |
| VoiceOver  | macOS 14 | Safari 17 | Closed: "Language, pop-up button, collapsed". Open: "Language, list box", then each option with its `lang`-correct pronunciation and "selected / not selected". |
| NVDA       | Windows  | Firefox   | Closed: "Language button collapsed". Open: "Language list box", active option read as it moves. Pronounces "Français" in a French voice if that voice is installed. |
| JAWS       | Windows  | Chrome    | Similar to NVDA; `aria-activedescendant` movement is announced. |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate". Custom-listbox handling is less reliable than a native `<select>`'s OS picker — see tradeoff 2. |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. Verify against your own AT.

## Colour contrast

The control ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility, and it now applies
to the button, the list, and the options. A safe default:

```css
.locale-chooser-button,
.locale-chooser-list {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    border: 1px solid #003087;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused
element and the background. Style it on the `<ul>` as well as the
button: the list receives DOM focus while open, and an unstyled ring
there is easy to miss.

Do not mark the selected option with colour alone (WCAG 1.4.1). Pair
`[aria-selected="true"]` with a check mark, weight, or icon — see
[`./styling.md`](./styling.md).

## Hit target size

The button is icon-only, so it has no text to give it size. Give it at
least a 44×44 CSS-pixel target to meet WCAG 2.5.8 Target Size
(Minimum) at AAA. The baseline CSS in [`./styling.md`](./styling.md)
does this with `min-width` / `min-height`.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the button in source order, and
the list mirrors visually. This is the browser's job, not yours —
provided you position the list with logical properties
(`inset-inline-start`) rather than `left`. See
[`./styling.md`](./styling.md) and [`./rtl.md`](./rtl.md).

## Common mistakes to avoid

- **Letting the glyph be the name.** Never remove `aria-hidden="true"`
  from the icon span, and never omit `opts.label`.
- **Putting the accessible name in the `{% call %}` block.** The block
  replaces the glyph, not the label. Anything you render there should
  be `aria-hidden="true"` too.
- **Styling the list open by default.** The `hidden` attribute is the
  open-state contract; a CSS rule like `.locale-chooser-list { display:
  block }` overrides `hidden` and leaves the list permanently visible
  and out of sync with `aria-expanded`. Use
  `.locale-chooser-list:not([hidden])` for open-state styling.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern instead.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox, the closest analogue to this
  button-plus-listbox shape:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- WCAG 2.5.8 Target Size (Minimum):
  <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>

---

Lily™ and Lily Design System™ are trademarks.
