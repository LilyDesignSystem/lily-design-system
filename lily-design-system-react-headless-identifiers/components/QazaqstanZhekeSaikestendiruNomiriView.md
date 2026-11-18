# QazaqstanZhekeSaikestendiruNomiriView

A headless read-only display for Kazakhstan's Individual Identification Number (IIN). Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.

## What it is

A React 19 component that renders an inline `<span>` for displaying Kazakhstan's Individual Identification Number (IIN) read-only.

## When to use it

- Displaying a Individual Identification Number (IIN) from Kazakhstan. Printed on the identity card and passport, and used as the personal tax number and in every eGov service.

## When not to use it

- Use `QazaqstanZhekeSaikestendiruNomiriInput` for the editable input counterpart.

## References

- https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf
