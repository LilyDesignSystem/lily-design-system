# SingaporeNationalRegistrationIdentityCardView

A headless read-only display for Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN). Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.

## What it is

A React 19 component that renders an inline `<span>` for displaying Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN) read-only.

## When to use it

- Displaying a National Registration Identity Card Number / Foreign Identification Number for Singapore.

## When not to use it

- Use `SingaporeNationalRegistrationIdentityCardInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_Registration_Identity_Card
