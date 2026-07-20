# Accessibility

The select targets **WCAG 2.2 AAA** using the native `<select>`
(platform combobox / listbox) model. This page lists what's built
in and what remains the consumer's responsibility.

## Built-in

| WCAG / APG item | How the select satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<option>` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<select aria-label>` (implicit `role="combobox"`) exposes the control; `<option>` exposes each choice. |
| WCAG 2.1.1 Keyboard | Tab into the control; Arrow / Home / End move selection; typeahead jumps — all from native `<select>` semantics. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the select never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is exposed via the `<select>`'s value and reflected in the `lang` attribute — not colour alone. |
| Platform combobox model | Single-selection `<select>` with full keyboard support — provided by the platform. |

## Per-option `lang` is important

The default rendering carries `lang="…"` on each `<option>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen
reader encounters the option "Français" inside an English page,
the `lang` attribute makes the reader switch to a French voice for
the duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The default rendering already carries the locale's BCP 47 tag onto
each `<option>`:

```html
<select>
    <option value="en" lang="en">English</option>
    <option value="fr" lang="fr">Français</option>
    <option value="ar" lang="ar">العربية</option>
</select>
```

## Keyboard contract

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus into / out of the control; it counts as one stop.    |
| Arrow Down / Up        | Move selection to the next / previous option.                   |
| Home / End             | Move selection to the first / last option.                      |
| typeahead              | Jump to the option whose text matches the typed characters.     |
| Enter / Space          | Open the option list (where the platform pops one).             |
| Escape                 | Close the open option list.                                     |

This is all native behaviour. The select does not add JS keyboard
handlers — it doesn't need to.

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid navigation
calls in `localechange` handlers that scroll the page; if you must
navigate, scroll-restore to the select's position so the user can
keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user lands on the control |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". Arrow announces the next option's `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language combo box, English 1 of 5". Pronounces "Français" in French voice if French voice installed. |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## When per-option `lang` does NOT help

If your `locale-labels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect. In that case, drop the `lang` attribute by
subclassing:

```ts
class ViewerLanguageLocaleSelect extends LocaleSelect {
    connectedCallback() {
        super.connectedCallback();
        for (const option of this.querySelectorAll("option.locale-select-option")) {
            option.removeAttribute("lang");
        }
    }
}
customElements.define("viewer-language-locale-select", ViewerLanguageLocaleSelect);
```

The default rendering's tradeoff is: the labels show **in their
own language** (English / Français / العربية), so per-option
`lang` is correct and helpful. If you override the labels to be
all in the viewer's language, override the markup too.

## Tradeoff: the placeholder hides the active locale

The `<select>` keeps its own selection pinned to the leading
placeholder option, so the closed control always reads
`placeholder ?? label` — "Locale" — rather than the active locale
name. This keeps the control narrow, but it costs something real:

**A screen-reader user no longer hears the active locale announced
as the combobox value.** Where a sighted user sees no visual
regression (they were reading the label anyway), an assistive-
technology user loses the one place the current selection was
previously spoken. The same applies to the visual state: nothing in
the control itself now indicates which locale is active.

Note that the element still writes `lang` on the target, so the
AT's own language engine continues to switch pronunciation
correctly — only the *spoken value of the control* is affected.

## The status region is the default pattern

Because of that gap, **the select ships paired with a compensating
status region**. It is in
[`examples/01-radios.html`](../examples/01-radios.html) and in the
`index.md` quick start, so the first thing an adopter copies already
has it. Leaving it out is the deliberate choice — a decision to make
knowingly, with a reason — not something to opt into later:

```html
<locale-select label="Language" locales="en,fr,ar"></locale-select>

<p class="locale-select-status" aria-live="polite">Active language: English</p>

<script type="module">
    import { localeName } from "/dist/locale-select.js";

    await customElements.whenDefined("locale-select");

    const status = document.querySelector(".locale-select-status");

    document.querySelector("locale-select")
        .addEventListener("localechange", (e) => {
            status.textContent = `Active language: ${localeName(e.detail.locale)}`;
        });
</script>
```

Why it is shaped this way:

- **Visible, not `sr-only`.** The gap is not screen-reader-only:
  nothing in the control indicates the active locale to *anyone*. A
  visible line answers "which language am I on?" for sighted users
  and helps cognitive accessibility, which is what AAA favours. For
  designs that genuinely cannot spare the space, use a
  visually-hidden variant (`position: absolute; width: 1px;
  height: 1px; overflow: hidden; clip-path: inset(50%)`) — keep the
  element in the accessibility tree; never `display: none`.
- **`aria-live="polite"` announces mutations only**, so the region
  is silent on first paint and speaks once per change. No
  interruption, no page-load chatter.
- **Initial text authored in the markup**, not written by JS at
  startup — a startup write is a mutation, and mutations are what
  the live region announces. With `storage-key` or
  `detect-from-navigator`, render it from the same resolved value
  you inline as the `value` attribute (see [ssr.md](./ssr.md)).
- **`localeName()` gives the human name**, so the line reads
  "Active language: Français" rather than "Active language: fr".
  If your status text is written in the viewer's language rather
  than the locale's own, add `lang` to the name span accordingly —
  the same Language-of-Parts reasoning as the `<option>` elements
  above.

### What this does and does not fix

It restores the *information*, not the *semantics*. The combobox's
own accessible value is still the placeholder; a screen-reader user
tabbing onto the control still hears "Language" and must read on to
learn the active value. That is a genuine residual cost of the
placeholder-pinned design. If your users depend on the control
itself announcing its value, don't pin the placeholder — let the
`<select>` track the selection and accept the wider control.

## Native `<select>` accessibility

The default rendering is a native `<select>`, which is fully
accessible:

- Keyboard: Enter / Space / Down arrow open the option list; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count. (Here the announced value is always the placeholder — see
  the tradeoff above.)
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoffs of the `<select>` model:

- Compact (one widget regardless of locale count).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability).
- Can't show option text in mixed scripts as easily (some OS
  selects don't honour per-option `lang`).

For very long lists (50+), prefer a combobox with type-ahead.

## Combobox / listbox

For 50+ locales, a combobox with type-ahead is the right pattern.
The APG Combobox specification is intricate (focus-on-listbox vs
focus-on-input, auto-complete vs none). This helper doesn't ship a
combobox; build one via subclassing or use an upstream Lily™
`Combobox` headless primitive.

See `examples/10-combobox.html` for a minimal in-line combobox
built on a `<datalist>` (≈APG Combobox with List Autocomplete and
Manual Selection).

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility. A safe default
for the selected option's state:

```css
.locale-select:focus-visible {
    /* WCAG AAA-grade contrast against white */
    outline: 3px solid #003087; /* NHS blue */
    outline-offset: 2px;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused
element and the background.

## RTL focus order

The native `<select>` is a single focus stop, so Tab order is
unaffected by direction. Inside the open option list, Arrow Down /
Up always move through the options in source order — which is the
same order as your `locales` array. This is the browser's job, not
yours.

## References

- WAI-ARIA APG — Combobox / Listbox patterns:
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
