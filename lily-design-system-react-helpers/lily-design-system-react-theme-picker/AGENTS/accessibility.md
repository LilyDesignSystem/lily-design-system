# AGENTS / accessibility — ThemePicker

Accessibility contract specific to `ThemePicker`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item | How the picker satisfies it                                |
| --------------- | ---------------------------------------------------------- |
| WAI-ARIA APG Radio Group | `<fieldset role="radiogroup" aria-label>` + native radios. |
| WCAG 2.1.1 Keyboard      | Tab / Arrow / Space — native radio semantics.        |
| WCAG 2.4.7 Focus Visible | Browser default; helper never sets `outline: none`.  |
| WCAG 4.1.2 Name, Role, Value | `role="radiogroup"`, `aria-label`, `aria-checked` (implicit). |
| WCAG 1.4.1 Use of Color  | State conveyed via `aria-checked`, `data-theme`, controlled value. |
| WCAG 3.2.2 On Input      | Focus is never moved by the picker on change.         |

## Roles and properties

| Element                    | Attribute               | Source            |
| -------------------------- | ----------------------- | ----------------- |
| `<fieldset>`               | `role="radiogroup"`     | Component         |
| `<fieldset>`               | `aria-label={label}`    | Consumer prop     |
| `<input type="radio">`     | implicit `role="radio"` | Browser           |
| `<input type="radio">`     | implicit `aria-checked` | Browser           |
| `<input type="radio">` × N | shared `name`           | Component         |

The component never adds:

- `aria-pressed` (radios use `aria-checked`).
- Roving `tabindex`. Native radios already do this — only the
  checked one is in the tab order; arrows move within the group.
- `aria-activedescendant`. Not needed — focus is the source of
  truth.
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

All provided by the platform. The picker adds zero JS keyboard
handlers.

## When the consumer overrides children

If the consumer passes a `children` render prop, they take
responsibility for the keyboard contract of whichever pattern they
render. Examples:

- **Button group.** `aria-pressed` for state, Tab between
  buttons. No Arrow-key navigation by default.
- **Native `<select>`.** Browser-default combobox behaviour.
- **Custom combobox.** APG Combobox pattern — consumer wires
  arrow keys, listbox, focus management.

The picker's outer `<fieldset role="radiogroup">` remains. If the
consumer also wants to drop the radiogroup role, they can re-render
the picker's structure entirely outside it and call `setTheme`
imperatively from a wrapper — but this is rare and unusual.

## Focus management

The picker never calls `.focus()` or `.blur()`. The focused element
on each render is whichever the browser puts focus on.

This satisfies WCAG 3.2.2 (On Input): changing the radio selection
must not cause a focus or context change.

## Live regions

The picker has no `aria-live`. Selection changes propagate through
the native radio's `aria-checked` state, which screen readers
announce automatically.

If the consumer wants to announce the theme change separately (e.g.
"Theme changed to dark"), they wire their own live region:

```tsx
const [announce, setAnnounce] = useState("");
return (
    <>
        <ThemePicker
            onChange={(slug) => setAnnounce(`Theme changed to ${slug}`)}
            {...rest}
        />
        <div role="status" aria-live="polite">{announce}</div>
    </>
);
```

## Visible focus

The picker does not suppress `:focus` or `:focus-visible`. The
consumer's CSS supplies the focus ring. NHS-UK and Lily themes
ship a high-contrast focus outline that meets AAA.

```css
.theme-picker-option:focus-within {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The picker performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce transitions
on the `data-theme` swap.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS    | Safari    | "{label}, radiogroup" → "{option}, selected, radio button, 1 of N". |
| NVDA       | Windows  | Firefox   | "{label} grouping" → "{option} radio button checked 1 of N". |
| JAWS       | Windows  | Chrome    | "{label} group, {option} radio button checked, 1 of N". |
| TalkBack   | Android  | Chrome    | "{label}, {option}, radio button, 1 of N, double-tap to activate". |

Selection changes are announced because the underlying control
state (checked) changes.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The picker never emits hardcoded English (or any other natural
  language), including the word "default".

## Common mistakes to avoid (when forking / extending)

- **Don't replace the fieldset with a div.** The `<fieldset>` IS
  the radiogroup; removing it breaks announcement.
- **Don't hide the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern.
- **Don't strip the `name` attribute.** Native radios need a shared
  `name` to group correctly.
- **Don't manage focus manually.** The browser already does it
  correctly.
- **Don't set `outline: none` anywhere on the picker's elements.**
  Visible focus is a WCAG AAA requirement.

## Testing accessibility

- The vitest suite asserts `role="radiogroup"`, `aria-label`,
  shared `name`, and per-radio `value`.
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome.
- Automated: axe-core via Playwright (run from the example app).
- Keyboard-only: Tab into the picker, Arrow keys between options,
  no mouse needed.
