# BCP 47 — Language tags, in practice

This helper writes BCP 47-conformant language tags to the `lang`
attribute on the document root. This page summarises the spec and shows
how to think about subtag composition without reading 80 pages of RFC.

## The short story

A BCP 47 language tag is a sequence of hyphen-separated subtags:

```
language [- script] [- region] [- variant]* [- extension]* [- privateuse]
```

The subtags come from four sources:

| Subtag type | Source                       | Example                  |
| ----------- | ---------------------------- | ------------------------ |
| Language    | ISO 639-1 / 639-3            | `en`, `zh`, `cmn`        |
| Script      | ISO 15924                    | `Latn`, `Hant`, `Arab`   |
| Region      | ISO 3166-1 alpha-2 / UN M.49 | `US`, `GB`, `419` (Latin America) |
| Variant     | IANA Language Subtag Registry | `valencia`, `1996`, `posix` |

The IANA Language Subtag Registry is the **single source of truth** for
every subtag. The ISO standards are upstream of it, but the registry is
what implementations consult at runtime.

- Registry landing page:
  <https://www.iana.org/assignments/language-subtag-registry>
- Registry file (plain text, ~1 MB, weekly updates):
  <https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry>

## The longer story

BCP stands for "Best Current Practice", which is the IETF's name for a
series of RFCs whose numbers change as the practice is updated.
**BCP 47** today maps to:

| Document | Title                                  | Status                                 |
| -------- | -------------------------------------- | -------------------------------------- |
| RFC 5646 | Tags for Identifying Languages         | Current syntax (obsoletes 4646, 3066, 1766). |
| RFC 4647 | Matching of Language Tags              | Current matching (lookup, filtering, best-fit). |

When a tutorial says "use BCP 47 tags", they mean tags that conform to
RFC 5646's grammar. When a tutorial says "use BCP 47 matching", they
mean the algorithms in RFC 4647.

This helper conforms to **RFC 5646 generation** (it writes well-formed
tags). It does **not** implement RFC 4647 matching (it does a simple
two-step exact-then-prefix match in `matchNavigatorLanguage`). If you
need full best-fit matching, build the resolver yourself and pass the
result in via `value`.

References:

- W3C — Language tags in HTML and XML:
  <https://www.w3.org/International/articles/language-tags/>
- RFC 5646 — Tags for Identifying Languages:
  <https://www.rfc-editor.org/rfc/rfc5646>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- W3C i18n FAQ — When should I use the language attribute?:
  <https://www.w3.org/International/questions/qa-when-lang.html>
- W3C i18n FAQ — Choosing a language tag:
  <https://www.w3.org/International/questions/qa-choosing-language-tags>

## Underscore vs hyphen

Two conventions exist:

| Form              | Used by                                                       | Example       |
| ----------------- | ------------------------------------------------------------- | ------------- |
| **Hyphen** (`-`)  | BCP 47 (the spec), HTML `lang`, all browsers, CLDR's "BCP 47 form" | `en-US`       |
| **Underscore** (`_`) | POSIX locale identifiers, Java, ICU, glibc, CLDR "POSIX form", `Accept-Language` legacy | `en_US`       |

The two are otherwise interchangeable. This helper accepts either form
in your `locales` array (treats them as equivalent for matching) and
emits the hyphen form to the `lang` attribute. The controlled `value`
preserves your original form so round-trips are lossless.

If you want canonical casing while you're at it:

| Subtag type | Canonical case | Example  |
| ----------- | -------------- | -------- |
| Language    | lowercase      | `en`, `zh` |
| Script      | Title Case     | `Hant`, `Latn` |
| Region      | UPPERCASE      | `US`, `GB` |
| Variant     | lowercase      | `valencia` |

So `zh_Hant_TW` and `zh-Hant-TW` are both fine on input; the
spec-canonical written form is `zh-Hant-TW`.

## Subtags you'll actually see

### Script subtags (ISO 15924)

You only need a script subtag when the language is written in more than
one script. Common ones:

| Code   | Script          | Used in                            |
| ------ | --------------- | ---------------------------------- |
| `Latn` | Latin           | English, French, Vietnamese, …     |
| `Cyrl` | Cyrillic        | Russian, Serbian (Cyrillic), …     |
| `Hant` | Han Traditional | Chinese (Taiwan, Hong Kong)        |
| `Hans` | Han Simplified  | Chinese (Mainland, Singapore)      |
| `Arab` | Arabic          | Arabic, Persian, Urdu, Uyghur, …   |
| `Hebr` | Hebrew          | Hebrew, Yiddish                    |
| `Thaa` | Thaana          | Divehi                             |
| `Mong` | Mongolian       | Mongolian (traditional script)     |
| `Syrc` | Syriac          | Syriac, Assyrian Neo-Aramaic       |
| `Nkoo` | N'Ko            | Manding languages                  |
| `Adlm` | Adlam           | Fulfulde                           |

`Arab`, `Hebr`, `Thaa`, `Mong`, `Syrc`, `Nkoo`, and `Adlm` are
right-to-left and trigger `dir="rtl"` in this helper regardless of the
base language. See [./rtl.md](./rtl.md).

