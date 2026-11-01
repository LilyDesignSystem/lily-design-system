# VietNamCanCuocCongDanInput

A headless input for Viet Nam's Citizen Identification Number (CCCD). Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Viet Nam's Citizen Identification Number (CCCD).

## When to use it

- Forms collecting a Viet Nam Citizen Identification Number (CCCD). Printed on the Citizen Identity Card (Căn cước công dân), and used for health insurance, banking, tax and government services.

## When not to use it

- Use `VietNamCanCuocCongDanView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Vietnamese_identity_card
