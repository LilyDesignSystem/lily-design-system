# RomaniaCodNumericPersonalInput

A headless input for Romania's Cod Numeric Personal (CNP). Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Romania's Cod Numeric Personal (CNP).

## When to use it

- Forms collecting a Romania Cod Numeric Personal.

## When not to use it

- Use `RomaniaCodNumericPersonalView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Romania
