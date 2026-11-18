# MauritiusNationalIdentityCardNumberInput

A headless input for Mauritius's National Identity Card number. Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Mauritius's National Identity Card number.

## When to use it

- Forms collecting a National Identity Card number from Mauritius. Printed on the National Identity Card, and given at birth registration.

## When not to use it

- Use `MauritiusNationalIdentityCardNumberView` for the read-only display counterpart.

## References

- https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid
