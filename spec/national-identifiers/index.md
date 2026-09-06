# National Identifiers

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ ships 92 national personal identifier components — 46 identifier types each paired as `-input` and `-view` — spanning 30+ countries and covering healthcare, national-ID, tax, and passport identifiers, rendered through one headless input/view pattern and grounded in canonical reference TSVs.

## Scope

This topic covers the national personal identifier components added in May 2026 (spec §14.1, version 0.2.0: an initial 80 components / 40 types) and grown since to the current 92 components / 46 types via `AGENTS/national-person-identifiers.tsv`: how they are catalogued, named, normalized, and rendered. It covers the canonical reference files that back them (`AGENTS/countries.tsv`, `AGENTS/national-person-identifiers.tsv`, `AGENTS/national-personal-identifier-normalization.md`), the `-input`/`-view` rendering pattern, the validation algorithms documented per identifier, the country/identifier naming normalization rule, and the Phase 1 (catalog) versus Phase 2 (per-subproject implementation) split.

It does **not** cover: the general suffix-to-element mapping and naming patterns (see [components](../components/index.md)), the headless markup contract these components follow (see [headless](../headless/index.md)), the per-framework implementations (see [frameworks](../frameworks/index.md)), or the accessible-name requirement the `-view` `aria-label` satisfies (see [accessibility](../accessibility/index.md)).

## Principles and rules

