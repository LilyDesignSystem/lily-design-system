# EestiIsikukoodView

A headless read-only display for Estonia's Isikukood (IK). Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.

## What it is

A React 19 component that renders an inline `<span>` for displaying Estonia's Isikukood (IK) read-only.

## When to use it

- Displaying a Estonia Isikukood.

## When not to use it

- Use `EestiIsikukoodInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Estonia
