# ColombiaCedulaDeCiudadaniaInput

A headless input for Colombia's Cedula de Ciudadania Number. Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Colombia's Cedula de Ciudadania Number.

## When to use it

- Forms collecting a Colombia Cedula de Ciudadania Number. Printed on the Cédula de Ciudadanía issued by the Registraduría Nacional del Estado Civil, and asked for by EPS health-insurance providers, banks and government services.

## When not to use it

- Use `ColombiaCedulaDeCiudadaniaView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Colombian_identity_card
