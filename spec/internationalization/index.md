# Internationalization

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ headless components ship zero hardcoded user-facing strings: every label, message, and announcement is supplied by the consumer through stable prop names, and locale-specific formatting and bidi layout are the consumer's concern.

## Scope

This topic covers how user-facing text and locale behaviour move across the headless boundary: the no-hardcoded-strings rule, the stable text-prop name set, locale-aware formatting props, announced (live-region) text, link/anchor text, plural/gender/conditional copy, and right-to-left / bidirectional layout.

It explicitly does **not** cover: visual styling of text (see [theme](../theme/index.md)), the example apps' concrete English demo copy and `Intl.*` wiring (see [examples](../examples/index.md)), or the ARIA roles themselves (see [accessibility](../accessibility/index.md)). Lily does not bundle a translation library, message catalogue, or locale database.

## Principles and rules

- **No hardcoded user-facing strings inside components.** Every label, description, placeholder, error message, action verb, and announcement is a prop / parameter / slot supplied by the consumer.
- **Stable text-prop names across frameworks.** New components reuse the canonical names rather than inventing synonyms.
- **Locale-aware components take the locale identifier as a prop.** Components that render dates, numbers, currencies, or measurements accept the relevant identifier (`currencyCode`, `locale`, etc.) and either pass it through to `Intl.*` formatters or expose it via a `data-*` attribute. Components do not pick a default locale.
- **Announced regions accept their text as props.** Components that mark a region for screen-reader announcement (e.g. `Notification`, `Toast`, `Alert`, `SuperBanner`) accept the announced text and ARIA labels as props; the `role` / `aria-live` / `aria-atomic` attributes are baked in but the content is always consumer-supplied.
- **Anchors and links never embed default visible text.** Content comes from `children` (slot / `ChildContent`); icon-only links take an explicit `label` prop that drives `aria-label`.
- **Plural, gender, and conditional copy belong to the consumer.** Components do not embed `count !== 1 ? "items" : "item"` logic; they accept the already-rendered string.
- **RTL / bidi is inherited.** Right-to-left and bidirectional text are inherited from the consumer's `dir` attribute and CSS; components do not assume LTR layout in their structural HTML.

## Stable text-prop names

These names are reused across every framework. Prefer them over synonyms.

| Prop           | Purpose                                                        |
| -------------- | ------------------------------------------------------------- |
| `label`        | Accessible / visible name for a control or region.            |
| `description`  | Supporting descriptive text.                                  |
| `placeholder`  | Input placeholder text.                                       |
| `error`        | Validation / error message text.                              |
| `helpText`     | Inline help / hint text.                                      |
| `dismissLabel` | Accessible name for a dismiss / close affordance.             |
| `loadingLabel` | Announced text for a loading / busy state.                    |
| `confirmLabel` | Text for a confirm / primary action.                          |
| `cancelLabel`  | Text for a cancel / secondary action.                         |

## Locale-aware formatting

Locale-sensitive components take the identifier as a prop and never default it.

| Prop           | Example consumers                          | Typical use                               |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| `locale`       | date, number, measurement components       | passed to `Intl.*` or exposed via `data-` |
| `currencyCode` | currency-input and related views           | passed to `Intl.NumberFormat`             |

```tsx
// Consumer supplies locale + currencyCode; component never assumes one.
<CurrencyInput
  label="Amount"
  locale="en-GB"
  currencyCode="GBP"
  value={amount}
  onChange={setAmount}
/>
```

The component either formats via `Intl.*` with the supplied identifier, or surfaces it as a `data-*` attribute (e.g. `data-currency-code`) so the consumer's CSS/JS can format and display.

## Announced regions

Live-region components own the ARIA plumbing but never the words.

| Concern                              | Owner    |
| ------------------------------------ | -------- |
| `role` / `aria-live` / `aria-atomic` | component |
| announced text content               | consumer |
| ARIA labels for the region           | consumer |

