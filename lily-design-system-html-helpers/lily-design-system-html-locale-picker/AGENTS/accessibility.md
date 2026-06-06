# Accessibility — `<locale-picker>` (HTML helper)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. The canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<locale-picker>` (host)      | none (transparent)         | —             |
| Rendered `<fieldset>`         | `role="radiogroup"`        | Picker        |
| Rendered `<fieldset>`         | `aria-label={label}`       | Consumer attr |
| Rendered `<label>`            | `lang={tagFor(locale)}`    | Picker        |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The `lang` attribute on each `<label>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab                    | Move focus into the radio group, landing on the checked option (or the first option if none is checked). |
| Tab again              | Move focus out of the group entirely; the group counts as one stop. |
| Arrow keys (`↑ ↓ ← →`) | Move selection between options inside the group. Selection follows focus by default in native radios. |
| Space                  | Select the focused option if it isn't already.                  |
| Home / End             | (Some browsers) Select first / last option.                     |

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `value` attribute / `el.value` property.

## Per-option `lang` is important

The default rendering wraps each option in a `<label lang="…">`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen
reader encounters the option "Français" inside an English page,
the `lang` attribute makes the reader switch to a French voice for
the duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you render a `<select>` via a subclass.
Always carry the locale's BCP 47 tag onto each `<option>`:

```html
<select>
    <option value="en" lang="en">English</option>
    <option value="fr" lang="fr">Français</option>
    <option value="ar" lang="ar">العربية</option>
</select>
```

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid navigation
calls (`window.location = …`) in `localechange` handlers that
scroll the page; if you must navigate, preserve scroll position and
focus.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, group" → "English, selected, radio button, 1 of 5". Arrow announces the next option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language grouping" → "English radio button checked 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language group, English radio button checked, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, radio button, 1 of 5, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect (the visible text is English even though the
attribute says French). In that case, drop the `lang` attribute by
subclassing and rendering without it:

```ts
class ViewerLanguageLocalePicker extends LocalePicker {
    connectedCallback() {
        super.connectedCallback();
        for (const label of this.querySelectorAll("label.locale-picker-option")) {
            label.removeAttribute("lang");
        }
    }
}
```

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, override the markup too.

## Native `<select>` accessibility

A subclass can render a `<select>` instead of radios (see
`examples/02-select.html`). Native `<select>` is fully accessible:

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
- Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For 2–8 locales, prefer the radio default. For 9+, prefer
`<select>` or combobox.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves through the radios in the order they
appear in your `locales` array, and Arrow Right (in RTL) moves to
the previous option, not the next. This is the browser's job, not
yours.

## CustomEvent vs ARIA live region

`localechange` is a change notification for consumer code. The
selection change is announced because the underlying control state
(checked) changes, which the platform handles for native radios.

If you want the locale change announced via an ARIA live region,
add a separate `role="status"` or `aria-live` element and write
into it from your `localechange` listener.

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
