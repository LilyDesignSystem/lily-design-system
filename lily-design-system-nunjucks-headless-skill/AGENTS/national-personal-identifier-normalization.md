# National person identifiers normalization

Read file national-person-identifiers.tsv

Rename national identifier from "country code + identifier abbreviation" to "country exonym English snake case + identifier exonym English snake case" for consistency and clarity.

Example:

| Wrong | Right |
|------|-------|
| AU IHI | Australia Individual Healthcare Identifier |
| DE KVNR | Germany Health Insurance Number |
| FR NIR | France Social Security Number |
| IT CF | Italy Fiscal Code |
| NL BSN | Netherlands National Identity Card Number |
| SE Personnummer | Sweden Personal Identity Number |
| UK CHI Number | Scotland Personal Health Identifier |
| UK NHS Number | United Kingdom National Health Service Number |
| US SSH | United States Social Security Number |
| GB-CYM NHS Number | Wales National Health Service Number |
| GB-ENG NHS Number | England National Health Service Number |
| GB-SCT NHS Number | Scotland National Health Service Number |

Example:

| Wrong | Right |
|------|-------|
| au_ihi | australia_individual_healthcare_identifier |
| de_kvnr | germany_health_insurance_number |
| fr_nir | france_social_security_number |
| it_cf | italy_fiscal_code |
| nl_bsn | netherlands_national_identity_card_number |
| se_personnummer | sweden_personal_identity_number |
| uk_chi_number | scotland_personal_health_identifier |
| uk_nhs_number | united_kingdom_national_health_service_number |
| us_ssn | united_states_social_security_number |
| gb_cym_nhs_number | wales_national_health_service_number |
| gb_eng_nhs_number | england_national_health_service_number |
| gb_sct_nhs_number | scotland_national_health_service_number |


Example parse function renaming:

| Wrong | Right |
|------|-------|
| parse_au_ihi | parse_australia_individual_healthcare_identifier |
| parse_de_kvnr | parse_germany_health_insurance_number |
| parse_fr_nir | parse_france_social_security_number |
| parse_it_cf | parse_italy_fiscal_code |
| parse_nl_bsn | parse_netherlands_national_identity_card_number |
| parse_se_personnummer | parse_sweden_personal_identity_number |
| parse_uk_chi_number | parse_scotland_personal_health_identifier |
| parse_uk_nhs_number | parse_united_kingdom_national_health_service_number |
| parse_us_ssn | parse_united_states_social_security_number |
| parse_gb_cym_nhs_number | parse_wales_national_health_service_number |
| parse_gb_eng_nhs_number | parse_england_national_health_service_number |
| parse_gb_sct_nhs_number | parse_scotland_national_health_service_number |
