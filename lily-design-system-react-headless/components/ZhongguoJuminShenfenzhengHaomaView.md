# ZhongguoJuminShenfenzhengHaomaView

A headless read-only display for China's Resident Identity Card Number (居民身份证号码). Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits -- a value of 10 is written as the letter X.

## What it is

A React 19 component that renders an inline `<span>` for displaying China's Resident Identity Card Number (居民身份证号码) read-only.

## When to use it

- Displaying a China Resident Identity Card Number (居民身份证号码). Printed on the Resident Identity Card (居民身份证) and required for essentially all administrative services in China, including medical insurance enrolment.

## When not to use it

- Use `ZhongguoJuminShenfenzhengHaomaInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Resident_Identity_Card
