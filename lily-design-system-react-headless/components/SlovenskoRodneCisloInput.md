# SlovenskoRodneCisloInput

A headless input for Slovakia's Rodné číslo (RČ). Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Slovakia's Rodné číslo (RČ).

## When to use it

- Forms collecting a Slovakia Rodné číslo.

## When not to use it

- Use `SlovenskoRodneCisloView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Slovakia
