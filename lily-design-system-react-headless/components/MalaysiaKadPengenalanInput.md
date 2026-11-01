# MalaysiaKadPengenalanInput

A headless input for Malaysia's MyKad Number (NRIC). Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Malaysia's MyKad Number (NRIC).

## When to use it

- Forms collecting a Malaysia MyKad Number (NRIC). Printed on the MyKad identity card, and asked for by hospitals, banks, schools, employers and government services.

## When not to use it

- Use `MalaysiaKadPengenalanView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/MyKad
