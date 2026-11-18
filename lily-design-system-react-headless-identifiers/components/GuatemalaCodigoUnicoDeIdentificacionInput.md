# GuatemalaCodigoUnicoDeIdentificacionInput

A headless input for Guatemala's Código Único de Identificación (CUI). Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Guatemala's Código Único de Identificación (CUI).

## When to use it

- Forms collecting a Código Único de Identificación (CUI) from Guatemala. Printed on the front of the Documento Personal de Identificación (DPI) issued by RENAP, and given at birth registration.

## When not to use it

- Use `GuatemalaCodigoUnicoDeIdentificacionView` for the read-only display counterpart.

## References

- https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf
