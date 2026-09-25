# NihonKojinBangoView

A headless read-only display for Japan's Individual Number / My Number (マイナンバー). Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).

## What it is

A React 19 component that renders an inline `<span>` for displaying Japan's Individual Number / My Number (マイナンバー) read-only.

## When to use it

- Displaying a Individual Number / My Number for Japan.

## When not to use it

- Use `NihonKojinBangoInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Individual_Number
