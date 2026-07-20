# AGENTS / accessibility — LocaleSelect

Accessibility contract specific to `LocaleSelect`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item                | How the select satisfies it                              |
| ------------------------------ | -------------------------------------------------------- |
| WCAG 3.1.1 Language of Page    | Writes `lang` to the document root on every locale apply. |
| WCAG 3.1.2 Language of Parts   | Each `<li role="option">` carries its own `lang`.        |
| WCAG 1.4.10 Reflow (RTL bidi)  | Writes `dir="rtl"` for RTL locales (skipped when `applyDir={false}`). |
| WCAG 4.1.2 Name, Role, Value   | `<button aria-label aria-haspopup="listbox" aria-expanded aria-controls>` + `<ul role="listbox">` with `aria-selected` options. |
| WCAG 2.1.1 Keyboard            | Full APG Listbox keyboard contract, implemented by the component. |
| WCAG 2.4.7 Focus Visible       | Browser default focus ring preserved on the button and the list; helper never sets `outline: none`. |
| WCAG 1.4.1 Use of Color        | State conveyed via `aria-selected`, `data-active`, `lang`/`dir` attrs, controlled value. |
| WCAG 3.2.2 On Input            | Selecting a locale returns focus to the button the user was already on; no context change. |
| WAI-ARIA APG — Listbox         | The pattern this control implements.                     |

## Roles and properties

