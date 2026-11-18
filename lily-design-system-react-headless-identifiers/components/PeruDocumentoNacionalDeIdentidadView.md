# PeruDocumentoNacionalDeIdentidadView

A headless read-only display for Peru's Documento Nacional de Identidad (DNI). Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.

## What it is

A React 19 component that renders an inline `<span>` for displaying Peru's Documento Nacional de Identidad (DNI) read-only.

## When to use it

- Displaying a Documento Nacional de Identidad (DNI) from Peru. Printed on the front of the DNI card issued by RENIEC, and asked for in almost every dealing with the state, a bank or a health service.

## When not to use it

- Use `PeruDocumentoNacionalDeIdentidadInput` for the editable input counterpart.

## References

- https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)
