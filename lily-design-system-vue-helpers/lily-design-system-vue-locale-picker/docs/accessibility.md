# Accessibility

The chooser targets **WCAG 2.2 AAA**. It is an icon button that opens
a WAI-ARIA APG listbox, so — unlike the native `<select>` it replaced
— the roles, the states, and the whole keyboard contract are the
component's own work rather than the platform's. This page lists
what's built in, what the shape costs you, and what remains the
consumer's responsibility.

## Built-in

| WCAG / APG item | How the chooser satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each `<li role="option">` carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<button aria-label aria-haspopup="listbox" aria-expanded>` exposes the trigger; `<ul role="listbox">` and `<li role="option" aria-selected>` expose the choices. |
| WCAG 2.1.1 Keyboard | The full APG listbox contract is implemented in script — see [Keyboard contract](#keyboard-contract). |
| WCAG 2.4.3 Focus Order | Focus moves to the `<ul>` on open and returns to the button on commit or cancel. The active option travels via `aria-activedescendant`; DOM focus never lands on an `<li>`. |
| WCAG 2.4.7 Focus Visible | The browser's default focus ring is preserved; the component never sets `outline: none`. |
| WCAG 1.4.1 Use of Color | Selection state is in `aria-selected`, the hidden input, and the `lang` / `dir` attributes — not colour alone. |
| WCAG 3.2.2 On Input | Committing a locale returns focus to the button it came from; nothing navigates or scrolls on its own. |

## Roles and properties

```html
<div class="locale-chooser">
    <input type="hidden" name="locale" value="fr" />
    <button type="button" class="locale-chooser-button" aria-label="Language"
            aria-haspopup="listbox" aria-expanded="true"
            aria-controls="locale-chooser-1-list">
        <span class="locale-chooser-icon" aria-hidden="true">🌐</span>
    </button>
    <ul class="locale-chooser-list" id="locale-chooser-1-list" role="listbox"
        aria-label="Language" tabindex="-1"
        aria-activedescendant="locale-chooser-1-option-1">
        <li id="locale-chooser-1-option-0" role="option"
            aria-selected="false" lang="en">English</li>
        <li id="locale-chooser-1-option-1" role="option"
            aria-selected="true" data-active lang="fr">Français</li>
    </ul>
