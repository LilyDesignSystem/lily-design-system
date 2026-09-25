# AotearoaNationalHealthIndexView

A headless read-only display for New Zealand's National Health Index (NHI) Number. Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.

## What it is

A React 19 component that renders an inline `<span>` for displaying New Zealand's National Health Index (NHI) Number read-only.

## When to use it

- Displaying a National Health Index Number for New Zealand.

## When not to use it

- Use `AotearoaNationalHealthIndexInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/NHI_Number
