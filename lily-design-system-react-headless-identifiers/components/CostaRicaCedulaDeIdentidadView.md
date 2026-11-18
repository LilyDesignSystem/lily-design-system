# CostaRicaCedulaDeIdentidadView

A headless read-only display for Costa Rica's Cédula de Identidad. Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.

## What it is

A React 19 component that renders an inline `<span>` for displaying Costa Rica's Cédula de Identidad read-only.

## When to use it

- Displaying a Cédula de Identidad from Costa Rica. Printed on the cédula issued by the Tribunal Supremo de Elecciones, and used for tax, banking and health services.

## When not to use it

- Use `CostaRicaCedulaDeIdentidadInput` for the editable input counterpart.

## References

- https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)