```tsx
// role + aria-live are baked in; the message text is a prop.
<Toast label="Saved" description="Your changes have been saved." />
```

## Links and anchors

```tsx
// Text link: content via children, never a baked-in default.
<BreadcrumbLink href="/">{homeText}</BreadcrumbLink>

// Icon-only link: explicit label drives aria-label.
<ActionLink href="/settings" label={settingsText} />
```

## Plurals, gender, conditional copy, and direction

- The consumer computes plural / gendered / conditional strings and passes the final string in. Components accept rendered text, not counts-plus-templates.
- Direction inherits from the consumer: set `dir="rtl"` (or `dir="auto"`) on an ancestor and the consumer's CSS handles mirroring. Component markup uses logical structure and does not assume LTR.

## Locale routes (the docs site)

The headless layer picks no locale, but the docs site (`lilydesignsystem.github.io`) is itself localised, and its conventions are the
reference for any app built on Lily. The full contract is the site's own
[`spec/locales-for-global-sharing-with-svelte`](../../lilydesignsystem.github.io/spec/locales-for-global-sharing-with-svelte/index.md);
the binding rules are:

- **Locale directory names are `<language>-<region>`**, lowercase: a two- or three-letter language code, a hyphen, and a region — a
  two-letter country code (`cy-gb`, `en-us`, `zh-cn`) or the UN M49 code `001` ("world") for a language's *international* locale
  (`en-001`, `fr-001`). **There are no bare-language directories** (`/locales/en/` is not a route). The one existing extra segment is
  `en-gb-oxendict` (British English, Oxford spelling, which has no standard subtag). `bin/test` enforces the rule on
  `src/routes/locales/`.
- **The tree is `/locales/<code>/`**, one thin page per locale around a shared template; `/` is the default locale `en-001` and is the
  untranslated, canonical English site. There are 15 locales: `ar-001 bn-001 cy-001 cy-gb en-001 en-gb en-gb-oxendict en-us es-001
  fr-001 hi-001 id-001 pt-001 ru-001 ur-001 zh-cn`. Component docs and the per-framework tutorials are still English-only, and the translated home page says so in its own language.
- **The eight main pages are translated too (2026-10-07).** About, Why Lily, Accessibility, Help, Comparisons, Tutorials, Examples and
  Skills exist at `/locales/<code>/<page>/` for every non-English locale (11 languages: `ar bn cy es fr hi id pt ru ur zh`, which covers
  12 locale directories because `cy-001` and `cy-gb` share Welsh). The English page (`src/routes/<page>/+page.svelte`) is the source:
  `bin/extract-site-pages` turns it into `src/lib/pages/<page>/en.html`, each language adds `<language>.html` with *identical markup
  structure* (same tags, `id`s, `href`s and byte-identical `<pre>` code samples; only text and `aria-label`s differ), and
  `bin/generate-locale-pages` writes the thin route files. `bin/check-site-page-translations` enforces structure, code-sample identity,
  that the text is not just English, and that a language is either fully covered (all eight pages) or absent. Internal links inside a
  translated page, the header nav, the footer, the home cards and the link picker all point at the same locale's pages. Only Welsh was
  checked against a term base (TermCymru); the other ten are **machine translations awaiting native-speaker review**.
- **Labels are endonyms** — each language's own name (`Cymraeg`, `Français`, `العربية`) — except where a language has several
  regional locales: then the label adds the region after a dash (`English - Great Britain`, `Cymraeg - Prydain Fawr`), never an
  abbreviation or parenthetical.
- **Direction and language follow the locale:** `<html lang dir>` is set at prerender time from the locale (`-001` is dropped to the
  bare language tag; `cy-gb` becomes `cy-GB`; `ar-001` and `ur-001` are `rtl`) and kept right across client-side navigation.
