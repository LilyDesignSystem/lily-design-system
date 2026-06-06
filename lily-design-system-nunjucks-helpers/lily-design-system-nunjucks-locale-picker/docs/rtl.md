# RTL — Right-to-left scripts, in practice

The picker auto-detects right-to-left locales and writes
`dir="rtl"` to the document root (or to your scoped `target`).
This page explains what gets detected, what doesn't, and what
`dir="rtl"` actually changes in the browser.

The detection logic lives in `isRtlLocale(code)` exported from
`locale-picker.client.js` (and re-exports `RTL_LANGUAGE_TAGS` and
`RTL_SCRIPT_SUBTAGS` for consumer-side inspection).

## What's detected

Two signals trigger RTL:

### 1. RTL script subtag

If the locale string contains any of these as a `-`- or `_`-separated
component (case-insensitive), it's RTL — regardless of the base
language:

| Script    | Code   | Used in                                                                          |
| --------- | ------ | -------------------------------------------------------------------------------- |
| Arabic    | `Arab` | Arabic, Persian, Urdu, Uyghur, Sindhi, Kurdish (Sorani), Kashmiri, Pashto, …     |
| Hebrew    | `Hebr` | Hebrew, Yiddish, Judeo-Arabic                                                    |
| Thaana    | `Thaa` | Divehi (Maldivian)                                                               |
| Syriac    | `Syrc` | Syriac, Assyrian Neo-Aramaic                                                     |
| N'Ko      | `Nkoo` | Manding languages                                                                |
| Mongolian | `Mong` | Mongolian (traditional vertical)                                                 |
| Adlam     | `Adlm` | Fulfulde                                                                         |

Example: `uz_Arab_AF` (Uzbek written in Arabic script, in
Afghanistan) → RTL.

### 2. RTL base-language subtag

If the first subtag (before the first `-` or `_`) is one of these,
it's RTL:

| Code  | Language                  |
| ----- | ------------------------- |
| `ar`  | Arabic                    |
| `arc` | Aramaic                   |
| `ckb` | Sorani (Central) Kurdish  |
| `dv`  | Divehi                    |
| `fa`  | Persian / Farsi           |
| `he`  | Hebrew (current)          |
| `iw`  | Hebrew (legacy)           |
| `ji`  | Yiddish (legacy)          |
| `ks`  | Kashmiri                  |
| `ku`  | Kurdish (umbrella)        |
| `mzn` | Mazanderani               |
| `ps`  | Pashto                    |
| `sd`  | Sindhi                    |
| `ug`  | Uyghur                    |
| `ur`  | Urdu                      |
| `yi`  | Yiddish (current)         |

This catches the common cases (`ar`, `he`, `fa`) without requiring
the consumer to write `Arab` / `Hebr` script tags every time.

## What's NOT detected

The detection deliberately stops short of consulting CLDR's full
likely-subtag tables. Cases the helper will get wrong:

- **Kurdish (Latin)** — `ku-Latn` (Kurmanji, written in Latin) is
  detected as RTL because `ku` is in the RTL set. If you serve
  Kurmanji speakers in Latin script, pass `applyDir: false` and
  write `dir` yourself, or rename the locale to a script-explicit
  form like `kmr` (Northern Kurdish, ISO 639-3) which is not in
  the RTL set.
- **Punjabi (Arabic script)** — `pa-Arab` IS detected (via the
  `Arab` script subtag) but bare `pa` (which is Gurmukhi, LTR) is
  also correctly LTR.
- **Vertical scripts** — Mongolian (`Mong`) is traditional vertical
  Mongolian written top-to-bottom but with right-to-left column
  flow. Browsers treat `dir="rtl"` for `Mong` as an approximation,
  not as vertical writing mode. If you serve vertical Mongolian,
  use CSS `writing-mode: vertical-rl` yourself; the helper's `dir`
  is a best-effort line-flow hint.

## The `applyDir` opt

Set `opts.applyDir: false` on the macro to suppress the client.js
from writing `dir`. The macro still writes the data hook for
inspection, but the runtime apply loop skips the `dir` line:

```njk
{{ localePicker({
    label: "Language",
    locales: ["en", "ar"],
    applyDir: false
}) }}
```

Use cases:

- You manage `dir` server-side (in your Eleventy / Express layout)
  and don't want the picker to clobber it on hydration.
- You need vertical writing mode for Mongolian or traditional
  Chinese.
- Your design intentionally pins layout direction (e.g. a Hebrew
  marketing page that flows LTR for brand reasons).

