# Accessibility — LocaleSelect (Svelte)

The picker targets WCAG 2.2 AAA and uses a native `<select>`, whose
keyboard and role semantics the browser provides. The canonical
contract is in [`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<select>`                    | implicit `role="combobox"` | Browser       |
| `<select>`                    | `aria-label={label}`       | Consumer prop |
| `<select>`                    | `name`                     | Picker        |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | `lang={tagFor(locale)}`    | Picker        |

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
4. The `bind:value` binding in user code.

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
the snippet. Always carry the locale's BCP 47 tag onto each `<option>`:

```svelte
<select>
    {#each locales as locale}
        <option value={locale} lang={tagFor(locale)}>
            {labelFor(locale)}
        </option>
    {/each}
</select>
```

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid `goto`
calls in `onChange` that scroll the page; if you must navigate,
scroll-restore to the picker's position so the user can keep
choosing.

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
using a custom `children` snippet:

```svelte
<LocaleSelect label="Language" locales={["en", "fr", "ar"]}>
    {#snippet children({ locales, value, setLocale, labelFor })}
        {#each locales as l}
            <option class="locale-select-option" value={l} selected={value === l}>
                {labelFor(l)}
            </option>
        {/each}
    {/snippet}
</LocaleSelect>
```

## Native `<select>` accessibility

The picker renders a native `<select>` by default (see
[examples/02-select.svelte](../examples/02-select.svelte)). Native
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

For an always-visible list of 2–8 locales, render radios or buttons
via the `children` snippet. For 9+, the native `<select>` default or
a combobox is the better fit.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still moves to and from the `<select>` in source order,
and the option list mirrors visually. This is the browser's job, not
yours.

## Svelte-specific notes

- The `aria-label` is rendered via `aria-label={label}`. The
  `{...restProps}` spread runs *after* the static attributes, so a
  consumer can override the picker's `aria-label` by passing one
  explicitly: `<LocaleSelect label="…" aria-labelledby="heading-id" />`.
- `{@render children(args)}` does not announce updates. If a
  consumer's snippet needs to announce "Language changed to
  French", they have to write the `aria-live` region themselves.
- `lang` and `dir` are set on the resolved target element. If the
  consumer passes `target={cardEl}`, only that card switches. The
  surrounding page keeps its document language.

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