| Element                      | Attribute                                  | Source            |
| ---------------------------- | ------------------------------------------ | ----------------- |
| root `<div class="locale-select">` | rest props                           | Consumer          |
| `<input type="hidden">`      | `name`, `value`                            | Component         |
| `<button class="locale-select-button">` | `type="button"`                 | Component         |
| same                         | `aria-label={label}`                       | Consumer prop     |
| same                         | `aria-haspopup="listbox"`                  | Component         |
| same                         | `aria-expanded`                            | Component state   |
| same                         | `aria-controls={listId}`                   | Component (`useId`) |
| `<span class="locale-select-icon">` | `aria-hidden="true"`                | Component         |
| `<ul class="locale-select-list">` | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` | Component |
| same                         | `aria-activedescendant` (only while open)  | Component state   |
| `<li class="locale-select-option">` | `role="option"`, `id`               | Component         |
| same                         | `aria-selected`                            | Component state   |
| same                         | `data-active` (consumer CSS hook)          | Component state   |
| same                         | `lang={tagFor(locale)}`                    | Component         |
| `<html>` (target)            | `lang` (BCP 47)                            | Component effect  |
| `<html>` (target)            | `dir="rtl"\|"ltr"`                         | Component effect  |

The component never adds:

- A `lang` on the button or the list. Only options carry one.
- A roving `tabindex` across options. The `<ul>` holds focus and
  `aria-activedescendant` names the active option.
- `aria-live` on the control (see "Live regions" below).
- `aria-pressed`. `aria-selected` on the options carries the state.

## Keyboard contract

Implemented by the component; nothing here comes from the platform.

On the **button**:

| Key                             | Action                                                 |
| ------------------------------- | ------------------------------------------------------ |
| `Tab` / `Shift+Tab`             | Move focus to / from the button (the only tab stop when closed). |
| `ArrowDown` / `Enter` / `Space` | Open with the selected option active (index 0 if none); focus moves to the list. |
| `ArrowUp`                       | Open with the **last** option active; focus moves to the list. |

On the **listbox** (while open):

| Key                       | Action                                                       |
| ------------------------- | ------------------------------------------------------------ |
| `ArrowDown` / `ArrowUp`   | Move the active option; **clamps** at the ends, no wrapping.  |
| `Home` / `End`            | Jump to the first / last option.                             |
| `Enter` / `Space`         | Select the active option, apply, close, return focus to the button. |
| `Escape`                  | Close and return focus to the button; value unchanged.       |
| `Tab`                     | Close without stealing focus back.                           |
| Printable character       | Typeahead over the option **labels**; 500 ms buffer reset.   |

Pointer: clicking an option selects it; clicking the button toggles;
clicking outside, or focus leaving the root, closes without changing
the value.

In RTL layout the keyboard contract is unchanged — `ArrowDown` and
`ArrowUp` follow the list's DOM order, and the visual flip is CSS.

## Per-option `lang` attribute

Each `<li role="option" lang={tagFor(locale)}>` satisfies WCAG 3.1.2
(Language of Parts): when a screen reader encounters the option
"Français" inside an English page, the `lang` attribute makes the
reader switch to a French voice for that option.

The component always emits this — there is no render prop that removes
it, because `children` only replaces the button glyph. If your
`localeLabels` are all in the viewer's language (e.g. all in English:
"English", "French", "Arabic"), the per-option `lang` is technically
incorrect. That is a known limitation of the fixed markup; prefer
endonym labels (`Français`, `العربية`) so the attribute stays truthful.

## When the consumer overrides children

`children` replaces the glyph **inside** the button and receives
`{ value, open, labelFor }`. It cannot change the button, the listbox,
or the options, so the consumer never inherits the keyboard contract.
Their only accessibility responsibility is the glyph itself:

- Mark it `aria-hidden="true"`. The button is already named by
  `aria-label={label}`; unhidden glyph content is announced twice.
- Do not put interactive elements inside it — it lives inside a
  `<button>`, so nested controls are invalid HTML.
- If the glyph shows the active language (a short code, an endonym),
  that is a genuine accessibility *win*: it partially offsets the
  icon-only tradeoff described in
  [`../docs/accessibility.md`](../docs/accessibility.md).

## Focus management

The component moves focus deliberately, in exactly two places:

- On open, focus moves from the button to the `<ul>`.
- On select / `Escape` / button toggle, focus returns to the button.

`Tab`, outside clicks, and focus-out close the list without recalling
focus, because the user has already chosen where focus goes. Focus
always ends on the button the user started from, so WCAG 3.2.2
(On Input) holds.

## Live regions

The control has no `aria-live`. The closed button shows only a glyph
and never announces the active language, so a status region beside the
control is the recommended pairing — see
[`../docs/accessibility.md`](../docs/accessibility.md):

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
.locale-select-button:focus-visible,
.locale-select-list:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

Because the `<ul>` — not the option — holds focus, also give the active
option a non-colour-only treatment so sighted keyboard users can track
the cursor:

```css
.locale-select-option[data-active] {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
```

## Reduced motion

The select performs no animation. Consumer CSS respects
`prefers-reduced-motion`.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the button |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS    | Safari    | "{label}, pop up button, collapsed" → on open, "{label}, list box" then the active option. The active locale is **not** announced while collapsed. |
| NVDA       | Windows  | Firefox   | "{label} button, collapsed" → on open, "{label} list box, {option}, N of M". |
| JAWS       | Windows  | Chrome    | "{label} button, collapsed" → on open, "{label} list box, {option}". |
| TalkBack   | Android  | Chrome    | "{label}, button, double-tap to activate" → on open, the list and active option. |

Two caveats versus a native `<select>`:

- **Collapsed state announces no value.** The glyph is `aria-hidden` and
  there is no combobox value, so the active language is unannounced
  until the list is opened. This is the main reason for the status-region
  pattern.
- **`aria-activedescendant` support varies.** A custom listbox depends
  on the reader tracking active-descendant changes correctly, which is
  less uniform across reader + browser combinations than the
  platform-level treatment a native `<select>` receives. Retest on a
  real reader after any change to open/close or active-index handling.

## RTL focus order

Options stay in the order they appear in `locales`; the visual flip is
CSS (`dir="rtl"` on an ancestor). `ArrowDown` / `ArrowUp` always follow
DOM order, which is what APG specifies for a vertical listbox.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `localeLabels` entries are consumer-supplied; localise the values.
- The select never emits hardcoded English (or any other natural
  language) strings.

## Common mistakes to avoid (when forking / extending)

- **Don't drop `aria-label`.** The glyph is `aria-hidden`, so `label`
  is the button's only accessible name. A nameless icon button fails
  WCAG 4.1.2.
- **Don't put `role="option"` elements outside the `role="listbox"`.**
  The listbox must be the direct owner of its options.
- **Don't focus the options.** The `<ul>` holds focus and
  `aria-activedescendant` names the active option. Mixing the two
  models breaks announcement.
- **Don't drop `aria-activedescendant` when the list closes.** A stale
  active descendant confuses readers; the component clears it.
- **Don't hide the list with `display: none` transitions that outlive
  the state change.** Open/close is the `hidden` attribute; keep CSS in
  step with it.
- **Don't strip the hidden input's `name`.** It identifies the control
  in a submitted form.
- **Don't set `outline: none`.** Visible focus is WCAG AAA — on the
  button, on the list, and on the `data-active` option.
- **Don't drop the per-option `lang` attribute.**

## Testing accessibility

- The vitest suite asserts the button's `aria-haspopup` /
  `aria-expanded` / `aria-controls`, the `aria-hidden` glyph, the
  listbox role and `aria-label`, per-option `role` / `aria-selected` /
  `lang` / `data-active`, `aria-activedescendant` movement and
  clamping, focus transfer on open and close, and the typeahead.
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome. Manual
  passes matter more here than they did for the native `<select>` — see
  the caveats in the matrix above.
- Automated: axe-core via Playwright (run from a consumer example app).
- Keyboard-only: Tab to the button, open, arrow to an option, `Enter`,
  confirm focus lands back on the button. No mouse needed.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
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
