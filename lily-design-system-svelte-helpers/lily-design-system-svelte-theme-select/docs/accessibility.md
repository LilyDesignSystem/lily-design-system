# Accessibility

The select targets WCAG 2.2 AAA. It is an **icon button that opens a
listbox**, built to the WAI-ARIA APG
[Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) —
not a native `<select>`, and not the APG Combobox pattern (there is no
text input and no autocomplete).

That shape buys a control that costs one glyph of page width no matter
how many themes the catalog holds. It also costs three things. This page
states what is built in, then states those three costs plainly, then
gives the mitigations.

## Roles and properties

| Element          | Role / property                                | Source        |
| ---------------- | ---------------------------------------------- | ------------- |
| `<button>`       | implicit `role="button"`                       | Browser       |
| `<button>`       | `aria-label={label}`                           | Consumer prop |
| `<button>`       | `aria-haspopup="listbox"`                      | Component     |
| `<button>`       | `aria-expanded="true\|false"`                  | Component     |
| `<button>`       | `aria-controls="{listId}"`                     | Component     |
| `<span>` (glyph) | `aria-hidden="true"`                           | Component     |
| `<ul>`           | `role="listbox"`                               | Component     |
| `<ul>`           | `aria-label={label}`                           | Consumer prop |
| `<ul>`           | `aria-activedescendant="{optionId}"` while open | Component    |
| `<li>`           | `role="option"`                                | Component     |
| `<li>`           | `aria-selected="true\|false"`                  | Component     |

Focus sits on the `<ul>` while the listbox is open; the active option is
conveyed by `aria-activedescendant` rather than by moving DOM focus onto
an `<li>`. That is what the APG prescribes for this pattern.

## Keyboard contract

Every key below is implemented by the component. None of it comes free
from the platform — that is the point of the second tradeoff below.

On the **button**:

| Key                 | Action                                                    |
| ------------------- | --------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / from the button. It is a single tab stop.  |
| `Enter`             | Open the listbox with the selected option active.          |
| `Space`             | Same as `Enter`.                                           |
| `Arrow Down`        | Same as `Enter`.                                           |
| `Arrow Up`          | Open the listbox with the **last** option active.          |

On the **listbox**:

| Key                 | Action                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `Arrow Down`        | Move the active option down one; **clamps** at the last.         |
| `Arrow Up`          | Move the active option up one; clamps at the first.              |
| `Home`              | Make the first option active.                                    |
| `End`               | Make the last option active.                                     |
| `Enter`             | Select the active option, apply it, close, refocus the button.   |
| `Space`             | Same as `Enter`.                                                 |
| `Escape`            | Close and refocus the button **without** changing the theme.     |
| `Tab`               | Close without stealing focus back; focus moves on normally.      |
| Printable character | Typeahead over the option labels, 500 ms buffer, wraps once.     |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the theme.

Arrow keys deliberately **clamp** rather than wrap. Wrapping is
permitted by the APG but makes it easy to shoot past the end of a long
theme catalog without noticing.

## State signals

The active theme is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the active option in the listbox.
2. `data-theme="<slug>"` on the target element (default `<html>`).
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
- The name is invisible to sighted users. Someone who does not read
  `◑` as "theme" has no on-screen text telling them what the button
  does. A tooltip is not a substitute — it is unavailable on touch and
  to keyboard-only users in most browsers.
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
- **Consider the `children` snippet** to render the glyph *plus* a short
  visible word. The snippet replaces the glyph, so you control the whole
  button interior:

  ```svelte
  <ThemeSelect label="Theme" {themesUrl} {themes} bind:value={theme}>
    {#snippet children({ labelFor, value })}
      <span aria-hidden="true">◑</span>
      <span class="theme-select-text">{labelFor(value)}</span>
    {/snippet}
  </ThemeSelect>
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
  consumer positions. On a small screen with a forty-five-theme
  catalog, that is materially worse.
- **Screen-reader coverage.** `role="listbox"` with
  `aria-activedescendant` is well specified but unevenly implemented.
  Combinations of reader, browser, and virtual-cursor mode differ in
  whether they announce the active option, the option count, or the
  selected state on open. Native `<select>` is the most thoroughly
  supported widget on the web; nothing hand-rolled matches it.
- **Platform integrations.** Forced-colors mode, browser autofill,
  find-in-page, form reset, and voice-control "click Theme" all
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
this helper is the wrong tool. Use the plain headless `ThemeSelect`
container in `lily-design-system-svelte-headless`, which is a native
`<select>` with `<option>` children. That is a legitimate outcome, not
a failure to configure this package correctly.

This helper is the right tool when horizontal space is genuinely
constrained and the catalog is large enough that a `<select>` would
either dominate the header or truncate its own option text.

## Tradeoff 3 — the glyph is font-dependent

The default glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`◑`,
`&#9681;`), a Geometric Shapes character. It is not an image, an icon
font, or an SVG — this package ships no assets, by the headless rule.

