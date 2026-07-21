# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "The listbox pushes the page down when it opens"

**Likely cause.** You have not positioned it. The package ships zero
CSS, so the `<ul role="listbox">` is a normal-flow block element.

**Fix.** Give the root `position: relative` and the list
`position: absolute` — see
[styling.md § Positioning the listbox](./styling.md#positioning-the-listbox).

## "The listbox is visible even when closed"

**Likely cause.** Your CSS sets `display` on `.locale-chooser-list`,
which overrides the user-agent's `[hidden] { display: none }` rule.

**Fix.** Add an explicit reset:

```css
.locale-chooser-list[hidden] { display: none; }
```

## "The popup jumps to the wrong side after picking Arabic"

**Likely cause.** You positioned it with `left` / `right` instead of
`inset-inline-start` / `inset-inline-end`. Selecting an RTL locale
flips `dir` on the document, and physical properties do not follow.

**Fix.** Use logical properties throughout — see
[styling.md § RTL and logical properties](./styling.md#rtl-and-logical-properties).
This is the single most common styling bug on this control, because it
only appears once someone exercises the feature.

## "Keyboard users can't see which option they're on"

**Likely cause.** You styled `[aria-selected="true"]` but not
`[data-active]`. They are different states: `aria-selected` is the
applied locale, `data-active` is the keyboard cursor.

**Fix.** Style both — see
[styling.md § Attribute hooks](./styling.md#attribute-hooks).

## "The globe renders blue / as a colour emoji"

**Likely cause.** The glyph is U+1F310 plus U+FE0E VARIATION
SELECTOR-15, which *requests* monochrome text presentation. It does not
guarantee it: a platform whose only covering font is a colour-emoji
font renders colour anyway.

**Fix.** Pin a text-presentation font ahead of any emoji font on
`.locale-chooser-icon`, or replace the glyph with an inline SVG via the
`children` snippet. See
[accessibility.md § Tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).

## "The button is empty / shows a box"

**Likely cause.** No font on the device covers U+1F310, so the glyph
falls back to `.notdef` ("tofu") or nothing.

**Fix.** As above — pin a font stack, or supply an SVG. Consider also
pairing the glyph with the active locale's endonym, which fails
visibly rather than silently: see
[custom-rendering.md](./custom-rendering.md#glyph-plus-the-active-locales-endonym).

## "`dir` is not being set"

Checklist:

- `applyDir` must not be `false`. When it is, the select writes only
  `lang` and never touches `dir`, not even to clear a stale value.
- The locale must actually be RTL by this component's rules — a base
  language in the RTL set, or an RTL script subtag. Check with
  `isRtlLocale(code)`.
- If you passed `target`, `dir` goes on that element, not on `<html>`.

## "The wrong language is announced / pronounced"

**Likely cause.** A mismatch between the option's `lang` attribute
(always derived from the *code*) and its visible text (derived from
your `localeLabels`). Labelling `fr` as "French" gives you
`<li lang="fr">French</li>`, which tells the reader to pronounce an
English word with a French voice.

**Fix.** Prefer endonyms — "Français" under `lang="fr"` is both
accurate and readable by the person who needs it. See
[accessibility.md § Per-option `lang` is important](./accessibility.md#per-option-lang-is-important).

The same trap applies to the status line's `<span lang>`.

## "Typeahead doesn't find the language I type"

**Likely cause.** Typeahead matches the **label**, not the code and not
the English name. With `localeLabels={{ fr: "Français" }}` a user must
type "Fr", not "Fre" for "French".

**Fix.** Decide which your audience will type and label accordingly. If
you need both, a combobox with a text input is the right pattern, and
it is not this component.

Note also that the buffer resets after 500 ms of inactivity, and the
search runs forward from the currently active option, wrapping once.

## "`detectFromNavigator` doesn't do anything"

Checklist:

- `value` and `localStorage[storageKey]` both take precedence. Clear
  storage when testing.
- The match must succeed: an exact match (case-insensitive, `-` and `_`
  equivalent), or a language-only match. `matchNavigatorLanguage` is
  exported — call it directly to see what it returns.
- It resolves once, on mount.
- It reads `navigator.languages`, falling back to
  `[navigator.language]`. Both are absent during SSR.

## "SSR hydration mismatch"

**Likely cause.** The server rendered with an empty `value` — so no
option was `aria-selected` and the hidden input was empty — but on the
client the effect resolved a non-empty locale from `localStorage`,
navigator detection, or `defaultValue`.

**Fix.** Resolve the locale on the server (cookie or `Accept-Language`)
and pass it as `value`. See [ssr.md](./ssr.md).

Option ids come from an incrementing module counter, not from
`Math.random()`, so ids themselves never cause a mismatch.

## "The page flashes in the wrong language before settling"

**Likely cause.** The locale is resolved client-side only, so the first
paint uses the server's default. For a locale switch this is far more
disruptive than a theme flash — the user reads a sentence in the wrong
language.

**Fix.** Resolve server-side and write `lang` / `dir` into the document
shell before any pixel is painted. See [ssr.md](./ssr.md). A cookie is
the usual transport; `localStorage` cannot help, because the server
cannot read it.

## "`placeholder` does nothing"

The prop was removed along with the native `<select>` it belonged to.
Passing it now falls through `restProps` onto the root `<div>` as a
stray attribute.

To put visible text on the trigger, use the `children` snippet — it
replaces the button's glyph. See
[custom-rendering.md](./custom-rendering.md).

## "My `children` snippet renders nothing selectable"

The snippet no longer renders options — it replaces the glyph inside
the trigger button. The listbox and its options are component-owned.
If you had a radio group, button group, or `<datalist>` combobox built
on the old `ChildArgs`, it needs rewriting: read `value` and drive your
own controls outside the select. See
[custom-rendering.md](./custom-rendering.md).

## "`onChange` gives me `en_US` but the DOM says `en-US`"

Working as intended. `onChange`, the bindable `value`, and the hidden
input all carry the **consumer-form** code — whatever form you put in
`locales` — so round-trips are lossless. Only DOM writes are normalised
to the BCP 47 hyphen form. Convert with `bcp47LocaleTag(code)`.

## "TypeScript complains about spreading restProps"

`Props` includes `[key: string]: unknown` so any HTML attribute is
acceptable, but strict TS configs may flag specific attributes. Use a
type assertion at the call site, or set the attribute imperatively in
an effect.

## "I need a combobox for hundreds of locales"

This component is an APG **Listbox**, not a Combobox: there is no text
input and no autocomplete, and the `children` snippet cannot add one
(its output lives inside a `<button>`). For a genuinely long list, use
a dedicated combobox primitive and drive it with this package's
exported pure helpers.

---

Lily™ and Lily Design System™ are trademarks.
