# RTL — Right-to-left scripts, in practice

The select auto-detects right-to-left locales and writes
`dir="rtl"` to the document root. This page explains what gets
detected, what doesn't, what `dir="rtl"` actually changes in the
browser, and how to author CSS that survives both directions.

## What's detected

Two signals trigger RTL. The implementation lives in
[`isRtlLocale`](../locale-select.ts) and consults the sets in
[`locales.ts`](../locales.ts).

### 1. RTL script subtag

If the locale string contains any of these as a `-` or `_`-separated
component (case-insensitive), it's RTL — regardless of the base
language:

| Script    | Code   | Used in                                            |
| --------- | ------ | -------------------------------------------------- |
| Arabic    | `Arab` | Arabic, Persian, Urdu, Uyghur, Sindhi, Sorani Kurdish, Kashmiri, Pashto, Punjabi (Pakistan), Malay (traditional Jawi), … |
| Hebrew    | `Hebr` | Hebrew, Yiddish, Judeo-Arabic                      |
| Thaana    | `Thaa` | Divehi (Maldivian)                                 |
| Syriac    | `Syrc` | Syriac, Assyrian Neo-Aramaic                       |
| N'Ko      | `Nkoo` | Manding languages                                  |
| Mongolian | `Mong` | Mongolian (traditional vertical)                   |
| Adlam     | `Adlm` | Fulfulde                                           |

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
  Kurmanji speakers in Latin script, pass `apply-dir="false"` and
  write `dir` yourself, or rename the locale to a script-explicit
  form like `kmr` (Northern Kurdish, ISO 639-3) which is not in the
  RTL set.
- **Punjabi (Arabic script)** — `pa-Arab` IS detected (via the
  `Arab` script subtag) but bare `pa` (which is Gurmukhi, LTR) is
  also correctly LTR.
- **Vertical scripts** — Mongolian (`Mong`) is traditional vertical
  Mongolian written top-to-bottom but with right-to-left column
  flow. Browsers treat `dir="rtl"` for `Mong` as an approximation,
  not as vertical writing mode. If you serve vertical Mongolian,
  use CSS `writing-mode: vertical-rl` yourself; the helper's `dir`
  is a best-effort line-flow hint.

## The `apply-dir` attribute

By default `apply-dir` is "absent or true" — the select writes both
`lang` and `dir`. Setting it to `"false"` keeps the `lang` write
but suppresses `dir`:

```html
<locale-select
    label="Language"
    locales="en,ar,he"
    apply-dir="false"
></locale-select>
```

Equivalent in JS:

```js
const select = document.querySelector("locale-select");
select.applyDir = false;  // setAttribute("apply-dir", "false")
```

Setting it back to `true` removes the attribute (absent ≡ true).

## What `dir="rtl"` actually changes

When the browser sees `dir="rtl"` on `<html>` or an ancestor of an
element:

| Aspect             | Behaviour with `dir="rtl"`                                  |
| ------------------ | ----------------------------------------------------------- |
| Text direction     | Bidi base direction is RTL; weak characters resolve RTL.    |
| Paragraph flow     | First line starts at the right edge.                        |
| Inline-axis        | `inline-start` is right, `inline-end` is left.              |
| Flexbox            | `flex-direction: row` flows right-to-left.                  |
| Grid               | Columns flow right-to-left.                                 |
| Scrollbar          | Vertical scrollbar appears on the left (some browsers).     |
| Form controls      | Number inputs, dates, native selects mirror.                |
| Logical CSS        | `padding-inline-start`, `margin-inline-end`, etc., swap.    |
| Default text-align | `start` resolves to right; `end` resolves to left.          |

What `dir="rtl"` does NOT change:

- Physical CSS properties (`padding-left`, `text-align: left`).
  They still mean physical left, which is now the wrong side.
- Image / SVG mirroring. Browsers don't mirror raster or SVG
  content automatically; you do that with CSS `transform: scaleX(-1)`
  or by shipping a mirrored asset.
- Numbers and Latin-script names embedded in RTL text — these stay
  LTR within their bidi run (per Unicode Bidirectional Algorithm).

## CSS implications for vanilla HTML

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

…or use a `:dir(rtl)` selector to swap the source asset:

```css
.next-icon { background-image: url("/icons/arrow-right.svg"); }
:dir(rtl) .next-icon { background-image: url("/icons/arrow-left.svg"); }
```

### `:lang()` for typography

Pair `dir` with `lang`-scoped font rules so each script gets a font
designed for it:

```css
:lang(ar), :lang(fa), :lang(ur) {
    font-family: "Noto Sans Arabic", "Segoe UI", sans-serif;
    line-height: 1.7;  /* more leading for tall Arabic letterforms */
}

:lang(he) {
    font-family: "Frank Ruhl Libre", "Segoe UI", serif;
}

:lang(zh) {
    font-family: "Noto Sans SC", "PingFang SC", sans-serif;
}
```

The select keeps `lang` accurate; the selectors do the rest.

## Mixing LTR and RTL on one page

The select's default rendering already does this: each `<option>`
carries its own `lang` attribute, so the browser's bidi
algorithm renders "Français" left-to-right and "العربية"
right-to-left within the same `<select>`.

If you embed user-supplied text whose language you don't know, wrap
it with a `<bdi>` element. `<bdi>` isolates a span from the
surrounding bidi context:

```html
<p>Welcome, <bdi id="username">…</bdi>!</p>

<script>
    document.querySelector("#username").textContent = userName;
</script>
```

This is independent of the select, but it's the right tool for
username, place name, and similar untrusted text.

## When to opt out

Pass `apply-dir="false"` when:

- You manage `dir` server-side and don't want the select to clobber
  it on hydration.
- You need vertical writing mode for Mongolian or traditional
  Chinese.
- Your design intentionally pins layout direction (e.g. a Hebrew
  marketing page that flows LTR for brand reasons).

The select still writes `lang` — only `dir` is suppressed.

## Testing RTL behaviour

Three approaches:

1. **Manual** — pick an RTL locale in the select and visually
   verify the layout mirrors. Check that no element overlaps, no
   text is cut off, and no chevron points the wrong way.
2. **DevTools** — toggle `dir="rtl"` on `<html>` directly in the
   Elements panel. Compare against the select-controlled state.
3. **Automated** — add a Playwright spec that flips the select and
   asserts `document.documentElement.dir === "rtl"` and (e.g.) that
   a visually-critical element's bounding box is on the right side
   of its parent.

A minimal vitest + jsdom test:

```ts
import { describe, it, expect } from "vitest";
import "./index.js";

describe("apply-dir", () => {
    it("writes rtl on <html> for ar", () => {
        document.body.innerHTML = `
            <locale-select label="L" locales="en,ar" value="ar"></locale-select>
        `;
        expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    });
});
```

## References

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
- CLDR — Likely Subtags (full mapping `xx` → `xx-Script-RR`):
  <https://cldr.unicode.org/index/cldr-spec/likely-subtags>
