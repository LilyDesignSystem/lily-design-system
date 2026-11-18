# RossiyaSnilsInput

A headless input for Russia's SNILS (СНИЛС). Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Russia's SNILS (СНИЛС).

## When to use it

- Forms collecting a Russia SNILS (СНИЛС). Printed on the SNILS card (green laminated card or, since 2019, a digital record) issued by the Pension Fund of Russia, and required for compulsory medical insurance (ОМС) enrolment, employment, and pension records.

## When not to use it

- Use `RossiyaSnilsView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/SNILS_(Russia)
