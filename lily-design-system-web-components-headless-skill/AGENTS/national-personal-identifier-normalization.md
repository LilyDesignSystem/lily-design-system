# National person identifiers normalization

Read file national-person-identifiers.tsv

Rename national identifier from "country code + identifier abbreviation" to
"country endonym snake case + identifier name snake case" for consistency
and clarity. The country half is always the country's own native-language
name (romanized, diacritics dropped), never the English exonym. The
identifier half stays in its native/official form where one exists, rather
than being translated into English. Countries whose everyday English name
has no distinct native-language equivalent (England, Northern Ireland's
English name, the United Kingdom, the United States) keep the English
form, since there is no separate endonym to prefer.

Reversed 2026-09-06 (maintainer-directed): this file previously showed the
English exonym as "Right." That was backwards — endonym is, and was always
meant to be, the actual rule. See spec/national-identifiers/index.md
"Naming normalization" for the same-day rename-then-revert this caused.

Example:

| Wrong | Right |
|------|-------|
| AU IHI | Australia Individual Healthcare Identifier |
| DE KVNR | Deutschland Krankenversichertennummer |
| FR NIR | France Numero D Identification Au Repertoire |
| IT CF | Italia Codice Fiscale |
| NL BSN | Nederland Burgerservice Nummer |
| SE Personnummer | Sverige Personnummer |
| UK CHI Number | Alba Community Health Index |
| UK NHS Number | United Kingdom National Health Service Number |
| US SSH | United States Social Security Number |
| GB-CYM NHS Number | Cymru Rhif Y Gwasanaeth Iechyd Gwladol |
| GB-ENG NHS Number | England National Health Service Number |
| GB-SCT NHS Number | Alba Community Health Index |

Example:

| Wrong | Right |
|------|-------|
| au_ihi | australia_individual_healthcare_identifier |
| de_kvnr | deutschland_krankenversichertennummer |
| fr_nir | france_numero_d_identification_au_repertoire |
| it_cf | italia_codice_fiscale |
| nl_bsn | nederland_burgerservice_nummer |
| se_personnummer | sverige_personnummer |
| uk_chi_number | alba_community_health_index |
| uk_nhs_number | united_kingdom_national_health_service_number |
| us_ssn | united_states_social_security_number |
| gb_cym_nhs_number | cymru_rhif_y_gwasanaeth_iechyd_gwladol |
| gb_eng_nhs_number | england_national_health_service_number |
| gb_sct_nhs_number | alba_community_health_index |


Example parse function renaming:

| Wrong | Right |
|------|-------|
| parse_au_ihi | parse_australia_individual_healthcare_identifier |
| parse_de_kvnr | parse_deutschland_krankenversichertennummer |
| parse_fr_nir | parse_france_numero_d_identification_au_repertoire |
| parse_it_cf | parse_italia_codice_fiscale |
| parse_nl_bsn | parse_nederland_burgerservice_nummer |
| parse_se_personnummer | parse_sverige_personnummer |
| parse_uk_chi_number | parse_alba_community_health_index |
| parse_uk_nhs_number | parse_united_kingdom_national_health_service_number |
| parse_us_ssn | parse_united_states_social_security_number |
| parse_gb_cym_nhs_number | parse_cymru_rhif_y_gwasanaeth_iechyd_gwladol |
| parse_gb_eng_nhs_number | parse_england_national_health_service_number |
| parse_gb_sct_nhs_number | parse_alba_community_health_index |
