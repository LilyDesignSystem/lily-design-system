# Accessibility

The select targets **WCAG 2.2 AAA**. It is an **icon button that opens
a listbox**, built to the WAI-ARIA APG
[Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) —
not a native `<select>`, and not the APG Combobox pattern (there is no
text input and no autocomplete). It is the same shape as its siblings
`theme-picker` and `locale-picker`, and the same three tradeoffs apply,
restated here for this control's specifics.

That shape buys a control that costs one glyph of page width no matter
how many sizes the catalog holds. It also costs three things. This page
states what is built in, then states those three costs plainly, then
gives the mitigations — plus two considerations that are specific to a
*text-size* control rather than a theme or locale control: how a size
change is announced, and how this control's own scale interacts with
the browser's and the OS's.

## Built in

| WCAG item | How the select satisfies it |
| --------- | --------------------------- |
| 1.4.4 Resize Text | The whole reason this component exists: it lets a user pick a comfortable reading size that persists across the app. |
| 1.4.12 Text Spacing | The consumer's CSS keyed on `[data-text-size]` is expected to scale spacing alongside size; the component supplies the attribute, not the rule. |
| 4.1.2 Name, Role, Value | `aria-label` names the button and the listbox; `aria-haspopup` / `aria-expanded` expose the popup relationship; `aria-selected` exposes the current choice. |
| 2.1.1 Keyboard | Full keyboard operation — but implemented by this component, not inherited from the platform. See [Keyboard contract](#keyboard-contract). |
| 2.4.7 Focus Visible | The component never sets `outline: none`. Styling the ring — and the active-option indicator — is yours. |
| 1.4.1 Use of Color | The selection is exposed via `aria-selected`, the `data-text-size` attribute, the hidden input, and the `value` binding — never colour alone. |
| 3.2.2 On Input | Choosing a size does not move focus elsewhere or navigate; focus returns to the trigger button. |

## Roles and properties

| Element          | Role / property                                | Source        |
| ---------------- | ----------------------------------------------- | ------------- |
| `<button>`       | implicit `role="button"`                        | Browser       |
| `<button>`       | `aria-label={label}`                            | Consumer prop |
| `<button>`       | `aria-haspopup="listbox"`                       | Component     |
| `<button>`       | `aria-expanded="true\|false"`                   | Component     |
| `<button>`       | `aria-controls="{listId}"`                      | Component     |
| `<span>` (glyph) | `aria-hidden="true"`                            | Component     |
| `<ul>`           | `role="listbox"`                                | Component     |
| `<ul>`           | `aria-label={label}`                            | Consumer prop |
| `<ul>`           | `aria-activedescendant="{optionId}"` while open  | Component    |
| `<li>`           | `role="option"`                                 | Component     |
| `<li>`           | `aria-selected="true\|false"`                   | Component     |

Focus sits on the `<ul>` while the listbox is open; the active option is
conveyed by `aria-activedescendant` rather than by moving DOM focus onto
an `<li>`. That is what the APG prescribes for this pattern.

## Keyboard contract

Every key below is implemented by the component. None of it comes free
from the platform — that is the point of tradeoff 2 below.

On the **button**:

| Key                 | Action                                                    |
| ------------------- | ----------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / from the button. It is a single tab stop.  |
| `Enter`             | Open the listbox with the selected option active.          |
| `Space`             | Same as `Enter`.                                           |
| `Arrow Down`        | Same as `Enter`.                                           |
| `Arrow Up`          | Open the listbox with the **last** option active.          |

On the **listbox**:

| Key                 | Action                                                          |
| ------------------- | ------------------------------------------------------------------ |
| `Arrow Down`        | Move the active option down one; **clamps** at the last.         |
| `Arrow Up`          | Move the active option up one; clamps at the first.              |
| `Home`              | Make the first option active.                                    |
| `End`               | Make the last option active.                                     |
| `Enter`             | Select the active option, apply it, close, refocus the button.   |
| `Space`             | Same as `Enter`.                                                 |
| `Escape`            | Close and refocus the button **without** changing the size.      |
| `Tab`               | Close without stealing focus back; focus moves on normally.      |
| Printable character | Typeahead over the option labels, 500 ms buffer, wraps once.     |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the size.

Arrow keys deliberately **clamp** rather than wrap. A size catalog is
usually short (three to five slugs), so wrapping would save little and
would make it easy to overshoot past "x-large" back to "small" without
noticing.

## State signals

The active size is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the active option in the listbox.
2. `data-text-size="<slug>"` on the target element (default `<html>`).
3. The hidden input's `value` (so the control participates in forms).
4. The bindable `value` prop in user code.

## Tradeoff 1 — the accessible name rests entirely on `aria-label`

The closed control renders one glyph and nothing else. That glyph is
`aria-hidden="true"`, so **the button's entire accessible name is the
`aria-label` you pass as `label`**. There is no visible text node, no
associated `<label>`, and no fallback.

The consequences:

- If `label` is missing, empty, or untranslated, the control is
  effectively unlabelled. A screen reader announces a bare "button".
  Nothing in the component can compensate; it has no other text to fall
  back on.
- The name is invisible to sighted users. The default "A" glyph is a
  reasonably conventional affordance for "text size", but a convention
  is not a label — someone who does not read it that way has no
  on-screen text telling them what the button does. A tooltip is not a
  substitute — it is unavailable on touch and to keyboard-only users in
  most browsers.
- WCAG 2.5.3 (Label in Name) does not bite here, because there is no
  visible label text to match against. But the *spirit* of it — that a
  user can refer to the control by what they see — is not served by a
  glyph.

What to do:

- **Always pass a real, translated `label`.** It is a required prop for
  this reason.
- **Prefer a visible text label next to the button** when the design
  allows it. Point the button at it with `aria-labelledby` through
  rest-props rather than leaving a visible label and an `aria-label` to
  disagree.
- **Consider the `children` snippet** to render the glyph *plus* a
  short visible word. The snippet replaces the glyph, so you control
  the whole button interior:

  ```svelte
  <TextSizePicker label="Text size" {sizes} bind:value={size}>
    {#snippet children({ value, open, labelFor })}
      <span aria-hidden="true">A</span>
      <span class="text-size-picker-text">{labelFor(value)}</span>
    {/snippet}
  </TextSizePicker>
  ```

  This gives up the narrow-control benefit, which may well be the right
  trade for your page.

## Tradeoff 2 — a hand-rolled listbox is weaker than a native `<select>`

Everything in the keyboard table above is JavaScript this package
wrote. A native `<select>` gets all of it from the platform, and gets
more besides. Being direct about the gap:

- **Mobile.** A native `<select>` opens the OS picker — the iOS wheel,
  the Android dialog — which users already know, which is reachable
  with the platform's own assistive tooling, and which does not depend
  on our CSS to be visible or scrollable. This listbox is a `<ul>` the
  consumer positions.
- **Screen-reader coverage.** `role="listbox"` with
  `aria-activedescendant` is well specified but unevenly implemented.
  Combinations of reader, browser, and virtual-cursor mode differ in
  whether they announce the active option, the option count, or the
  selected state on open. Native `<select>` is the most thoroughly
  supported widget on the web; nothing hand-rolled matches it.
- **Platform integrations.** Forced-colors mode, browser autofill,
  find-in-page, form reset, and voice-control "click Text size" all
  understand a native `<select>` and do not necessarily understand a
  `<div>` containing a `<ul>`. The hidden input restores form
  participation, but not the rest.
- **Our own testing.** The keyboard contract is verified in jsdom and
  spot-checked in a Chromium browser. It has not been swept across the
  full reader/browser matrix.

**Say it plainly: for some audiences a native `<select>` is the better
choice.** If your users are predominantly on mobile, or on older
assistive technology, or in a regulated context where you must
demonstrate maximum compatibility rather than argue for a pattern, then
a plain `<select aria-label="…">` with one `<option>` per size is a
legitimate and simpler alternative — it is about ten lines, and it
inherits the platform's behaviour for free. That is a reasonable
outcome, not a failure to configure this package correctly.

This helper is the right tool when horizontal space is genuinely
constrained, or when the header already uses the same icon-button +
listbox pattern for `theme-picker` and `locale-picker` and you want the
three controls to look and behave alike.

## Tradeoff 3 — the glyph shares the very setting it controls

The default glyph is `LATIN_CAPITAL_LETTER_A`: plain "A" (U+0041). This
package deliberately chose a letter over a pictograph — the obvious
candidate, U+1F5DB DECREASE FONT SIZE SYMBOL, has no real glyph in
common font stacks and falls back to a crude bitmap shape, and it means
*decrease* specifically rather than *size* generally. A plain letter
renders in the page's own font on every platform and stays monochrome,
the same way `theme-picker`'s `◑` does.

That choice avoids the font-coverage problem `theme-picker` and
`locale-picker` have (an unusual codepoint that may not be in the
user's fonts), but it introduces a different one that is specific to
this control:

- **The glyph is rendered in the page's own font at the page's current
  size**, because it is an ordinary letter, not a fixed-size icon. If
  your `[data-text-size]` CSS scales the button's own ancestor along
  with the rest of the page, the trigger glyph grows and shrinks along
  with every choice the user makes. That can be a feature (the button
  visibly demonstrates its own effect) or a layout problem (a button
  that changes size can shift neighbouring controls in the header).
  Decide deliberately; do not assume one or the other.
- **If you want the glyph pinned at one size regardless of the active
  text size**, exclude the button from the scaling rule — for example
  scope your `[data-text-size]` font-size rule to a content wrapper
  that does not contain the header, or give `.text-size-picker-button`
  its own fixed `font-size` in your CSS.
- **An inline SVG via the `children` snippet removes the coupling
  entirely**, at the cost of an asset this headless package does not
  ship.

Because the glyph is `aria-hidden`, none of this affects screen-reader
users — it affects sighted users, and interacts with tradeoff 1: if the
label is also missing, a button whose size keeps changing without a
caption is a more conspicuous, not less conspicuous, mystery.

## How a size change is announced

The component's own DOM changes on selection are: the `<li>`'s
`aria-selected` flips, `data-text-size` is written to the target, and
the hidden input's value updates. None of that is inside an
`aria-live` region, so **a screen-reader user who is not currently
focused inside the open listbox gets no spoken confirmation that the
size changed** — the same gap `theme-picker` and `locale-picker` have.
A user who opens the listbox does hear the selected state on the option
they land on; a user who has already closed it and continues reading
the page does not hear anything unless you ship the status region
below.

For a visual user, the confirmation is usually implicit: the page's
text visibly grows or shrinks the instant the value applies. That
same visible feedback is exactly what a screen-reader user cannot get
for free, which is why the status region matters more here than its
absence might suggest from a sighted developer's seat.

## This control's scale vs. the browser's and the OS's

`data-text-size` is a value your CSS maps to a relative `font-size` —
the example in [`../index.md`](../index.md) uses percentages
(`87.5%` … `125%`). Percentages compose multiplicatively with whatever
else is already scaling text on the page:

- **Browser zoom** (`Ctrl`/`Cmd` `+`/`-`, or a persistent per-site zoom
  level) scales everything, including the output of this control. A
  user at 150% browser zoom who also picks "x-large" here is not
  choosing 125% of the *default* size — they are choosing 125% of
  their already-zoomed size. That is usually the desired, compounding
  behaviour (WCAG 1.4.4 asks that text be resizable up to 200% without
  loss of content or function, and this control does not need to
  reach 200% on its own to satisfy that — browser zoom already can).
- **OS-level text-size settings** (Android's font scale, iOS's Larger
  Text, Windows's display scaling) are read by the browser before any
  page CSS runs, and this control's percentages apply on top of that
  baseline the same way they apply on top of zoom.
- **Nothing in this component detects or reacts to either.** There is
  no equivalent of `detectFromSystem` (as `theme-picker` has for
  `prefers-color-scheme`) here, because browsers expose no media query
  or JS signal for "the user's preferred text size" the way they do for
  colour scheme — see the sibling note in the Blazor catalog's
  `examples/README.md`. Users who already scale text at the OS or
  browser level are already served by that mechanism; this control
  must not fight it, and does not try to.
- **Consequence for your own CSS**: use relative units (`%`, `em`,
  `rem`) for the `[data-text-size]` rule, never `px`, so it composes
  with zoom and OS scaling instead of overriding them.

## The status region

The listbox marks the active option with `aria-selected="true"`, so a
user who opens the control does hear which size is current. That does
not cover the gap described above: **the closed control shows only a
glyph, and applying a size change while the listbox is closed produces
no announcement.** Shipping a status region closes both gaps at once.

```svelte
<TextSizePicker label="Text size" {sizes} bind:value={size} />
<p class="text-size-picker-status" aria-live="polite">
  Text size: {sizeName(size)}
</p>
```

Why it is shaped this way:

- **`aria-live="polite"` announces mutations only.** It is silent on
  first paint and speaks once on each subsequent change — no
  announcement on page load, one clear announcement per user action.
- **Visible by default, not `sr-only`.** Unlike a theme, whose effect is
  usually self-evident from looking at the page, a text-size change is
  self-evident only to a sighted user actively reading body text at the
  moment it changes — someone glancing at a header, or a screen-reader
  user, gets nothing else. Hiding the region visually keeps the
  announcement but throws away the only on-screen confirmation.
- **`.text-size-picker-status` is the class hook**, in the same
  kebab-case convention as the rest of the system.
- **Use `sizeName`, not the raw slug.** It is exported from
  `TextSizePicker.svelte` and mirrors `themeName` / `localeName`. If you
  pass `sizeLabels`, read from that same map so the control and the
  status line cannot disagree.

Omitting the region is a reasonable choice for a settings page where
the size selector sits directly beside a live preview of body text.

## Internationalisation

- `label` is consumer-supplied; pass a translated string. It is the
  entire accessible name (tradeoff 1).
- `sizeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".
- The glyph ("A") is a Latin letter with no inherent translation; it is
  not localised, in the same way `theme-picker`'s `◑` is not.

## Visible focus

The control does not suppress `:focus` or `:focus-visible` styling on
the button. The consumer's CSS is responsible for the visible focus
ring — and for the **active-option** indicator inside the listbox,
exposed as `[data-active]` and `[aria-selected="true"]`. An unstyled
listbox gives a keyboard user no visual indication of where they are.

## Reduced motion

The control performs no animation, including on open and close. If you
add a transition to the listbox, respect `prefers-reduced-motion`
yourself. If your `[data-text-size]` CSS transitions `font-size` on
change, respect it there too — a sudden reflow is jarring enough for
some users without adding motion on top of it.

## Screen-reader smoke test

Expected announcements, with the caveat from tradeoff 2 that coverage
varies:

- **VoiceOver (macOS)** — "{label}, pop-up button, collapsed". Opening
  announces the listbox and the active option; arrowing announces each
  option and its selected state.
- **NVDA (Windows)** — "{label} button, collapsed". Opening moves to the
  list; arrowing announces "{labelFor(slug)}, selected / N of M".
- **Mobile readers** — the weakest case. Test on device rather than
  assuming.

If you adopt this helper under an accessibility conformance obligation,
run your own sweep. Do not treat this list as evidence.

## Common mistakes to avoid

- **Passing an empty or untranslated `label`.** It is the whole
  accessible name (tradeoff 1).
- **Rendering visible text in `children` without accounting for the
  `aria-label`.** If the snippet renders a visible word, the
  `aria-label` overrides it for assistive tech — make them agree, or
  switch to `aria-labelledby`.
- **Letting the trigger glyph scale unexpectedly.** See tradeoff 3 — a
  button that visibly grows or shrinks with every change is sometimes
  desired and sometimes a bug; decide on purpose.
- **Shipping no positioning CSS.** Without it the listbox renders in
  normal flow and shoves the page around when it opens. That layout
  shift is a usability defect, not just an aesthetic one.
- **Styling no active-option state.** `[data-active]` and
  `[aria-selected="true"]` exist so keyboard users can see where they
  are. Style both.
- **Using `px` in the `[data-text-size]` CSS rule.** It stops the
  effect composing with browser zoom and OS text scaling — see
  [this control's scale vs. the browser's and the OS's](#this-controls-scale-vs-the-browsers-and-the-oss).
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)`) instead.
- **Omitting the status region and assuming the size change is
  self-evident.** It usually is not, for the user closing the listbox
  before reading further, or for a screen-reader user who never opened
  it. See [the status region](#the-status-region).

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 1.4.4 Resize Text:
  <https://www.w3.org/WAI/WCAG22/Understanding/resize-text>
- WCAG 1.4.12 Text Spacing:
  <https://www.w3.org/WAI/WCAG22/Understanding/text-spacing>
- WCAG 1.4.1 Use of Color:
  <https://www.w3.org/WAI/WCAG22/Understanding/use-of-color>
- WCAG 2.5.3 Label in Name:
  <https://www.w3.org/WAI/WCAG22/Understanding/label-in-name>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>

---

Lily™ and Lily Design System™ are trademarks.
