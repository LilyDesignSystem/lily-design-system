# Accessibility

The select targets WCAG 2.2 AAA and uses the platform's native
`<select>` combobox, so the keyboard, focus, and selection semantics
come from the browser.

## Roles and properties

| Element        | Role / Property         | Source        |
| -------------- | ----------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser    |
| `<select>`     | `aria-label={label}`    | Consumer prop |
| `<option>`     | implicit `role="option"` | Browser      |
| `<option>`     | implicit selected state | Browser       |

The select does not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no manual focus management — the
native `<select>` behaviour is the accessible baseline. The accessible
name of the control comes from `aria-label` on the `<select>`.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                        |
| -------------------- | --------------------------------------------- |
| `Tab` / `Shift+Tab`  | Move focus to / from the select (one tab stop). |
| `Arrow Down`         | Select the next option.                       |
| `Arrow Up`           | Select the previous option.                   |
| `Home` / `End`       | Select the first / last option.               |
| Typeahead            | Type characters to jump to a matching option. |
| `Enter` / `Space`    | Open the option list (platform-dependent).    |
| `Escape`             | Close the option list.                        |

## State signals

The active theme is exposed via `data-theme="<slug>"` on the target
element (default `<html>`) — no colour-only meaning is required.

### The status region is the default pattern

The `<select>` always displays its placeholder option, so its own
`value` stays empty and never tracks the selection. That keeps the
control narrow, but it costs something real: a screen-reader user
focusing the control hears "{placeholder ?? label}" rather than the
name of the theme currently in effect, and there is no longer a
selected-option state to announce.

**So the select is not shipped alone.** Every example in this package,
and the quick start in `index.md`, pairs it with a visible status line:

```tsx
const [theme, setTheme] = useState("");

<ThemeSelect label="Theme" value={theme} onChange={setTheme} {...required} />
<p className="theme-select-status" aria-live="polite">
    Active theme: {labelFor(theme)}
</p>
```

That pairing is the pattern to copy. Removing the status line is the
deliberate choice you make against the default — not something you opt
into when you happen to care about accessibility.

Why it is shaped this way:

- **Visible, not `sr-only`.** Once the control snaps back to the
  placeholder the active theme is invisible to *everyone*, not just to
  screen-reader users. A visible line serves sighted users and
  cognitive accessibility, and AAA favours showing state over hiding
  it (WCAG 1.4.1 — no colour-only meaning). Teams that truly cannot
  spare the line should hide the element with the visually-hidden
  recipe in [styling.md](./styling.md) and keep it in the DOM.
- **`aria-live="polite"`, not `role="alert"`.** A polite live region
  announces *mutations*, so it is silent on first paint and speaks once
  per user-initiated change, without moving focus (WCAG 3.2.2).
- **Human label, not the raw slug.** Show `labelFor(slug)` /
  your `themeLabels` value, so the line reads "Active theme: Dark"
  rather than "Active theme: dark".

**Honest limits.** This does not fully restore what the pinned
placeholder costs. The control's *own* accessible value is still the
placeholder word, so a user who tabs back to the select later — rather
than being present for the change announcement — still hears "Theme",
not "Dark". A live region announces transitions; it does not give the
combobox a queryable value. The status text is the only durable record
on screen, which is another reason to keep it visible. If your product
needs the control itself to report its value, drop the placeholder
pinning instead and let the `<select>` bind normally.

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

## Reduced motion

The select performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up button"
  and each entry as "{labelFor(slug)}, N of M".
- NVDA announces "{label} combo box" and reads the placeholder option.
- Selection changes are **not** announced by the control itself, since
  its value snaps back to the placeholder. Verify the
  `.theme-select-status` region instead — it should speak once per
  change and stay silent on load (see "State signals" above).

## React 19 specifics

- The select file is a client component (`"use client"`). The
  consumer file importing the select must also be a client component
  if it manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The select's
  `initialisedRef` guards against double-application; tests should
  cover the StrictMode path.

## Common mistakes to avoid

- **Returning non-`<option>` children from custom-rendering.** The
  `children` render prop renders inside the `<select>`, which only
  accepts `<option>` / `<optgroup>`. Render other controls outside the
  select and call `setTheme`.
- **Removing the `aria-label`.** It is the accessible name of the
  select; without it the control is unnamed.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `outline: none` in CSS.** Visible focus is a WCAG AAA
  requirement; the select preserves the browser default. Don't strip
  it.

## References

- MDN — `<select>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
- MDN — `<option>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option>
- WAI-ARIA APG — Combobox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>

---

Lily™ and Lily Design System™ are trademarks.
