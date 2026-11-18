# PakistanComputerizedNationalIdentityCardInput

A headless input for Pakistan's Computerized National Identity Card Number (CNIC). Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Pakistan's Computerized National Identity Card Number (CNIC).

## When to use it

- Forms collecting a Pakistan Computerized National Identity Card Number (CNIC). Printed on the Computerized National Identity Card (CNIC) issued by NADRA, and asked for by hospitals, banks, schools and government services.

## When not to use it

- Use `PakistanComputerizedNationalIdentityCardView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Computerized_National_Identity_Card
