# CeskoRodneCisloInput

A headless input for Czech Republic's Rodné číslo (RČ). Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Czech Republic's Rodné číslo (RČ).

## When to use it

- Forms collecting a Czech Republic Rodné číslo.

## When not to use it

- Use `CeskoRodneCisloView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic
