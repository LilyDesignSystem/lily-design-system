# SverigePersonnummerView

A headless read-only display for Sweden's Personnummer. Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Sweden's Personnummer read-only.

## When to use it

- Displaying a Sweden Personnummer.

## When not to use it

- Use `SverigePersonnummerInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)
