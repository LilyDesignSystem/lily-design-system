# AlbaCommunityHealthIndexInput

A headless input for Scotland's Community Health Index (CHI). Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Scotland's Community Health Index (CHI).

## When to use it

- Forms collecting a Scotland Community Health Index.

## When not to use it

- Use `AlbaCommunityHealthIndexView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_Health_Service_Central_Register
