# AGENTS / accessibility — ThemeSelect

Accessibility contract specific to `ThemeSelect`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item | How the select satisfies it                                |
| --------------- | ---------------------------------------------------------- |
| Native `<select>` | `<select aria-label>` + native `<option>` elements.      |
| WCAG 2.1.1 Keyboard      | Tab / Arrow / Home / End / typeahead — native select semantics. |
| WCAG 2.4.7 Focus Visible | Browser default; helper never sets `outline: none`.  |
| WCAG 4.1.2 Name, Role, Value | implicit `role="combobox"`, `aria-label`, selected state. |
| WCAG 1.4.1 Use of Color  | State conveyed via the selected option and `data-theme`. |
| WCAG 3.2.2 On Input      | Focus is never moved by the select on change.         |

## Roles and properties

| Element     | Attribute                  | Source        |
| ----------- | -------------------------- | ------------- |
| `<select>`  | implicit `role="combobox"` | Browser       |
| `<select>`  | `aria-label={label}`       | Consumer prop |
| `<select>`  | `name`                     | Component     |
| `<option>`  | implicit `role="option"`   | Browser       |
| `<option>`  | implicit selected state    | Browser       |

The component never adds:

- `aria-pressed` (the select uses native selected state).
- `aria-activedescendant`. Not needed — the native select handles it.
- A focus management API. The browser handles it.

## Keyboard contract

| Key                  | Action                                        |
| -------------------- | --------------------------------------------- |
| `Tab` / `Shift+Tab`  | Move focus to / from the select (one tab stop). |
| `Arrow Down`         | Select the next option.                       |
| `Arrow Up`           | Select the previous option.                   |
| `Home` / `End`       | Select the first / last option.               |
| Typeahead            | Type characters to jump to a matching option. |
| `Enter` / `Space`    | Open the option list (platform-dependent).    |
| `Escape`             | Close the option list.                        |

All provided by the platform. The select adds zero JS keyboard
handlers.

## When the consumer overrides children

The `children` render prop renders inside the `<select>`, so it should
return `<option>` / `<optgroup>` elements; the native keyboard contract
still applies.

If the consumer wants a fundamentally different control (button group,
segmented control, custom combobox), they render it outside the select
and call `setTheme` imperatively — and they take responsibility for the
keyboard contract of whichever pattern they build:

- **Button group.** `aria-pressed` for state, Tab between
  buttons. No Arrow-key navigation by default.
- **Custom combobox.** APG Combobox pattern — consumer wires
  arrow keys, listbox, focus management.

## Focus management

The select never calls `.focus()` or `.blur()`. The focused element
on each render is whichever the browser puts focus on.

This satisfies WCAG 3.2.2 (On Input): changing the selected option
must not cause a focus or context change.

## Live regions

The select has no `aria-live`. Selection changes propagate through
the native select's value change, which screen readers announce
automatically.

If the consumer wants to announce the theme change separately (e.g.
"Theme changed to dark"), they wire their own live region:

```tsx
const [announce, setAnnounce] = useState("");
return (
    <>
        <ThemeSelect
            onChange={(slug) => setAnnounce(`Theme changed to ${slug}`)}
            {...rest}
        />
        <div role="status" aria-live="polite">{announce}</div>
    </>
);
```

## Visible focus

The select does not suppress `:focus` or `:focus-visible`. The
consumer's CSS supplies the focus ring. NHS-UK and Lily themes
ship a high-contrast focus outline that meets AAA.

```css
.theme-select:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce transitions
on the `data-theme` swap.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the control |
| ---------- | -------- | --------- | ------------------------------------------------ |
| VoiceOver  | macOS    | Safari    | "{label}, pop-up button" → "{option}, selected, N of M". |
| NVDA       | Windows  | Firefox   | "{label} combo box" → "{option} N of M". |
| JAWS       | Windows  | Chrome    | "{label} combo box, {option}, N of M". |
| TalkBack   | Android  | Chrome    | "{label}, drop-down list, {option}, N of M, double-tap to activate". |

Selection changes are announced because the select's value changes.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The select never emits hardcoded English (or any other natural
  language), including the word "default".

## Common mistakes to avoid (when forking / extending)

- **Don't replace the `<select>` with a div.** The native `<select>`
  IS the accessible control; removing it breaks announcement and
  keyboard support.
- **Don't return non-`<option>` children from `children`.** They render
  inside the `<select>`, which only accepts `<option>` / `<optgroup>`.
- **Don't remove the `aria-label`.** It is the select's accessible
  name.
- **Don't manage focus manually.** The browser already does it
  correctly.
- **Don't set `outline: none` on the select.** Visible focus is a
  WCAG AAA requirement.

## Testing accessibility

- The vitest suite asserts the `<select>` (implicit `combobox` role),
  `aria-label`, `name`, and per-option `value`.
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome.
- Automated: axe-core via Playwright (run from the example app).
- Keyboard-only: Tab into the select, Arrow keys between options,
  no mouse needed.
