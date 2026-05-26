# LatvijaPersonasKodsInput

A headless input for Latvia's Personas kods. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## What it is

A React 19 component that renders a native `<input type="text">` for entering Latvia's Personas kods.

## When to use it

- Forms collecting a Latvia Personas kods.

## When not to use it

- Use `LatvijaPersonasKodsView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Latvia
