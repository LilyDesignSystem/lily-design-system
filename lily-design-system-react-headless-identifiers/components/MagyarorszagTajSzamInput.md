# MagyarorszagTajSzamInput

A headless input for Hungary's Társadalombiztosítási Azonosító Jel (TAJ). Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 -- an algorithm unique to Hungary, distinct from Luhn.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Hungary's Társadalombiztosítási Azonosító Jel (TAJ).

## When to use it

- Forms collecting a Hungary Társadalombiztosítási Azonosító Jel (TAJ). Printed on the TAJ card and required at every doctor visit, pharmacy, and hospital admission under Hungary's National Health Insurance Fund (NEAK).

## When not to use it

- Use `MagyarorszagTajSzamView` for the read-only display counterpart.

## References

- https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel
