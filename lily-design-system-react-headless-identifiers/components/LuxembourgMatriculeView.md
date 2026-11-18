# LuxembourgMatriculeView

A headless read-only display for Luxembourg's Matricule National. Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.

## What it is

A React 19 component that renders an inline `<span>` for displaying Luxembourg's Matricule National read-only.

## When to use it

- Displaying a Luxembourg Matricule National. Printed on the Luxembourg eID card and required for CCSS (Centre commun de la sécurité sociale) health-insurance registration, tax, and social-security records.

## When not to use it

- Use `LuxembourgMatriculeInput` for the editable input counterpart.

## References

- https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html
