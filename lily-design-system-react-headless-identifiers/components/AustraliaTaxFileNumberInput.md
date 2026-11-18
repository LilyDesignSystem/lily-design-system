# AustraliaTaxFileNumberInput

A headless input for Australia's Tax File Number (TFN). Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Australia's Tax File Number (TFN).

## When to use it

- Forms collecting a Australia Tax File Number (TFN). Shown on the Australian Taxation Office notice of assessment, payment summaries and superannuation statements; not printed on a card.

## When not to use it

- Use `AustraliaTaxFileNumberView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Tax_file_number
