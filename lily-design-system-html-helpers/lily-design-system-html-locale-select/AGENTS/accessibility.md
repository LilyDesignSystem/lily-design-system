# Accessibility — `<locale-select>` (HTML helper)

The select targets WCAG 2.2 AAA and uses the native `<select>`
(platform combobox / listbox) model. The canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<locale-select>` (host)      | none (transparent)         | —             |
| Rendered `<select>`           | implicit `role="combobox"` | Browser       |
| Rendered `<select>`           | `aria-label={label}`       | Consumer attr |
| Rendered `<select>`           | `name`                     | Select        |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | `lang={tagFor(locale)}`    | Select        |

The `lang` attribute on each `<option>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus into / out of the control; it counts as one stop.    |
| Arrow Down / Up        | Move selection to the next / previous option.                   |
| Home / End             | Move selection to the first / last option.                      |
| typeahead              | Jump to the option whose text matches the typed characters.     |
| Enter / Space          | Open the option list (where the platform pops one).             |
| Escape                 | Close the open option list.                                     |

This is all native behaviour. The select does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` (and the `<select>`'s `value`).
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).

## Per-option `lang` is important

The default rendering carries `lang="…"` on each `<option>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen
reader encounters the option "Français" inside an English page,
the `lang` attribute makes the reader switch to a French voice for
the duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The default rendering already carries the locale's BCP 47 tag onto
each `<option>`:

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

| Reader     | OS       | Browser   | What's announced when user lands on the control |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". Arrow announces the next option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

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
class ViewerLanguageLocaleSelect extends LocaleSelect {
    connectedCallback() {
        super.connectedCallback();
        for (const option of this.querySelectorAll("option.locale-select-option")) {
            option.removeAttribute("lang");
        }
    }
}
```

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, override the markup too.

## Native `<select>` accessibility

The default rendering is a native `<select>`, which is fully
accessible:

- Keyboard: Enter / Space / Down arrow open the option list; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoffs of the `<select>` model:

- Compact (one widget regardless of locale count).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability than an
  always-visible list).
- Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For very long lists (50+), prefer a combobox with type-ahead (see
`examples/10-combobox.html`).

## RTL focus order

The native `<select>` is a single focus stop, so Tab order is
unaffected by direction. Inside the open option list, Arrow Down /
Up always move through the options in source order — which is the
same order as your `locales` array. This is the browser's job, not
yours.

## CustomEvent vs ARIA live region

`localechange` is a change notification for consumer code. The
selection change is announced because the `<select>`'s value
changes, which the platform handles for native form controls.

If you want the locale change announced via an ARIA live region,
add a separate `role="status"` or `aria-live` element and write
into it from your `localechange` listener.

## References

- WAI-ARIA APG — Combobox / Listbox patterns:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
