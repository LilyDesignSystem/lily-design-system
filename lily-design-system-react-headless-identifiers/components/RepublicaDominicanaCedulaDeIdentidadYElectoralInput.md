# RepublicaDominicanaCedulaDeIdentidadYElectoralInput

A headless input for the Dominican Republic's Cédula de Identidad y Electoral. Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.

## What it is

A React 19 component that renders a native `<input type="text">` for entering the Dominican Republic's Cédula de Identidad y Electoral.

## When to use it

- Forms collecting a Cédula de Identidad y Electoral from the Dominican Republic. Printed on the cédula issued by the Junta Central Electoral, and used to vote, to open a bank account and as the personal tax number.

## When not to use it

- Use `RepublicaDominicanaCedulaDeIdentidadYElectoralView` for the read-only display counterpart.

## References

- https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)
