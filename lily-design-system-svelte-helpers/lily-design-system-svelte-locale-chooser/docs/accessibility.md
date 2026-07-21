# Accessibility

The select targets **WCAG 2.2 AAA**. It is an **icon button that opens
a listbox**, built to the WAI-ARIA APG
[Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) —
not a native `<select>`, and not the APG Combobox pattern (there is no
text input and no autocomplete).

That shape buys a control that costs one glyph of page width whether
your app offers three locales or all 436 in `locales.tsv`. It also
costs three things. This page states what is built in, then states
those three costs plainly, then gives the mitigations.

A locale select carries a duty most controls do not: **it is the
control a user reaches for precisely when they cannot read the page.**
That raises the stakes on every tradeoff below, and it is worth keeping
in mind throughout.

## Built in

| WCAG item | How the select satisfies it |
| --------- | --------------------------- |
| 3.1.1 Language of Page | Writes `lang` to the document root (or `target`) on every locale change. |
| 3.1.2 Language of Parts | Each `<li role="option">` carries its own `lang`, so option text is announced in the right language. |
| 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| 4.1.2 Name, Role, Value | `aria-label` names the button and the listbox; `aria-haspopup` / `aria-expanded` expose the popup relationship; `aria-selected` exposes the current choice. |
| 2.1.1 Keyboard | Full keyboard operation — but implemented by this component, not inherited from the platform. See [Keyboard contract](#keyboard-contract). |
| 2.4.7 Focus Visible | The component never sets `outline: none`. Styling the ring — and the active-option indicator — is yours. |
| 1.4.1 Use of Color | The selection is exposed via `aria-selected`, the root `lang`, the hidden input, and the `value` binding — never colour alone. |
| 3.2.2 On Input | Choosing a locale does not move focus elsewhere or navigate; focus returns to the trigger button. |

## Roles and properties

| Element          | Role / property                                 | Source        |
| ---------------- | ----------------------------------------------- | ------------- |
| `<button>`       | implicit `role="button"`                        | Browser       |
| `<button>`       | `aria-label={label}`                            | Consumer prop |
| `<button>`       | `aria-haspopup="listbox"`                       | Component     |
| `<button>`       | `aria-expanded="true\|false"`                   | Component     |
| `<button>`       | `aria-controls="{listId}"`                      | Component     |
| `<span>` (glyph) | `aria-hidden="true"`                            | Component     |
| `<ul>`           | `role="listbox"`                                | Component     |
| `<ul>`           | `aria-label={label}`                            | Consumer prop |
| `<ul>`           | `aria-activedescendant="{optionId}"` while open  | Component     |
| `<li>`           | `role="option"`                                 | Component     |
| `<li>`           | `aria-selected="true\|false"`                   | Component     |
| `<li>`           | `lang="{bcp47LocaleTag(code)}"`                 | Component     |

Focus sits on the `<ul>` while the listbox is open; the active option is
conveyed by `aria-activedescendant` rather than by moving DOM focus onto
an `<li>`. That is what the APG prescribes for this pattern.

## Per-option `lang` is important

Each `<li role="option">` carries a `lang` attribute. This satisfies
WCAG 3.1.2 (Language of Parts): when a screen reader encounters the
option "Français" inside an English page, the `lang` attribute makes
the reader switch to a French voice for the duration of that option.

Without it, "Français" gets pronounced "Franc-ess" in an English voice
— comprehensible but ugly. With it, the reader says "Fran-SAY".

This matters more than it looks. A user who cannot read the page is
scanning the option list for a language name they recognise; hearing it
pronounced correctly is often the only cue that lands.

The button and the list carry no `lang`, because they are not in any
particular language — the `aria-label` is in whatever language you
wrote it.

### When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), then the per-option `lang` attribute is technically
incorrect: the visible text is English even though the attribute says
French.

The default rendering avoids this by using each language's own name
where the built-in table has one, so the attribute and the text agree.
If you override `localeLabels` with viewer-language names, the mismatch
is a minor and generally harmless inaccuracy — but be aware of it. The
component does not offer a way to suppress the per-option `lang`, since
the snippet no longer renders options.

**Prefer endonyms** — each language written in its own script
("Français", "العربية", "Cymraeg") — for exactly the audience-cannot-
read-the-page reason above.

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
| `Escape`            | Close and refocus the button **without** changing the locale.    |
| `Tab`               | Close without stealing focus back; focus moves on normally.      |
| Printable character | Typeahead over the option labels, 500 ms buffer, wraps once.     |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the locale.

Arrow keys deliberately **clamp** rather than wrap — with 436 possible
locales, wrapping makes it easy to shoot past the end without noticing.

Typeahead matches the **label**, so it is only as useful as your labels
are guessable. With the built-in English names, typing `f` reaches
"French"; with endonym labels a user must type "Fr" for "Français". For
long lists, decide deliberately which of the two your audience will
type.

## Focus management on locale change

Selecting a locale returns focus to the trigger button and does not
navigate. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause an unexpected focus or context change.

Avoid `goto()` calls in `onChange` that scroll or replace the page. If
you must navigate (a URL-prefixed i18n strategy, for instance), restore
focus to the select's position afterwards so the user can keep
choosing — a user who picked the wrong language and lost the control
has no way back.

## Tradeoff 1 — the accessible name rests entirely on `aria-label`

The closed control renders one glyph and nothing else. That glyph is
`aria-hidden="true"`, so **the button's entire accessible name is the
`aria-label` you pass as `label`**. There is no visible text node, no
associated `<label>`, and no fallback.

For a locale select this is the sharpest of the three tradeoffs, and it
has a circularity to it: **the `aria-label` is written in one specific
language.** If you render `label="Language"` and a user speaks only
Arabic, the control's accessible name is in a language they do not
read, and the glyph carries no text at all. The one control on the page
designed to rescue them is labelled in the language they cannot use.

The other consequences:

- If `label` is missing or empty, the control is effectively
  unlabelled. A screen reader announces a bare "button". Nothing in the
  component can compensate.
- The name is invisible to sighted users. The globe glyph is a
  reasonably well-established convention for "language", which softens
  this compared to `theme-chooser`'s `◑` — but a convention is not a
  label.

What to do:

- **Always pass a real `label`.** It is a required prop for this
  reason.
- **Consider a language-neutral or multilingual label.** `"Language /
  اللغة / Langue"` is clumsy but honest for a genuinely multilingual
  audience. Some services use the endonym of the *current* locale plus
  the word in English.
- **Prefer a visible text label next to the button** when the design
  allows. Point the button at it with `aria-labelledby` through
  rest-props rather than leaving a visible label and an `aria-label` to
  disagree.
- **Consider the `children` snippet** to render the glyph *plus* the
  active locale's endonym. This is the strongest mitigation available
  here: an endonym is readable by exactly the user who needs it.

  ```svelte
  <LocaleChooser label="Language" {locales} bind:value={locale}>
    {#snippet children({ value, labelFor })}
      <span aria-hidden="true">🌐︎</span>
      <span class="locale-chooser-text" lang={bcp47LocaleTag(value)}>
        {labelFor(value)}
      </span>
    {/snippet}
  </LocaleChooser>
  ```

  This gives up the narrow-control benefit. For a locale select
  specifically, that is often the right call.

## Tradeoff 2 — a hand-rolled listbox is weaker than a native `<select>`

Everything in the keyboard table above is JavaScript this package
wrote. A native `<select>` gets all of it from the platform, and gets
more besides. Being direct about the gap:

- **Mobile.** A native `<select>` opens the OS picker — the iOS wheel,
  the Android dialog — which users already know, which is reachable
  with the platform's own assistive tooling, and which does not depend
  on our CSS to be visible or scrollable. This listbox is a `<ul>` the
  consumer positions. For a long locale list on a small screen, that is
  materially worse.
- **Screen-reader coverage.** `role="listbox"` with
  `aria-activedescendant` is well specified but unevenly implemented.
  Combinations of reader, browser, and virtual-cursor mode differ in
  whether they announce the active option, the option count, or the
  selected state on open. Native `<select>` is the most thoroughly
  supported widget on the web; nothing hand-rolled matches it.
- **Per-option `lang` in the native picker.** Some OS-native selects do
  not honour per-option `lang` either — so this is not a clean win for
  `<select>` — but where it works, it works without our involvement.
- **Platform integrations.** Forced-colors mode, browser autofill,
  find-in-page, form reset, and voice-control "click Language" all
  understand a native `<select>` and do not necessarily understand a
  `<div>` containing a `<ul>`. The hidden input restores form
  participation, but not the rest.
- **Our own testing.** The keyboard contract is verified in jsdom and
  spot-checked in a Chromium browser. It has not been swept across the
  full reader/browser matrix.

**Say it plainly: for some audiences a native `<select>` is the better
choice.** If your users are predominantly on mobile, or on older
assistive technology, or in a regulated or public-service context where
you must demonstrate maximum compatibility rather than argue for a
pattern, then this helper is the wrong tool. A plain
`<select aria-label="…">` with one `<option lang="…">` per locale
satisfies everything in the "Built in" table above and inherits the
platform's behaviour for free. Write it by hand — it is about fifteen
lines — and keep this package's exported pure helpers
(`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
`matchNavigatorLanguage`) for the application logic.

Given how many public-sector language switchers serve exactly the
mobile-and-older-AT audience, that is a live option, not a footnote.

This helper is the right tool when horizontal space is genuinely
constrained and the locale list is long enough that a `<select>` would
either dominate the header or truncate its own option text.

## Tradeoff 3 — the glyph is font-dependent

The default glyph is `GLOBE_WITH_MERIDIANS`: U+1F310 GLOBE WITH
MERIDIANS (`&#127760;`) followed by U+FE0E VARIATION SELECTOR-15. It is
not an image, an icon font, or an SVG — this package ships no assets,
by the headless rule.

Its rendering is therefore entirely at the mercy of the fonts on the
user's device:

- **The variation selector may be ignored.** VS15 *requests* text
  presentation; it does not guarantee it. A platform whose only
  covering font is a colour-emoji font will render a blue globe
  regardless, which is precisely the mismatch with `theme-chooser`'s
  monochrome `◑` that VS15 exists to prevent. Verified working in
  Chromium; not swept across every platform.
- **It may substitute.** If the page's font stack lacks the codepoint,
  the browser falls back to some other installed font, and the glyph
  renders at a different weight, size, or baseline than its neighbours.
- **It may not render at all.** On a device with no font covering
  U+1F310, the user sees a `.notdef` box — the "tofu" rectangle — or
  nothing. The control is then a blank button.
- **It is an astral-plane character.** U+1F310 is above the BMP, so it
  is a surrogate pair in JavaScript and two-plus code units in most
  string operations. Combined with VS15 the constant is three code
  units. Anything measuring or truncating it by length will get it
  wrong.
- **Its meaning is conventional, not universal.** A globe reads as
  "language" or "region" to people who have seen the convention. It is
  not localised and carries no text.

Because the glyph is `aria-hidden`, none of this affects screen-reader
users — it affects sighted users, who may face an unlabelled or empty
button. That interacts badly with tradeoff 1: if the glyph fails *and*
there is no visible text label, the control is a mystery box for
exactly the user who cannot read the page and cannot hear the
`aria-label` in a language they know.

What to do:

- **Set an explicit font stack** on `.locale-chooser-icon` that you have
  verified covers the codepoint in text presentation on your target
  platforms.
- **Or replace the glyph** via the `children` snippet with an inline
  SVG you control, which removes the font dependency entirely. The
  package will not ship one, but nothing stops you supplying one.
- **Better still, pair it with the active locale's endonym** — see
  tradeoff 1. Text that fails to render is obvious; a wrong glyph is
  not.
- **Test in a minimal font environment**, not only on a developer
  laptop with every font installed.

## The status region

The pinned-placeholder problem of 0.3.0 is gone. There is no pinned
`<select>` any more, and the listbox marks the active option with
`aria-selected="true"` — so a user who opens the control does hear
which locale is current. **The status region is no longer compensating
for missing semantics.**

It is still worth shipping, for a different and narrower reason: the
*closed* control shows only a glyph. A user who has not opened the
listbox — sighted or not — has no statement of the current locale
anywhere on the page except the document's own `lang` attribute, which
is not surfaced visually. The region supplies one without requiring
interaction.

For a locale select this is more valuable than for a theme select. The
active theme is self-evident from looking at the page; the active
locale is self-evident only if you can read the page.

```svelte
<script lang="ts">
    import LocaleChooser, {
        bcp47LocaleTag,
        localeName,
    } from "../LocaleChooser.svelte";

    let locale = $state("en");
</script>

<LocaleChooser label="Language" locales={["en", "fr", "ar"]} bind:value={locale} />

<p class="locale-chooser-status" aria-live="polite">
    Active language:
    <span lang={bcp47LocaleTag(locale)}>{localeName(locale)}</span>
</p>
```

Why it is shaped this way:

- **`aria-live="polite"` announces mutations only.** It is silent on
  first paint and speaks once on each subsequent change — no
  announcement on page load, one clear announcement per user action.
- **Visible by default, not `sr-only`.** This is now the *main* reason
  to ship it: it is the only on-screen statement of the active locale
  while the control is closed. Hiding it visually keeps the
  announcement but throws away the benefit for sighted users. If a
  design genuinely cannot spare the space, keep the element and the
  live region and hide it visually with `clip-path: inset(50%)` — see
  [styling.md](./styling.md#the-status-line). Prefer visible.
- **`.locale-chooser-status` is the class hook**, in the same kebab-case
  convention as the rest of the system.
- **`lang` on the name.** Wrapping the locale name in a `<span lang>`
  carries WCAG 3.1.2 (Language of Parts) through to the status line, so
  "Français" is pronounced in a French voice there too — the same
  courtesy the options get.

  Note the interaction with your label choice: `localeName` returns the
  **English** name from the built-in table, so wrapping *that* in
  `lang="fr"` tells the reader to pronounce an English word with a
  French voice. If you are using the built-in English names, drop the
  `lang` from the span. If you supply endonyms via `localeLabels`, keep
  it.
- **Use `localeName`, not the raw code.** The package exports it; it
  turns `fr_CA` into a human name rather than showing the
  consumer-form code.

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility — for the button, the
glyph, the listbox, and both option states.

```css
.locale-chooser-button {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    border: 1px solid #003087;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused element
and the background.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but **logically**
in source order, which is the same source order as LTR. Tab still
reaches the button in source order, and the listbox mirrors visually.
That is the browser's job, not yours.

What *is* your job: position the listbox with logical properties
(`inset-inline-start` rather than `left`) so the popup anchors to the
correct edge when the select flips a page to RTL — which is, after all,
the whole point of this control. See
[styling.md](./styling.md#positioning-the-listbox).

## Screen-reader smoke test

Expected announcements, with the caveat from tradeoff 2 that coverage
varies:

| Reader    | OS       | Browser | On landing on the control |
| --------- | -------- | ------- | ------------------------- |
| VoiceOver | macOS    | Safari  | "{label}, pop-up button, collapsed". Opening announces the listbox and the active option. |
| NVDA      | Windows  | Firefox | "{label} button, collapsed". Arrowing announces each option, with `lang`-correct pronunciation where a voice is installed. |
| JAWS      | Windows  | Chrome  | "{label} button, collapsed". |
| TalkBack  | Android  | Chrome  | Weakest case. Test on device. |

"`lang`-correct pronunciation" depends on the reader having a matching
voice package installed. NVDA's default ships with English only; users
add other voices through eSpeak NG or commercial voice packs.

If you adopt this helper under an accessibility conformance
obligation, run your own sweep. Do not treat this table as evidence.

## Common mistakes to avoid

- **Passing an empty or thoughtlessly monolingual `label`.** It is the
  whole accessible name, and it is in one language (tradeoff 1).
- **Rendering options in the `children` snippet.** It replaces the
  glyph inside the button; the listbox and its options are
  component-owned.
- **Rendering interactive content in the snippet.** Its output lives
  inside a `<button>`; nested interactive elements are invalid HTML.
- **Shipping no positioning CSS.** Without it the listbox renders in
  normal flow and shoves the page around when it opens.
- **Positioning with `left` / `right` instead of `inset-inline-*`.**
  The popup will anchor to the wrong edge after an RTL switch.
- **Styling no active-option state.** `[data-active]` and
  `[aria-selected="true"]` exist so keyboard users can see where they
  are. Style both.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use `clip-path: inset(50%)` instead.
- **Assuming the glyph renders, or renders monochrome.** See tradeoff 3.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- Unicode — Variation Selectors (UTS #51, emoji presentation):
  <https://www.unicode.org/reports/tr51/#Emoji_Presentation>

---

Lily™ and Lily Design System™ are trademarks.
