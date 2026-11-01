# MalaysiaKadPengenalanView

A headless read-only display for Malaysia's MyKad Number (NRIC). Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Malaysia's MyKad Number (NRIC) read-only.

## When to use it

- Displaying a Malaysia MyKad Number (NRIC). Printed on the MyKad identity card, and asked for by hospitals, banks, schools, employers and government services.

## When not to use it

- Use `MalaysiaKadPengenalanInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/MyKad
