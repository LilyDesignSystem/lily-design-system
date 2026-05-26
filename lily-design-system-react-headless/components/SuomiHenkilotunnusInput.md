# SuomiHenkilotunnusInput

A headless input for Finland's Henkilötunnus (HETU). Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Finland's Henkilötunnus (HETU).

## When to use it

- Forms collecting a Finland Henkilötunnus.

## When not to use it

- Use `SuomiHenkilotunnusView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
