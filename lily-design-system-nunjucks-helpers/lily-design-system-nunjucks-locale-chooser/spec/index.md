# LocaleChooser — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-locale-chooser`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `locale-chooser.njk` — the macro implementation
- `locale-chooser.client.js` — runtime JS that owns the lifecycle
- `locale-chooser.test.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL set,
  derived from `locales.tsv` (verbatim copy of the Svelte canonical)
- `locales.tsv` — canonical 436-row list of locale codes and English
  names (verbatim copy of the Svelte canonical)
- `index.md` — user-facing readme

The headless `lily-design-system-nunjucks-headless` library does not
(yet) include a canonical `LocaleChooser`; this helper is the
opinionated, reusable counterpart split into a Nunjucks macro and a
client-side JS module.

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless locale
select that:

1. Renders an accessible icon button that opens a listbox of available
   locales, from a Nunjucks macro.
2. **Applies the chosen locale** at runtime by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target) via a companion client-side JS module.
3. Auto-detects script direction: RTL for locales using Arabic,
   Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam
   scripts.
4. Optionally persists the chosen locale to `localStorage`.
5. Optionally falls back to `navigator.language` on first visit when
   no value or storage entry is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-chooser` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation.** This helper does not translate strings — only
  signals the locale via the `lang` attribute, the `onChange`
  callback, and the hidden input's value.
- **Locale negotiation.** No `Intl.LocaleMatcher` / RFC 4647
  best-fit / lookup. The optional `navigator.language` fallback uses
  a simple two-step match (see §5.3).
- **Auto-discovery.** Consumers always supply the list of available
  locale codes.
- **Bundling translation files.** No JSON / YAML / PO assets ship.
- **Eleventy-only features.** The macro runs in any Nunjucks host.
- **Custom default rendering.** The default is an icon button plus a
  `<ul role="listbox">` with one `<li role="option">` per locale. A
  `{% call %}` block replaces the button's glyph, but not the list.
  Consumers who want a different control shape entirely — radios, a
  row of buttons, a native `<select>` — render their own markup and
  use the client.js pure helpers to wire it up. See `index.md`.
- **Inline `<script>` tags inside the macro output.** The client.js
  is a separate ES module loaded once per page.

## 3. Architectural decisions

- **Icon button + listbox, not a native `<select>`.** The control is a
  glyph-only `<button>` that opens a `<ul role="listbox">`. This buys a
  narrow, icon-sized control and full styling control over the open
  list, at the cost of the native control's free keyboard semantics and
  its no-JS operability (see §5.8 and §6).
- **Split between macro and client.js.** The macro renders static
  HTML with `data-lily-locale-chooser-*` hooks; the client.js owns both
  the listbox interaction (open/close, focus, keyboard, typeahead) and
  the apply lifecycle (lang, dir, storage, navigator, change events).
- **Ids come from a macro parameter, not a counter.** A Nunjucks macro
  is a pure template with no module-level mutable state, so it cannot
  mint an incrementing per-instance id the way the canonical Svelte
  helper does. The macro derives its id prefix from `name` instead, and
  accepts an explicit `id` override. Ids are therefore deterministic
  and SSR-safe (no `Math.random`, no `Date.now`) — but two instances
  sharing a `name` collide unless the consumer passes distinct `id`s.
- **The `lang` attribute is the source of truth** (WCAG 3.1.1, HTML
  Living Standard). The select writes there.
- **BCP 47 hyphen form on the wire.** Consumer codes can use `_` or
  `-`; the select normalises to `-` when writing to `lang`. The
  client preserves the consumer's original form when firing
  `onChange`.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention.
