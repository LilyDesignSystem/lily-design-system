# PeruDocumentoNacionalDeIdentidadInput

A headless input for Peru's Documento Nacional de Identidad (DNI). Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Peru's Documento Nacional de Identidad (DNI).

## When to use it

- Forms collecting a Documento Nacional de Identidad (DNI) from Peru. Printed on the front of the DNI card issued by RENIEC, and asked for in almost every dealing with the state, a bank or a health service.

## When not to use it

- Use `PeruDocumentoNacionalDeIdentidadView` for the read-only display counterpart.

## References

- https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)
