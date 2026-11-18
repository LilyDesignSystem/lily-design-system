# TurkiyeTcKimlikNumarasiView

A headless read-only display for Turkey's T.C. Kimlik Numarası. Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) x 7) plus ((sum of digits 2,4,6,8) x 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.

## What it is

A React 19 component that renders an inline `<span>` for displaying Turkey's T.C. Kimlik Numarası read-only.

## When to use it

- Displaying a Turkey T.C. Kimlik Numarası. Printed on the Turkish national identity card (T.C. Kimlik Kartı) and required to register with SGK (Sosyal Güvenlik Kurumu), Turkey's Social Security Institution, for health coverage.

## When not to use it

- Use `TurkiyeTcKimlikNumarasiInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Turkish_Identification_Number