</div>
```

- The **button** carries `aria-haspopup="listbox"`, `aria-expanded`,
  and `aria-controls` pointing at the list's id. Its accessible name
  is `aria-label` and nothing else — the glyph is `aria-hidden`.
- The **listbox** is a `<ul role="listbox">` with the same
  `aria-label`, `tabindex="-1"` so it can take focus on open, and
  `hidden` while closed.
- **`aria-activedescendant` is set only while open** and removed on
  close. Focus stays on the `<ul>` the entire time; the "cursor"
  inside the list is a pointer, not a focus move. This is the APG
  listbox pattern.
- **`aria-selected`** marks the committed locale (exactly one option).
  **`data-active`** marks the keyboard-active row and exists purely so
  consumer CSS can style it — it carries no meaning for assistive
  technology.
- **`lang`** is on each option, never on the button or the list.

## Keyboard contract

Implemented by the component, not the platform.

On the **button**:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| ArrowDown              | Open; active option = the selected one (or the first).          |
| Enter / Space          | Open; active option = the selected one (or the first).          |
| ArrowUp                | Open; active option = the **last** option.                      |
| Tab / Shift+Tab        | Move focus away (native).                                       |

On the **listbox**:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| ArrowDown              | Move the active option down one. Clamps at the end — no wrap.   |
| ArrowUp                | Move the active option up one. Clamps at the start — no wrap.   |
| Home / End             | Jump to the first / last option.                                |
| Enter / Space          | Select the active option, apply it, close, refocus the button.  |
| Escape                 | Close and refocus the button **without** changing the locale.   |
| Tab                    | Close without stealing focus back — Tab moves on as usual.      |
| Printable characters   | Typeahead over the option labels; the buffer resets after 500 ms. |

Pointer and focus behaviour: clicking an option commits it; clicking
outside the root closes the listbox; focus leaving the root closes it.
Cancelling never applies a locale, so an accidental open costs the
user nothing.

The arrows deliberately **clamp** rather than wrap. Wrapping is
permitted by the APG but disorienting in a long list: with 436
locales, one ArrowUp too many at the top should not teleport the user
to Zulu.

## Three tradeoffs of the icon-button shape

The control used to be a native `<select>`. Moving to an icon button
plus a scripted listbox bought a control that costs one glyph of
width regardless of how many locales you support — genuinely useful
when the built-in table runs to 436 entries. It was not free. Three
costs are worth understanding before you ship it.

### 1. The button is icon-only, so `label` is doing all the work

There is no visible text label. The entire accessible name of the
control is the `aria-label` derived from the `label` prop. If `label`
is wrong, missing, or left in a language the user cannot read, the
control is effectively unnamed: a screen-reader user hears "button"
and a sighted user sees a globe with no explanation.

There is a specific irony here that does not apply to the sibling
`ThemeChooser`. **This is a language picker, and its own name is
written in one language.** A user who has landed on a page in a
language they cannot read is precisely the user most likely to need
this control — and `aria-label="Language"` helps them only if they
read English. The control's purpose is to escape a language barrier;
its name sits on the wrong side of that barrier.

Practical mitigations, roughly in order of how much they help:

- **Ship a visible text label next to the button.** A short word plus
  the glyph is far more discoverable than the glyph alone, and it
  gives sighted users something to recognise. This is the strongest
  option if your layout can spare the space.
- **Choose a `label` that travels.** "Language" is widely recognised;
  a language *name* in the user's own script (via a status line, see
  below) is better still. Some products use a multilingual label such
  as `"Language / Langue / اللغة"` for the first few supported
  locales. It is inelegant, and it is also the only thing a
  non-reader of the UI language can act on.
- **Keep the endonyms in the options.** Once the listbox is open, each
  option is in its own language and script — that part works
  regardless of the button's label.

Note that **WCAG 2.5.3 (Label in Name) has nothing to match against
here**. That criterion requires the accessible name to contain the
visible label text; with no visible text, there is no mismatch to
create and the criterion is trivially satisfied. That is a
technicality, not a win — passing 2.5.3 by having no visible label is
exactly the situation 2.5.3 was not written for.

### 2. A custom listbox has weaker AT support than a native `<select>`

A native `<select>` is one of the best-supported controls on the web.
It gets, for free and without a line of script:

- platform-native screen reader behaviour, tested for decades across
  every reader / browser / OS combination;
- the OS picker on touch devices — the iOS wheel, the Android dialog
  — which many mobile users navigate far more fluently than any
  in-page list;
- correct interaction with browse mode and forms mode without the
  author thinking about it;
- keyboard, typeahead, and selection semantics that cannot drift out
  of spec, because the author does not implement them.

A `role="listbox"` + `aria-activedescendant` widget re-implements all
of that in JavaScript. This one is APG-conformant and
keyboard-complete — every clause is covered by a test in
`LocaleChooser.test.ts` — but conformance to the pattern is not the
same as parity with the platform:

- Real-world screen reader coverage of `aria-activedescendant` is
  good but **less uniform** than for a native select, and the
  announcement wording varies more between readers.
- **Browse-mode / forms-mode transitions vary by AT.** NVDA and JAWS
  users may need to enter forms mode explicitly in some contexts,
  where a native select would have switched automatically.
- **There is no native mobile picker.** TalkBack and VoiceOver on
  touch get an in-page list, which is workable but is not the control
  those users have the most practice with.

Be honest with yourself about this one: it is a **real regression in
robustness**, traded for a compact, consistent, fully styleable
control. If your product serves a population where screen reader and
mobile-picker reliability outrank visual compactness — public-sector
services, healthcare, anything with a broad and non-self-selecting
user base — that trade may be the wrong way round for you, and
rendering your own `<select>` bound to the same value is a legitimate
choice.

There is one genuine **win** hiding in here, though. Per-option
`lang` still works, and works *better* than before: some OS-native
select popups ignore `lang` on `<option>` entirely, whereas
`<li role="option" lang="fr">` is ordinary DOM that readers handle
the same way they handle any other inline language change. Endonyms
are pronounced correctly (WCAG 3.1.2) — see
[Per-option `lang` is important](#per-option-lang-is-important).

### 3. Glyph rendering is platform-dependent

The default glyph is 🌐 U+1F310 GLOBE WITH MERIDIANS, supplied by
whatever font or emoji set the user's system provides. That means it
may render:

- as a full-colour emoji (most consumer OSes);
- as a monochrome outline (many Linux desktops, some corporate font
  stacks, `font-variant-emoji: text`);
- at a different weight, size, or baseline alignment than the text
  beside it, which can knock a compact toolbar out of vertical
  rhythm;
- or not at all — a `.notdef` tofu box — on stripped-down systems and
  some kiosk / embedded browsers.

None of that breaks the accessible name, since the glyph is
`aria-hidden="true"`; the control stays operable and correctly named
in every case. But a tofu box is a bad first impression for the one
control a lost user needs to find.

If you care about pixel-level consistency, ship your own artwork
through the default slot. Keep it decorative:

```vue
<LocaleChooser label="Language" :locales="['en', 'fr', 'ar']" v-model:value="locale">
    <template #default>
        <svg class="locale-chooser-icon" width="20" height="20"
             viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <!-- your own globe path -->
        </svg>
    </template>
