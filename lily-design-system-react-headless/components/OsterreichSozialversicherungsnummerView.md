# OsterreichSozialversicherungsnummerView

A headless read-only display for Austria's Sozialversicherungsnummer (SVNR). Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.

## What it is

A React 19 component that renders an inline `<span>` for displaying Austria's Sozialversicherungsnummer (SVNR) read-only.

## When to use it

- Displaying a Austria Sozialversicherungsnummer (SVNR). Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.

## When not to use it

- Use `OsterreichSozialversicherungsnummerInput` for the editable input counterpart.

## References

- https://de.wikipedia.org/wiki/Sozialversicherungsnummer
