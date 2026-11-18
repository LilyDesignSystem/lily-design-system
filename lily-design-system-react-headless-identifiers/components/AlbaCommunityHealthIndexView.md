# AlbaCommunityHealthIndexView

A headless read-only display for Scotland's Community Health Index (CHI). Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Scotland's Community Health Index (CHI) read-only.

## When to use it

- Displaying a Scotland Community Health Index.

## When not to use it

- Use `AlbaCommunityHealthIndexInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_Health_Service_Central_Register
