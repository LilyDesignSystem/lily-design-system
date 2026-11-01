# Worldwide equity audit

> Lily Design System™ specification — audit note under [internationalization](index.md). All topics: [spec index](../index.md).

**Summary.** An audit-only sweep (2026-10-29) of the catalog, the Svelte headless and helper packages, the 63 themes and the
spec wording against the "Worldwide equity" rule: no single-region convention may be a silent default. No code was changed.

## Scope

In: `components.tsv` and `components/*/{AGENTS,index}.md`; the 140 national-identifier components and
`AGENTS/national-person-identifiers.tsv`; the Svelte `calendar`, `date-time-picker`, `gantt-chart`, `time-zone-picker`,
`locale-picker`, `share-picker`, `search-picker` packages and `shared/label-packs/`; `themes/`; wording in `spec/` and `AGENTS/`.
Out: the other seven framework ports (spot-checked only for the currency default), the docs site's page content, and any fix.

## Method

`grep` and reading, plus two small `node` runs (`Intl.DateTimeFormat` output per locale) and a Python tally over the two TSVs.
"Confirmed" means the code or text says it (or a run showed it); "judgement" means a design call that reasonable maintainers
could weigh differently. Line numbers are as of this date.

## Findings

Severity: High (wrong or unusable for a whole region), Medium (works but skewed or undocumented), Low (wording or taste).

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Where                                                                                                                                                                             | Severity | Status                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ |
| 1   | The date picker's month grid is Gregorian only but its heading follows the locale's default calendar. Run: `fa-IR` heads a Gregorian grid "۱۴۰۴ اسفند" (Solar Hijri), `th-TH` "2569" (Buddhist), `ja-JP-u-ca-japanese` "令和8年3月". Heading and grid disagree for Iran, Afghanistan, Thailand, and Japan with era years. There is no `calendar` prop and no Persian, Islamic, Buddhist, Hebrew or Japanese-era grid.                                    | `lily-design-system-svelte-date-time-picker/DateTimePicker.svelte:938-948` (heading), `:18` (bespoke civil-date grid)                                                             | High     | Confirmed                                  |
| 2   | Typed input accepts ASCII digits only: `parseDateInput` and `parseTimeInput` use `Number()`/`\d`, so `٢٠٢٦-٠٣-٠١` (Arabic-Indic), Persian, Devanagari, Bengali digits fail. The am/pm matcher accepts only Latin `a`/`p`. Locales whose users type native digits cannot type a date.                                                                                                                                                                     | `DateTimePicker.svelte:570-615` (`Number(p)`), `:620-632` (`parseTimeInput`)                                                                                                      | High     | Confirmed by reading                       |
| 3   | The date-time-picker grid maps ArrowLeft/ArrowRight to previous/next day physically. The calendar package already mirrors them for `dir="rtl"` via `logicalKey`; the picker does not (`logicalKey` absent from the file). In Arabic, Hebrew, Persian and Urdu the date field's arrows run backwards visually.                                                                                                                                            | `DateTimePicker.svelte:1216-1223` vs `lily-design-system-svelte-calendar/CalendarView.svelte:36,962`                                                                              | High     | Confirmed                                  |
| 4   | Week numbers are ISO 8601 only (Monday weeks, Thursday rule) in both the calendar and the picker, with no option for the US/Canada/Japan (Sunday, week 1 holds 1 January) or Middle East (Saturday-first) numbering that the same packages already use for the week's first day. The doc comment justifies it as what "public-sector and clinical rotas quote".                                                                                          | `DateTimePicker.svelte:320-345`; `CalendarView.svelte:228,559-562`                                                                                                                | Medium   | Confirmed                                  |
| 5   | `criticalPath()` defaults `weekends` to `[0, 6]` (Saturday and Sunday). Gulf and some Muslim-majority countries use Friday-Saturday, Israel Friday-Saturday, others Friday only. This contradicts the Gantt chart prop, which says the weekend is "never defaulted".                                                                                                                                                                                     | `lily-design-system-svelte-gantt-chart/critical-path.ts:45,83`                                                                                                                    | Medium   | Confirmed                                  |
| 6   | `currency-input` documents and (React, Vue, Web Components confirmed) implements `currencyCode` default `"USD"`. The i18n rule says components "do not pick a default locale"; a US dollar default is a silent single-region default. The Svelte headless `CurrencyInput` is still a children-only stub with no currency prop, so ports disagree. Angular, HTML, Nunjucks, Blazor were not checked.                                                      | `components/currency-input/AGENTS.md:38`; `lily-design-system-react-headless/components/CurrencyInput.tsx:18,66`                                                                  | Medium   | Confirmed (3 of 7 ports)                   |
| 7   | National-identifier coverage is Europe-heavy (details below): 48 of 70 types (69%) are European, all 27 EU states are present, Africa has 2 (South Africa, Egypt) for 54 countries, the Gulf, Pakistan, Bangladesh, Vietnam, Malaysia, Nigeria, Kenya, Ethiopia, Iran, Colombia, Peru and the whole Caribbean/Central America/Pacific Islands have none.                                                                                                 | `AGENTS/national-person-identifiers.tsv`; [national-identifiers](../national-identifiers/index.md)                                                                                | Medium   | Confirmed                                  |
| 8   | Label packs: 34 of 64 locales (53%) are European, sub-Saharan Africa has 3 (Hausa, Swahili, Nigerian Pidgin), the Americas have 0 indigenous languages, no Afrikaans, Amharic, Yoruba, Igbo, Zulu, Xhosa, Somali, Nepali, Sinhala, Burmese, Malayalam, Odia, Pashto, Kurdish, Kazakh, Uzbek, Georgian, Armenian, Azerbaijani, Mongolian, Catalan, Maori or Quechua. 63 of 64 are unreviewed machine drafts. One pack per language, no regional variants. | `shared/label-packs/` (64 files); [label-packs](../label-packs/index.md)                                                                                                          | Medium   | Confirmed                                  |
| 9   | The docs site's regional locales are thin outside Europe and the US: English has only `en-us`, `en-gb` (plus `en-gb-oxendict`); no `en-in`, `en-au`, `en-za`, `en-ng`; Portuguese has `pt-pt` but no `pt-br` (the largest Portuguese-speaking population); Spanish `es-es` but no `es-mx`/`es-419` regional; French `fr-fr`, `fr-be` but no `fr-ca`, `fr-ch`, or any African French; Chinese only `zh-cn` (no `zh-tw`, `zh-hk`).                         | `spec/internationalization/index.md:108` (locale list)                                                                                                                            | Medium   | Confirmed                                  |
| 10  | The 63 themes name only public-sector systems from the UK (7) and the US (1). No theme from any government or public body in Africa, Latin America, the Middle East, South, Southeast or East Asia (no Digital Agency Japan, GOV.AU, GC Design System, India UX, GOV.SG, Brazil gov.br, France DSFR, EU Europa component library). Details below.                                                                                                        | `themes/`                                                                                                                                                                         | Medium   | Confirmed                                  |
| 11  | All theme font stacks are Latin system stacks (`system-ui … Arial`); no CJK, Arabic, Indic or Thai fallbacks and no `:lang()` rules for line height or script-specific sizing (only 2 of 63 themes contain any `[dir]`/`:lang()` selector). Themes use logical properties well (about 51 logical vs 8 physical declarations in `light.css`), which is a strength.                                                                                        | `themes/light.css:222-224`; same stack in every NHS theme                                                                                                                         | Medium   | Confirmed                                  |
| 12  | The `time-zone-picker` default list is 55 zones; 6 of the 13 `America/*` zones are US, `Africa/*` has 4 (Lagos, Cairo, Johannesburg, Nairobi), and there is no `Africa/Casablanca`, `Africa/Algiers`, `Africa/Addis_Ababa`, `Asia/Jakarta`, `Asia/Manila`, `Asia/Ho_Chi_Minh`. Offsets are covered by neighbours, but the named city is what users look for. Consumers can pass `zones`.                                                                 | `lily-design-system-svelte-time-zone-picker/zones.ts:9-64`                                                                                                                        | Low      | Confirmed; judgement                       |
| 13  | Component docs teach US and UK shapes as the examples: `postal-code-input` and `postal-code-view` show only a US ZIP and a UK postcode; `tel-link` uses `+1-555-0100`; `medical-banner` demos show an NHS number and `15/03/1984`; 10 `AGENTS.md` and 33 `index.md` files mention NHS. The components themselves are neutral (`type="text"`, `autocomplete`).                                                                                            | `components/postal-code-input/index.md:38-52`, `components/postal-code-view/index.md:24-33`, `components/tel-link/index.md:19,86`, `components/medical-banner/index.md:34,76,155` | Low      | Confirmed                                  |
| 14  | There is no structured-address, name or phone component that carries country-aware shape: `address-input` is a single `<input>` defaulting to `autocomplete="street-address"`; no given/family/patronymic/mononym guidance anywhere in the catalog; no `tel-input` country field. The single-line address is neutral but the docs do not say so or point to a per-country pattern.                                                                       | `components/address-input/AGENTS.md:39`; `components/tel-input/AGENTS.md`                                                                                                         | Low      | Judgement (a documented gap is acceptable) |
| 15  | Wording presents the US/UK as the norm: "default NHS-aligned palette so the demos look familiar to public-sector users", "current default visual reference is the NHS UK design system", picker-bar ordering "UK & US government themes moved to their own alphabetical group", the 2026-10-18 `*-gb` rule "Great Britain" (fine), and `AGENTS/citations.md` (every public-sector reference is UK or US).                                                | `AGENTS/theme.md:7`, `spec/theme/index.md:25`, `spec/examples/index.md:13`, `AGENTS/helpers.md:66`, `AGENTS/citations.md`                                                         | Low      | Judgement                                  |
| 16  | The `share-picker` docs example is a single US network (LinkedIn) and its non-goal names X, Facebook, LinkedIn and Reddit; no mention of WeChat, LINE, VK, Telegram, WhatsApp, KakaoTalk, which dominate in large regions. The package ships none, so behaviour is neutral; only the docs skew.                                                                                                                                                          | `lily-design-system-svelte-share-picker/index.md:71`, `spec/index.md:31`                                                                                                          | Low      | Judgement                                  |
| 17  | `locale-picker` is a strength: 139 languages in `locales.tsv`, endonyms, RTL detection. The first-visit fallback falls to `"en"` when `navigator.language` is absent (`LocalePicker.svelte:132`), the one English default.                                                                                                                                                                                                                               | `lily-design-system-svelte-locale-picker/LocalePicker.svelte:132`, `locales.ts`                                                                                                   | Low      | Judgement                                  |
| 18  | `search-picker` submits GET to `/?<text>` by default. The path is a neutral Lily choice, not a region's; `action` is overridable. Noted as checked, no defect.                                                                                                                                                                                                                                                                                           | `lily-design-system-svelte-search-picker/SearchPicker.svelte:43`                                                                                                                  | None     | Checked                                    |