Its rendering is therefore entirely at the mercy of the fonts on the
user's device:

- **It may substitute.** If the page's font stack lacks the codepoint,
  the browser falls back to some other installed font. The glyph then
  renders at a different weight, size, or baseline than the surrounding
  text, and may sit visibly wrong next to `locale-select`'s globe.
- **It may not render at all.** On a device with no font covering the
  range, the user sees a `.notdef` box — the "tofu" rectangle — or
  nothing. The control is then a blank button.
- **It may render as emoji.** Some codepoints in this space have emoji
  presentations. `◑` does not, which is why it was chosen; the sibling
  `locale-select` has to append U+FE0E VARIATION SELECTOR-15 to its
  globe to force text presentation. If you substitute your own glyph,
  check it in both presentations.
- **It carries no inherent meaning.** `◑` is a half-filled circle. It is
  a convention for "theme" or "contrast", not a universally read symbol,
  and it is not localised.

Because the glyph is `aria-hidden`, none of this affects screen-reader
users — it affects sighted users, who may face an unlabelled or empty
button. That interacts badly with tradeoff 1: if the glyph fails *and*
there is no visible text label, the control is a mystery box for
exactly the users who cannot hear the `aria-label`.

What to do:

- **Set an explicit font stack** on `.theme-select-icon` that you have
  verified covers the codepoint on your target platforms.
- **Or replace the glyph** via the `children` snippet with an inline
  SVG you control, which removes the font dependency entirely. The
  package will not ship one, but nothing stops you supplying one.
- **Test in a minimal font environment**, not only on a developer
  laptop with every font installed.

## The status region

The pinned-placeholder problem of 0.3.0 is gone. There is no pinned
`<select>` any more, and the listbox marks the active option with
`aria-selected="true"` — so a user who opens the control does hear which
theme is current. **The status region is no longer compensating for
missing semantics.**

It is still worth shipping, for a different and narrower reason: the
*closed* control shows only a glyph. A user who has not opened the
listbox — sighted or not — has no statement of the current theme
anywhere on the page. The region supplies one without requiring
interaction.

```svelte
<ThemeSelect label="Theme" {themesUrl} {themes} bind:value={theme} />
<p class="theme-select-status" aria-live="polite">
  Active theme: {labelFor(theme)}
</p>
```

Why it is shaped this way:

- **`aria-live="polite"` announces mutations only.** It is silent on
  first paint and speaks once on each subsequent change — no
  announcement on page load, one clear announcement per user action.
- **Visible by default, not `sr-only`.** This is now the *main* reason
  to ship it: it is the only place the active theme is written while the
  control is closed. Hiding it visually keeps the announcement but
  throws away the benefit for sighted users. See the recipe in
  [styling.md](./styling.md#the-status-line) if you truly cannot spare
  the space.
- **`.theme-select-status` is the class hook**, in the same kebab-case
  convention as the rest of the system.
- **Show the label, not the slug.** `themeName` is exported from
  `ThemeSelect.svelte` (though not yet from the `index.ts` barrel), so
  import it from there rather than re-implementing the title-casing. If
  you pass a `themeLabels` map, read from that same map so the control
  and the status line cannot disagree.

Omitting the region is a reasonable choice when the active theme is
self-evident from the page — which, for a theme select specifically, it
often is.

## Internationalisation

- `label` is consumer-supplied; pass a translated string. It is the
  entire accessible name (tradeoff 1).
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".
- The glyph is not localised and carries no language.

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling on
the button. The consumer's CSS is responsible for the visible focus
ring — and for the **active-option** indicator inside the listbox,
exposed as `[data-active]` and `[aria-selected="true"]`. An unstyled
listbox gives a keyboard user no visual indication of where they are;
see [styling.md](./styling.md).

## Reduced motion

The select performs no animation, including on open and close. If you
add a transition to the listbox, respect `prefers-reduced-motion`
yourself. Theme CSS files are likewise responsible for respecting it if
they introduce transitions on the `data-theme` swap.

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
- **Shipping no positioning CSS.** Without it the listbox renders in
  normal flow and shoves the page around when it opens. That layout
  shift is a usability defect, not just an aesthetic one.
- **Styling no active-option state.** `[data-active]` and
  `[aria-selected="true"]` exist so keyboard users can see where they
  are. Style both.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)`) instead.
- **Assuming the glyph renders.** See tradeoff 3.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
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
