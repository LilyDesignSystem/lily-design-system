# EcuadorCedulaDeIdentidadView

A headless read-only display for Ecuador's Cedula de Identidad Number. Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.

## What it is

A React 19 component that renders an inline `<span>` for displaying Ecuador's Cedula de Identidad Number read-only.

## When to use it

- Displaying a Ecuador Cedula de Identidad Number. Printed on the Cédula de Identidad issued by the Registro Civil, and asked for by the IESS social-security institute, banks and government services.

## When not to use it

- Use `EcuadorCedulaDeIdentidadInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad
