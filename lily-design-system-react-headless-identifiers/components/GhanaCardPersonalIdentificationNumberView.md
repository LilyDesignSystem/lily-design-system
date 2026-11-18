# GhanaCardPersonalIdentificationNumberView

A headless read-only display for Ghana's Ghana Card PIN. Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.

## What it is

A React 19 component that renders an inline `<span>` for displaying Ghana's Ghana Card PIN read-only.

## When to use it

- Displaying a Ghana Card PIN from Ghana. Printed on the Ghana Card issued by the National Identification Authority (NIA); it is also the personal tax number (TIN) used by the Ghana Revenue Authority.

## When not to use it

- Use `GhanaCardPersonalIdentificationNumberInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Ghana_Card
