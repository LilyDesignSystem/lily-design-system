# Accessibility

The select targets WCAG 2.2 AAA. It is an icon button that opens a
dropdown listbox, implementing the WAI-ARIA APG **listbox** pattern —
so the keyboard, focus, and selection semantics are the component's
responsibility, not the browser's.

## Roles and properties

| Element                   | Role / Property                                          | Source        |
| ------------------------- | -------------------------------------------------------- | ------------- |
| `<button>`                | `aria-label={label}`                                      | Consumer prop |
| `<button>`                | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Component  |
| `<span class="theme-chooser-icon">` | `aria-hidden="true"`                             | Component     |
| `<ul>`                    | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` | Component |
| `<ul>`                    | `aria-activedescendant` (only while open)                 | Component     |
| `<li>`                    | `role="option"`, `aria-selected`                          | Component     |
| `<li>`                    | `data-active` on the keyboard-active option               | Component     |

The active option is tracked with `aria-activedescendant` on a focused
listbox — not with roving `tabindex` on the options. Option ids come
from React's `useId`, so they are stable across server and client
render.

## Keyboard contract

Implemented by the component. Nothing is inherited from a native
`<select>`.

On the **button**:

| Key                             | Action                                              |
| ------------------------------- | --------------------------------------------------- |
| `Tab` / `Shift+Tab`             | Move focus to / from the button (one tab stop).     |
| `ArrowDown` / `Enter` / `Space` | Open, with the currently-selected option active (or the first). Focus moves to the listbox. |
| `ArrowUp`                       | Open with the **last** option active. Focus moves to the listbox. |

On the **listbox**:

| Key                     | Action                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends — it does not wrap. |
| `Home` / `End`          | Jump to the first / last option.                               |
| `Enter` / `Space`       | Select the active option, apply it, close, and return focus to the button. |
| `Escape`                | Close and return focus to the button, leaving the value unchanged. |
| `Tab`                   | Close without stealing focus back, so focus moves on normally. |
| Printable character     | Typeahead over the option labels; the buffer accumulates and resets after 500 ms of inactivity. |

Pointer: clicking an option selects it; clicking the button again,
clicking outside the control, or moving focus out of it all close
without changing the value.

## State signals

The active theme is exposed via `data-theme="<slug>"` on the target
element (default `<html>`) — no colour-only meaning is required.

## The tradeoffs this pattern accepts

A button-plus-listbox buys a compact, fully styleable control. It is
not free. Three costs are worth stating plainly before you adopt it.

### 1. An icon-only control depends entirely on `aria-label`

The glyph is `aria-hidden="true"`, so it contributes nothing to the
accessible name. `label` is the **only** name the button has. Omit it,
mistranslate it, or overwrite it via `restProps` and the control becomes
an unnamed button — a WCAG 4.1.2 failure, not a nicety.

Two related hazards:

- If you pass `children` that render visible text, the visible text and
  the announced name can diverge. That is WCAG 2.5.3 (Label in Name).
  Either keep custom glyph content `aria-hidden="true"`, or make `label`
  begin with the visible text.
- An icon-only trigger also has no *visible* label. Sighted users who
  do not recognise the half-circle glyph get no hint of what the button
  does. Pair it with a visible caption, or use `children` to render the
  theme name alongside the glyph.

### 2. A custom listbox has weaker assistive-tech support than `<select>`

A native `<select>` gets platform-level treatment: the OS renders it,
screen readers have decades of special-cased handling for it, and mobile
readers substitute their own picker UI. None of that applies here. A
`<div>`/`<ul>` listbox is announced only as well as its ARIA describes
it, and `aria-activedescendant` support — the mechanism this pattern
relies on to report the active option while focus stays on the list — is
the least uniformly implemented part of ARIA. Expect real differences
across screen reader + browser + OS combinations, especially on mobile.

The component follows the APG listbox pattern faithfully, which is the
best available mitigation, but "follows the spec" is not the same as
"announces identically everywhere". **Test with real screen readers**
(see the smoke-test section below) rather than assuming parity with the
native control it replaced.

### 3. The glyph may not render

`◑` (U+25D1 CIRCLE WITH RIGHT HALF BLACK) is a Unicode geometric shape,
not a bundled icon. Whether it appears depends on the fonts installed on
the user's device. It may render at an unexpected weight or baseline,
fall back to a `.notdef` box, or be missing entirely on stripped-down
systems. The package ships no fonts and no icon assets, by design.

If your product needs certainty about what the button shows, do not rely
on the default: pass `children` and render your own inline SVG (or a
glyph from a font you actually ship). Whatever you render, keep it
`aria-hidden` and let `label` carry the name.

## The status region is the default pattern

The closed button shows only a glyph and announces only `label`. It
never states the theme currently in effect — there is no combobox value
to read, and no selected-option state until the listbox is opened.

**So the select is not shipped alone.** Every example in this package,
and the quick start in [`../index.md`](../index.md), pairs it with a
visible status line:

```tsx
const [theme, setTheme] = useState("");

<ThemeChooser label="Theme" value={theme} onChange={setTheme} {...required} />
<p className="theme-chooser-status" aria-live="polite">
    Active theme: {labelFor(theme)}
</p>
```

That pairing is the pattern to copy. Removing the status line is the
deliberate choice you make against the default — not something you opt
into when you happen to care about accessibility.

Why it is shaped this way:

- **Visible, not `sr-only`.** With an icon-only trigger the active
  theme is invisible to *everyone*, not just to screen-reader users. A
  visible line serves sighted users and cognitive accessibility, and
  AAA favours showing state over hiding it (WCAG 1.4.1 — no
  colour-only meaning). Teams that truly cannot spare the line should
  hide the element with the visually-hidden recipe in
  [styling.md](./styling.md) and keep it in the DOM.
- **`aria-live="polite"`, not `role="alert"`.** A polite live region
  announces *mutations*, so it is silent on first paint and speaks once
  per user-initiated change, without moving focus (WCAG 3.2.2).
- **Human label, not the raw slug.** Show `labelFor(slug)` /
  your `themeLabels` value, so the line reads "Active theme: Dark"
  rather than "Active theme: dark".

**Honest limits.** A status region does not restore what an icon-only
trigger costs. The button's *own* accessible name is still just
`label`, so a user who tabs back to the control later — rather than
being present for the change announcement — hears "Theme", not "Dark".
A live region announces transitions; it does not give the button a
queryable value. The status text is the only durable record on screen,
which is another reason to keep it visible.

If your product needs the control itself to report its value, use
`children` to render the active theme's label inside the button
(`labelFor(value)`) and extend `label` to match, so the visible text and
the accessible name agree.

The region's copy stays the consumer's to own — the helper does not
render one, because only the consumer knows the surrounding wording and
locale.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring. NHS-UK and
Lily™ themes ship a high-contrast focus outline that meets AAA.

Two elements take focus, so style both: the `.theme-chooser-button` and
the `.theme-chooser-list` (which receives focus while open). Style
`[data-active]` on the options too — with `aria-activedescendant` the
options never receive real DOM focus, so `:focus-visible` will never
match them and the user would otherwise have no visual cue for what
`Enter` is about to select.

## Reduced motion

The select performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## Screen-reader smoke test

This matters more here than it did with a native `<select>` — see
tradeoff 2 above. Check, at minimum:

- The closed button announces as "{label}, button, collapsed" (wording
  varies by reader). It should **not** announce the glyph.
- Activating it announces the listbox and its `label`, and reads the
  active option.
- `ArrowDown` / `ArrowUp` announce each newly-active option as it
  changes — this is the `aria-activedescendant` path, and the most
  likely thing to be weak or silent on a given reader.
- `Escape` returns you to the button and re-announces it.
- Selection changes are **not** announced by the control itself. Verify
  the `.theme-chooser-status` region instead — it should speak once per
  change and stay silent on load.

Cover VoiceOver + Safari, NVDA + Firefox, and JAWS + Chrome. If a
combination announces the active option poorly, the status region is
what keeps the control usable there.

## React 19 specifics

- The select file is a client component (`"use client"`). The
  consumer file importing the select must also be a client component
  if it manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The select's
  `initialisedRef` guards against double-application; tests should
  cover the StrictMode path.

## Common mistakes to avoid

- **Rendering visible text in `children` without `aria-hidden`.** The
  visible text and the `aria-label` then disagree — WCAG 2.5.3.
- **Removing or overriding the `aria-label`.** It is the *only*
  accessible name the control has; without it the button is unnamed.
- **Assuming the glyph will render.** Ship your own SVG via `children`
  if the visual must be certain.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `outline: none` in CSS.** Visible focus is a WCAG AAA
  requirement — on the button *and* the listbox. Don't strip it.
- **Styling only `:focus-visible` on the options.** They never take DOM
  focus; style `[data-active]` instead.
- **Shipping without a screen-reader pass.** A custom listbox earns no
  free pass from the platform.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- MDN — `aria-haspopup`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>

---

Lily™ and Lily Design System™ are trademarks.