### Region subtags

Region subtags are either ISO 3166-1 alpha-2 (`US`, `GB`, `DE`) or UN
M.49 three-digit (`419` for Latin America, `001` for the world). They
modify the language to mean "as used in this region", not "spoken by
this country's nationals".

`en-US` and `en-GB` differ in spelling (`color`/`colour`), date format
(`2026-06-05` is "June 5" vs "5 June"), and currency symbol position.

`es-419` means "Spanish as used across Latin America" — a useful
catch-all when you don't want to ship 19 separate Latin American
Spanish files.

### Variant subtags

Variants are dialects, scholarly orthographies, or historical
spellings. They're rare:

- `de-CH-1901` — German, Switzerland, traditional 1901 orthography
- `sl-rozaj-biske` — Slovenian, Resian dialect, San Giorgio variant
- `ca-valencia` — Catalan, Valencian standard

## Grandfathered and redundant tags

A handful of legacy tags pre-date the RFC 5646 grammar and live on as
"grandfathered":

- `i-klingon` (now `tlh`)
- `i-navajo` (now `nv`)
- `art-lojban` (now `jbo`)
- `cel-gaulish` (no modern equivalent)

You almost never need these. If you do, the registry file lists them
under `Type: grandfathered`.

The legacy ISO 639 codes `iw` (Hebrew, now `he`) and `ji` (Yiddish, now
`yi`) are also still valid; the helper's RTL set includes both for
back-compat.

## The IANA Language Subtag Registry file

The registry file is a plain-text record-based document, with records
separated by `%%`. Each record looks like:

```
%%
Type: language
Subtag: en
Description: English
Added: 2005-10-16
Suppress-Script: Latn
%%
```

Useful record types:

- `Type: language` — primary language subtag
- `Type: script` — script subtag
- `Type: region` — region subtag
- `Type: variant` — variant subtag
- `Type: extension` — singleton extension namespace
- `Type: grandfathered` — legacy whole tags
- `Type: redundant` — non-grandfathered legacy tags

You can fetch the registry file directly:

```
curl -O https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
```

It updates roughly monthly. The header of the file records the version
date.

## How `Intl.DisplayNames` fits

Modern browsers ship `Intl.DisplayNames` (ECMA-402, Stage 4 since 2021)
which translates BCP 47 tags into human names in any locale:

```ts
const dn = new Intl.DisplayNames(["fr"], { type: "language" });
dn.of("en-US");  // "anglais (États-Unis)"
dn.of("zh-Hant"); // "chinois (traditionnel)"
```

This helper uses `Intl.DisplayNames` opportunistically as the third
fallback for `labelFor`:

1. `localeLabels[code]` — your override
2. `defaultLocaleLabels[code]` — the built-in English table
3. `Intl.DisplayNames(navigator.language).of(code)` — runtime lookup
4. `code` — last resort

The call is wrapped in a try/catch so it never breaks SSR or older
environments.

## Common questions

**Should I use `en` or `en-US` as my default?** Use the most specific
tag that's actually accurate. If your strings really are
US-English-specific, use `en-US`. If they're general English, use `en`.
Don't overspecify: `en-US-x-stripe` is well-formed BCP 47 but hostile
to negotiation.

**Should I include the script subtag?** Only when the language is
written in multiple scripts and the choice matters. `zh-Hans`,
`zh-Hant`, `sr-Cyrl`, `sr-Latn` — yes. `en-Latn` — no, English is
implicitly Latin and `Suppress-Script: Latn` in the registry says so.

**How do I match `en-GB` to `en-AU`?** That's RFC 4647 territory.
Either implement Lookup yourself (this helper does a simpler two-step
match) or pre-flatten your locale list so language-only fallbacks
exist. Libraries: `negotiator`, `@formatjs/intl-localematcher`.

**Where does the `lang` attribute matter?** Everywhere: CSS `:lang()`
selectors, hyphenation (`hyphens: auto`), font selection
(`unicode-range`), screen reader pronunciation, search-engine ranking,
date/number formatting if you read it back via JS, browser spellcheck.
WCAG 3.1.1 (Language of Page) requires it. WCAG 3.1.2 (Language of
Parts) requires it on subtrees whose language differs from the page.

## Using the helper's pure utilities

The package re-exports four pure functions that wrap BCP 47 work for
you. They have no React dependency and are safe to import from a server
component:

```tsx
import {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "lily-design-system-react-locale-picker";

bcp47LocaleTag("en_US");        // "en-US"
bcp47LocaleTag("zh_Hant_TW");   // "zh-Hant-TW"

isRtlLocale("ar");              // true
isRtlLocale("uz_Arab_AF");      // true (script subtag)
isRtlLocale("en");              // false

localeName("en_US");            // "English (United States)"

matchNavigatorLanguage(
    ["fr-CA", "en"],
    ["en", "fr"],
);                              // "fr"
```

Use them in your own resolver, in your i18n setup, in your server
cookie handler, anywhere — they're context-free.
