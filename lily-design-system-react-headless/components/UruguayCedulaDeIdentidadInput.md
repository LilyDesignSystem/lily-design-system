# UruguayCedulaDeIdentidadInput

A headless input for Uruguay's Cedula de Identidad Number. Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).

## What it is

A React 19 component that renders a native `<input type="text">` for entering Uruguay's Cedula de Identidad Number.

## When to use it

- Forms collecting a Uruguay Cedula de Identidad Number. Printed on the Cédula de Identidad issued by the Dirección Nacional de Identificación Civil, and asked for by health providers (ASSE and mutualistas), banks and government services.

## When not to use it

- Use `UruguayCedulaDeIdentidadView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad
