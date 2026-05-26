# EestiIsikukoodInput

A headless input for Estonia's Isikukood (IK). Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Estonia's Isikukood (IK).

## When to use it

- Forms collecting a Estonia Isikukood.

## When not to use it

- Use `EestiIsikukoodView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Estonia
