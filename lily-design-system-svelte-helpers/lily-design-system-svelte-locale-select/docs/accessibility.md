# Accessibility

The picker targets **WCAG 2.2 AAA** using a native `<select>`, whose
role and keyboard semantics the browser provides. This page lists
what's built in and what remains the consumer's responsibility.

## Built-in

| WCAG item | How the picker satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each option carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<select aria-label>` exposes the combobox; `<option>` exposes each choice. |
| WCAG 2.1.1 Keyboard | Tab to the select; Arrow / Home / End / typeahead move selection — all from native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the picker never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is exposed via the `<select>`'s current value and reflected in the `lang` attribute — not colour alone. |
| Native `<select>` | Single-selection combobox with full keyboard and screen-reader support — provided by the platform. |

## Per-option `lang` is important

The default rendering carries a `lang="…"` attribute on each
`<option>`. This satisfies WCAG 3.1.2 (Language of Parts): when a
screen reader encounters the option "Français" inside an English
page, the `lang` attribute makes the reader switch to a French voice
for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced "Franc-ess"
in an English voice — comprehensible but ugly. With it, the reader
says "Fran-SAY".

The same logic applies when you render custom `<option>` markup via
the children snippet. Always carry the locale's BCP 47 tag onto each
`<option>`:

```svelte
<select>
    {#each locales as l (l)}
        <option value={l} lang={tagFor(l)}>{labelFor(l)}</option>
    {/each}
</select>
```

## Keyboard contract

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus to / from the select.                                |
| Arrow Down / Arrow Up  | Select the next / previous option.                              |
| Home / End             | Select the first / last option.                                 |
| Typeahead              | Type characters to jump to a matching option.                   |
| Enter / Space          | Open the option list (platform-dependent).                      |
| Escape                 | Close the option list.                                          |

This is all native behaviour. The picker does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale changes.
This is the WCAG 3.2.2 (On Input) contract: changing a setting must
not cause a focus or context change. Avoid `goto()` calls in
`onChange` that scroll the page; if you must navigate, scroll-restore
to the picker's position so the user can keep choosing.

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". Opening and arrowing announces each option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), then the per-option `lang` attribute is technically
incorrect (the visible text is English even though the attribute says
French). In that case, drop the `lang` attribute by using a custom
children snippet:

```svelte
{#snippet children({ locales, value, setLocale, labelFor })}
    {#each locales as l (l)}
        <option class="locale-select-option" value={l} selected={value === l}>
            {labelFor(l)}
        </option>
    {/each}
{/snippet}
```

The default rendering's tradeoff is: the labels show **in their own
language** (English / Français / العربية), so per-option `lang` is
correct and helpful. If you override the labels to be all in the
viewer's language, drop the per-option `lang` attribute too.

## Native `<select>` accessibility

The picker renders a native `<select>` by default (see
[examples/02-select.svelte](../examples/02-select.svelte)). Native
`<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the picker; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value + count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android dialog).

The tradeoff:

- ✅ Compact (one widget).
- ✅ Scales to 100+ locales.
- ❌ Choices hidden until opened (worse discoverability than an
  always-visible list).
- ❌ Can't show option text in mixed scripts as easily (some OS
  pickers don't honour per-option `lang`).

For an always-visible list of 2–8 locales, render radios or buttons
via the `children` snippet. For 9+, the native `<select>` default or
a combobox is the better fit.

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern. The
APG Combobox specification is intricate (focus-on-listbox vs
focus-on-input, auto-complete vs none, vertical vs grid). This helper
doesn't ship a combobox; use the `children` snippet to render the
upstream Lily `Combobox` headless primitive or an established
component (Headless UI, Melt UI, Bits UI).

See [examples/10-combobox.svelte](../examples/10-combobox.svelte) for
a minimal in-line combobox built on a `<datalist>` (≈APG Combobox with
List Autocomplete and Manual Selection).

## Colour contrast

The picker ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility. A safe default for the
select's text and border:

```css
.locale-select {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    border: 1px solid #003087;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused element
and the background.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the `<select>` in source order,
and the option list mirrors visually. This is the browser's job, not
yours.

## References

- HTML Living Standard — the `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WAI-ARIA APG — Combobox pattern (for a custom combobox via the children snippet):
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
- MDN — the `<select>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
