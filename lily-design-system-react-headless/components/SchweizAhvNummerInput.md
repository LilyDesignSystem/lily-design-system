# SchweizAhvNummerInput

A headless input for Switzerland's AHV-Nummer / Numéro AVS. Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Switzerland's AHV-Nummer / Numéro AVS.

## When to use it

- Forms collecting a AHV-Nummer / Numéro AVS for Switzerland.

## When not to use it

- Use `SchweizAhvNummerView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Data_codes_for_Switzerland
