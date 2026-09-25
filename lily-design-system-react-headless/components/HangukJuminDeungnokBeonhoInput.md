# HangukJuminDeungnokBeonhoInput

A headless input for South Korea's Resident Registration Number (주민등록번호). Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.

## What it is

A React 19 component that renders a native `<input type="text">` for entering South Korea's Resident Registration Number (주민등록번호).

## When to use it

- Forms collecting a Resident Registration Number for South Korea.

## When not to use it

- Use `HangukJuminDeungnokBeonhoView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Resident_registration_number
