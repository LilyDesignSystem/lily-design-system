# Accessibility

The select targets **WCAG 2.2 AAA** and uses a native HTML `<select>`
element (implicit `combobox` role). This page lists what's built in and
what remains the consumer's responsibility.

## Built-in

| WCAG / APG item              | How the select satisfies it |
| ---------------------------- | --------------------------- |
| WCAG 3.1.1 Language of Page  | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<option>` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<select aria-label>` exposes the combobox; each `<option>` exposes a choice. |
| WCAG 2.1.1 Keyboard          | Tab to the select; Arrow keys move selection; typeahead jumps — all from native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible     | The browser's default focus ring is preserved; the select never sets `outline: none`. |
| WCAG 1.4.1 Use of Color      | Selection state is exposed via the native `<option>` selected state and reflected in the `lang` attribute — not colour alone. |
| WCAG 3.2.2 On Input          | Selection change does not move focus or context. |
| MDN — `<select>` element     | Single-selection native combobox with keyboard support provided by the platform. |

## Per-option `lang` is important

The default rendering carries each `<option lang="…">`. This satisfies
WCAG 3.1.2 (Language of Parts): when a screen reader encounters the
option "Français" inside an English page, the `lang` attribute makes the
reader switch to a French voice for the duration of that option.

Without the per-option `lang`, "Français" gets pronounced "Franc-ess"
in an English voice. With it, the reader says "Fran-SAY".

The same logic applies when you render a custom `<select>` via the
children render prop. Always carry the locale's BCP 47 tag onto each
`<option>`:

```tsx
<LocaleSelect label="Language" locales={locales}>
    {({ locales, value, setLocale, labelFor, tagFor }) => (
        <select
            value={value}
            onChange={(e) => setLocale(e.target.value)}
        >
            {locales.map((l) => (
                <option key={l} value={l} lang={tagFor(l)}>
                    {labelFor(l)}
                </option>
            ))}
        </select>
    )}
</LocaleSelect>
```

## Keyboard contract

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus to / from the select; it is a single tab stop.       |
| Arrow Down / Arrow Up  | Select the next / previous option.                              |
| Home / End             | Select the first / last option.                                 |
| Typeahead              | Type to jump to a matching option.                              |
| Enter / Space          | Open the option list (platform-dependent).                      |
| Escape                 | Close the option list.                                          |

This is all native behaviour. The select does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale changes.
This is the WCAG 3.2.2 (On Input) contract: changing a setting must not
cause a focus or context change. Avoid `router.push()` calls in
`onChange` that scroll the page; if you must navigate, scroll-restore
to the select's position so the user can keep choosing.

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English" → on open, "English, 1 of 5". Arrow announces the next option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, 1 of 5, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), then the per-option `lang` attribute is technically
incorrect (the visible text is English even though the attribute says
French). In that case, drop the `lang` attribute by using a custom
`children` render prop:

```tsx
<LocaleSelect label="Language" locales={locales} localeLabels={EN_LABELS}>
    {({ locales, value, setLocale, labelFor }) => (
        <select
            className="locale-select"
            value={value}
            onChange={(e) => setLocale(e.currentTarget.value)}
        >
            {locales.map((l) => (
                <option key={l} className="locale-select-option" value={l}>
                    {labelFor(l)}
                </option>
            ))}
        </select>
    )}
</LocaleSelect>
```

The default rendering's tradeoff is: the labels show **in their own
language** (English / Français / العربية), so per-option `lang` is
correct and helpful. If you override the labels to be all in the
viewer's language, override the markup too.

## Native `<select>` accessibility

The default rendering is a native `<select>` (see
[examples/01-radios.tsx](../examples/01-radios.tsx)), and the children
render prop supports a custom `<select>` (see
[examples/02-select.tsx](../examples/02-select.tsx)). Native `<select>`
is fully accessible:

- Keyboard: Enter / Space / Down arrow open the list; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + the displayed value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android dialog).

## The status region is the default pattern

The `<select>` always displays its leading placeholder option, so its
own value stays empty and never tracks the selection. That keeps the
control as narrow as the placeholder word no matter how long the locale
names are, but it costs something real: a screen-reader user focusing
the control hears "{placeholder ?? label}" rather than the name of the
locale currently in effect, and there is no longer a selected-option
state to announce.

**So the select is not shipped alone.** Every example in this package,
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

- **Visible, not `sr-only`.** Once the control snaps back to the
  placeholder the active locale is invisible to *everyone*, not just to
  screen-reader users. A visible line serves sighted users and
  cognitive accessibility, and AAA favours showing state over hiding it
  (WCAG 1.4.1 — no colour-only meaning). Teams that truly cannot spare
  the line should hide the element with a visually-hidden class (see
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

**Honest limits.** This does not fully restore what the pinned
placeholder costs. The control's *own* accessible value is still the
placeholder word, so a user who tabs back to the select later — rather
than being present for the change announcement — still hears
"Language", not "Français". A live region announces transitions; it
does not give the combobox a queryable value. The status text is the
only durable record on screen, which is another reason to keep it
visible. If your product needs the control itself to report its value,
drop the placeholder pinning instead and let the `<select>` bind
normally.

One thing genuinely is unaffected: the document root's `lang` attribute
still reflects the active locale, so assistive technology continues to
switch voice correctly. Only the *announcement of the control's value*
is lost.

The region's copy stays the consumer's to own — the helper does not
render one, because only the consumer knows the surrounding wording and
locale.

The tradeoff:

- Compact (one widget regardless of list length).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability).
- Can't show option text in mixed scripts as easily (some OS selects
  don't honour per-option `lang`).

For very long lists (50+), prefer a combobox with type-ahead.

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern. The
APG Combobox specification is intricate (focus-on-listbox vs
focus-on-input, auto-complete vs none, vertical vs grid). This helper
doesn't ship a combobox; use the `children` render prop to render the
upstream Lily™ `Combobox` headless primitive or an established library
(Radix UI, Ark UI, Headless UI).

See [examples/10-combobox.tsx](../examples/10-combobox.tsx) for a
minimal in-line combobox built on a `<datalist>` (≈APG Combobox with
List Autocomplete and Manual Selection).

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility. A safe default for the
selected option:

```css
.locale-select option:checked {
    color: #003087; /* NHS blue, AAA on white */
    font-weight: 600;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused element
and the background.

## RTL focus order

In RTL layout, the native `<select>` and its option list mirror
automatically. The options stay in the order they appear in your
`locales` array; the browser handles the visual flip. This is the
browser's job, not yours.

## React-specific notes

- The select file is a client component (`"use client"`). The consumer
  file importing the select must also be a client component if it
  manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The select's
  `initialisedRef` guards against double-application; tests cover the
  StrictMode path.
- `onChange` is called with the consumer's locale form (`en_US`), not
  the BCP 47 hyphen form. Round-trips stay lossless.

## References

- MDN — `<select>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
- WAI-ARIA APG — Combobox pattern (for a custom combobox render prop):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
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
