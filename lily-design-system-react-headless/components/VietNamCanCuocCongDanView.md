# VietNamCanCuocCongDanView

A headless read-only display for Viet Nam's Citizen Identification Number (CCCD). Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Viet Nam's Citizen Identification Number (CCCD) read-only.

## When to use it

- Displaying a Viet Nam Citizen Identification Number (CCCD). Printed on the Citizen Identity Card (Căn cước công dân), and used for health insurance, banking, tax and government services.

## When not to use it

- Use `VietNamCanCuocCongDanInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Vietnamese_identity_card
