# QazaqstanZhekeSaikestendiruNomiriInput

A headless input for Kazakhstan's Individual Identification Number (IIN). Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Kazakhstan's Individual Identification Number (IIN).

## When to use it

- Forms collecting a Individual Identification Number (IIN) from Kazakhstan. Printed on the identity card and passport, and used as the personal tax number and in every eGov service.

## When not to use it

- Use `QazaqstanZhekeSaikestendiruNomiriView` for the read-only display counterpart.

## References

- https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf
