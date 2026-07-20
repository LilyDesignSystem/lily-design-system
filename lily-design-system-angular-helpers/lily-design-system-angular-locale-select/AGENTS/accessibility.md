# Accessibility — LocaleSelect (Angular)

The select targets WCAG 2.2 AAA. It is an icon button that opens a
custom [APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/),
so every role, state, and keystroke is the component's own — none of
it comes free from the platform. The canonical contract is in
[`../spec/index.md`](../spec/index.md) §6; the honest tradeoffs are
in [`../docs/accessibility.md`](../docs/accessibility.md).

## Roles and properties

| Element                       | Role / Property                          | Source         |
| ----------------------------- | ---------------------------------------- | -------------- |
| `<div>` root                  | none (click / focus boundary)            | Select         |
| `<input type="hidden">`       | `name`, `value` (form participation)     | Select         |
| `<button>`                    | `aria-label={label}`                     | Consumer input |
| `<button>`                    | `aria-haspopup="listbox"`                | Select         |
| `<button>`                    | `aria-expanded="true\|false"`             | Select         |
| `<button>`                    | `aria-controls={listId}`                 | Select         |
| `<span>` glyph                | `aria-hidden="true"`                     | Select         |
| `<ul>`                        | `role="listbox"`, `aria-label={label}`   | Select         |
| `<ul>`                        | `tabindex="-1"`, `hidden` while closed   | Select         |
| `<ul>`                        | `aria-activedescendant` (open only)      | Select         |
| `<li>`                        | `role="option"`, `aria-selected`         | Select         |
| `<li>`                        | `data-active` (keyboard-active, open only) | Select       |
| `<li>`                        | `lang={tagFor(locale)}`                  | Select         |

Two things to hold onto:

- **`label` is the button's entire accessible name.** The button is
  icon-only and the glyph is `aria-hidden`, so there is no fallback
  text. A vague `label` makes the control unusable to screen-reader
  and voice-control users.
- **`lang` goes on options only.** Each option's `lang` satisfies
  WCAG 3.1.2 (Language of Parts) — screen readers switch
  pronunciation per option. The button and the list carry none,
  because their text is the page's language, not any listed locale's.

## Keyboard contract

Implemented in the component. On the **button**:

| Key                    | Action                                                        |
| ---------------------- | ------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus to / from the button.                              |
| Enter / Space          | Open the list, active option = the selected one (else index 0). |
| Arrow Down             | Open the list, active option = the selected one (else index 0). |
| Arrow Up               | Open the list, active option = the **last** one.              |

Opening always moves focus to the `<ul>`. On the **listbox**:

| Key                    | Action                                                        |
| ---------------------- | ------------------------------------------------------------- |
| Arrow Down / Arrow Up  | Move the active option; **clamps** at both ends, never wraps. |
| Home / End             | Jump to the first / last option.                              |
| Enter / Space          | Select the active option, apply it, close, refocus the button. |
| Escape                 | Close and refocus the button; the value is unchanged.         |
| Tab                    | Close **without** stealing focus back.                        |
| Printable characters   | Typeahead over the option **labels**; buffer clears 500 ms after the last keystroke. |

Pointer and focus equivalents: clicking the button toggles; clicking
an option selects it; clicking outside the root closes; focus leaving
the root closes. The last three leave focus where the user put it.

Focus lives on the `<ul>` while open — never on individual options.
The active option is conveyed only by `aria-activedescendant`, per
the APG listbox pattern.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the matching option (and `data-active`
   on the keyboard-active one).
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `[(value)]` two-way binding in user code, mirrored into the
   hidden input's `value`.

Note what is *not* in that list: the closed button. It shows a globe
glyph and nothing else, so the active locale is invisible until the
list is opened. See
[`../docs/accessibility.md`](../docs/accessibility.md) for the
status-region pattern that compensates.

## Per-option `lang` is important

The default rendering carries a `lang="…"` attribute on each
`<option>`. This satisfies WCAG 3.1.2 (Language of Parts): when a
screen reader encounters the option "Français" inside an English
page, the `lang` attribute makes the reader switch to a French voice
for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you render a `<select>` in a sibling
widget. Always carry the locale's BCP 47 tag onto each
`<option>`:

