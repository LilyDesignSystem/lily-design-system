# MauritiusNationalIdentityCardNumberView

A headless read-only display for Mauritius's National Identity Card number. Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.

## What it is

A React 19 component that renders an inline `<span>` for displaying Mauritius's National Identity Card number read-only.

## When to use it

- Displaying a National Identity Card number from Mauritius. Printed on the National Identity Card, and given at birth registration.

## When not to use it

- Use `MauritiusNationalIdentityCardNumberInput` for the editable input counterpart.

## References

- https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid
