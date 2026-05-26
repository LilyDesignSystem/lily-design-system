# LatvijaPersonasKodsView

A headless read-only display for Latvia's Personas kods. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## What it is

A React 19 component that renders an inline `<span>` for displaying Latvia's Personas kods read-only.

## When to use it

- Displaying a Latvia Personas kods.

## When not to use it

- Use `LatvijaPersonasKodsInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Latvia
