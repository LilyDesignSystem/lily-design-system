# SriLankaNationalIdentityCardView

A headless read-only display for Sri Lanka's National Identity Card (NIC) number. Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.

## What it is

A React 19 component that renders an inline `<span>` for displaying Sri Lanka's National Identity Card (NIC) number read-only.

## When to use it

- Displaying a National Identity Card (NIC) number from Sri Lanka. Printed on the National Identity Card issued by the Department for Registration of Persons, and asked for by banks, employers and state services.

## When not to use it

- Use `SriLankaNationalIdentityCardInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)
