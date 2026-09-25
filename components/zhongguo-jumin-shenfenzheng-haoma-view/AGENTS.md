# ZhongguoJuminShenfenzhengHaomaView

## Metadata

- Component: zhongguo-jumin-shenfenzheng-haoma-view
- PascalCase: ZhongguoJuminShenfenzhengHaomaView
- Description: a read-only display of China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .zhongguo-jumin-shenfenzheng-haoma-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `zhongguo-jumin-shenfenzheng-haoma-view`
- Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="zhongguo-jumin-shenfenzheng-haoma-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .zhongguo-jumin-shenfenzheng-haoma-view in css-style-sheet-template.css
- Companion: ZhongguoJuminShenfenzhengHaomaInput
- Wikipedia: [Resident Identity Card](https://en.wikipedia.org/wiki/Resident_Identity_Card)