Checked and found sound: week start is never hard-coded (`firstDayOfWeekFor` prefers `Intl.Locale.getWeekInfo`, with Sunday-first
and Saturday-first region tables and a Monday fallback, `DateTimePicker.svelte:390-466`); the weekend in the calendar and the
Gantt chart is consumer-supplied; the `en-US` formatter in `cell-types.ts:181` is an internal machine-parse of numeric parts, not
user-visible; `postal-code-input` uses `type="text"` so letters and spaces are legal.

## Regional coverage summary

### National identifiers (70 types, 54 countries)

| Region                        | Types | Share | Countries                                        |
| ----------------------------- | ----- | ----- | ------------------------------------------------ |
| Europe (incl. UK nations, UA) | 48    | 69%   | all 27 EU states; UK 6 types; IS, LI, NO, CH, UA |
| Asia (incl. RU, TR, CY, IL)   | 12    | 17%   | CN, IN, ID, IL, JP, KR, PH, SG, TH, TR, RU, CY   |
| Americas                      | 6     | 9%    | US, CA, MX, BR, AR, CL                           |
| Oceania                       | 2     | 3%    | AU, NZ                                           |
| Africa                        | 2     | 3%    | ZA, EG                                           |

Federations: EU 27 of 27 member states; African Union 2 of 55; ASEAN 4 of 10 (ID, PH, SG, TH; missing BN, KH, LA, MY, MM, VN, TL);
Mercosur 2 of 4 full members (AR, BR); GCC 0 of 6; SAARC 1 of 8 (IN); CARICOM, Pacific Islands Forum (except AU, NZ), Andean
Community (CL is not a member): 0. Method caveat: counts are of the TSV rows; a country with several types is counted once in the
country total.

