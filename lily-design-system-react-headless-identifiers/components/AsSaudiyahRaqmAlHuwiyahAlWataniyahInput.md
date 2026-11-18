# AsSaudiyahRaqmAlHuwiyahAlWataniyahInput

A headless input for Saudi Arabia's National Identification Number. Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Saudi Arabia's National Identification Number.

## When to use it

- Forms collecting a Saudi Arabia National Identification Number. Printed on the National ID Card for citizens and on the iqama residence permit for residents, and used for Absher, Tawakkalna and health-service sign-in.

## When not to use it

- Use `AsSaudiyahRaqmAlHuwiyahAlWataniyahView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identity_card
