# OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput

A headless input for Uzbekistan's Personal identification number (JShShIR / PINFL). Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Uzbekistan's Personal identification number (JShShIR / PINFL).

## When to use it

- Forms collecting a Personal identification number (JShShIR / PINFL) from Uzbekistan. Printed on the back of the ID card and in the machine-readable zone of the passport, and used as the personal tax number.

## When not to use it

- Use `OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView` for the read-only display counterpart.

## References

- https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl
