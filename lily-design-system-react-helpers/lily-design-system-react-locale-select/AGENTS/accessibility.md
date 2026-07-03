# AGENTS / accessibility — LocaleSelect

Accessibility contract specific to `LocaleSelect`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item                | How the select satisfies it                              |
| ------------------------------ | -------------------------------------------------------- |
| WCAG 3.1.1 Language of Page    | Writes `lang` to the document root on every locale apply. |
| WCAG 3.1.2 Language of Parts   | Each `<option>` carries its own `lang`.                  |
| WCAG 1.4.10 Reflow (RTL bidi)  | Writes `dir="rtl"` for RTL locales (skipped when `applyDir={false}`). |
| WCAG 4.1.2 Name, Role, Value   | `<select aria-label>` (implicit `combobox`) + native `<option>`s. |
| WCAG 2.1.1 Keyboard            | Tab / Arrow / Home / End / typeahead — native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible       | Browser default focus ring preserved; helper never sets `outline: none`. |
| WCAG 1.4.1 Use of Color        | State conveyed via the native selected state, `lang`/`dir` attrs, controlled value. |
| WCAG 3.2.2 On Input            | Focus is never moved by the select on locale change.     |
| MDN — `<select>` element       | Native single-select combobox with shared `name`.        |

## Roles and properties

| Element             | Attribute               | Source            |
| ------------------- | ----------------------- | ----------------- |
| `<select>`          | implicit `role="combobox"` | Browser        |
| `<select>`          | `aria-label={label}`    | Consumer prop     |
| `<select>`          | `name`                  | Component         |
| `<option>`          | `lang={tagFor(locale)}` | Component         |
| `<option>`          | implicit `role="option"` | Browser          |
| `<html>` (target)   | `lang` (BCP 47)         | Component effect  |
| `<html>` (target)   | `dir="rtl"\|"ltr"`      | Component effect  |

The component never adds:

- `aria-pressed` (the native `<select>` exposes its own selected state).
- Roving `tabindex`. The native `<select>` is a single tab stop and
  manages option navigation itself.
- `aria-activedescendant`. The native `<select>` is the source of truth.
- A focus management API. The browser handles it.

## Keyboard contract

| Key                | Action                                                         |
| ------------------ | -------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / from the select (one tab stop).               |
| `Arrow Down`       | Select the next option.                                        |
| `Arrow Up`         | Select the previous option.                                    |
| `Home` / `End`     | Select the first / last option.                                |
| Typeahead          | Type to jump to a matching option.                             |
| `Enter` / `Space`  | Open the option list (platform-dependent).                     |
| `Escape`           | Close the option list.                                         |

All provided by the platform. The select adds zero JS keyboard handlers.

In RTL layout, the native `<select>` and its list mirror automatically,
so the keyboard contract is unchanged — the browser handles the visual
flip.

## Per-option `lang` attribute

The default rendering carries each `<option lang={tagFor(locale)}>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for that option.

When the consumer overrides the rendering via `children`, the
`tagFor(locale)` helper is exposed so the consumer can carry the
attribute onto each custom `<option>`:

```tsx
<LocaleSelect label="Language" locales={locales}>
    {({ locales, value, setLocale, tagFor, labelFor }) => (
        <select
            className="locale-select"
            value={value}
            onChange={(e) => setLocale(e.currentTarget.value)}
        >
            {locales.map((l) => (
                <option key={l} className="locale-select-option" value={l} lang={tagFor(l)}>
                    {labelFor(l)}
                </option>
            ))}
        </select>
    )}
</LocaleSelect>
```

If your `localeLabels` are all in the viewer's language (e.g. all in
English: "English", "French", "Arabic"), the per-option `lang` becomes
technically incorrect — drop it in custom rendering.

## When the consumer overrides children

If the consumer passes a `children` render prop, they take responsibility
for the keyboard contract of whichever pattern they render. Examples:

- **Custom `<select>`.** Browser combobox behaviour; carry `lang` on
  each `<option>`.
- **Button group.** `aria-pressed` for state, Tab between buttons. No
  Arrow-key navigation by default.
- **Custom combobox.** APG Combobox pattern — consumer wires arrow keys,
  listbox, focus management.

The render prop output goes inside the component's `<select>` in all
cases.

## Focus management

The select never calls `.focus()` or `.blur()`. Selection changes don't
move focus. This satisfies WCAG 3.2.2 (On Input).

## Live regions

The select has no `aria-live`. Selection changes propagate through the
native `<select>`'s selected state, which screen readers announce.

If the consumer wants to announce the locale change separately (e.g.
"Language changed to French"), they wire their own live region:

```tsx
const [announce, setAnnounce] = useState("");
return (
    <>
        <LocaleSelect
            onChange={(code) => setAnnounce(`Language changed to ${labelFor(code)}`)}
            {...rest}
        />
        <div role="status" aria-live="polite">{announce}</div>
    </>
);
```

## Visible focus

The select does not suppress `:focus` or `:focus-visible`. Consumer CSS
supplies the focus ring. A safe AAA-grade default:

```css
.locale-select:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The select performs no animation. Consumer CSS respects
`prefers-reduced-motion`.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS    | Safari    | "{label}, pop-up button, {option}" → on open, "{option}, 1 of N". Per-option `lang` triggers voice switch if matching voice is installed. |
| NVDA       | Windows  | Firefox   | "{label} combo box, {option}, 1 of N". |
| JAWS       | Windows  | Chrome    | "{label} combo box, {option}, 1 of N". |
| TalkBack   | Android  | Chrome    | "{label}, {option}, drop-down list, 1 of N, double-tap to activate". |

## RTL focus order

In RTL layout, the native `<select>` and its option list mirror
automatically. The options stay in the order they appear in `locales`;
the browser handles the visual flip. This is the browser's job.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `localeLabels` entries are consumer-supplied; localise the values.
- The select never emits hardcoded English (or any other natural
  language) strings.

## Common mistakes to avoid (when forking / extending)

- **Don't replace the `<select>` with a div.** The native `<select>` IS
  the combobox; removing it breaks announcement and keyboard support.
- **Don't hide the `<option>`s.** Native `<option>` styling is limited;
  style the `<select>` and rely on the OS select for the open list.
- **Don't strip the `name` attribute.** It identifies the control in a
  submitted form.
- **Don't manage focus manually.** The browser already does it.
- **Don't set `outline: none`.** Visible focus is WCAG AAA.
- **Don't drop the per-option `lang` attribute** unless your labels
  are all in the viewer's language.

## Testing accessibility

- The vitest suite asserts the `<select>` (implicit `combobox`),
  `aria-label`, the `name`, per-option `value`, and per-option `lang`.
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome.
- Automated: axe-core via Playwright (run from a consumer example app).
- Keyboard-only: Tab to the select, Arrow keys between options, no
  mouse needed.

## References

- MDN — `<select>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
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