The picker still writes `lang` — only `dir` is suppressed.

## What `dir="rtl"` actually changes

When the browser sees `dir="rtl"` on `<html>` or an ancestor of an
element:

| Aspect             | Behaviour with `dir="rtl"`                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Text direction     | Bidi base direction is RTL; weak characters resolve RTL.                                   |
| Paragraph flow     | First line starts at the right edge.                                                       |
| Inline-axis        | `inline-start` is right, `inline-end` is left.                                             |
| Flexbox            | `flex-direction: row` flows right-to-left.                                                 |
| Grid               | Columns flow right-to-left.                                                                |
| Scrollbar          | Vertical scrollbar appears on the left (some browsers).                                    |
| Form controls      | Number inputs, dates, native selects mirror.                                               |
| Logical CSS        | `padding-inline-start`, `margin-inline-end`, `border-inline-start` swap to physical sides. |
| Default text-align | `start` resolves to right; `end` resolves to left.                                         |

What `dir="rtl"` does NOT change:

- Physical CSS properties (`padding-left`, `text-align: left`).
  They still mean physical left, which is now the wrong side.
- Image / SVG mirroring. Browsers don't mirror raster or SVG
  content automatically; you do that with CSS
  `transform: scaleX(-1)` or by shipping a mirrored asset.
- Numbers and Latin-script names embedded in RTL text — these stay
  LTR within their bidi run (per Unicode Bidirectional Algorithm).

## Authoring CSS that survives both directions

Use logical properties throughout your CSS:

```css
/* Bad — breaks in RTL */
.banner {
    padding-left: 1rem;
    margin-right: 0.5rem;
    text-align: left;
}

/* Good — works in both */
.banner {
    padding-inline-start: 1rem;
    margin-inline-end: 0.5rem;
    text-align: start;
}
```

For chevrons, arrows, and "next/previous" iconography, either use
mirrored CSS:

```css
.next-icon {
    transform: scaleX(-1);
}

:dir(ltr) .next-icon {
    transform: none;
}
```

…or use a `:dir(rtl)` selector to swap the source asset.

## CSS implications inside the picker

The picker emits each option's `<label>` with its own `lang`
attribute, so the browser's bidi algorithm renders "Français"
left-to-right and "العربية" right-to-left within the same
fieldset — even when the document is in the other direction.

Recommended CSS for the radio group:

```css
.locale-picker {
    display: flex;
    flex-wrap: wrap;
    gap: var(--theme-space-sm);
    /* No padding/margin physical-side specifics — let logical
       properties drive direction. */
}

.locale-picker-option {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    /* unicode-bidi: isolate keeps each option in its own bidi
       context, so an Arabic option never spills into the next
       option's run. */
    unicode-bidi: isolate;
}
```

## Mixing LTR and RTL on one page

If you embed user-supplied text whose language you don't know,
wrap it with a `<bdi>` element. `<bdi>` isolates a span from the
surrounding bidi context:

```njk
<p>Welcome, <bdi>{{ userName }}</bdi>!</p>
```

This is independent of the picker, but it's the right tool for
username, place name, and similar untrusted text.

## Testing RTL behaviour

Three approaches:

1. **Manual** — pick an RTL locale in the picker and visually
   verify the layout mirrors. Check that no element overlaps, no
   text is cut off, and no chevron points the wrong way.
2. **DevTools** — use the element panel to toggle `dir="rtl"` on
   `<html>` directly to preview without touching the picker.
3. **Automated** — add a Playwright spec that clicks an RTL radio
   and asserts `document.documentElement.dir === "rtl"` and (e.g.)
   that a visually-critical element's bounding box is on the right
   side of its parent.

## See also

- [examples/04-rtl-demo.njk](../examples/04-rtl-demo.njk) — live RTL toggle.
- W3C i18n — Inline markup and bidirectional text in HTML:
  <https://www.w3.org/International/articles/inline-bidi-markup/>
- W3C i18n — Authoring HTML & CSS — RTL scripts:
  <https://www.w3.org/International/techniques/authoring-html#direction>
- MDN — `dir` attribute:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir>
- MDN — `<bdi>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi>
- MDN — `:dir()` pseudo-class:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/:dir>
- Unicode Standard Annex #9 — Unicode Bidirectional Algorithm:
  <https://www.unicode.org/reports/tr9/>
- CLDR — Likely Subtags:
  <https://cldr.unicode.org/index/cldr-spec/likely-subtags>
