# LietuvaAsmensKodasView

A headless read-only display for Lithuania's Asmens kodas. Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Lithuania's Asmens kodas read-only.

## When to use it

- Displaying a Lithuania Asmens kodas.

## When not to use it

- Use `LietuvaAsmensKodasInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Lithuania
