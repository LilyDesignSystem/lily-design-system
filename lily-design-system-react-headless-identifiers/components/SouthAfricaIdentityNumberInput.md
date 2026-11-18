# SouthAfricaIdentityNumberInput

A headless input for South Africa's South African Identity Number. Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.

## What it is

A React 19 component that renders a native `<input type="text">` for entering South Africa's South African Identity Number.

## When to use it

- Forms collecting a South African Identity Number for South Africa.

## When not to use it

- Use `SouthAfricaIdentityNumberView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/South_African_identity_card
