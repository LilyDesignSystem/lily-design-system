# SlovenijaEmsoView

A headless read-only display for Slovenia's Enotna Matična Številka Občana (EMŠO). Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Slovenia's Enotna Matična Številka Občana (EMŠO) read-only.

## When to use it

- Displaying a Slovenia Enotna Matična Številka Občana.

## When not to use it

- Use `SlovenijaEmsoInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
