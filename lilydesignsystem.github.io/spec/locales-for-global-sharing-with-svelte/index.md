# Locales for major projects with SvelteKit

Translate content into multiple locales.

How this site supports multiple locales end to end: content, web
routing, UI chrome, and bugs.

Read locales via file `locales.tsv`.

## .locale-peer.id file

`.locale-peer-id` file is a byte-identical 32-character hexadecimal lowercase
number then newline, across every locale's version of "the same" topic,
regardless of slug.

`.locale-peer-id` id is how the project resolves "this page, in locale X".

## Guidance

- en-us: consistent American spelling; fix any stray en-gb forms (organisation→organization, licence→license, programme→program, cancelled→canceled, analogue→analog).

- en-gb: the -ize/-ise family (optimise, realise, organise, prioritise, utilise, etc.), -or/-our (colour, behaviour, favour, labour, neighbours), -er/-re (centre, theatre for the metaphorical sense), -ense/-ce (defence, licence), doubled-L forms (modelled, labelled, cancelled, enrol/enrolment), analogue, programme, and math→maths.

- en-gb-oxendict: use en-gb then revert just the -ise family back to Oxford -ize spelling (optimize, realise→realize, organise→organize, etc.), while correctly keeping -yse forms (analyse/analysable) unchanged, since Oxford style never uses -yze, and keeping all other British forms (colour, centre, defence, licence, programme, maths, modelled) intact.

## Guard against corruption

Keep proper nouns unconverted. Example: "Hospital Readmissions Reduction Program" (a real United States federal program name).

## Verify

For each locale subdirectory:

- File exists: `index.md`
- Symlink exists: `README.md`
- Locale peer id tracking file exists: `.locale-peer-id`

Then:

- Fix any broken internal links
- Fix any residual wrong-dialect spellings
- Update `./spec/locale/index.md`

## Content structure (book side)

Each locale is `locales/<code>/` in the book repo, containing:

- `locales/<code>/topics/<slug>/index.md` + `.locale-peer-id` — one per topic.
  `README.md` is a symlink to `index.md`.
- `locales/<code>/index.md` + `.locale-peer-id` + `README.md` symlink — the
  locale's own translated README (site home/contents page source). Every
  locale gets this file scaffolded (matching the topic-file pattern) even
  before it has a translation; it starts empty.

## Locale directory names

**Every locale directory uses the format `<language>-<region>`**, lowercase: a two- or three-letter language code, a hyphen,
and a region — a two-letter country code (`cy-gb`, `en-us`, `zh-cn`) or the three-digit UN M49 code `001`, "world", for a
language's international locale (`en-001`, `fr-001`). There are **no bare language directories**: `src/routes/locales/en/`
(or `fr/`, `cy/`, …) must not exist, so `/locales/en/` is not a route. A browser tag with no route of its own falls back to the
language's `-001` locale (see the redirect below); it is never given a bare-language alias. The one existing extra segment is
`en-gb-oxendict` (British English with Oxford spelling, which has no standard subtag); a new variant needs the same
justification. `bin/test` enforces the rule: every directory under `src/routes/locales/` must match
`^[a-z]{2,3}-([a-z]{2}|[0-9]{3})(-[a-z0-9]+)?$`.

## Slugs

Slugs are per-locale, not shared.** Translated locales rename topic directories
to native-script/accented slugs.

Example: `es-001` `año-de-vida-ajustado-por-calidad`, `ur-001` `صحت-ایڈجسٹڈ-متوقع-زندگی`.

Nothing in the site assumes slugs match across locales.

## Home-page redirect by browser language

On the first visit of a browser session, `/` reads `navigator.languages` (else `navigator.language`) and, if the site has
a matching `/locales/<code>/` route, redirects there with `replaceState` (so Back does not bounce). Matching is in
`src/lib/locale-redirect.ts` (`pickLocaleRoute`), per preferred language in order: the tag itself (`cy-GB`, or `cy_GB`,
→ `cy-gb`), then language + region (`zh-Hans-CN` → `zh-cn`), then the language's international `-001` route (`fr-CA` → `fr-001`, and `en-AU`, which has no `en-au` route,
→ `/locales/en-001/`). Nothing else is guessed (`zh-TW` has no route and no `zh-001`, so it stays on `/` rather than falling
back to `zh-cn`). `en-GB` and `en-US` go to their own English variants. It runs
only in the browser (`onMount`), so the prerendered page and crawlers still get the English home page, at most once per
session (`sessionStorage` key `lily-locale-redirect-done`; no redirect if session storage is unavailable), and only from
`/` — never from deeper pages. The route is `/locales/<code>/`, not `/<code>/`. Tests: `tests/locale-redirect.spec.ts`
(the matcher, and real browsers with `cy-GB`, `en-AU` and `de-DE` locales); the suite's default browser locale is `de-DE`
(a language with no route) so other tests are not redirected.