### Label packs (64) and site locales (111)

| Region                    | Label packs | Share |
| ------------------------- | ----------- | ----- |
| Europe                    | 34          | 53%   |
| East and Southeast Asia   | 13          | 20%   |
| South Asia                | 9           | 14%   |
| Middle East and West Asia | 5           | 8%    |
| Sub-Saharan Africa        | 3           | 5%    |
| Americas (indigenous)     | 0           | 0%    |

### Themes (57)

| Origin                                                                      | Count | Notes                                                                                                                     |
| --------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| UK public sector                                                            | 7     | NHS England, Scotland, Wales (patient and practitioner), GOV.UK                                                           |
| US public sector                                                            | 1     | USWDS                                                                                                                     |
| US product design systems                                                   | 11    | Adobe Spectrum, Atlassian, Excel, Fluent, GitHub Primer, IBM Carbon, Linear, Mozilla Protocol, Notion, Salesforce, Vercel |
| Other national origin product systems                                       | 2     | Ant Design (China), SAP Fiori (Germany)                                                                                   |
| General-purpose (DaisyUI-style names)                                       | 36    | not region-specific                                                                                                       |
| Africa, Latin America, Middle East, South/Southeast/East Asia public sector | 0     | gap                                                                                                                       |

Counts of product systems use each theme's stated source in [theme](../theme/index.md); origins of general-purpose themes were not audited.

## Recommended tasks

1. **Calendar systems (finding 1).** Add a `calendar` prop (CLDR calendar id) to `date-time-picker` and `calendar`, or, until then, force the heading to `-u-ca-gregory` and document Gregorian-only as a gap. The forced heading is a one-line fix and removes the heading/grid mismatch.
2. **Native digits (finding 2).** Normalize Unicode decimal digits (via `Intl.NumberFormat` numbering systems or `\p{Nd}`) in `parseDateInput` / `parseTimeInput`; accept locale day-period words from `Intl`, not just `a`/`p`.
3. **RTL arrows (finding 3).** Reuse `direction.ts` `logicalKey` in `date-time-picker`; add an RTL keyboard test.
4. **Week numbering (finding 4).** Add `weekNumbering: "iso" | "us" | "locale"`, or document ISO-only as a gap.
5. **Weekend default (finding 5).** Make `criticalPath()` require `weekends` when `lagUnit: "working-days"`, matching the Gantt prop's "never defaulted" rule.
6. **Currency default (finding 6).** Remove the `"USD"` default (require `currencyCode`) in every port and align the Svelte stub.
7. **Identifier coverage (finding 7).** Research a next batch of 12 to 16 types prioritised by population and by federation gaps: Nigeria (NIN), Kenya (Huduma/ID), Ethiopia (Fayda), Ghana (Ghana Card), Pakistan (CNIC), Bangladesh (NID), Vietnam (CCCD), Malaysia (MyKad), Saudi Arabia/UAE (national ID, Emirates ID), Iran (Melli), Colombia (cédula), Peru (DNI), Uruguay (cédula), Morocco (CNIE). Add a coverage table by region and federation to [national-identifiers](../national-identifiers/index.md) so the gap is documented.
8. **Label packs and site locales (findings 8, 9).** Add a regional-variant policy (pt-BR, es-MX/es-419, fr-CA, zh-TW, en-IN/en-ZA/en-NG) and a priority list of missing languages by speaker count (Afrikaans, Amharic, Yoruba, Zulu, Nepali, Sinhala, Burmese, Malayalam, Pashto, Kazakh, Catalan, Maori).
9. **Themes (findings 10, 11).** Add a script-aware font-stack token (CJK, Arabic, Indic, Thai fallbacks) and `:lang()` line-height rules; track candidate public-sector systems from outside the UK/US as adopt-or-decline items, with a licence check each.
10. **Docs wording (findings 13, 15, 16).** Give `postal-code`, `tel`, `address` and `medical-banner` docs examples from at least three regions; reword "familiar to public-sector users" as "the reference palette"; add a "regional standards" note naming NHS and USWDS themes as regional.
11. **Time zones (finding 12).** Add the missing African, Southeast Asian cities to `DEFAULT_ZONES` or document that it is a sample.
12. **Check.** Add a lint (extend `bin/check-theme` or a new `bin/check-worldwide`) that fails on a `default "USD"`, `[0, 6]` weekend default or `en-US` visible default, and prints the coverage tables above.

## Resolution status (2026-10-30)

The recommended tasks are filed as [tasks.md](../../tasks.md) Phase 17 (P17-T*n* is recommended task _n_). The findings
table above records the audit as of 2026-10-29 and is not edited; this table records what has happened since.

