# BharatAadhaarView

A headless read-only display for India's Aadhaar (आधार). Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).

## What it is

A React 19 component that renders an inline `<span>` for displaying India's Aadhaar (आधार) read-only.

## When to use it

- Displaying a Aadhaar for India.

## When not to use it

- Use `BharatAadhaarInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Aadhaar