- **Vanilla ES module client.js** — no framework dependency. Exports
  `initLocaleChooser(root, opts?)` and `autoInit(opts?)` plus pure
  helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`).
- **SSR-safe.** Macro is a pure template; client.js guards every DOM
  read/write.

## 4. Public API

### 4.1 Macro parameters

`{% from "./locale-chooser.njk" import localeChooser %}` then
`{{ localeChooser(opts) }}`.

| Key                  | Type                       | Required | Default                  | Purpose |
| -------------------- | -------------------------- | -------- | ------------------------ | ------- |
| `label`              | `string`                   | yes      | —                        | Accessible name for BOTH the button and the listbox (`aria-label`). The button is icon-only, so this is the only accessible name it has. |
| `locales`            | `array<string>`            | yes      | —                        | Available locale codes (e.g. `["en", "en_US", "fr", "ar"]`). |
| `value`              | `string`                   | no       | `""`                     | Initial locale. Emitted as `data-lily-locale-chooser-value` for the client to read (see §4.2). |
| `defaultValue`       | `string`                   | no       | `""`                     | Initial locale when nothing else is supplied at runtime. |
| `storageKey`         | `string`                   | no       | `""`                     | If non-empty, the client.js persists to `localStorage`. |
| `detectFromNavigator`| `boolean`                  | no       | `false`                  | If true, the client.js resolves `navigator.languages` on first init. |
| `name`               | `string`                   | no       | `"locale"`               | Hidden-input `name`, AND the default id prefix. |
| `applyDir`           | `boolean`                  | no       | `true`                   | If false, the client.js never writes `dir`. |
| `localeLabels`       | `object<string,string>`    | no       | `{}`                     | Optional pretty labels per locale code. |
| `id`                 | `string`                   | no       | `"locale-chooser-{name}"` | Id prefix for the listbox (`{id}-list`) and its options (`{id}-option-{i}`). Pass an explicit value when two instances share a `name`. |
| `classes`            | `string`                   | no       | `""`                     | Extra CSS classes on the root `<div>`. |
| `attributes`         | `object`                   | no       | —                        | Extra HTML attributes spread onto the root. |

The `placeholder` parameter was **removed** in the icon-button release.
There is no `<select>` left to pin a placeholder onto, and the closed
control now shows a glyph rather than any word.

A `{% call %}` block body replaces the default glyph inside the button
— the Nunjucks equivalent of the canonical helper's `children`:

```njk
{% call localeChooser({label: "Language", locales: locales}) %}
  <svg class="my-icon" aria-hidden="true" viewBox="0 0 16 16">…</svg>
{% endcall %}
```

The block replaces only the glyph. It does not render options, and it
must not supply the accessible name — that stays on `aria-label`.

### 4.2 DOM contract (macro output)

```html
<div class="locale-chooser {classes}"
     data-lily-locale-chooser-root
     data-lily-locale-chooser-name="{name}"
     data-lily-locale-chooser-storage-key="{storageKey}"
     data-lily-locale-chooser-default-value="{defaultValue}"
     data-lily-locale-chooser-detect-from-navigator="{true|false}"
     data-lily-locale-chooser-apply-dir="{true|false}"
     data-lily-locale-chooser-value="{value}"
     {…attributes}>
  <input type="hidden" name="{name}" value="{selected}"
         data-lily-locale-chooser-input>
  <button type="button" class="locale-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{id}-list"
          data-lily-locale-chooser-button>
    <span class="locale-chooser-icon" aria-hidden="true">&#127760;&#65038;</span>
  </button>
  <ul class="locale-chooser-list" id="{id}-list" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      data-lily-locale-chooser-list>
    <li class="locale-chooser-option" id="{id}-option-{i}" role="option"
        aria-selected="true|false" data-value="{locale}"
        lang="{tagFor(locale)}">{labelFor(locale)}</li>
  </ul>
</div>
```

- The root is a `<div>` carrying the `locale-chooser` class hook plus the
  consumer's `classes`; `attributes` spread onto it.
- The button glyph is U+1F310 GLOBE WITH MERIDIANS followed by U+FE0E VARIATION SELECTOR-15 (`&#127760;&#65038;`),
  wrapped in `aria-hidden="true"`. The accessible name comes from
  `aria-label` alone — the glyph is never the name. VS15 requests the
  TEXT presentation: without it browsers pick the colour-emoji font and
  the globe renders blue, which does not match theme-chooser's
  monochrome ◑ (U+25D1 is not an emoji codepoint, so it needs no
  selector). Verified in Chromium.
- Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form)
  for WCAG 3.1.2 (Language of Parts), so assistive technology
  pronounces each locale's name in its own language. The button and
  the `<ul>` carry NO `lang` — they are chrome, not content.
- `data-lily-locale-chooser-value` is emitted **only when `opts.value`
  is non-empty**; it remains the sole channel by which the consumer's
  `value` prop reaches the client. It is a data attribute rather than
  baked-in control state precisely so the browser paints nothing the
  client will have to correct.
- The macro resolves a server-side `selected` code as
  `value or defaultValue or ("en" if present else locales[0])`. It
  marks exactly ONE option `aria-selected="true"` and every other
  option `aria-selected="false"`, and pre-fills the hidden input with
  it. `storageKey` and `navigator.languages` are client-only inputs, so
  the client may resolve a different code after it runs; that is
  expected, and the listbox is closed while it happens.
- The listbox renders `hidden`, the button renders
  `aria-expanded="false"`, no option carries `data-active`, and the
  list carries no `aria-activedescendant`. Those are all client-owned,
  open-state concerns.
- Option ids are deterministic: `{id}-option-{index}`, where `id`
  defaults to `locale-chooser-{name}`. No `Math.random`, no `Date.now`,
  so server and client markup always agree.
- The hidden `<input>` preserves form participation and the `name`
  prop. It is pre-filled server-side with the consumer-form code (not
  the BCP 47 form), so a form submitted without any JS still carries a
  locale.
- The macro output contains NO inline `<style>` and NO `<script>`.

### 4.3 Client.js exports

`locale-chooser.client.js` is an ES module exporting:

| Export                    | Type                                            | Purpose |
| ------------------------- | ----------------------------------------------- | ------- |
| `bcp47LocaleTag(locale)`  | `(string) => string`                            | `en_US` → `en-US`. |
| `isRtlLocale(locale)`     | `(string) => boolean`                           | See §5.6. |
| `localeName(locale)`      | `(string) => string`                            | Lookup in built-in table. |
| `matchNavigatorLanguage(navLangs, locales)` | `(string[], string[]) => string` | First match, "" if none. |
| `defaultLocaleLabels`     | `Record<string, string>`                        | Built-in 436-row table. |
| `RTL_LANGUAGE_TAGS`       | `Set<string>`                                   | Base subtag RTL set. |
| `RTL_SCRIPT_SUBTAGS`      | `Set<string>`                                   | Script subtag RTL set. |
| `GLOBE_WITH_MERIDIANS`    | `string`                                        | The default button glyph, U+1F310. |
| `initLocaleChooser(root, opts?)` | `(HTMLElement, object?) => {setLocale, destroy}` | Wire one rendered root. |
| `autoInit(opts?)`         | `(object?) => Array<{setLocale, destroy}>`      | Wire every root on the page. |

Optional `opts`:

- `onChange(code)` — fired after every apply; receives the
  consumer-form code.
- `target` — element receiving `lang` and `dir` (defaults to
  `document.documentElement`).

`initLocaleChooser` returns a controller with `setLocale(code)` and
`destroy()`. `destroy()` removes every event listener the module
attached, including the one on `document`; the applied DOM is left
as-is. The function returns an inert controller (both methods no-ops)
when `document` is undefined, when `root` is falsy, or when the
expected button / listbox children are missing.

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied.

### 5.2 Initial value resolution (client-side, on `initLocaleChooser`)

The initial locale is the first non-empty value of:

1. The root's `data-lily-locale-chooser-value` attribute (i.e.
   the consumer's `value` prop). The macro omits the attribute
   entirely when `opts.value` is unset, so an absent attribute reads
   as `""` and falls through.
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `matchNavigatorLanguage(navigator.languages, locales)` (only if
   `detectFromNavigator` is true).
4. The root's `data-lily-locale-chooser-default-value`.
5. `"en"` if present among the rendered option values.
6. The first option's `data-value`, or `""` if none.

### 5.3 Navigator-language matching

When `detectFromNavigator` is true, the client inspects
`navigator.languages` (falling back to `[navigator.language]`) and
matches each entry against the rendered option values in order. For
each entry:

1. Exact match (treating `-` and `_` as equivalent, case-insensitive).
2. Language-only match: if `nav` is `xx-YY`, try `xx`. The first
   `locales` entry whose language matches wins.

If no entry matches, falls through to step 4 of §5.2.

### 5.4 Default labels (macro side)

When `localeLabels[code]` is missing, the macro falls back to the
slug verbatim (rendered as the option label text). The client.js
does NOT overwrite labels at runtime — pretty labels are a macro
concern.

(The Nunjucks helper exposes `defaultLocaleLabels` from
`locales.ts`; consumers can pass it as `localeLabels` to the macro
in their template if they want the built-in 436-row table to
populate labels. See `index.md`.)

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element (defaults to `document.documentElement`).
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `applyDir` is true, set `target.dir = isRtlLocale(code)
   ? "rtl" : "ltr"`.
4. If `storageKey` is non-empty, write `code` to `localStorage`.
5. Mirror `code` (consumer form) into the hidden input's `value`, and
   re-derive every option's `aria-selected` so exactly one reads
   `"true"`.
6. Call `opts.onChange?.(code)` if supplied (consumer-form code).

