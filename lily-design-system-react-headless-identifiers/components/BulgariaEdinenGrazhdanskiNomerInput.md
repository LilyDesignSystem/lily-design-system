# BulgariaEdinenGrazhdanskiNomerInput

A headless input for Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN). Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).

## When to use it

- Forms collecting a Bulgaria Единен граждански номер / Edinen grazhdanski nomer.

## When not to use it

- Use `BulgariaEdinenGrazhdanskiNomerView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Unique_citizenship_number