| Task | Findings   | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | 1          | Interim fix done (P17-T1): every `date-time-picker` formats with the Gregorian calendar forced, in all eight catalogs. Open: a `calendar` prop (CLDR id) on `date-time-picker` and `calendar`.                                                                                                                                                                                                                                                                  |
| 2    | 2          | Done (P17-T2): `normalizeDigits` accepts every Unicode decimal digit, plus the locale's own day-period words, in all eight catalogs.                                                                                                                                                                                                                                                                                                                            |
| 3    | 3          | Done (P17-T3): the picker grid swaps ArrowLeft and ArrowRight in RTL in all eight catalogs (Blazor reads a `dir` passed to it, or the culture).                                                                                                                                                                                                                                                                                                                 |
| 4    | 4          | Documented as a gap (P17-T4): ISO 8601 week numbers only, stated in each catalog's calendar and date-time-picker docs. Open: a `weekNumbering` prop.                                                                                                                                                                                                                                                                                                            |
| 5    | 5          | Done (P17-T5): `criticalPath()` with `lagUnit: "working-days"` throws when `weekends` is missing. Breaking.                                                                                                                                                                                                                                                                                                                                                     |
| 6    | 6          | Done (P17-T6): `currencyCode` is required with no default in all nine headless libraries. Breaking.                                                                                                                                                                                                                                                                                                                                                             |
| 7    | 7          | Open (P17-T7). `bin/check-worldwide` prints the coverage by region (Europe 49 of 70 types on 2026-10-30); no new types added.                                                                                                                                                                                                                                                                                                                                   |
| 8    | 8, 9       | Open (P17-T8).                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 9    | 10, 11     | Done 2026-10-30 (P17-T9): the "Writing systems" section in all 63 themes (script fonts by language, line height for tall scripts, `bin/check-theme` rule 14) and the adopt-or-decline list in `spec/theme` (six to adopt, DSFR declined, UX4G deferred). Building the six themes is P17-T9a.                                                                                                                                                                    |
| 10   | 13, 15, 16 | Done 2026-10-30 (P17-T10): the wording, three or more regions in the postal-code, tel, address and medical-banner docs, and the share-picker docs. `AGENTS/citations.md` moves to P17-T9.                                                                                                                                                                                                                                                                       |
| 11   | 12         | Done 2026-10-30 (P17-T11): 63 zones. Added `Africa/Abidjan`, `Africa/Casablanca`, `Africa/Maputo`, `Asia/Jakarta`, `Asia/Makassar`, `Asia/Jayapura`, `Asia/Manila`, `Asia/Kuala_Lumpur`, each under a zone name no other default has at its offset (tested). Not added: Algiers, Addis Ababa, Ho Chi Minh, because an option is labelled by offset and zone name, not city, so they would repeat Lagos, Nairobi and Bangkok exactly; pass `zones` to list them. |
| 12   | all        | Done (P17-T12): `bin/check-worldwide` runs in `bin/test`. It also found and fixed the locale picker naming languages in English when rendered without `navigator`. Finding 17's `"en"` preference remains when `en` is offered and nothing else applies.                                                                                                                                                                                                        |

## Acceptance criteria

- [x] The sweep covered the catalog, the Svelte headless/helper packages, the themes and the spec wording.
- [x] Each finding names a file and line and is marked confirmed or judgement.
- [x] Regional coverage tables for identifiers, label packs and themes are present.
- [x] Findings 1 to 6 resolved or documented as gaps (P17-T1 to P17-T6, 2026-10-29; 1 and 4 have an open follow-up prop).
- [ ] Findings 7 to 16 resolved or documented as gaps (P17-T7 to P17-T11 open).

## Related topics

- [internationalization](index.md) — the rule being audited
- [national-identifiers](../national-identifiers/index.md), [label-packs](../label-packs/index.md), [zone-names](../zone-names/index.md), [theme](../theme/index.md), [helpers](../helpers/index.md)

## Sources

- [AGENTS/internationalization.md](../../AGENTS/internationalization.md)
- [AGENTS/national-person-identifiers.tsv](../../AGENTS/national-person-identifiers.tsv)
- [shared/label-packs/](../../shared/label-packs/index.md)
- [themes/](../../themes)

---

Lily™ and Lily Design System™ are trademarks.
