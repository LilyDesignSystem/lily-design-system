# Accessibility

The control targets WCAG 2.2 AAA. It is an icon button that opens a
dropdown listbox, implementing the WAI-ARIA APG **listbox** pattern —
so the keyboard, focus, and selection semantics are the component's
responsibility, not the browser's.

This helper has a specific job in the WCAG picture: it is the control
that serves **1.4.4 (Resize Text)** and **1.4.12 (Text Spacing)**. See
[Text sizing is the point](#text-sizing-is-the-point) below — a
text-size control that is itself hard to use, or whose sizes your CSS
does not honour, fails the very criterion it exists to satisfy.

## Roles and properties

| Element                                | Role / Property                                             | Source        |
| -------------------------------------- | ----------------------------------------------------------- | ------------- |
| `<button>`                             | `aria-label={label}`                                        | Consumer prop |
| `<button>`                             | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Component     |
| `<span class="text-size-select-icon">` | `aria-hidden="true"`                                        | Component     |
| `<ul>`                                 | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` | Component |
| `<ul>`                                 | `aria-activedescendant` (only while open)                   | Component     |
| `<li>`                                 | `role="option"`, `aria-selected`                            | Component     |
| `<li>`                                 | `data-active` on the keyboard-active option                 | Component     |

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

The active size is exposed via `data-text-size="<slug>"` on the target
element (default `<html>`) — no colour-only meaning is required.

## The tradeoffs this pattern accepts

A button-plus-listbox buys a compact, fully styleable control, and it
makes this helper match its `theme-select` and `locale-select` siblings
so a row of preference controls reads as one system. It is not free.
Three costs are worth stating plainly before you adopt it.

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
- An icon-only trigger also has no *visible* label. A bare "A" is a
  conventional text-size affordance but it is not self-explanatory —
  sighted users who do not recognise it get no hint of what the button
  does. Pair it with a visible caption, or use `children` to render the
  size name alongside the glyph.

### 2. A custom listbox has weaker assistive-tech support than `<select>`

Until this version, this helper *was* a native `<select>`, and that had
real value worth being honest about. A native `<select>` gets
platform-level treatment: the OS renders it, screen readers have decades
of special-cased handling for it, and mobile readers substitute their
own picker UI. None of that applies here. A `<div>`/`<ul>` listbox is
announced only as well as its ARIA describes it, and
`aria-activedescendant` support — the mechanism this pattern relies on
to report the active option while focus stays on the list — is the least
uniformly implemented part of ARIA. Expect real differences across
screen reader + browser + OS combinations, especially on mobile.

**A native `<select>` remains the better choice for some audiences.**
That is not a hedge: if your users skew toward older assistive tech,
mobile screen readers, or low-vision users who rely on the OS picker,
the control you replaced served them better. This package made the
tradeoff for footprint and cross-helper consistency; you can make the
opposite one. Nothing stops a consumer from rendering their own
`<select>` and calling the same `data-text-size` / `localStorage`
lifecycle — the contract in [`../spec/index.md`](../spec/index.md) §5 is
small and public.

The component follows the APG listbox pattern faithfully, which is the
best available mitigation, but "follows the spec" is not the same as
"announces identically everywhere". **Test with real screen readers**
(see the smoke-test section below) rather than assuming parity with the
native control it replaced.

### 3. The glyph may not render — though "A" is the safe case

`A` (U+0041 LATIN CAPITAL LETTER A) is a character, not a bundled icon.
The package ships no fonts and no icon assets, by design, so what
appears depends on the fonts on the user's device.

This is materially safer than a pictograph. U+0041 is in every font
ever shipped; it renders in the page's own typeface, inherits its
weight and baseline, and stays monochrome. It is why the glyph is a
letter: the obvious alternative, U+1F5DB DECREASE FONT SIZE SYMBOL, has
no real glyph in common font stacks — it degrades to a crude bitmap
shape or a `.notdef` box — and it means *decrease* rather than *size*.
Compare `theme-select`'s ◑ and `locale-select`'s 🌐, both of which carry
genuine font-availability risk.

What remains is optical, not existential: "A" inks a smaller fraction of
its em box than the geometric glyphs (0.673 vs 0.842 for ◑), so it needs
a size correction to look like a peer in a row of controls. The 45
`themes/*.css` stylesheets handle that via `--lily-select-icon-scale`.
If your product needs certainty about what the button shows, pass
`children` and render your own inline SVG. Whatever you render, keep it
`aria-hidden` and let `label` carry the name.

## Text sizing is the point

Two obligations follow from what this control is for.

**The control must work at every size it offers.** A user who has
already picked `x-large` still needs to reach the button, open the list,
and read the options. Style the button and options in relative units so
they scale with the choice, keep the target at least 44×44 CSS pixels at
the smallest size (WCAG 2.5.5, AAA), and check that the open listbox
does not overflow the viewport at the largest one.

**Your CSS must actually honour the sizes.** The helper only writes
`data-text-size`; the typography is yours. Scale with `rem`/`em` from a
root `font-size`, not with fixed `px`, or the attribute changes and
nothing visibly moves. Do not cap growth with fixed-height containers
that clip or scroll text away — that turns a passing 1.4.4 into a
failing one. WCAG 1.4.4 requires text to scale to 200% without loss of
content or functionality; a size ladder topping out well below that
leaves the criterion unmet no matter how good the control is.

This control complements browser zoom and OS text settings; it does not
replace them. Never suppress user zoom (`user-scalable=no`) on the
grounds that you ship a text-size control.

## The status region is the default pattern

The closed button shows only a glyph and announces only `label`. It
never states the text size currently in effect — there is no combobox
value to read, and no selected-option state until the listbox is opened.

**So the control is not shipped alone.** The quick start in
[`../index.md`](../index.md) pairs it with a visible status line:

```tsx
const [size, setSize] = useState("");

<TextSizeSelect label="Text size" sizes={sizes} value={size} onChange={setSize} />
<p className="text-size-select-status" aria-live="polite">
    Text size: {sizeName(size)}
</p>
```

That pairing is the pattern to copy. Removing the status line is the
deliberate choice you make against the default — not something you opt
into when you happen to care about accessibility.

Why it is shaped this way:

- **Visible, not `sr-only`.** With an icon-only trigger the active size
  is unstated for *everyone*, not just for screen-reader users. A
  visible line serves sighted users and cognitive accessibility, and
  AAA favours showing state over hiding it. Teams that truly cannot
  spare the line should hide the element with a visually-hidden recipe
  and keep it in the DOM.
- **`aria-live="polite"`, not `role="alert"`.** A polite live region
  announces *mutations*, so it is silent on first paint and speaks once
  per user-initiated change, without moving focus (WCAG 3.2.2).
- **Human label, not the raw slug.** Show `sizeName(slug)` / your
  `sizeLabels` value, so the line reads "Text size: X Large" rather than
  "Text size: x-large".

A text-size change is unusually self-evidencing — the page visibly
reflows — but that feedback is unavailable precisely to the users most
likely to need the control, and it does not say *which* size is now
active or how many remain.

**Honest limits.** A status region does not restore what an icon-only
trigger costs. The button's *own* accessible name is still just `label`,
so a user who tabs back to the control later — rather than being present
for the change announcement — hears "Text size", not "X Large". A live
region announces transitions; it does not give the button a queryable
value.

If your product needs the control itself to report its value, use
`children` to render the active size's label inside the button
(`labelFor(value)`) and extend `label` to match, so the visible text and
the accessible name agree.

The region's copy stays the consumer's to own — the helper does not
render one, because only the consumer knows the surrounding wording and
locale.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `sizeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".
- The glyph "A" is a Latin letter. In a non-Latin-script interface it
  reads as a foreign character rather than a size cue; consider
  `children` with a script-appropriate glyph or an SVG.

## Visible focus

The control does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring.

Two elements take focus, so style both: the `.text-size-select-button`
and the `.text-size-select-list` (which receives focus while open).
Style `[data-active]` on the options too — with
`aria-activedescendant` the options never receive real DOM focus, so
`:focus-visible` will never match them and the user would otherwise have
no visual cue for what `Enter` is about to select.

## Reduced motion

The control performs no animation. If your CSS transitions `font-size`
on the `data-text-size` swap, respect `prefers-reduced-motion` — a
whole-page type reflow is exactly the kind of motion that criterion is
about.

## Screen-reader smoke test

This matters more here than it did with a native `<select>` — see
tradeoff 2 above. Check, at minimum:

- The closed button announces as "{label}, button, collapsed" (wording
  varies by reader). It should **not** announce the glyph as the letter
  "A".
- Activating it announces the listbox and its `label`, and reads the
  active option.
- `ArrowDown` / `ArrowUp` announce each newly-active option as it
  changes — this is the `aria-activedescendant` path, and the most
  likely thing to be weak or silent on a given reader.
- `Escape` returns you to the button and re-announces it.
- Selection changes are **not** announced by the control itself. Verify
  the `.text-size-select-status` region instead — it should speak once
  per change and stay silent on load.
- Repeat the pass with the largest size active, and with browser zoom at
  200%, to confirm the control is still reachable and readable.

Cover VoiceOver + Safari, NVDA + Firefox, and JAWS + Chrome. If a
combination announces the active option poorly, the status region is
what keeps the control usable there.

## React 19 specifics

- The component file is a client component (`"use client"`). The
  consumer file importing it must also be a client component if it
  manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The `initialisedRef`
  guards against double-application.

## Common mistakes to avoid

- **Rendering visible text in `children` without `aria-hidden`.** The
  visible text and the `aria-label` then disagree — WCAG 2.5.3.
- **Removing or overriding the `aria-label`.** It is the *only*
  accessible name the control has; without it the button is unnamed.
- **Sizing text in `px`.** The attribute changes and nothing moves; the
  control becomes decorative.
- **Fixed-height containers around scalable text.** They clip or scroll
  content away at the larger sizes — a 1.4.4 failure.
- **Forgetting to translate `sizeLabels`.** The control only knows what
  the consumer tells it.
- **Setting `outline: none` in CSS.** Visible focus is a WCAG AAA
  requirement — on the button *and* the listbox. Don't strip it.
- **Styling only `:focus-visible` on the options.** They never take DOM
  focus; style `[data-active]` instead.
- **Suppressing browser zoom** because the app ships this control.
- **Shipping without a screen-reader pass.** A custom listbox earns no
  free pass from the platform.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- WCAG 2.2 — 1.4.4 Resize Text:
  <https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html>
- WCAG 2.2 — 1.4.12 Text Spacing:
  <https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>

---

Lily™ and Lily Design System™ are trademarks.
