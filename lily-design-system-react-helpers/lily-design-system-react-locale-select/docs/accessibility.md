# Accessibility

The select targets **WCAG 2.2 AAA**. It renders an icon button that
opens a dropdown listbox, following the WAI-ARIA APG **Listbox**
pattern. This page lists what's built in, what the honest tradeoffs
are, and what remains the consumer's responsibility.

## Built-in

| WCAG / APG item              | How the select satisfies it |
| ---------------------------- | --------------------------- |
| WCAG 3.1.1 Language of Page  | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<li role="option">` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<button aria-label aria-haspopup="listbox" aria-expanded aria-controls>` exposes the trigger; `<ul role="listbox">` with `aria-selected` options exposes the choices. |
| WCAG 2.1.1 Keyboard          | The full APG Listbox contract — open keys, arrows with clamping, Home / End, select, cancel, typeahead — implemented by the component. |
| WCAG 2.4.7 Focus Visible     | The browser's default focus ring is preserved on the button and the list; the select never sets `outline: none`. |
| WCAG 1.4.1 Use of Color      | Selection rides on `aria-selected` and the keyboard cursor on `data-active` — both attributes, not colour. |
| WCAG 3.2.2 On Input          | Selecting a locale returns focus to the button the user was already on; no context change. |
| WAI-ARIA APG — Listbox       | The pattern this control implements. |

## Per-option `lang` is important

Each `<li role="option" lang="…">` satisfies WCAG 3.1.2 (Language of
Parts): when a screen reader encounters the option "Français" inside an
English page, the `lang` attribute makes the reader switch to a French
voice for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced "Franc-ess"
in an English voice. With it, the reader says "Fran-SAY".

The component always emits this attribute, on every option, and there
is no prop that removes it — `children` replaces the button glyph only.
The button and the list deliberately carry no `lang` of their own,
because neither is locale-specific.