The client.js attaches listeners for `click` and `keydown` on the
button, `click` and `keydown` on the listbox, `focusout` on the root,
and `click` on `document` (for click-outside dismissal). Choosing an
option — by click or by `Enter` / `Space` — applies the code and
closes the listbox. `setLocale` on the returned controller performs
the same apply without touching open state.

Note that `aria-selected` tracks the APPLIED locale, not the active
option. Moving the active option with the arrow keys changes
`data-active` and `aria-activedescendant` only; nothing is selected
until the user commits.

### 5.5.1 Open / close

Opening sets `list.hidden = false`, `aria-expanded="true"`, seeds the
active option, and moves focus to the `<ul>`. Closing sets
`list.hidden = true`, `aria-expanded="false"`, clears `data-active`
and `aria-activedescendant`, and — except after `Tab` and except when
the close was caused by a click outside or focus leaving the root —
returns focus to the button.

### 5.5.2 Keyboard contract (WAI-ARIA APG listbox)

On the **button**:

| Key | Action |
| --- | ------ |
| `ArrowDown`, `Enter`, `Space` | Open, active option = the selected one (or index 0). |
| `ArrowUp` | Open, active option = the LAST option. |

On the **listbox**:

| Key | Action |
| --- | ------ |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; does NOT wrap. |
| `Home` / `End` | Jump to the first / last option. |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape` | Close and return focus, leaving the value unchanged. |
| `Tab` | Close without stealing focus back, so the browser's own Tab handling proceeds. |
| Printable character | Typeahead over the option labels; the buffer accumulates and resets 500 ms after the last keystroke. Chords with Ctrl / Meta / Alt are ignored. |

Pointer behaviour: clicking an option selects it; clicking the button
toggles; clicking outside the root closes; focus leaving the root
closes.

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags as a
   case-insensitive component separated by `-` or `_`: `Arab`,
   `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag (before the first `-` or `_`) is one
   of: `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`, `ks`,
   `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`.

### 5.7 SSR

Macro renders deterministic markup; no DOM access at template time.
Client.js touches `document` only after `initLocaleChooser(root)` is
called.

### 5.8 The no-JS story

**The control is not operable before the client JS runs.** The button
is inert: it has no handler, so it will not open the listbox, and the
listbox stays `hidden`. This is a genuine regression from the native
`<select>` this helper used to render, which was fully usable with no
JS at all. The only no-JS affordance that survives is the pre-filled
hidden input, which lets a form submit still carry a locale — a submit
path, not a choice path. Consumers for whom no-JS operability is a
hard requirement should render their own `<select>` and wire it with
the exported pure helpers. See [docs/ssr.md](../docs/ssr.md).

## 6. Accessibility

- The button carries `aria-haspopup="listbox"`, `aria-expanded`, and
  `aria-controls`; the `<ul>` carries `role="listbox"`; each `<li>`
  carries `role="option"` and an explicit `aria-selected`.
- The active option is conveyed with `aria-activedescendant` on the
  focused `<ul>`, per the APG listbox pattern — focus itself stays on
  the `<ul>`.
- `aria-label` is the ONLY accessible name the button has, because the
  glyph is `aria-hidden`. A missing or vague `label` leaves the
  control effectively unnamed.
- Each `<li role="option">` carries `lang="{tagFor(locale)}"` (WCAG
  3.1.2, Language of Parts) so each locale name is pronounced in its
  own language. The button and the `<ul>` deliberately do not.
- A custom listbox has weaker and less consistent assistive-technology
  support than a native `<select>`, and the glyph may render
  differently or be absent depending on platform fonts. Both tradeoffs
  are stated in [docs/accessibility.md](../docs/accessibility.md).
- The document root receives `lang` and (by default) `dir` (WCAG
  3.1.1 and 1.4.10).
- WCAG 2.2 AAA is the target.

## 7. Testing acceptance criteria

`locale-chooser.test.ts` must assert every numbered item below.
Tests run under vitest + jsdom. Items 1–6 exercise the macro via
`nunjucks.renderString`; items 7–12 exercise the pure helpers;
items 13–27 exercise the client.js lifecycle and the listbox
interaction against a jsdom document populated from the macro output;
items 28–35 cover the server-rendered listbox state and the keyboard
contract.

### 7.1 Markup contract (macro)

