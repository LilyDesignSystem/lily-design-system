# Accessibility — LocaleSelect (Angular)

The picker targets WCAG 2.2 AAA and uses a native `<select>`, whose
keyboard and role semantics the browser provides. The canonical
contract is in [`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source         |
| ----------------------------- | -------------------------- | -------------- |
| `<select>`                    | implicit `role="combobox"` | Browser        |
| `<select>`                    | `aria-label={label}`       | Consumer input |
| `<select>`                    | `name`                     | Picker         |
| `<option>`                    | implicit `role="option"`   | Browser        |
| `<option>`                    | `lang={tagFor(locale)}`    | Picker         |

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

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. The selected `<option>` (the `<select>`'s current value).
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `[(value)]` two-way binding in user code.

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

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`router.navigate()` calls in `(localeChange)` that scroll the
page; if you must navigate, scroll-restore to the picker's
position so the user can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the select             |
| ---------- | -------- | --------- | ---------------------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". Opening and arrowing announces each option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5".                     |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect. In that case, the picker still emits it (it
honours your stored locale codes faithfully) — consider switching
the *visible* labels to endonyms.

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful.

## Native `<select>` accessibility

The picker renders a native `<select>` by default. Native
`<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the picker; typing
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

For an always-visible list of 2–8 locales, render radios or
buttons via a sibling widget bound to the same `[(value)]` signal.
For 9+, the native `<select>` default or a combobox is the better
fit.

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern.
The APG Combobox specification is intricate; this helper doesn't
ship a combobox. Use a sibling widget bound to the same
signal, or render the upstream Lily `Combobox` headless primitive.

See [examples/10-combobox.component.ts](../examples/10-combobox.component.ts)
for a minimal in-line combobox built on a `<datalist>` (≈APG
Combobox with List Autocomplete and Manual Selection).

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the `<select>` in source
order, and the option list mirrors visually. This is the browser's
job, not yours.

## Angular-specific notes

- `[attr.lang]="tagFor(locale)"` is the form that survives empty
  values cleanly. `lang="{{ tagFor(locale) }}"` would emit
  `lang=""` if `tagFor` returned a falsy value.
- `[attr.aria-label]="label()"` carries the consumer-supplied
  accessible name onto the `<select>`.
- `OnPush` change detection is in effect. Signal changes drive
  view updates without manual `markForCheck()`.

## References

- HTML Living Standard — the `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WAI-ARIA APG — Combobox pattern (for a custom combobox sibling):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
