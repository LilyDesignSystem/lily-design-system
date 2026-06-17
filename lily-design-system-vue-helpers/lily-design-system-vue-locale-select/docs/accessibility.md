# Accessibility

The picker targets **WCAG 2.2 AAA** and uses a native HTML
`<select>`, which carries WAI-ARIA `combobox` semantics for free.
This page lists what's built in and what remains the consumer's
responsibility.

## Built-in

| WCAG / APG item | How the picker satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each option carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<select aria-label>` exposes the combobox; `<option>` exposes each choice. |
| WCAG 2.1.1 Keyboard | Tab to the select; Arrow keys, Home / End, and typeahead move selection — all from native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the picker never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is the `<select>`'s current value and is reflected in the `lang` attribute — not colour alone. |
| Native `<select>` semantics | Single-selection combobox with one focus stop and a platform-provided option list. |

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

## Keyboard contract

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab                    | Move focus to the select (one stop).                            |
| Shift+Tab              | Move focus away from the select.                                |
| Arrow Down             | Select the next option.                                         |
| Arrow Up               | Select the previous option.                                     |
| Home / End             | Select the first / last option.                                 |
| Typeahead              | Type characters to jump to a matching option.                   |
| Enter / Space          | Open the option list (platform-dependent).                      |
| Escape                 | Close the option list.                                          |

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`router.push()` calls in `@change` that scroll the page; if you
must navigate, scroll-restore to the picker's position so the user
can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English" → on open, "English, 1 of 5". Arrow announces the next option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". Pronounces "Français" in French voice if French voice installed. |
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

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, drop the per-option `lang` too.

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

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern.
The APG Combobox specification is intricate (focus-on-listbox vs
focus-on-input, auto-complete vs none, vertical vs grid). This
helper doesn't ship a combobox; use the default slot to render the
upstream Lily `Combobox` headless primitive or an established
Vue component (Radix Vue, Headless UI Vue, PrimeVue).

See [examples/10-combobox.vue](../examples/10-combobox.vue) for a
minimal in-line combobox built on a `<datalist>` (≈APG Combobox
with List Autocomplete and Manual Selection).

## Colour contrast

The picker ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility. A safe default
for the select's text and the checked option:

```css
.locale-select {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    font-weight: 600;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused
element and the background.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the `<select>` in source order,
and the option list mirrors visually. This is the browser's job, not
yours.

## References

- HTML Living Standard — the `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WAI-ARIA APG — Combobox pattern (for the slot case):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
