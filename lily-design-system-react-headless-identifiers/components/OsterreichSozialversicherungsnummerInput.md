# OsterreichSozialversicherungsnummerInput

A headless input for Austria's Sozialversicherungsnummer (SVNR). Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Austria's Sozialversicherungsnummer (SVNR).

## When to use it

- Forms collecting a Austria Sozialversicherungsnummer (SVNR). Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.

## When not to use it

- Use `OsterreichSozialversicherungsnummerView` for the read-only display counterpart.

## References

- https://de.wikipedia.org/wiki/Sozialversicherungsnummer
