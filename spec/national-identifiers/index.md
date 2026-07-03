# National Identifiers

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily ships 80 national personal identifier components — 40 identifier types each paired as `-input` and `-view` — spanning 30+ countries and covering healthcare, national-ID, tax, and passport identifiers, rendered through one headless input/view pattern and grounded in canonical reference TSVs.

## Scope

This topic covers the 80 national personal identifier components added in May 2026 (spec §14.1, version 0.2.0): how they are catalogued, named, normalized, and rendered. It covers the canonical reference files that back them (`AGENTS/countries.tsv`, `AGENTS/national-person-identifiers.tsv`, `AGENTS/national-personal-identifier-normalization.md`), the `-input`/`-view` rendering pattern, the validation algorithms documented per identifier, the country/identifier naming normalization rule, and the Phase 1 (catalog) versus Phase 2 (per-subproject implementation) split.

It does **not** cover: the general suffix-to-element mapping and naming patterns (see [components](../components/index.md)), the headless markup contract these components follow (see [headless](../headless/index.md)), the per-framework implementations (see [frameworks](../frameworks/index.md)), or the accessible-name requirement the `-view` `aria-label` satisfies (see [accessibility](../accessibility/index.md)).

## Principles and rules

- Each identifier type ships exactly two components: a `{slug}-input` for data entry and a `{slug}-view` for read-only display. 40 types × 2 = 80 components, part of the 490-component canonical catalog.
- The `-input` variant renders `<input type="text" autocomplete="off">`. Identifiers are sensitive and format-specific, so autofill is suppressed and the type stays `text` (not a numeric or specialized type) to preserve leading zeros, spaces, and check characters.
- The `-view` variant renders `<span aria-label="…">` so assistive technology announces the identifier's meaning, not just its digits.
- Components are headless: they carry no locale default, no embedded validation UI, and no hardcoded user-facing strings. The consumer supplies labels and decides whether to run the documented validation.
- Component slugs and names use the normalized form: country exonym (English, snake/kebab case) + identifier exonym (English, snake/kebab case) — not "country code + abbreviation". See the normalization rule below.
- Each component's `index.md` documents its country, identifier name, format, validation algorithm (Luhn / Modulus-11 / Modulus-97 / etc.), where a person finds the identifier, and the input/view rendering pattern.
- These 80 components landed in the catalog (rows, per-component docs, CSS class hooks) in **Phase 1**; per-subproject implementations across the 6 then-existing headless libraries and 6 example apps shipped in **Phase 2** (spec §11.8).

## Naming normalization

The canonical rule (`AGENTS/national-personal-identifier-normalization.md`): rename each identifier from "country code + identifier abbreviation" to "country exonym English + identifier exonym English", in snake/kebab case, for consistency and clarity. The same rename applies to slugs, PascalCase names, and any `parse_*` helper functions.

| Wrong (code + abbreviation) | Right (exonym + exonym)                          |
| --------------------------- | ------------------------------------------------- |
| `uk_nhs_number`             | `united_kingdom_national_health_service_number`   |
| `fr_nir`                    | `france_social_security_number`                   |
| `us_ssn`                    | `united_states_social_security_number`            |
| `it_cf`                     | `italy_fiscal_code`                               |
| `nl_bsn`                    | `netherlands_national_identity_card_number`       |
| `se_personnummer`          | `sweden_personal_identity_number`                 |
| `gb_cym_nhs_number`         | `wales_national_health_service_number`            |
| `gb_eng_nhs_number`         | `england_national_health_service_number`          |
| `gb_sct_nhs_number`         | `scotland_national_health_service_number`         |

Helper-function names follow the same transform: `parse_us_ssn` → `parse_united_states_social_security_number`.

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
| `ireland-individual-health-identifier`                | `…-input`, `…-view`                                                                                     |
| `northern-ireland-health-and-care-number`             | `…-input`, `…-view`                                                                                     |
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

- [ ] All 80 components (40 types × `-input`/`-view`) exist in `components.tsv` and have a `components/{slug}/` directory with the required docs.
- [ ] Every `-input` renders `<input type="text" autocomplete="off">`; every `-view` renders `<span aria-label="…">`.
- [ ] Every slug and PascalCase name uses the normalized country-exonym + identifier-exonym form, not the code + abbreviation form.
- [ ] Each component `index.md` documents country, identifier name, format, validation algorithm, where to find it, and the rendering pattern.
- [ ] The three canonical reference files are present at the repo root and synced to every subproject.
- [ ] Phase 2 implementations exist in all then-existing headless libraries and example apps (spec §11.8), with sample tests passing per framework.

## Related topics

- [components](../components/index.md) — the canonical 490-component catalog these 80 belong to, and the suffix mapping
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
