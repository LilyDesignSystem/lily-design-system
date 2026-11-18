# LuxembourgMatriculeInput

A headless input for Luxembourg's Matricule National. Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Luxembourg's Matricule National.

## When to use it

- Forms collecting a Luxembourg Matricule National. Printed on the Luxembourg eID card and required for CCSS (Centre commun de la sécurité sociale) health-insurance registration, tax, and social-security records.

## When not to use it

- Use `LuxembourgMatriculeView` for the read-only display counterpart.

## References

- https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html
