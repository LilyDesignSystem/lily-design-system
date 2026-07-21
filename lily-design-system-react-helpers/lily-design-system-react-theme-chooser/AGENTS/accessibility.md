# AGENTS / accessibility — ThemeChooser

Accessibility contract specific to `ThemeChooser`. Read
[`../docs/accessibility.md`](../docs/accessibility.md) for the
consumer-facing guide; this file is the AI-coding contract.

## Implemented

| WCAG / APG item | How the select satisfies it                                |
| --------------- | ---------------------------------------------------------- |
| APG Listbox pattern      | Button (`aria-haspopup="listbox"`) + `<ul role="listbox">` with `aria-activedescendant`. |
| WCAG 2.1.1 Keyboard      | Component-implemented: open keys, Arrow / Home / End, commit, dismiss, typeahead. |
| WCAG 2.4.7 Focus Visible | Browser default; helper never sets `outline: none`.  |
| WCAG 4.1.2 Name, Role, Value | `aria-label` on button + listbox, `aria-expanded`, `aria-selected`. |
| WCAG 1.4.1 Use of Color  | State conveyed via `aria-selected`, `data-active`, and `data-theme`. |
| WCAG 3.2.2 On Input      | Committing returns focus to the trigger — a predictable, user-initiated move, not a context change. |

## Roles and properties

| Element     | Attribute                          | Source        |
| ----------- | ---------------------------------- | ------------- |
| `<div>`     | class hook `theme-chooser`          | Component     |
| `<input type="hidden">` | `name`, `value`        | Component     |
| `<button>`  | `aria-label={label}`               | Consumer prop |
| `<button>`  | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Component |
| `<span class="theme-chooser-icon">` | `aria-hidden="true"` | Component |
| `<ul>`      | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` | Component |
| `<ul>`      | `aria-activedescendant` (while open only) | Component |
| `<li>`      | `role="option"`, `aria-selected`, `data-active` | Component |

The component never adds:

- `aria-pressed` — selection state lives on `aria-selected`.
- A roving `tabindex` over the options — the listbox itself takes focus
  and `aria-activedescendant` tracks the active option.

Ids for the listbox and every option derive from `useId`, so they are
stable across SSR and hydration.

## Keyboard contract

On the **button**:

| Key                             | Action                                                    |
| ------------------------------- | --------------------------------------------------------- |
| `Tab` / `Shift+Tab`             | Move focus to / from the button (one tab stop).           |
| `ArrowDown` / `Enter` / `Space` | Open with the selected option active (else index 0); focus moves to the listbox. |
| `ArrowUp`                       | Open with the **last** option active; focus moves to the listbox. |

On the **listbox**:

| Key                     | Action                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends — no wrapping.        |
| `Home` / `End`          | Jump to the first / last option.                                 |
| `Enter` / `Space`       | Select the active option, apply, close, return focus to button.  |
| `Escape`                | Close and return focus to the button; value unchanged.           |
| `Tab`                   | Close without stealing focus back.                               |
| Printable character     | Typeahead over the labels; buffer resets after 500 ms idle.      |

Pointer: clicking an option selects it; clicking the button again,
clicking outside, or focus leaving the root closes without changing the
value.

## When the consumer overrides children

The `children` render prop replaces **only the glyph inside the
button**. The keyboard contract, the options, and every ARIA attribute
stay with the component, so overriding children cannot break the
pattern.

The one thing a consumer can break: putting a visible, non-`aria-hidden`
label inside the button changes nothing about the accessible name
(`aria-label` wins), which can leave the visible text and the announced
name out of sync — a WCAG 2.5.3 (Label in Name) hazard. Keep custom
glyph content `aria-hidden="true"`, or make `label` start with the
visible text.

## Focus management

The component moves focus deliberately in exactly two places:

- Opening the listbox moves focus from the button to the `<ul>`.
- Committing a selection or pressing `Escape` returns focus to the
  button.

`Tab`, an outside click, and focus leaving the root all close the list
without moving focus, so the user's own focus travel is never
interrupted.

## Live regions

The component has no `aria-live`. The closed button shows only a glyph
and announces only `label`, so it never states the active theme.
Consumers who want the active theme announced or displayed wire their
own status region — see [`../docs/accessibility.md`](../docs/accessibility.md):

```tsx
const [announce, setAnnounce] = useState("");
return (
    <>
        <ThemeChooser
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
.theme-chooser-button:focus-visible,
.theme-chooser-list:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

The listbox takes focus while open, so it needs a focus style too — and
the active option needs a visible `[data-active]` treatment, since
that is what the user is actually moving.

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce transitions
on the `data-theme` swap.

## Screen-reader behaviour

| Reader     | OS       | Browser   | What's announced when user lands on the control |
| ---------- | -------- | --------- | ------------------------------------------------ |
| VoiceOver  | macOS    | Safari    | "{label}, pop-up button, collapsed" → on open, "{label}, list box" → "{option}, selected". |
| NVDA       | Windows  | Firefox   | "{label} button collapsed" → on open, "{label} list box" → "{option} N of M". |
| JAWS       | Windows  | Chrome    | "{label} button" → on open, "{label} list box, {option}, N of M". |
| TalkBack   | Android  | Chrome    | "{label}, button, double-tap to activate" → list items read individually. |

Verify these by hand — a custom listbox does not get the platform-level
treatment a native `<select>` does, and `aria-activedescendant` support
varies across reader + browser combinations. The button never announces
the active theme (it holds only an `aria-hidden` glyph), so pair it with
a status region if the value must be discoverable on focus.

## i18n

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The select never emits hardcoded English (or any other natural
  language), including the word "default".

## Common mistakes to avoid (when forking / extending)

- **Don't drop the `aria-hidden` on the glyph.** A decorative glyph in
  the accessible name tree produces announcements like "black circle
  button".
- **Don't remove the `aria-label`.** It is the *only* accessible name
  the control has — the glyph supplies none.
- **Don't give the options a real `tabindex`.** The pattern is
  `aria-activedescendant` on a focused listbox, not roving focus;
  mixing the two breaks both.
- **Don't drop `aria-activedescendant` on close.** It is set only while
  open; a stale value points at an option inside a `hidden` subtree.
- **Don't set `outline: none`** on the button or the listbox. Both take
  focus, and visible focus is a WCAG AAA requirement.
- **Don't reintroduce a native `<select>` alongside this.** Pick one
  control; two overlapping ones double-announce.

## Testing accessibility

- The vitest suite asserts the button/listbox wiring (`aria-haspopup`,
  `aria-expanded`, `aria-controls`, `aria-label` on both), the
  `aria-hidden` glyph, `aria-selected`, `data-active`, and the full
  keyboard contract (§7.14–§7.18).
- Manual: VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome. Manual
  passes matter more here than they did with a native `<select>` —
  see the screen-reader table above.
- Automated: axe-core via Playwright (run from the example app).
- Keyboard-only: Tab to the button, open, Arrow between options,
  `Enter` to commit, `Escape` to dismiss — no mouse needed.
