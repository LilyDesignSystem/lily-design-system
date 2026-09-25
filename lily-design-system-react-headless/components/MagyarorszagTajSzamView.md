# MagyarorszagTajSzamView

A headless read-only display for Hungary's Társadalombiztosítási Azonosító Jel (TAJ). Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 -- an algorithm unique to Hungary, distinct from Luhn.

## What it is

A React 19 component that renders an inline `<span>` for displaying Hungary's Társadalombiztosítási Azonosító Jel (TAJ) read-only.

## When to use it

- Displaying a Hungary Társadalombiztosítási Azonosító Jel (TAJ). Printed on the TAJ card and required at every doctor visit, pharmacy, and hospital admission under Hungary's National Health Insurance Fund (NEAK).

## When not to use it

- Use `MagyarorszagTajSzamInput` for the editable input counterpart.

## References

- https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel
