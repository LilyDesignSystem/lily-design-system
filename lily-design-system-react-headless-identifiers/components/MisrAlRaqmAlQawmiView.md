# MisrAlRaqmAlQawmiView

A headless read-only display for Egypt's National Number (الرقم القومي). Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Egypt's National Number (الرقم القومي) read-only.

## When to use it

- Displaying a Egypt National Number (الرقم القومي). Printed on the Egyptian National Identity Card (بطاقة الرقم القومي) issued by Egypt's Civil Status Organization, and required for both public and private health-insurance and healthcare-facility registration.

## When not to use it

- Use `MisrAlRaqmAlQawmiInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card
