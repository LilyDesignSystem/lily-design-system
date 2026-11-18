# SverigePersonnummerInput

A headless input for Sweden's Personnummer. Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Sweden's Personnummer.

## When to use it

- Forms collecting a Sweden Personnummer.

## When not to use it

- Use `SverigePersonnummerView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)
