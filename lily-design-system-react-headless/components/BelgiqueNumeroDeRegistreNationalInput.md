# BelgiqueNumeroDeRegistreNationalInput

A headless input for Belgium's Numéro de Registre National / Rijksregisternummer (NRN). Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN).

## When to use it

- Forms collecting a Belgium Numéro de Registre National / Rijksregisternummer.

## When not to use it

- Use `BelgiqueNumeroDeRegistreNationalView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Belgium