## Translated text pages

The eight main pages (about, why, accessibility, help, comparisons, tutorials, examples, skills) are translated per **language** (not
per locale), so `cy-001` and `cy-gb` share `cy.html`.

- Source: `src/routes/<page>/+page.svelte` is the English page. `bin/extract-site-pages` writes `src/lib/pages/<page>/en.html`
  (Svelte `{`…`}` literals evaluated, HTML escaped, `<pre>` code samples kept verbatim); `--check` fails when it drifts.
- Translation: `src/lib/pages/<page>/<language>.html` starts with `<!-- title: … -->` and `<!-- description: … -->` comments, then the
  same markup as `en.html`: identical tags in identical order, identical `id`/`href`/`class`, byte-identical `<pre>` blocks. Only
  text and `aria-label` values change. Keep tag **order** even where the target language would reorder a sentence.
- Rendering: `src/lib/pages.ts` loads the files (`import.meta.glob`), `LocalizedPage.svelte` renders one with `{@html}` (adding
  `tabindex="0"` to `<pre>`), and `bin/generate-locale-pages` writes `src/routes/locales/<code>/<page>/+page.svelte` for every
  non-English locale whose language has all eight files. `pageHref(slug, locale)` returns the translated URL, or the English one when
  the language has no pages; the nav, footer, home cards and link picker use it, and `localizeLinks` rewrites links inside the page.
- Checks (in `bin/test`): `bin/check-site-page-translations` (structure, code identity, not-English, all-eight coverage).
- Provenance: Welsh uses TermCymru; the rest are machine translations pending native-speaker review.

## Locale picker (labels + ordering)

- Labels live in `locales.js`'s `LOCALE_LABELS`, one entry per code, in that
  language (e.g. `'fr-001': 'Français (Monde)'`). Falls back to the raw code
  via `localeLabel()` if a code has no label yet.
- Header `PickerBar` order comes from `content.js`'s `locales()` (sorted by
  code) — the `-001` suffix happens to sort before any letter-starting
  regional suffix, so variants already come first there.
- Home page's locale list (`+page.server.js`) sorts explicitly: default
  locale first, then grouped by language name (label text before the `(`),
  with the `-001`/World variant sorted before its regional siblings within
  each group, then alphabetically by label. This does NOT fall out of
  alphabetical-by-label sort on its own (e.g. "España" < "Mundo") — it needs
  the explicit `-001` check.

## Bug fixes (regression watch-list)

### Bug: ASCII-only `\w` regexes broke every non-Latin/non-accented slug

Bug: matched topic slugs with `[\w.-]+` (ASCII word chars only). Any locale with
an accented or native-script slug (Spanish, French, Russian, Chinese, Arabic,
Welsh, Hindi, Bengali, Portuguese, Indonesian, Urdu) silently failed peer-id
resolution and cross-topic links.

Fix by widening the slug capture group to `[^/]+`.

### Bug: Every locale's home/contents page showed canonical English content

Bug: code and content always read a single top-level `/README.md` for title,
intro, "New here?" picks, part headings, and blurbs — only topic _links_ were
ever localized.

Fix: populate the previously-empty `locales/<code>/index.md` per locale.

## Bug: Link extraction was hardcoded to literal English phrase

Bug: link silently found nothing once the README was translated.

Fix: extract all links from the whole pre-`##` intro block instead of
regex-matching the English sentence.

### Bug: UI chrome was hardcoded English in the `.svelte` templates

Bug: nav labels, subtitles, page titles, intros, breadcrumbs, topic position,
pagination, picker/share labels.

Fix: add `i18n.js` and threading `ui(locale)` through every locale-scoped route
and `+layout.svelte`.

### Bug: header/footer brand wordmark stayed English

Bug: wordmark came only from the root (locale-agnostic) `+layout.server.js`,
which deliberately never picks a locale.

Fix: have `locales/[locale]/+layout.server.js` supply this locale's own title,
which overrides the root layout's canonical one via SvelteKit's merged
`page.data` on any route under `/locales/<locale>/` — the root picker and
`/about/` (no locale in the URL) correctly keep the canonical English title.
