# Accessibility — LocaleSelect (Vue)

The picker targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries WAI-ARIA `combobox` semantics for free. The canonical
contract is in [`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<select>`                    | implicit `role="combobox"` | Browser       |
| `<select>`                    | `aria-label={label}`       | Consumer prop |
| `<select>`                    | `name`                     | Picker        |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | `lang={bcp47}`             | Picker        |
| `<option>`                    | selected state (implicit)  | Browser       |

The `lang` attribute on each `<option>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                    | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| Tab                    | Move focus to the select (one stop).                                 |
| Shift+Tab              | Move focus away from the select.                                      |
| Arrow Down             | Select the next option.                                              |
| Arrow Up               | Select the previous option.                                          |
| Home / End             | Select the first / last option.                                      |
| Typeahead              | Type characters to jump to a matching option.                        |
| Enter / Space          | Open the option list (platform-dependent).                          |
| Escape                 | Close the option list.                                               |

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. The selected `<option>` (the `<select>`'s current value).
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The `v-model:value` binding in user code.

## Per-option `lang` is important

The default rendering carries a `lang="…"` attribute on each
`<option>`. This satisfies WCAG 3.1.2 (Language of Parts): when a
screen reader encounters the option "Français" inside an English
page, the `lang` attribute makes the reader switch to a French voice
for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you render custom `<option>` markup via
the slot. Always carry the locale's BCP 47 tag onto each `<option>`:

```vue
<select>
    <option v-for="l in locales" :key="l" :value="l" :lang="tagFor(l)">
        {{ labelFor(l) }}
    </option>
</select>
```

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`router.push` calls in `@change` that scroll the page; if you must
navigate, scroll-restore to the picker's position so the user can
keep choosing.

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English" → on open, "English, 1 of 5". |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect. In that case, drop the `lang` attribute by
using a custom default slot:

```vue
<template #default="{ locales, value, setLocale, labelFor, name }">
    <select :name="name" :value="value" @change="(e) => setLocale((e.target as HTMLSelectElement).value)">
        <option v-for="l in locales" :key="l" class="locale-select-option" :value="l">
            {{ labelFor(l) }}
        </option>
    </select>
</template>
```

## Native `<select>` accessibility

The default rendering is a native `<select>` (see
[examples/02-select.vue](../examples/02-select.vue)). Native
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
- Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For an always-visible list of 2–8 locales, render buttons via the
default slot. For 9+, the native `<select>` default or a combobox is
the better fit.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the `<select>` in source order,
and the option list mirrors visually. This is the browser's job, not
yours.

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
