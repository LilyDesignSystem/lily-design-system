# TurkiyeTcKimlikNumarasiInput

A headless input for Turkey's T.C. Kimlik Numarası. Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) x 7) plus ((sum of digits 2,4,6,8) x 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Turkey's T.C. Kimlik Numarası.

## When to use it

- Forms collecting a Turkey T.C. Kimlik Numarası. Printed on the Turkish national identity card (T.C. Kimlik Kartı) and required to register with SGK (Sosyal Güvenlik Kurumu), Turkey's Social Security Institution, for health coverage.

## When not to use it

- Use `TurkiyeTcKimlikNumarasiView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Turkish_Identification_Number
