# BangladeshNationalIdentityCardView

A headless read-only display for Bangladesh's National ID (NID) number. Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.

## What it is

A React 19 component that renders an inline `<span>` for displaying Bangladesh's National ID (NID) number read-only.

## When to use it

- Displaying a National ID (NID) number from Bangladesh. Printed on the National ID card (smart card or laminated card), and asked for to register a SIM card, open a bank account or apply for a passport.

## When not to use it

- Use `BangladeshNationalIdentityCardInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)