If you also show the active locale's endonym inside the button (see
[Replacing the button glyph](../index.md#replacing-the-button-glyph)),
carry `lang` on that text too, for the same reason.

## Keyboard contract

None of this comes from the platform — the component implements all of
it.

On the **button**:

| Key                             | Action                                                |
| ------------------------------- | ----------------------------------------------------- |
| Tab / Shift+Tab                 | Move focus to / from the button. It is the only tab stop while the list is closed. |
| Arrow Down / Enter / Space      | Open the list with the current locale active (the first option when nothing is selected). Focus moves to the list. |
| Arrow Up                        | Open the list with the **last** option active. Focus moves to the list. |

On the **open listbox**:

| Key                     | Action                                                        |
| ----------------------- | ------------------------------------------------------------- |
| Arrow Down / Arrow Up   | Move the active option. **Clamps** at the first and last option — it does not wrap. |
| Home / End              | Jump to the first / last option.                              |
| Enter / Space           | Select the active option, apply it, close the list, and return focus to the button. |
| Escape                  | Close and return focus to the button **without** changing the locale. |
| Tab                     | Close the list and let focus move on to the next element.     |
| Any printable character | Typeahead over the option **labels**. The buffer resets after 500 ms of inactivity. |

Pointer equivalents: clicking an option selects it, clicking the button
toggles the list, and clicking outside the control — or moving focus
out of it — closes the list without changing the locale.

The list itself holds DOM focus while open (it is `tabindex="-1"`); the
option under the cursor is conveyed with `aria-activedescendant` rather
than by focusing it. That is the APG-specified model, and it is also
the source of the fragility described under
[Tradeoffs](#tradeoffs-of-an-icon-button-and-a-custom-listbox) below.

## Focus management on locale change

Focus moves in exactly two places, both deliberate:

- **On open**, from the button to the listbox.
- **On select, `Escape`, or a second click on the button**, back to the
  button.

`Tab`, a click outside, and focus leaving the control all close the
list *without* pulling focus back, because the user has already chosen
where focus should go.

The net effect is that focus always ends up where it started — on the
button — so WCAG 3.2.2 (On Input) holds: changing a setting does not
cause a context change. Avoid `router.push()` calls in `onChange` that
scroll the page; if you must navigate, scroll-restore to the control's
position so the user can keep choosing.

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when user lands on the button |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop up button, collapsed" → on open, "Language, list box" then the active option. Arrow announces each option with its `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language button, collapsed" → on open, "Language list box, English, 1 of 5". Pronounces "Français" in a French voice if one is installed. |
| JAWS       | Windows  | Chrome    | "Language button, collapsed" → on open, "Language list box, English". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate" → on open, the list and the active option. |

Two things to notice in that table:

- **Nothing announces the active language while the list is closed.**
  A native `<select>` says "combo box, English"; this control says
  "button, collapsed". That gap is what the
  [status region](#the-status-region-is-the-default-pattern) exists to
  fill.
- **The open-list announcements vary more than they used to.** They
  depend on the reader tracking `aria-activedescendant`, which is less
  uniform than the platform-level handling a native `<select>` gets.

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), then the per-option `lang` attribute is technically
incorrect: the visible text is English even though the attribute says
French, and a reader with a French voice installed will mispronounce
"French" as if it were a French word.

The component emits `lang` unconditionally, so there is no prop that
turns this off — `children` replaces the button glyph, not the options.
The fix is to change the labels, not the markup: prefer endonyms, so
the attribute stays truthful.

```tsx
<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
    value={locale}
    onChange={setLocale}
/>
```

This is also the better default for the users who most need the
control: someone who reads only Arabic can find "العربية" in the list,
but cannot find "Arabic".

## Tradeoffs of an icon button and a custom listbox

The control used to be a native `<select>`. Replacing it with a button
plus a custom listbox bought styling control over the option list and
an icon-sized closed control, and it cost three things. None of them is
fatal, and all of them are worth knowing before you ship.

### (a) The accessible name rests entirely on `aria-label`

The button's only content is a glyph marked `aria-hidden="true"`. There
is no visible text and no associated `<label>`, so the `label` prop —
surfaced as `aria-label` — is the *sole* source of the button's
accessible name. If it is missing, empty, or left in the wrong
language, the control announces as "button" and fails WCAG 4.1.2.

Consequences worth planning for:

- `label` must be translated along with the rest of your UI. It is not
  decorative.
- Voice-control users say the accessible name to activate the control
  ("click Language"). Pick a word that matches what a user would call
  it, and prefer it matching any visible caption nearby.
- If you supply your own glyph via `children`, keep it `aria-hidden`
  and keep `label` — do not try to name the button with glyph text.

### (b) A custom listbox has weaker assistive-tech support than a native `<select>`

A native `<select>` is handled at the platform level: the operating
system draws the option list, and every screen reader has
special-cased it for decades. It announces its value while collapsed,
gets the OS picker on mobile, and behaves identically everywhere.

A `<div>` / `<ul>` listbox gets none of that for free. It works because
the ARIA attributes are correct, and it depends in particular on the
reader following `aria-activedescendant` as the active option moves.
That support is real but less uniform: behaviour differs across screen
reader and browser combinations, in ways that a native `<select>`
simply does not.

Practical implications:

- **Test on real readers**, not just axe. Automated checks confirm the
  attributes are present; they cannot confirm that NVDA + Firefox
  announces the right option as you arrow through it.
- **Retest after any change** to open/close, focus transfer, or
  active-index handling. Those are the fragile parts.
- **On mobile**, you get your CSS rather than the OS picker. Give
  options a large touch target (WCAG 2.5.8 / 2.5.5) and make sure the
  list is scrollable within the viewport.
- If your product's priority is maximum assistive-technology
  robustness over visual control, a native `<select>` remains the
  safer primitive, and it is a legitimate reason to fork this helper.

### (c) The globe glyph is font-dependent and culturally loaded

The default glyph is U+1F310 GLOBE WITH MERIDIANS followed by U+FE0E
VARIATION SELECTOR-15, which forces monochrome text presentation. Two separate
problems come with it.

**It may not render.** Emoji coverage depends on the platform's fonts.
Depending on OS, browser, and font stack the glyph may render in
colour, render monochrome, render at a different weight or baseline
than surrounding text, appear as a "tofu" box, or be missing entirely.
Locked-down corporate desktops and minimal Linux installs are the usual
offenders. Nothing in the package can fix this — the package ships no
fonts by design.

**A globe is not a universal symbol for "language".** The convention is
learned, not intrinsic. It is also visually parochial: most globe
glyphs show one particular hemisphere, so the icon literally centres a
region of the world — a poor look for a control whose entire purpose is
serving people from elsewhere. Some users read a globe as "region",
"country", or "internet" rather than "language".

If you need certainty, supply your own glyph through `children`:

```tsx
<LocaleSelect label="Language" locales={LOCALES} value={locale} onChange={setLocale}>
    {({ value, labelFor }) => (
        <span aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" focusable="false">
                {/* your own icon, shipped with your app */}
            </svg>
            {labelFor(value)}
        </span>
    )}
</LocaleSelect>
```

An inline SVG renders identically everywhere, and pairing it with the
active language's endonym — as above — also softens tradeoff (a) and
the closed-state silence described below. If you can spare the width,
text plus icon is the most robust option available.

## The status region is the default pattern

The closed control is a glyph and nothing else. It does not display the
active language, and because the glyph is `aria-hidden` and a button
has no value, it does not announce one either: a screen-reader user
landing on it hears "{label}, button, collapsed", not the name of the
locale currently in effect.

**So the control is not shipped alone.** Every example in this package,
and the quick start in `index.md`, pairs it with a visible status line:

```tsx
const [locale, setLocale] = useState("en");

<LocaleSelect
    label="Language"
    locales={LOCALES}
    value={locale}
    onChange={setLocale}
/>
<p className="locale-select-status" aria-live="polite">
    Active language: {localeName(locale)}
</p>
```

That pairing is the pattern to copy. Removing the status line is the
deliberate choice you make against the default — not something you opt
into when you happen to care about accessibility.

Why it is shaped this way:

- **Visible, not `sr-only`.** With an icon-only closed control the
  active locale is invisible to *everyone*, not just to screen-reader
  users. A visible line serves sighted users and cognitive
  accessibility, and AAA favours showing state over hiding it (WCAG
  1.4.1 — no colour-only meaning). Teams that truly cannot spare the
  line should hide the element with a visually-hidden class (see
  [index.md § Styling the status line](../index.md#styling-the-status-line))
  and keep it in the DOM.
- **`aria-live="polite"`, not `role="alert"`.** A polite live region
  announces *mutations*, so it is silent on first paint and speaks once
  per user-initiated change, without moving focus (WCAG 3.2.2).
- **Human name, not the raw code.** Use the exported `localeName()`
  (or your `localeLabels` value) so the line reads "Active language:
  French" rather than "Active language: fr".
- **Consider `lang` on the status text.** If you show the endonym
  ("Français") rather than the viewer-language name ("French"), put
  `lang={bcp47LocaleTag(locale)}` on the element — same WCAG 3.1.2
  reasoning as the per-option `lang` above, so the announcement is
  pronounced correctly.

**Honest limits.** A live region announces *transitions*; it does not
give the control a queryable value. A user who tabs back to the button
later — rather than being present for the change announcement — still
hears "{label}, button, collapsed" and has to open the list to find out
which option is selected. The status text is the only durable record on
screen, which is another reason to keep it visible.

The strongest fix is not the live region at all: put the active
language *in the button*, via the `children` glyph override (see
[tradeoff (c)](#c-the-globe-glyph-is-font-dependent-and-culturally-loaded)).
Then the control names its own state, the live region becomes belt and
braces, and only the width cost remains.

One thing genuinely is unaffected: the document root's `lang` attribute
still reflects the active locale, so assistive technology continues to
switch voice correctly. Only the *announcement of the control's state*
is lost.

The region's copy stays the consumer's to own — the helper does not
render one, because only the consumer knows the surrounding wording and
locale.

## Long locale lists

The listbox is one widget regardless of list length, so it scales to
100+ locales without dominating the layout, and the built-in typeahead
(type a label prefix while the list is open) makes long lists navigable
by keyboard. The cost is discoverability: choices are hidden until the
list is opened.

For free-text filtering over hundreds of entries — an editable combobox
— this helper is not the right tool. `children` cannot replace the
control, only the glyph. Build a combobox on the Lily™ headless
`Combobox` primitive or an established library (Radix UI, Ark UI,
Headless UI), and reuse this package's exported pure helpers
(`bcp47LocaleTag`, `isRtlLocale`, `matchNavigatorLanguage`,
`defaultLocaleLabels`) for the logic.

See [examples/all-locales.tsx](../examples/all-locales.tsx) for all 436
locales driven by the built-in typeahead.

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility. Style both state hooks,
and do not use colour alone for either:

```css
.locale-select-option[aria-selected="true"] {
    color: #003087; /* NHS blue, AAA on white */
    font-weight: 600;
}

.locale-select-option[data-active] {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
```

The `data-active` treatment matters more than it looks: because the
`<ul>` holds focus rather than the option, sighted keyboard users have
no browser-drawn focus ring on the option itself. Whatever you put on
`[data-active]` *is* the focus indicator, and it should meet WCAG
2.4.13 Focus Appearance — a minimum 2px-wide outline contrasting with
both the option and its background.

Since the list is your CSS rather than the OS picker, also give it an
opaque background and a high enough `z-index` that it is not rendered
over content behind it.

## RTL focus order

Options stay in the order they appear in your `locales` array; the
visual flip comes from `dir="rtl"` on an ancestor and your logical CSS
properties. `ArrowDown` and `ArrowUp` always follow DOM order, which is
what APG specifies for a vertical listbox.

## React-specific notes

- The select file is a client component (`"use client"`). The consumer
  file importing the select must also be a client component if it
  manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The select's
  `initialisedRef` guards against double-application; tests cover the
  StrictMode path.
- `onChange` is called with the consumer's locale form (`en_US`), not
  the BCP 47 hyphen form. Round-trips stay lossless.
- Option ids come from React's `useId`, so they are stable across
  server and client render. `aria-controls` and `aria-activedescendant`
  therefore point at real ids after hydration — a hand-rolled random id
  would break both silently.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- WCAG 2.4.13 Focus Appearance:
  <https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance>
- WCAG 4.1.2 Name, Role, Value:
  <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>

---

Lily™ and Lily Design System™ are trademarks.
