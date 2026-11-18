# SuomiHenkilotunnusView

A headless read-only display for Finland's Henkilötunnus (HETU). Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## What it is

A React 19 component that renders an inline `<span>` for displaying Finland's Henkilötunnus (HETU) read-only.

## When to use it

- Displaying a Finland Henkilötunnus.

## When not to use it

- Use `SuomiHenkilotunnusInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
