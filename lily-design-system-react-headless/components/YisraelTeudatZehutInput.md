# YisraelTeudatZehutInput

A headless input for Israel's Teudat Zehut (תעודת זהות). Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Israel's Teudat Zehut (תעודת זהות).

## When to use it

- Forms collecting a Teudat Zehut for Israel.

## When not to use it

- Use `YisraelTeudatZehutView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Israeli_identity_card