</LocaleChooser>
```

The slot replaces the glyph only — the listbox, the options, and the
keyboard contract stay component-owned — and the button's accessible
name still comes from `label`, so the SVG must stay `aria-hidden`.

## The status region is the default pattern

Because of the first tradeoff above, the entry-point example in this
package pairs the chooser with a status region, and so does the quick
start in [`index.md`](../index.md). **Shipping it is the default;
removing it is the deliberate choice** you make with your
accessibility reviewer — not something you opt into later.

The reason has changed with the rewrite, and it is now a stronger
one. It used to be that the `<select>` was pinned to a placeholder,
so the active locale was never announced as the combobox value. There
is no pinned select any more — but **the control is icon-only, so the
active locale has no on-screen representation and nothing to
announce at all.** The status region is not compensating for an odd
implementation detail; it is the only place the current language
appears.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleChooser, { localeName } from "../LocaleChooser.vue";

const locale = ref("en");
</script>

<template>
    <LocaleChooser
        v-model:value="locale"
        label="Language"
        :locales="['en', 'fr', 'ar']"
    />

    <p class="locale-chooser-status" aria-live="polite">
        Current language: {{ localeName(locale) }}
    </p>
</template>
```

Four decisions are baked into that snippet:

1. **Visible, not `sr-only`.** The active locale is invisible on a
   glyph-only button, so a visible line helps sighted users and
   cognitive accessibility as well as screen-reader users — which is
   what WCAG AAA favours. If your design truly cannot spare the line,
   keep the element and hide it visually:

   ```css
   .locale-chooser-status {
       position: absolute;
       width: 1px;
       height: 1px;
       margin: -1px;
       overflow: hidden;
       clip-path: inset(50%);
       white-space: nowrap;
   }
   ```

   Use `clip-path`, never `display: none` or `visibility: hidden` —
   the latter two drop the element from the accessibility tree, which
   silences the live region and defeats the point.
2. **`aria-live="polite"`, not `role="alert"`.** A polite live region
   announces *mutations* only, so it is silent on first paint and
   speaks once per change, without moving focus. That matches the
   WCAG 3.2.2 (On Input) contract described above, and it composes
   with the component's own focus handling — which already returns
   focus to the button on commit.
3. **Human label, not the raw code.** `localeName()` is exported from
   this package; it turns `"fr"` into `"French"` so the announcement
   reads "Current language: French", not "Current language: fr".
4. **Mind the `lang` of the status text.** The built-in
   `locales.tsv` labels are English names, so the line above is
   entirely English and needs no `lang` override. If you supply
   endonyms via `localeLabels` ("Français", "العربية"), wrap just the
   name so it is pronounced correctly — the surrounding sentence is
   still in the page language:

   ```vue
   <p class="locale-chooser-status" aria-live="polite">
       Current language:
       <span :lang="bcp47LocaleTag(locale)">{{ labelFor(locale) }}</span>
   </p>
   ```

All these strings are consumer-supplied, so they localise with the
rest of your copy. No hardcoded natural-language string is ever
emitted by the helper.

Use the `.locale-chooser-status` class hook for the element —
kebab-case, consistent with `locale-chooser`, `locale-chooser-button`,
and `locale-chooser-option`.

What the status region does **not** fix: a user who tabs to the
button later, without re-reading the page, still has no way to query
the current locale from the widget itself. The region announces
transitions and provides a persistent visible record; it does not
give the button a value. A visible adjacent label showing the active
language — rather than a static word — closes that last gap.

## Per-option `lang` is important

Every `<li role="option">` carries a `lang="…"` attribute. This
satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for the duration
of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

Consumers get this for free: the component writes it from the
locale's BCP 47 tag, and the default slot cannot disturb it, since
the slot only replaces the button glyph. The button and the listbox
itself carry no `lang` — they are not locale-specific, and tagging
them would make the reader announce the control's own name in the
wrong voice.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English so the user
recognises them), the per-option `lang` attribute is technically
incorrect: the visible text is English even though the attribute
claims French.

Under the old `<select>` rendering you could drop the attribute by
taking over option rendering through the slot. That escape hatch is
gone — the slot no longer renders options. In practice the mismatch
is minor: an English word read by a French voice is odd but
comprehensible, and it only arises when a consumer deliberately
replaces endonyms with exonyms. If it matters to you, prefer keeping
endonyms as the labels — which is the case the `lang` attribute
exists to serve — and put the viewer-language name in the status
region instead.

## Focus management on locale change

Committing an option returns focus to the button it came from, and
`Escape` does the same without changing anything. This is the WCAG
3.2.2 (On Input) contract: changing a setting must not cause an
unexpected focus or context change.

Avoid `router.push()` calls in `@change` that scroll the page; if you
must navigate, scroll-restore to the button's position so the user
can keep choosing.

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced |
| ---------- | -------- | --------- | ---------------- |
| VoiceOver  | macOS 14 | Safari 17 | On the button: "Language, pop-up button, collapsed". On open: "Language, list box, French, 2 of 5", then each option as the arrows move — with `lang`-correct pronunciation. |
| NVDA       | Windows  | Firefox   | "Language button collapsed" → on open, "Language list, French, 2 of 5". Pronounces "Français" in a French voice if a French voice is installed. |
| JAWS       | Windows  | Chrome    | "Language button" → on open, "Language list box, French, 2 of 5". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate". No OS picker — the in-page listbox opens and is swiped through. |

Three things to take from that table:

- **The button name never includes the active locale.** There is no
  value to announce on a closed icon button. The
  `.locale-chooser-status` live region is what reports the change;
  verify it fires once per change and stays silent on page load.
- **The counts have no leading placeholder any more.** A five-locale
  list reads "of 5", not "of 6".
- **Verify against your own matrix.** The wording above is
  representative, not a guarantee — `role="listbox"` +
  `aria-activedescendant` support varies more between readers than
  native `<select>` support does. This is tradeoff 2 in practice.

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed. NVDA's default ships with English
only; users add other voices through eSpeak NG or commercial voice
packs.

## Long locale lists

The listbox implements APG typeahead, so a 436-entry list is
navigable: open it, type "fr", and the active option jumps to
"French". For most long lists that is the whole answer, and it is one
capability the old placeholder-pinned `<select>` could not offer
consistently.

If you need free-text *filtering* rather than prefix matching, the
APG Combobox pattern is the right shape — and this helper does not
ship one. Render your own combobox next to the component and bind
both to the same ref: `LocaleChooser` keeps owning the apply lifecycle
(`lang` / `dir` / storage / `change`), and your input is simply a
second way to write the bound value. See
[examples/combobox.vue](../examples/combobox.vue) for that
side-by-side arrangement, built on a `<datalist>`.

## Colour contrast

The chooser ships no colour. WCAG 1.4.3 contrast (4.5:1 normal, 3:1
large, 7:1 AAA) is your CSS's responsibility — and it now applies to
the listbox too, which the browser used to draw for you:

```css
.locale-chooser-button {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    font-weight: 600;
}

.locale-chooser-option[data-active] {
    /* Do not signal the active row with colour alone (WCAG 1.4.1). */
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
```

The focus ring should also meet WCAG 2.4.13 Focus Appearance — a
minimum 2px-wide outline that contrasts with both the focused
element and the background. Style the `<ul>`'s focus ring as well as
the button's: the list takes DOM focus while open, and an unstyled
`tabindex="-1"` container is easy to forget.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order as
LTR. So Tab still reaches the button in source order, and the listbox
mirrors visually. This is the browser's job, not yours.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (the button + listbox shape):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WAI-ARIA APG — Combobox pattern (for the side-by-side filter case):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
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
