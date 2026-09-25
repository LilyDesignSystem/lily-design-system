# AotearoaNationalHealthIndexInput

A headless input for New Zealand's National Health Index (NHI) Number. Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.

## What it is

A React 19 component that renders a native `<input type="text">` for entering New Zealand's National Health Index (NHI) Number.

## When to use it

- Forms collecting a National Health Index Number for New Zealand.

## When not to use it

- Use `AotearoaNationalHealthIndexView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/NHI_Number
