# ArgentinaCodigoUnicoDeIdentificacionLaboralInput

A headless input for Argentina's Código Único de Identificación Laboral (CUIL). Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Argentina's Código Único de Identificación Laboral (CUIL).

## When to use it

- Forms collecting a Argentina Código Único de Identificación Laboral (CUIL). Printed on the CUIL confirmation letter issued by ANSES, and required to register with an obra social (health-insurance fund) and for all employment and pension records.

## When not to use it

- Use `ArgentinaCodigoUnicoDeIdentificacionLaboralView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral
