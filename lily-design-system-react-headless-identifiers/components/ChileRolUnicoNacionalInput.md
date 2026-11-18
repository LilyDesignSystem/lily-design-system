# ChileRolUnicoNacionalInput

A headless input for Chile's Rol Único Nacional (RUN). Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Chile's Rol Único Nacional (RUN).

## When to use it

- Forms collecting a Chile Rol Único Nacional (RUN). Printed on the Cédula de Identidad national ID card and required to register with FONASA (Fondo Nacional de Salud), Chile's public health-insurance fund, or a private Isapre.

## When not to use it

- Use `ChileRolUnicoNacionalView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/RUT
