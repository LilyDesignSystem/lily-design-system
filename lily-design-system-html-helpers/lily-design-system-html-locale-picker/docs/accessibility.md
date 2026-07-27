# Accessibility

The select targets **WCAG 2.2 AAA**. The control is an icon button
that opens a `role="listbox"` dropdown, implementing the WAI-ARIA APG
listbox pattern in JavaScript. It is **not** a native `<select>`, and
that is the single most important fact on this page: everything the
platform used to provide for free is now this element's own code, and
some of it cannot be reproduced at all.

This page lists what's built in, what the tradeoffs are, and what
remains the consumer's responsibility.

## Built-in

| WCAG / APG item | How the select satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<li role="option">` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | The button carries `aria-label`, `aria-haspopup="listbox"`, and `aria-expanded`; the `<ul>` carries `role="listbox"` and `aria-label`; each `<li>` carries `role="option"` and `aria-selected`. |
| WCAG 2.1.1 Keyboard | Full APG listbox keyboard contract, implemented in JS — see below. |
| WCAG 2.1.2 No Keyboard Trap | `Escape` and `Tab` both close the list; `Tab` deliberately does not pull focus back to the button. |
| WCAG 2.4.3 Focus Order | Opening moves focus to the list; selecting or cancelling returns it to the button. The button is the control's only tab stop. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the element never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection is exposed via `aria-selected` and the hidden input's value, and the active option via `data-active` — never colour alone. Consumer CSS must also give both a non-colour signal. |
| APG Listbox pattern | `aria-activedescendant` on the list, `role="option"` + `aria-selected` on each item, focus on the list container. |

## The focus model: `aria-activedescendant`

This is the part most likely to surprise someone reading the DOM.

While the list is open, **DOM focus sits on the `<ul>`**, not on any
`<li>`. The options are never focusable and never have `tabindex`.
Which option is "current" is communicated purely by
`aria-activedescendant` on the `<ul>`, pointing at that option's `id`:

```html
<ul class="locale-chooser-list" id="locale-chooser-1-list" role="listbox"
    aria-label="Language" tabindex="-1"
    aria-activedescendant="locale-chooser-1-option-2">
    <li id="locale-chooser-1-option-0" role="option" aria-selected="true" lang="en">English</li>
    <li id="locale-chooser-1-option-1" role="option" aria-selected="false" lang="fr">Français</li>
    <li id="locale-chooser-1-option-2" role="option" aria-selected="false" data-active lang="ar">العربية</li>
