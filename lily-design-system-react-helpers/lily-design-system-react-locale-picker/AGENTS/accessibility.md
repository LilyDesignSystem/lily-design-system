# AGENTS / accessibility — LocalePicker

Accessibility contract specific to `LocalePicker`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item                | How the picker satisfies it                              |
| ------------------------------ | -------------------------------------------------------- |
| WCAG 3.1.1 Language of Page    | Writes `lang` to the document root on every locale apply. |
| WCAG 3.1.2 Language of Parts   | Each default option `<label>` carries its own `lang`.    |
| WCAG 1.4.10 Reflow (RTL bidi)  | Writes `dir="rtl"` for RTL locales (skipped when `applyDir={false}`). |
| WCAG 4.1.2 Name, Role, Value   | `<fieldset role="radiogroup" aria-label>` + native radios. |
| WCAG 2.1.1 Keyboard            | Tab / Arrow / Space / Home / End — native radio semantics. |
| WCAG 2.4.7 Focus Visible       | Browser default focus ring preserved; helper never sets `outline: none`. |
| WCAG 1.4.1 Use of Color        | State conveyed via `aria-checked`, `lang`/`dir` attrs, controlled value. |
| WCAG 3.2.2 On Input            | Focus is never moved by the picker on locale change.     |
| WAI-ARIA APG Radio Group       | Native `<input type="radio">` with shared `name`.        |

## Roles and properties

| Element                    | Attribute               | Source            |
| -------------------------- | ----------------------- | ----------------- |
| `<fieldset>`               | `role="radiogroup"`     | Component         |
| `<fieldset>`               | `aria-label={label}`    | Consumer prop     |
| `<label>` (default render) | `lang={tagFor(locale)}` | Component         |
| `<input type="radio">`     | implicit `role="radio"` | Browser           |
| `<input type="radio">`     | implicit `aria-checked` | Browser           |
| `<input type="radio">` × N | shared `name`           | Component         |
| `<html>` (target)          | `lang` (BCP 47)         | Component effect  |
| `<html>` (target)          | `dir="rtl"\|"ltr"`      | Component effect  |

The component never adds:

- `aria-pressed` (radios use `aria-checked`).
- Roving `tabindex`. Native radios already do this — only the checked
  one is in the tab order; arrows move within the group.
- `aria-activedescendant`. Focus is the source of truth.
- A focus management API. The browser handles it.

## Keyboard contract

| Key                | Action                                                         |
| ------------------ | -------------------------------------------------------------- |
| `Tab`              | Move focus into the group, landing on the checked radio (or first if none checked). |
| `Shift+Tab`        | Move focus backwards out of the group.                         |
| `Arrow Down/Right` | Move selection to the next radio (selection follows focus).    |
| `Arrow Up/Left`    | Move selection to the previous radio.                          |
| `Space`            | Re-select the focused radio.                                   |
| `Home` / `End`     | Move to first / last radio (most browsers).                    |

All provided by the platform. The picker adds zero JS keyboard handlers.

In RTL layout, focus moves visually right-to-left but logically in
source order, so the keyboard contract is unchanged — the browser
handles the visual flip.

## Per-option `lang` attribute

The default rendering wraps each option in `<label lang={tagFor(locale)}>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for that span.

When the consumer overrides the rendering via `children`, the
`tagFor(locale)` helper is exposed so the consumer can carry the
attribute onto whichever element wraps the option:

```tsx
<LocalePicker label="Language" locales={locales}>
    {({ locales, value, setLocale, tagFor, labelFor, name }) =>
        locales.map((l) => (
            <label key={l} lang={tagFor(l)}>
                <input
                    type="radio"
                    name={name}
                    value={l}
                    checked={value === l}
                    onChange={() => setLocale(l)}
                />
                {labelFor(l)}
            </label>
        ))
    }
</LocalePicker>
```

If your `localeLabels` are all in the viewer's language (e.g. all in
English: "English", "French", "Arabic"), the per-option `lang` becomes
technically incorrect — drop it in custom rendering.

## When the consumer overrides children

If the consumer passes a `children` render prop, they take responsibility
for the keyboard contract of whichever pattern they render. Examples:

- **Native `<select>`.** Browser combobox behaviour; carry `lang` on
  each `<option>`.
- **Button group.** `aria-pressed` for state, Tab between buttons. No
  Arrow-key navigation by default.
- **Custom combobox.** APG Combobox pattern — consumer wires arrow keys,
  listbox, focus management.

The picker's outer `<fieldset role="radiogroup">` remains in all cases.

## Focus management

The picker never calls `.focus()` or `.blur()`. Selection changes don't
move focus. This satisfies WCAG 3.2.2 (On Input).

## Live regions

The picker has no `aria-live`. Selection changes propagate through the
native radio's `aria-checked` state, which screen readers announce.

If the consumer wants to announce the locale change separately (e.g.
"Language changed to French"), they wire their own live region:

```tsx
const [announce, setAnnounce] = useState("");
return (
    <>
        <LocalePicker
            onChange={(code) => setAnnounce(`Language changed to ${labelFor(code)}`)}
            {...rest}
        />
        <div role="status" aria-live="polite">{announce}</div>
    </>
);
```

## Visible focus

The picker does not suppress `:focus` or `:focus-visible`. Consumer CSS
supplies the focus ring. A safe AAA-grade default:

```css
.locale-picker-option:focus-within {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The picker performs no animation. Consumer CSS respects
`prefers-reduced-motion`.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS    | Safari    | "{label}, radiogroup" → "{option}, selected, radio button, 1 of N". Per-option `lang` triggers voice switch if matching voice is installed. |
| NVDA       | Windows  | Firefox   | "{label} grouping" → "{option} radio button checked 1 of N". |
| JAWS       | Windows  | Chrome    | "{label} group, {option} radio button checked, 1 of N". |
| TalkBack   | Android  | Chrome    | "{label}, {option}, radio button, 1 of N, double-tap to activate". |

## RTL focus order

In RTL layout, focus moves visually right-to-left but logically in
source order. So Tab still moves through the radios in the order they
appear in `locales`, and Arrow Right (in RTL) moves to the previous
option, not the next. This is the browser's job.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `localeLabels` entries are consumer-supplied; localise the values.
- The picker never emits hardcoded English (or any other natural
  language) strings.

## Common mistakes to avoid (when forking / extending)

- **Don't replace the fieldset with a div.** The `<fieldset>` IS the
  radiogroup; removing it breaks announcement.
- **Don't hide the radio inputs with `display: none`.** Use a
  visually-hidden pattern (`clip-path: inset(50%)`).
- **Don't strip the `name` attribute.** Native radios need a shared
  `name` to group correctly.
- **Don't manage focus manually.** The browser already does it.
- **Don't set `outline: none`.** Visible focus is WCAG AAA.
- **Don't drop the per-option `lang` attribute** unless your labels
  are all in the viewer's language.

## Testing accessibility

- The vitest suite asserts `role="radiogroup"`, `aria-label`, shared
  `name`, per-radio `value`, and per-option `lang`.
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome.
- Automated: axe-core via Playwright (run from a consumer example app).
- Keyboard-only: Tab into the picker, Arrow keys between options, no
  mouse needed.

## References

- WAI-ARIA APG — Radio Group:
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
- MDN — `dir` attribute:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir>
