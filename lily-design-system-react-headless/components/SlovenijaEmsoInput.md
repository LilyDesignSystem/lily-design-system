# SlovenijaEmsoInput

A headless input for Slovenia's Enotna Matična Številka Občana (EMŠO). Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Slovenia's Enotna Matična Številka Občana (EMŠO).

## When to use it

- Forms collecting a Slovenia Enotna Matična Številka Občana.

## When not to use it

- Use `SlovenijaEmsoView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