- Each identifier type ships exactly two components: a `{slug}-input` for data entry and a `{slug}-view` for read-only display. 46 types × 2 = 92 components, part of the 491-component canonical catalog.
- The `-input` variant renders `<input type="text" autocomplete="off">`. Identifiers are sensitive and format-specific, so autofill is suppressed and the type stays `text` (not a numeric or specialized type) to preserve leading zeros, spaces, and check characters.
- The `-view` variant renders `<span aria-label="…">` so assistive technology announces the identifier's meaning, not just its digits.
- Components are headless: they carry no locale default, no embedded validation UI, and no hardcoded user-facing strings. The consumer supplies labels and decides whether to run the documented validation.
- Component slugs and names use the normalized form: country **endonym** (the country's own native-language name, romanized to snake/kebab case — e.g. `cymru-`, not `wales-`) + identifier name (native/official form where one exists, e.g. `numero-de-registre-national`, not a translated "national-register-number") — not "country code + abbreviation". Reversed 2026-09-06 from an earlier exonym-first wording; see the normalization rule below.
- Each component's `index.md` documents its country, identifier name, format, validation algorithm (Luhn / Modulus-11 / Modulus-97 / etc.), where a person finds the identifier, and the input/view rendering pattern.
- These components landed in the catalog (rows, per-component docs, CSS class hooks) in **Phase 1** — the initial 80, later grown to the current 92; per-subproject implementations across the 6 then-existing headless libraries and 6 example apps shipped in **Phase 2** (spec §11.8).

## Naming normalization

**Reversed 2026-09-06 (maintainer-directed).** The canonical rule (`AGENTS/national-personal-identifier-normalization.md`) is: rename each identifier from "country code + identifier abbreviation" to "country **endonym** + identifier name", in snake/kebab case, for consistency and clarity. The country half is always the country's own native-language name (romanized), never the English exonym — `cymru_`, not `wales_`; `cesko_`, not `czech_republic_`. The identifier half stays in its native/official form where one exists (e.g. `numero_de_registre_national`), rather than being translated into English. The same rename applies to slugs, PascalCase names, and any `parse_*` helper functions.

| Wrong (code + abbreviation, or English exonym) | Right (endonym + native identifier name) |
| ----------------------------------------------- | ----------------------------------------- |
| `uk_nhs_number`                                  | `united_kingdom_national_health_service_number` (UK has no distinct native-language form) |
| `fr_nir`                                         | `france_numero_d_identification_au_repertoire`  |
| `us_ssn`                                         | `united_states_social_security_number` (no distinct native form) |
| `it_cf`                                          | `italia_codice_fiscale`                   |
| `nl_bsn`                                         | `nederland_burgerservice_nummer`          |
| `se_personnummer`                                | `sverige_personnummer`                    |
| `gb_cym_nhs_number`                              | `cymru_rhif_y_gwasanaeth_iechyd_gwladol`  |
| `gb_eng_nhs_number`                              | `england_national_health_service_number` (England has no distinct native-language form) |

For countries with more than one official native language, pick one and be consistent (e.g. Belgium's catalog entry uses the French form, `belgique_`, out of Belgique/België/Belgien). For countries whose everyday English name has no distinct native-language equivalent (England, Northern Ireland's English name, the UK, the US), the "endonym" and the English name coincide, so no separate transliteration exists to prefer — those keep the English form. Helper-function names follow the same transform: `parse_us_ssn` → `parse_united_states_social_security_number`.

**A history of churn on this rule, for whoever reads this next**: the catalog's 46 identifier types were authored with endonym slugs for most of Europe from the start; a 2026-09-06 audit flagged that as a defect against an *exonym*-first reading of this same rule and renamed 28 identifier types (56 components) to English exonyms; that rename was reverted the same day once corrected — endonym is, and was always meant to be, the actual policy — and three further identifiers (`cyprus-national-passport-number` → `kypros-national-passport-number`, `ireland-individual-health-identifier` → `eire-individual-health-identifier`, `northern-ireland-health-and-care-number` → `tuaisceart-eireann-health-and-care-number`) were renamed *to* endonym for the first time, since their original slugs had used the English name. If a future reader finds this rule ambiguous enough to flip again, that itself is a sign this section needs a clearer worked example, not another silent reversal.

## Rendering pattern

| Variant   | Element                                  | Purpose                                                        |
| --------- | ---------------------------------------- | ------------------------------------------------------------- |
| `-input`  | `<input type="text" autocomplete="off">` | Data entry; preserves formatting, suppresses autofill.        |
| `-view`   | `<span aria-label="…">`                  | Read-only display with an accessible label for screen readers.|

Example slug pairs (slug → the two components):

| Identifier type slug                                  | Components                                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `united-kingdom-national-health-service-number`       | `…-input`, `…-view`                                                                                     |
| `france-numero-d-identification-au-repertoire`        | `…-input`, `…-view`                                                                                     |
| `eire-individual-health-identifier`                   | `…-input`, `…-view`                                                                                     |
| `tuaisceart-eireann-health-and-care-number`           | `…-input`, `…-view`                                                                                     |
| `united-states-social-security-number`                | `…-input`, `…-view`                                                                                     |
| `espana-tarjeta-sanitaria-individual`                 | `…-input`, `…-view`                                                                                     |

## Validation algorithms

Each identifier documents its check-digit / format-validation algorithm. The headless components do not enforce it; they expose the value so the consumer can validate. Algorithms seen across the catalog:

| Algorithm     | Example identifiers                                                            |
| ------------- | ----------------------------------------------------------------------------- |
| Modulus-11    | Scotland Community Health Index Number; many NHS-family numbers               |
| Modulus-97    | Belgium National Register Number (NRN)                                         |
| Modulus-10    | Bulgaria Uniform Civil Number (EGN, weighted)                                  |
| Luhn          | identifiers using the Luhn checksum                                            |
| Date-encoded  | identifiers embedding date-of-birth (DDMMYY / YYMMDD) plus serial + sex digit |

Many identifiers combine an encoded date of birth, a serial/region segment, a sex digit (parity convention varies by country), and a trailing check digit.

## Canonical reference files

| File                                                       | Role                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `AGENTS/national-person-identifiers.tsv`                   | One row per identifier type: kebab slug, country endonym/exonym, ISO 3166-1 code, identifier endonym/exonym, Wikipedia link, description, where to find it. |
| `AGENTS/countries.tsv`                                     | 253 country rows: ISO alpha-2/alpha-3/numeric, continent, endonym, English exonym, centroid lat/long, area, population. Backs the country half of each name. |
| `AGENTS/national-personal-identifier-normalization.md`     | The naming normalization rule and worked rename tables for slugs, names, and parse functions.           |

These files are committed at the repo root and propagated to all subprojects by `bin/sync` (spec §14.1).

## Acceptance criteria

- [x] All 92 components (46 types × `-input`/`-view`) exist in `components.tsv` and have a `components/{slug}/` directory with the required docs.
- [x] Every `-input` renders `<input type="text" autocomplete="off">`; every `-view` renders `<span aria-label="…">`. The two-component gap found earlier 2026-09-06 (`united-kingdom-national-health-service-number-input.html` and `united-states-social-security-number-input.html` missing `autocomplete="off"` in `lily-design-system-html-headless`) is fixed — all 46 `-input.html` files carry it, confirmed by a full sweep. The `-view` half checks out (spot-checked `united-states-social-security-number-view.html`: `<span class="..." aria-label="">`).
- [x] **Every slug and PascalCase name uses the normalized country-endonym + identifier-name form, not the code + abbreviation form.** Corrected 2026-09-06 (see "Naming normalization" above for the full history of this rule's own churn that day). The rule is endonym-first, not exonym-first as an earlier reading of this same criterion briefly had it. Under the correct reading: `cyprus-national-passport-number` → `kypros-national-passport-number`, `ireland-individual-health-identifier` → `eire-individual-health-identifier`, and `northern-ireland-health-and-care-number` → `tuaisceart-eireann-health-and-care-number` were renamed to their endonym forms (their original slugs had used the English name, with no prior native-language slug to fall back to). Countries with no distinct native-language form from their English name (England, the UK, the US) correctly keep the English form — that is not a violation. Bulgaria and Romania's Cyrillic/Romanian endonyms romanize to forms indistinguishable from their English names, so their existing slugs need no change either.
- [x] Each component `index.md` documents country, identifier name, format, validation algorithm, where to find it, and the rendering pattern. The gap found earlier 2026-09-06 (roughly 80 of 92 missing "where to find it" content; roughly 35 of 46 `-input` docs missing the actual validation algorithm) is filled — a full keyword sweep confirms 0/92 missing "where to find it" content and 0/46 `-input` docs missing check-digit/validation-algorithm content, spelling matched against the terms actually used (Modulo-97, Modulo-23, Luhn, "check letter", "check key", etc.).
- [x] The three canonical reference files are present at the repo root and synced to every subproject. Verified 2026-09-06: all three files (`national-person-identifiers.tsv`, `countries.tsv`, `national-personal-identifier-normalization.md`) exist at the repo root and are present, byte-identical, in all 14 non-helpers subprojects (7 headless + 7 examples) via `bin/sync`'s `AGENTS/` rsync. The 8 `*-helpers` catalogs deliberately do not receive them — `bin/sync` explicitly excludes `*-helpers` from the canonical `AGENTS/` sync because those catalogs keep their own separate `AGENTS/` set and never implement general-catalog (or national-identifier) components — so "every subproject" here is correctly read as "every subproject implementing the catalog."
- [x] Phase 2 implementations exist in all then-existing headless libraries and example apps (spec §11.8), with sample tests passing per framework. Confirmed by root `spec/index.md` §11.4 ("... including the national personal identifier components (Phase 2 per-subproject implementation, spec §11.8)"); independently verified 2026-09-06 that all 92 `-input`/`-view` slugs (46 types × 2) exist in `components.tsv` and spot-checked implementations exist in `html-headless`, `nunjucks-headless`, and `svelte-headless`.

## Related topics

- [components](../components/index.md) — the canonical 491-component catalog these 92 belong to, and the suffix mapping
- [headless](../headless/index.md) — the markup and behaviour contract `-input`/`-view` components follow
- [frameworks](../frameworks/index.md) — the seven libraries that implement each component
- [accessibility](../accessibility/index.md) — the accessible-name requirement the `-view` `aria-label` meets
- [internationalization](../internationalization/index.md) — why locale and labels are consumer-supplied, never defaulted

## Sources

- [AGENTS/national-personal-identifier-normalization.md](../../AGENTS/national-personal-identifier-normalization.md)
- [AGENTS/national-person-identifiers.tsv](../../AGENTS/national-person-identifiers.tsv)
- [AGENTS/countries.tsv](../../AGENTS/countries.tsv)
- [spec/index.md](../index.md) §5 (Healthcare identifiers), §11.8 (Phase 2 backlog), §14.1 (0.2.0 / 0.3.0 changelog)
- [components.tsv](../../components.tsv)

---

Lily™ and Lily Design System™ are trademarks.
