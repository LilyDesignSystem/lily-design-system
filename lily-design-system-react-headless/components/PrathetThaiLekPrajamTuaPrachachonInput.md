# PrathetThaiLekPrajamTuaPrachachonInput

A headless input for Thailand's National Identification Number (เลขประจำตัวประชาชน). Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Thailand's National Identification Number (เลขประจำตัวประชาชน).

## When to use it

- Forms collecting a Thailand National Identification Number (เลขประจำตัวประชาชน). Printed on the Thai National ID Card (บัตรประจำตัวประชาชน) and required to register for the Universal Coverage Scheme (the "Gold Card"), Thailand's national health-insurance system.

## When not to use it

- Use `PrathetThaiLekPrajamTuaPrachachonView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Thai_identity_card
