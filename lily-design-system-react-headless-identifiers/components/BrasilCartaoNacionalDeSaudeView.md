# BrasilCartaoNacionalDeSaudeView

A headless read-only display for Brazil's Cartão Nacional de Saúde (CNS). Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.

## What it is

A React 19 component that renders an inline `<span>` for displaying Brazil's Cartão Nacional de Saúde (CNS) read-only.

## When to use it

- Displaying a Cartão Nacional de Saúde for Brazil.

## When not to use it

- Use `BrasilCartaoNacionalDeSaudeInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/CPF_number