1. Macro renders a `<div class="locale-chooser">` root containing a
   `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and `aria-controls` pointing at a
   `<ul role="listbox" tabindex="-1">`. The button renders the U+1F310
   glyph inside an `aria-hidden` span, so the glyph is never the
   accessible name.
2. `aria-label` equals the supplied `label` on BOTH the button and the
   listbox.
3. Macro renders one `<li role="option">` per entry in `locales`; the
   hidden input carries the supplied `name`.
4. Each option carries its locale code on `data-value` and a unique,
   deterministic id; re-rendering the same macro call yields the same
   ids. An explicit `id` namespaces `{id}-list` and `{id}-option-{i}`.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form);
   the button and the `<ul>` carry no `lang`.
6. `localeLabels[code]` overrides the default option text; missing
   entries fall back to the raw code.

### 7.2 Pure helpers

7. `bcp47LocaleTag("en_US")` === `"en-US"`.
8. `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`.
9. `bcp47LocaleTag("en")` === `"en"`.
10. `isRtlLocale("ar")`, `isRtlLocale("he_IL")`, and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"` from
    the built-in table.

### 7.3 Client.js locale application

13. After `initLocaleChooser(root)`, `target.lang` (defaulting to
    `document.documentElement`) is the BCP 47 form of the resolved
    initial locale.
14. After init, `target.dir` is `"rtl"` for an RTL initial locale.
15. When `applyDir` is `false`, the `dir` attribute is not written.
16. Choosing a different option updates `lang`, `dir`, the hidden
    input's value, and fires `onChange` with the new locale code in
    its consumer form (not the BCP 47-normalised tag).
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh init.
19. When the macro renders `value` as a non-empty prop, the root
    carries `data-lily-locale-chooser-value="{value}"` and the
    initial-value resolution uses the supplied value (skipping
    storage, navigator, and defaults).
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the client resolves to that
    locale.
21. When `detectFromNavigator` is true and only a language-only
    match is available, the client resolves to the language-only
    locale.

### 7.5 Spread, caller, autoInit

22. Extra attributes spread through onto the root `<div>`.
23. `autoInit()` wires every `[data-lily-locale-chooser-root]` on
    the page, and distinct `name`s yield distinct id namespaces.
24. A `{% call %}` block body replaces the default glyph inside the
    button; `aria-label` still carries the accessible name.
25. `destroy()` detaches every listener the module attached.

### 7.6 Server-rendered listbox state

These replace the retired placeholder contract. There is no
placeholder and no `<select>` to pin, so the meaningful pre-hydration
invariants are that the listbox is closed and that exactly one option
is marked selected.

26. `data-lily-locale-chooser-value` carries `opts.value` and is the
    sole channel by which it reaches the client;
    `initLocaleChooser(root)` resolves the initial locale from it.
27. When `opts.value` is unset, the root carries no
    `data-lily-locale-chooser-value` attribute at all.
28. In the server markup, before any JS runs, the listbox is `hidden`,
    the button is `aria-expanded="false"`, no option carries
    `data-active`, and the list carries no `aria-activedescendant`.
29. In the server markup exactly ONE option has
    `aria-selected="true"` and every other option has an explicit
    `aria-selected="false"`. With `opts.value` set it is that value;
    with no value it is `"en"` when present, else `locales[0]`.
30. The hidden input is pre-filled server-side with the resolved
    consumer-form code, so a no-JS form submit still carries a locale.

### 7.7 Keyboard contract

31. On the button, `ArrowDown` / `Enter` / `Space` open the listbox,
    set `aria-expanded="true"`, and move focus to the `<ul>`;
    `ArrowUp` opens with the LAST option active.
32. Opening seeds the active descendant on the selected locale.
    `ArrowDown` / `ArrowUp` move it and clamp at both ends rather than
    wrapping; `Home` / `End` jump to the first / last option.
33. `Enter` and `Space` on the listbox select the active option, apply
    it, close the listbox, and return focus to the button.
34. `Escape` closes and returns focus without changing the locale and
    without firing `onChange`. `Tab` closes without stealing focus
    back.
35. Printable characters run a typeahead over the option labels; the
    buffer accumulates across keystrokes and resets 500 ms after the
    last one; chords with Ctrl / Meta / Alt are ignored. Clicking an
    option selects it, clicking the button toggles, clicking outside
    closes, and focus leaving the root closes. `aria-selected` follows
    the applied locale rather than the merely-active option.

## 8. Out-of-scope (future)

- A complementary `LocaleView` helper.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration.
- A built-in `Accept-Language`-header server helper.

## 9. Tracking

- Package directory:
  `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-locale-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