```html
<select>
    @for (l of locales; track l) {
        <option [value]="l" [attr.lang]="tagFor(l)">
            {{ labelFor(l) }}
        </option>
    }
</select>
```

## Focus management on locale change

Choosing an option closes the list and returns focus to the button —
the control the user opened. That is the expected APG listbox
behaviour and satisfies WCAG 3.2.2 (On Input): focus lands back on
the trigger, not somewhere unrelated, and no context change occurs.
`Escape` does the same without changing the value.

Focus is deliberately *not* pulled back when the list closes because
of `Tab`, an outside click, or focus leaving the root — in those
cases the user has already said where focus should go.

Beyond the control, avoid `router.navigate()` calls in
`(localeChange)` that scroll the page; if you must navigate,
scroll-restore to the select's position so the user can keep
choosing.

## Screen-reader behaviour matrix

The control is an icon button, so what a reader announces on focus is
the `label` plus the collapsed state — never the active locale.

| Reader     | OS       | Browser   | What's announced when the user lands on the button          |
| ---------- | -------- | --------- | ---------------------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed". Opening announces the list; arrowing announces each option's `lang`-correct pronunciation and its selected state. |
| NVDA       | Windows  | Firefox   | "Language button, collapsed". After opening: "list box, English (United States), selected, 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language button, collapsed".                              |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate".                |

Two caveats worth stating rather than burying. The
"lang-correct pronunciation" depends on the reader having a matching
voice package installed. And support for `aria-activedescendant` on a
custom listbox is materially weaker and less consistent than for a
native `<select>` — see
[`../docs/accessibility.md`](../docs/accessibility.md), which treats
that as a regression, not a footnote.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect. In that case, the select still emits it (it
honours your stored locale codes faithfully) — consider switching
the *visible* labels to endonyms.

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful.

## What the custom listbox costs

Worth being blunt with anyone auditing this package: replacing the
native `<select>` with a custom listbox is an accessibility
**regression** in three specific ways.

1. **The button is icon-only.** Its accessible name is entirely
   `aria-label`, i.e. entirely the consumer's `label`. Native
   `<select>` degrades to showing its value; this does not.
2. **Custom listbox support is weaker.** A native `<select>` gets
   platform-native behaviour — OS pickers on mobile, forms mode
   handling, `aria-activedescendant`-free announcement — that a
   `<ul role="listbox">` has to reimplement and that assistive
   technology supports less consistently.
3. **The glyph may not render.** U+1F310 depends on platform font
   and emoji coverage; it can render as tofu or vanish entirely.

Consumers who want the native affordance back can bind a sibling
`<select>` to the same `[(value)]` signal — the select still owns
`lang` / `dir` / storage / `localeChange`. See
[examples/sibling-select.component.ts](../examples/sibling-select.component.ts).

## Combobox / filtering

For 50+ locales, a combobox with filtering is the right pattern. The
APG Combobox specification is intricate; this helper ships a listbox,
not a combobox — the only text-driven affordance is the APG typeahead
described above. Use a sibling widget bound to the same signal, or
render the upstream Lily `Combobox` headless primitive.

See [examples/combobox.component.ts](../examples/combobox.component.ts)
for a minimal in-line combobox built on a `<datalist>` (≈APG
Combobox with List Autocomplete and Manual Selection).

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the button in source order, and
the list mirrors visually. This is the browser's job, not yours.

## Angular-specific notes

- `[attr.lang]="tagFor(locale)"` is the form that survives empty
  values cleanly. `lang="{{ tagFor(locale) }}"` would emit
  `lang=""` if `tagFor` returned a falsy value.
- `[attr.aria-label]="label() || null"` carries the consumer-supplied
  accessible name onto the button and the list, and omits the
  attribute rather than emitting `aria-label=""` when empty.
- `[attr.hidden]="open() ? null : ''"` is how the list's `hidden`
  attribute is toggled — `[hidden]` would bind the property and
  interact badly with consumer `display` rules.
- `aria-activedescendant` is a `computed()` returning `null` unless
  the list is open, so the attribute is absent while closed.
- `OnPush` change detection is in effect. Signal changes drive
  view updates without manual `markForCheck()`.

## References

- WAI-ARIA APG — Listbox pattern (the pattern this implements):
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Combobox pattern (for a custom combobox sibling):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
