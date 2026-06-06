# Accessibility for Lily React helpers

Every helper in this catalog targets **WCAG 2.2 AAA** and implements
the WAI-ARIA Authoring Practices 1.2 patterns for its primitive. This
file lists the cross-helper accessibility contract; per-helper docs
in each subproject's `docs/accessibility.md` extend it with the
specific pattern.

## Standards baseline

| Standard / pattern             | Where it applies                                       |
| ------------------------------ | ------------------------------------------------------ |
| WCAG 2.2 AAA                   | Every helper, every demo, every example.               |
| WAI-ARIA APG 1.2 — Radio Group | `ThemePicker`, `LocalePicker` default rendering.       |
| WAI-ARIA APG 1.2 — Combobox    | Optional rendering via `children` render prop.         |
| HTML Living Standard           | `lang`, `dir`, `fieldset`, `input[type=radio]`.        |
| RFC 5646 (BCP 47)              | `LocalePicker` `lang` attribute output.                |

## Required commitments

- **Semantic HTML first.** Pickers default to `<fieldset>` + native
  `<input type="radio">`. ARIA is added where native semantics do
  not suffice (`role="radiogroup"`, `aria-label`, `aria-checked`
  implicit on the radios).
- **Accessible name.** Every interactive container has an accessible
  name supplied by the required `label` prop. The component does
  NOT default the label to English; it requires the prop so
  consumers always supply localised text.
- **Keyboard contract.** Tab into the group, Arrow keys move
  selection between radios, Space re-selects the focused radio.
  This contract is the platform default for `<input type="radio">`;
  the components do not override it.
- **Visible focus.** The components never set `outline: none`. The
  consumer's CSS supplies the focus ring. Lily's reference themes
  ship a 2px AAA-grade ring.
- **No colour-only meaning.** Selection state is conveyed via
  `aria-checked` (implicit on radios), via the controlled `value`,
  and via the `data-*` / `lang` / `dir` attribute the helper
  writes to the DOM. Colour is purely cosmetic.
- **Live regions are deliberate.** The pickers do not declare
  `aria-live` regions. Selection changes propagate via the native
  radio checked state, which screen readers announce automatically.

## ARIA contract

| Element                       | Attribute                  | Source            |
| ----------------------------- | -------------------------- | ----------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Component         |
| `<fieldset>`                  | `aria-label={label}`       | Consumer prop     |
| `<input type="radio">`        | Implicit `role="radio"`    | Browser           |
| `<input type="radio">`        | Implicit `aria-checked`    | Browser           |
| `<input type="radio">` × N    | Shared `name`              | Component         |
| `<label>` (LocalePicker only) | `lang="{tagFor(locale)}"`  | Component         |

The components do not add a roving `tabindex`, no manual focus
management, no `aria-activedescendant`. Native radio inputs already
implement the Radio Group APG pattern.

## Per-option language (LocalePicker)

`LocalePicker` carries `lang` on each option `<label>` so screen
readers pronounce the option text in the correct language. This is
WCAG 3.1.2 (Language of Parts).

| Option text     | Without `lang`                       | With `lang`                            |
| --------------- | ------------------------------------ | -------------------------------------- |
| "Français"      | "Franc-ess" (English voice)          | "Fran-SAY" (French voice)              |
| "العربية"        | "Al-arab-eye-ya" (mangled)          | Native Arabic pronunciation             |
| "繁體中文"       | character-by-character (garbled)     | Native Mandarin pronunciation           |

The same logic applies when a consumer renders a `<select>` via the
`children` render prop. Always carry the BCP 47 tag onto each
`<option>` via `tagFor(locale)`.

## Keyboard contract

Provided by the platform's native radio inputs:

| Key                | Action                                                         |
| ------------------ | -------------------------------------------------------------- |
| `Tab`              | Move focus into the group, landing on the checked option (or the first option if none is checked). |
| `Shift+Tab`        | Move focus backwards out of the group.                         |
| `Arrow Down/Right` | Move selection to the next option (selection follows focus).   |
| `Arrow Up/Left`    | Move selection to the previous option.                         |
| `Space`            | Re-select the focused option (rarely needed).                  |
| `Home` / `End`     | Move to first / last option (most browsers).                   |

When the consumer overrides the default markup via `children`, they
take responsibility for the keyboard contract of whichever pattern
they render (button group, combobox, etc.). See
[`AGENTS/shared/headless-principles.md`](./shared/headless-principles.md)
for the broader rule.

## Focus management

By default the focused element stays focused when the locale/theme
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. The components
honour this by not calling `.focus()`, `.blur()`, or `goto()` in
any of their effects.

Consumers who navigate on change (e.g. URL-prefix locale strategy
that calls `router.push("/fr/about")`) are responsible for scroll
restoration and focus return so the user can keep choosing.

## Reduced motion

The components perform no animation. CSS transitions on
`data-theme="…"` swaps are the consumer's choice; they should
respect `prefers-reduced-motion` themselves:

```css
@media (prefers-reduced-motion: no-preference) {
    body {
        transition: background-color 200ms ease;
    }
}
```

## Screen-reader smoke tests

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced                                |
| ---------- | -------- | --------- | ----------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "{label}, radiogroup" → "{option}, radio button, selected, 1 of N". |
| NVDA       | Windows  | Firefox   | "{label} grouping" → "{option} radio button checked 1 of N". |
| JAWS       | Windows  | Chrome    | "{label} group, {option} radio button checked, 1 of N". |
| TalkBack   | Android  | Chrome    | "{label}, {option}, radio button, 1 of N, double-tap to activate". |

For `LocalePicker`, "lang-correct pronunciation" depends on the
reader having a matching voice package installed. NVDA's default
ships with English only; users add other voices through eSpeak NG
or commercial voice packs.

## Colour contrast

The helpers ship no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is the consumer's CSS responsibility. Safe defaults
for an active radio's label:

```css
.theme-picker-option:has(input:checked),
.locale-picker-option:has(input:checked) {
    color: var(--theme-color-primary, #003087);
    font-weight: 600;
}
```

The focus ring should meet WCAG 2.4.13 Focus Appearance — minimum
2px-wide outline that contrasts with both the focused element and
the background.

## Common mistakes to avoid

- **Replacing the fieldset with a div in custom rendering.** The
  `children` render prop renders *inside* the fieldset; do not
  wrap a div *around* the picker if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe).
- **Forgetting to translate `themeLabels` / `localeLabels`.** The
  pickers only know what the consumer tells them; locale-aware
  copy is the consumer's responsibility.
- **Suppressing `aria-label` when adding a visible heading.** If
  the heading is the picker's label, use `aria-labelledby` instead
  of dropping the label entirely.

## References

- WAI-ARIA APG — Radio Group pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `lang` attribute:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
- MDN — `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/:lang>