</ul>
```

`aria-activedescendant` is present **only while the list is open**;
closing removes it entirely.

Two attributes, two meanings — do not conflate them:

| Attribute                 | Means                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `aria-selected="true"`    | This is the **applied** locale. Survives closing the list.    |
| `data-active`             | This is the **keyboard-highlighted** option. Follows the arrow keys; gone when closed. |

A user arrowing down through the list moves `data-active` and
`aria-activedescendant`, and changes nothing else. Only `Enter`,
`Space`, or a click moves `aria-selected` and applies the locale.

## Keyboard contract

Implemented in JavaScript. The platform provides none of it.

On the **button**:

| Key                              | Action                                                                   |
| -------------------------------- | ------------------------------------------------------------------------ |
| Tab / Shift+Tab                  | Move focus into / out of the control. The button is the only tab stop.   |
| ArrowDown / Enter / Space        | Open the list with the selected option active (or the first when none).  |
| ArrowUp                          | Open the list with the **last** option active.                           |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key                  | Action                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| ArrowDown / ArrowUp  | Move the active option one step. **Clamps** at both ends — no wrapping.     |
| Home / End           | Jump to the first / last option.                                            |
| Enter / Space        | Select the active option, apply it, close, return focus to the button.      |
| Escape               | Close and return focus to the button **without** changing the locale.       |
| Tab                  | Close without stealing focus back, so focus lands where the user was going. |
| printable character  | Typeahead over the option **labels**; the buffer resets after 500 ms. Search runs forward from the active option and wraps once. |

Pointer and focus behaviour: clicking an option selects and applies
it; clicking the button toggles the list; clicking outside the
rendered root closes it; focus leaving the root closes it.

The clamping (rather than wrapping) choice matches the APG's default
listbox recommendation: wrapping makes it easy to overshoot past the
end of a long locale list without noticing.

## Per-option `lang` is important

Each `<li role="option">` carries `lang="…"`. This satisfies WCAG
3.1.2 (Language of Parts): when a screen reader encounters the option
"Français" inside an English page, the `lang` attribute makes the
reader switch to a French voice for the duration of that item.

Without it, "Français" gets pronounced "Franc-ess" in an English
voice — comprehensible but ugly. With it, the reader says "Fran-SAY".

```html
<li class="locale-chooser-option" role="option" aria-selected="true" lang="en">English</li>
<li class="locale-chooser-option" role="option" aria-selected="false" lang="fr">Français</li>
<li class="locale-chooser-option" role="option" aria-selected="false" lang="ar">العربية</li>
```

The button and the `<ul>` carry **no `lang`**. They are chrome, not
locale-specific content: the button holds a glyph and the list holds
options in many languages, so tagging either with a single language
would be a lie.

## Tradeoffs

Three, and none of them are small.

### 1. It is an icon-only control

The accessible name depends **entirely** on `aria-label`, sourced
from the `label` attribute. There is no visible text to fall back on,
so:

- A vague `label` (`"Select"`, `"Options"`) leaves the control close
  to unusable for a screen-reader user. `label` is now load-bearing
  in a way it was not when the control was a native `<select>` with
  an adjacent `<label>`.
- **The control fails WCAG 2.5.3 Label in Name unless you add a
  visible label of your own.** 2.5.3 requires that the accessible
  name contain the visible label text; an icon with no visible text
  has no visible label to match, and speech-input users
  ("click Language") have nothing to say. If you need 2.5.3 — and at
  AAA you do — pair the control with a visible text label or a
  visible caption and make sure `label` matches it.

The glyph itself is `aria-hidden="true"`, deliberately: an unhidden
emoji would otherwise be announced as "globe with meridians" and
could become the accessible name.

### 2. A custom listbox is weaker than a native `<select>`

The previous native `<select>` got, for free and battle-tested in
every assistive technology on every platform:

- combobox semantics and the platform's own announcement phrasing,
- the platform keyboard behaviour, including typeahead,
- the **native mobile picker** — the iOS scroll wheel, the Android
  dialog,
- correct behaviour inside form autofill, browser translation
  toolbars, and zoom/reflow modes.

A hand-rolled `role="listbox"` + `aria-activedescendant` widget is
well-specified by the APG, but support for it is weaker and more
variable across screen readers, and considerably more variable on
mobile browsers, where `aria-activedescendant` is historically the
shakiest part of the ARIA surface. Touch screen-reader users
(VoiceOver iOS, TalkBack) navigate by swiping through elements rather
than by arrow keys, which is exactly the interaction model
`aria-activedescendant` serves least well.

This element does not get the native mobile picker and cannot. If
your audience is mobile-first and screen-reader-heavy, render a native
`<select>` of your own against `el.locales` / `el.value` and let this
element handle only the application and persistence — every helper in
this catalog now uses the listbox shape, so there is no longer a
native-`<select>` sibling to copy.

### 3. Glyph rendering is platform-dependent

The button's glyph is a plain Unicode character — U+1F310 GLOBE WITH
MERIDIANS followed by U+FE0E VARIATION SELECTOR-15 — and this package
bundles no fonts or icon assets (Lily ships neither). It may render as
a monochrome glyph or as tofu, depending entirely on the platform's
installed fonts. The globe in particular varies a lot: different
platforms show different continents, different sizes, and some Linux
font stacks show nothing at all.

VS15 requests the *text* presentation, which is what keeps the glyph
monochrome and consistent with theme-chooser's ◑ (U+25D1 is not an
emoji codepoint and needs no selector). Some platforms ignore the
request and render the colour-emoji globe anyway; `font-variant-emoji:
text` on `.locale-chooser-icon` forces it where supported.

If you need a guaranteed appearance, override `renderButtonContent()`
with your own inline SVG — see
[`./custom-rendering.md`](./custom-rendering.md#guaranteeing-the-glyphs-appearance).
This is a one-method subclass and does not touch the accessibility
contract.

## The status region is the default pattern

The closed button shows **only a glyph**. The active locale is
therefore not visible anywhere in the control and not announced as
its value — which makes the compensating status region more useful
now than it was under the previous rendering, not less.

**Ship it unless you have a specific reason not to.** It is in
[`../examples/01-basic.html`](../examples/01-basic.html) and in
the `index.md` quick start, so the first thing an adopter copies
already has it. Leaving it out is the deliberate choice — a decision
to make knowingly, with a reason — not something to opt into later.

```html
<locale-chooser label="Language" locales="en,fr,ar"></locale-chooser>

<p class="locale-chooser-status" aria-live="polite">Active language: English</p>

<script type="module">
    import { localeName } from "/dist/locale-chooser.js";

    await customElements.whenDefined("locale-chooser");

    const status = document.querySelector(".locale-chooser-status");

    document.querySelector("locale-chooser")
        .addEventListener("localechange", (e) => {
            status.textContent = `Active language: ${localeName(e.detail.locale)}`;
        });
