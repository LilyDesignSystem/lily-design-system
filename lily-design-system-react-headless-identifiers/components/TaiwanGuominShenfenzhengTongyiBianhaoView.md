# TaiwanGuominShenfenzhengTongyiBianhaoView

A headless read-only display for Taiwan's National Identification Card Number. Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.

## What it is

A React 19 component that renders an inline `<span>` for displaying Taiwan's National Identification Card Number read-only.

## When to use it

- Displaying a Taiwan National Identification Card Number. Printed on the National Identification Card (國民身分證) and used for National Health Insurance, banking, tax filing and household registration.

## When not to use it

- Use `TaiwanGuominShenfenzhengTongyiBianhaoInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)
