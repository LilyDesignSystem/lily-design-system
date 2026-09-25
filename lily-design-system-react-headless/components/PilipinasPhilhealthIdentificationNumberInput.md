# PilipinasPhilhealthIdentificationNumberInput

A headless input for the Philippines's PhilHealth Identification Number (PIN). Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.

## What it is

A React 19 component that renders a native `<input type="text">` for entering the Philippines's PhilHealth Identification Number (PIN).

## When to use it

- Forms collecting a PhilHealth Identification Number for the Philippines.

## When not to use it

- Use `PilipinasPhilhealthIdentificationNumberView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/PhilHealth
