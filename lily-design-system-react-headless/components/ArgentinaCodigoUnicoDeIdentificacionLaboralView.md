# ArgentinaCodigoUnicoDeIdentificacionLaboralView

A headless read-only display for Argentina's Código Único de Identificación Laboral (CUIL). Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.

## What it is

A React 19 component that renders an inline `<span>` for displaying Argentina's Código Único de Identificación Laboral (CUIL) read-only.

## When to use it

- Displaying a Argentina Código Único de Identificación Laboral (CUIL). Printed on the CUIL confirmation letter issued by ANSES, and required to register with an obra social (health-insurance fund) and for all employment and pension records.

## When not to use it

- Use `ArgentinaCodigoUnicoDeIdentificacionLaboralInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral
