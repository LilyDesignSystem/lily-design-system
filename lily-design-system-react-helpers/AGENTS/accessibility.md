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
| HTML Living Standard — `<select>` | `ThemeChooser`, `LocaleChooser` default rendering.    |
| WAI-ARIA APG 1.2 — Combobox    | Optional rendering via `children` render prop.         |
| HTML Living Standard           | `lang`, `dir`, `select`, `option`.                     |
| RFC 5646 (BCP 47)              | `LocaleChooser` `lang` attribute output.                |

## Required commitments

- **Semantic HTML first.** Selects default to a native `<select>`
  with `<option>` children. ARIA is limited to `aria-label`; the
  `<select>` carries an implicit combobox role and each `<option>`
  an implicit option role, so no extra ARIA is needed.
- **Accessible name.** Every interactive container has an accessible
  name supplied by the required `label` prop. The component does
  NOT default the label to English; it requires the prop so
  consumers always supply localised text.
- **Keyboard contract.** Tab focuses the select, Arrow keys move
  selection between options, Home/End jump to first/last, and
  typeahead jumps to a matching option. This contract is the
  platform default for `<select>`; the components do not override it.
- **Visible focus.** The components never set `outline: none`. The
  consumer's CSS supplies the focus ring. Lily's reference themes
  ship a 2px AAA-grade ring.
- **No colour-only meaning.** Selection state is conveyed via the
  native `<select>` value (the selected `<option>`), via the
  controlled `value`, and via the `data-*` / `lang` / `dir`
  attribute the helper writes to the DOM. Colour is purely cosmetic.
- **Live regions are deliberate.** The selects do not declare
  `aria-live` regions. Selection changes propagate via the native
  `<select>` value, which screen readers announce automatically.

## ARIA contract

| Element                        | Attribute                  | Source            |
| ------------------------------ | -------------------------- | ----------------- |
| `<select>`                     | Implicit `role="combobox"` | Browser           |
| `<select>`                     | `aria-label={label}`       | Consumer prop     |
| `<select>`                     | `name`                     | Component         |
| `<option>`                     | Implicit `role="option"`   | Browser           |
| `<option>` (LocaleChooser only) | `lang="{tagFor(locale)}"`  | Component         |

The components do not add any manual focus management or
`aria-activedescendant`. The native `<select>` element already
implements the listbox/combobox behaviour the operating system
provides.

## Per-option language (LocaleChooser)

`LocaleChooser` carries `lang` on each `<option>` so screen
readers pronounce the option text in the correct language. This is
WCAG 3.1.2 (Language of Parts).

| Option text     | Without `lang`                       | With `lang`                            |
| --------------- | ------------------------------------ | -------------------------------------- |
| "Français"      | "Franc-ess" (English voice)          | "Fran-SAY" (French voice)              |
| "العربية"        | "Al-arab-eye-ya" (mangled)          | Native Arabic pronunciation             |
| "繁體中文"       | character-by-character (garbled)     | Native Mandarin pronunciation           |

The same logic applies when a consumer renders custom `<option>`
elements via the `children` render prop. Always carry the BCP 47 tag
onto each `<option>` via `tagFor(locale)`.

## Keyboard contract

Provided by the platform's native `<select>`:

| Key                | Action                                                         |
| ------------------ | -------------------------------------------------------------- |
| `Tab`              | Move focus onto the select (one tab stop).                     |
| `Shift+Tab`        | Move focus backwards off the select.                           |
| `Arrow Down`       | Select the next option.                                        |
| `Arrow Up`         | Select the previous option.                                    |
| `Home` / `End`     | Select the first / last option.                                |
| typeahead          | Type characters to jump to a matching option.                  |
| `Enter` / `Space`  | Open the option list (platform-dependent).                     |
| `Escape`           | Close the option list.                                         |

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
| VoiceOver  | macOS 14 | Safari 17 | "{label}, pop-up button" → "{option}, selected, 1 of N". |
| NVDA       | Windows  | Firefox   | "{label} combo box" → "{option} 1 of N". |
| JAWS       | Windows  | Chrome    | "{label} combo box, {option}, 1 of N". |
| TalkBack   | Android  | Chrome    | "{label}, {option}, drop-down list, 1 of N, double-tap to activate". |

For `LocaleChooser`, "lang-correct pronunciation" depends on the
reader having a matching voice package installed. NVDA's default
ships with English only; users add other voices through eSpeak NG
or commercial voice packs.

## Colour contrast

The helpers ship no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is the consumer's CSS responsibility. Safe defaults
for the selected option:

```css
.theme-chooser option:checked,
.locale-chooser option:checked {
    color: var(--theme-color-primary, #003087);
    font-weight: 600;
}
```

The focus ring should meet WCAG 2.4.13 Focus Appearance — minimum
2px-wide outline that contrasts with both the focused element and
the background.

## Common mistakes to avoid

- **Wrapping the select in a redundant container.** The
  `children` render prop renders *inside* the `<select>`; do not
  wrap a container *around* the select expecting it to add the
  accessible name — that comes from `aria-label` on the `<select>`.
- **Hiding the native `<select>` with `display: none`.** That
  removes it from the accessibility tree. Style the `<select>`
  directly, or use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) only when an
  alternative visible control is wired up.
- **Forgetting to translate `themeLabels` / `localeLabels`.** The
  selects only know what the consumer tells them; locale-aware
  copy is the consumer's responsibility.
- **Suppressing `aria-label` when adding a visible heading.** If
  the heading is the select's label, use `aria-labelledby` instead
  of dropping the label entirely.

## References

- HTML Living Standard — `<select>`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
- WAI-ARIA APG — Combobox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
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
