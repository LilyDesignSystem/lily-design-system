# RossiyaSnilsView

A headless read-only display for Russia's SNILS (СНИЛС). Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.

## What it is

A React 19 component that renders an inline `<span>` for displaying Russia's SNILS (СНИЛС) read-only.

## When to use it

- Displaying a Russia SNILS (СНИЛС). Printed on the SNILS card (green laminated card or, since 2019, a digital record) issued by the Pension Fund of Russia, and required for compulsory medical insurance (ОМС) enrolment, employment, and pension records.

## When not to use it

- Use `RossiyaSnilsInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/SNILS_(Russia)
