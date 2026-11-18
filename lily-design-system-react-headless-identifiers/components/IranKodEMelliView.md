# IranKodEMelliView

A headless read-only display for Iran's National Code (Kod-e Melli). Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.

## What it is

A React 19 component that renders an inline `<span>` for displaying Iran's National Code (Kod-e Melli) read-only.

## When to use it

- Displaying a Iran National Code (Kod-e Melli). Printed on the National Card (کارت ملی) and on the birth certificate, and asked for by banks, insurers, hospitals and government services.

## When not to use it

- Use `IranKodEMelliInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Iranian_identity_card
