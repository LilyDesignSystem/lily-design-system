# PrathetThaiLekPrajamTuaPrachachonView

A headless read-only display for Thailand's National Identification Number (เลขประจำตัวประชาชน). Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.

## What it is

A React 19 component that renders an inline `<span>` for displaying Thailand's National Identification Number (เลขประจำตัวประชาชน) read-only.

## When to use it

- Displaying a Thailand National Identification Number (เลขประจำตัวประชาชน). Printed on the Thai National ID Card (บัตรประจำตัวประชาชน) and required to register for the Universal Coverage Scheme (the "Gold Card"), Thailand's national health-insurance system.

## When not to use it

- Use `PrathetThaiLekPrajamTuaPrachachonInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Thai_identity_card
