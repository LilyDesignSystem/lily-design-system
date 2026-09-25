# BharatAadhaarInput

A headless input for India's Aadhaar (आधार). Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).

## What it is

A React 19 component that renders a native `<input type="text">` for entering India's Aadhaar (आधार).

## When to use it

- Forms collecting a Aadhaar for India.

## When not to use it

- Use `BharatAadhaarView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Aadhaar
