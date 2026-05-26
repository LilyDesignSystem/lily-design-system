# CeskoRodneCisloView

A headless read-only display for Czech Republic's Rodné číslo (RČ). Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.

## What it is

A React 19 component that renders an inline `<span>` for displaying Czech Republic's Rodné číslo (RČ) read-only.

## When to use it

- Displaying a Czech Republic Rodné číslo.

## When not to use it

- Use `CeskoRodneCisloInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic
