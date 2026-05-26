# LietuvaAsmensKodasInput

A headless input for Lithuania's Asmens kodas. Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Lithuania's Asmens kodas.

## When to use it

- Forms collecting a Lithuania Asmens kodas.

## When not to use it

- Use `LietuvaAsmensKodasView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Lithuania