- **The home page redirects by browser language, once per session.** On the first visit, `/` reads `navigator.languages` and, for each
  preference in order, tries the tag itself (`cy-GB` or `cy_GB` → `cy-gb`), then language + region (`zh-Hans-CN` → `zh-cn`), then the
  language's `-001` locale (`fr-CA` → `fr-001`; `en-AU`, which has no `en-au` route, → `/locales/en-001/`). Nothing else is guessed
  (`zh-TW` stays on `/`). It runs only in the browser, so the prerendered page and crawlers see the English home page, and only from `/`.
- **Every locale supplies every UI string**, including the picker labels (theme, language, text size, share, search, search field,
  search button). Translations should follow an authoritative term base where one exists: the Welsh strings use *TermCymru* (Welsh
  Government), the Spanish ones follow the project's terminology note.

## Acceptance criteria

- [ ] No headless component contains a hardcoded user-facing string (label, description, placeholder, error, action verb, or announcement). Two real violations found 2026-09-06: (1) React's `EditableForm.tsx` rendered `{children}` *and* its own hardcoded `<button type="submit">Save</button>`, contradicting its own doc comment and its Svelte/Vue counterparts — **fixed**, in both `@lilydesignsystem/react-headless` and its `lily-design-system-react-next-examples` copy, tests updated to supply the button as a child. (2) `RedAmberGreenPicker`/`RedOrangeYellowGreenBluePicker` in svelte (canonical), react, and vue hardcode English `<option>` text ("Red"/"Amber"/"Green", "Orange"/"Yellow"/"Blue"), self-documented in their own header comment as "hardcoded; wrap or fork to localize" — **still open**; angular/blazor/nunjucks implement the div/radiogroup composition pattern instead and have no such strings, so fixing this needs a decision on which shape (native `<select>` vs. composed radiogroup) is actually canonical before the 3 affected catalogs can be brought in line — see the related, still-open `headless` topic item on the same div-vs-select disagreement.
- [x] Text-bearing props use the canonical names (`label`, `description`, `placeholder`, `error`, `helpText`, `dismissLabel`, `loadingLabel`, `confirmLabel`, `cancelLabel`) rather than synonyms.
- [x] Locale-aware components accept `locale` / `currencyCode` (etc.) as props and pick no default locale.
- [x] Live-region components bake in `role` / `aria-live` / `aria-atomic` but take announced text and ARIA labels as props.
- [x] Anchors take visible text via `children`; icon-only links take an explicit `label` prop driving `aria-label`.
- [x] No component embeds plural / gender / conditional copy logic.
- [x] No component assumes LTR in its structural HTML; direction is left to the consumer's `dir` + CSS.
- [x] Every docs-site locale directory is `<language>-<region>`, with no bare-language directories (checked by `bin/test`, 2026-10-07).
- [x] The docs site's home page redirects by browser language per the algorithm above (tests: `tests/locale-redirect.spec.ts`).

## Related topics

- [headless](../headless/index.md) — the zero-visual-decision boundary that strings cross via props
- [accessibility](../accessibility/index.md) — accessible names, live regions, and ARIA that text props feed
- [theme](../theme/index.md) — the parallel rule that visual tokens, like strings, live outside the headless layer
- [examples](../examples/index.md) — where concrete demo copy and `Intl.*` formatting are wired up

## Sources

- [lilydesignsystem.github.io/spec/locales-for-global-sharing-with-svelte](../../lilydesignsystem.github.io/spec/locales-for-global-sharing-with-svelte/index.md)
- `lilydesignsystem.github.io/src/lib/locales.ts` (the registry), `src/lib/i18n.ts` (the UI strings), `src/lib/locale-redirect.ts` (the matcher)
- [AGENTS/internationalization.md](../../AGENTS/internationalization.md)
- [spec/index.md](../index.md) §4.3 Internationalisation
- [AGENTS/accessibility.md](../../AGENTS/accessibility.md)

---

Lily™ and Lily Design System™ are trademarks.
