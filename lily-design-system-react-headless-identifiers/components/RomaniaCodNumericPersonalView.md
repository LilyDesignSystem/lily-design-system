# RomaniaCodNumericPersonalView

A headless read-only display for Romania's Cod Numeric Personal (CNP). Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Romania's Cod Numeric Personal (CNP) read-only.

## When to use it

- Displaying a Romania Cod Numeric Personal.

## When not to use it

- Use `RomaniaCodNumericPersonalInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Romania
