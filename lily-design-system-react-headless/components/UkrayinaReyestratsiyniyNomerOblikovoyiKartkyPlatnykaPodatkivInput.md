# UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput

A headless input for Ukraine's Реєстраційний номер платника податків (РНОКПП). Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Ukraine's Реєстраційний номер платника податків (РНОКПП).

## When to use it

- Forms collecting a Ukraine Реєстраційний номер платника податків (РНОКПП). Printed on the Taxpayer Registration Card (Картка платника податків) and required for employment, banking, and Ukraine's mandatory state social (including health) insurance records.

## When not to use it

- Use `UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Taxpayer_Identification_Number