</script>
```

Why it is shaped this way:

- **Visible, not `sr-only`.** The gap is not screen-reader-only:
  nothing in the control indicates the active locale to *anyone*. A
  visible line answers "which language am I on?" for sighted users
  and helps cognitive accessibility, which is what AAA favours. It
  also doubles as the visible label that WCAG 2.5.3 wants (see
  tradeoff 1). For designs that genuinely cannot spare the space, use
  a visually-hidden variant (`position: absolute; width: 1px;
  height: 1px; overflow: hidden; clip-path: inset(50%)`) — keep the
  element in the accessibility tree; never `display: none`.
- **`aria-live="polite"` announces mutations only**, so the region is
  silent on first paint and speaks once per change. No interruption,
  no page-load chatter.
- **Initial text authored in the markup**, not written by JS at
  startup — a startup write is a mutation, and mutations are what the
  live region announces. With `storage-key` or
  `detect-from-navigator`, render it from the same resolved value you
  inline as the `value` attribute (see [ssr.md](./ssr.md)).
- **`localeName()` gives the human name**, so the line reads "Active
  language: Français" rather than "Active language: fr". If your
  status text is written in the viewer's language rather than the
  locale's own, add `lang` to the name span accordingly — the same
  Language-of-Parts reasoning as the `<li>` elements above.

### What this does and does not fix

It restores the *information*, not the *semantics*. A screen-reader
user tabbing onto the button still hears only the label and the
collapsed state — they must read on, or open the list and hear
`aria-selected`, to learn the active value. That is a genuine
residual cost of an icon-only trigger. If your users depend on the
control itself announcing its value, override
`renderButtonContent()` to put the active locale's name in the button
(tier 1 in [`./custom-rendering.md`](./custom-rendering.md)) and
accept the wider control.

## Focus management on locale change

Changing the locale does not move focus anywhere on the page — that
is the WCAG 3.2.2 (On Input) contract: changing a setting must not
cause a focus or context change.

The element does move focus *within* the control, which the APG
listbox pattern requires: opening moves focus to the `<ul>`, and
selecting or cancelling returns it to the button. `Tab` is the
exception and closes without pulling focus back, so it lands wherever
the user was headed.

Avoid navigation calls in `localechange` handlers that scroll the
page; if you must navigate, scroll-restore to the control's position
so the user can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when the user lands on the closed button |
| ---------- | -------- | --------- | ---------------------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed". Opening announces "Language, list box"; arrowing announces each option with its `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language button collapsed". Opening announces "Language list box"; arrowing announces "Français" in a French voice if a French voice is installed. |
| JAWS       | Windows  | Chrome    | "Language button collapsed". Opening enters the list; arrow keys announce each option and its selected state. |
| VoiceOver  | iOS      | Safari    | "Language, button". Swipe navigation reaches the options individually once open; `aria-activedescendant` is not used by touch navigation, so the highlighted option and the swiped-to element can diverge. |
| TalkBack   | Android  | Chrome    | "Language, button, collapsed, double-tap to activate". Same divergence caveat as iOS. |

The mobile rows are the concrete form of tradeoff 2. Verify on real
devices before shipping to a mobile-first audience.

"lang-correct pronunciation" depends on the reader having a matching
voice package installed. NVDA's default ships with English only;
users add other voices through eSpeak NG or commercial voice packs.

## When per-option `lang` does NOT help

If your `locale-labels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the user
recognises them), the per-option `lang` attribute is technically
incorrect: the visible text is English even though the attribute says
French. In that case, drop the attribute by subclassing:

```ts
class ViewerLanguageLocaleChooser extends LocaleChooser {
    connectedCallback() {
        super.connectedCallback();
        for (const option of this.querySelectorAll(".locale-chooser-option")) {
            option.removeAttribute("lang");
        }
    }
}
customElements.define("viewer-language-locale-chooser", ViewerLanguageLocaleChooser);
```

The default rendering's assumption is that labels show **in their own
language** (English / Français / العربية), which makes per-option
`lang` correct and helpful. Override the labels and you should
override the markup too.

## Consumer CSS responsibilities

The package ships no CSS, which makes several things your job:

- **Positioning.** The `<ul>` renders in normal flow until you give
  the root `position: relative` and the list `position: absolute`.
  Without it the list pushes page content around when it opens — a
  reflow that is disorienting and can break WCAG 1.4.13
  (Content on Hover or Focus) expectations.
- **Respect `hidden`.** The element toggles the `hidden` attribute on
  the `<ul>`. Any rule that sets `display` on `.locale-chooser-list`
  will defeat it; guard with `.locale-chooser-list[hidden] { display:
  none; }`.
- **Distinguish `[data-active]` from `[aria-selected="true"]`
  without relying on colour alone.** They mean different things (see
  the focus-model section) and WCAG 1.4.1 applies to both. A
  background change for active and a checkmark or weight change for
  selected works well.
- **A visible focus ring on the button and the list.** Both receive
  focus.

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility.

```css
.locale-chooser-button:focus-visible,
.locale-chooser-list:focus-visible {
    /* WCAG AAA-grade contrast against white */
    outline: 3px solid #003087; /* NHS blue */
    outline-offset: 2px;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused element
and the background.

## RTL focus order

The button is a single tab stop, so Tab order is unaffected by
direction. Inside the open list, ArrowDown / ArrowUp always move
through the options in source order — the same order as your
`locales` array — regardless of `dir`.

Position the dropdown with logical properties
(`inset-inline-start`, not `left`) so it flips with the document
direction when the user selects an RTL locale.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 2.5.3 Label in Name:
  <https://www.w3.org/WAI/WCAG22/Understanding/label-in-name>
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
